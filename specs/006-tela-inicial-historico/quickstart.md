# Quickstart: Tela Inicial Dinâmica com Histórico de Compras

**Feature**: NAD-6 | **Date**: 2026-08-11

## Pré-requisitos

- Node.js 18+
- `npm install` executado na raiz do projeto
- Branch `006-tela-inicial-historico` (já criada)

## Ordem de implementação

Seguir estritamente a ordem abaixo — cada passo depende do anterior:

### Passo 1: Tipagem (`src/types/cart.ts`)

Adicionar interface `OrderRecord` ao arquivo existente:

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

### Passo 2: Utilitários de localStorage (`src/utils/orderHistory.ts`)

Criar novo arquivo com 3 funções exportadas:

- `readOrderHistory(): OrderRecord[]` — lê e valida do localStorage
- `saveOrder(order: OrderRecord): void` — append + salva, try-catch silencioso
- `getRecentOrders(days?: number): OrderRecord[]` — filtra por N dias + ordena desc
- `hasRecentOrders(days?: number): boolean` — wrapper booleano

### Passo 3: Nova action no CartContext (`src/context/CartContext.tsx`)

Adicionar ao `CartAction` type union:

```typescript
| { type: 'ORDER_FROM_HISTORY'; order: OrderRecord }
```

Adicionar case no `cartReducer`:

```typescript
case 'ORDER_FROM_HISTORY':
  return {
    ...initialState,
    items: action.order.items,
    delivery: action.order.delivery,
    selectedAddressId: action.order.addressId,
    // payment e troco resetados
  };
```

### Passo 4: Salvar pedido no WhatsAppButton (`src/components/WhatsAppButton.tsx`)

Modificar `handleFinish`:

```typescript
const handleFinish = () => {
  // ... código existente de endereço, msg, url ...
  window.open(url, '_blank');

  // NOVO: salvar pedido antes de limpar carrinho
  saveOrder({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    items: state.items,
    delivery: state.delivery,
    payment: state.payment,
    troco: state.troco,
    addressId: state.selectedAddressId,
    subtotal,
    taxaEntrega,
    total,
  });

  dispatch({ type: 'CLEAR_CART' });
};
```

### Passo 5: Roteamento condicional (`src/App.tsx`)

Modificar `App` para decidir rota `/` com base no histórico:

```typescript
import { hasRecentOrders } from './utils/orderHistory';
import HomePage from './pages/HomePage';

// Após splash:
const recentOrders = hasRecentOrders();

return (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={recentOrders ? <HomePage /> : <MenuPage />} />
      {/* ... demais rotas existentes ... */}
      <Route path="/pedido/:id" element={<OrderDetailPage />} />
    </Route>
  </Routes>
);
```

### Passo 6: HomePage (`src/pages/HomePage.tsx`)

Criar novo componente:

- Lê `getRecentOrders()` e renderiza até 3 cards
- Cada card: descrição resumida + valor total + "Ver mais" link
- Botão "Novo Pedido" → `navigate('/cardapio')` (adicionar rota alias se necessário)
- Estado vazio (0 pedidos recentes): não deveria ocorrer (App já filtra), mas defensivamente renderizar fallback

### Passo 7: OrderDetailPage (`src/pages/OrderDetailPage.tsx`)

Criar novo componente:

- Lê `useParams().id`, busca no `readOrderHistory()`
- Exibe detalhes completos (itens, quantidades, valores, entrega, pagamento)
- Botão "Voltar" → `navigate('/')`
- Botão "Pedir novamente" → `dispatch({ type: 'ORDER_FROM_HISTORY', order })` + `navigate('/carrinho')`
- Estado "não encontrado": mensagem + link para `/`

### Passo 8: Verificação

```bash
npm run build        # Deve compilar sem erros
npm run dev          # Teste manual:
                     # 1. Finalizar pedido → verificar localStorage
                     # 2. Recarregar → ver HomePage com histórico
                     # 3. Limpar localStorage → ver MenuPage
                     # 4. "Pedir novamente" → carrinho populado
```

## Pontos de atenção

- **Ordem das operações no WhatsAppButton**: `window.open` → `saveOrder` → `dispatch(CLEAR_CART)`. Nunca inverter `saveOrder` com `CLEAR_CART`.
- **Defensive reading**: Toda leitura do localStorage usa try-catch. Nunca assumir que os dados são válidos.
- **CartContext purity**: O reducer `ORDER_FROM_HISTORY` não acessa localStorage — recebe os dados prontos via payload.
- **Layout consistency**: HomePage e OrderDetailPage usam o mesmo `<Layout>` que as demais páginas. Não criar layout alternativo.
