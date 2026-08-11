# Data Model: Tela Inicial Dinâmica com Histórico de Compras

**Feature**: NAD-6 | **Date**: 2026-08-11

## Entities

### OrderRecord

Representa um pedido finalizado, armazenado em `localStorage.order_history[]`.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | `string` (UUID v4) | ✅ | Identificador único do pedido |
| `timestamp` | `string` (ISO 8601) | ✅ | Data/hora da finalização, gerado por `new Date().toISOString()` |
| `items` | `CartItem[]` | ✅ | Itens do carrinho no momento da finalização |
| `delivery` | `'entrega' \| 'retirada'` | ✅ | Modo de entrega selecionado |
| `payment` | `'dinheiro' \| 'cartao' \| 'pix' \| null` | ✅ | Forma de pagamento (pode ser null se bug — defensivo) |
| `troco` | `string` | ✅ | Valor do troco (string vazia se não aplicável) |
| `addressId` | `string \| null` | ✅ | ID do endereço selecionado (null se retirada) |
| `subtotal` | `number` | ✅ | Soma dos itens antes da taxa |
| `taxaEntrega` | `number` | ✅ | Taxa de entrega (0 se retirada) |
| `total` | `number` | ✅ | Total do pedido (subtotal + taxaEntrega) |

**TypeScript definition** (`src/types/cart.ts`):

```typescript
export interface OrderRecord {
  id: string;
  timestamp: string;
  items: CartItem[];
  delivery: DeliveryMode;
  payment: PaymentMethod | null;
  troco: string;
  addressId: string | null;
  subtotal: number;
  taxaEntrega: number;
  total: number;
}
```

**Storage schema** (`localStorage.order_history`):

```typescript
// Chave: "order_history"
// Valor: JSON.stringify(OrderRecord[])
```

**Validation rules**:
- `items.length > 0` (defensivo: não salvar se vazio)
- `timestamp` parseável por `new Date()` (defensivo: ignorar registros com timestamp inválido no filtro)
- `id` string não-vazia
- `total` >= 0

### Derived Types

| Tipo | Origem | Descrição |
|------|--------|-----------|
| `hasRecentOrders: boolean` | Computado de `order_history` filtrando por 90 dias | Controla roteamento condicional pós-splash |
| `recentOrders: OrderRecord[]` | `order_history` filtrado e ordenado por `timestamp` desc, limitado a 3 | Dados para renderização da HomePage |

## State Transitions

### Ciclo de vida de um OrderRecord

```
[Carrinho preenchido]
    │
    ▼
[Usuário clica "Finalizar Pedido — WhatsApp"]
    │
    ▼
[WhatsAppButton.handleFinish]:
    1. Abre WhatsApp (window.open)
    2. Cria OrderRecord com state atual + timestamp
    3. Lê order_history do localStorage
    4. Append OrderRecord ao array
    5. Salva array no localStorage
    6. dispatch(CLEAR_CART)
    │
    ▼
[OrderRecord persistido] ────► [Leitura na HomePage (filtro 90d)]
    │
    ▼ (após 90 dias)
[Excluído do filtro de elegibilidade — não aparece na HomePage]
```

### Ciclo "Pedir novamente"

```
[Usuário na OrderDetailPage]
    │
    ▼
[Clica "Pedir novamente"]
    │
    ▼
[dispatch({ type: 'ORDER_FROM_HISTORY', order })]:
    1. items = order.items (cópia)
    2. delivery = order.delivery
    3. selectedAddressId = order.addressId (se ainda existir no AddressContext)
    4. payment = null, troco = '' (reset)
    │
    ▼
[navigate('/carrinho')]
```

## Relationships

```
OrderRecord.items[] ──► CartItem (reusa tipo existente)
OrderRecord.addressId ──► Address.id (referência, pode ser dangling)
```

**Nota**: `OrderRecord` não referencia `menu.json`. Se um sabor for removido do cardápio, o registro histórico ainda preserva os dados do `CartItem` (nome, preço, etc.), permitindo visualização e recompra sem depender do estado atual do menu.
