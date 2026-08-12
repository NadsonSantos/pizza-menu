# Research: Bottom Sheet do Carrinho

**Feature**: `007-bottom-sheet-carrinho` | **Date**: 2026-08-12

## Decision Log

### 1. Animação de Entrada/Saída

**Decision**: Transições CSS pura com classes Tailwind (`transition-all duration-300` + `translate-y`/`opacity`).

**Rationale**:
- A constituição proíbe libs externas de UI (sem framer-motion, react-spring, etc.)
- `transition-all duration-300` do Tailwind atende os 300ms da spec
- O Bottom Sheet é condicional: renderizado quando `itemCount > 0`, não renderizado quando `itemCount === 0`
- Para animação de saída, usar padrão "unmount on transition end": ao detectar `itemCount === 0`, aplicar classe `opacity-0 translate-y-full` e remover do DOM após 300ms via `onTransitionEnd`

**Alternatives considered**:
- **CSSTransition (react-transition-group)**: Adicionaria dependência externa desnecessária para uma transição simples. Rejeitado.
- **Animar apenas via opacity**: Menos natural que slide-up/down. Rejeitado.
- **Headless UI Transition**: Adicionaria lib de componentes. Violaria constituição. Rejeitado.

### 2. Safe Area em Dispositivos com Notch

**Decision**: Usar `pb-safe` e `env(safe-area-inset-bottom)` via Tailwind.

**Rationale**:
- Dispositivos iOS com notch (iPhone X+) e Android com gesture navigation precisam de padding extra
- Tailwind suporta `pb-[env(safe-area-inset-bottom)]` como valor arbitrário
- O projeto já usa Tailwind 3.x+ com suporte a arbitrary values
- O padding da lista de produtos também deve considerar safe area + altura do Bottom Sheet

**Alternatives considered**:
- **CSS `@supports` manual**: Mais verboso, mesmo resultado. Tailwind arbitrary value é mais idiomático no projeto.
- **Ignorar safe area**: Violaria spec (assumption: "O Bottom Sheet respeitará a área segura"). Rejeitado.

### 3. Comunicação Bottom Sheet ↔ MenuPage

**Decision**: Bottom Sheet recebe props do MenuPage (que lê CartContext); padding dinâmico via altura medida com `useRef` + `ResizeObserver`.

**Rationale**:
- CartContext já provê `itemCount`, `total`, `state.items` — não precisa de nova abstração
- MenuPage renderiza o Bottom Sheet condicionalmente baseado em `itemCount`
- O padding-bottom da lista de produtos precisa saber a altura exata do Bottom Sheet renderizado
- `ResizeObserver` no elemento do Bottom Sheet é a forma mais robusta de obter altura real (considera font-size, padding, safe-area dinâmicos)

**Alternatives considered**:
- **Altura fixa (h-16)**: Frágil — não adapta a diferentes tamanhos de fonte/configuração de acessibilidade. Rejeitado.
- **Novo Context para altura**: Overengineering — um único `useRef` + `ResizeObserver` na MenuPage resolve. Rejeitado.
- **CSS `position: sticky` no Bottom Sheet**: Não funciona — precisamos de fixo no viewport, não no fluxo do documento. Rejeitado.

### 4. Navegação para o Carrinho

**Decision**: `useNavigate()` do React Router 6 para `/carrinho`.

**Rationale**:
- A rota `/carrinho` já existe (CartPage)
- React Router 6 já é dependência do projeto
- O Bottom Sheet deve navegar tanto no clique do botão quanto no clique do card inteiro (FR-005, FR-006)

**Alternatives considered**:
- **Window.location**: Quebra SPA navigation, perde estado. Rejeitado.
- **Link component**: Semântico mas desnecessário — o Bottom Sheet inteiro é clicável, não é um link de texto. Rejeitado.

### 5. Contador com Plural Correto

**Decision**: Função utilitária inline: `itemCount === 1 ? '1 item' : '${itemCount} itens'`.

**Rationale**:
- Simples, sem dependência de `Intl.PluralRules` (overkill para português com 2 formas)
- FR-003 exige plural correto — esta abordagem cobre singular/plural em português

**Alternatives considered**:
- **Intl.PluralRules**: Robusto para i18n futura, mas adiciona complexidade desnecessária para um app PT-BR-only. Rejeitado.

### 6. Performance — Atualização < 100ms

**Decision**: Sem memoização explícita — React Context + useReducer já garante re-render apenas nos consumers afetados.

**Rationale**:
- CartContext usa `useReducer` (não `useState`) — dispatches são estáveis
- MenuPage já é consumer do CartContext; Bottom Sheet será filho direto
- O cálculo de `itemCount` e `total` é O(n) sobre `state.items` — para um carrinho típico (< 20 itens), isso é imperceptível
- Se necessário, `useMemo` no CartProvider ou no Bottom Sheet, mas medição deve comprovar necessidade primeiro

**Alternatives considered**:
- **useMemo em todo valor derivado**: Premature optimization, viola princípio de simplicidade. Rejeitado.
- **Selector-based context (useContextSelector)**: Adicionaria complexidade; CartContext é pequeno o suficiente. Rejeitado.
