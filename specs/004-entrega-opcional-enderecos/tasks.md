# Tasks: Entrega Opcional com Gerenciamento de Endereços

**Input**: Design documents from `/specs/004-entrega-opcional-enderecos/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Not requested in spec — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- **Types**: `src/types/`
- **Context**: `src/context/`
- **Pages**: `src/pages/`
- **Components**: `src/components/`
- **Utils**: `src/utils/`

---

## Extension Hooks

**Optional Pre-Hook**: git
Command: `/speckit.git.commit`
Description: Auto-commit before task generation

Prompt: Commit outstanding changes before task generation?
To execute: `/speckit.git.commit`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Types, context provider, and routing infrastructure needed by multiple user stories

- [X] T001 [P] Create Address types (`Address`, `AddressState`, `AddressAction`, `AddressContextValue`) in `src/types/address.ts`
- [X] T002 [P] Extend CartState with `selectedAddressId: string | null` and CartAction with `SET_ADDRESS` in `src/types/cart.ts`
- [X] T003 Create AddressContext provider with useReducer + localStorage persistence (`pizza-menu-addresses`) in `src/context/AddressContext.tsx`
- [X] T004 Wrap app with `<AddressProvider>` in `src/main.tsx`
- [X] T005 [P] Add `/enderecos` route in `src/App.tsx`

**Checkpoint**: Types and context infrastructure ready — user story implementation can begin

---

## Phase 2: User Story 1 — Escolha Obrigatória entre Retirada e Entrega (Priority: P1) 🎯 MVP

**Goal**: Delivery toggle has real impact on total — taxa_entrega from `menu.json` only applied when "Entrega" is selected

**Independent Test**: Checkout → select "Retirada" → total = subtotal (sem taxa). Select "Entrega" → total = subtotal + `pizzaria.taxa_entrega`.

### Implementation for User Story 1

- [X] T006 [US1] Fix CartContext to use `pizzaria.taxa_entrega` from MenuContext (not hardcoded 5) and make `taxaEntrega = 0` when `delivery === 'retirada'` in `src/context/CartContext.tsx`
- [X] T007 [P] [US1] Fix DeliveryToggle label to read `taxa_entrega` from MenuContext instead of hardcoded `formatCurrency(5)` in `src/components/DeliveryToggle.tsx`
- [X] T008 [P] [US1] Fix CartSummary to show conditional label: "Retirada: Grátis" vs "Taxa de entrega: R$ X" in `src/components/CartSummary.tsx`

**Checkpoint**: Delivery toggle fully functional — taxa is conditional and values come from `menu.json`

---

## Phase 3: User Story 2 — Card de Endereço no Checkout (Priority: P1) 🎯

**Goal**: When "Entrega" is selected, show an address card with the last saved address (or empty state with CTA)

**Independent Test**: Select "Entrega" → card shows address (or "Nenhum endereço salvo"). Select "Retirada" → card hidden. Click "Alterar/Adicionar" → navigate to `/enderecos`.

### Implementation for User Story 2

- [X] T009 [US2] Create AddressCard component with 3 states: endereço selecionado (formatted), sem endereço (empty state), oculto (retirada) in `src/components/AddressCard.tsx`
- [X] T010 [US2] Integrate AddressCard into CheckoutPage — render conditionally when `delivery === 'entrega'`, wire "Alterar/Adicionar" buttons to navigate to `/enderecos` in `src/pages/CheckoutPage.tsx`

**Checkpoint**: Address card displays correctly in checkout — user can see/change address

---

## Phase 4: User Story 3 — Tela de Gerenciamento de Endereços (Priority: P2)

**Goal**: Full CRUD for up to 2 addresses at `/enderecos` — list, add (inline form), remove

**Independent Test**: Navigate to `/enderecos` → see list (or empty state). Add 1 address → appears in list. Try adding 3rd → "Limite de 2 endereços". Remove → list updates. Header "← Voltar" works.

### Implementation for User Story 3

- [X] T011 [US3] Create AddressPage with: address list (cards with delete button), inline add form (rua, numero required; complemento, pontoReferencia optional), max 2 limit with UI feedback, "← Voltar" header using `useNavigate(-1)`, and form validation in `src/pages/AddressPage.tsx`

**Checkpoint**: Full address management works — add, remove, view, navigate back

---

## Phase 5: User Story 4 — Endereço na Mensagem do WhatsApp (Priority: P2)

**Goal**: WhatsApp message includes formatted address when delivery mode is "entrega"

**Independent Test**: Finalize with "Entrega" + address → WhatsApp includes "Endereço: Rua X, 123...". "Entrega" without address → "Endereço: *a informar*". "Retirada" → no address line.

### Implementation for User Story 4

- [X] T012 [US4] Update `formatWhatsAppMessage` to accept optional `endereco?: string` parameter and include it in message text when provided in `src/utils/whatsapp.ts`
- [X] T013 [US4] Update WhatsAppButton to resolve selected address from AddressContext, format it, and pass to `formatWhatsAppMessage` — handle null address with "*a informar*" fallback in `src/components/WhatsAppButton.tsx`

**Checkpoint**: WhatsApp message complete — address included correctly in all scenarios

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and edge case handling

- [X] T014 Run `npm run build` and execute quickstart.md manual test scenarios — verify all acceptance criteria (SC-001 through SC-007)
- [X] T015 Verify edge cases: localStorage unavailable (graceful fallback), address deleted while active (selectedId cleared), rapid Retirada/Entrega toggle (no flicker), form field maxLength enforcement

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
  - T001 (types) and T002 (cart types) are independent [P]
  - T003 (context) depends on T001
  - T004 (provider) depends on T003
  - T005 (route) is independent [P]
- **User Story 1 (Phase 2)**: Depends on Phase 1 (only indirectly — needs existing CartContext structure; no new Phase 1 artifacts needed)
  - All US1 tasks are independent of each other [P]
- **User Story 2 (Phase 3)**: Depends on Phase 1 (types + context) and Phase 2 (delivery toggle working)
- **User Story 3 (Phase 4)**: Depends on Phase 1 (types + context + route)
- **User Story 4 (Phase 5)**: Depends on Phase 1 (types), Phase 2 (delivery mode), Phase 3 (address selection)
- **Polish (Phase 6)**: Depends on all phases complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 1 — no dependencies on other stories
- **US2 (P1)**: Depends on US1 (toggle must work) + Phase 1 (AddressContext)
- **US3 (P2)**: Depends on Phase 1 — testable independently via direct navigation
- **US4 (P2)**: Depends on US1 (delivery mode), US2 (address selection flow), US3 (address data)

### Within Each User Story

- Tasks within US1 can all run in parallel [P] — different files
- US2: T010 depends on T009 (component must exist before integration)
- US4: T013 depends on T012 (function signature must be updated first)

### Parallel Opportunities

- T001, T002, T005 can all run in parallel (Phase 1)
- T006, T007, T008 can all run in parallel (Phase 2 — US1)
- US1 and US3 could theoretically be implemented in parallel (different code paths)

---

## Parallel Example: User Story 1

```bash
# All three US1 tasks modify different files and have no inter-dependencies:
Task: "Fix CartContext to use MenuContext for taxa in src/context/CartContext.tsx"
Task: "Fix DeliveryToggle label from MenuContext in src/components/DeliveryToggle.tsx"
Task: "Fix CartSummary conditional label in src/components/CartSummary.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: User Story 1
3. **STOP and VALIDATE**: Test toggle independently — total recalculates, labels correct
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + US1 → Foundation ready (MV-MVP: delivery fee is now correct)
2. Add US2 → Address card appears in checkout → Test independently → Deploy/Demo
3. Add US3 → Full address management → Test independently → Deploy/Demo
4. Add US4 → WhatsApp includes address → Test independently → Final delivery

