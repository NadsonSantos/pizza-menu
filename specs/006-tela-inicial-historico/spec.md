# Feature Specification: Tela Inicial Dinâmica com Histórico de Compras

**Feature Branch**: `006-tela-inicial-historico`

**Created**: 2026-08-10

**Status**: Draft

**Input**: "Precisamos evoluir a experiência do usuário (UX/UI) no nosso aplicativo, criando uma nova tela inicial dinâmica que se adapta com base no histórico de compras dos últimos 3 meses do cliente."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Persistência de Pedidos no localStorage (Priority: P1) 🎯

Quando o usuário finaliza um pedido (clica em "Finalizar Pedido — WhatsApp"), o sistema salva o pedido completo no `localStorage` ANTES de limpar o carrinho. Sem essa US, não há dados para alimentar o histórico.

**Why this priority**: É o pré-requisito de dados. As US 2, 3 e 4 dependem de pedidos persistidos existirem. Sem isso, a tela dinâmica nunca mostrará conteúdo.

**Independent Test**: Finalizar um pedido via WhatsApp → inspecionar `localStorage` → verificar que a chave `order_history` contém um array com o pedido recém-finalizado (timestamp, itens, total, modo de entrega, pagamento).

**Acceptance Scenarios**:

1. **Given** que o carrinho tem 2 itens e o usuário clica em "Finalizar Pedido — WhatsApp", **When** o WhatsApp abre e `CLEAR_CART` é disparado, **Then** um registro do pedido (com timestamp ISO 8601) é adicionado ao `localStorage` sob a chave `order_history` ANTES do carrinho ser limpo.
2. **Given** que já existem 5 pedidos no `localStorage`, **When** um 6º pedido é finalizado, **Then** o array mantém todos os pedidos (não há limite arbitrário de quantidade — o filtro de 3 meses é feito na leitura).
3. **Given** que `localStorage` está vazio (primeira visita ao app), **When** o app carrega, **Then** não há erro — a chave `order_history` é tratada como array vazio.

---

### User Story 2 — Roteamento Condicional Pós-Splash (Priority: P1) 🎯

Após a splash page, o app verifica se há pedidos nos últimos 3 meses. Se houver, direciona para a nova tela inicial personalizada. Se não houver, mantém o fluxo atual (cardápio direto).

**Why this priority**: É o ponto de bifurcação do fluxo. Define qual experiência o usuário terá.

**Independent Test**: Simular `localStorage` com um pedido de 1 mês atrás → recarregar o app → após splash, ver a tela inicial personalizada. Limpar `localStorage` → recarregar → após splash, ver o cardápio direto.

**Acceptance Scenarios**:

1. **Given** que `order_history` contém pelo menos 1 pedido com timestamp nos últimos 90 dias, **When** a splash page termina, **Then** o app renderiza a nova tela inicial (`HomePage`) na rota `/`.
2. **Given** que `order_history` está vazio OU todos os pedidos têm timestamp > 90 dias atrás, **When** a splash page termina, **Then** o app renderiza a `MenuPage` normalmente (comportamento atual inalterado).
3. **Given** que o usuário está na tela inicial personalizada, **When** ele navega para `/carrinho` e depois volta para `/` via botão "Voltar" ou Link, **Then** a tela inicial personalizada é exibida novamente (não há reexibição do splash — apenas o roteamento normal).

---

### User Story 3 — Tela Inicial Personalizada (Priority: P2)

A nova tela inicial (`HomePage`) exibe os últimos 3 pedidos em ordem cronológica decrescente e um CTA "Novo Pedido" que leva ao cardápio. Cada pedido no histórico mostra descrição resumida, valor total e botão "Ver mais".

**Why this priority**: É o conteúdo visível da feature — o que o usuário vê. Mas só funciona se as US 1 e 2 estiverem completas.

**Independent Test**: Com `localStorage` populado com 5 pedidos mock → abrir `/` → ver apenas os 3 mais recentes listados, cada um com descrição, valor e botão "Ver mais".

**Acceptance Scenarios**:

1. **Given** que há 5 pedidos no histórico (todos dentro de 90 dias), **When** a HomePage renderiza, **Then** apenas os 3 mais recentes são exibidos, em ordem do mais novo para o mais antigo.
2. **Given** que há apenas 1 pedido no histórico, **When** a HomePage renderiza, **Then** apenas esse 1 pedido é exibido (sem erros de layout por falta de itens).
3. **Given** que a HomePage está visível, **When** o usuário clica em "Novo Pedido", **Then** é redirecionado para a `MenuPage` (fluxo de compra padrão).
4. **Given** que um pedido do histórico contém 1 pizza Margherita + 1 Pepsi, **When** a HomePage renderiza esse pedido, **Then** a descrição resumida é "Pizza Margherita + 1 item" (ou similar — o formato exato fica a cargo do design, mas deve ser conciso e informativo).
5. **Given** que o pedido tem valor total de R$ 52,00, **When** renderizado na HomePage, **Then** o valor é exibido como "R$ 52,00".

