# Feature Specification: Fluxo Único de Cardápio com Montagem Cross-Categoria

**Feature Branch**: `003-fluxo-cardapio-unico`

**Created**: 2025-07-30

**Status**: Draft

**Input**: "Refatorar o fluxo do cardápio e da montagem de pizzas: exibir todas as categorias em uma única página com sticky nav e scroll suave, e permitir montar pizzas com sabores de categorias diferentes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Cardápio em Página Única (Priority: P1) 🎯

O cliente acessa o app e vê **todas as categorias** em uma única página rolável, cada uma com seu título e sabores listados abaixo. O menu superior (sticky) mostra as categorias como âncoras. Clicar em uma categoria rola suavemente até a seção correspondente. A categoria ativa é destacada conforme o scroll.

**Why this priority**: É a mudança principal de UX. Elimina a alternância por tabs e torna o cardápio explorável de uma só vez.

**Independent Test**: Abrir o app, scrollar para ver todas as categorias na mesma página. Clicar "Sensacionais" → scroll suave leva até a seção. Clicar "Tradicionais" → scroll sobe até o topo.

**Acceptance Scenarios**:

1. **Given** que o cardápio tem 3 categorias (Tradicionais, Especiais, Sensacionais), **When** o cliente abre o app, **Then** vê todas as 3 categorias em sequência vertical, cada uma com seu título e sabores, sem precisar clicar em abas.
2. **Given** que o cliente está no topo da página, **When** clica no link "Especiais" no menu sticky, **Then** a página rola suavemente até o início da seção Especiais.
3. **Given** que o cliente scrolla a página, **When** a seção "Tradicionais" está no viewport, **Then** o link "Tradicionais" no menu sticky fica destacado (ativo).
4. **Given** que o menu sticky está fixo no topo, **When** o cliente scrolla para qualquer parte da página, **Then** o menu permanece visível no topo.

---

### User Story 2 — Montagem Cross-Categoria (Priority: P1) 🎯

O cliente pode montar uma pizza selecionando sabores de **qualquer categoria**, sem restrição. Ex: Calabresa (Tradicional) + Pepperoni (Sensacional). O fluxo de montagem é unificado: uma única tela de seleção com todos os sabores do cardápio, agrupados por categoria visualmente.

**Why this priority**: É a mudança de regra de negócio solicitada. Remove a limitação de montar pizza apenas dentro de uma categoria.

**Independent Test**: Abrir "Montar Pizza", selecionar 1 sabor Tradicional + 1 sabor Especial + 1 sabor Sensacional → preço calculado pela categoria mais cara.

**Acceptance Scenarios**:

1. **Given** que o cliente clicou em "Montar Pizza" em qualquer sabor, **When** a tela de seleção abre, **Then** vê todos os sabores de todas as categorias, organizados visualmente por categoria.
2. **Given** que o cliente selecionou Calabresa (Tradicional, R$30) + Frango com Catupiry (Especial, R$35) + 4 Queijos (Sensacional, R$40), **When** confirma, **Then** o preço é R$45 (R$40 base + R$5 por 3 sabores).
3. **Given** que o cliente selecionou Calabresa (Tradicional, R$30) + Pepperoni (Sensacional, R$40), **When** confirma, **Then** o preço é R$40 (Sensacional é a mais cara, sem acréscimo).
4. **Given** que o cliente está na tela de seleção de sabores, **When** seleciona sabores de diferentes categorias, **Then** o preço é recalculado a cada seleção.
5. **Given** que o cliente voltou ao cardápio após montar uma pizza, **When** clica em "Montar Pizza" novamente, **Then** a seleção anterior não persiste (resetada).

---

### User Story 3 — Título e Categoria Visíveis nos Cards (Priority: P2)

Cada sabor exibe o nome da sua categoria abaixo do nome, para o cliente saber a qual categoria pertence (ex: "Calabresa — Tradicional"). Na página única, cada seção de categoria tem um título destacado.

**Why this priority**: Com sabores de várias categorias misturados na tela de montagem, é essencial mostrar a categoria de cada sabor.

**Independent Test**: Na tela de montagem, verificar que cada card de sabor mostra o nome da categoria abaixo do nome do sabor.