### Recommended Execution Order (Single Developer)

```
Phase 1: T001 → T002, T005 in parallel → T003 → T004
Phase 2: T006, T007, T008 in parallel
Phase 3: T009 → T010
Phase 4: T011
Phase 5: T012 → T013
Phase 6: T014 → T015
```

---

## Notes

- [P] tasks = different files, no dependencies — can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No new dependencies needed — only React 18 + React Router 6 + Tailwind CSS 3
- Address fields: rua (required, max 100), numero (required, max 10), complemento (optional, max 50), pontoReferencia (optional, max 100)
- Endereço NÃO bloqueia finalização — fallback "*a informar*" no WhatsApp

---

## Code Review Tasks (adicionadas pelo Code Review Agent — 2026-08-06)

- [X] CR-001 Consumir `CartState.selectedAddressId` no fluxo de finalização (estado write-only)

Contexto:
FR-006 exige o campo `CartState.selectedAddressId`; o `CheckoutPage` o mantém em sincronia com o `AddressContext` via `useEffect` + `dispatch({ type: 'SET_ADDRESS' })` (`src/pages/CheckoutPage.tsx:16-18`). Porém nenhum consumidor lê `state.selectedAddressId`: o `WhatsAppButton` resolve o endereço diretamente via `useAddress().getSelectedAddress()` (`src/components/WhatsAppButton.tsx:15-17`).

