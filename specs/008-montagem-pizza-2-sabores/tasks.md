---
description: "Task list for feature implementation — NAD-8"
---

# Tasks: Montagem de Pizza — 2 Sabores como Padrão e 3º Sabor Excepcional

**Input**: Design documents from `/specs/008-montagem-pizza-2-sabores/` (plan.md, spec.md, research.md, data-model.md, contracts/ui-contracts.md, quickstart.md)

**Prerequisites**: plan.md (approved), spec.md (approved), contracts/ui-contracts.md (approved)

**Tests**: Incluídos — o quickstart.md e o plano exigem cobertura de componente (`src/components/FlavorSelector.test.tsx`) para US1/US2/US4 e a spec define critérios de teste independentes por história.

**Organization**: Tasks grouped by user story. As edições de US2/US3/US1/US4 convergem em `src/components/FlavorSelector.tsx` — **todas as tarefas que tocam esse arquivo são seriais** (sem marcador [P]). O novo componente `ThirdFlavorModal.tsx` e o arquivo de teste são paralelizáveis.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Nenhuma infraestrutura nova necessária — projeto existente (React 19 + Vite + Tailwind 4 + Vitest). Verificar que a branch e o ambiente estão prontos.

- [x] T001 [P] Verificar ambiente: branch `008-montagem-pizza-2-sabores` checked out, `npm install` ok, `npm run test` e `npm run build` passando antes de iniciar (baseline SC-006)

**Checkpoint**: Baseline verde — implementação pode começar.

---

## Phase 2: User Story 1 - Confirmação Explícita ao Adicionar o 3º Sabor (Priority: P1) 🎯 MVP

**Goal**: Ao tentar adicionar um 3º sabor (com 2 selecionados), abrir modal informando "até 2 sabores padrão / 3º + R$ 5,00" com **Cancelar** e **Adicionar**. Confirmar mantém o fluxo atual (3º entra + R$ 5,00 via `calcularPrecoPizza`); cancelar não muda nada. 4º sabor segue bloqueado com mensagem explícita de máximo (FR-007).

**Independent Test**: Montar pizza com 2 sabores e tocar num 3º → modal aparece. "Adicionar" → 3º entra e o preço sobe R$ 5,00. "Cancelar" → nada muda. Com 3 sabores, tocar num 4º → bloqueado com mensagem de máximo.

### Tests for User Story 1

- [x] T002 [P] [US1] Escrever testes de componente em `src/components/FlavorSelector.test.tsx`: modal abre na transição 2→3; "Adicionar" inclui o sabor; "Cancelar" não altera seleção/preço; 4º sabor bloqueado (tc-us1)

### Implementation for User Story 1

- [x] T003 [P] [US1] Criar `src/components/ThirdFlavorModal.tsx` — componente `ThirdFlavorModal` com props `{ sabor: Sabor; onConfirm: () => void; onCancel: () => void }`, mensagem "a pizza comporta até 2 sabores como padrão; o 3º sabor possui adicional de R$ 5,00", botões **Cancelar** (secundário) e **Adicionar** (primário `bg-brand-500`), backdrop click ≡ `onCancel`, mesmo padrão visual do `PizzaBuilder` (`fixed inset-0 z-50 bg-black/40`, painel `bg-white rounded-2xl`, mobile `items-end` / `sm:items-center`), legível em 320px (SC-004)
- [x] T004 [US1] Interceptar transição 2→3 no `handleToggle` de `src/components/FlavorSelector.tsx`: com `selected.length === 2` e toque em sabor não selecionado → armazenar candidato em `pendingThirdSabor` (estado transitório, `Sabor | null`) e abrir o modal, sem aplicar a seleção; `onConfirm` → `setSelected(prev => [...prev, sabor])` e limpa `pendingThirdSabor`; `onCancel` → apenas limpa `pendingThirdSabor` (FR-002/FR-004/FR-005/FR-006)
- [x] T005 [US1] Garantir bloqueio do 4º sabor em `src/components/FlavorSelector.tsx`: `selected.length === 3` + toque em não selecionado → botões `disabled` (mantém `opacity-40`), e mensagem explícita "máximo de 3 sabores por pizza" visível no indicador (FR-007)
- [x] T006 [US1] Renderizar `ThirdFlavorModal` condicionalmente em `src/components/FlavorSelector.tsx` quando `pendingThirdSabor` não for `null`, passando `sabor`/`onConfirm`/`onCancel` conforme o contrato (`contracts/ui-contracts.md` §1-§2)

