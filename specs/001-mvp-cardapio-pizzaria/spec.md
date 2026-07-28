# Feature Specification: MVP Cardápio Digital de Pizzaria (PWA)

**Feature Branch**: `001-mvp-cardapio-pizzaria`

**Created**: 2025-07-28

**Status**: Draft

**Input**: User description: "Construir um MVP de PWA que funciona como cardápio digital de uma pizzaria, com carrinho de pedidos e finalização via WhatsApp. O cliente acessa pelo celular, navega pelo cardápio organizado em categorias, monta pizzas escolhendo sabores, adiciona ao carrinho, escolhe entrega ou retirada e forma de pagamento, e finaliza o pedido — enviado como mensagem formatada para o WhatsApp via link wa.me."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Navegar Cardápio e Ver Detalhes (Priority: P1) 🎯

O cliente abre o app no celular, visualiza o cardápio da pizzaria organizado por categorias (Tradicionais Simples, Especiais, Sensacionais, Bebidas). Cada item mostra nome, imagem, preço base e descrição curta. Para pizzas, o cliente vê os sabores disponíveis dentro de cada categoria. O cardápio inteiro funciona offline após a primeira visita.

**Why this priority**: Sem cardápio visível, nada mais funciona. É o ponto de entrada de toda a experiência e entrega valor imediato (consultar o cardápio). É a primeira coisa testável e demonstrável.

**Independent Test**: Abrir o app, verificar que todas as categorias e itens do `menu.json` são exibidos corretamente, com imagens, preços e descrições. Ativar modo offline no browser e verificar que o cardápio continua acessível.

**Acceptance Scenarios**:

1. **Given** que o `menu.json` tem 3 categorias de pizza com 4 sabores cada + 1 categoria de bebidas, **When** o cliente acessa o app, **Then** vê o cardápio completo com todas as categorias e itens, cada um mostrando nome, imagem e preço.
2. **Given** que o cliente já visitou o app anteriormente, **When** o cliente acessa o app sem internet, **Then** o cardápio completo é exibido a partir do cache do service worker.
3. **Given** que o cardápio está sendo exibido em tela de 375px de largura, **When** o cliente rola pelas categorias, **Then** todos os itens são legíveis, imagens não quebram o layout, e os preços são visíveis sem scroll horizontal.

---

### User Story 2 — Montar Pizza e Adicionar ao Carrinho (Priority: P1) 🎯

O cliente seleciona uma pizza, escolhe de 1 a 3 sabores (podendo combinar categorias diferentes), vê o preço calculado automaticamente conforme as regras de negócio, opcionalmente adiciona uma observação (ex: "sem cebola"), e adiciona ao carrinho.

**Why this priority**: É a ação principal do app — montar o pedido. Sem carrinho funcional, o app é apenas um cardápio estático.

**Independent Test**: Selecionar uma pizza da categoria Sensacionais, escolher 2 sabores (1 Sensacional + 1 Especial), verificar que o preço exibido é R$40 (categoria mais cara). Adicionar um 3º sabor, verificar acréscimo de R$5 (total R$45). Adicionar observação "sem cebola". Verificar que o item aparece no carrinho com descrição, preço e observação.

**Acceptance Scenarios**:

1. **Given** que o cliente selecionou uma pizza, **When** escolhe 2 sabores (1 Tradicional Simples + 1 Especial), **Then** o preço exibido é R$35 (categoria mais cara, Especial).
2. **Given** que o cliente escolheu 3 sabores (1 Sensacional + 1 Especial + 1 Tradicional), **When** confirma a seleção, **Then** o preço exibido é R$45 (Sensacional R$40 + acréscimo de R$5 pelo 3º sabor).
3. **Given** que o cliente selecionou apenas 1 sabor, **When** tenta adicionar ao carrinho, **Then** o sistema permite (1 sabor é válido).
4. **Given** que o cliente selecionou 4 sabores, **When** tenta selecionar o 4º, **Then** o sistema impede com mensagem "Máximo de 3 sabores por pizza".
5. **Given** que o cliente adicionou uma observação "sem cebola, borda recheada", **When** o item aparece no carrinho, **Then** a observação é exibida abaixo do item.
6. **Given** que o cliente voltou à tela de montagem após adicionar ao carrinho, **When** seleciona nova pizza, **Then** os sabores voltam ao estado não selecionado (nova pizza).

---

### User Story 3 — Gerenciar Carrinho (Priority: P1) 🎯

