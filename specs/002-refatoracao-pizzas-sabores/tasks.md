# Tasks: Refatoração Pizzas e Sabores

**Input**: Design documents from `specs/002-refatoracao-pizzas-sabores/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Not requested. Validation is manual against acceptance criteria + build.

**Organization**: Tasks grouped by functional domain — cada fase entrega um incremento testável da refatoração.

## Format: `- [ ] [TaskID] [P?] Description with file path`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- File paths relativos à raiz do repo

---

## Phase 1: Dados — menu.json + Tipos TypeScript

**Goal**: Novo `menu.json` com 32 sabores planos + `categoria_id`. Tipos atualizados refletindo a nova estrutura.

**Independent Test**: `python3 -m json.tool public/menu.json` válido. `npx tsc --noEmit` passa nos novos tipos.

### Tasks

- [ ] T040 [P] Reescrever `public/menu.json` — 3 categorias (Trad R$30, Esp R$35, Sens R$40), 32 sabores planos com `categoria_id`, 4 bebidas inalteradas
- [ ] T041 [P] Atualizar `src/types/menu.ts` — `Sabor` ganha `categoria_id: string`, `Categoria` perde `sabores: Sabor[]`, `MenuData` ganha `sabores: Sabor[]`

### 🛑 Phase 1 Validation

```bash
python3 -m json.tool public/menu.json   # JSON válido
python3 -c "
import json
with open('public/menu.json') as f: d = json.load(f)
cats = {c['id'] for c in d['categorias']}
for s in d['sabores']:
    assert s['categoria_id'] in cats, f'{s[\"nome\"]}: cat inválida'
    assert 'preco' not in s, f'{s[\"nome\"]}: sabor com preco'
print(f'OK — {len(d[\"sabores\"])} sabores, {len(cats)} categorias')
"
npx tsc --noEmit  # erros esperados nos consumers, mas tipos em si devem compilar
```

✅ **Gate**: menu.json válido com 32 sabores + tipos compilando → proceed to Phase 2.

---

## Phase 2: Lógica de Negócio — pricing.ts + loadMenu.ts

**Goal**: `calcularPrecoPizza` usa lookup por categoria. `loadMenu` valida nova estrutura.

**Independent Test**: 4 cenários de preço batem. Validação rejeita `categoria_id` inválido e sabor com `preco`.

### Tasks

- [ ] T042 [P] Atualizar `src/utils/pricing.ts` — `calcularPrecoPizza(sabores, categorias)` faz lookup por `categoria_id`, retorna `{ precoBase, acrescimo, total }` com acréscimo de R$5 apenas se `sabores.length === 3`
- [ ] T043 [P] Atualizar `src/utils/loadMenu.ts` — validar que todo `sabor.categoria_id` referencia categoria existente, que nenhum sabor tem `preco`, e que toda categoria tem `preco > 0`

### 🛑 Phase 2 Validation

```typescript
// Testar no console do browser ou via script:
const cats = [{ id: 'tradicionais', preco: 30 }, { id: 'especiais', preco: 35 }, { id: 'sensacionais', preco: 40 }];
const sabores = [
  { id: 'c1', categoria_id: 'tradicionais' },  // Calabresa
  { id: 'f1', categoria_id: 'especiais' },      // Frango Catupiry
  { id: 'q1', categoria_id: 'sensacionais' },   // 4 Queijos
];

