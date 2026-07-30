# Tasks: Fluxo Único de Cardápio com Montagem Cross-Categoria

**Input**: Design documents from `specs/003-fluxo-cardapio-unico/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Not requested. Validation is manual + build verification.

**Organization**: Tasks grouped by functional domain.

## Format: `- [ ] [TaskID] [P?] Description with file path`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)

---

## Phase 1: Dados — Renomear Categoria

**Goal**: Nome da primeira categoria muda de "Tradicionais" para "Simples" conforme stakeholder.

**Independent Test**: App exibe "Simples" no lugar de "Tradicionais".

### Tasks

- [ ] T060 [P] Alterar `nome` da categoria `"tradicionais"` para `"Simples"` em `public/menu.json` — apenas o campo `nome` muda, o `id` permanece `"tradicionais"`

### 🛑 Phase 1 Validation

```
Abrir app → primeira categoria exibe "Simples" com preço R$30
Navegar → sabores da categoria "Simples" aparecem corretamente
```

---

## Phase 2: MenuPage — Página Única com Sticky Nav

**Goal**: `MenuPage` reescrita para exibir todas as categorias em seções verticais com sticky nav, scroll suave e destaque ativo via IntersectionObserver.

**Independent Test**: Scroll revela todas as categorias. Clicar em link → scroll suave. Destaque acompanha scroll.

### Tasks

- [ ] T061 Reescrever `src/pages/MenuPage.tsx`:
  - Categorias viram `<section id="cat-{id}">` com título + grid de sabores
  - Sticky nav com `position: sticky`, `top-0`, `z-50`
  - Cada link do nav chama `document.getElementById('cat-{id}').scrollIntoView({ behavior: 'smooth' })`
  - `IntersectionObserver` com `rootMargin: '-40% 0px -55% 0px'` destaca link ativo
  - Bebidas mantidas como seção final
- [ ] T062 [P] Remover tabs `activeTab`/`setActiveTab` — toda a lógica de alternância por abas não é mais necessária

### 🛑 Phase 2 Validation

```
Abrir app → 3 seções visíveis (Simples, Especiais, Sensacionais)
Clicar "Sensacionais" no sticky nav → scroll suave até Sensacionais
Scroll manual → link ativo no nav muda conforme a seção
Sticky nav permanece fixo no topo durante scroll
```

---

## Phase 3: PizzaBuilder — Desacoplado de Categoria

**Goal**: `PizzaBuilder` deixa de receber `categoria: Categoria` única e recebe o `menu` inteiro. Botão "Montar Pizza" é único.

**Independent Test**: Clicar "Montar Pizza" a partir de qualquer sabor → seletor mostra sabores de todas as categorias.

### Tasks

- [ ] T063 [P] Modificar `src/components/PizzaBuilder.tsx`:
  - Remover `categoria: Categoria` da Props, receber apenas `onClose`
  - Obter `menu` via `useMenu()`
  - Passar `menu.categorias` e `menu.sabores` para `FlavorSelector`
- [ ] T064 [P] Remover `setPizzaBuilderCat` do `MenuPage.tsx` — em vez de abrir PizzaBuilder por categoria, ter UM único botão "Montar Pizza"

### 🛑 Phase 3 Validation

```
Clicar em qualquer card de sabor → PizzaBuilder abre com sabores de TODAS as categorias
Verificar que os sabores estão agrupados visualmente
```

---

## Phase 4: FlavorSelector — Sabores de Todas as Categorias

**Goal**: `FlavorSelector` exibe sabores agrupados por categoria com badges. Limite de 3 mantido.

**Independent Test**: Selecionar sabores de 3 categorias diferentes → preço calculado pela mais cara.

### Tasks

- [ ] T065 [P] Modificar `src/components/FlavorSelector.tsx`:
  - Receber `grupos: { categoria: Categoria; sabores: Sabor[] }[]` em vez de `sabores: Sabor[]`
  - Renderizar cada grupo com cabeçalho (nome da categoria + preço)
  - Cada card de sabor exibe badge com nome da categoria
  - Manter limite de 3 sabores e acréscimo de R$5
- [ ] T066 [P] Adicionar helper `getCategoriaNome(id: string): string` em `src/context/MenuContext.tsx` para components exibirem badge

### 🛑 Phase 4 Validation

```
Abrir PizzaBuilder → sabores agrupados por categoria com badges
Selecionar Calabresa (Simples) + Frango Catupiry (Especial) + 4 Queijos (Sensacional)
→ Preço = R$45 (R$40 + R$5)
→ Cada card exibe badge da categoria
Observação e demais campos funcionando
```

---

## Phase 5: Validação Final

**Goal**: Build limpo, verificação de regressão.

**Independent Test**: `npm run build`. Carrinho, checkout, WhatsApp funcionam.

### Tasks

- [ ] T067 Build: `npx tsc --noEmit && npm run build`
- [ ] T068 Verificar regressão: carrinho, checkout, WhatsApp, PWA — nada quebrado
- [ ] T069 Verificar SC-001 a SC-006 contra a spec

### 🛑 Phase 5 Validation

```bash
npm run build   # Build limpo
```

---

## Dependencies & Execution Order

```
Phase 1 (Dados) ─────────────────────────────────────────────────────────────►
      │
      ▼
Phase 2 (MenuPage) ──────────────────────────────────────────────────────────►
      │
      ▼
Phase 3 (PizzaBuilder) ──────────────────────────────────────────────────────►
      │
      ▼
Phase 4 (FlavorSelector) ────────────────────────────────────────────────────►
      │
      ▼
Phase 5 (Validação) ─────────────────────────────────────────────────────────►
```

### Parallel Opportunities

| Phase | Paralelas |
|-------|----------|
| 1 | T060 (única) |
| 2 | T062 pode ser feito em paralelo com T061 |
| 3 | T063 ║ T064 |
| 4 | T065 ║ T066 |
| 5 | Sequencial |

### Files Changed

| Fase | Arquivos |
|------|---------|
| 1 | `public/menu.json` |
| 2 | `src/pages/MenuPage.tsx` |
| 3 | `src/components/PizzaBuilder.tsx` |
| 4 | `src/components/FlavorSelector.tsx`, `src/context/MenuContext.tsx` |
| 5 | — |

### Rollback

`git checkout main -- src/ public/menu.json specs/003-fluxo-cardapio-unico/`
