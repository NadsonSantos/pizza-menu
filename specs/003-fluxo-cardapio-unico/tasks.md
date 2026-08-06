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

- [x] T060 [P] Alterar `nome` da categoria `"tradicionais"` para `"Simples"` em `public/menu.json` — apenas o campo `nome` muda, o `id` permanece `"tradicionais"`

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

- [x] T061 Reescrever `src/pages/MenuPage.tsx`:
  - Categorias viram `<section id="cat-{id}">` com título + grid de sabores
  - Sticky nav com `position: sticky`, `top-0`, `z-50`
  - Cada link do nav chama `document.getElementById('cat-{id}').scrollIntoView({ behavior: 'smooth' })`
  - `IntersectionObserver` com `rootMargin: '-40% 0px -55% 0px'` destaca link ativo
  - Bebidas mantidas como seção final
- [x] T062 [P] Remover tabs `activeTab`/`setActiveTab` — toda a lógica de alternância por abas não é mais necessária

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

- [x] T063 [P] Modificar `src/components/PizzaBuilder.tsx`:
  - Remover `categoria: Categoria` da Props, receber apenas `onClose`
  - Obter `menu` via `useMenu()`
  - Passar `menu.categorias` e `menu.sabores` para `FlavorSelector`
- [x] T064 [P] Remover `setPizzaBuilderCat` do `MenuPage.tsx` — em vez de abrir PizzaBuilder por categoria, ter UM único botão "Montar Pizza"

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

- [x] T065 [P] Modificar `src/components/FlavorSelector.tsx`:
  - Receber `grupos: { categoria: Categoria; sabores: Sabor[] }[]` em vez de `sabores: Sabor[]`
  - Renderizar cada grupo com cabeçalho (nome da categoria + preço)
  - Cada card de sabor exibe badge com nome da categoria
  - Manter limite de 3 sabores e acréscimo de R$5
- [x] T066 [P] Adicionar helper `getCategoriaNome(id: string): string` em `src/context/MenuContext.tsx` para components exibirem badge

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

- [x] T067 Build: `npx tsc --noEmit && npm run build`
- [x] T068 Verificar regressão: carrinho, checkout, WhatsApp, PWA — nada quebrado
- [x] T069 Verificar SC-001 a SC-006 contra a spec

### 🛑 Phase 5 Validation

```bash
npm run build   # Build limpo
```

---

## Phase 6: Fase 2 — Correções Pós-Validação (US4)

**Goal**: Nav sticky visível e clicável abaixo do header durante todo o scroll; seção Bebidas ativa no IntersectionObserver; primeira categoria como ativa default.

**Independent Test**: Rolar a página > 300px → nav permanece visível abaixo do header. Clicar "Sensacionais" com a página rolada → scroll suave até a seção. Rolar até Bebidas → item "Bebidas" destacado.

### Tasks

- [x] T070 [US4] Corrigir posicionamento do sticky nav em `src/pages/MenuPage.tsx` — nav DEVE fixar abaixo do header do app (altura ~56px), ex.: `sticky top-[56px]` (ou mover o nav para dentro do header), sem sobreposição de `top`/`z-index` com o header sticky (`src/components/Layout.tsx`, z-50) — FR-015 / SC-007
- [x] T071 [US4] Registrar ref da seção Bebidas no IntersectionObserver em `src/pages/MenuPage.tsx` — observar `cat-bebidas` para o item "Bebidas" do nav ficar destacado quando a seção estiver visível — FR-016 / SC-009
- [x] T072 [US4] Definir primeira categoria como ativa default em `src/pages/MenuPage.tsx` — quando nenhuma seção intersecta a faixa do observer (ex.: conteúdo curto), o primeiro item do nav permanece destacado — FR-017 / edge case conteúdo curto
- [x] T073 [P] [US4] Verificar layout em telas pequenas (375px) — nav abaixo do header sem quebrar o sticky do `Layout` nem o scroll-mt das seções — edge case header vs nav

### 🛑 Phase 6 Validation

```text
npm run build                        # Build limpo
Rolar > 300px → nav visível abaixo do header (elementFromPoint no botão do nav retorna o botão, não o header) — SC-007
Clicar "Sensacionais" com página rolada → scroll suave < 500ms — SC-008
Rolar até Bebidas → item "Bebidas" destacado — SC-009
Conteúdo curto → primeiro item destacado — FR-017
Regressão: carrinho, checkout, WhatsApp, PWA ok — SC-010
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
      │
      ▼
Phase 6 (Correções US4 — Fase 2) ────────────────────────────────────────────►
```

### Parallel Opportunities

| Phase | Paralelas |
|-------|----------|
| 1 | T060 (única) |
| 2 | T062 pode ser feito em paralelo com T061 |
| 3 | T063 ║ T064 |
| 4 | T065 ║ T066 |
| 5 | Sequencial |
| 6 | T073 paralela a T070/T071/T072 |

### Files Changed

| Fase | Arquivos |
|------|---------|
| 1 | `public/menu.json` |
| 2 | `src/pages/MenuPage.tsx` |
| 3 | `src/components/PizzaBuilder.tsx` |
| 4 | `src/components/FlavorSelector.tsx`, `src/context/MenuContext.tsx` |
| 5 | — |
| 6 | `src/pages/MenuPage.tsx` (T070/T071/T072), `src/components/Layout.tsx` (se necessário para T070) |

### Rollback

`git checkout main -- src/ public/menu.json specs/003-fluxo-cardapio-unico/`
