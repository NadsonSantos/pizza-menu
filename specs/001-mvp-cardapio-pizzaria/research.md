# Research & Decisions: MVP Cardápio Digital de Pizzaria

**Feature**: `001-mvp-cardapio-pizzaria`
**Date**: 2025-07-28

## Decisions

### 1. Build Tool: Vite

**Decision**: Vite 5

**Rationale**: Vite é o build tool mais rápido para desenvolvimento React moderno. HMR instantâneo, suporte nativo a TypeScript, e o ecossistema de plugins (vite-plugin-pwa) é maduro. Comparado a Create React App (deprecated) e Next.js (overkill para SPA estática), Vite é a escolha mais simples que atende todos os requisitos.

**Alternatives considered**:
- Create React App: Deprecated, lento, configuração de PWA mais frágil.
- Next.js: Overkill. Adiciona SSR/SSG desnecessários para um site 100% estático. Pior para mobile-first puro.
- Parcel: Menos maduro para TypeScript + PWA.

---

### 2. Styling: Tailwind CSS

**Decision**: Tailwind CSS 3 (via `@tailwindcss/vite` plugin)

**Rationale**: Tailwind força mobile-first por padrão com utilitários responsivos. Sem CSS customizado para manter — reduz superfície de bugs. O dono da pizzaria não vai editar CSS, então classes utilitárias no JSX são adequadas. Bundle final é pequeno (purge automático remove classes não usadas).

**Alternatives considered**:
- CSS Modules: Mais boilerplate, sem mobile-first forçado.
- Styled Components: Runtime CSS-in-JS adiciona bundle weight desnecessário para SPA simples.
- Vanilla CSS: Mais propenso a inconsistências e classes órfãs.

---

### 3. State Management: React Context + useReducer

**Decision**: Context + useReducer nativos do React, sem libs externas

**Rationale**: O estado do app é simples: um carrinho com itens, modo de entrega, forma de pagamento e troco. Um único reducer cobre todos os casos. Zero dependências externas = menos breaking changes, menos bundle size. Redux/Zustand seriam overengineering para este domínio.

**Alternatives considered**:
- Redux Toolkit: Overkill — boilerplate desproporcional ao tamanho do estado.
- Zustand: Leve mas desnecessário; useContext + useReducer já resolvem.
- Jotai/Recoil: Atômico demais para um estado que é naturalmente centralizado.

---

### 4. PWA: vite-plugin-pwa (Workbox)

**Decision**: vite-plugin-pwa com estratégia `generateSW` (Workbox)

**Rationale**: Integração direta com o pipeline de build do Vite. Gera o Service Worker automaticamente com pre-cache dos assets do bundle. Suporte nativo a `runtimeCaching` para definir estratégia cache-first para o `menu.json`. Manifest gerado inline no `vite.config.ts` — sem arquivos de configuração extras.

**Cache Strategy**:
- Assets estáticos (JS, CSS, fontes, imagens): **CacheFirst** — nunca mudam entre deploys (hash nos nomes).
- `menu.json`: **CacheFirst** — cacheia e serve offline; atualiza quando novo SW detecta mudança.
- HTML (`index.html`): **NetworkFirst** — sempre tenta a rede primeiro para garantir versão mais recente.

**Alternatives considered**:
- Workbox manual: Mais controle, mas mais configuração. Desnecessário para este caso simples.
- `injectManifest`: Requer SW customizado manualmente. Complexidade extra sem benefício claro.

---

### 5. Routing: React Router v6

**Decision**: React Router DOM v6

**Rationale**: 3 rotas simples (Menu, Carrinho, Finalizar) com navegação client-side. React Router é o padrão da comunidade React, bem documentado, sem surpresas. v6 tem API declarativa com `<Routes>` e `<Outlet>` que mapeia bem para layout com header fixo.

**Alternatives considered**:
- TanStack Router: Mais novo, type-safe, mas menos maduro e com comunidade menor.
- Nenhum router (state-based): Funcionaria para 3 views, mas perderia URLs (sem `/carrinho` direto, sem back button nativo).

---

### 6. ID Generation: crypto.randomUUID()

**Decision**: `crypto.randomUUID()` nativo do browser

**Rationale**: Disponível em todos os browsers modernos (Chrome 92+, Safari 15.4+, Firefox 95+). Gera UUIDs v4 para identificar itens do carrinho sem dependência externa. Para browsers antigos (improvável no público-alvo mobile), fallback mínimo com `Date.now() + Math.random()`.

**Alternatives considered**:
- uuid/nanoid packages: Adicionam dependência para uma feature de 1 linha que o browser já oferece nativamente.
- Index incremental: Colapsa se dois itens idênticos são adicionados em sequência.

---

### 7. WhatsApp Integration: wa.me link

**Decision**: Link `https://wa.me/<numero>?text=<mensagem>` em nova aba

**Rationale**: Não requer API key, não requer backend, não requer biblioteca. O link `wa.me` é o método oficial do WhatsApp para iniciar conversas. Abrir em nova aba garante que o cliente volte ao app se desistir. A mensagem é URL-encoded — limite prático de ~4000 caracteres, suficiente para pedidos típicos.

**Message format**: Texto puro com marcação WhatsApp (`*negrito*`, `_itálico_`, emojis nativos). Sem HTML.

**Alternatives considered**:
- WhatsApp Business API: Requer backend, aprovação do Meta, complexidade inviável para MVP.
- Click to Chat widget: Essencialmente o mesmo que `wa.me`, mas com embed — pior experiência mobile.

---

## No-Go Decisions

| Tecnologia | Motivo da rejeição |
|-----------|-------------------|
| Next.js | SSR/SSG overkill para SPA estática; runtime Edge não necessário |
| shadcn/ui / Radix | Component library = dependência pesada; Tailwind puro resolve |
| Redux / Zustand | Estado simples demais para justificar lib externa |
| Supabase / Firebase | Backend — viola princípio I da constituição |
| Stripe / Mercado Pago | Pagamento in-app — viola princípio V da constituição |
