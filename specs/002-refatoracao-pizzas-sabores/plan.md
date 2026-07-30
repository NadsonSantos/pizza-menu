# Implementation Plan: Refatoração Pizzas e Sabores

**Branch**: `002-refatoracao-pizzas-sabores` | **Date**: 2025-07-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-refatoracao-pizzas-sabores/spec.md`

## Summary

Refatoração da modelagem de pizzas: remover preço do sabor, introduzir `categoria_id` como referência, reclassificar 32 sabores em 3 categorias, e ajustar toda a stack (menu.json, tipos, lógica de preço, componentes) para usar a nova estrutura. O limite de 3 sabores e o acréscimo de R$5 no 3º são mantidos.

## Technical Context

**Language/Version**: TypeScript 5.x (strict)
**Primary Dependencies**: React 18, Vite 5, Tailwind CSS 3 (inalterados)
**Storage**: `public/menu.json` — reestruturado (sabores planos com `categoria_id`)
**Testing**: Build verification (`tsc --noEmit` + `npm run build`)
**Target Platform**: PWA mobile (inalterado)
**Project Type**: Refatoração de código existente — sem novas dependências
**Performance Goals**: Nenhuma regressão — build mantém < 300 KB
**Constraints**: Zero breaking changes na experiência do usuário final; apenas a estrutura de dados interna muda

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Evidência |
|-----------|--------|-----------|
| I. Sem Backend Próprio | ✅ PASS | `menu.json` continua sendo única fonte de dados |
| II. Mobile-First | ✅ PASS | Nenhuma mudança de layout |
| III. PWA Offline | ✅ PASS | Service Worker inalterado |
| IV. Regras de Negócio | ✅ PASS | Cálculo mantém max(categoria) + R$5 no 3º sabor |
| V. Fora de Escopo | ✅ PASS | Sem novas features |

**Gate Result**: ✅ ALL PASS.

## Project Structure

### Documentation (this feature)

```text
specs/002-refatoracao-pizzas-sabores/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0: decisions
├── data-model.md        # Phase 1: entity changes
├── quickstart.md        # Phase 1: migration guide
└── contracts/
    └── menu-schema-v2.md
```

### Files to Change

| File | Change | Impact |
|------|--------|--------|
| `public/menu.json` | **Rewrite** | Estrutura plana, 32 sabores + `categoria_id` |
| `src/types/menu.ts` | **Modify** | `Sabor` ganha `categoria_id`, `Categoria` perde `sabores[]` |
| `src/utils/pricing.ts` | **Modify** | `calcularPrecoPizza` usa lookup por `categoria_id` |
| `src/utils/loadMenu.ts` | **Modify** | Validação adaptada à nova estrutura |
| `src/context/MenuContext.tsx` | **Modify** | Agrupa sabores por `categoria_id` |
| `src/components/FlavorSelector.tsx` | **Modify** | Mantém limite "N/3", exibe acréscimo R$5 |
| `src/components/PizzaBuilder.tsx` | **Modify** | Adapta à nova prop de sabores |
| `src/pages/MenuPage.tsx` | **Modify** | Acesso a `sabores` via nova estrutura |
| `README.md` | **Modify** | Documenta novo formato do `menu.json` |

**Files NOT changed**: `CartContext`, `CartItem`, `CartPage`, `CheckoutPage`, `DeliveryToggle`, `PaymentSelector`, `WhatsAppButton`, `OrderSummary`, `DrinkCard`, `PizzaCard`, vite.config, PWA config.

## Complexity Tracking

> Nenhuma violação. Refatoração puramente estrutural.
