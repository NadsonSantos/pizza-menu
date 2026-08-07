# Implementation Plan: Tema Visual — Identidade Rê Pizza's

**Branch**: `005-tema-visual-re-pizzas` | **Date**: 2026-08-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-tema-visual-re-pizzas/spec.md`

## Summary

Substituição completa do tema visual do app: migrar da paleta vermelha (`red-*`) para a nova identidade laranja da marca Rê Pizza's (`brand-*`), adicionar splash page com logo, e atualizar o nome da pizzaria nos dados. O trabalho é majoritariamente de CSS/Tailwind — sem alterações de lógica de negócio ou estrutura de componentes.

## Technical Context

**Language/Version**: TypeScript 5.8 (strict mode)

**Primary Dependencies**: React 19.1, Vite 6.3, Tailwind CSS 4.1, React Router 7.6, vite-plugin-pwa 1.0

**Storage**: Arquivo JSON estático (`public/menu.json`)

**Testing**: Manual / visual (sem framework de teste configurado)

**Target Platform**: Web (PWA), mobile-first (375px+), todos os navegadores modernos

**Project Type**: Single-page web application (PWA)

**Performance Goals**: Lighthouse PWA ≥ 90, splash page render ≤ 500ms (3G throttling), transição splash → cardápio a 60fps

**Constraints**: 
- 100% estático, sem backend
- Offline-capable via Service Worker (vite-plugin-pwa, Workbox)
- Tailwind CSS 4 com `@tailwindcss/vite` — `@theme` directive para design tokens
- React Context + useReducer apenas (sem libs externas de estado)

**Scale/Scope**: ~32 arquivos fonte TypeScript, 13 arquivos com classes `red-*` a substituir, 4 rotas (Menu, Carrinho, Checkout, Endereços)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Sem Backend Próprio | ✅ PASS | Mudanças 100% client-side: CSS, React components, JSON estático |
| II. Mobile-First | ✅ PASS | Splash page usa `max-w-[200px]` mobile; sem decisões desktop-first |
| III. PWA Instalável e Offline | ✅ PASS | Logo em `public/` cacheada pelo SW; splash funciona offline com fallback textual |
| IV. Regras de Negócio São a Fonte da Verdade | ✅ PASS | Nenhuma regra de negócio alterada — apenas rebrand visual |
| V. Fora de Escopo do MVP | ✅ PASS | Sem auth, pagamento in-app ou painel admin introduzidos |

**Verdict**: ALL GATES PASS — sem violações, sem justificativas necessárias.

## Project Structure

### Documentation (this feature)

```text
specs/005-tema-visual-re-pizzas/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Layout.tsx              # Header bg-red-600 → bg-brand-500, nome pizzaria
│   ├── PizzaCard.tsx           # border/selection colors
│   ├── FlavorSelector.tsx      # 5 ocorrências red-*
│   ├── PaymentSelector.tsx     # border/selection colors
│   ├── CartBadge.tsx           # bg-red-600 → bg-brand-500
│   ├── CartItem.tsx            # text-red-600 → text-brand-600
│   ├── CartSummary.tsx         # text-red-600 → text-brand-600
│   ├── DeliveryToggle.tsx      # selected state colors
│   ├── OrderSummary.tsx        # border colors
│   ├── AddressCard.tsx         # selected state colors
│   ├── DrinkCard.tsx           # 2 ocorrências red-*
│   ├── EmptyCart.tsx           # 1 ocorrência red-*
│   └── SplashScreen.tsx        # NEW: splash page component
├── pages/
│   ├── MenuPage.tsx            # 7 ocorrências red-* (category pills, prices)
│   ├── CartPage.tsx            # 1 ocorrência red-*
│   └── AddressPage.tsx         # 12 ocorrências red-* (heaviest file)
├── App.tsx                     # Route for splash page
├── index.css                   # @theme token definitions
└── main.tsx                    # No changes expected
public/
├── menu.json                   # pizzaria.nome → "Rê Pizza's"
└── splash_logo.jpeg            # Already present (verified)
vite.config.ts                  # theme_color: '#dc2626' → '#EF8A1F'
```

**Structure Decision**: Single frontend project (PWA). Nenhuma mudança estrutural — apenas adições (SplashScreen.tsx, tokens CSS) e substituições de classes Tailwind nos arquivos existentes.

## Complexity Tracking

> Nenhuma violação da constituição — seção vazia.