O cliente visualiza todos os itens no carrinho, ajusta quantidade de cada item, remove itens, vê o subtotal, adiciona mais pizzas ou bebidas, e vê o total atualizado em tempo real.

**Why this priority**: Carrinho sem gerenciamento é inútil. O cliente precisa revisar e ajustar antes de finalizar.

**Independent Test**: Adicionar 2 pizzas diferentes e 1 bebida ao carrinho. Aumentar quantidade da primeira pizza para 2, ver subtotal atualizar. Remover a bebida, verificar que some do carrinho. Verificar total final.

**Acceptance Scenarios**:

1. **Given** que o carrinho tem 2 pizzas e 1 bebida, **When** o cliente aumenta a quantidade de uma pizza de 1 para 2, **Then** o subtotal do item dobra e o total do carrinho atualiza imediatamente.
2. **Given** que o carrinho tem 3 itens, **When** o cliente remove 1 item, **Then** o item desaparece da lista e o total recalcula.
3. **Given** que o carrinho está vazio, **When** o cliente tenta acessar o carrinho, **Then** vê a mensagem "Seu carrinho está vazio" com link para voltar ao cardápio.
4. **Given** que o cliente tem itens no carrinho, **When** navega para outra página e volta ao carrinho, **Then** todos os itens permanecem (estado persistido via Context).

---

### User Story 4 — Escolher Entrega/Retirada e Pagamento (Priority: P2)

Antes de finalizar, o cliente escolhe entre Entrega (R$5) ou Retirada (grátis), e seleciona forma de pagamento: Dinheiro, Cartão ou Pix. Se escolher Dinheiro, um campo opcional de troco aparece.

**Why this priority**: Essencial para o pedido fazer sentido para a pizzaria, mas depende do carrinho estar funcional primeiro.

**Independent Test**: Com itens no carrinho, selecionar "Entrega", verificar acréscimo de R$5 no total. Selecionar "Dinheiro", verificar campo de troco. Preencher troco com "R$100", verificar que aparece na mensagem final.

**Acceptance Scenarios**:

1. **Given** que o subtotal do carrinho é R$75, **When** o cliente seleciona "Entrega", **Then** o total passa a ser R$80 e o item "Taxa de entrega: R$5" aparece no resumo.
2. **Given** que o cliente seleciona "Retirada", **When** revisa o resumo, **Then** não há acréscimo de taxa e o texto indica "Retirada no local".
3. **Given** que o cliente seleciona "Dinheiro", **When** o campo de troco aparece, **Then** o campo é opcional e aceita valores como "R$50" ou "50".
4. **Given** que o cliente seleciona "Cartão" ou "Pix", **When** revisa o resumo, **Then** o campo de troco não é exibido.
5. **Given** que nenhuma forma de pagamento foi selecionada, **When** o cliente tenta finalizar, **Then** o sistema mostra "Selecione uma forma de pagamento" e não permite prosseguir.

---

### User Story 5 — Finalizar Pedido e Enviar via WhatsApp (Priority: P2)

O cliente revisa o resumo completo do pedido (itens, quantidades, observações, taxa de entrega, forma de pagamento, troco se aplicável, total) e clica em "Finalizar Pedido". O app monta uma mensagem de texto formatada e abre o WhatsApp da pizzaria com a mensagem pré-preenchida. O cliente confirma manualmente o envio.

**Why this priority**: É o objetivo final — converter carrinho em pedido. Depende de todos os stories anteriores mas pode ser testado com dados mockados.

**Independent Test**: Com carrinho, entrega e pagamento definidos, clicar "Finalizar". Verificar que uma nova aba abre com `wa.me/<número>` e a mensagem contém todos os itens formatados, totais, e dados de entrega/pagamento. Verificar que a mensagem não é enviada automaticamente.

**Acceptance Scenarios**:

1. **Given** que o carrinho tem 1 pizza Sensacional (R$40 + R$5 pelo 3º sabor = R$45) + 1 Pepsi (R$8), entrega selecionada (R$5), pagamento Cartão, **When** o cliente finaliza, **Then** o link `wa.me/5511999999999` abre com mensagem contendo: itens listados, subtotal R$53, taxa R$5, total R$58, pagamento Cartão.
2. **Given** que o cliente escolheu Dinheiro com troco para R$100 e total é R$58, **When** finaliza, **Then** a mensagem inclui "Troco para: R$100".
3. **Given** que o cliente está no resumo final, **When** clica em "Finalizar Pedido", **Then** o WhatsApp abre em nova aba e o cliente precisa clicar em "Enviar" manualmente — o envio NUNCA é automático.

---

