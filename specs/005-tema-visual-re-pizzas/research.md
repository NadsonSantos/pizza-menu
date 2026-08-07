# Research: Tema Visual Rê Pizza's

## 1. Tailwind CSS 4 `@theme` Directive

**Decision**: Usar `@theme` no `src/index.css` para definir os design tokens `brand` e `accent`.

**Rationale**: Tailwind CSS 4 (via `@tailwindcss/vite`) suporta `@theme` para criação de custom design tokens que geram automaticamente classes utilitárias (`bg-brand-500`, `text-brand-600`, etc.) e são referenciáveis via `var(--color-brand-500)` no CSS. É o mecanismo oficial, zero-config, sem necessidade de `tailwind.config.js`.

**Syntax**:
```css
@import "tailwindcss";

@theme {
  --color-brand-50: #FFF6EC;
  --color-brand-100: #FDE4CE;
  --color-brand-200: #FAC89A;
  --color-brand-300: #F7AB65;
  --color-brand-400: #F48F32;
  --color-brand-500: #EF8A1F;
  --color-brand-600: #C96F16;
  --color-brand-700: #A05410;
  --color-brand-800: #783C0F;
  --color-brand-900: #502807;
  --color-accent-cheese: #F6C453;
  --color-accent-pepperoni: #D8492F;
  --color-accent-tomato: #E2664A;
  --color-accent-basil: #5B8C4A;
}
```

**Alternatives considered**:
- `tailwind.config.js` com `theme.extend.colors` — NÃO funciona com Tailwind 4 + `@tailwindcss/vite`; o plugin Vite ignora `tailwind.config.js`.
- CSS custom properties manuais (`:root { --brand-500: ... }`) — funcionaria, mas não geraria classes utilitárias, forçando uso de `style` inline ou `var()` em cada componente.

**Verification**: `npm run build` deve gerar CSS com as variáveis `--color-brand-*` e classes utilitárias correspondentes.

## 2. Mapeamento `red-*` → `brand-*`

**Decision**: Substituição direta 1:1 conforme tabela da spec.

**Rationale**: As cores `red-*` do Tailwind têm esquema de numeração 50–900 idêntico ao planejado para `brand-*`. O mapeamento semântico é direto:

| Tailwind Red | Tailwind Brand | Hex Brand |
|---|---|---|
| `red-50` (#fef2f2) | `brand-50` | #FFF6EC |
| `red-500` (#ef4444) | `brand-500` | #EF8A1F |
| `red-600` (#dc2626) | `brand-600` | #C96F16 |
| `red-700` (#b91c1c) | `brand-700` | #A05410 |

**Scope**: 39 ocorrências em 13 arquivos `.tsx` + 1 em `vite.config.ts` (`theme_color`).

**Alternatives considered**:
- Regex global find-replace — rejeitado: substituir cegamente `red-` por `brand-` quebraria classes como `ring-red-500/30` (opacidade).
- Refatoração individual por componente — escolhido: cada arquivo revisado manualmente para garantir que apenas cores de tema são alteradas (bordas `gray-*` permanecem).

## 3. Splash Page Implementation

**Decision**: Componente `SplashScreen.tsx` com `sessionStorage` flag, timeout de 2s, fade-out CSS.

**Rationale**: Abordagem mais simples e sem dependências externas:
- `sessionStorage.getItem('splash_shown')` — se `null`, mostrar splash
- `setTimeout` de 2000ms + classe CSS `opacity-0 transition-opacity duration-500` para fade
- Após transição, `sessionStorage.setItem('splash_shown', '1')` e renderizar `<Outlet />`
- Imagem com `onError` → fallback textual "Rê Pizza's"

**Integration point**: `App.tsx` — condicional no elemento raiz ou wrapper de rota:
```tsx
// Opção A: SplashScreen como wrapper condicional antes de <Routes>
// Opção B: Rota "/" condicional que transiciona para MenuPage
```

**Alternatives considered**:
- CSS animation apenas — rejeitado: não dá controle sobre quando remover o splash do DOM.
- `localStorage` — rejeitado: o splash deve reaparecer ao reabrir o navegador (nova sessão), o que `sessionStorage` garante naturalmente.
- React Router loader/action — rejeitado: overkill para uma flag booleana.

## 4. Contraste e Acessibilidade

**Decision**: `brand-500` (#EF8A1F) com texto branco tem razão de contraste ~3.1:1 — aceitável para botões (elementos de UI), mas no limite para WCAG AA.

**Rationale**: O spec registra essa limitação. Se no futuro for exigido WCAG AA estrito para texto pequeno:
- Usar `brand-600` (#C96F16) como cor de botão primário
- OU usar `text-brand-900` em vez de `text-white` em botões

**No action required now** — registrado como dívida técnica conhecida.
