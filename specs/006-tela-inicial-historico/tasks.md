# Tasks: Tela Inicial Dinâmica com Histórico de Compras (NAD-6)

**Input**: Design documents from `/specs/006-tela-inicial-historico/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

> **Nota**: Este arquivo não existia no diretório da feature (o `check-prerequisites` sinalizou a ausência durante a implementação). Foi criado pelo Code Review Agent para registrar as tarefas de correção do ciclo de revisão (CR-xxx). Tarefas de implementação da feature foram executadas a partir do `quickstart.md` + handoff do PO.

---

## Code Review Tasks (ciclo 1 — 2026-08-11)

- [ ] CR-001 Corrigir links "Ver Cardápio" e "Adicionar mais itens" para apontar para `/cardapio` (usuários elegíveis)

Contexto:
A rota `/` passou a ser condicional no App (`src/App.tsx:29`): usuários com pedidos nos últimos 90 dias veem a `HomePage`, novos usuários veem a `MenuPage`. O alias `/cardapio` foi criado para manter acesso direto ao cardápio, e o CTA "Novo Pedido" da HomePage o utiliza corretamente (`src/pages/HomePage.tsx:25`).

Problema:
Dois links pré-existentes continuam apontando para `/`, que para usuários elegíveis renderiza a `HomePage` (não o cardápio):
- `src/components/EmptyCart.tsx:9` — link "Ver Cardápio"
- `src/pages/CartPage.tsx:31` — link "← Adicionar mais itens"

Para o público-alvo da feature (usuários com histórico), clicar em "Ver Cardápio" com o carrinho vazio — ou em "Adicionar mais itens" durante uma compra — leva à tela inicial personalizada em vez do cardápio, exigindo um clique extra e contrariando o rótulo do link. Regressão de navegação introduzida pela mudança de rota.

Critério de aceite:

- `src/components/EmptyCart.tsx` e `src/pages/CartPage.tsx` apontam para `/cardapio` (não `/`).
- Usuário elegível com carrinho vazio clica em "Ver Cardápio" e vê a `MenuPage`.
- Usuário elegível na tela de carrinho clica em "← Adicionar mais itens" e vê a `MenuPage`.
- Novos usuários continuam vendo a `MenuPage` na rota `/` (comportamento inalterado).

Prioridade:
High

---

- [ ] CR-002 Corrigir composição da branch do PR #5 (contém commits do NAD-5)

Contexto:
A branch `006-tela-inicial-historico` foi criada sobre a branch do NAD-5 (commit `ba55fe2`), que ainda não foi mergeada — o PR #4 (NAD-5) segue aberto sem revisão. Com isso, o diff do PR #5 inclui 29 arquivos do tema visual do NAD-5 além dos 13 do NAD-6.

Problema:
Viola a regra do pipeline "Toda implementação em branch própria da issue". Se o PR #5 for mergeado antes do PR #4, o trabalho do NAD-5 (tema visual) entra na `main` sem ter passado pela própria revisão/PR.

Critério de aceite:

- Alinhar ordem de merge com o PO: mergear/revisar o PR #4 (NAD-5) primeiro, depois rebasear `006-tela-inicial-historico` sobre `main`.
- Ou, após decisão explícita do PO, o PR #5 passa a conter apenas o delta do NAD-6.
- O diff do PR #5 não contém arquivos exclusivos do NAD-5 após o ajuste.

Prioridade:
Medium

---

- [ ] CR-003 Avaliar reavaliação de elegibilidade após o primeiro pedido na mesma sessão

Contexto:
A elegibilidade é calculada uma vez no render do `App` após a splash (`src/App.tsx:24`, `hasRecentOrders()`). Para um usuário NOVO que finaliza o primeiro pedido, o `order_history` é gravado (`WhatsAppButton`), mas o `App` não re-renderiza por navegação — `hasHistory` permanece `false` na sessão atual.

Problema:
Após finalizar o primeiro pedido, navegar para `/` (via logo ou links) continua exibindo a `MenuPage`; a `HomePage` só aparece após reload/nova sessão. Não viola a spec (a checagem é definida como pós-splash), mas é uma inconsistência de UX com o propósito da feature.

Critério de aceite:

- Decidir e documentar o comportamento: manter checagem única pós-splash (e registrar como limitação conhecida) OU reavaliar elegibilidade ao navegar para `/`.
- Se implementado: usuário que finaliza o primeiro pedido vê a `HomePage` ao voltar para `/` na mesma sessão.

Prioridade:
Low

---

- [ ] CR-004 Versionar smoke test da lógica `orderHistory`

Contexto:
A lógica de `src/utils/orderHistory.ts` (validação defensiva, filtro 90d, ordenação, descarte de corrompidos) foi validada com um smoke test de 14 asserts executado manualmente pelo Engenheiro, mas o teste não foi versionado. O projeto não possui infraestrutura de testes (sem runner/config no `package.json`).

Problema:
Sem versão do teste, mudanças futuras na lógica de histórico não têm proteção contra regressão.

Critério de aceite:

- Adicionar script/arquivo de smoke test versionado (ex.: `scripts/smoke-order-history.mjs` ou similar) que exercite os cenários: leitura vazia, roundtrip save/read, filtro 90d, ordenação desc, JSON corrompido, registro inválido descartado, quota excedida silenciosa.
- Rodar e registrar o resultado no PR (ou no comentário de conclusão).

Prioridade:
Low
