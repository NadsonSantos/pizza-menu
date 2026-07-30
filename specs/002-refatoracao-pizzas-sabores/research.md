# Research & Decisions: Refatoração Pizzas e Sabores

**Feature**: `002-refatoracao-pizzas-sabores`
**Date**: 2025-07-30

## Decisions

### 1. Estrutura do menu.json: Sabores Planos

**Decision**: Sabores viram lista plana no nível raiz com `categoria_id`, em vez de ficarem aninhados dentro de `categorias[].sabores[]`.

**Rationale**: Com 32 sabores, a estrutura atual (cada categoria contém seus sabores) funciona, mas dificulta a validação de `categoria_id` e torna impossível ter um sabor referenciar uma categoria sem estar aninhado nela. A estrutura plana é mais flexível para futuras expansões e torna explícita a relação sabor→categoria. O menu.json continua sendo um único arquivo.

**Before**:
```json
{
  "categorias": [
    { "id": "tradicionais", "preco": 30, "sabores": [{ "id": "mussarela", ... }] }
  ]
}
```

**After**:
```json
{
  "categorias": [
    { "id": "tradicionais", "nome": "Tradicionais", "preco": 30 }
  ],
  "sabores": [
    { "id": "mussarela", "categoria_id": "tradicionais", ... }
  ]
}
```

**Alternatives considered**:
- Manter aninhado + adicionar `categoria_id` no sabor: Redundante — o aninhamento já define a categoria. Viola o princípio de single source of truth.
- Dois arquivos (`categorias.json` + `sabores.json`): Complexidade desnecessária. Um arquivo só é mais simples para o dono editar.

---

### 2. Tipagem TypeScript: Sabor ganha `categoria_id`

**Decision**: `interface Sabor` ganha campo `categoria_id: string`. `interface Categoria` perde `sabores: Sabor[]`.

**Rationale**: Reflete a nova estrutura do `menu.json`. O agrupamento de sabores por categoria passa a ser feito em runtime pelo `MenuContext`, não pela estrutura de dados estática.

**Impact**: 
- `src/types/menu.ts`: `Sabor.categoria_id` adicionado, `Categoria.sabores` removido
- `MenuData` ganha `sabores: Sabor[]` no nível raiz
- Componentes que acessavam `categoria.sabores` agora acessam `menu.sabores.filter(s => s.categoria_id === cat.id)`

---

### 3. Cálculo de Preço: Lookup por Categoria

**Decision**: `calcularPrecoPizza(sabores, categorias)` — recebe array de sabores + array de categorias, faz lookup do preço de cada sabor via `categoria_id`, retorna `max(precos) + (sabores.length === 3 ? 5 : 0)`.

**Rationale**: A função já existia mas recebia um `Map<string, number>`. Agora recebe o array de categorias diretamente, o que é mais natural com a nova estrutura. A regra do acréscimo (mantida) é `sabores.length === 3 ? 5 : 0`.

**Before**:
```typescript
calcularPrecoPizza(sabores: Sabor[], categoriaPrecos: Map<string, number>)
```

**After**:
```typescript
calcularPrecoPizza(sabores: Sabor[], categorias: Categoria[]): { precoBase, acrescimo, total }
```

---

### 4. Validação do menu.json

**Decision**: `loadMenu.ts` valida que todo `sabor.categoria_id` referencia uma categoria existente, e que toda categoria tem `preco > 0`.

**New validations**:
- `sabor.categoria_id` é non-empty string
- `sabor.categoria_id` existe em `categorias[].id`
- Nenhum sabor tem campo `preco` (se tiver, warning ou erro)
- Toda categoria tem `preco` definido e > 0

---

### 5. Componentes: Mudanças Mínimas

**Decision**: Apenas 5 componentes precisam ser alterados. Todos os componentes de carrinho, checkout, e WhatsApp permanecem inalterados porque consomem `CartItem` (que já tem `sabores: Sabor[]` e `precoUnitario: number`), não acessando diretamente a estrutura do menu.

**Componentes afetados**:
- `FlavorSelector.tsx`: Restaura "N/3 sabores", exibe "+R$5,00" no 3º sabor
- `PizzaBuilder.tsx`: Passa `categorias` para `calcularPrecoPizza`
- `MenuPage.tsx`: Agrupa `menu.sabores` por `categoria_id` para exibição

**Componentes NÃO afetados**: CartItem, CartPage, CheckoutPage, DeliveryToggle, PaymentSelector, WhatsAppButton, OrderSummary, DrinkCard, PizzaCard, Layout, CartBadge.

---

## No-Go Decisions

| Abordagem | Motivo da rejeição |
|-----------|-------------------|
| Manter sabores aninhados + adicionar categoria_id | Redundante — o aninhamento já define a categoria |
| Criar endpoint/API para cardápio | Viola princípio I (sem backend) |
| Migrar para SQLite/IndexedDB | Overkill — JSON estático é suficiente |
