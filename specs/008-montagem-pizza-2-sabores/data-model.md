# Data Model — Montagem de Pizza: 2 Sabores Padrão / 3º Excepcional

Esta feature **não altera** nenhuma estrutura de dados persistente. `public/menu.json` e os tipos em `src/types/menu.ts` permanecem como estão. As entidades abaixo documentam apenas o estado/componentes afetados em runtime.

## Entidades existentes (inalteradas)

### `Sabor` (`src/types/menu.ts`)
- `id: string` — identificador estável (usado como chave do card e alvo da rolagem automática)
- `nome: string`, `descricao: string`, `imagem: string`, `categoria_id: string`

### `Categoria` (`src/types/menu.ts`)
- `id`, `nome`, `preco: number`

### Preço da pizza (`src/utils/pricing.ts`)
- `calcularPrecoPizza(sabores, categorias)` → `{ precoBase, acrescimo, total }`
- Regra: `precoBase` = categoria mais cara; `acrescimo` = 5 **somente** quando `sabores.length === 3`. **Intocada.**

## Estado novo (transitório, não persistido)

### `pendingThirdSabor` — `FlavorSelector`
- Tipo: `Sabor | null`
- Semântica: sabor candidato a ser o 3º, aguardando confirmação no modal.
- Transições:
  - `null` → `Sabor` : quando `selected.length === 2` e o usuário toca num sabor ainda não selecionado.
  - `Sabor` → adicionado : "Adicionar" no modal → entra em `selected` e volta a `null`.
  - `Sabor` → `null` : "Cancelar" (ou backdrop click) → descarta, sem alterar `selected`.

### `hasAutoScrolled` — `FlavorSelector`
- Tipo: `boolean` (ou `useRef<boolean>`), default `false`
- Semântica: garante que a rolagem automática (US4) ocorra uma única vez na abertura (FR-011).

## Componentes

### `ThirdFlavorModal` (novo) — `src/components/ThirdFlavorModal.tsx`
- Props: `sabor: Sabor` (o 3º candidato), `onConfirm: () => void`, `onCancel: () => void`
- Sem estado interno persistente; renderiza mensagem + ações "Cancelar" e "Adicionar".
- Backdrop click ≡ `onCancel`.

## Regras de validação (derivadas da spec)

- `selected.length` ∈ [0, 3]; transição 2→3 exige confirmação; transição 3→4 é bloqueada (FR-007).
- Desselecionar de 3→2 remove o `acrescimo` sem modal (edge case da spec).
- Preço reflete `calcularPrecoPizza` — nenhum cálculo novo é introduzido.