**Checkpoint**: US1 funcional e testável de forma independente.

---

## Phase 3: User Story 2 - Labels Claros: 2 Sabores Padrão, 3º Excepcional (Priority: P1)

**Goal**: O indicador de contagem comunica a regra "2 sabores padrão / 3º + R$ 5,00" por estado de seleção, substituindo o texto neutro "N de 3 sabores selecionados" (FR-008).

**Independent Test**: Abrir a montagem e verificar que o indicador comunica "Inclui até 2 sabores como padrão" (0 selecionados), "2 sabores (padrão) • 3º sabor + R$ 5,00" (2 selecionados) e "3º sabor + R$ 5,00 aplicado • máximo 3 sabores" (3 selecionados).

### Tests for User Story 2

- [x] T007 [P] [US2] Escrever testes de componente em `src/components/FlavorSelector.test.tsx` para os textos do indicador nos estados 0/1/2/3 sabores (tc-us2)

### Implementation for User Story 2

- [x] T008 [US2] Atualizar o texto do indicador em `src/components/FlavorSelector.tsx` (bloco `sticky top-0`) conforme `contracts/ui-contracts.md` §3: 0 → "Inclui até 2 sabores como padrão"; 1 → "1 sabor • até 2 no padrão"; 2 → "2 sabores (padrão) • 3º sabor + R$ 5,00"; 3 → "3º sabor + R$ 5,00 aplicado • máximo 3 sabores" (texto pt-BR pode ser refinado, desde que comunique "2 padrão / 3º + R$ 5,00" — D5)

**Checkpoint**: US2 funcional e testável de forma independente.

---

## Phase 4: User Story 3 - Posicionamento Correto do Indicador de Sabores (Priority: P2)

**Goal**: Eliminar o espaçamento superior que faz o indicador "flutuar" sobre os cards, mantendo-o alinhado ao conteúdo e sem sobrepor cards em qualquer ponto da rolagem (FR-009, SC-004).

**Independent Test**: Abrir a montagem — o indicador está alinhado ao conteúdo abaixo, sem espaçamento superior excessivo; em rolagem, não sobrepõe os cards de sabor em viewports ≥ 320px.

### Implementation for User Story 3

- [x] T009 [US3] Corrigir as classes do indicador em `src/components/FlavorSelector.tsx` (atual `sticky top-0 bg-white pb-2 z-10`): revisar espaçamento/background para o indicador ficar alinhado ao bloco de seleção, sem "flutuar" sobre os cards quando parado no topo, e sem sobrepor os cards durante a rolagem (SC-004) — mantendo a sticky (D6: o preço deve permanecer sempre visível)

**Checkpoint**: US3 validado visualmente (375px e 320px).

---

## Phase 5: User Story 4 - Rolagem Automática até o Sabor Pré-selecionado (Priority: P2)

**Goal**: Ao abrir a montagem a partir de um sabor do cardápio, a lista rola automaticamente até o sabor pré-selecionado, uma única vez, sem roubar a rolagem manual posterior (FR-010, FR-011, SC-005).

**Independent Test**: No cardápio, tocar num sabor de categoria distante (ex.: Sensacionais) → a montagem rola e deixa o sabor visível em < 1s; rolagem manual posterior funciona normalmente; sem sabor pré-selecionado → inicia no topo.

### Tests for User Story 4

- [x] T010 [P] [US4] Escrever testes de componente em `src/components/FlavorSelector.test.tsx`: com `preselectedSabor`, `scrollIntoView` é chamado uma única vez na abertura; sem `preselectedSabor`, não há rolagem automática (tc-us4)

### Implementation for User Story 4

