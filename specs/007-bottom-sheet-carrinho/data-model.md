# Data Model: Bottom Sheet do Carrinho

**Feature**: `007-bottom-sheet-carrinho` | **Date**: 2026-08-12

## Entity: CartBottomSheet (Component)

Componente React puro — sem entidade de backend ou armazenamento persistente.

### Props Interface

```typescript
interface CartBottomSheetProps {
  /** Quantidade total de itens no carrinho (soma de quantidades) */
  itemCount: number;
  /** Valor total do carrinho em centavos (subtotal + taxa de entrega) */
  total: number;
  /** Callback chamado quando o Bottom Sheet completa animação de saída */
  onExitComplete?: () => void;
}
```

### Internal State

```typescript
interface BottomSheetState {
  /** Controla se o componente está saindo (animação de slide-down) */
  exiting: boolean;
  /** Altura em pixels do elemento DOM, medida via ResizeObserver */
  height: number;
}
```

**State transitions**:

```
[itemCount > 0] → mounted (exiting=false)
[itemCount === 0, exiting=false] → exiting=true (inicia animação)
[exiting=true, transition end] → onExitComplete() → unmounted
```

### Derived Values (do CartContext)

| Campo | Origem | Cálculo |
|-------|--------|---------|
| `itemCount` | `CartContext.itemCount` | `state.items.reduce((s, i) => s + i.quantidade, 0)` |
| `total` | `CartContext.total` | `subtotal + taxaEntrega` (entrega) ou `subtotal` (retirada) |
| `isVisible` | `itemCount > 0` | Booleano derivado |

### Display Formatting

| Campo | Formato | Exemplo |
|-------|---------|---------|
| Contador | `"{N} item"` (singular) / `"{N} itens"` (plural) | "1 item", "3 itens" |
| Total | `formatCurrency(total)` — já existe em `utils/pricing.ts` | "R$ 54,90" |
| Botão CTA | Texto fixo | "Ver Carrinho" |

### Relationships

```
CartContext (existente)
  ├── itemCount ──→ CartBottomSheet.itemCount
  ├── total ──────→ CartBottomSheet.total
  └── state.items → (itemCount > 0 ? render : hide)

MenuPage (alterada)
  ├── lê CartContext
  ├── renderiza CartBottomSheet condicionalmente
  └── aplica padding-bottom dinâmico na lista
```

## Validation Rules

1. `itemCount` ≥ 0 (nunca negativo)
2. `total` ≥ 0 (nunca negativo)
3. Bottom Sheet só renderiza se `itemCount > 0`
4. Animação de saída dispara quando `itemCount` transita de >0 para 0
5. Padding-bottom da lista = altura do Bottom Sheet + safe-area-inset-bottom
