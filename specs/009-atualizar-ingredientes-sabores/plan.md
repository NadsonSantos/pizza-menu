# Implementation Plan: Atualização dos Ingredientes dos Sabores no Cardápio

**Branch**: `009-atualizar-ingredientes-sabores` | **Date**: 2026-08-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/009-atualizar-ingredientes-sabores/spec.md`

## Summary

Substituir o campo `descricao` dos 32 sabores em `public/menu.json` pela tabela oficial de ingredientes do dono, **normalizada em caixa baixa (minúsculas)**, preservando conteúdo e ordem. Mudança **exclusivamente de dados** — nenhuma alteração de código, componente, estilo ou regra de negócio.

## Technical Context

**Language/Version**: TypeScript 5.8 (strict mode)

**Primary Dependencies**: React 19.1, React Router 7.6, Tailwind CSS 4, vite-plugin-pwa (Workbox)

**Storage**: `public/menu.json` (estático, única fonte de dados) — apenas o campo `descricao` dos 32 sabores muda

**Testing**: Vitest 4 + @testing-library/react (nenhum teste novo necessário — os testes existentes não dependem do texto de `descricao`)

**Target Platform**: Web (PWA instalável), mobile-first — 375px de referência

**Project Type**: Web application (PWA) 100% estática, sem backend

**Performance Goals**: N/A — mudança de dados estáticos não impacta performance

**Constraints**: sem backend / sem bibliotecas externas de UI ou estado (constitution); nenhuma alteração em `src/`, apenas `public/menu.json`

**Scale/Scope**: 32 sabores (13 tradicionais + 16 especiais + 3 sensacionais); 1 arquivo alterado

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Verificação |
|-----------|--------|-------------|
| I. Sem Backend Próprio | ✅ PASS | Feature 100% dados estáticos; nenhuma chamada de rede, API ou serverless |
| II. Mobile-First | ✅ PASS | Sem impacto de layout — apenas texto de descrição |
| III. PWA Instalável/Offline | ✅ PASS | `menu.json` já é cacheado pelo service worker; a edição do conteúdo não afeta o SW |
| IV. Regras de Negócio Fonte da Verdade | ✅ PASS | Nenhuma regra de preço/categoria alterada; `descricao` é texto informativo |
| V. Fora de Escopo (sem auth/pagamento/admin) | ✅ PASS | Nenhuma dessas áreas tocada |

**Resultado**: nenhuma violação — Complexity Tracking fica vazio.

## Project Structure

### Documentation (this feature)

```text
specs/009-atualizar-ingredientes-sabores/
├── plan.md              # Este arquivo
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (contrato de dados)
│   └── data-contract.md # mapeamento id → nova descricao (caixa baixa)
└── tasks.md             # Phase 2 output (via /speckit.tasks — NÃO criado aqui)
```

### Source Code (repository root)

```text
public/
└── menu.json            # ÚNICO arquivo alterado (campo descricao dos 32 sabores)
```

**Structure Decision**: projeto único existente mantido. Nenhuma pasta/arquivo novo em `src/`. A entrega é a edição de `public/menu.json` conforme `contracts/data-contract.md`.

## Complexity Tracking

> Nenhuma violação de constituição — seção vazia.
