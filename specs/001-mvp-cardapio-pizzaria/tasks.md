# Tasks: MVP Cardápio Digital de Pizzaria (PWA)

**Input**: Design documents from `specs/001-mvp-cardapio-pizzaria/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Not requested in spec. Tasks are implementation-only; validation is manual against acceptance criteria.

**Organization**: Tasks grouped by functional domain phase (per user request) — each phase delivers an independently testable increment.

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Maps to user story from spec.md (US1–US6)
- File paths relative to repo root

---

## Phase 1: Setup & Scaffolding

**Goal**: Projeto Vite + React + TS + Tailwind funcional com types e configuração PWA.

**Independent Test**: `npm run dev` abre o app no browser; `npx tsc --noEmit` passa limpo.

### Tasks

- [ ] T001 Scaffold Vite + React + TypeScript project via `npm create vite@latest . -- --template react-ts`, then `npm install`
- [ ] T002 Install dependencies: `npm install react-router-dom` and `npm install -D tailwindcss @tailwindcss/vite vite-plugin-pwa`
- [ ] T003 [P] Configure Vite plugins in `vite.config.ts` — React, Tailwind CSS, vite-plugin-pwa (manifest + Workbox cache-first)
- [ ] T004 [P] Replace `src/index.css` with `@import "tailwindcss";` and remove `src/App.css`
- [ ] T005 [P] Create TypeScript types for menu data in `src/types/menu.ts` — `MenuData`, `PizzariaInfo`, `Categoria`, `Sabor`, `Bebida`
- [ ] T006 [P] Create TypeScript types for cart state in `src/types/cart.ts` — `CartItem`, `CartState`, `CartAction`, `DeliveryMode`, `PaymentMethod`
- [ ] T007 [P] Create sample `public/menu.json` with 3 pizza categories (4 sabores each) + 2 bebidas, valid JSON
- [ ] T008 [P] Create `public/icon-192.png` and `public/icon-512.png` — red square with 🍕 emoji placeholder
- [ ] T009 Create `public/offline.html` — friendly offline fallback page in Portuguese

### 🛑 Phase 1 Validation

```bash
npm run dev        # App loads at localhost:5173
npx tsc --noEmit   # Zero type errors
python3 -m json.tool public/menu.json  # Valid JSON
```

✅ **Gate**: `npm run dev` works + `tsc` clean + `menu.json` valid → proceed to Phase 2.

---

## Phase 2: Lógica de Precificação

**Goal**: Função `calcularPrecoPizza()` correta para todos os casos (1, 2, 3 sabores, categorias mistas) + utilitário de formatação + loader de menu com validação.

**Independent Test**: Testar manualmente: 1 sabor Tradicional → R$30; 2 sabores (Tradicional + Especial) → R$35; 3 sabores (Sensacional + Especial + Tradicional) → R$45.

### Tasks

- [ ] T010 [P] Create `src/utils/pricing.ts` — `calcularPrecoPizza(sabores, categoriaPrecos)` and `formatCurrency(value)`
- [ ] T011 [P] Create `src/utils/loadMenu.ts` — `loadMenu()` with fetch, JSON parse, and Portuguese error messages for malformed/missing `menu.json`
- [ ] T012 Create `src/context/MenuContext.tsx` — loads menu.json on mount via `loadMenu()`, exposes `{ menu, loading, error }`

### 🛑 Phase 2 Validation

```typescript
// Manual check in browser console or via temporary test:
calcularPrecoPizza([trad], precos)       // → { precoBase: 30, acrescimo: 0, total: 30 }
calcularPrecoPizza([trad, esp], precos)  // → { precoBase: 35, acrescimo: 0, total: 35 }
calcularPrecoPizza([trad, esp, sens], precos) // → { precoBase: 40, acrescimo: 5, total: 45 }
```

✅ **Gate**: Todos os 3 casos de preço confirmados + `menu.json` carrega sem erro → proceed to Phase 3.

---

## Phase 3: Cardápio (US1 — Navegar, US2 — Montar Pizza)

**Goal**: Página principal do cardápio funcional: categorias em tabs, cards de sabores, seletor de 1-3 sabores com preço ao vivo, cards de bebida, e botão "Adicionar ao carrinho".

**Independent Test**: Abrir o app, ver todas as categorias, selecionar uma pizza com 2 sabores, ver preço R$35, adicionar observação, clicar "Adicionar".

### Tasks

- [ ] T013 [P] Create `src/components/PizzaCard.tsx` — card de sabor com nome, descrição, estado selected/disabled
- [ ] T014 [P] Create `src/components/DrinkCard.tsx` — card de bebida com nome, preço, botão "Adicionar"
- [ ] T015 [US1] Create `src/components/FlavorSelector.tsx` — grid de PizzaCards, indicador "N/3 sabores", preço calculado ao vivo
- [ ] T016 [US2] Create `src/components/PizzaBuilder.tsx` — modal com FlavorSelector + campo de observação + botão "Adicionar ao carrinho"
- [ ] T017 [US1] Create `src/pages/MenuPage.tsx` — tabs de categorias com scroll horizontal, grid de itens, abre PizzaBuilder ao selecionar categoria de pizza
- [ ] T018 Create `src/components/Layout.tsx` — header fixo com nome da pizzaria + Outlet do React Router
- [ ] T019 Wire up `src/App.tsx` and `src/main.tsx` with BrowserRouter, MenuProvider, CartProvider, and routes

### 🛑 Phase 3 Validation

```
Abrir app → tabs de categorias visíveis (Tradicionais, Especiais, Sensacionais, Bebidas)
Clicar "Tradicionais Simples" → grid de sabores aparece
Selecionar 2 sabores → preço mostra R$30 (max entre tradicionais)
Adicionar observação "sem cebola" → aparece no resumo do PizzaBuilder
Clicar "Adicionar ao carrinho" → (carrinho ainda não visível, mas dispatch deve funcionar)
Clicar "Bebidas" → cards de Pepsi e Guaraná com botão "Adicionar"
```

✅ **Gate**: Cardápio navegável, seleção de sabores com preço correto, botão de adicionar funcional → proceed to Phase 4.

---

## Phase 4: Carrinho (US3 — Gerenciar Carrinho)

**Goal**: Página do carrinho com lista de itens, controle de quantidade, remoção, observações, subtotal/total, estado vazio, e botão para finalizar.

**Independent Test**: Adicionar 2 pizzas + 1 bebida ao carrinho, ajustar quantidades, ver totais atualizando, remover item, ver estado vazio.

### Tasks

- [ ] T020 Create `src/context/CartContext.tsx` — `CartProvider` com `useReducer`, `CartContextValue`, `useCart()` hook
- [ ] T021 [P] [US3] Create `src/components/CartItem.tsx` — nome, sabores, preço unitário, qtd +/- buttons, observação, botão remover
- [ ] T022 [P] [US3] Create `src/components/EmptyCart.tsx` — ícone 🛒, mensagem "Seu carrinho está vazio", link "Ver Cardápio" → `/`
- [ ] T023 [P] [US3] Create `src/components/CartSummary.tsx` — subtotal, taxa de entrega (se aplicável), total
- [ ] T024 [US3] Create `src/pages/CartPage.tsx` — lista de CartItems ou EmptyCart + CartSummary + botão "Finalizar Pedido" → `/finalizar`

### 🛑 Phase 4 Validation

```
Adicionar 2 pizzas diferentes + 1 Pepsi
Navegar para /carrinho → 3 itens listados
Aumentar qtd de uma pizza para 2 → subtotal dobra
Subtotal = soma correta, total reflete
Remover a Pepsi → some da lista, total recalcula
Esvaziar carrinho → EmptyCart aparece
```

✅ **Gate**: Carrinho gerencia itens corretamente (add, qtd, remove, totais) → proceed to Phase 5.

---

## Phase 5: Entrega & Pagamento (US4)

**Goal**: Toggle entrega/retirada, seletor de pagamento (Dinheiro/Cartão/Pix), campo de troco condicional, resumo do pedido.

**Independent Test**: Selecionar "Entrega" → +R$5 no total. Selecionar "Dinheiro" → campo de troco aparece. Mudar para "Cartão" → troco some.

### Tasks

- [ ] T025 [P] [US4] Create `src/components/DeliveryToggle.tsx` — switch Entrega (+R$5) / Retirada (R$0), usa `useCart()` dispatch
- [ ] T026 [P] [US4] Create `src/components/PaymentSelector.tsx` — radio Dinheiro/Cartão/Pix, campo de troco condicional (só visível se Dinheiro)
- [ ] T027 [US4] Create `src/components/OrderSummary.tsx` — lista de itens (read-only), taxas, total, modo de entrega, pagamento
- [ ] T028 [US4] Create `src/pages/CheckoutPage.tsx` — DeliveryToggle + PaymentSelector + OrderSummary, guard redireciona para `/carrinho` se carrinho vazio

### 🛑 Phase 5 Validation

```
Com itens no carrinho, navegar para /finalizar
Subtotal = R$75, selecionar "Entrega" → total = R$80
Selecionar "Retirada" → total volta para R$75
Selecionar "Dinheiro" → campo "Troco para" aparece
Digitar "100" → OrderSummary mostra "Troco para: R$100"
Mudar para "Cartão" → campo troco desaparece
Tentar acessar /finalizar com carrinho vazio → redireciona para /carrinho
```

✅ **Gate**: Entrega/pagamento funcionam, totais corretos, troco condicional → proceed to Phase 6.

---

## Phase 6: Integração WhatsApp (US5)

**Goal**: Mensagem formatada com todos os itens + link `wa.me` que abre em nova aba. Carrinho limpa após abertura.

**Independent Test**: Finalizar pedido → WhatsApp abre com mensagem contendo itens, totais, entrega, pagamento e troco (se aplicável). Carrinho volta vazio.

### Tasks

- [ ] T029 [P] [US5] Create `src/utils/whatsapp.ts` — `formatWhatsAppMessage(state, pizzariaNome, subtotal, taxa, total)` and `createWhatsAppLink(whatsapp, message)`
- [ ] T030 [US5] Create `src/components/WhatsAppButton.tsx` — botão "Finalizar Pedido" que gera link `wa.me`, abre em `window.open('_blank')`, dispara `CLEAR_CART`

### 🛑 Phase 6 Validation

```
Carrinho: 1 pizza Sensacional 3 sabores (R$45) + 1 Pepsi (R$8)
Entrega: Sim (+R$5), Pagamento: Dinheiro, Troco: R$100
Clicar "Finalizar Pedido"
→ Nova aba abre com wa.me/5511999999999?text=...
→ Mensagem contém:
  🍕 *Pedido — Pizza do Bairro*
  *Itens:* Pizza Grande (sabor1, sabor2, sabor3) — R$45,00
  1x Pepsi Lata 350ml — R$8,00
  *Subtotal:* R$53,00 / *Taxa:* R$5,00 / *Total:* R$58,00
  *Entrega:* Sim / *Pagamento:* Dinheiro / *Troco para:* R$100
