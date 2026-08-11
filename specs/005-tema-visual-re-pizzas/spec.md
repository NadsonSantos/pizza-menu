# Feature Specification: Tema Visual — Identidade Rê Pizza's

**Feature Branch**: `005-tema-visual-re-pizzas`

**Created**: 2025-08-07

**Status**: Draft

**Input**: "Atualize o tema visual do app para seguir a nova identidade da marca Rê Pizza's. Aplique paleta laranja (#EF8A1F), cores de destaque (queijo, pepperoni, molho de tomate, manjericão), bordas arredondadas (rounded-2xl+) e crie uma splash page com a logo."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Sistema de Cores da Marca (Priority: P1) 🎯

Todo o app deve usar exclusivamente as cores da nova identidade visual Rê Pizza's. Cores antigas (red-based) devem ser completamente removidas. As novas cores são definidas como tokens CSS/Tailwind e consumidas por referência — nunca como valores hex hardcoded nos componentes.

Paleta:

| Token | Hex | Uso |
|-------|-----|-----|
| `brand-50` | `#FFF6EC` | Backgrounds suaves (selected state, hover) |
| `brand-100` | `#FDE4CE` | Backgrounds |
| `brand-200` | `#FAC89A` | Backgrounds |
| `brand-300` | `#F7AB65` | Elementos secundários |
| `brand-400` | `#F48F32` | Hover de botões |
| `brand-500` | `#EF8A1F` | Cor primária (botões, links, bordas ativas) |
| `brand-600` | `#C96F16` | Hover escuro de botões |
| `brand-700` | `#A05410` | Texto sobre fundo brand-claro |
| `brand-800` | `#783C0F` | Elementos de destaque |
| `brand-900` | `#502807` | Tipografia em contraste alto |
| `accent-cheese` | `#F6C453` | Ilustrações, badges |
| `accent-pepperoni` | `#D8492F` | Ilustrações, indicadores |
| `accent-tomato` | `#E2664A` | Ilustrações, detalhes |
| `accent-basil` | `#5B8C4A` | Ilustrações, selos |

**Why this priority**: É a fundação de toda a identidade visual. Sem ela, nada mais faz sentido — todas as demais US dependem dos tokens de cor estarem definidos e funcionais.

**Independent Test**: Inspecionar o CSS compilado → confirmar que as variáveis CSS `--color-brand-*` e `--color-accent-*` existem com os valores hex corretos. Nenhum `#ef4444` (red-500 antigo), `#dc2626` (red-600 antigo) ou qualquer cor fora da paleta deve aparecer no bundle CSS.

**Acceptance Scenarios**:

1. **Given** que o arquivo `src/index.css` existe, **When** as diretivas `@theme` são aplicadas com os tokens brand e accent, **Then** o Tailwind gera classes utilitárias `bg-brand-500`, `text-brand-600`, `border-accent-cheese`, etc.
2. **Given** que o tema está aplicado, **When** se faz uma busca textual por `red-` em todos os arquivos `.tsx` e `.css` do projeto, **Then** não há correspondências — nenhum componente referencia cores antigas.
3. **Given** que o tema está aplicado, **When** se inspeciona o botão primário ("Adicionar ao carrinho"), **Then** ele usa `bg-brand-500` (laranja) em vez de `bg-red-600`.

---

### User Story 2 — Atualização de Todos os Componentes (Priority: P1) 🎯

Cada componente existente deve ser atualizado para usar os novos tokens de cor. O mapeamento semântico é:

| Antigo (`red-*`) | Novo (`brand-*`) |
|------------------|-------------------|
| `bg-red-600` | `bg-brand-500` |
| `hover:bg-red-700` | `hover:bg-brand-600` |
| `border-red-500` | `border-brand-500` |
| `bg-red-50` | `bg-brand-50` |
| `text-red-600` | `text-brand-600` |
| `text-red-700` | `text-brand-700` |
| `ring-red-500/30` | `ring-brand-500/30` |
| `ring-red-500/40` | `ring-brand-500/40` |
| `focus:ring-red-500/40` | `focus:ring-brand-500/40` |
| `focus:border-red-400` | `focus:border-brand-400` |

Background da página: `bg-gray-50` → `bg-brand-50` (fundo levemente aquecido).

