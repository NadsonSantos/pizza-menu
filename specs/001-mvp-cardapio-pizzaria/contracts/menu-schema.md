# menu.json Schema Contract

**Feature**: `001-mvp-cardapio-pizzaria`
**Version**: 1.0.0
**File**: `public/menu.json`

This document defines the exact structure of `menu.json` — the single source of truth for all menu data. The app validates this schema at load time and shows user-friendly Portuguese error messages on validation failure.

## Schema (TypeScript)

```typescript
interface MenuData {
  pizzaria: PizzariaInfo;
  categorias: Categoria[];
  bebidas: Bebida[];
}

interface PizzariaInfo {
  nome: string;          // Nome da pizzaria (ex: "Pizza do Bairro")
  whatsapp: string;      // Número com DDI+DDD (ex: "5511999999999")
  taxa_entrega: number;  // Taxa em R$ (ex: 5.00)
}

interface Categoria {
  id: string;            // Identificador único (ex: "tradicionais")
  nome: string;          // Nome de exibição (ex: "Tradicionais Simples")
  tipo: "pizza";         // Sempre "pizza"
  preco: number;         // Preço base da categoria (ex: 30.00)
  sabores: Sabor[];      // Pelo menos 1 sabor
}

interface Sabor {
  id: string;            // Identificador único (ex: "mussarela")
  nome: string;          // Nome do sabor (ex: "Mussarela")
  descricao: string;     // Descrição curta (ex: "Queijo mussarela e tomate")
  imagem: string;        // Caminho da imagem ou "" para placeholder
}

interface Bebida {
  id: string;            // Identificador único (ex: "pepsi")
  nome: string;          // Nome da bebida (ex: "Pepsi Lata 350ml")
  preco: number;         // Preço unitário (ex: 8.00)
  imagem: string;        // Caminho da imagem ou "" para placeholder
}
```

## Complete Example

```json
{
  "pizzaria": {
    "nome": "Pizza do Bairro",
    "whatsapp": "5511999999999",
    "taxa_entrega": 5.00
  },
  "categorias": [
    {
      "id": "tradicionais",
      "nome": "Tradicionais Simples",
      "tipo": "pizza",
      "preco": 30.00,
      "sabores": [
        {
          "id": "mussarela",
          "nome": "Mussarela",
          "descricao": "Queijo mussarela e tomate",
          "imagem": "imagens/mussarela.jpg"
        },
        {
          "id": "calabresa",
          "nome": "Calabresa",
          "descricao": "Calabresa fatiada com cebola",
          "imagem": ""
        }
      ]
    },
    {
      "id": "especiais",
      "nome": "Especiais",
      "tipo": "pizza",
      "preco": 35.00,
      "sabores": [
        {
          "id": "portuguesa",
          "nome": "Portuguesa",
          "descricao": "Presunto, ovo, cebola e ervilha",
          "imagem": ""
        }
      ]
    },
    {
      "id": "sensacionais",
      "nome": "Sensacionais",
      "tipo": "pizza",
      "preco": 40.00,
      "sabores": [
        {
          "id": "camarao",
          "nome": "Camarão Especial",
          "descricao": "Camarão com molho especial da casa",
          "imagem": ""
        }
      ]
    }
  ],
  "bebidas": [
    {
      "id": "pepsi",
      "nome": "Pepsi Lata 350ml",
      "preco": 8.00,
      "imagem": ""
    },
    {
      "id": "guarana",
      "nome": "Guaraná Antarctica Lata 350ml",
      "preco": 7.50,
      "imagem": ""
    }
  ]
}
```

## Validation Rules (enforced by `loadMenu.ts`)

| Rule | Error Message (PT-BR) |
|------|----------------------|
| File is valid JSON | "O arquivo menu.json está mal formatado. Verifique se todas as vírgulas e chaves estão corretas." |
| `pizzaria.nome` is non-empty string | "menu.json: faltam dados da pizzaria (nome, whatsapp)." |
| `pizzaria.whatsapp` is non-empty string | "menu.json: faltam dados da pizzaria (nome, whatsapp)." |
| `categorias` is non-empty array | "menu.json: o campo 'categorias' está vazio ou ausente." |
| Each category has `sabores` non-empty array | "menu.json: a categoria '{nome}' não tem sabores." |
| Each category has `preco` > 0 | "menu.json: preço inválido na categoria '{nome}'." |

## How to Edit (for business owner)

### Add a new sabor

1. Open `public/menu.json`
2. Find the category (e.g., `"tradicionais"`)
3. Inside `"sabores": [ ... ]`, add a new object:
```json
{
  "id": "nome-do-sabor",
  "nome": "Nome do Sabor",
  "descricao": "Descrição do sabor",
  "imagem": ""
}
```
4. **IMPORTANTE**: Adicione uma vírgula após o item anterior (exceto se for o último)
5. Salve o arquivo

### Change a price

1. Find `"preco": 30.00` inside the category you want to change
2. Change the number (e.g., `"preco": 32.00`)
3. Save

### Change WhatsApp number

1. Find `"whatsapp": "5511999999999"`
2. Replace with the real number (DDI + DDD + number, no spaces or symbols)
3. Save

### Common mistakes

- ❌ Missing comma between items: `{ ... } { ... }`
- ✅ Correct: `{ ... }, { ... }`
- ❌ Extra comma after last item: `{ ... }, ]`
- ✅ Correct: `{ ... } ]`
- ❌ Unclosed quotes: `"nome: "Mussarela`
- ✅ Correct: `"nome": "Mussarela"`