**Acceptance Scenarios**:

1. **Given** que a tela de seleção de sabores está aberta, **When** o cliente visualiza os cards, **Then** cada card exibe o nome do sabor e abaixo o nome da categoria (ex: "Calabresa" → "Tradicional").
2. **Given** que a página única do cardápio está sendo exibida, **When** o cliente scrolla, **Then** cada seção de categoria tem um título em destacado (h2 ou equivalente) com o nome da categoria e o preço base.

---

### Edge Cases

- **Categoria sem sabores**: A seção da categoria não aparece ou aparece vazia. Não quebra o app.
- **Scroll com poucos itens**: Se o conteúdo não preenche a tela, o menu sticky ainda funciona e o destaque permanece na primeira categoria.
- **Cliente clica na categoria já visível**: Scroll suave para a posição (mesmo que já esteja visível) — sem erro.
- **Cross-categoria com 4+ sabores**: Bloqueado normalmente (limite de 3 mantido).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O cardápio DEVE exibir todas as categorias em uma única página vertical, sem necessidade de abas ou navegação entre páginas.
- **FR-002**: O menu superior DEVE permanecer fixo (sticky) no topo durante o scroll.
- **FR-003**: Cada categoria DEVE ter um título visível (h2) com o nome da categoria e o preço base.
- **FR-004**: Clicar em um item do menu sticky DEVE scrollar suavemente (`scroll-behavior: smooth`) até o início da seção correspondente.
- **FR-005**: O item do menu sticky correspondente à categoria atualmente visível DEVE ser destacado (ex: cor diferente, underline).
- **FR-006**: A categoria ativa DEVE ser determinada pela posição do scroll (`IntersectionObserver` ou cálculo de `getBoundingClientRect`).
- **FR-007**: A tela de montagem de pizza (PizzaBuilder/FlavorSelector) DEVE exibir sabores de **todas as categorias** simultaneamente.
- **FR-008**: Os sabores na tela de montagem DEVEM ser agrupados visualmente por categoria (separadores ou badges).
- **FR-009**: Cada card de sabor DEVE exibir o nome da categoria abaixo do nome do sabor (ex: "Tradicional", "Especial").
- **FR-010**: O cliente PODE selecionar sabores de categorias diferentes sem qualquer restrição.
- **FR-011**: O cálculo de preço DEVE continuar usando a regra: `max(categoria.preco) + (R$5 se 3 sabores)` — independentemente de quais categorias os sabores pertencem.
- **FR-012**: O limite de 3 sabores DEVE ser mantido.
- **FR-013**: O campo de observação, controle de quantidade e demais funcionalidades do carrinho DEVEM permanecer inalterados.
- **FR-014**: Bebidas DEVE continuar como seção separada ao final da página única, exibida após a última categoria de pizzas.

### Key Entities (inalteradas)

As entidades `Categoria`, `Sabor`, `Bebida`, `CartItem`, `CartState` não mudam. Apenas a apresentação e o fluxo de montagem são refatorados.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Todas as 3 categorias (Tradicionais, Especiais, Sensacionais) são visíveis na mesma página sem interação do usuário.
- **SC-002**: Clicar em qualquer item do menu sticky → scroll suave até a categoria em < 500ms.
- **SC-003**: O destaque do menu muda corretamente conforme o scroll em todas as categorias.
- **SC-004**: É possível montar uma pizza com sabores de 2 ou 3 categorias diferentes e o preço calculado corretamente.
- **SC-005**: Nenhuma funcionalidade existente (carrinho, checkout, WhatsApp, PWA) é quebrada.
- **SC-006**: Build (`npm run build`) passa sem erros.

## Assumptions

- A ordem das categorias no cardápio é: Tradicionais, Especiais, Sensacionais (conforme stakeholder).
- O menu.json contém as 3 categorias com `id` e `nome` que mapeiam para esta ordem.
- Bebidas continuam ao final da página, após todas as categorias de pizza.
- O seletor de sabores unificado (cross-categoria) substitui o PizzaBuilder específico por categoria. Agora há UM único botão "Montar Pizza" que abre o seletor com todos os sabores.
- O sticky nav usa `position: sticky` CSS com `IntersectionObserver` para detecção de categoria ativa.
- Nenhuma mudança no carrinho, checkout, WhatsApp, PWA, ou lógica de precificação.

