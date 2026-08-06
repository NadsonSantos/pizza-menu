# Implementation Plan: Entrega Opcional com Gerenciamento de Endereços

**Branch**: `NAD-3-entrega-opcional-enderecos` | **Date**: 2025-08-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-entrega-opcional-enderecos/spec.md`

## Summary

Tornar a taxa de entrega condicional (só cobrada quando o usuário seleciona "Entrega"), corrigir hardcode de R$5 usando `menu.json`, adicionar gerenciamento de até 2 endereços persistidos em `localStorage`, exibir card de endereço no checkout e incluir endereço na mensagem do WhatsApp.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 18
**Primary Dependencies**: React Router 6, Tailwind CSS 3 (inalterados — sem novas dependências)
**Storage**: `localStorage` (chave `pizza-menu-addresses`), `menu.json` (já possui `pizzaria.taxa_entrega`)
**Testing**: Build verification (`npm run build`) + validação manual dos fluxos
**Target Platform**: PWA mobile-first (375px viewport)
**Project Type**: Extensão de features — novo Context, nova página, modificações no checkout
**Constraints**: Zero dependências externas (Context + useReducer apenas), sem backend
**Scale/Scope**: +1 página (`/enderecos`), +1 Context (`AddressContext`), +2 componentes (`AddressCard`, `AddressForm`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Evidência |
|-----------|--------|-----------|
| I. Sem Backend Próprio | ✅ PASS | Dados em localStorage + menu.json. Nenhuma API introduzida. |
| II. Mobile-First | ✅ PASS | Todos os novos componentes projetados para 375px. Formulário simples, cards empilhados. |
| III. PWA Offline | ✅ PASS | Service Worker inalterado. localStorage funciona offline nativamente. |
| IV. Regras de Negócio | ✅ PASS | Taxa de entrega condicional respeita regra existente. `taxa_entrega` vem do `menu.json`. |
| V. Fora de Escopo | ✅ PASS | Sem auth, pagamento in-app ou painel admin. Gerenciamento de endereços é self-service no client. |

**Gate Result**: ✅ ALL PASS.

## Project Structure

### Documentation (this feature)

```text
specs/004-entrega-opcional-enderecos/
├── spec.md              # Feature specification (aprovada)
├── plan.md              # This file
├── research.md          # Phase 0: decisions
├── data-model.md        # Phase 1: entity changes
├── quickstart.md        # Phase 1: migration guide
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

### Files to Create

| File | Purpose | Risk |
|------|---------|------|
| `src/types/address.ts` | Tipos `Address`, `AddressState`, `AddressAction` | Baixo |
| `src/context/AddressContext.tsx` | Provider + useReducer para endereços | Médio |
| `src/pages/AddressPage.tsx` | Tela `/enderecos` — lista + formulário | Médio |
| `src/components/AddressCard.tsx` | Card de endereço no checkout | Baixo |

### Files to Modify

| File | Change | Risk |
|------|--------|------|
| `src/types/cart.ts` | `CartState` ganha `selectedAddressId: string \| null` | Baixo |
| `src/context/CartContext.tsx` | Consumir `taxa_entrega` do `MenuContext`; `taxaEntrega` condicional; adicionar `SET_ADDRESS` action + novo campo no estado | Alto — muda cálculo central |
| `src/components/DeliveryToggle.tsx` | Usar `taxa_entrega` do `MenuContext` no label (não hardcoded) | Baixo |
| `src/components/CartSummary.tsx` | Label condicional: "Retirada: Grátis" vs "Taxa de entrega: R$ X" | Baixo |
| `src/pages/CheckoutPage.tsx` | Adicionar `AddressCard` condicional quando `delivery === 'entrega'` | Baixo |
| `src/components/WhatsAppButton.tsx` | Passar `selectedAddressId` + endereço para `formatWhatsAppMessage` | Médio |
| `src/utils/whatsapp.ts` | `formatWhatsAppMessage` ganha parâmetro `endereco?: string` | Baixo |
| `src/App.tsx` | Adicionar rota `/enderecos` | Baixo |
| `src/main.tsx` | Envolver app com `AddressProvider` | Baixo |

### Files NOT Changed

`menu.json`, `PizzaBuilder`, `FlavorSelector`, `CartItem`, `CartPage`, `MenuPage`, `PaymentSelector`, `OrderSummary`, `EmptyCart`, `Layout`, `PizzaCard`, `DrinkCard`, `CartBadge`, `vite.config`, `pricing.ts`, `loadMenu.ts`, `MenuContext.tsx`.

## Complexity Tracking

> Nenhuma violação de princípios.