**Why this priority**: É o grosso do trabalho — sem essa US, o tema existe mas ninguém o vê.

**Independent Test**: Rodar `npm run build` sem erros de TypeScript. Navegar por todas as páginas (Menu, Carrinho, Checkout, Endereços) e verificar visualmente que nenhum elemento vermelho antigo permanece.

**Acceptance Scenarios**:

1. **Given** que o Layout usa `bg-red-600` no header, **When** o tema é aplicado, **Then** o header é `bg-brand-500` com texto branco.
2. **Given** que PizzaCard/FlavorSelector usam `border-red-500 bg-red-50` no estado selected, **When** o tema é aplicado, **Then** usam `border-brand-500 bg-brand-50`.
3. **Given** que o MenuPage usa `bg-red-600 text-white` nas pills de categoria ativa, **When** o tema é aplicado, **Then** usam `bg-brand-500 text-white`.
4. **Given** que PaymentSelector usa `border-red-500 bg-red-50 text-red-700`, **When** o tema é aplicado, **Then** usa `border-brand-500 bg-brand-50 text-brand-700`.
5. **Given** que CartSummary exibe o total com `text-red-600`, **When** o tema é aplicado, **Then** usa `text-brand-600`.
6. **Given** que MenuPage exibe preços das categorias com `text-red-600`, **When** o tema é aplicado, **Then** usa `text-brand-600`.
7. **Given** que o DrinkCard e demais componentes de borda usam `border-gray-200`, **When** o tema é aplicado, **Then** mantêm bordas neutras (gray não é removido, apenas red é substituído).

---

### User Story 3 — Splash Page com Logo (Priority: P2)

Ao acessar a raiz do app (`/`), o usuário vê uma tela de splash por 2 segundos com a logo da Rê Pizza's (`public/splash_logo.jpeg`) centralizada, seguida de uma transição suave (fade) para a página do cardápio. O splash só aparece na primeira carga da sessão (não em navegações internas via React Router).

**Why this priority**: É a "porta de entrada" da marca — importante para a identidade visual, mas não bloqueia o fluxo principal de compra.

**Independent Test**: Abrir o app em uma janela anônima → ver splash com logo centralizada por ~2s → fade para o cardápio. Navegar para outra página e voltar ao `/` via Link interno → NÃO ver o splash novamente.

**Acceptance Scenarios**:

1. **Given** que o app é carregado pela primeira vez (sessionStorage sem flag), **When** a rota `/` é acessada, **Then** a splash page é exibida com a logo centralizada e um spinner/indicador sutil.
2. **Given** que a splash page está visível, **When** 2 segundos se passam, **Then** ocorre um fade-out de 500ms revelando a MenuPage.
3. **Given** que o splash já foi exibido nesta sessão, **When** o usuário navega de `/carrinho` para `/` via Link, **Then** a MenuPage é exibida diretamente, sem splash.
4. **Given** que a imagem `splash_logo.jpeg` não carrega (erro de rede), **When** o splash renderiza, **Then** exibe um fallback textual "Rê Pizza's" centralizado, sem quebrar o fluxo.
5. **Given** que o usuário está no mobile (375px), **When** a splash page renderiza, **Then** a logo é dimensionada adequadamente (max-w-[200px]) e todo conteúdo permanece visível sem scroll.

---

### User Story 4 — Atualização do Nome da Pizzaria (Priority: P2)

O arquivo `public/menu.json` deve refletir o novo nome da marca: de "Pizza do Bairro" para "Rê Pizza's".

**Why this priority**: Ajuste de dados — rápido e independente, mas sem impacto se as outras US não forem feitas.

**Independent Test**: Conferir `menu.json` → campo `pizzaria.nome` é "Rê Pizza's". O header do app exibe "Rê Pizza's" em vez de "🍕 Cardápio Digital".

**Acceptance Scenarios**:

1. **Given** que `menu.json` tem `"nome": "Pizza do Bairro"`, **When** a atualização é aplicada, **Then** passa a ser `"nome": "Rê Pizza's"`.
2. **Given** que o Layout renderiza o nome da pizzaria, **When** o menu é carregado, **Then** o header exibe "Rê Pizza's" com o nome vindo de `menu.json` (não hardcoded).

---

### Edge Cases

