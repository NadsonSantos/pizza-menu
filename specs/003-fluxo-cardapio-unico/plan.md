# Implementation Plan: Fluxo Único de Cardápio com Montagem Cross-Categoria

**Branch**: `003-fluxo-cardapio-unico` | **Date**: 2025-07-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-fluxo-cardapio-unico/spec.md`

## Summary

Refatorar o cardápio de tabs horizontais para página única com sticky nav e scroll suave, e unificar o fluxo de montagem de pizza para permitir sabores de qualquer categoria. Nenhuma mudança em carrinho, checkout ou regras de negócio de precificação.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18
**Primary Dependencies**: React Router 6 (inalterado), Tailwind CSS (inalterado)
**Storage**: `public/menu.json` — inalterado
**Testing**: Build verification + navegação manual
**Target Platform**: PWA mobile (inalterado)
**Project Type**: Refatoração de UI + lógica de seleção — sem novas dependências
**Constraints**: Zero mudanças em carrinho, checkout, WhatsApp, PWA, precificação

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Evidência |
|-----------|--------|-----------|
| I. Sem Backend Próprio | ✅ PASS | Nenhuma API introduzida |
| II. Mobile-First | ✅ PASS | Scroll + sticky nav funcionam em 375px |
| III. PWA Offline | ✅ PASS | Service Worker inalterado |
| IV. Regras de Negócio | ✅ PASS | Precificação e limite de 3 sabores mantidos |
| V. Fora de Escopo | ✅ PASS | Sem auth, pagamento ou admin |

**Gate Result**: ✅ ALL PASS.

## Project Structure

### Documentation (this feature)

```text
specs/003-fluxo-cardapio-unico/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0: decisions
├── data-model.md        # Phase 1: entity changes (nenhuma)
└── quickstart.md        # Phase 1: migration guide
```

### Files to Change

| File | Change | Risk |
|------|--------|------|
| `src/pages/MenuPage.tsx` | **Reescrever** — de tabs para página única com seções + sticky nav + IntersectionObserver | Alto — componente principal |
| `src/components/FlavorSelector.tsx` | **Modificar** — receber sabores de todas as categorias, exibir badges de categoria | Médio |
| `src/components/PizzaBuilder.tsx` | **Remover/modificar** — não mais atrelado a uma única categoria | Médio |
| `src/context/MenuContext.tsx` | **Adicionar** helper `getCategoriaNome(id)` para exibir badge | Baixo |

**Files NOT changed**: CartContext, CartItem, CartPage, CheckoutPage, DeliveryToggle, PaymentSelector, WhatsAppButton, OrderSummary, CartSummary, EmptyCart, Layout, CartBadge, DrinkCard, PizzaCard, pricing.ts, loadMenu.ts, menu.json, vite.config.

## Complexity Tracking

> Nenhuma violação de princípios.
