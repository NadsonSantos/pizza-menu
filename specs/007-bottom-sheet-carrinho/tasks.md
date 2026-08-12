# Tasks: Bottom Sheet do Carrinho

**Input**: Design documents from `/specs/007-bottom-sheet-carrinho/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Not requested in the feature specification — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- Paths shown below reflect actual project structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project state and existing dependencies

- [X] T001 Verify project builds successfully with `npm run build` and CartContext API (`itemCount`, `total`) is accessible via `useCart()` hook

**Checkpoint**: Build passes, CartContext API confirmed ready for consumption.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Nenhuma — o CartContext (`src/context/CartContext.tsx`) já existe e provê `itemCount`, `total` e `useCart()`. O projeto já está inicializado com React 19 + Vite 6 + Tailwind 4 + React Router 7. Nenhuma infraestrutura adicional é necessária.

**⚠️ NOTA**: Esta fase está intencionalmente vazia. Todas as dependências para as user stories já estão satisfeitas. Prosseguir diretamente para Phase 3.

**Checkpoint**: N/A — prosseguir imediatamente para implementação das user stories.

---

## Phase 3: User Story 1 - Resumo do Carrinho Sempre Visível (Priority: P1) 🎯 MVP

**Goal**: Componente `CartBottomSheet` fixo no rodapé da MenuPage que exibe contador de itens, valor total e botão "Ver Carrinho". Surge ao adicionar o 1º item, some ao esvaziar o carrinho.

**Independent Test**: Adicionar qualquer item ao carrinho → Bottom Sheet aparece no rodapé com contador e valor total corretos. Remover o último item → Bottom Sheet desaparece. Clicar no card ou botão → navega para `/carrinho`.

### Implementation for User Story 1

- [X] T002 [P] [US1] Create CartBottomSheet component in `src/components/CartBottomSheet.tsx` with fixed bottom positioning (`fixed bottom-0 left-0 right-0 z-30`), safe-area padding (`pb-safe`), item counter with plural (`itemCount === 1 ? '1 item' : '${itemCount} itens'`), total formatted via `formatCurrency(total)` from `src/utils/pricing.ts`, and "Ver Carrinho" button. Accept `itemCount: number` and `total: number` as props.

- [X] T003 [US1] Integrate CartBottomSheet into `src/pages/MenuPage.tsx`: import `CartBottomSheet`, read `itemCount` and `total` from `useCart()`, render `<CartBottomSheet>` conditionally only when `itemCount > 0`.

- [X] T004 [US1] Make entire CartBottomSheet card clickable in `src/components/CartBottomSheet.tsx` — both the card body and the button navigate to `/carrinho` via `useNavigate()` from React Router 6. Button receives `cursor-pointer` and `active:scale-[0.98]` for touch feedback.

- [X] T005 [US1] Verify Bottom Sheet scope in `src/pages/MenuPage.tsx`: confirm `CartBottomSheet` is only rendered inside MenuPage and does NOT appear on other pages (CartPage, OrderHistory, etc.).

**Checkpoint**: User Story 1 fully functional — Bottom Sheet exibe/oculta conforme carrinho, mostra dados corretos, navega ao carrinho. Pode ser testado e entregue como MVP.

---

## Phase 4: User Story 2 - Visualização Completa do Cardápio (Priority: P2)

**Goal**: Adicionar padding-bottom dinâmico na lista de produtos da MenuPage para que o último item não fique escondido atrás do Bottom Sheet.

**Independent Test**: Rolar até o final da lista de bebidas e verificar que o último item está totalmente visível acima do Bottom Sheet, com espaçamento suficiente.

### Implementation for User Story 2

- [X] T006 [US2] Add dynamic bottom padding to the menu list in `src/pages/MenuPage.tsx`: measure `CartBottomSheet` height using `useRef` + `ResizeObserver`, compute `paddingBottom = height + safe-area-inset-bottom`, apply to the outer scroll container div. Replace static `pb-8` with dynamic value when Bottom Sheet is visible.

**Checkpoint**: Todos os itens da lista acessíveis via scroll — nenhum fica permanentemente oculto atrás do Bottom Sheet.

---

## Phase 5: User Story 3 - Transições Suaves (Priority: P3)

**Goal**: Adicionar animação CSS de slide-up (entrada) e slide-down (saída) ao Bottom Sheet com duração de ~300ms.

**Independent Test**: Adicionar primeiro item → Bottom Sheet aparece com slide-up suave. Remover último item → Bottom Sheet desliza para baixo e desaparece. Atualizações de valor/contador são instantâneas (sem animação).

### Implementation for User Story 3

- [X] T007 [US3] Add enter/exit animation to `src/components/CartBottomSheet.tsx`: internal `exiting` state and `height` state via `useRef`. On mount: apply `translate-y-full opacity-0` → trigger reflow → remove classes for slide-up. On `itemCount` transition to 0: set `exiting=true`, apply `translate-y-full opacity-0 transition-all duration-300`, call `onExitComplete` prop on `transitionend`. Use `useEffect` with `itemCount` dependency. Updates to counter/total values are instant (no transition class on text elements).

- [X] T008 [US3] Wire exit callback in `src/pages/MenuPage.tsx`: pass `onExitComplete` to `CartBottomSheet` to fully unmount after animation completes (final cleanup).

**Checkpoint**: Transições suaves implementadas — entrada slide-up ~300ms, saída slide-down ~300ms, atualizações de dados instantâneas.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [X] T009 Run full validation per `quickstart.md`: `npm run build` (build check), `npm run dev` (manual smoke test — add item → appears, remove item → disappears, scroll to bottom → no hidden items, click → navigates to cart).
- [X] T010 [P] Run `npm run test` (if any existing tests) to ensure no regressions from MenuPage changes.
- [X] T011 Verify all 11 functional requirements (FR-001 to FR-011) from spec.md are satisfied and all 5 success criteria (SC-001 to SC-005) are met.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — verify build immediately.
- **Foundational (Phase 2)**: Intentionally empty — CartContext is ready.
- **User Story 1 (Phase 3)**: Can start immediately after Phase 1. T003 depends on T002 (component must exist before integration).
- **User Story 2 (Phase 4)**: Depends on US1 (needs Bottom Sheet rendered to measure height).
- **User Story 3 (Phase 5)**: Depends on US1 (needs component structure to add animation). Can be done in parallel with US2.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories — core component.
- **User Story 2 (P2)**: Depends on US1 (Bottom Sheet must exist).
- **User Story 3 (P3)**: Depends on US1 (Bottom Sheet must exist). Independent from US2.

### Within Each User Story

- US1: T002 (component) → T003 (integration) → T004 (click behavior) → T005 (scope check)
- US2: T006 standalone (can also run after T003 is done)
- US3: T007 (animation) → T008 (exit callback wiring)

### Parallel Opportunities

- T002 and T001 can run in parallel (component creation + build verification are independent).
- US2 (T006) and US3 (T007, T008) can run in parallel after US1 is complete.
- T009 and T010 can run in parallel during Polish phase.

---

## Parallel Example: User Story 1

```bash
# Start component creation while build check runs:
Task: "T001 Verify project builds"
Task: "T002 [P] [US1] Create CartBottomSheet component in src/components/CartBottomSheet.tsx"

