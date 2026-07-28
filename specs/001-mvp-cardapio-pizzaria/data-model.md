# Data Model: MVP Cardápio Digital de Pizzaria

**Feature**: `001-mvp-cardapio-pizzaria`
**Date**: 2025-07-28

## Entity Relationship

```
MenuData (JSON estático — fonte de verdade)
├── PizzariaInfo
│   ├── nome: string
│   ├── whatsapp: string
│   └── taxa_entrega: number
├── Categoria[] (tipo: 'pizza')
│   ├── id: string
│   ├── nome: string
│   ├── preco: number
│   └── Sabor[]
│       ├── id: string
│       ├── nome: string
│       ├── descricao: string
│       └── imagem: string
└── Bebida[] (tipo: 'bebida')
    ├── id: string
    ├── nome: string
    ├── preco: number
    └── imagem: string

CartState (em memória — efêmero, por sessão)
├── CartItem[]
│   ├── id: string (UUID)
│   ├── tipo: 'pizza' | 'bebida'
│   ├── nome: string
│   ├── sabores: Sabor[] (ref do MenuData)
│   ├── precoUnitario: number (calculado)
│   ├── quantidade: number
│   └── observacao: string
├── delivery: 'entrega' | 'retirada'
├── payment: 'dinheiro' | 'cartao' | 'pix' | null
└── troco: string
```

## Entities

### Categoria (fonte: menu.json)

Representa uma faixa de preço de pizzas.

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| `id` | `string` | Identificador único (ex: `"tradicionais"`) | Required, non-empty |
| `nome` | `string` | Nome de exibição (ex: `"Tradicionais Simples"`) | Required, non-empty |
| `tipo` | `"pizza"` | Discriminador fixo | Must be `"pizza"` |
| `preco` | `number` | Preço base da categoria (R$) | Required, > 0 |
| `sabores` | `Sabor[]` | Lista de sabores nesta categoria | Required, min 1 item |

### Sabor (fonte: menu.json)

Um sabor de pizza disponível.

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| `id` | `string` | Identificador único (ex: `"mussarela"`) | Required, non-empty |
| `nome` | `string` | Nome de exibição (ex: `"Mussarela"`) | Required, non-empty |
| `descricao` | `string` | Descrição curta (ex: `"Queijo mussarela e tomate"`) | Required |
| `imagem` | `string` | Caminho relativo da imagem (ex: `"imagens/mussarela.jpg"`) | Optional, vazio = placeholder |

### Bebida (fonte: menu.json)

Item simples do cardápio.

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| `id` | `string` | Identificador único (ex: `"pepsi"`) | Required, non-empty |
| `nome` | `string` | Nome do produto (ex: `"Pepsi Lata 350ml"`) | Required, non-empty |
| `preco` | `number` | Preço unitário (R$) | Required, > 0 |
| `imagem` | `string` | Caminho relativo da imagem | Optional, vazio = placeholder |

### PizzariaInfo (fonte: menu.json)

Dados do estabelecimento.

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| `nome` | `string` | Nome da pizzaria | Required, non-empty |
| `whatsapp` | `string` | Número WhatsApp (DDI+DDD+NUM) | Required, digits only |
| `taxa_entrega` | `number` | Taxa de entrega em R$ | Required, ≥ 0 |

### CartItem (em memória)

Um item no carrinho do cliente.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `string` | UUID v4 gerado ao adicionar |
| `tipo` | `'pizza' \| 'bebida'` | Discriminador |
| `nome` | `string` | Nome da pizza ou bebida |
| `sabores` | `Sabor[]` | Sabores selecionados (vazio para bebidas) |
| `precoUnitario` | `number` | Preço calculado por unidade |
| `quantidade` | `number` | Quantidade (≥ 1) |
| `observacao` | `string` | Texto livre (ex: "sem cebola") |

### CartState (em memória)

Estado completo do carrinho + finalização.

| Campo | Tipo | Descrição | Default |
|-------|------|-----------|---------|
| `items` | `CartItem[]` | Itens no carrinho | `[]` |
| `delivery` | `'entrega' \| 'retirada'` | Modo de recebimento | `'entrega'` |
| `payment` | `'dinheiro' \| 'cartao' \| 'pix' \| null` | Forma de pagamento | `null` |
| `troco` | `string` | Valor para troco (se dinheiro) | `''` |

## Derived Values (computados, não armazenados)

| Valor | Cálculo |
|-------|---------|
| `subtotal` | `sum(item.precoUnitario * item.quantidade)` |
| `taxaEntrega` | `delivery === 'entrega' ? pizzaria.taxa_entrega : 0` |
| `total` | `subtotal + taxaEntrega` |
| `itemCount` | `sum(item.quantidade)` |
| `precoPizza` | `max(sabores.map(s => s.categoria.preco)) + (sabores.length === 3 ? 5 : 0)` |

## State Transitions

### CartItem Lifecycle

```
[MenuPage: usuário seleciona sabores/bebida]
       │
       ▼
ADD_ITEM ───────────► CartState.items += newItem
       │
       ▼
[CartPage: exibido com qtd=1]
       │
       ├── UPDATE_QUANTITY(qtd=2) ──► item.quantidade = 2
       ├── UPDATE_QUANTITY(qtd=1) ──► item.quantidade = 1
       ├── REMOVE_ITEM ─────────────► removido do array
       └── (navega para /) ─────────► permanece no estado
```

### Payment State

```
payment = null (inicial)
       │
       ├── SET_PAYMENT('dinheiro') ──► troco field visible, payment = 'dinheiro'
       ├── SET_PAYMENT('cartao')  ──► troco cleared, payment = 'cartao'
       └── SET_PAYMENT('pix')     ──► troco cleared, payment = 'pix'
```

### Cart Clear

```
[WhatsApp abre em nova aba]
       │
       ▼
CLEAR_CART ──────────► state = initialState (carrinho vazio)
```
