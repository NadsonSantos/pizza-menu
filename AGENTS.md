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

O Hermes **não tem slash commands nativos** para spec-kit. Em vez disso, digite o nome da etapa em linguagem natural. O Hermes carrega a skill correspondente automaticamente:

| Você diz | Skill carregada | Ação |
|----------|----------------|------|
| `speckit constituição` | speckit-constitution | Cria/atualiza `.specify/memory/constitution.md` |
| `speckit specify: <descrição>` | speckit-specify | Cria spec em `specs/<NNN>-<nome>/spec.md` |
| `speckit plan` | speckit-plan | Cria plano técnico em `specs/<NNN>-<nome>/plan.md` |
| `speckit tasks` | speckit-tasks | Gera lista de tarefas em `specs/<NNN>-<nome>/tasks.md` |
| `speckit implement` | speckit-implement | Executa as tarefas conforme o plano |
| `speckit clarify` | speckit-clarify | Refina ambiguidades (opcional) |
| `speckit analyze` | speckit-analyze | Relatório de consistência (opcional) |

**⚠️ REGRA CRÍTICA — UMA ETAPA POR VEZ**: Execute APENAS a etapa solicitada. NUNCA encadeie etapas automaticamente. Após concluir `speckit specify`, NÃO execute `speckit plan` — espere o usuário pedir explicitamente.

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
Current plan: `specs/004-entrega-opcional-enderecos/plan.md`
Previous plan: `specs/003-fluxo-cardapio-unico/plan.md`
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

---

## Pipeline SDD Autônomo (contrato de handoff entre agentes Multica)

Agentes do workspace Nadson-Work: **Product Owner** (orquestrador), **Front-End Engineer (React + Tailwind CSS)** (implementador), **Code Review Agent** (quality gate). Fluxo obrigatório:

1. Usuário descreve necessidade → **PO** cria a issue no repositório.
2. **PO** roda `/spec` (speckit specify), gera `specs/<NNN>-<nome>/spec.md`, comenta na issue mencionando o usuário e **aguarda aprovação** (aprovado / aprovado com ressalvas / ajuste).
3. Aprovado → **PO** roda `/plan` (speckit plan), cria a **branch da issue**, gera os artefatos de plano, comenta mencionando o usuário e **aguarda aprovação**. Ajuste → PO revisa e comenta novamente.
4. Aprovado → **PO menciona o Engenheiro** na issue para implementar as tasks do plano na branch criada.
5. **Engenheiro** implementa na branch, roda auditorias internas (`security-auditor` OWASP, `a11y-ux-auditor`, `test-writer`, `perf-auditor`), push e **abre/atualiza PR**.
   - Inconsistência real no `/plan` → Engenheiro **não força**: menciona o PO para ajustar o plano (volta ao passo 3).
6. Engenheiro conclui → **menciona o Code Reviewer no PR**.
7. **Code Reviewer** revisa via PR: qualidade, testes, **e auditorias de segurança (OWASP) e UX/UI/a11y** — não aprova por estilo.
   - Reprovou → menciona o Engenheiro com tasks de correção; Engenheiro corrige e volta ao passo 6.
   - **3ª rejeição no mesmo ciclo** → CR **escalona para o usuário** (resumo dos motivos) e aguarda decisão.
   - Aprovou → **menciona o PO**.
8. **PO** valida a implementação final contra a spec original.
   - Reprovou → menciona o Engenheiro com ajustes (volta ao passo 6).
   - Aprovou → **merge na `main`**, **fecha a issue**, e **menciona o usuário** com a conclusão (PR/commit mergeado).

### Regras gerais

- Cada agente **só age quando mencionado/acionado**; nunca pula etapa nem avança sem aprovação humana nos gates (fim do /spec e fim do /plan).
- Todo handoff via comentário na issue/PR mencionando o responsável pelo próximo passo, registrando: quem acionou, quando, resultado (aprovado/rejeitado + motivo).
- Cada agente atualiza o status da issue/task antes de passar adiante.
- Loop Engenheiro ⇄ Code Reviewer autocontido até **3 rejeições**; a partir daí escala para o usuário.
- Usuário só é mencionado nos pontos de decisão: aprovação de spec, aprovação de plano, escalonamento por rejeições repetidas e conclusão final.
- Toda implementação em **branch própria da issue**; Code Reviewer revisa **via PR**, nunca código solto.
- **Não há timeout automático**: pipeline pausado aguardando aprovação humana é comportamento esperado, não falha.
- Somente o **PO** comunica o usuário diretamente; o Code Reviewer só o menciona no escalonamento.
- Encerramento da SPEC só é completo após: aprovação final do PO + merge na main + fechamento da issue.
- Menções em comentários: `[@Nome](mention://agent/<uuid>)` (texto puro `@Nome` não dispara).