Problema:
O campo é escrito e nunca lido — estado morto. O efeito de sincronização dispara um `SET_ADDRESS` extra a cada mount do checkout sem efeito observável, adicionando complexidade sem propósito.

Critério de aceite:

- `WhatsAppButton` resolve o endereço a partir de `state.selectedAddressId` (ex.: `getSelectedAddress()` passando o id do cart) em vez de ler o `AddressContext` diretamente — o campo FR-006 passa a ter um consumidor real
- Ou, se aprovado ajuste de spec, remover o campo + efeito de sincronização
- `npm run build` continua passando

Prioridade:
Medium

- [X] CR-002 Completar validação de tipos no load do localStorage (complemento/pontoReferencia)

Contexto:
`isValidStoredAddress` (`src/context/AddressContext.tsx:12-22`) valida apenas `id`, `rua` e `numero` como strings. `formatAddress` (`src/utils/address.ts:6-8`) chama `.trim()` em `complemento` e `pontoReferencia`.

Problema:
Um payload adulterado/corrompido com `complemento` ou `pontoReferencia` não-string (ex.: `null`, número) passa na validação de carga e quebra o app com `TypeError` ao renderizar o card/lista de endereços — contrariando o edge case da spec ("payload inválido → fallback silencioso").

Critério de aceite:

- `isValidStoredAddress` valida os 4 campos de texto como string
- Payload inválido → estado vazio sem crash (fallback silencioso mantido)

Prioridade:
Low

- [X] CR-003 Remover fallback hardcoded `?? 5` da taxa de entrega

Contexto:
FR-001/FR-002 exigem usar `pizzaria.taxa_entrega` do `menu.json` ("não hardcodar R$ 5"). `CartContext` (`src/context/CartContext.tsx:59`) e `DeliveryToggle` (`src/components/DeliveryToggle.tsx:8`) usam `menu?.pizzaria?.taxa_entrega ?? 5`.

Problema:
O literal `5` permanece hardcoded como fallback em dois pontos, contrariando o texto das FRs. Na prática só atinge o estado de carregamento do menu (carrinho inacessível antes), mas viola a regra literal.

Critério de aceite:

- Fallback substituído por `0` ou renderização condicional até o menu carregar
- Nenhum literal `5` de taxa de entrega em `CartContext`/`DeliveryToggle`

Prioridade:
Low

- [X] CR-004 Remover ação `LOAD` morta do AddressContext

Contexto:
`AddressAction` inclui `{ type: 'LOAD' }` (`src/types/address.ts:15`) e o reducer tem o case `'LOAD'` (`src/context/AddressContext.tsx:51`), mas `loadFromStorage` é usado como lazy initializer do `useReducer` (`src/context/AddressContext.tsx:72`) — a ação nunca é despachada.

Problema:
Código morto (tipo + case de reducer) que nunca executa.

Critério de aceite:

- `LOAD` removido de `AddressAction` e do reducer, mantendo o lazy initializer
- `npm run build` continua passando

Prioridade:
Low

- [X] CR-005 Remover bloco `MULTICA-RUNTIME` de `AGENTS.md` do branch da feature

Contexto:
O commit `2de420a` (correções CR-001 a CR-004) incluiu por acidente 365 linhas do bloco `<!-- BEGIN MULTICA-RUNTIME (auto-managed; do not edit) -->` em `AGENTS.md`. Esse bloco é conteúdo gerado automaticamente pelo runtime do agente em cada sessão — ele muda a cada execução (ex.: o campo `You are:` alterna entre os agentes Front-End Engineer e Code Review Agent). A única mudança legítima de `AGENTS.md` na branch é o marcador `<!-- SPECKIT START -->` do commit `0f845dd` (Current plan → `004`).

Problema:
- Conteúdo fora do escopo da NAD-3: nenhum artefato (spec/plan/tasks) prevê alteração de `AGENTS.md` além do marcador SPECKIT
- Conteúdo volátil e específico de sessão: vai gerar diff noise e conflitos a cada merge/fetch, pois o bloco difere entre execuções de agentes
- ~21% do diff do PR (#2, +369 linhas vs main) é ruído não relacionado à feature

Critério de aceite:

- `AGENTS.md` no branch restaurado para o conteúdo de `main` + apenas o marcador `<!-- SPECKIT START -->` atualizado (equivalente ao estado pós-`0f845dd`)
- O bloco `MULTICA-RUNTIME` não aparece no diff final do PR
- `npm run build` continua passando

Prioridade:
Medium