- **Contraste em botão brand-500 com texto branco**: O laranja `#EF8A1F` com texto branco tem razão de contraste de ~3.1:1 (WCAG AA para texto grande). Para botões com texto pequeno (14px), usar `text-white font-semibold` é aceitável por serem elementos de UI (não corpo de texto), mas a spec registra que está no limite. Se no futuro houver exigência de acessibilidade estrita, considerar `brand-600` (#C96F16) como cor de botão.
- **Tema dark mode**: Fora de escopo. O app não tem dark mode e esta spec não o introduz.
- **Componentes que referenciam `red-*` em lógica condicional**: Além das classes Tailwind, verificar se há strings literais "red" em objetos de estilo ou funções utilitárias.
- **Cache do Service Worker**: Após o deploy, clientes com o SW antigo podem ver o tema antigo até a atualização do cache. O PWA já possui estratégia de atualização — isso é comportamento esperado, não bug.
- **Splash page + PWA offline**: A splash page deve funcionar offline (a logo está no `public/`, portanto é cacheada pelo service worker). Se a logo falhar no offline, o fallback textual cobre o caso.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE definir tokens de cor `brand` (50–900) e `accent` (cheese, pepperoni, tomato, basil) via `@theme` no CSS do Tailwind 4.
- **FR-002**: O sistema DEVE substituir todas as ocorrências de classes `red-*` por suas equivalentes `brand-*` em todos os componentes `.tsx`.
- **FR-003**: O sistema DEVE manter classes `gray-*` inalteradas (bordas neutras, textos secundários, backgrounds de skeleton).
- **FR-004**: O sistema DEVE exibir uma splash page na primeira carga da sessão, com duração de 2s + fade-out de 500ms.
- **FR-005**: O sistema DEVE usar `sessionStorage` para controlar se o splash já foi exibido na sessão atual.
- **FR-006**: O sistema DEVE carregar a logo de `public/splash_logo.jpeg` com fallback textual "Rê Pizza's" em caso de erro.
- **FR-007**: O sistema DEVE atualizar `pizzaria.nome` em `public/menu.json` para "Rê Pizza's".
- **FR-008**: O header do Layout DEVE exibir o nome da pizzaria a partir de `menu.json`, não de string hardcoded.
- **FR-009**: O sistema DEVE passar em `npm run build` (tsc + vite build) sem erros após todas as alterações.

### Key Entities

- **Design tokens**: Definições de cor no CSS (`@theme`) que o Tailwind expande em utilitários. São a única fonte de verdade para cores — componentes referenciam tokens, não hex codes.
- **Splash state**: Flag booleana em `sessionStorage` (`splash_shown`) que controla se o splash já foi exibido. Efêmera — morre quando a sessão do navegador termina.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero ocorrências de classes `red-*` em arquivos `.tsx` e `.css` após a conclusão (verificável via grep).
- **SC-002**: `npm run build` conclui com sucesso (exit code 0) sem warnings de TypeScript.
- **SC-003**: Splash page renderiza em ≤ 500ms em mobile 3G (a logo já está no `public/`, cacheada).
- **SC-004**: Transição splash → cardápio é suave (60fps) em dispositivo mobile médio (Moto G4, Chrome DevTools).
- **SC-005**: Contraste de texto em botões brand-500 atinge pelo menos 3:1 (verificável via axe DevTools ou Lighthouse).

## Assumptions

- O arquivo `public/splash_logo.jpeg` já existe e está no formato correto. Esta spec não cobre criação ou edição da imagem.
- Tailwind CSS 4 com `@tailwindcss/vite` (já instalado) suporta `@theme` para definição de design tokens — não é necessário migrar para outra versão.
- A pizzaria aprovou a paleta de cores e o conceito da splash page (esta spec é a formalização do que foi solicitado).
- O Service Worker existente (vite-plugin-pwa) continuará cacheando os assets em `public/` sem alterações — zero mudanças na configuração de PWA.
- A splash page usa `sessionStorage`, não `localStorage`, então reaparece se o usuário fechar e reabrir o navegador, mas não em navegações internas — este é o comportamento desejado.
- "Primeira carga da sessão" significa primeira vez que o app monta no ciclo de vida da aba — recarregar a página (F5) conta como nova sessão e reexibe o splash. Isso é aceitável e esperado.