### User Story 6 — Instalar PWA na Tela Inicial (Priority: P3)

O cliente pode instalar o app na tela inicial do celular. Após instalado, o app abre em tela cheia (standalone), com ícone e nome da pizzaria, proporcionando experiência próxima de app nativo.

**Why this priority**: Melhora a experiência de uso recorrente. O app funciona perfeitamente no browser também — a instalação é uma conveniência adicional.

**Independent Test**: Acessar o app no Chrome Android, verificar que o banner de instalação aparece. Instalar, verificar ícone na tela inicial. Abrir o app instalado, verificar modo standalone (sem barra de URL do navegador).

**Acceptance Scenarios**:

1. **Given** que o cliente acessa o app pelo Chrome no Android, **When** o service worker é registrado com sucesso, **Then** o banner "Adicionar à tela inicial" é exibido (ou o menu "Instalar aplicativo" fica disponível).
2. **Given** que o cliente instalou o PWA, **When** abre o app pela tela inicial, **Then** o app abre em modo standalone (sem barra de endereço do navegador), com ícone e nome "Cardápio [Pizzaria]" na splash screen.
3. **Given** que o PWA está instalado, **When** o cliente está offline, **Then** o app abre normalmente e o cardápio cacheado é exibido.

---

### Edge Cases

- **Carrinho vazio ao finalizar**: Sistema bloqueia finalização e exibe "Adicione itens ao carrinho antes de finalizar".
- **menu.json mal formatado**: App exibe mensagem amigável em português "Erro ao carregar o cardápio. Verifique o arquivo menu.json." — nunca um stack trace.
- **menu.json ausente**: App exibe tela de erro com instruções para o dono da pizzaria.
- **Selecionar 0 sabores**: Sistema impede — mínimo de 1 sabor obrigatório.
- **Cliente fecha o WhatsApp sem enviar**: O pedido não é registrado. O app não tem como saber se foi enviado — isso é esperado e aceitável no MVP.
- **WhatsApp não instalado no dispositivo**: O link `wa.me` abre no browser mobile e oferece WhatsApp Web como fallback.
- **Múltiplas abas do app**: Estado do carrinho é isolado por aba (Context por sessão) — não há persistência cross-session.
- **Imagem de item não encontrada**: Exibe placeholder genérico, não quebra o layout.
- **Preço zero ou negativo no menu.json**: App exibe "Preço indisponível" e não permite adicionar ao carrinho.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema MUST carregar todo o conteúdo do cardápio a partir de um único arquivo `menu.json` estático, sem requisições a backend.
- **FR-002**: Sistema MUST exibir o cardápio organizado por categorias (pizzas agrupadas por faixa de preço: Tradicionais Simples, Especiais, Sensacionais; Bebidas separadas).
- **FR-003**: Sistema MUST permitir selecionar de 1 a 3 sabores por pizza.
- **FR-004**: Sistema MUST calcular o preço da pizza como o preço da categoria mais cara entre os sabores escolhidos.
- **FR-005**: Sistema MUST adicionar acréscimo fixo de R$5 quando o cliente selecionar um 3º sabor.
- **FR-006**: Sistema MUST tratar bebidas como item simples, com preço direto e sem seleção de sabor.
- **FR-007**: Sistema MUST permitir adicionar observações em texto livre por item do carrinho.
- **FR-008**: Sistema MUST permitir ajustar quantidade e remover itens do carrinho.
- **FR-009**: Sistema MUST calcular e exibir subtotal por item e total do carrinho em tempo real.
- **FR-010**: Sistema MUST oferecer opção de Entrega (acrescenta R$5) ou Retirada (sem acréscimo).
- **FR-011**: Sistema MUST exigir seleção de forma de pagamento: Dinheiro, Cartão ou Pix.
- **FR-012**: Sistema MUST exibir campo de troco condicional quando "Dinheiro" for selecionado.
- **FR-013**: Sistema MUST montar mensagem de texto formatada com todos os itens, quantidades, observações, taxa, forma de pagamento, troco (se aplicável) e total.
- **FR-014**: Sistema MUST abrir o WhatsApp da pizzaria via link `wa.me/<número>` com a mensagem pré-preenchida, SEM envio automático.
- **FR-015**: Sistema MUST registrar um Service Worker com estratégia cache-first para assets estáticos e `menu.json`.
- **FR-016**: Sistema MUST fornecer um Web App Manifest com `display: standalone`, ícone e nome para instalação PWA.
- **FR-017**: Sistema MUST funcionar com layout mobile-first, otimizado para viewport de 375px, com breakpoints adicionais apenas quando necessário.
- **FR-018**: Sistema MUST exibir mensagens de erro em português claro, nunca stack traces, quando `menu.json` estiver ausente ou mal formatado.
- **FR-019**: Número de WhatsApp da pizzaria, taxa de entrega, e todo conteúdo do cardápio MUST ser configurável exclusivamente via `menu.json`.
- **FR-020**: Sistema MUST rejeitar finalização se carrinho estiver vazio, com mensagem orientando o cliente.

