# Feature Specification: Refatoração da Modelagem de Pizzas e Sabores

**Feature Branch**: `002-refatoracao-pizzas-sabores`

**Created**: 2025-07-30

**Status**: Draft

**Input**: "Refatoração das pizzas e sabores — remover dependência do preço no sabor, introduzir categoria como fonte única de preço, atualizar todos os sabores com sua classificação correta, manter o limite de 3 sabores com acréscimo de R$5 no 3º."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Sabores Pertencem a Categorias com Preço (Priority: P1) 🎯

O dono da pizzaria edita o `menu.json` e cada sabor tem um `categoria_id` que referencia a categoria. O preço NUNCA está no sabor — sempre vem da categoria. Se ele errar o `categoria_id`, o app valida e avisa.

**Why this priority**: É a mudança estrutural que possibilita todas as outras. Sem isso, o resto não funciona.

**Independent Test**: Abrir o novo `menu.json`, verificar que cada sabor tem `categoria_id` e nenhum tem `preco`. Abrir o app, verificar que carrega sem erro e os preços são calculados por categoria.

**Acceptance Scenarios**:

1. **Given** um `menu.json` onde cada sabor tem `categoria_id` válido, **When** o app carrega, **Then** o cardápio é exibido com todos os sabores agrupados por categoria.
2. **Given** um sabor com `categoria_id` inexistente, **When** o app carrega, **Then** o app exibe mensagem em português: "Sabor 'X' referencia categoria 'Y' que não existe no menu.json."
3. **Given** 3 categorias (Tradicionais R$30, Especiais R$35, Sensacionais R$40), **When** o dono adiciona um novo sabor com `"categoria_id": "tradicionais"`, **Then** o preço exibido é R$30 automaticamente — ele nunca digita o preço no sabor.

---

### User Story 2 — Pizza com Limite de 3 Sabores e Acréscimo (Priority: P1) 🎯

O cliente pode escolher de 1 a 3 sabores por pizza (limite máximo mantido). Quando a pizza tem exatamente 3 sabores, aplica-se um acréscimo fixo de R$5 sobre o preço base da categoria mais cara (independentemente de qual categoria seja o 3º sabor).

**Why this priority**: Mantém as regras de negócio aprovadas (limite de 3, acréscimo no 3º) enquanto refatora a fonte do preço para a categoria.

**Independent Test**: Montar pizza com 2 sabores → preço = categoria mais cara, sem acréscimo. Tentar adicionar 4º sabor → sistema impede com "Máximo de 3 sabores". Adicionar 3º sabor → preço = categoria mais cara + R$5.

**Acceptance Scenarios**:

1. **Given** que o cliente selecionou 2 sabores (Calabresa Trad + 4 Queijos Sens), **When** confirma, **Then** o preço é R$40 (Sensacional é a mais cara, sem acréscimo pois < 3 sabores).
2. **Given** que o cliente selecionou 3 sabores (Calabresa Trad + Frango Esp + 4 Queijos Sens), **When** confirma, **Then** o preço é R$45 (R$40 base + R$5 acréscimo por 3 sabores).
3. **Given** que o cliente selecionou 3 sabores (Frango Esp + Portuguesa Esp + Baiana Trad), **When** confirma, **Then** o preço é R$40 (R$35 base Especial + R$5 acréscimo).
4. **Given** que o cliente já selecionou 3 sabores, **When** tenta selecionar um 4º, **Then** o sistema impede com a mensagem "Máximo de 3 sabores por pizza".

---

### User Story 3 — Preço Calculado por Categoria, com Acréscimo (Priority: P1) 🎯

O preço da pizza é: **(preço da categoria mais cara entre os sabores) + (R$5 se houver exatamente 3 sabores)**. Com 1 ou 2 sabores, não há acréscimo. Os demais sabores não adicionam custo — servem apenas para determinar qual é a categoria mais cara. Essa lógica fica centralizada em uma única função reutilizada por todo o app.

**Why this priority**: É o core da refatoração. Centraliza a regra de preço + acréscimo, e torna futuras mudanças triviais (basta alterar o preço da categoria no menu.json).

