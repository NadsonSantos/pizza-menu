# Data Model Changes: Refatoração Pizzas e Sabores

**Feature**: `002-refatoracao-pizzas-sabores`
**Date**: 2025-07-30

## Entity Changes

### Before (001-mvp)

```
MenuData
├── pizzaria: PizzariaInfo
├── categorias: Categoria[]
│   ├── id, nome, preco
│   └── sabores: Sabor[]        ← aninhado
│       ├── id, nome, descricao, imagem
│       └── (sem categoria_id — implícito)
└── bebidas: Bebida[]
```

### After (002-refatoracao)

```
MenuData
├── pizzaria: PizzariaInfo
├── categorias: Categoria[]     ← sem sabores[]
│   └── id, nome, preco
├── sabores: Sabor[]            ← plano, com categoria_id
│   └── id, nome, descricao, imagem, categoria_id
└── bebidas: Bebida[]
```

## Interface Changes

### Sabor

```diff
interface Sabor {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
+ categoria_id: string;  // FK → Categoria.id
}
```

### Categoria

```diff
interface Categoria {
  id: string;
  nome: string;
  tipo: 'pizza';
  preco: number;
- sabores: Sabor[];      // REMOVIDO — sabores agora são planos
}
```

### MenuData

```diff
interface MenuData {
  pizzaria: PizzariaInfo;
  categorias: Categoria[];
+ sabores: Sabor[];       // NOVO — lista plana de todos os sabores
  bebidas: Bebida[];
}
```

## Derived Data (MenuContext)

O `MenuContext` agora faz o agrupamento em runtime:

```typescript
function groupSaboresByCategory(menu: MenuData): Map<string, Sabor[]> {
  const map = new Map<string, Sabor[]>();
  for (const sabor of menu.sabores) {
    const list = map.get(sabor.categoria_id) || [];
    list.push(sabor);
    map.set(sabor.categoria_id, list);
  }
  return map;
}
```

## Unchanged Entities

| Entity | Status |
|--------|--------|
| `PizzariaInfo` | Inalterado |
| `Bebida` | Inalterado |
| `CartItem` | Inalterado (já tem `sabores: Sabor[]` + `precoUnitario`) |
| `CartState` | Inalterado |
| `CartAction` | Inalterado |

## Validation Rules (loadMenu.ts)

| Rule | Error (PT-BR) |
|------|---------------|
| `sabor.categoria_id` is non-empty | `"Sabor 'X' não tem categoria definida."` |
| `sabor.categoria_id` exists in categorias | `"Sabor 'X' referencia categoria 'Y' que não existe."` |
| No sabor has `preco` field | `"Sabor 'X' tem campo 'preco' — preços devem ficar nas categorias."` |
| Categoria has `preco > 0` | `"Categoria 'Y' não tem preço definido."` |
