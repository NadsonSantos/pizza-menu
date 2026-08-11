# Contract: order_history localStorage Schema

**Feature**: NAD-6 | **Date**: 2026-08-11

## Overview

This contract defines the `localStorage` schema for the `order_history` key used by the pizza-menu PWA to persist completed orders client-side.

## Storage Key

```
Key: "order_history"
Type: JSON string
Schema: OrderRecord[]
```

## OrderRecord Schema

```typescript
interface OrderRecord {
  id: string;            // UUID v4, ex: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  timestamp: string;     // ISO 8601, ex: "2026-08-10T17:30:00.000Z"
  items: CartItem[];     // Mesmo tipo de CartState.items
  delivery: "entrega" | "retirada";
  payment: "dinheiro" | "cartao" | "pix" | null;
  troco: string;         // "" se não for dinheiro
  addressId: string | null;  // ID do endereço ou null
  subtotal: number;      // Soma dos preços dos itens
  taxaEntrega: number;   // 0 se retirada
  total: number;         // subtotal + taxaEntrega
}
```

## CartItem Schema (referência)

```typescript
interface CartItem {
  id: string;            // UUID v4
  tipo: "pizza" | "bebida";
  nome: string;
  sabores: Sabor[];      // Array de sabores (vazio para bebidas)
  precoUnitario: number;
  quantidade: number;
  observacao: string;
}
```

## Read Contract

```typescript
// src/utils/orderHistory.ts

function readOrderHistory(): OrderRecord[]

// Returns:
// - Array de OrderRecord válidos (pode ser vazio)
// - Nunca retorna null/undefined
// - Itens com formato inválido são descartados silenciosamente
// - localStorage vazio/corrompido → retorna []
```

## Write Contract

```typescript
// src/utils/orderHistory.ts

function saveOrder(order: OrderRecord): void

// Preconditions:
// - order.items.length > 0 (validado pelo caller)
// - order.timestamp é ISO 8601 válido
// - Executado ANTES de dispatch(CLEAR_CART)

// Postconditions:
// - order_history no localStorage contém o novo OrderRecord
// - Se localStorage.setItem falhar (quota), falha silenciosamente
// - NÃO lança exceção — o pedido ainda é enviado via WhatsApp
```

## Filter Contract

```typescript
// src/utils/orderHistory.ts

function getRecentOrders(days?: number): OrderRecord[]

// Parameters:
// - days: número de dias para filtrar (default: 90)

// Returns:
// - OrderRecord[] com timestamp dentro dos últimos N dias
// - Ordenado por timestamp decrescente (mais recente primeiro)

function hasRecentOrders(days?: number): boolean

// Returns:
// - true se existe ≥ 1 OrderRecord dentro dos últimos N dias
// - false caso contrário
```

## Route Contracts

### HomePage — `/`

```
Rota: /
Condição: hasRecentOrders() === true
Renderiza: HomePage
Fallback: MenuPage (rota padrão, comportamento atual)
```

### OrderDetailPage — `/pedido/:id`

```
Rota: /pedido/:id
Parâmetro: id — UUID do OrderRecord
Renderiza: OrderDetailPage
Estado vazio: Se id não encontrado → mensagem "Pedido não encontrado" + link para /
Ações:
  - "Voltar" → navigate('/')
  - "Pedir novamente" → dispatch(ORDER_FROM_HISTORY) + navigate('/carrinho')
```

### CartContext — nova action

```
Action: ORDER_FROM_HISTORY
Payload: { type: 'ORDER_FROM_HISTORY'; order: OrderRecord }
Efeito: Substitui CartState pelos dados do OrderRecord
  - items = order.items
  - delivery = order.delivery
  - selectedAddressId = order.addressId (se endereço ainda existe)
  - payment = null (reset)
  - troco = '' (reset)
```

## Error Handling Contract

| Cenário | Comportamento |
|---------|---------------|
| `localStorage` indisponível (quota) | `saveOrder` falha silenciosamente. Pedido enviado via WhatsApp normalmente. |
| `localStorage` corrompido (`JSON.parse` falha) | `readOrderHistory` retorna `[]`. App comporta-se como "novo usuário". |
| `OrderRecord` com campo ausente | Descartado do array durante leitura. |
| `timestamp` inválido | Registro ignorado no filtro de 90 dias. |
| `/pedido/:id` com id inexistente | Mensagem amigável + link para HomePage/MenuPage. |
| Carrinho já populado ao usar "Pedir novamente" | Carrinho atual é SUBSTITUÍDO (não merge). Confirmação visual implícita. |
