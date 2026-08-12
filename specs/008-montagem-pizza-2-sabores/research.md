# Research — Montagem de Pizza: 2 Sabores Padrão / 3º Excepcional

Fase 0 do `/speckit.plan`. Nenhum "NEEDS CLARIFICATION" remanescente na spec; as decisões abaixo são de **implementação**, resolvidas contra a constituição e o código existente.

## Decisões

### D1 — Modal de confirmação do 3º sabor sem biblioteca externa

- **Decision**: Replicar o padrão de modal já usado em `PizzaBuilder.tsx` (`fixed inset-0 z-50 bg-black/40` + painel `bg-white rounded-2xl`), num componente dedicado `ThirdFlavorModal`. Backdrop click ≡ "Cancelar".
- **Rationale**: A constituição proíbe bibliotecas de UI (V. Stack Técnica). O projeto já tem um padrão de modal consistente; reutilizá-lo mantém o tom visual e evita dependências.
- **Alternatives considered**: `dialog` nativo do navegador (estilo inconsistente com o tema brand e controle de backdrop limitado); biblioteca de modal (viola a constituição). Rejeitadas.

### D2 — Interceptar a transição 2 → 3 sabores no `handleToggle` do FlavorSelector

- **Decision**: Em `FlavorSelector.handleToggle`, quando `selected.length === 2` e o sabor tocado **ainda não** está selecionado, não adicionar diretamente: armazenar o sabor candidato em estado transitório (`pendingThirdSabor`) e abrir o modal. Só em "Adicionar" o 3º sabor entra na seleção.
- **Rationale**: Localiza a mudança no único ponto de mutação da seleção, garantindo que **toda** via de adicionar o 3º sabor passe pelo modal (spec: "o modal é a única via").
- **Alternatives considered**: tratar o modal no `PizzaBuilder` (separaria a lógica do estado da seleção, aumentando acoplamento). Rejeitada.

### D3 — Bloqueio do 4º sabor permanece (mensagem explícita)

- **Decision**: Manter o bloqueio atual (`disabled={maxReached && !isSelected}` com `opacity-40`) e adicionar uma mensagem textual clara ("máximo de 3 sabores por pizza") no indicador quando `selected.length === 3` (FR-007), em vez de apenas desabilitar silenciosamente.
- **Rationale**: A spec exige mensagem explícita para a tentativa de 4º sabor. Hoje o bloqueio é só visual (botões desabilitados).
- **Alternatives considered**: abrir um toast/modal para o 4º sabor (sobre-engenharia; a spec não pede modal nesse caso). Rejeitada.

### D4 — Rolagem automática via `scrollIntoView` + ref por sabor

- **Decision**: Cada card de sabor recebe um identificador estável (`id={`sabor-${s.id}`}`) e, num `useEffect` montado uma única vez (guard por `hasAutoScrolled`), rolar com `scrollIntoView({ behavior: 'smooth', block: 'center' })` até o sabor pré-selecionado. Usar `scroll-mt` para compensar o indicador fixo (`sticky top-0`).
- **Rationale**: `scrollIntoView` é nativo, suave e não exige dependência. `block: 'center'` deixa o sabor pré-selecionado visível abaixo do indicador fixo (edge case da spec). Rodar uma única vez preserva a rolagem manual subsequente (FR-011).
- **Alternatives considered**: `scrollTop` calculado manualmente no container (mais código, propenso a erro com sticky header); biblioteca de smooth-scroll (dependência desnecessária). Rejeitadas.

### D5 — Texto dos labels (pt-BR, tom do app)

- **Decision**: Estados do indicador de contagem:
  - 0 sabores → "Inclui até 2 sabores como padrão"
  - 1 sabor → "1 sabor • até 2 no padrão"
  - 2 sabores → "2 sabores (padrão) • 3º sabor + R$ 5,00"
  - 3 sabores → "3º sabor + R$ 5,00 aplicado • máximo 3 sabores"
  O texto exato pode ser refinado na implementação, desde que comunique "2 padrão / 3º + R$ 5,00" (spec, Assumptions).
- **Rationale**: Atende FR-008 (comunicar padrão e excepcional) sem inventar nova regra; reutiliza a formatação de moeda existente.
- **Alternatives considered**: manter texto neutro atual ("N de 3 sabores selecionados") — rejeitada por não comunicar a regra.

### D6 — Posicionamento do indicador (US3)

- **Decision**: Revisar as classes do indicador em `FlavorSelector.tsx:32-44` (atualmente `sticky top-0 bg-white pb-2 z-10`): remover o espaçamento superior excedente que o separa do conteúdo e garantir que ele fique alinhado ao bloco de seleção, sem "flutuar" sobre os cards quando parado no topo.
- **Rationale**: A spec (US3) descreve uma quebra visual de espaçamento. O diagnóstico fino do CSS é feito na implementação; o critério objetivo é SC-004 (não sobrepor cards em 320px+).
- **Alternatives considered**: remover a sticky por completo (perde o preço sempre visível durante a rolagem). Rejeitada.

## Sem riscos novos

Nenhuma dependência nova, nenhuma alteração de dados (`menu.json` intacto), nenhuma mudança em `pricing.ts`. Risco principal é de regressão visual no FlavorSelector — coberto por testes de componente (ver quickstart.md).
