# Implementation Plan: Tela Inicial Dinâmica com Histórico de Compras

**Branch**: `006-tela-inicial-historico` | **Date**: 2026-08-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-tela-inicial-historico/spec.md`

## Summary

Adicionar persistência de pedidos no `localStorage` ao finalizar compra e uma nova tela inicial (`HomePage`) exibida condicionalmente para clientes com histórico nos últimos 90 dias. A tela mostra os 3 últimos pedidos com acesso a detalhes e ação de "Pedir novamente" que popula o carrinho automaticamente. Usuários sem histórico mantêm o fluxo atual (MenuPage direto).

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)

**Primary Dependencies**: React 18, React Router 6, Vite 5, Tailwind CSS 3, vite-plugin-pwa (Workbox)

**Storage**: `localStorage` (chave `order_history`, array de `OrderRecord`)

**Testing**: Manual testing + `npm run build` (TypeScript compilation). Sem framework de teste automatizado no projeto.

**Target Platform**: Web PWA, mobile-first (375px viewport), navegadores modernos com suporte a `localStorage`

**Project Type**: Single-page web application (frontend only, static hosting: Vercel/Netlify/GitHub Pages)

**Performance Goals**: Persistência do pedido < 50ms (síncrona), decisão de elegibilidade antes do fim da splash (2s), "Pedir novamente" < 100ms, 60fps nas transições

**Constraints**: Zero backend (Princípio I), offline-capable PWA (Princípio III), mobile-first (Princípio II), sem bibliotecas externas de estado (Context + useReducer apenas), Tailwind CSS puro sem UI framework

**Scale/Scope**: 1 pizzaria, ~54 itens de menu, histórico local por navegador, sem sincronização entre dispositivos

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Evidência |
|-----------|--------|-----------|
| I. Sem Backend Próprio | ✅ PASS | `localStorage` é armazenamento local do navegador, não backend. Zero dependência de servidor. |
| II. Mobile-First | ✅ PASS | `HomePage` e `OrderDetailPage` serão projetadas para 375px primeiro, com Tailwind responsive utilities apenas onde necessário. |
| III. PWA Instalável e Offline | ✅ PASS | Novas páginas são assets estáticos cacheados pelo Service Worker. `localStorage` funciona offline. Nenhuma chamada de rede adicionada. |
| IV. Regras de Negócio | ✅ PASS | Nenhuma regra de precificação, cardápio ou WhatsApp alterada. Pedido salvo "as-is" após confirmação. Recompra restaura o estado exato do pedido original. |
| V. Fora de Escopo | ✅ PASS | Sem autenticação, pagamento in-app ou painel admin. Histórico é local e anônimo. |

**Veredito**: Todos os gates passam. Nenhuma violação a justificar.

## Project Structure

### Documentation (this feature)

```text
specs/006-tela-inicial-historico/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── order-history-localstorage.md
└── tasks.md             # Phase 2 output (speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── types/
│   ├── cart.ts          # [MODIFY] Add OrderRecord interface
│   └── menu.ts          # unchanged
├── utils/
│   └── orderHistory.ts  # [NEW] localStorage read/write/filter helpers
├── context/
│   ├── CartContext.tsx   # [MODIFY] Add ORDER_FROM_HISTORY action
│   └── ...
├── components/
│   ├── WhatsAppButton.tsx  # [MODIFY] Save order before CLEAR_CART
│   ├── SplashScreen.tsx    # unchanged
│   └── Layout.tsx          # [MODIFY] Update header link for HomePage context
├── pages/
│   ├── MenuPage.tsx        # unchanged
│   ├── HomePage.tsx        # [NEW] Tela inicial personalizada
│   └── OrderDetailPage.tsx # [NEW] Detalhes do pedido + Pedir novamente
├── App.tsx                 # [MODIFY] Conditional routing post-splash
└── main.tsx                # unchanged
```

**Structure Decision**: Single-project structure (frontend only). Novos arquivos seguem a organização existente: types em `src/types/`, lógica em `src/utils/`, páginas em `src/pages/`, componentes em `src/components/`.

## Complexity Tracking

> Nenhuma violação constitucional. Seção mantida para registro de auditoria.
