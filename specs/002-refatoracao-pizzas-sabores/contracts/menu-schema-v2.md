# menu.json Schema v2

**Feature**: `002-refatoracao-pizzas-sabores`
**Version**: 2.0.0
**File**: `public/menu.json`

## Schema (TypeScript)

```typescript
interface MenuData {
  pizzaria: PizzariaInfo;
  categorias: Categoria[];   // ← sem sabores[] interno
  sabores: Sabor[];          // ← NOVO: lista plana com categoria_id
  bebidas: Bebida[];
}

interface PizzariaInfo {
  nome: string;
  whatsapp: string;
  taxa_entrega: number;
}

interface Categoria {
  id: string;       // ex: "tradicionais"
  nome: string;     // ex: "Tradicionais"
  preco: number;    // ex: 30.00 — ESTA é a fonte do preço
}

interface Sabor {
  id: string;            // ex: "calabresa"
  nome: string;          // ex: "Calabresa"
  descricao: string;     // ex: "Calabresa fatiada com cebola"
  imagem: string;        // "" para placeholder
  categoria_id: string;  // FK → Categoria.id — define o preço
}

interface Bebida {
  id: string;
  nome: string;
  preco: number;         // bebidas mantêm preço próprio
  imagem: string;
}
```

## Complete Example (32 sabores)

```json
{
  "pizzaria": {
    "nome": "Pizza do Bairro",
    "whatsapp": "5511999999999",
    "taxa_entrega": 5.00
  },
  "categorias": [
    { "id": "tradicionais", "nome": "Tradicionais", "preco": 30.00 },
    { "id": "especiais", "nome": "Especiais", "preco": 35.00 },
    { "id": "sensacionais", "nome": "Sensacionais", "preco": 40.00 }
  ],
  "sabores": [
    { "id": "baiana", "nome": "Baiana", "descricao": "...", "imagem": "", "categoria_id": "tradicionais" },
    { "id": "bacon", "nome": "Bacon", "descricao": "...", "imagem": "", "categoria_id": "tradicionais" },
    ...
    { "id": "carne-seca", "nome": "Carne Seca", "descricao": "...", "imagem": "", "categoria_id": "sensacionais" },
    { "id": "pepperoni", "nome": "Pepperoni", "descricao": "...", "imagem": "", "categoria_id": "sensacionais" },
    { "id": "quatro-queijos", "nome": "4 Queijos", "descricao": "...", "imagem": "", "categoria_id": "sensacionais" }
  ],
  "bebidas": [
    { "id": "pepsi", "nome": "Pepsi Lata 350ml", "preco": 8.00, "imagem": "" }
  ]
}
```

## How to Add a New Sabor

```json
{
  "id": "novo-sabor",
  "nome": "Nome do Sabor",
  "descricao": "Descrição",
  "imagem": "",
  "categoria_id": "tradicionais"
}
```

**IMPORTANTE**: `categoria_id` deve ser `"tradicionais"`, `"especiais"` ou `"sensacionais"`. O preço vem automaticamente da categoria — NUNCA coloque `"preco"` no sabor.

## How to Change a Price

Edite APENAS o preço na categoria:

```json
{ "id": "tradicionais", "nome": "Tradicionais", "preco": 32.00 }
```

Todos os 13 sabores tradicionais passam a custar R$32 automaticamente.