**Independent Test**: Testar cenários com 1, 2 e 3 sabores e verificar que o cálculo bate em todos.

**Acceptance Scenarios**:

1. **Given** Calabresa (Tradicional, R$30) + Portuguesa (Tradicional, R$30), **When** calcula preço, **Then** = R$30 (sem acréscimo, 2 sabores).
2. **Given** Calabresa (Tradicional, R$30) + Frango com Catupiry (Especial, R$35), **When** calcula preço, **Then** = R$35 (sem acréscimo, 2 sabores).
3. **Given** Calabresa (Tradicional, R$30) + 4 Queijos (Sensacional, R$40), **When** calcula preço, **Then** = R$40 (sem acréscimo, 2 sabores).
4. **Given** Pepperoni (Sensacional, R$40) + Carne Seca (Sensacional, R$40), **When** calcula preço, **Then** = R$40 (sem acréscimo, 2 sabores).
5. **Given** Calabresa (Trad, R$30) + Frango (Esp, R$35) + 4 Queijos (Sens, R$40), **When** calcula preço, **Then** = R$45 (R$40 base + R$5 acréscimo por 3 sabores).

---

### User Story 4 — Todos os 32 Sabores Classificados (Priority: P2)

O cardápio agora tem 32 sabores distribuídos entre Tradicionais (13), Especiais (16) e Sensacionais (3), cada um na categoria correta conforme especificação do dono.

**Why this priority**: É o conteúdo do cardápio. Pode ser feito em paralelo com as mudanças estruturais.

**Independent Test**: Abrir o app e verificar que cada sabor aparece na categoria correta, com o preço correto da categoria.

**Acceptance Scenarios**:

1. **Given** a categoria Tradicionais (R$30), **When** o cliente navega, **Then** vê 13 sabores: Baiana, Bacon, Batata Palha, Calabresa, Catupiry, Cheddar, Frango, Milho, Mussarela, Lombinho, Portuguesa, Presunto, Romeu e Julieta.
2. **Given** a categoria Especiais (R$35), **When** o cliente navega, **Then** vê 16 sabores incluindo Atum, Bacon com Cheddar, Frango com Catupiry, Mexicana, etc.
3. **Given** a categoria Sensacionais (R$40), **When** o cliente navega, **Then** vê 3 sabores: Carne Seca, Pepperoni, 4 Queijos.

---

### Edge Cases

- **categoria_id vazio ou ausente**: App exibe "Sabor 'X' não tem categoria definida. Adicione 'categoria_id' ao sabor."
- **categoria_id que não existe**: App exibe "Categoria 'Y' referenciada pelo sabor 'X' não foi encontrada. Verifique o menu.json."
- **Nenhum sabor selecionado**: Botão "Adicionar ao carrinho" desabilitado (mínimo 1 sabor).
- **Categoria sem preço definido**: App exibe "Categoria 'Y' não tem preço definido. Adicione o campo 'preco'." e não carrega.
- **Categoria sem sabores**: Categoria aparece vazia ou não é exibida. Não quebra o app.
- **Sabor duplicado (mesmo id)**: App carrega normalmente; o último encontrado sobrescreve (comportamento padrão de JSON parse).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O arquivo `menu.json` DEVE conter uma lista `categorias` com objetos `{ id, nome, preco }`.
- **FR-002**: O arquivo `menu.json` DEVE conter uma lista `sabores` onde cada sabor tem `categoria_id` referenciando uma categoria.
- **FR-003**: Nenhum sabor DEVE possuir campo `preco`. O preço é obtido exclusivamente pela categoria.
- **FR-004**: Sistema DEVE validar que todo `categoria_id` em um sabor referencia uma categoria existente.
- **FR-005**: Sistema DEVE validar que toda categoria tem `preco` definido e > 0.
- **FR-006**: Sistema DEVE permitir selecionar de 1 a 3 sabores por pizza (limite máximo mantido). Tentar selecionar um 4º sabor exibe "Máximo de 3 sabores por pizza".
- **FR-007**: Sistema DEVE calcular o preço da pizza como `precoBase + acrescimo`, onde `precoBase` é o maior `preco` entre as categorias dos sabores selecionados, e `acrescimo` é R$5 se houver exatamente 3 sabores, R$0 caso contrário.
- **FR-008**: O acréscimo de R$5 DEVE ser aplicado uma única vez quando a pizza tem 3 sabores, sobre o preço base da categoria mais cara, independentemente da categoria do 3º sabor.
- **FR-009**: A função de cálculo de preço DEVE ser centralizada em um único local (`calcularPrecoPizza` em `src/utils/pricing.ts`) e reutilizada por todos os componentes.
- **FR-010**: O `menu.json` DEVE conter as 3 categorias: `{ id: "tradicionais", nome: "Tradicionais", preco: 30 }`, `{ id: "especiais", nome: "Especiais", preco: 35 }`, `{ id: "sensacionais", nome: "Sensacionais", preco: 40 }`.
- **FR-011**: O `menu.json` DEVE conter os 32 sabores classificados conforme a lista do stakeholder (13 Tradicionais, 16 Especiais, 3 Sensacionais).
- **FR-012**: A interface `MenuData` e `Categoria` em `src/types/menu.ts` DEVEM ser atualizadas para refletir a nova estrutura (categorias com `preco`, sabores com `categoria_id`).
- **FR-013**: Todos os componentes que acessam `categoria.preco` ou `categoria.sabores` DEVEM ser atualizados para a nova estrutura.
- **FR-014**: O seletor de sabores (`FlavorSelector`) DEVE manter o limite visual "N/3 sabores" e DEVE exibir o acréscimo de R$5 quando 3 sabores estiverem selecionados.
- **FR-015**: Bebidas continuam como antes — não são afetadas por esta refatoração.