- [x] T011 [US4] Adicionar `id={`sabor-${sabor.id}`}` e `scroll-mt` em cada card de sabor em `src/components/FlavorSelector.tsx` (contrato §4)
- [x] T012 [US4] Implementar `useEffect` de rolagem única em `src/components/FlavorSelector.tsx`: quando `preselectedSabor` existe e `hasAutoScrolled` (useRef) é `false`, chamar `document.getElementById('sabor-' + preselectedSabor.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })` após a montagem dos cards e marcar o guard (FR-011); sem `preselectedSabor` → nenhuma rolagem

**Checkpoint**: US4 funcional e testável de forma independente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validações finais exigidas pelo contrato do pipeline (auditorias internas obrigatórias).

- [ ] T013 [P] Rodar auditorias internas obrigatórias no diff da feature: `security-auditor` (OWASP — sem XSS/injection em `ThirdFlavorModal` e `FlavorSelector`; sem dados sensíveis; sem `dangerouslySetInnerHTML`), `a11y-ux-auditor` (modal com foco/teclado, `aria-*`, contraste, labels claras, mobile-first 320px+), `perf-auditor` (sem re-render desnecessário, rolagem < 1s, sem dependências novas)
- [x] T014 Rodar validação final do quickstart.md: `npm run test` e `npm run build` passando (SC-006)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências.
- **US1 (Phase 2)**: Baseline verde (T001). T002 (testes) antes de T003/T004/T005/T006 (TDD opcional — pode rodar em paralelo com a implementação, depois estabiliza).
- **US2 (Phase 3)**: T008 edita o mesmo arquivo de T004/T005/T006 — serial após US1.
- **US3 (Phase 4)**: T009 edita o mesmo bloco do indicador que T008 — serial após US2.
- **US4 (Phase 5)**: T011/T012 editam `FlavorSelector.tsx` — serial após US3.
- **Polish (Phase 6)**: Depende de US1–US4 completas.

### User Story Dependencies

- **US1 (P1)**: Independente — pode começar após a baseline.
- **US2 (P1)**: Independente em comportamento, mas compartilha `FlavorSelector.tsx` com US1 → serial.
- **US3 (P2)**: Remove o espaço do indicador — deve vir antes de US4 (o `scroll-mt` depende da altura final do indicador).
- **US4 (P2)**: Depende da posição final do indicador (US3) para o `scroll-mt` correto.

### Within Each User Story

- Testes podem ser escritos antes (TDD) ou junto da implementação; todos devem passar ao final da fase.
- Implementação antes de integração; história completa antes de avançar para a próxima prioridade.

### Parallel Opportunities

- T001, T002, T003, T007, T010 são [P] (arquivos diferentes: `.specify`/ambiente, `FlavorSelector.test.tsx`, `ThirdFlavorModal.tsx`).
- T013 (auditorias) roda em paralelo à T014 (build) ao final.

---

## Parallel Example: User Story 1

```bash
# Testes e componente novo em paralelo (arquivos diferentes):
Task: "T002 — testes de componente em src/components/FlavorSelector.test.tsx"
Task: "T003 — criar src/components/ThirdFlavorModal.tsx"
# Depois, serial em FlavorSelector.tsx: T004 → T005 → T006
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completa Phase 1 (baseline) e Phase 2 (US1) → modal do 3º sabor funcionando.
2. **STOP and VALIDATE**: US1 testável independentemente.

### Incremental Delivery

1. US1 (modal) → testar/demo
2. US2 (labels) → testar/demo
3. US3 (posicionamento) → validar visual
4. US4 (rolagem) → testar/demo

### Parallel Strategy

- T002/T003 em paralelo (arquivos distintos).
- T007/T008 e T010/T012: testes em paralelo com implementação.
- T013 auditorias em paralelo.

---

## Notes

- [P] tasks = different files, no dependencies.
- Todas as edições em `src/components/FlavorSelector.tsx` são **seriais** (mesmo arquivo).
- **Não tocar**: `src/utils/pricing.ts` (regra de preço — fonte da verdade), `src/types/menu.ts`, `public/menu.json`.
- Preço sempre derivado de `calcularPrecoPizza` — nunca recalcular manualmente.
- Commit após cada task ou grupo lógico; stop nos checkpoints.