calcularPrecoPizza([sabores[0], sabores[0]], cats)  // 2 Trad → { total: 30 }
calcularPrecoPizza([sabores[0], sabores[1]], cats)  // Trad+Esp → { total: 35 }
calcularPrecoPizza([sabores[0], sabores[2]], cats)  // Trad+Sens → { total: 40 }
calcularPrecoPizza([sabores[0], sabores[1], sabores[2]], cats)  // 3 sabores → { total: 45 }
```

✅ **Gate**: Todos os 4 casos de preço confirmados + validação rejeita erros → proceed to Phase 3.

---

## Phase 3: Context — MenuContext.tsx

**Goal**: `MenuContext` agrupa sabores por `categoria_id` em runtime para consumo pelos componentes.

**Independent Test**: App carrega, menu exposto pelo context tem `sabores` plano e componente consegue listar sabores por categoria.

### Tasks

- [ ] T044 Atualizar `src/context/MenuContext.tsx` — adicionar `getSaboresByCategory(categoriaId)` ou derivar map no provider para agrupar `menu.sabores` por `categoria_id`

### 🛑 Phase 3 Validation

```bash
npm run dev
# Abrir app → cardápio carrega (pode quebrar visualmente ainda, mas sem crash)
# Console: verificar que useMenu().menu.sabores é array com 32 itens
```

✅ **Gate**: App carrega sem crash, 32 sabores no context → proceed to Phase 4.

---

## Phase 4: Componentes — FlavorSelector, PizzaBuilder, MenuPage

**Goal**: Todos os componentes adaptados à nova estrutura. Navegação por categorias funcional. Seletor com limite "N/3" e acréscimo R$5 visível.

**Independent Test**: Navegar por categorias, selecionar 1-3 sabores, ver preço correto, adicionar ao carrinho.

### Tasks

- [ ] T045 [P] Atualizar `src/components/FlavorSelector.tsx` — restaurar limite "N/3 sabores", exibir "+R$5,00" quando 3 selecionados, chamar `calcularPrecoPizza` com array de categorias
- [ ] T046 [P] Atualizar `src/components/PizzaBuilder.tsx` — passar `menu.categorias` para `FlavorSelector`, adaptar `handleConfirm` para nova assinatura
- [ ] T047 Atualizar `src/pages/MenuPage.tsx` — agrupar `menu.sabores` por `categoria_id` para exibição nas tabs, passar categorias para PizzaBuilder

### 🛑 Phase 4 Validation

```
Abrir app → 3 tabs de categoria visíveis (Tradicionais, Especiais, Sensacionais)
Clicar "Tradicionais" → 13 sabores listados
Selecionar 2 sabores → preço R$30, sem "+R$5"
Selecionar 3º sabor → preço R$35 (R$30 + R$5), badge "+R$5,00" visível
Tentar 4º sabor → bloqueado "Máximo de 3 sabores"
Adicionar ao carrinho → item aparece com preço correto
Clicar "Bebidas" → 4 bebidas com botão "Adicionar"
```

✅ **Gate**: Cardápio navegável, 32 sabores, preço correto, limite 3 com acréscimo → proceed to Phase 5.

---

## Phase 5: Validação & Polish

**Goal**: Build limpo, README atualizado, commit.

**Independent Test**: `npm run build` passa. Dono consegue seguir README para editar menu.

### Tasks

- [ ] T048 [P] Atualizar `README.md` — documentar novo formato do `menu.json` (sabores planos + `categoria_id`), exemplos de adicionar sabor e mudar preço
- [ ] T049 Build e validação final: `npx tsc --noEmit && npm run build`
- [ ] T050 Verificar todos os 8 critérios de sucesso (SC-001 a SC-008) contra a spec

### 🛑 Phase 5 Validation

```bash
npm run build   # Build limpo, sem erros
# Lighthouse: sem regressão de PWA score
# Verificar SC-001 a SC-008 manualmente
```

✅ **Gate**: Build limpo + todos os SCs atendidos → feature completa.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Dados) ──────────────────────────────────────────────────────────────►
      │
      ▼
Phase 2 (Lógica) ─────────────────────────────────────────────────────────────►
      │
      ▼
Phase 3 (Context) ────────────────────────────────────────────────────────────►
      │
      ▼
Phase 4 (Componentes) ────────────────────────────────────────────────────────►
      │
      ▼
Phase 5 (Polish) ─────────────────────────────────────────────────────────────►
```

### Parallel Opportunities

| Phase | Paralelas |
|-------|----------|
| 1 | T040 ║ T041 |
| 2 | T042 ║ T043 |
| 3 | (sequencial — depende da Phase 2) |
| 4 | T045 ║ T046; depois T047 |
| 5 | T048 pode rodar em paralelo com T049 |

### Files Changed (por fase)

| Fase | Arquivos |
|------|---------|
| 1 | `public/menu.json`, `src/types/menu.ts` |
| 2 | `src/utils/pricing.ts`, `src/utils/loadMenu.ts` |
| 3 | `src/context/MenuContext.tsx` |
| 4 | `src/components/FlavorSelector.tsx`, `src/components/PizzaBuilder.tsx`, `src/pages/MenuPage.tsx` |
| 5 | `README.md` |

---

## Implementation Strategy

### Ordem recomendada

1. Fase 1 primeiro — menu.json e tipos são a fundação
2. Fase 2 em seguida — lógica de negócio depende dos tipos
3. Fase 3 — context adapta os dados para componentes
4. Fase 4 — componentes são a camada final
5. Fase 5 — validação e documentação

### Tempo estimado

~1 hora (refatoração de 9 arquivos, sem novas dependências, sem novos componentes).

### Rollback

Se algo quebrar: `git checkout main -- src/ public/menu.json` restaura o estado anterior.