---

## Fase 2 — Correções Pós-Validação (NAD-2)

**Input**: Validação PO da Fase 1 (issue NAD-2) — veredito: **reprovado**. A US1 não conforma: o nav sticky fica oculto atrás do header sticky do app durante o scroll, tornando as âncoras invisíveis e inutilizáveis (quebra FR-002/FR-004/FR-005 e os cenários US1-2/3/4, SC-002/SC-003).

### User Story 4 — Nav sticky visível e utilizável durante todo o scroll (Priority: P1) 🎯

O cliente rola a página e o menu de categorias permanece visível e clicável logo abaixo do header do app, com o item da categoria ativa destacado.

**Why this priority**: É a correção do comportamento central da US1 — sem ela, o sticky nav não cumpre sua função (âncoras inacessíveis durante o scroll).

**Independent Test**: Abrir o app, rolar a página > 300px e verificar que o nav de categorias continua visível abaixo do header vermelho. Clicar em "Sensacionais" com a página rolada → scroll suave até a seção. Rolar até Bebidas → item "Bebidas" destacado.

**Acceptance Scenarios**:

1. **Given** que o cliente rolou a página (ex.: 300px+), **When** observa o topo da viewport, **Then** o nav de categorias permanece visível e clicável abaixo do header do app, sem sobreposição.
2. **Given** que a página está rolada e o nav está visível, **When** o cliente clica em "Sensacionais" no nav, **Then** a página rola suavemente até a seção Sensacionais em < 500ms.
3. **Given** que o cliente rola até a seção Bebidas, **When** a seção Bebidas está no viewport, **Then** o item "Bebidas" do nav fica destacado.
4. **Given** que o conteúdo da página é curto (não preenche a tela), **When** a página carrega, **Then** o primeiro item do nav permanece destacado.

### Requirements *(Fase 2)*

- **FR-015**: O nav de categorias DEVE permanecer totalmente visível e clicável durante o scroll, posicionado abaixo do header do app — sem sobreposição de `top`/`z-index` com o header sticky (ex.: header `sticky top-0` e nav com offset `top` igual à altura do header, ou estrutura equivalente que evite o empilhamento).
- **FR-016**: A seção de Bebidas DEVE ser incluída na detecção de categoria ativa (IntersectionObserver), destacando o item "Bebidas" do nav quando a seção estiver visível.
- **FR-017**: Quando nenhuma seção intersecta a faixa de detecção (ex.: conteúdo curto), o primeiro item do nav DEVE permanecer destacado (categoria ativa inicial = primeira categoria).

### Success Criteria *(Fase 2)*

- **SC-007**: Com a página rolada, o nav permanece visível abaixo do header (verificação: `elementFromPoint` no centro de um botão do nav retorna o próprio botão, não o header).
- **SC-008**: Clique em qualquer item do nav com a página rolada → scroll suave em < 500ms até a seção.
- **SC-009**: O item "Bebidas" fica destacado quando a seção Bebidas está visível no fim da página.
- **SC-010**: Nenhuma regressão nas funcionalidades da Fase 1 (US2/US3, FR-011 a FR-014, carrinho/checkout/WhatsApp/PWA) — revalidar os cenários da Fase 1 após a correção.

### Edge Cases *(Fase 2)*

- **Conteúdo curto**: com poucos itens, o nav continua visível e o primeiro item permanece destacado (FR-017).
- **Header vs nav**: a correção não pode quebrar o header sticky do app (`Layout`) nem o layout em telas pequenas.

### Assumptions *(Fase 2)*

- A primeira categoria exibe o nome "Simples" no cardápio (id `tradicionais`), conforme stakeholder (tasks.md T060). A Fase 1 referencia "Tradicionais" como nome da categoria; o `id`/ordem é o que importa para a regra de preço (FR-011).
- Nenhuma mudança no carrinho, checkout, WhatsApp, PWA, ou lógica de precificação.

