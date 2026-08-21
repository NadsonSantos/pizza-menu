# Feature Specification: Montagem de Pizza — 2 Sabores como Padrão e 3º Sabor Excepcional

**Feature Branch**: `008-montagem-pizza-2-sabores`

**Created**: 2026-08-12

**Status**: Draft

**Input**: User description: "Refatorar o fluxo de montagem de pizzas para deixar claro que 2 sabores é o padrão e o 3º sabor é excepcional — ajustar labels de quantidade de sabores, corrigir posicionamento da label, abrir modal de confirmação ao adicionar o 3º sabor (adicional R$5) e rolar automaticamente até o sabor pré-selecionado."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Confirmação Explícita ao Adicionar o 3º Sabor (Prioridade: P1) 🎯

Como cliente montando uma pizza, quero que, ao tentar adicionar um 3º sabor a uma pizza que já tem 2 sabores, o app me avise que a pizza comporta até 2 sabores e que o 3º tem adicional de R$ 5,00, para que eu decida conscientemente se aceito pagar o adicional ou fico com 2 sabores.

**Por que esta prioridade**: É a mudança central de comportamento — materializa a regra "2 sabores é o padrão, 3º é excepcional" e elimina a surpresa de preço no checkout. Sem esta história, o acréscimo de R$ 5,00 continua "escondido" e o cliente só percebe o valor a mais depois.

**Teste independente**: Montar uma pizza com 2 sabores e tocar em um 3º sabor qualquer — o modal deve aparecer. Confirmar "Adicionar" → o 3º sabor entra e o preço sobe R$ 5,00. Confirmar "Cancelar" → nada muda.

**Cenários de aceitação**:

1. **Dado** uma pizza com 2 sabores selecionados, **Quando** o cliente toca em um 3º sabor (diferente dos já selecionados), **Então** o sistema abre um modal informando que a pizza comporta até 2 sabores e que o 3º sabor possui adicional de R$ 5,00.
2. **Dado** o modal do 3º sabor aberto, **Quando** o cliente toca em "Adicionar", **Então** o 3º sabor é adicionado à seleção e o preço da pizza passa a incluir o adicional de R$ 5,00 (fluxo atual mantido).
3. **Dado** o modal do 3º sabor aberto, **Quando** o cliente toca em "Cancelar", **Então** o modal fecha, a seleção permanece com os 2 sabores originais e o preço não muda.
4. **Dado** uma pizza com 3 sabores selecionados, **Quando** o cliente tenta adicionar um 4º sabor, **Então** o sistema continua impedindo com a mensagem de máximo de 3 sabores (comportamento atual mantido).

---

### User Story 2 - Labels Claros: 2 Sabores Padrão, 3º Excepcional (Prioridade: P1) 🎯

Como cliente montando uma pizza, quero que os textos que indicam a quantidade de sabores deixem claro que 2 sabores é o padrão e que o 3º é opcional com adicional de R$ 5,00, para que eu entenda as regras antes de decidir.

**Por que esta prioridade**: Clareza é o objetivo central da refatoração. Sem isso, o cliente não percebe que o 3º sabor tem custo extra, e o modal (US1) perde o contexto que o justifica.

**Teste independente**: Abrir a montagem de pizza e verificar que o indicador de contagem comunica "2 incluídos como padrão" e "3º sabor + R$ 5,00", em vez de um texto neutro como "N de 3 sabores selecionados".

**Cenários de aceitação**:

1. **Dado** a montagem de pizza aberta sem sabores selecionados, **Quando** o cliente observa o indicador de quantidade, **Então** o texto comunica que a pizza inclui até 2 sabores como padrão.
2. **Dado** 2 sabores selecionados, **Quando** o cliente observa o indicador, **Então** o texto comunica que os 2 sabores (padrão) estão incluídos e que o 3º sabor tem adicional de R$ 5,00.
3. **Dado** 3 sabores selecionados, **Quando** o cliente observa o indicador, **Então** o texto reflete o 3º sabor com o adicional de R$ 5,00 já aplicado ao preço.

---

### User Story 3 - Posicionamento Correto do Indicador de Sabores (Prioridade: P2)

