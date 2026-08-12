# Implementation Plan: Montagem de Pizza — 2 Sabores como Padrão e 3º Sabor Excepcional

**Branch**: `008-montagem-pizza-2-sabores` | **Date**: 2026-08-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-montagem-pizza-2-sabores/spec.md`

## Summary

Refatorar o fluxo de montagem de pizza para tornar explícita a regra "2 sabores é o padrão, 3º sabor é excepcional (+ R$ 5,00)". A mudança é **somente de comunicação e de fluxo de confirmação** — as regras de negócio (1 a 3 sabores; preço = categoria mais cara; + R$ 5,00 no 3º) permanecem intactas. Quatro entregas: (1) modal de confirmação ao adicionar o 3º sabor, (2) labels claros de contagem, (3) correção do posicionamento do indicador de sabores, (4) rolagem automática até o sabor pré-selecionado.

## Technical Context

**Language/Version**: TypeScript 5.8 (strict mode)

**Primary Dependencies**: React 19.1, React Router 7.6, Tailwind CSS 4, vite-plugin-pwa (Workbox)

**Storage**: `public/menu.json` (estático, somente leitura); sem persistência nova nesta feature (nenhuma alteração em `menu.json`)

**Testing**: Vitest 4 + @testing-library/react (padrão já usado em `src/components/CartBottomSheet.test.tsx`)

**Target Platform**: Web (PWA instalável), mobile-first — viewport de referência 375px, navegadores modernos

**Project Type**: Web application (PWA) 100% estática, sem backend

**Performance Goals**: interações a 60fps; rolagem automática concluída em < 1s após a abertura (SC-005)

**Constraints**: sem backend/sem bibliotecas externas de UI ou estado (constitution); Tailwind puro; regras de preço imutáveis (`src/utils/pricing.ts`)

**Scale/Scope**: ~28 arquivos em `src/`; alterações concentradas em `FlavorSelector.tsx`, `PizzaBuilder.tsx`, novo `ThirdFlavorModal.tsx` e testes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Verificação |
|-----------|--------|-------------|
| I. Sem Backend Próprio | ✅ PASS | Feature 100% client-side; nenhuma chamada de rede, API ou serverless adicionada |
| II. Mobile-First | ✅ PASS | Modal e labels desenhados/testados em 375px primeiro; modal usa `max-w-lg` e `items-end` (bottom-sheet em mobile), mesmo padrão do `PizzaBuilder` |
| III. PWA Instalável/Offline | ✅ PASS | Sem impacto no service worker ou manifest; apenas UI estática |
| IV. Regras de Negócio Fonte da Verdade | ✅ PASS | `calcularPrecoPizza` inalterado; regra 1–3 sabores e + R$ 5,00 no 3º preservada; a feature só adiciona confirmação antes da aplicação |
| V. Fora de Escopo (sem auth/pagamento/admin) | ✅ PASS | Nenhuma dessas áreas tocada |

**Resultado**: nenhuma violação — Complexity Tracking fica vazio.

## Project Structure

### Documentation (this feature)

```text
specs/008-montagem-pizza-2-sabores/
├── plan.md              # Este arquivo
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (contrato de UI)
└── tasks.md             # Phase 2 output (via /speckit.tasks — NÃO criado aqui)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── PizzaBuilder.tsx        # modal wrapper da montagem (recebe preselectedSabor)
│   ├── FlavorSelector.tsx      # seleção de sabores + indicador de contagem (EDITADO)
│   ├── ThirdFlavorModal.tsx    # NOVO: modal de confirmação do 3º sabor
│   └── ...
├── pages/
│   └── MenuPage.tsx            # cardápio; abre PizzaBuilder com sabor pré-selecionado
├── context/
│   └── CartContext.tsx         # addItem — sem mudança (preço vem do FlavorSelector)
├── types/
│   └── menu.ts                 # tipos Sabor/Categoria — sem mudança
├── utils/
│   └── pricing.ts              # calcularPrecoPizza — INALTERADO (regra de negócio)
└── ...
```

**Structure Decision**: mantém o projeto único existente (`src/`). Nenhuma pasta nova além de `contracts/` (documentação). O novo componente `ThirdFlavorModal` vive em `src/components/`, seguindo o padrão dos demais modais (`PizzaBuilder`).

## Complexity Tracking

> Nenhuma violação de constituição — seção vazia.