---

### User Story 4 — Detalhes do Pedido e "Pedir Novamente" (Priority: P2)

Ao clicar em "Ver mais" em um pedido do histórico, o usuário vê os detalhes completos daquele pedido. Nessa tela, há um botão "Pedir novamente" que popula o carrinho com os mesmos itens e redireciona para a tela de carrinho.

**Why this priority**: É a funcionalidade de recompra — o principal valor de negócio da feature. Mas depende da US 3 (lista de histórico) estar funcional.

**Independent Test**: Clicar em "Ver mais" em um pedido mock → ver todos os itens, valores, entrega e pagamento → clicar "Pedir novamente" → ser redirecionado para `/carrinho` com os itens do pedido no carrinho, prontos para revisão.

**Acceptance Scenarios**:

1. **Given** que o usuário está na HomePage, **When** clica em "Ver mais" no primeiro pedido do histórico, **Then** é navegado para `/pedido/:id` exibindo os detalhes completos (itens, quantidades, subtotal, taxa de entrega, total, modo de entrega, forma de pagamento).
2. **Given** que o usuário está na tela de detalhes do pedido (`/pedido/:id`), **When** clica em "Voltar", **Then** retorna à HomePage (`/`).
3. **Given** que o usuário está na tela de detalhes, **When** clica em "Pedir novamente", **Then** o carrinho é populado com todos os itens daquele pedido (mesmos sabores, quantidades, observações) e o usuário é redirecionado para `/carrinho`.
4. **Given** que o pedido original tinha entrega selecionada e um endereço, **When** "Pedir novamente" é acionado, **Then** o carrinho mantém `delivery: 'entrega'` e `selectedAddressId` com o endereço original (se ainda existir no AddressContext).
5. **Given** que o pedido original foi "retirada", **When** "Pedir novamente" é acionado, **Then** o carrinho é preenchido com `delivery: 'retirada'`.
6. **Given** que o carrinho já tem itens (de uma compra em andamento), **When** "Pedir novamente" é acionado, **Then** os itens existentes são SUBSTITUÍDOS pelos itens do pedido (não mesclados). O carrinho anterior é descartado.

---

### Edge Cases

- **localStorage cheio / quota excedida**: Se o navegador atingir o limite de armazenamento (tipicamente 5–10 MB), o salvamento do pedido falha silenciosamente. O app NÃO bloqueia a finalização do pedido por falha no `localStorage` — o pedido ainda é enviado via WhatsApp normalmente. A perda de histórico é aceitável neste cenário.
- **localStorage corrompido**: Se `JSON.parse` falhar ao ler `order_history`, tratar como array vazio (comportamento de "novo usuário"). Não tentar recuperar dados corrompidos.
- **Pedido sem itens**: Cenário impossível (o botão "Finalizar Pedido" só aparece com carrinho não-vazio), mas defensivamente: se `state.items.length === 0`, não salvar no histórico.
- **Timestamps inválidos**: Se um pedido no histórico não tiver timestamp ou tiver timestamp inválido, ignorá-lo no filtro de 3 meses (não quebrar a renderização).
- **Múltiplas abas**: Cada aba tem seu próprio `localStorage`. Comportamento padrão de browser — o app não tenta sincronizar entre abas.
- **Dispositivos diferentes**: O histórico é local ao navegador. Trocar de celular = "novo usuário". Isso é esperado e documentado.
- **"Pedir novamente" com sabores removidos do cardápio**: Se um sabor que existia no pedido original foi removido do `menu.json`, o item ainda é adicionado ao carrinho com os dados salvos no histórico. A responsabilidade de validar o cardápio atual é do usuário — o app não bloqueia a recompra.
- **Navegação direta para `/pedido/:id`**: Se o usuário acessar uma URL de detalhes de pedido que não existe no histórico, exibir mensagem "Pedido não encontrado" com link para voltar ao início. Não crashar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE salvar o pedido (itens, valores, entrega, pagamento, timestamp ISO 8601) no `localStorage` sob a chave `order_history` ao finalizar um pedido via WhatsApp, ANTES de executar `CLEAR_CART`.
- **FR-002**: O sistema DEVE ler `order_history` do `localStorage` de forma assíncrona (ou lazy) após a splash page para determinar a elegibilidade do usuário.
- **FR-003**: O sistema DEVE filtrar pedidos com timestamp superior a 90 dias e tratá-los como inexistentes para fins de elegibilidade e exibição.
- **FR-004**: O sistema DEVE renderizar a HomePage (`/`) se houver ≥ 1 pedido nos últimos 90 dias; caso contrário, DEVE renderizar a MenuPage (comportamento atual).
- **FR-005**: A HomePage DEVE listar no máximo os 3 pedidos mais recentes (por timestamp), em ordem decrescente.
- **FR-006**: Cada item do histórico na HomePage DEVE exibir: descrição resumida do pedido, valor total formatado em reais (R$), e botão/link "Ver mais".
- **FR-007**: A HomePage DEVE conter um botão "Novo Pedido" que navega para a MenuPage (fluxo de compra padrão).
- **FR-008**: Ao clicar em "Ver mais", o sistema DEVE navegar para `/pedido/:id` exibindo detalhes completos do pedido (itens, quantidades, subtotal, taxa, total, entrega, pagamento).
- **FR-009**: A tela de detalhes (`/pedido/:id`) DEVE ter um botão "Voltar" (retorna à HomePage) e um botão "Pedir novamente".
- **FR-010**: Ao acionar "Pedir novamente", o sistema DEVE: (a) limpar o carrinho atual, (b) adicionar todos os itens do pedido original, (c) restaurar modo de entrega e endereço (se aplicável), (d) redirecionar para `/carrinho`.
- **FR-011**: Falhas no `localStorage` (quota excedida, dados corrompidos) NÃO DEVEM impedir a finalização do pedido via WhatsApp nem quebrar a renderização do app.

