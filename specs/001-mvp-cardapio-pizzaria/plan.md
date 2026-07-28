# Implementation Plan: MVP Cardápio Digital de Pizzaria (PWA)

**Branch**: `001-mvp-cardapio-pizzaria` | **Date**: 2025-07-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-mvp-cardapio-pizzaria/spec.md`

## Summary

PWA de cardápio digital de pizzaria: SPA React + Vite + TypeScript com 3 rotas (Menu, Carrinho, Finalizar). O cliente monta pizzas escolhendo de 1 a 3 sabores, gerencia carrinho com Context + useReducer, e finaliza o pedido que abre o WhatsApp da pizzaria com mensagem formatada. 100% estático, sem backend — cardápio vem de `menu.json` editável pelo dono.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: React 18, Vite 5, React Router 6, Tailwind CSS 3, vite-plugin-pwa (Workbox)
**Storage**: Arquivo JSON estático (`public/menu.json`) — sem banco de dados
**Testing**: Vitest (planejado — não implementado no MVP)
**Target Platform**: Web mobile (Chrome Android, Safari iOS) + PWA instalável
**Project Type**: Single-page web application (SPA) — hospedagem estática (Vercel/Netlify/GitHub Pages)
**Performance Goals**: Carregamento inicial < 3s em 3G, Lighthouse PWA ≥ 90
**Constraints**: Mobile-first (375px viewport padrão), offline-capable (Service Worker cache-first), sem backend, sem autenticação, sem processamento de pagamento
**Scale/Scope**: 1 pizzaria, ~15-20 sabores de pizza, ~5 bebidas, ~50 clientes/dia

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Evidência |
|-----------|--------|-----------|
| I. Sem Backend Próprio | ✅ PASS | `menu.json` estático em `public/`; zero API calls; hospedagem estática |
| II. Mobile-First | ✅ PASS | Layout com `max-w-lg` (448px), Tailwind breakpoints só acima de `sm:` quando necessário |
| III. PWA Offline | ✅ PASS | vite-plugin-pwa com Workbox cache-first para assets + menu.json; manifest `standalone` |
| IV. Regras de Negócio | ✅ PASS | `calcularPrecoPizza()` reflete exatamente as 8 regras; `menu.json` é single source of truth |
| V. Fora de Escopo | ✅ PASS | Sem auth (zero código de login), sem pagamento in-app (WhatsApp é externo), sem painel admin (não há rota/admin) |

**Gate Result**: ✅ ALL PASS — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-mvp-cardapio-pizzaria/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0: technology decisions
├── data-model.md        # Phase 1: entity definitions
├── quickstart.md        # Phase 1: dev setup instructions
├── contracts/           # Phase 1: menu.json schema contract
│   └── menu-schema.md
└── tasks.md             # Phase 2: /speckit.tasks output
```

### Source Code (repository root)

```text
public/
├── menu.json            # Cardápio — editável pelo dono da pizzaria
├── icon-192.png         # PWA icon
├── icon-512.png         # PWA icon
└── offline.html         # Fallback offline

src/
├── main.tsx             # Entry point, BrowserRouter + providers
├── App.tsx              # Routes + CartProvider wrapper
├── index.css            # Tailwind directives
├── types/
│   ├── menu.ts          # MenuData, Categoria, Sabor, Bebida interfaces
│   └── cart.ts          # CartState, CartItem, CartAction types
├── context/
│   ├── MenuContext.tsx   # Carrega e expõe menu.json
│   └── CartContext.tsx   # useReducer para carrinho, entrega, pagamento
├── utils/
│   ├── pricing.ts       # calcularPrecoPizza(), formatCurrency()
│   ├── whatsapp.ts      # formatWhatsAppMessage(), createWhatsAppLink()
│   └── loadMenu.ts      # Fetch + validate menu.json
├── components/
│   ├── Layout.tsx       # Header + Outlet wrapper
│   ├── CartBadge.tsx    # Indicador de itens no header
│   ├── PizzaCard.tsx    # Card de sabor selecionável
│   ├── FlavorSelector.tsx  # Seletor de 1-3 sabores com preço
│   ├── DrinkCard.tsx    # Card de bebida
│   ├── PizzaBuilder.tsx # Modal de montagem de pizza
│   ├── CartItem.tsx     # Item no carrinho com qtd/remover
│   ├── EmptyCart.tsx    # Estado vazio do carrinho
│   ├── CartSummary.tsx  # Subtotal/taxa/total
│   ├── DeliveryToggle.tsx  # Entrega vs Retirada
│   ├── PaymentSelector.tsx # Dinheiro/Cartão/Pix + troco
│   ├── OrderSummary.tsx # Resumo final antes do WhatsApp
│   └── WhatsAppButton.tsx  # Botão que gera link wa.me
└── pages/
    ├── MenuPage.tsx      # Página principal do cardápio
    ├── CartPage.tsx      # Página do carrinho
    └── CheckoutPage.tsx  # Página de finalização

config files/
├── vite.config.ts       # Vite + React + Tailwind + PWA plugins
├── tsconfig.json        # TypeScript strict
├── package.json         # Dependencies
└── index.html           # HTML entry point
```

**Structure Decision**: Single project (Option 1 — SPA). Sem separação frontend/backend porque não há backend. Todas as fontes em `src/`, assets estáticos em `public/`.

## Complexity Tracking

> Nenhuma violação de princípios da constituição. Tabela mantida para registro.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | — | — |
