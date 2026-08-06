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