# After T002 completes, integration can start:
Task: "T003 [US1] Integrate CartBottomSheet into src/pages/MenuPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Skip Phase 2 (empty)
3. Complete Phase 3: User Story 1 (T002 → T003 → T004 → T005)
4. **STOP and VALIDATE**: Test US1 independently — Bottom Sheet appears, shows correct data, navigates to cart.
5. Deploy/demo as MVP.

### Incremental Delivery

1. Setup → Foundation ready (immediate)
2. Add User Story 1 → Test independently → MVP ready!
3. Add User Story 2 → Test scroll behavior → Deploy
4. Add User Story 3 → Test animations → Deploy
5. Polish & validate → Final release

### Single Developer Strategy

1. Execute T001 (build check)
2. Execute T002 (create component)
3. Execute T003 (integrate into MenuPage)
4. Execute T004 (click behavior), T005 (scope check) — quick follow-ups
5. Execute T006 (dynamic padding — US2) and T007 + T008 (animation — US3)
6. Final validation with T009, T010, T011

---

## Notes

- **[P]** tasks = different files, no dependencies on incomplete tasks
- **[Story]** label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- CartContext (`src/context/CartContext.tsx`) is NOT modified — Bottom Sheet is read-only consumer
- `formatCurrency` from `src/utils/pricing.ts` is reused for total formatting
- Safe-area-inset-bottom via Tailwind arbitrary value: `pb-[env(safe-area-inset-bottom)]`
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently

---

## Code Review — Ciclo 1 (PR #6)

Tasks de correção adicionadas pelo Code Review Agent em 2026-08-12. Não remover nem alterar tasks concluídas acima.

- [X] CR-001 Tornar o card do Bottom Sheet acessível por teclado/leitor de tela e respeitar `prefers-reduced-motion`

Contexto:
FR-006 exige que o card inteiro do Bottom Sheet seja clicável. Em `src/components/CartBottomSheet.tsx:61-79`, o card é uma `<div>` com `onClick={goToCart}` e `cursor-pointer`, contendo um `<button>` real ("Ver Carrinho").

Problema:
A div clicável não possui `role="button"`, `tabIndex` ou manipulador de teclado (Enter/Espaço) — usuários de teclado/leitores de tela não conseguem acionar o card, apenas o botão interno. Há ainda aninhamento de elementos interativos (div clicável contendo botão) e a animação de 300ms não respeita `prefers-reduced-motion` (variante `motion-reduce` do Tailwind). Contradiz a alegação de auditoria a11y feita no comentário do PR.

Critério de aceite:

- Card acionável por teclado (Enter/Espaço) OU reestruturado como um único elemento interativo (`<button>`/`<Link>`) sem aninhamento de interativos
- Sem duplicação de tab stops para a mesma ação (card + botão)
- Animações de entrada/saída respeitam `prefers-reduced-motion` (variante `motion-reduce` ou media query)

Prioridade:
Medium

---

- [X] CR-002 Adicionar testes do `CartBottomSheet` (render, saída e navegação)

Contexto:
`src/components/CartBottomSheet.tsx` contém a máquina de estados `entering`/`exiting` (double rAF na entrada, transição `itemCount` → 0, fallback `setTimeout(EXIT_MS + 100)` e `onExitComplete`) — a lógica mais propensa a regressão da feature. O projeto já possui vitest configurado (`src/utils/orderHistory.test.ts`, 9 testes, adicionado no NAD-6 CR-004).

Problema:
Nenhum teste cobre o novo componente. Regressões na animação de saída, no fallback de unmount ou na navegação para `/carrinho` passariam despercebidas.

Critério de aceite:

- Render com `itemCount > 0` exibe plural correto ("1 item" / "N itens") e total formatado via `formatCurrency`
- Transição `itemCount` 1 → 0 dispara `onExitComplete` (via transitionend ou fallback)
- Clique no card e no botão navegam para `/carrinho`
- `npm run test` passa com os novos testes

Prioridade:
Medium

---

- [X] CR-003 Corrigir drift de stack técnica no `plan.md` e `AGENTS.md`

Contexto:
O `plan.md` (Technical Context) declara "React 18, React Router 6, Tailwind CSS 3, Vite 5"; `AGENTS.md` (tabela Tech Stack) idem. O `package.json` real é `react ^19.1.0`, `react-router-dom ^7.6.1`, `tailwindcss ^4.1.6`, `vite ^6.3.4`. O Engenheiro sinalizou a divergência no comentário do PR, mas não corrigiu os documentos.

Problema:
Drift documental — specs e planos futuros serão gerados com stack desatualizada, e validações técnicas (ex.: `ref` como prop, Tailwind 4) podem ser avaliadas contra a stack errada.

Critério de aceite:

