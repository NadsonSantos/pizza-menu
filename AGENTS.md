# Agent Notes — pizza-menu

## Project

PWA de cardápio digital de pizzaria. O cliente navega pelo cardápio, monta um carrinho e envia o pedido via WhatsApp para a pizzaria.

## Spec-Driven Development (spec-kit)

Este projeto usa **spec-kit** (github/spec-kit) para Spec-Driven Development. O CLI `specify` está instalado via `uv tool install specify-cli`. A infraestrutura está sob `.specify/` e os comandos do agente em `.opencode/commands/`.

### Workflow SDD

1. **Constitution** — `/speckit.constitution`: Define os princípios do projeto. Edita `.specify/memory/constitution.md`.
2. **Specify** — `/speckit.specify <descrição>`: Cria a especificação da feature em `specs/<NNN>-<nome>/spec.md`.
3. **Clarify** (opcional) — `/speckit.clarify`: Refina ambiguidades da spec antes do planejamento.
4. **Plan** — `/speckit.plan`: Cria o plano técnico (data model, contracts, research) em `specs/<NNN>-<nome>/plan.md`.
5. **Tasks** — `/speckit.tasks`: Gera lista de tarefas em `specs/<NNN>-<nome>/tasks.md`.
6. **Analyze** (opcional) — `/speckit.analyze`: Relatório de consistência cross-artifact.
7. **Implement** — `/speckit.implement`: Executa as tarefas conforme o plano.

### Como usar com Hermes

O Hermes **não tem suporte nativo a slash commands do spec-kit**, mas as instruções completas estão nos arquivos `.opencode/commands/speckit.*.md`. Para executar qualquer etapa:

- Leia o arquivo de comando correspondente em `.opencode/commands/speckit.<etapa>.md`
- Siga as instruções do arquivo **exatamente** — ele contém o fluxo completo, validações e templates
- Exemplo: para criar uma spec, leia `.opencode/commands/speckit.specify.md` e siga o outline

### Templates

- `.specify/templates/spec-template.md` — Template de especificação
- `.specify/templates/plan-template.md` — Template de plano técnico
- `.specify/templates/tasks-template.md` — Template de tarefas
- `.specify/templates/constitution-template.md` — Template de constituição
- `.specify/templates/checklist-template.md` — Template de checklist

### Scripts

- `.specify/scripts/bash/setup-plan.sh` — Setup do planejamento
- `.specify/scripts/bash/setup-tasks.sh` — Setup das tarefas
- `.specify/scripts/bash/check-prerequisites.sh` — Verifica pré-requisitos

### Comandos git (extensão)

- `speckit.git.initialize` — Inicializa repositório
- `speckit.git.feature` — Cria branch de feature
- `speckit.git.commit` — Commit automático
- `speckit.git.remote` — Configura remote
- `speckit.git.validate` — Valida configuração git

<!-- SPECKIT START -->
Current plan: `specs/001-mvp-cardapio-pizzaria/plan.md`
Implementation plan: `.hermes/plans/2025-07-28_195900-mvp-cardapio-pizzaria.md`
<!-- SPECKIT END -->

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 18 |
| Build | Vite 5 |
| Linguagem | TypeScript 5 (strict) |
| Estilização | Tailwind CSS 3 |
| Estado | Context + useReducer (sem libs externas) |
| Roteamento | React Router 6 |
| Dados | `public/menu.json` estático |
| PWA | vite-plugin-pwa (Workbox) |
| Hospedagem | Estática (Vercel/Netlify/GitHub Pages) |

## Ferramentas

- **RTK** (`rtk`) — proxy CLI para token-optimized outputs. Prefixe comandos com `rtk` para outputs compactos: `rtk git status`, `rtk npm run build`, `rtk npx tsc`. Ver `CLAUDE.md` para referência completa de comandos. Filtros customizados em `.rtk/filters.toml`.
