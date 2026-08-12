# Quickstart: Bottom Sheet do Carrinho

**Feature**: `007-bottom-sheet-carrinho` | **Date**: 2026-08-12

## Visão Geral

Adicionar um componente `CartBottomSheet` fixo no rodapé da `MenuPage` que mostra o resumo do carrinho em tempo real.

## O que já existe

- **CartContext** (`src/context/CartContext.tsx`): já provê `itemCount`, `total`, `addItem`, `dispatch`
- **MenuPage** (`src/pages/MenuPage.tsx`): tela de cardápio com lista de sabores + bebidas
- **Rota `/carrinho`**: tela de carrinho existente (`CartPage`)
- **`formatCurrency`** (`src/utils/pricing.ts`): formatador de moeda já usado no projeto

## O que criar

### 1. `src/components/CartBottomSheet.tsx`

Novo componente que recebe `itemCount` e `total` como props:

```tsx
// Estrutura esperada
<div className="fixed bottom-0 left-0 right-0 z-30 ...">
  <div className="flex items-center justify-between ...">
    <span>{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
    <span>{formatCurrency(total)}</span>
    <button onClick={navigateToCart}>Ver Carrinho</button>
  </div>
</div>
```

### 2. Alterar `src/pages/MenuPage.tsx`

- Importar `CartBottomSheet`
- Ler `itemCount` e `total` do `useCart()`
- Adicionar `useRef` + `ResizeObserver` para medir altura do Bottom Sheet
- Aplicar `paddingBottom` dinâmico no container da lista
- Renderizar `<CartBottomSheet>` condicionalmente (`itemCount > 0`)

## Checklist de Implementação

- [ ] Criar `CartBottomSheet.tsx` com layout fixo no rodapé
- [ ] Integrar na `MenuPage` com renderização condicional
- [ ] Adicionar animação de slide-up/slide-down (~300ms)
- [ ] Implementar padding-bottom dinâmico na lista de produtos
- [ ] Adicionar safe-area-inset-bottom para dispositivos com notch
- [ ] Garantir que card inteiro é clicável (não só o botão)
- [ ] Verificar que Bottom Sheet só aparece na MenuPage (não em outras telas)
- [ ] Testar: adicionar item → aparece; remover último → some; valor atualiza

## Como testar localmente

```bash
npm run dev          # Inicia servidor de desenvolvimento
# Abrir http://localhost:5173 no navegador
# Montar uma pizza → Bottom Sheet deve aparecer
# Remover item do carrinho → Bottom Sheet some
# Verificar scroll funciona até o final da lista
```

## Referências

- **Spec**: `specs/007-bottom-sheet-carrinho/spec.md`
- **Plan**: `specs/007-bottom-sheet-carrinho/plan.md`
- **Data Model**: `specs/007-bottom-sheet-carrinho/data-model.md`
- **Research**: `specs/007-bottom-sheet-carrinho/research.md`