- `specs/007-bottom-sheet-carrinho/plan.md` (Technical Context) com as versões reais
- `AGENTS.md` (tabela Tech Stack) atualizado com React 19 / RR 7 / Tailwind 4 / Vite 6

Prioridade:
Low

---

- [X] CR-004 Congelar os últimos valores durante a animação de saída do Bottom Sheet

Contexto:
Durante a saída (`itemCount` 1 → 0), o componente continua recebendo `itemCount = 0` e `total = 0` do contexto (`src/components/CartBottomSheet.tsx:67-71`), exibindo "0 itens" e "R$ 0,00" enquanto desliza para baixo (~300ms).

Problema:
Polimento visual — o usuário vê valores zerados durante a transição de saída, o que pode parecer bug de estado.

Critério de aceite:

- Durante o `exiting`, o sheet exibe os últimos valores (ou oculta os textos) até o unmount

Prioridade:
Low

---

## Code Review — Ciclo 2 (PR #6)

Tasks de correção adicionadas pelo Code Review Agent em 2026-08-12. Não remover nem alterar tasks concluídas acima.

- [x] CR-005 Remover o bloco MULTICA-RUNTIME do Front-End Engineer do `AGENTS.md`

Contexto:
O commit `e4ab152` alterou o `AGENTS.md` além da correção da tabela Tech Stack (CR-003): adicionou ~333 linhas contendo o bloco `<!-- BEGIN MULTICA-RUNTIME (auto-managed; do not edit) -->` inteiro do agente Front-End Engineer (identidade "You are: Front-End Engineer", UUID `42ae8324-...`, lista de comandos do CLI multica, sintaxe de menções, regras de pipeline). Antes do commit, `AGENTS.md` não continha nenhuma ocorrência de `MULTICA-RUNTIME` (verificado em `b5d6f32` e `main`).

Problema:
`AGENTS.md` é o arquivo de contexto compartilhado do repositório, lido por todos os agentes do projeto. Commitar o bloco de runtime de um agente específico (identidade, UUID interno, comandos de CLI) no repositório: (1) está fora do escopo do CR-003, que pedia apenas as versões de stack; (2) contamina o doc compartilhado com instruções de identidade conflitantes ("You are: Front-End Engineer") que confundem os demais agentes (PO, Code Reviewer, próximos Engineers); (3) expõe UUIDs internos do workspace em um arquivo versionado.

Critério de aceite:

- `AGENTS.md` no branch contém apenas a correção da tabela Tech Stack (React 19 / RR 7 / Tailwind 4 / Vite 6), sem o bloco `<!-- BEGIN MULTICA-RUNTIME ... -->`
- `git diff main...branch -- AGENTS.md` mostra somente a atualização da tabela

Prioridade:
High

---

- [x] CR-006 Commitar os artefatos de spec do NAD-7 no branch (spec.md, data-model.md, research.md, quickstart.md, checklists/)

Contexto:
No padrão do repositório (NAD-6 em `main`), todos os artefatos da feature são versionados: `specs/006-tela-inicial-historico/` contém `spec.md`, `plan.md`, `tasks.md`, `data-model.md`, `research.md`, `quickstart.md`, `checklists/` e `contracts/`. No branch `007-bottom-sheet-carrinho`, apenas `plan.md` e `tasks.md` foram commitados; `spec.md`, `data-model.md`, `research.md`, `quickstart.md` e `checklists/` estão untracked (nunca entraram no PR #6).

Problema:
A spec.md (contrato da feature validado no Code Review) e os artefatos de planejamento não estão no PR. Após o merge, esses documentos ficariam fora do histórico do repositório, quebrando a rastreabilidade SDD e o padrão já adotado no NAD-6.

Critério de aceite:

- `spec.md`, `data-model.md`, `research.md`, `quickstart.md` e `checklists/` commitados no branch e visíveis no PR #6
- `git ls-tree <branch> -- specs/007-bottom-sheet-carrinho/` lista todos os artefatos, como no NAD-6

Prioridade:
Medium
