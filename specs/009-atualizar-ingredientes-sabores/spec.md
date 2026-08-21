# Feature Specification: Atualização dos Ingredientes dos Sabores no Cardápio

**Feature Branch**: `009-atualizar-ingredientes-sabores`

**Created**: 2026-08-21

**Status**: Draft

**Input**: User description: "Precisamos atualizar os ingredientes dos sabores demonstrados no App, com a tabela a seguir" (tabela JSON com os 32 sabores — tradicionais, especiais e sensacionais — e a lista de ingredientes de cada um).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cliente vê a lista de ingredientes correta de cada sabor (Prioridade: P1) 🎯

Como cliente navegando pelo cardápio, quero que a descrição exibida em cada sabor liste exatamente os ingredientes oficiais da pizzaria, para que eu saiba com precisão o que vem na pizza antes de pedir.

**Por que esta prioridade**: As descrições atuais no `menu.json` divergem da tabela oficial do dono (ex.: "Baiana" mostra "Pimenta, calabresa e cebola" quando o oficial é "mussarela, calabresa ralada e pimenta"; "Moda da Casa" mostra "Presunto, ervilha, milho e catupiry" quando o oficial é "mussarela, calabresa, bacon, milho, cebola e azeitona"). Informação incorreta de ingredientes gera pedidos errados e retrabalho — é o cerne desta feature.

**Teste independente**: Abrir o cardápio e verificar que o card de um sabor (ex.: "Baiana") exibe a lista de ingredientes oficial, idêntica à tabela fornecida.

**Cenários de aceitação**:

1. **Dado** o cardápio aberto, **Quando** o cliente observa o card de um sabor (ex.: "Baiana"), **Então** a descrição exibe a lista oficial "mussarela, calabresa ralada e pimenta" (e não a antiga "Pimenta, calabresa e cebola").
2. **Dado** o cardápio aberto, **Quando** o cliente percorre os 32 sabores, **Então** cada um deles exibe a lista de ingredientes idêntica à tabela oficial fornecida pelo dono.

---

### User Story 2 - Ingredientes consistentes entre cardápio e montagem da pizza (Prioridade: P2)

Como cliente, quero ver a mesma lista de ingredientes tanto no cardápio quanto na tela de montagem da pizza, para que a informação não se contradiga entre telas.

**Por que esta prioridade**: O cardápio (`MenuPage`) e a montagem (`PizzaCard`/`FlavorSelector`) leem a descrição da mesma fonte (`menu.json`), então a consistência é natural — mas vale validá-la explicitamente, pois é o ponto onde o cliente confirma o pedido.

**Teste independente**: Abrir o cardápio, selecionar um sabor e abrir a montagem — a descrição do sabor deve ser idêntica nas duas telas.

**Cenários de aceitação**:

1. **Dado** um sabor selecionado no cardápio, **Quando** o cliente abre a montagem da pizza, **Então** a descrição do sabor exibida é idêntica à do cardápio.
2. **Dado** o cardápio aberto, **Quando** o cliente observa qualquer sabor em qualquer categoria, **Então** a descrição provém da fonte única (`menu.json`), sem texto duplicado ou divergente no código.

---

### Edge Cases

- O que acontece com sabores cujo nome na tabela oficial difere do nome atual do app? (ex.: tabela "QUATRO QUEIJOS" vs app "4 Queijos"; "3 QUEIJOS" vs "3 Queijos") — trata-se apenas de diferença de grafia/caixa, não de sabores novos; o mapeamento é feito pelo `id` existente e **não** há renomeação (ver Assumptions).
- O que acontece com os ":" ao final dos nomes na tabela oficial (ex.: "BAIANA:", "BACON:")? São artefatos de formatação da fonte e **não** entram nos dados.
- O que acontece se a lista de ingredientes da tabela tiver um sabor inexistente no app? A tabela cobre exatamente os 32 sabores atuais (13 tradicionais + 16 especiais + 3 sensacionais); não há sabor novo nem ausente.
- O que acontece com `menu.json` mal formatado após a edição? O app deve continuar exibindo a mensagem amigável de erro em português (comportamento já existente), sem stack trace.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE atualizar o campo `descricao` de cada um dos 32 sabores em `public/menu.json` para a lista de ingredientes oficial fornecida na tabela do dono, normalizada em caixa baixa (minúsculas).
- **FR-002**: O sistema DEVE preservar inalterados os campos `id`, `nome`, `categoria_id` e `imagem` de todos os sabores — apenas `descricao` muda.
- **FR-003**: O sistema DEVE manter inalteradas as demais seções do `menu.json` (`pizzaria`, `categorias`, `bebidas`) e seus preços.
- **FR-004**: O sistema DEVE exibir as novas descrições no cardápio (`MenuPage`) e na montagem (`PizzaCard`/`FlavorSelector`) sem qualquer alteração de código — a mudança é exclusivamente de dados.
- **FR-005**: O texto de cada `descricao` DEVE refletir fielmente a lista de ingredientes da tabela, com o conteúdo e a ordem preservados, **em caixa baixa (minúsculas)**.

### Key Entities *(include if feature involves data)*

- **Sabor**: Já existe em `menu.json`. Atributos: `id`, `nome`, `descricao`, `imagem`, `categoria_id`. Esta feature altera apenas `descricao`.
- **Categoria**: Já existe (`tradicionais`, `especiais`, `sensacionais`). Inalterada.
- **menu.json**: Arquivo estático de dados, fonte única da verdade do cardápio. É o único artefato alterado nesta feature.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos 32 sabores (13 tradicionais + 16 especiais + 3 sensacionais) exibem a lista de ingredientes correta (conteúdo e ordem da tabela oficial), normalizada em caixa baixa.
- **SC-002**: 0 (zero) campos além de `descricao` são alterados no `menu.json` — `id`, `nome`, `categoria_id`, `imagem`, preços e demais seções permanecem byte a byte idênticos, exceto pelas descrições.
- **SC-003**: O build de produção é concluído sem erros e os testes automatizados existentes continuam passando após a atualização dos dados.
- **SC-004**: O `menu.json` permanece um JSON válido após a edição (nenhum erro de parsing ao carregar o cardápio).

## Assumptions

- **Somente ingredientes mudam**: A solicitação do dono é "atualizar os ingredientes", portanto os nomes dos sabores permanecem como estão. A grafia divergente entre a tabela ("QUATRO QUEIJOS", "3 QUEIJOS") e o app ("4 Queijos", "3 Queijos") **não** implica renomeação nesta feature.
- **Mapeamento por `id`**: Cada sabor da tabela é casado ao sabor existente pelo `id` (ex.: "QUATRO QUEIJOS" → `quatro-queijos`; "3 QUEIJOS" → `tres-queijos`; "BATATA PALHA" → `batata-palha`).
- **Texto em caixa baixa**: As descrições são gravadas preservando o conteúdo e a ordem dos ingredientes da tabela oficial, porém **normalizadas para caixa baixa (minúsculas)** — ex.: "MUSSARELA, CALABRESA RALADA E PIMENTA" → "mussarela, calabresa ralada e pimenta".
- **Os ":" dos nomes da tabela** (ex.: "BAIANA:") são formatação da fonte e não são gravados.
- **Sem mudança de código**: A alteração é exclusivamente no dado estático `menu.json`; nenhuma mudança de componente, estilo ou regra de negócio é necessária.
- **Regras de negócio intactas**: Preços por categoria, acréscimo do 3º sabor, taxa de entrega e demais regras da constituição permanecem inalteradas.