Como cliente, quero que o indicador de quantidade de sabores fique posicionado corretamente, sem o espaçamento superior que hoje o faz "flutuar" sobre os itens da lista, para que a interface não pareça quebrada.

**Por que esta prioridade**: Corrige uma quebra visual existente. Não bloqueia a funcionalidade, mas impacta diretamente a percepção de qualidade. Pode ser entregue junto ou logo após as histórias P1.

**Teste independente**: Abrir a montagem de pizza e observar o topo da área de sabores — o indicador deve estar alinhado ao conteúdo, sem espaçamento superior excessivo e sem sobrepor os cards de sabor.

**Cenários de aceitação**:

1. **Dado** a montagem de pizza aberta, **Quando** o cliente observa o topo da área de seleção de sabores, **Então** o indicador de quantidade está alinhado ao conteúdo abaixo, sem o espaçamento superior que o deixava "flutuando".
2. **Dado** a lista de sabores em rolagem, **Quando** o cliente passa pelos grupos de categorias, **Então** o indicador não sobrepõe nem flutua sobre os cards de sabor.

---

### User Story 4 - Rolagem Automática até o Sabor Pré-selecionado (Prioridade: P2)

Como cliente, quero que, ao escolher um sabor no cardápio e abrir a montagem, a tela role automaticamente até o sabor que escolhi, para que eu o veja já selecionado em vez de começar no topo da lista.

**Por que esta prioridade**: Elimina a desorientação de abrir a montagem e não ver o sabor escolhido (que pode estar várias categorias abaixo). Não bloqueia o fluxo, mas é uma das mudanças mais percebidas pelo cliente.

**Teste independente**: No cardápio, tocar em um sabor de uma categoria distante do topo (ex.: Sensacionais) e abrir a montagem — a lista deve rolar e deixar o sabor pré-selecionado visível.

**Cenários de aceitação**:

1. **Dado** que o cliente tocou em um sabor no cardápio, **Quando** a montagem de pizza abre, **Então** a lista rola automaticamente e o sabor pré-selecionado fica visível (destacado como selecionado), em vez de exibir o topo da lista.
2. **Dado** a montagem aberta com o sabor pré-selecionado visível, **Quando** o cliente continua rolando manualmente, **Então** a rolagem manual funciona normalmente, sem novas rolagens automáticas.
3. **Dado** a montagem aberta, **Quando** o sabor pré-selecionado pertence à primeira categoria, **Então** a lista inicia no topo normalmente, sem rolagem desnecessária.

---

### Edge Cases

