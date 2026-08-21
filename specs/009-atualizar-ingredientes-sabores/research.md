# Research — Atualização de Ingredientes dos Sabores (009)

Fase 0 do `/speckit.plan`. Nenhum "NEEDS CLARIFICATION" remanescente na spec. Decisões de implementação abaixo, resolvidas contra a constituição, a spec aprovada e o código/dados existentes.

## Decisões

### D1 — Mudança exclusivamente de dados, sem código

- **Decision**: Editar somente `public/menu.json`, alterando o campo `descricao` de cada um dos 32 sabores. Nenhum arquivo em `src/` muda.
- **Rationale**: A spec delimita o escopo a "somente ingredientes". A exibição já lê `sabor.descricao` (em `PizzaCard.tsx` e `MenuPage.tsx`), então o dado novo aparece automaticamente (FR-004).
- **Alternatives considered**: criar uma camada de formatação no front (rejeitada — YAGNI e violaria o escopo "sem mudança de código").

### D2 — Normalização para caixa baixa (minúsculas)

- **Decision**: Converter o texto da tabela oficial (caixa alta) para **minúsculas**, preservando conteúdo e ordem dos ingredientes, com separador `,` + espaço e conjunção final "e" minúscula. Ex.: "MUSSARELA, CALABRESA RALADA E PIMENTA" → "mussarela, calabresa ralada e pimenta".
- **Rationale**: Decisão explícita do dono na aprovação da spec ("os textos serão em caixa baixa").
- **Alternatives considered**: manter caixa alta (rejeitada pelo dono); caixa de título "Mussarela, Calabresa..." (rejeitada — o pedido foi caixa baixa, não título).

### D3 — Mapeamento por `id` existente, sem renomeação

- **Decision**: Cada sabor da tabela é casado ao sabor existente pelo `id`. Grafias divergentes entre tabela e app são resolvidas por `id`, **sem** renomear: "QUATRO QUEIJOS" → `quatro-queijos` (nome "4 Queijos" permanece); "3 QUEIJOS" → `tres-queijos` (nome "3 Queijos" permanece); "BATATA PALHA" → `batata-palha`.
- **Rationale**: O pedido foi "atualizar os ingredientes", não renomear sabores. O `id` é a chave estável usada no app.
- **Alternatives considered**: renomear nomes para casar com a tabela (rejeitada — fora de escopo e alteraria `nome`, vetado pela spec FR-002).

### D4 — ":" dos nomes da tabela são ignorados

- **Decision**: Os dois-pontos ao final dos nomes na fonte (ex.: "BAIANA:", "BACON:") são artefato de formatação e **não** entram nos dados.
- **Rationale**: A spec (Assumptions) já fixou isso; nenhum nome contém ":" no app.

### D5 — Validação pós-edição

- **Decision**: Após editar `menu.json`, validar que o arquivo permanece JSON válido e rodar `npm run test` + `npm run build` (SC-003, SC-004). Não há teste automatizado que asserte o texto de `descricao`, então a conferência dos 32 valores é manual contra `contracts/data-contract.md`.
- **Rationale**: Garante que a edição manual não corrompeu o JSON e que nada quebrou no build.

## Sem riscos novos

Nenhuma dependência nova, nenhuma mudança em `src/`, nenhuma mudança de regra de negócio. Único risco é erro de digitação na edição manual do JSON — mitigado pela validação de JSON válido (D5) e pela conferência contra o data-contract.