### Key Entities

- **Categoria (`categoria`)**: Agrupa itens do cardápio. Atributos: `id`, `nome` (ex: "Tradicionais Simples"), `tipo` (pizza | bebida), `preco_base` (para pizzas, preço base da categoria).
- **Sabor (`sabor`)**: Um sabor de pizza disponível. Atributos: `id`, `nome` (ex: "Mussarela"), `categoria_id` (referência à categoria a que pertence), `descricao`, `imagem_url`.
- **Bebida (`bebida`)**: Item simples do cardápio. Atributos: `id`, `nome` (ex: "Pepsi Lata 350ml"), `preco`, `imagem_url`.
- **ItemCardapio**: Representação unificada de um item do cardápio (pizza ou bebida) para exibição. Derivado da estrutura do `menu.json`.
- **ItemCarrinho**: Um item no carrinho do cliente. Atributos: `id`, `tipo` (pizza | bebida), `nome`, `sabores` (array, apenas para pizzas), `preco_unitario`, `quantidade`, `observacao`, `subtotal`.
- **Carrinho**: Coleção de `ItemCarrinho`. Atributos: `itens`, `subtotal`, `taxa_entrega`, `total`, `modo_entrega` (entrega | retirada), `forma_pagamento` (dinheiro | cartao | pix), `troco`.
- **Pedido**: O estado final do carrinho + mensagem formatada para WhatsApp. Não é persistido — existe apenas no momento da finalização para montar a mensagem.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O cliente consegue montar uma pizza com 2 sabores, adicionar ao carrinho e visualizar o preço correto em menos de 30 segundos na primeira tentativa.
- **SC-002**: O cardápio completo carrega e fica visualmente utilizável em menos de 3 segundos em conexão 3G (simulada no Lighthouse).
- **SC-003**: O cardápio já visitado fica 100% acessível offline (todas as categorias, itens, imagens e preços) após o primeiro carregamento.
- **SC-004**: O app atinge Lighthouse PWA score ≥ 90 em auditoria de produção com throttling mobile 3G.
- **SC-005**: O app é instalável na tela inicial em Chrome Android e Safari iOS (com comportamento standalone ou análogo).
- **SC-006**: O dono da pizzaria consegue adicionar um novo sabor ao `menu.json` seguindo a estrutura existente em menos de 2 minutos, sem quebrar o app.
- **SC-007**: O fluxo completo — do cardápio ao WhatsApp aberto com a mensagem — é concluído em menos de 2 minutos por um cliente novo.
- **SC-008**: 100% das mensagens de erro exibidas ao cliente são em português e fornecem orientação acionável (nunca mensagens técnicas ou stack traces).

## Assumptions

- O número de WhatsApp da pizzaria e a taxa de entrega são definidos no próprio `menu.json` (campo `whatsapp` e `taxa_entrega` no nível raiz).
- As imagens dos itens do cardápio são referenciadas por URL relativa no `menu.json` (ex: `imagens/mussarela.jpg`) e ficam na mesma origem do deploy.
- O app será hospedado em Vercel, Netlify ou GitHub Pages — plataformas de hospedagem estática que servem sobre HTTPS (requisito para Service Worker).
- O domínio terá HTTPS válido (via plataforma de hospedagem ou Cloudflare) — obrigatório para PWA.
- O cliente possui WhatsApp instalado no celular. Caso contrário, o link `wa.me` abre no navegador com fallback para WhatsApp Web.
- O `menu.json` é validado pelo app ao carregar — erros de schema são reportados com mensagem em português.
- As imagens dos itens podem ser fotos reais ou placeholders. O app trata ambos os casos (fallback para placeholder se imagem não carregar).
- O app não rastreia se o pedido foi de fato enviado no WhatsApp — isso é responsabilidade do cliente (MVP).
- O carrinho é volátil: persiste apenas durante a sessão do navegador. Fechar a aba = carrinho zerado.
- A estrutura de `menu.json` será documentada em um `README.md` ou `menu.schema.md` para o dono da pizzaria.