- O que acontece quando o cliente, com 2 sabores, abre o modal do 3º e cancela várias vezes seguidas? A seleção permanece com 2 sabores a cada cancelamento; não há efeito colateral.
- O que acontece quando o cliente, com 3 sabores, tenta selecionar mais um? O sistema segue impedindo (máximo 3). O modal do 3º sabor só aparece na transição de 2 → 3, nunca na tentativa de 4º.
- O que acontece quando o cliente desseleciona um sabor de uma pizza de 3 sabores? A transição 3 → 2 apenas remove o sabor e o adicional de R$ 5,00 do preço, sem abrir modal.
- O que acontece se o cliente tocar fora do modal (backdrop) enquanto ele está aberto? Equivale a "Cancelar" — fecha sem adicionar o 3º sabor.
- Como a rolagem automática interage com o indicador fixo no topo? O sabor pré-selecionado deve aparecer abaixo do indicador, sem ficar escondido atrás dele.
- O que acontece se não houver sabor pré-selecionado ao abrir a montagem? A lista inicia no topo (comportamento atual).
- Como o modal se comporta em telas pequenas (320px)? As opções "Cancelar" e "Adicionar" devem permanecer legíveis e acionáveis.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE permitir selecionar de 1 a 3 sabores por pizza, mantendo o limite máximo atual (regra de negócio inalterada).
- **FR-002**: Quando o cliente tiver 2 sabores selecionados e tentar adicionar um 3º, o sistema DEVE abrir um modal de confirmação antes de aplicar a seleção.
- **FR-003**: O modal DEVE informar que a pizza comporta até 2 sabores (padrão) e que o 3º sabor possui adicional de R$ 5,00.
- **FR-004**: O modal DEVE oferecer as opções "Cancelar" e "Adicionar".
- **FR-005**: Ao confirmar "Adicionar", o sistema DEVE adicionar o 3º sabor e aplicar o adicional de R$ 5,00 ao preço (fluxo atual mantido).
- **FR-006**: Ao confirmar "Cancelar" (ou fechar o modal), o sistema DEVE fechar o modal sem alterar a seleção nem o preço.
- **FR-007**: A tentativa de adicionar um 4º sabor DEVE continuar bloqueada com a mensagem de máximo de 3 sabores por pizza.
- **FR-008**: Os indicadores de quantidade de sabores DEVEM comunicar claramente que 2 sabores é o padrão e que o 3º sabor é opcional com adicional de R$ 5,00.
- **FR-009**: O indicador de quantidade de sabores DEVE ser posicionado corretamente, alinhado ao conteúdo, sem o espaçamento superior que o fazia flutuar sobre os itens.
- **FR-010**: Ao abrir a montagem de pizza a partir de um sabor escolhido no cardápio, a lista DEVE rolar automaticamente até o sabor pré-selecionado.
- **FR-011**: A rolagem automática DEVE ocorrer apenas uma vez, na abertura; a rolagem manual do cliente não DEVE ser interrompida.
- **FR-012**: O cálculo de preço DEVE permanecer inalterado: preço base (categoria mais cara) + R$ 5,00 somente quando houver 3 sabores.

### Key Entities *(include if feature involves data)*

- **Pizza (item do pedido)**: Já existe. Composta por 1 a 3 sabores. O preço continua calculado pela regra central de precificação (categoria mais cara + acréscimo no 3º sabor).
- **Modal de confirmação do 3º sabor**: Novo componente de UI. Atributos: sabor candidato (o 3º), mensagem sobre o adicional de R$ 5,00 e as ações "Cancelar" e "Adicionar".
- **Sabor pré-selecionado**: Já existe (é passado ao abrir a montagem). Ganha um novo comportamento associado: rolagem automática até ele.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das tentativas de adicionar um 3º sabor (a partir de 2 selecionados) exibem o modal de confirmação antes de qualquer mudança de seleção ou preço.
- **SC-002**: Ao confirmar "Adicionar", o preço reflete exatamente o acréscimo de R$ 5,00 sobre a categoria mais cara, sem alteração na regra de cálculo existente.
- **SC-003**: Ao confirmar "Cancelar", a seleção e o preço permanecem idênticos (zero mudanças).
- **SC-004**: O indicador de quantidade de sabores não sobrepõe os cards de sabor em nenhum ponto da rolagem, em viewports mobile a partir de 320px de largura.
- **SC-005**: Ao abrir a montagem a partir de um sabor do cardápio, o sabor pré-selecionado fica visível na tela em até 1 segundo após a abertura, sem exigir rolagem manual.
- **SC-006**: O app compila e o build de produção é concluído sem erros após as mudanças, e os testes automatizados existentes continuam passando.

## Assumptions

- As regras de negócio permanecem inalteradas: de 1 a 3 sabores por pizza, preço = categoria mais cara, acréscimo de R$ 5,00 somente no 3º sabor. Esta feature muda apenas a comunicação e o fluxo de confirmação, não as regras.
- O modal é a única via para adicionar o 3º sabor; não há como "pular" a confirmação.
- Fechar o modal tocando fora dele (backdrop) equivale a "Cancelar".
- O sabor pré-selecionado continua vindo do toque no card do sabor no cardápio (MenuPage), como ocorre hoje.
- A rolagem automática usa a rolagem suave já disponível no navegador, sem dependências externas.
- Os textos das labels seguem o tom do app (pt-BR). O texto exato pode ser ajustado na implementação, desde que comunique "2 sabores padrão / 3º sabor + R$ 5,00".
- O design visual segue o tema existente (Tailwind, cores brand-*), respeitando a constituição (mobile-first, sem bibliotecas externas de UI).