→ Carrinho volta vazio (redireciona para /)
```

✅ **Gate**: WhatsApp abre com mensagem completa e formatada, carrinho limpa → proceed to Phase 7.

---

## Phase 7: PWA (US6)

**Goal**: App instalável, funcional offline, Lighthouse PWA ≥ 90.

**Independent Test**: `npm run build` → `npx serve dist` → Chrome audit PWA ≥ 90.

### Tasks

- [ ] T031 [US6] Verify `vite.config.ts` PWA configuration — manifest `display: standalone`, icons, Workbox `CacheFirst` for assets and `menu.json`
- [ ] T032 [P] [US6] Create `src/components/CartBadge.tsx` — contador de itens no header com link para `/carrinho`; wire into `Layout.tsx`
- [ ] T033 [US6] Build production: `npm run build`; verify `dist/` has `sw.js`, `manifest.webmanifest`, `offline.html`
- [ ] T034 [US6] Run Lighthouse PWA audit on `npx serve dist` (mobile, 3G throttling); iterate on Workbox config until score ≥ 90

### 🛑 Phase 7 Validation

```bash
npm run build && npx serve dist
# Chrome DevTools → Lighthouse → PWA audit → score ≥ 90
# DevTools → Application → Service Workers → registered + running
# DevTools → Application → Manifest → valid
# Network tab → check "Offline" → reload → cardápio visível
```

✅ **Gate**: Lighthouse PWA ≥ 90 + offline funciona → proceed to Phase 8.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Documentação para o dono da pizzaria, validação final contra a spec, ajustes de UX.

**Independent Test**: Dono não-técnico consegue editar `menu.json` seguindo o README.

### Tasks

- [ ] T035 [P] Update `README.md` — instruções em português para editar `menu.json` (adicionar sabor, mudar preço, mudar WhatsApp, erros comuns)
- [ ] T036 [P] Verify all 20 functional requirements (FR-001 a FR-020) against implemented app — checklist
- [ ] T037 [P] Verify all 8 success criteria (SC-001 a SC-008) — manual walkthrough
- [ ] T038 Test full user journey end-to-end: abrir app → montar pizza → carrinho → entrega/pagamento → WhatsApp
- [ ] T039 Verify error states: `menu.json` ausente, `menu.json` mal formatado, carrinho vazio ao finalizar, 0 ou 4+ sabores

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────────────────────────────────────────────────►
        │
        ▼
Phase 2 (Precificação) ──────────────────────────────────────────────────────►
        │
        ▼
Phase 3 (Cardápio) ──────────────────────────────────────────────────────────►
        │
        ▼
Phase 4 (Carrinho) ──────────────────────────────────────────────────────────►
        │
        ▼
Phase 5 (Entrega/Pagamento) ─────────────────────────────────────────────────►
        │
        ▼
Phase 6 (WhatsApp) ──────────────────────────────────────────────────────────►
        │
        ▼
Phase 7 (PWA) ───────────────────────────────────────────────────────────────►
        │
        ▼
Phase 8 (Polish) ────────────────────────────────────────────────────────────►
```

