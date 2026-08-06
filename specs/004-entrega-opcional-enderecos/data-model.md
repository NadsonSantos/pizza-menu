# Data Model: Entrega Opcional com Gerenciamento de Endereços

**Feature**: `004-entrega-opcional-enderecos`  
**Date**: 2025-08-06

## New Entities

### Address

```typescript
// src/types/address.ts
export interface Address {
  id: string;            // crypto.randomUUID()
  rua: string;           // obrigatório, maxLength 100
  numero: string;        // obrigatório, maxLength 10
  complemento: string;   // opcional, maxLength 50
  pontoReferencia: string; // opcional, maxLength 100
}
```

### AddressState

```typescript
export interface AddressState {
  addresses: Address[];     // máx. 2
  selectedId: string | null; // referência ao endereço ativo no checkout
}
```

### AddressAction (useReducer)

```typescript
export type AddressAction =
  | { type: 'LOAD'; addresses: Address[]; selectedId: string | null }
  | { type: 'ADD'; address: Address }
  | { type: 'REMOVE'; id: string }
  | { type: 'SELECT'; id: string | null };
```

### AddressContextValue

```typescript
export interface AddressContextValue {
  state: AddressState;
  addAddress: (addr: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  selectAddress: (id: string | null) => void;
  getSelectedAddress: () => Address | undefined;
}
```

## Modified Entities

### CartState (extensão)

```typescript
// src/types/cart.ts — campo adicionado
export interface CartState {
  items: CartItem[];
  delivery: DeliveryMode;
  payment: PaymentMethod | null;
  troco: string;
  selectedAddressId: string | null;  // ← NOVO
}
```

### CartAction (extensão)

```typescript
export type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QUANTITY'; id: string; quantidade: number }
  | { type: 'SET_DELIVERY'; mode: DeliveryMode }
  | { type: 'SET_PAYMENT'; method: PaymentMethod }
  | { type: 'SET_TROCO'; troco: string }
  | { type: 'SET_ADDRESS'; id: string | null }  // ← NOVO
  | { type: 'CLEAR_CART' };
```

### CartContext (lógica alterada)

```typescript
// Dentro do CartProvider:
const { menu } = useMenu();
const taxaBase = menu?.pizzaria?.taxa_entrega ?? 5;

const taxaEntrega = state.delivery === 'entrega' ? taxaBase : 0;
const total = subtotal + taxaEntrega;
```

### formatWhatsAppMessage (assinatura alterada)

```typescript
export function formatWhatsAppMessage(
  state: CartState,
  pizzariaNome: string,
  subtotal: number,
  taxaEntrega: number,
  total: number,
  endereco?: string  // ← NOVO parâmetro opcional
): string
```

## localStorage Schema

```json
{
  "addresses": [
    {
      "id": "uuid-v4",
      "rua": "Rua das Pizzas",
      "numero": "123",
      "complemento": "Apto 45",
      "pontoReferencia": "Próximo ao mercado"
    }
  ],
  "selectedId": "uuid-v4"
}
```

**Chave**: `pizza-menu-addresses`  
**Validação na carga**: Checar se é array, se ≤ 2 itens, se campos obrigatórios (`rua`, `numero`) existem. Se inválido, resetar para estado vazio.

## Unchanged Entities

| Entity/Module | Status |
|--------------|--------|
| `Sabor`, `Categoria`, `Bebida`, `MenuData`, `PizzariaInfo` | Inalterados |
| `CartItem` | Inalterado |
| `calcularPrecoPizza`, `formatCurrency` | Inalterados |
| `loadMenu`, `validateMenu` | Inalterados |
| `MenuProvider`, `useMenu` | Inalterados |

## State Transitions

### Delivery Toggle

```
entrega ──[clica Retirada]──▶ retirada
retirada ──[clica Entrega]──▶ entrega
```

### Address Selection

```
selectedId: null ──[adiciona 1º endereço]──▶ selectedId: "<id-1>"
selectedId: "<id-1>" ──[seleciona outro]──▶ selectedId: "<id-2>"
selectedId: "<id-1>" ──[remove endereço ativo]──▶ selectedId: null
selectedId: "<id-1>" ──[seleciona retirada]──▶ selectedId: mantido (não limpo)
```

**Nota**: Selecionar "Retirada" NÃO limpa `selectedAddressId`. O endereço permanece selecionado para quando o usuário voltar a "Entrega".
