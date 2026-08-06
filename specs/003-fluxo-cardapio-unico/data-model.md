# Data Model: Fluxo Único de Cardápio

**Feature**: `003-fluxo-cardapio-unico`
**Date**: 2025-07-30

## Entity Changes

**Nenhuma entidade é alterada.** As interfaces `MenuData`, `Categoria`, `Sabor`, `Bebida`, `CartItem`, `CartState` permanecem idênticas à feature 002.

## Novos Tipos (apenas para UI)

Pode ser útil adicionar tipos auxiliares no componente `FlavorSelector` para organizar sabores por categoria:

```typescript
interface GrupoSabores {
  categoria: Categoria;
  sabores: Sabor[];
}

// Derivação em runtime:
const grupos: GrupoSabores[] = menu.categorias.map(cat => ({
  categoria: cat,
  sabores: menu.sabores.filter(s => s.categoria_id === cat.id),
}));
```

## IntersectionObserver Options

```typescript
const observerOptions: IntersectionObserverInit = {
  rootMargin: '-40% 0px -55% 0px',  // top 40% + bottom 55% = ~5% zona ativa
  threshold: 0,
};
```

## Unchanged

| Entity/Module | Status |
|--------------|--------|
| `Sabor`, `Categoria`, `MenuData` | Inalterados |
| `CartItem`, `CartState`, `CartAction` | Inalterados |
| `calcularPrecoPizza`, `formatCurrency` | Inalterados |
| `loadMenu`, `validateMenu` | Inalterados |
| `CartProvider`, `useCart` | Inalterados |
| `MenuProvider`, `useMenu` | Inalterados (pode adicionar helper) |