### Parallel Opportunities Per Phase

| Phase | Parallel Tasks |
|-------|---------------|
| 1 | T003 ║ T004 ║ T005 ║ T006 ║ T007 ║ T008 (6 em paralelo) |
| 2 | T010 ║ T011 (2 em paralelo) |
| 3 | T013 ║ T014 (2 em paralelo); depois T015 → T016 → T017 → T018 → T019 (sequencial) |
| 4 | T021 ║ T022 ║ T023 (3 em paralelo); depois T024 |
| 5 | T025 ║ T026 (2 em paralelo); depois T027 → T028 |
| 6 | T029 pode ser feito em paralelo com Phase 5; T030 depois |
| 7 | T032 em paralelo com T031/T033 |
| 8 | T035 ║ T036 ║ T037 (3 em paralelo) |

### User Story Mapping

| Phase | User Stories Covered |
|-------|---------------------|
| 1 | Infrastructure |
| 2 | Infrastructure |
| 3 | US1 (Navegar Cardápio), US2 (Montar Pizza) |
| 4 | US3 (Gerenciar Carrinho) |
| 5 | US4 (Entrega/Pagamento) |
| 6 | US5 (Finalizar WhatsApp) |
| 7 | US6 (Instalar PWA) |
| 8 | Cross-cutting |

