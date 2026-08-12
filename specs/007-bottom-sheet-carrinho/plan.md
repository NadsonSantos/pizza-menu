# Implementation Plan: Bottom Sheet do Carrinho

**Branch**: `007-bottom-sheet-carrinho` | **Date**: 2026-08-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-bottom-sheet-carrinho/spec.md`

## Summary

Implementar um componente `CartBottomSheet` fixo no rodapé da tela de cardápio (MenuPage) que exibe em tempo real o resumo do carrinho — contador de itens, valor total e botão "Ver Carrinho". O componente reage instantaneamente ao CartContext, aparece/desaparece com animação conforme o carrinho enche/esvazia, e ajusta o padding da lista de produtos para não sobrepor itens.

Abordagem técnica: componente React puro com estado derivado do CartContext, transições CSS via Tailwind (opacity + translate), e padding-bottom dinâmico na lista via prop/state compartilhado. Sem dependências externas — usa apenas React Context já existente e Tailwind CSS.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)

**Primary Dependencies**: React 19, React Router 7, Tailwind CSS 4, Vite 6

**Storage**: N/A (estado em memória via CartContext)

**Testing**: Vitest (já configurado no projeto)

**Target Platform**: Web mobile-first (PWA), iOS Safari + Chrome Android, 320px–428px viewport primário

**Project Type**: Web application (SPA estática)

**Performance Goals**: Atualização do Bottom Sheet < 100ms após dispatch do carrinho; transição de entrada/saída ≤ 300ms

**Constraints**: Mobile-first (375px), sem libs externas de estado/UI, animação apenas com CSS/Tailwind, acessível por touch (botão ≥ 44px), safe-area em dispositivos com notch

**Scale/Scope**: 1 novo componente (`CartBottomSheet`), 1 página alterada (`MenuPage`), ~80 linhas de código novo

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Evidência |
|-----------|--------|-----------|
| I. Sem Backend Próprio | ✅ PASS | Zero dependências de servidor — Bottom Sheet é UI pura consumindo CartContext (memória). |
| II. Mobile-First | ✅ PASS | Componente projetado para 320px+ com touch targets ≥ 44px e safe-area support. |
| III. PWA Instalável e Offline | ✅ PASS | Nenhum novo asset ou dependência de rede — Bottom Sheet funciona offline como todo o app. |
| IV. Regras de Negócio | ✅ PASS | Nenhuma regra de negócio alterada — Bottom Sheet apenas consome `itemCount` e `total` do CartContext existente. |
| V. Fora de Escopo do MVP | ✅ PASS | Sem auth, sem pagamento in-app, sem painel admin — é UI incremental. |
| Stack Técnica | ✅ PASS | React puro + Tailwind CSS + Context existente. Sem Redux, UI lib ou backend. |

**Resultado**: Todos os gates passam. Nenhuma violação a justificar.

## Project Structure

### Documentation (this feature)

```text
specs/007-bottom-sheet-carrinho/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── CartBottomSheet.tsx    # NOVO — componente do Bottom Sheet
├── pages/
│   └── MenuPage.tsx           # ALTERADO — integração do Bottom Sheet + padding dinâmico
├── context/
│   └── CartContext.tsx        # NÃO ALTERADO — já provê itemCount, total, navigate
└── types/
    └── cart.ts                # NÃO ALTERADO — tipos já adequados
```

**Structure Decision**: Projeto single-page SPA. Bottom Sheet é um componente isolado em `src/components/`, consumido apenas por `MenuPage.tsx`. Nenhuma nova pasta ou módulo necessário — a simplicidade é mandatória pela constituição.

## Complexity Tracking

> Nenhuma violação. Seção mantida vazia por conformidade.
