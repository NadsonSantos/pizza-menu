# Research: Tela Inicial Dinâmica com Histórico de Compras

**Feature**: NAD-6 | **Date**: 2026-08-11

## Research Topics

### 1. Persistência de pedidos no localStorage

**Decision**: Salvar o pedido completo (itens, valores, entrega, pagamento, timestamp) como `OrderRecord` no array `order_history` do `localStorage`, ANTES do `CLEAR_CART` no `WhatsAppButton.handleFinish`.

**Rationale**: O `WhatsAppButton` já é o ponto de finalização único. Inserir o salvamento entre `window.open(whatsappUrl)` e `dispatch(CLEAR_CART)` garante que os dados do carrinho estejam disponíveis no momento do salvamento. A operação é síncrona (`JSON.stringify` + `setItem`), cumprindo o SC-001 (<50ms).

**Alternatives considered**:
- Evento `beforeunload`: Não confiável em mobile (iOS Safari não garante execução).
- Salvar no `CLEAR_CART` do reducer: O reducer perde acesso ao estado completo após o clear — precisaria de middleware ou efeito colateral, violando a pureza do reducer.
- Salvar via `useEffect`: Assíncrono, risco de race condition com `CLEAR_CART`.

### 2. Filtro de 90 dias

**Decision**: Calcular `const CUTOFF = Date.now() - 90 * 24 * 60 * 60 * 1000` e filtrar pedidos com `new Date(order.timestamp).getTime() >= CUTOFF`. Usar `Date.now()` no momento da consulta (não pré-computado).

**Rationale**: 90 dias corridos conforme spec. `Date.now()` garante que o filtro é sempre atual, sem necessidade de recálculo periódico. Timestamp ISO 8601 no armazenamento permite `new Date(timestamp)` confiável cross-browser.

**Alternatives considered**:
- `dayjs`/`date-fns`: Overkill para uma comparação simples. Adicionaria dependência desnecessária.
- Comparação lexicográfica de strings ISO: Funciona para mesma timezone, mas `new Date().getTime()` é mais explícito e legível.

### 3. Roteamento condicional pós-splash

**Decision**: Manter `SplashScreen` como componente irmão de `<Routes>` (estrutura atual). Após `onFinish`, o `App` lê `order_history`, calcula elegibilidade, e renderiza `<Routes>` com `<Route path="/" element={hasHistory ? <HomePage /> : <MenuPage />} />`.

**Rationale**: A leitura do `localStorage` é síncrona e barata (<1ms para arrays pequenos). Não há necessidade de estado assíncrono ou lazy loading. A decisão de elegibilidade cabe no `App` component (orquestrador de rotas), mantendo `SplashScreen` puro (sem acoplamento com lógica de negócio).

**Alternatives considered**:
- `useEffect` + `useState` para elegibilidade: Introduziria um estado intermediário e potencial flash de conteúdo errado. Desnecessário para operação síncrona.
- Nova rota `/inicio`: Complexidade extra de redirecionamento. Melhor manter `/` como ponto de entrada único.
- `SplashScreen` como rota: Quebraria o modelo atual onde splash é um estado da App, não uma rota navegável.

### 4. "Pedir novamente" — restaurar carrinho

**Decision**: Nova action `ORDER_FROM_HISTORY` no `CartContext` que substitui todo o `CartState` (exceto `payment` e `troco`, conforme spec) pelo estado salvo no `OrderRecord`. A action recebe o `OrderRecord` e reconstrói o `CartState`.

**Rationale**: `CLEAR_CART` + múltiplos `ADD_ITEM` disparariam N renders e efeitos colaterais. Uma action atômica `ORDER_FROM_HISTORY` faz a substituição em um único dispatch, cumprindo SC-004 (<100ms). `payment` e `troco` são resetados para `null`/`''` porque a spec diz que o usuário precisa selecionar novamente na finalização.

**Alternatives considered**:
- `CLEAR_CART` + loop `ADD_ITEM`: Ineficiente (N dispatches) e causaria flicker visual durante a reconstrução.
- Nova action `LOAD_ORDER(id)`: Acoplaria o CartContext ao localStorage. Melhor manter a responsabilidade de leitura no caller (página/detalhe) e passar dados prontos.

### 5. Validação e edge cases do localStorage

**Decision**: Defensive programming em toda leitura do `localStorage.order_history`. Envolver `JSON.parse` em try-catch, validar que o resultado é array, e filter itens com estrutura esperada. Itens inválidos são descartados silenciosamente.

**Rationale**: FR-011 exige que falhas no localStorage não quebrem o app. A validação no ponto de leitura (não no de escrita) é mais robusta porque dados podem ser corrompidos entre sessões (manipulação manual, extensões de browser, migração de dados).

**Alternatives considered**:
- Schema validation library (Zod): Overkill para 1 chave do localStorage. Adicionaria dependência.
- `JSON.parse` com reviver customizado: Mais complexo que try-catch + type guard manual, sem ganho real.

### 6. Descrição resumida do pedido na HomePage

**Decision**: Formato: `"Pizza {primeiro sabor}"` para 1 pizza, `"Pizza {sabor1} + Pizza {sabor2}"` para 2 pizzas, `"Pizza {sabor1} + {n-1} itens"` para 3+ itens. Bebidas contam como "itens". Se não houver pizza, usa o primeiro item como referência.

**Rationale**: Conciso e informativo conforme spec US-3 Scenario 4. Não tenta resumir combinações complexas de sabores (ex: pizza com 3 sabores) — mostra apenas o primeiro sabor. O detalhamento completo fica na tela de detalhes.

**Alternatives considered**:
- Listar todos os sabores: Ficaria muito longo para pizzas de 3 sabores.
- Apenas "Pedido #N": Impessoal, não ajuda o usuário a identificar o pedido.

### 7. Navegação e layout da HomePage

**Decision**: `HomePage` renderiza dentro do `<Layout>` existente (header com logo + CartBadge, footer implícito). A lista de pedidos usa cards com Tailwind, cabeçalho "Seus últimos pedidos", e CTA "Novo Pedido" como botão primário no topo ou após a lista.

**Rationale**: Consistência com o resto do app — todos os fluxos usam o mesmo `<Layout>`. O header com link para `/` deve funcionar como "home" mesmo na HomePage (link auto-referencial sem efeito colateral). Mobile-first: cards ocupam largura total, com padding confortável para touch.

**Alternatives considered**:
- Layout próprio sem header: Inconsistente com o resto do app e perderia acesso ao carrinho.
- Bottom navigation: Complexidade desnecessária para 2-3 destinos. O fluxo atual (header + back button) é suficiente.