---

## Implementation Strategy

### MVP Scope (Recomendado)

Fases 1–6 entregam o MVP completo (cardápio → carrinho → WhatsApp). Fase 7 (PWA) e Fase 8 (Polish) fecham o produto final.

### Incremental Delivery

1. Fases 1–2: Fundação (scaffold + lógica de negócio) → **~30 min**
2. Fase 3: Cardápio funcional → **demo: navegar e montar pizzas** → **~45 min**
3. Fase 4: Carrinho completo → **demo: gerenciar pedido** → **~30 min**
4. Fase 5: Entrega e pagamento → **demo: checkout** → **~30 min**
5. Fase 6: WhatsApp → **demo: pedido enviado** → **~15 min**
6. Fase 7: PWA → **demo: instalar + offline** → **~30 min**
7. Fase 8: Polish → **pronto para deploy** → **~20 min**

**Tempo total estimado**: ~3.5 horas

### MVP First (Fases 1–6 apenas)

Se houver restrição de tempo, as Fases 1–6 já entregam todo o valor de negócio. A Fase 7 (PWA) é importante para o requisito offline mas o app funciona sem ela no browser. A Fase 8 é documentação e validação — pode ser adiada.

---

## Notes

- Tarefas marcadas `[P]` tocam arquivos diferentes e podem ser executadas simultaneamente
- Cada Phase Validation (`🛑`) é um gate obrigatório — NÃO avance sem passar
- Preços no `menu.json` são em R$ (número, não string): `30.00`, não `"30,00"`
- WhatsApp number no `menu.json` usa formato internacional: `"5511999999999"` (sem `+`, sem espaços)
- `crypto.randomUUID()` é usado para IDs do carrinho — disponível em Chrome 92+, Safari 15.4+
