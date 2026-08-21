# Tasks: Atualização dos Ingredientes dos Sabores no Cardápio

**Input**: Design documents from `/specs/009-atualizar-ingredientes-sabores/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/data-contract.md

**Tests**: Nenhum teste novo é necessário — o `plan.md` (roteiro D5) confirma que os testes existentes não dependem do texto de `descricao`; a validação é feita por conferência dos 32 valores contra `contracts/data-contract.md` + `npm run test` / `npm run build` (SC-003, SC-004).

**Organization**: Tasks agrupadas por user story (spec.md). Mudança **exclusivamente de dados** em `public/menu.json` — nenhum arquivo de `src/` é alterado.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: User story à qual a task pertence (US1, US2)
- Paths exatos em cada descrição

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Garantir o estado correto do repositório antes da edição

- [X] T001 Confirmar que o working tree está na branch `009-atualizar-ingredientes-sabores` (commit `2859c26`) e que `specs/009-atualizar-ingredientes-sabores/contracts/data-contract.md` está presente

---

## Phase 2: Foundational (Blocking Prerequisites)

Nenhuma task fundacional — feature 100% de dados estáticos, sem infraestrutura nova (plan.md §Project Structure).

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Cliente vê a lista de ingredientes correta de cada sabor (Priority: P1) 🎯 MVP

**Goal**: Substituir o campo `descricao` dos 32 sabores em `public/menu.json` pela tabela oficial de ingredientes, normalizada em caixa baixa, preservando conteúdo e ordem (FR-001, FR-005).

**Independent Test**: Conferir cada `descricao` dos 32 sabores contra `contracts/data-contract.md` (13 tradicionais + 16 especiais + 3 sensacionais); abrir o cardápio e verificar que os cards exibem a lista oficial.

### Implementation for User Story 1

> Tasks T002–T004 alteram o **mesmo arquivo** (`public/menu.json`) — devem rodar em **sequência**, nunca em paralelo. Nenhum campo além de `descricao` pode mudar (FR-002, FR-003); nomes "4 Queijos"/"3 Queijos" permanecem (mapeamento por `id`).

- [X] T002 [US1] Atualizar `descricao` dos 13 sabores tradicionais (`baiana` … `romeu-e-julieta`) em `public/menu.json` conforme §Tradicionais de `specs/009-atualizar-ingredientes-sabores/contracts/data-contract.md` (texto em caixa baixa, ex.: `baiana` → "mussarela, calabresa ralada e pimenta")
- [X] T003 [US1] Atualizar `descricao` dos 16 sabores especiais (`atum` … `tres-queijos`) em `public/menu.json` conforme §Especiais de `specs/009-atualizar-ingredientes-sabores/contracts/data-contract.md` (depende de T002 — mesmo arquivo)
- [X] T004 [US1] Atualizar `descricao` dos 3 sabores sensacionais (`carne-seca`, `pepperoni`, `quatro-queijos`) em `public/menu.json` conforme §Sensacionais de `specs/009-atualizar-ingredientes-sabores/contracts/data-contract.md` (depende de T003 — mesmo arquivo)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Ingredientes consistentes entre cardápio e montagem da pizza (Priority: P2)

**Goal**: Garantir que cardápio (`MenuPage`) e montagem (`PizzaCard`/`FlavorSelector`) exibem a mesma lista de ingredientes, provinda da fonte única `menu.json` — sem texto duplicado ou divergente (FR-004).

**Independent Test**: Abrir o cardápio, selecionar um sabor e abrir a montagem — a descrição deve ser idêntica nas duas telas.

### Implementation for User Story 2

- [X] T005 [US2] Verificar que `public/menu.json` é a única fonte de `descricao` (nenhum texto de ingrediente hardcoded em `src/`) e que a edição não alterou nenhum arquivo de `src/` (git status contém apenas `public/menu.json` e `specs/009-atualizar-ingredientes-sabores/tasks.md`)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Validações finais e entrega (SC-001 a SC-004)

- [X] T006 Validar que `public/menu.json` permanece JSON válido (`node -e "JSON.parse(...)"`) e que o `git diff` de `public/menu.json` altera **somente** valores de `descricao` — nenhum `id`/`nome`/`categoria_id`/`imagem`/preço mudou (SC-002, SC-004)
- [X] T007 Rodar `npm run test` — todos os testes existentes passam (SC-003)
- [X] T008 Rodar `npm run build` — build de produção sem erros (SC-003)
- [X] T009 Marcar todas as tasks como `[X]`, commitar (`specs/009-atualizar-ingredientes-sabores/tasks.md` + `public/menu.json`), fazer push da branch `009-atualizar-ingredientes-sabores` e abrir/atualizar o PR mencionando o Code Review Agent

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: N/A (vazio para esta feature)
- **User Stories (Phase 3+)**: US1 (P1) primeiro; US2 (P2) depois (valida o resultado de US1)
- **Polish (Final Phase)**: Depends on US1 e US2 completas

### User Story Dependencies

- **User Story 1 (P1)**: Não depende de outras stories
- **User Story 2 (P2)**: Depende de US1 (valida a consistência do dado já atualizado)

### Within Each User Story

- T002 → T003 → T004 em **sequência** (mesmo arquivo `public/menu.json`)
- T005 depois de US1 concluída

### Parallel Opportunities

- Nenhuma task paralelizável nesta feature: todas as tasks de implementação (T002–T004) alteram o mesmo arquivo; as validações (T005–T008) dependem da edição concluída. A execução é sequencial por natureza.

---

## Parallel Example: User Story 1

```bash
# N/A — T002, T003 e T004 escrevem no MESMO arquivo (public/menu.json).
# Executar em sequência: T002 → T003 → T004.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 3: User Story 1 (T002, T003, T004)
3. **STOP and VALIDATE**: conferir os 32 valores contra `contracts/data-contract.md` + validar JSON
4. Deploy/demo if ready

### Incremental Delivery

1. Setup → branch confirmada
2. US1 (13 + 16 + 3 descrições) → validar JSON e diff → MVP completo (mudança de dados única, não há entrega incremental parcial)
3. US2 → verificação de fonte única
4. Polish → testes, build, push, PR

---

## Notes

- **[P] tasks = different files, no dependencies** — nesta feature todas as tasks de edição compartilham `public/menu.json`, portanto **execução estritamente sequencial**.
- **[Story] label** mapeia a task para a user story específica (spec.md).
- **Caixa baixa**: os valores do data-contract já vêm normalizados em minúsculas (decisão do dono na aprovação da spec) — copiar com exatidão, preservando acentos (orégano, pimentão) e a conjunção final "e".
- **Não renomear**: "4 Queijos" (`quatro-queijos`) e "3 Queijos" (`tres-queijos`) permanecem com os `nome` atuais.
- **Não tocar**: `src/`, preços, `categorias`, `pizzaria`, `bebidas`, e os campos `id`/`nome`/`categoria_id`/`imagem` dos sabores.
- Commit após cada task ou grupo lógico (T001–T009 → um único commit de implementação ao final, com mensagem `feat(NAD-9)`).
- Stop em qualquer checkpoint para validar a story independentemente.