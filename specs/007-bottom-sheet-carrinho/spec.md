# Feature Specification: Bottom Sheet do Carrinho

**Feature Branch**: `007-bottom-sheet-carrinho`

**Created**: 2026-08-12

**Status**: Draft

**Input**: User description: "Implementar Bottom Sheet reativo na tela de cardápio para resumo do carrinho"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Resumo do Carrinho Sempre Visível (Prioridade: P1)

Como cliente navegando pelo cardápio, quero ver um resumo do meu carrinho fixo no rodapé da tela enquanto adiciono pizzas e bebidas, para que eu saiba a qualquer momento quantos itens tenho e qual o valor total sem precisar rolar a tela ou clicar em ícones.

**Por que esta prioridade**: É o core da feature — elimina o atrito atual de ter que navegar até o topo ou clicar no ícone do carrinho para conferir o pedido. Sem esta história, as demais (ajuste de layout, animação) não fazem sentido.

**Teste independente**: Pode ser testado adicionando qualquer item ao carrinho — o Bottom Sheet aparece automaticamente no rodapé com o contador e valor total corretos.

**Cenários de aceitação**:

1. **Dado** que o carrinho está vazio, **Quando** o cliente monta e confirma uma pizza, **Então** o Bottom Sheet surge no rodapé da tela exibindo "1 item" e o valor total da pizza.
2. **Dado** que o carrinho tem 1 pizza de R$ 49,90, **Quando** o cliente adiciona uma bebida de R$ 8,00, **Então** o Bottom Sheet atualiza para "2 itens" e "R$ 57,90" imediatamente.
3. **Dado** que o carrinho tem 1 item, **Quando** o cliente remove o último item, **Então** o Bottom Sheet desaparece da tela.
4. **Dado** que o Bottom Sheet está visível, **Quando** o cliente toca no botão "Ver Carrinho" ou no próprio card do Bottom Sheet, **Então** a navegação vai para a tela do carrinho.

---

### User Story 2 - Visualização Completa do Cardápio (Prioridade: P2)

Como cliente navegando pelo cardápio, quero que o Bottom Sheet não esconda nenhum item da lista, para que eu consiga rolar e visualizar todas as opções de bebidas e sabores sem obstrução.

**Por que esta prioridade**: Essencial para a usabilidade — se o Bottom Sheet sobrepuser itens, a experiência piora em vez de melhorar. Sem esta história, os últimos itens da lista ficam inacessíveis.

**Teste independente**: Pode ser testado rolando até o final da lista de bebidas e verificando que o último item está totalmente visível acima do Bottom Sheet.

**Cenários de aceitação**:

1. **Dado** que o Bottom Sheet está visível no rodapé, **Quando** o cliente rola a lista até o final, **Então** o último item (bebida) está completamente visível, sem ficar atrás do Bottom Sheet.
2. **Dado** que o Bottom Sheet está visível, **Quando** o cliente está no final da rolagem, **Então** há um espaçamento suficiente entre o último item e o topo do Bottom Sheet para distinguir claramente o fim da lista.

---

### User Story 3 - Transições Suaves (Prioridade: P3)

Como cliente, quero que a entrada e saída do Bottom Sheet sejam fluidas e não bruscas, para que a experiência de compra seja agradável e profissional.

**Por que esta prioridade**: Polimento visual — não bloqueia a funcionalidade, mas impacta a percepção de qualidade do app. Pode ser implementada depois das histórias P1 e P2.

**Teste independente**: Pode ser testado adicionando o primeiro item (entrada animada) e removendo o último item (saída animada), verificando que a transição é suave e não trava.

**Cenários de aceitação**:

1. **Dado** que o carrinho está vazio, **Quando** o primeiro item é adicionado, **Então** o Bottom Sheet aparece com uma animação de deslize da parte inferior da tela (slide-up) com duração de aproximadamente 300ms.
2. **Dado** que o carrinho tem 1 item, **Quando** o último item é removido, **Então** o Bottom Sheet desliza para baixo (slide-down) e desaparece com duração de aproximadamente 300ms.
3. **Dado** que o Bottom Sheet está visível, **Quando** o valor total ou a quantidade de itens muda, **Então** os números atualizam sem animação, refletindo a mudança instantaneamente.

---

### Edge Cases