### Key Entities (atualizadas)

- **Categoria (`categoria`)**: Define uma faixa de preço. Atributos: `id` (string), `nome` (string), `preco` (number). Ex: `{ id: "tradicionais", nome: "Tradicionais", preco: 30.00 }`.
- **Sabor (`sabor`)**: Um sabor de pizza. Atributos: `id`, `nome`, `descricao`, `imagem`, `categoria_id` (string, referencia Categoria.id). NÃO tem campo `preco`.
- **Bebida (`bebida`)**: Inalterado. Atributos: `id`, `nome`, `preco`, `imagem`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O preço de uma pizza com 2 sabores Tradicionais é R$30 (antes era R$30 — sem alteração).
- **SC-002**: O preço de uma pizza com 1 sabor Sensacional é R$40 (antes era R$40 — sem alteração).
- **SC-003**: O preço de uma pizza com 2 sabores (Tradicional + Sensacional) é R$40 (sem acréscimo, < 3 sabores).
- **SC-004**: O preço de uma pizza com 3 sabores (Tradicional + Especial + Sensacional) é R$45 (R$40 base + R$5 acréscimo).
- **SC-005**: O sistema impede a seleção de um 4º sabor com a mensagem "Máximo de 3 sabores por pizza".
- **SC-006**: A função `calcularPrecoPizza` existe em exatamente 1 arquivo e é importada por todos os consumidores.
- **SC-007**: O app compila (`tsc --noEmit`) e builda (`npm run build`) sem erros após a refatoração.
- **SC-008**: Todas as 32 classificações de sabores conferem com a lista do stakeholder.

## Assumptions

- O acréscimo de R$5 para pizzas com 3 sabores é MANTIDO, conforme confirmado pelo stakeholder. O acréscimo é aplicado uma única vez sobre o preço base da categoria mais cara, independentemente da categoria do 3º sabor.
- O limite máximo de 3 sabores é MANTIDO — stakeholder confirmou.
- A lista de 32 sabores fornecida pelo stakeholder é exaustiva e substitui completamente os sabores anteriores.
- O número de WhatsApp e taxa de entrega permanecem inalterados no `menu.json`.
- As bebidas não são afetadas — mantêm a estrutura atual com `preco` no próprio item.
- A estrutura de `menu.json` muda de forma significativa (categorias param de conter sabores; sabores viram lista plana com `categoria_id`). O README deve ser atualizado para documentar o novo formato.
- Os PWA icons, offline.html, vite.config e demais configs não são afetados.