### Key Entities

- **OrderRecord** (armazenado em `localStorage.order_history[]`): Representa um pedido finalizado. Atributos: `id` (string, UUID), `timestamp` (string, ISO 8601), `items` (CartItem[]), `delivery` (DeliveryMode), `payment` (PaymentMethod | null), `troco` (string), `addressId` (string | null), `subtotal` (number), `taxaEntrega` (number), `total` (number).

- **HomePage eligibility flag**: Derivado da leitura de `order_history` — booleano que indica se há ≥ 1 pedido com timestamp dentro dos últimos 90 dias. Controla o roteamento condicional pós-splash.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um pedido finalizado aparece no `localStorage` em menos de 50ms após o clique em "Finalizar Pedido" (operação síncrona de `JSON.stringify` + `setItem`).
- **SC-002**: A decisão de elegibilidade (HomePage vs MenuPage) é concluída antes do término da splash page (2s), sem atraso perceptível na transição.
- **SC-003**: Usuários sem histórico NÃO percebem nenhuma diferença no fluxo atual — zero regressão.
- **SC-004**: A ação "Pedir novamente" popula o carrinho e redireciona em menos de 100ms (operações puramente em memória/localStorage).
- **SC-005**: `npm run build` conclui com sucesso (exit code 0) sem warnings de TypeScript.

## Assumptions

- O `localStorage` é o único mecanismo de persistência viável dado o constraint "Sem Backend Próprio" (Constituição, Princípio I). Isso implica que o histórico é local ao navegador e não é compartilhado entre dispositivos.
- O formato de data no timestamp é ISO 8601 (`new Date().toISOString()`), que permite comparação lexicográfica para filtro de 90 dias.
- "Últimos 3 meses" = 90 dias corridos a partir da data atual. O cálculo é feito no cliente com `Date.now() - 90 * 24 * 60 * 60 * 1000`.
- O pedido é salvo no `localStorage` ANTES do `CLEAR_CART`, garantindo que os dados do carrinho estejam disponíveis no momento do salvamento.
- O WhatsAppButton existente é o ponto de alteração para FR-001 — o salvamento é inserido entre a abertura do WhatsApp e a limpeza do carrinho.
- A tela de detalhes do pedido (`/pedido/:id`) não depende de `menu.json` — todos os dados vêm do `localStorage`. Sabores removidos do cardápio não quebram a visualização.
- "Pedir novamente" NÃO restaura o método de pagamento nem o troco — o usuário precisa selecionar novamente na finalização (fluxo normal do checkout).
- O estado `delivery` e `selectedAddressId` são restaurados ao máximo possível. Se o endereço original foi deletado do AddressContext, `selectedAddressId` é setado como null (comportamento defensivo).