- O que acontece se o cliente adicionar e remover itens rapidamente em sequência? O Bottom Sheet deve acompanhar o estado real do carrinho sem glitches visuais ou estados inconsistentes.
- Como o Bottom Sheet se comporta em telas muito pequenas (ex.: 320px de largura)? Os elementos (contador, valor, botão) devem permanecer legíveis e não quebrar o layout.
- O que acontece se o cliente estiver no meio da rolagem quando o Bottom Sheet aparece/desaparece? A transição não deve causar saltos bruscos na posição de rolagem.
- Como o componente se comporta durante o carregamento assíncrono do cardápio (loading/error)? O Bottom Sheet só deve aparecer se houver itens no carrinho, independente do estado de carregamento do menu.
- O que acontece quando o carrinho é limpo via "Limpar Carrinho" na tela de checkout e o cliente volta ao cardápio? O Bottom Sheet não deve mais estar visível.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir um componente fixo no rodapé da tela do cardápio (Bottom Sheet) sempre que houver pelo menos 1 item no carrinho.
- **FR-002**: O sistema DEVE ocultar o Bottom Sheet quando o carrinho estiver vazio (zero itens).
- **FR-003**: O Bottom Sheet DEVE exibir a quantidade total de itens, usando o plural correto ("1 item" vs "N itens").
- **FR-004**: O Bottom Sheet DEVE exibir o valor total do carrinho (subtotal + taxa de entrega quando aplicável) formatado em reais (R$ X,XX).
- **FR-005**: O Bottom Sheet DEVE conter um botão de ação com o texto "Ver Carrinho" que, ao ser clicado, navega para a tela do carrinho.
- **FR-006**: O card do Bottom Sheet como um todo DEVE ser clicável e navegar para a tela do carrinho, não apenas o botão.
- **FR-007**: O sistema DEVE reagir instantaneamente a alterações no carrinho (adição, remoção, alteração de quantidade) refletindo os valores atualizados no Bottom Sheet.
- **FR-008**: A lista de itens do cardápio DEVE ter espaçamento inferior adicional (bottom padding) quando o Bottom Sheet estiver visível, para que o último item não fique escondido.
- **FR-009**: A entrada do Bottom Sheet (quando primeiro item é adicionado) DEVE ter animação de transição suave.
- **FR-010**: A saída do Bottom Sheet (quando último item é removido) DEVE ter animação de transição suave.
- **FR-011**: O Bottom Sheet DEVE ser exibido apenas na tela de cardápio (MenuPage) e não em outras telas do app.

### Key Entities

- **CartState (Carrinho)**: Já existe. Contém a lista de itens, modo de entrega, pagamento e troco. O Bottom Sheet consome `itemCount` (soma de quantidades) e `total` (subtotal + taxa de entrega quando aplicável) deste estado.
- **Bottom Sheet**: Novo componente de UI. Atributos: visibilidade (booleano baseado em itemCount > 0), itemCount, total, link de navegação para o carrinho.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O cliente consegue visualizar o total do pedido sem nenhum clique ou rolagem adicional após adicionar um item ao carrinho.
- **SC-002**: O tempo entre a adição de um item ao carrinho e a atualização do Bottom Sheet é imperceptível ao usuário (inferior a 100ms).
- **SC-003**: Todos os itens da lista de cardápio permanecem acessíveis via rolagem, sem nenhum item ficar permanentemente oculto atrás do Bottom Sheet.
- **SC-004**: A transição de entrada/saída do Bottom Sheet é concluída em até 300ms, sem travamentos perceptíveis, em dispositivos móveis comuns.
- **SC-005**: O Bottom Sheet mantém usabilidade em telas a partir de 320px de largura, com todos os elementos legíveis e acionáveis.

## Assumptions

- O estado do carrinho (CartContext) já gerencia corretamente `itemCount` e `total` — o Bottom Sheet apenas consome esses valores.
- A tela de cardápio (MenuPage) é o único ponto de entrada para montagem de pizzas e adição de bebidas — não há outros fluxos que adicionem itens ao carrinho fora dela.
- O Bottom Sheet deve ser implementado exclusivamente na MenuPage, sem afetar a tela de checkout ou outras páginas.
- A navegação para o carrinho usa a rota `/carrinho` já existente.
- O design visual deve seguir o tema existente (Tailwind com cores brand-*).
- A animação de transição é um polimento (P3), mas o comportamento de exibição/ocultação baseado no estado do carrinho é mandatório (P1).
- O Bottom Sheet respeitará a área segura (safe area) em dispositivos com notch ou gestos de navegação na parte inferior da tela.
