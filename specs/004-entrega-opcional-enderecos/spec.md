# Feature Specification: Entrega Opcional com Gerenciamento de Endereços

**Feature Branch**: `004-entrega-opcional-enderecos`

**Created**: 2025-08-06

**Status**: Approved (validated by PO)

**Input**: "Hoje a entrega está sendo calculada obrigatoriamente — o valor de R$ 5 é sempre adicionado ao total. A entrega deve ser opcional: o usuário deve poder escolher entre retirar o pedido ou receber em casa."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Escolha Obrigatória entre Retirada e Entrega (Priority: P1) 🎯

O cliente no checkout vê um toggle com duas opções: "Retirada" e "Entrega". A taxa de entrega (vinda de `menu.json`) só é adicionada ao total quando "Entrega" está selecionado. Ao selecionar "Retirada", o total reflete apenas o subtotal.

**Why this priority**: Corrige o bug atual onde `CartContext` hardcoda a taxa mesmo quando o usuário seleciona "Retirada". É a base para todo o resto.

**Independent Test**: No checkout, selecionar "Retirada" → total = subtotal (sem taxa). Selecionar "Entrega" → total = subtotal + taxa de entrega do `menu.json`.

**Acceptance Scenarios**:

1. **Given** que o carrinho tem itens (subtotal > 0), **When** o cliente seleciona "Retirada" no checkout, **Then** o total exibido é igual ao subtotal (taxaEntrega = 0).
2. **Given** que o carrinho tem itens, **When** o cliente seleciona "Entrega" no checkout, **Then** o total = subtotal + `pizzaria.taxa_entrega` do `menu.json`.
3. **Given** que `menu.json` define `taxa_entrega: 5`, **When** o DeliveryToggle renderiza o botão "Entrega", **Then** exibe `(+R$ 5,00)` usando o valor do `menu.json`, não hardcoded.
4. **Given** que o cliente alterna entre Retirada e Entrega várias vezes, **When** o toggle muda, **Then** o total é recalculado instantaneamente.

---

### User Story 2 — Card de Endereço no Checkout (Priority: P1) 🎯

Ao selecionar "Entrega", o cliente vê abaixo do toggle um card com o último endereço salvo (se existir) e um botão "Alterar endereço" que navega para a tela de gerenciamento. Se não houver endereço salvo, o card mostra "Nenhum endereço salvo" com botão "Adicionar endereço".

**Why this priority**: É a experiência principal após a escolha de entrega — sem ela, o fluxo de endereço é inútil.

**Independent Test**: Selecionar "Entrega" → ver card com endereço (ou mensagem de vazio). Clicar "Alterar endereço" → navegar para `/enderecos`.

**Acceptance Scenarios**:

1. **Given** que o cliente selecionou "Entrega" e já tem um endereço salvo (último selecionado), **When** o card de endereço renderiza, **Then** exibe rua, número, bairro, complemento (se houver) e um botão "Alterar endereço".
2. **Given** que o cliente selecionou "Entrega" e não tem endereço salvo, **When** o card renderiza, **Then** exibe "Nenhum endereço salvo" com botão "Adicionar endereço".
3. **Given** que o cliente selecionou "Entrega" sem endereço, **When** clica em "Adicionar endereço", **Then** navega para `/enderecos?from=checkout`.
4. **Given** que o cliente selecionou "Retirada", **When** o card de endereço, **Then** NÃO é exibido (apenas quando delivery === 'entrega').

---

### User Story 3 — Tela de Gerenciamento de Endereços (Priority: P2)

O cliente acessa `/enderecos` para visualizar, adicionar e remover endereços (limite de 2). A tela lista endereços existentes como cards com opção de excluir. Um botão "Adicionar endereço" abre um formulário (ou expande inline) com campos: rua, número, bairro, complemento (opcional).

**Why this priority**: Depende da US1/US2 para fazer sentido, mas é testável isoladamente via navegação direta.

**Independent Test**: Acessar `/enderecos` → ver lista de endereços (ou estado vazio). Adicionar 1 endereço → card aparece na lista. Tentar adicionar 3º → mensagem "Limite de 2 endereços atingido".

**Acceptance Scenarios**:

1. **Given** que o cliente está em `/enderecos` sem endereços, **When** a página carrega, **Then** exibe mensagem "Nenhum endereço cadastrado" e botão "Adicionar endereço".
2. **Given** que o cliente tem 1 endereço, **When** adiciona um segundo, **Then** o novo endereço aparece na lista e o formulário fecha.
3. **Given** que o cliente tem 2 endereços, **When** a página carrega, **Then** o botão "Adicionar" está desabilitado com texto "Limite de 2 endereços".
4. **Given** que o cliente tem 1 endereço, **When** clica no ícone de lixeira, **Then** o endereço é removido e a lista atualiza.
5. **Given** que o cliente está no formulário de novo endereço, **When** deixa campos obrigatórios vazios e tenta salvar, **Then** validação inline mostra mensagens de erro (ex: "Rua é obrigatória").
6. **Given** que o cliente está no formulário, **When** preenche todos os campos obrigatórios e clica "Salvar", **Then** o endereço é persistido e aparece na lista.

---

### User Story 4 — Endereço na Mensagem do WhatsApp (Priority: P2)

Quando o cliente finaliza o pedido com "Entrega", a mensagem do WhatsApp inclui o endereço selecionado formatado. Se "Retirada", não inclui endereço.

**Why this priority**: Conecta o fluxo de endereço ao objetivo final (pedido completo no WhatsApp). Depende das US1-US3.

**Independent Test**: Finalizar pedido com Entrega e endereço → WhatsApp abre com endereço no texto. Finalizar com Retirada → sem endereço.

**Acceptance Scenarios**:

1. **Given** que o delivery é "entrega" e há endereço selecionado, **When** o cliente finaliza, **Then** a mensagem do WhatsApp inclui "Endereço: Rua X, 123 — Bairro Y (Complemento Z)".
2. **Given** que o delivery é "entrega" e NÃO há endereço, **When** o cliente finaliza, **Then** a mensagem inclui "Endereço: *a informar*".
3. **Given** que o delivery é "retirada", **When** o cliente finaliza, **Then** a mensagem NÃO inclui linha de endereço.

---

### Edge Cases

- **localStorage indisponível**: O AddressContext detecta e mostra fallback (estado vazio, sem crash). Endereços não persistem, mas o app continua funcional.
- **Endereço ativo excluído**: Se o endereço selecionado no carrinho é excluído da lista, `selectedAddressId` é limpo (null) e o card no checkout reverte para estado "sem endereço".
- **Troca rápida entre Retirada/Entrega**: Alternar o toggle várias vezes não causa race condition ou flicker — o card de endereço aparece/desaparece corretamente.
- **Formulário com campos muito longos**: Campos têm `maxLength` e truncamento visual para evitar overflow.
- **Navegação de volta da tela de endereços**: Header com botão "← Voltar" navega para a página anterior (`useNavigate(-1)`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O `CartContext` DEVE usar `pizzaria.taxa_entrega` do `menu.json` como valor da taxa de entrega, não hardcodar R$ 5.
- **FR-002**: O `DeliveryToggle` DEVE exibir o valor da taxa vindo do `MenuContext`, não hardcoded.
- **FR-003**: `taxaEntrega` DEVE ser 0 quando `delivery === 'retirada'`.
- **FR-004**: O sistema DEVE ter um `AddressContext` com `useReducer` que gerencia: lista de endereços (máx. 2), `selectedId` (referência ao endereço ativo).
- **FR-005**: Endereços DEVEM ser persistidos via `localStorage` com chave `pizza-menu-addresses`.
- **FR-006**: `CartState` DEVE ganhar campo `selectedAddressId: string | null` para referenciar o endereço selecionado no checkout.
- **FR-007**: O `CheckoutPage` DEVE exibir um card de endereço (componente `AddressCard`) quando `delivery === 'entrega'`.
- **FR-008**: O `AddressCard` DEVE mostrar o endereço selecionado ou estado vazio com CTA.
- **FR-009**: A tela `/enderecos` (`AddressPage`) DEVE permitir: listar, adicionar (até 2), remover endereços.
- **FR-010**: O formulário de endereço DEVE ter validação client-side (rua, número, bairro obrigatórios; complemento opcional).
- **FR-011**: O `WhatsAppButton`/`formatWhatsAppMessage` DEVE incluir endereço formatado na mensagem quando `delivery === 'entrega'`.
- **FR-012**: O `CartSummary` no carrinho DEVE ajustar o label da taxa conforme o modo: "Retirada: Grátis" vs "Taxa de entrega: R$ X".
- **FR-013**: O App DEVE ter rota `/enderecos` registrada no React Router.
- **FR-014**: A tela `/enderecos` DEVE ter header com botão "← Voltar" usando `useNavigate(-1)`.
- **FR-015**: O `AddressCard` DEVE ter botão "Alterar endereço" que navega para `/enderecos` (ou "Adicionar endereço" se vazio).
- **FR-016**: O limite de 2 endereços DEVE ser respeitado com UI feedback (botão desabilitado + texto explicativo).

### Key Entities

- **Address**: `{ id: string, rua: string, numero: string, bairro: string, complemento: string }` — persistido em localStorage.
- **AddressState**: `{ addresses: Address[], selectedId: string | null }` — gerenciado por useReducer.
- **CartState** (extensão): ganha `selectedAddressId: string | null`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ao selecionar "Retirada", `taxaEntrega = 0` e total = subtotal.
- **SC-002**: Ao selecionar "Entrega", `taxaEntrega = pizzaria.taxa_entrega` e total = subtotal + taxa.
- **SC-003**: Endereços persistem em localStorage (`pizza-menu-addresses`) e sobrevivem a reload.
- **SC-004**: É possível adicionar, selecionar e remover endereços sem erros de console.
- **SC-005**: A mensagem do WhatsApp inclui endereço formatado quando `delivery === 'entrega'`.
- **SC-006**: Build (`npm run build`) passa sem erros.
- **SC-007**: Nenhuma regressão nas funcionalidades existentes (carrinho, checkout, pagamento, PWA, menu).

## Assumptions

- O `menu.json` já possui `pizzaria.taxa_entrega` (campo existente no tipo `PizzariaInfo`).
- A persistência usa `localStorage` com fallback silencioso (sem crash se indisponível).
- O `AddressContext` é separado do `CartContext` para evitar acoplamento. `CartContext` apenas referencia `selectedAddressId`.
- A sincronização entre contexts é feita via `selectedAddressId` no `CartState` — o `CartContext` NÃO gerencia endereços, apenas referencia qual está ativo no momento.
- O cliente acessa `/enderecos` pelo checkout (botão no AddressCard) e potencialmente pelo footer/nav (a definir).
- O formulário de endereço é exibido inline (expansão) ou como modal — decisão de implementação a cargo do engenheiro.
- Campos de endereço são em português (rua, número, bairro, complemento) para alinhar com o público-alvo.
- O endereço NÃO bloqueia a finalização do pedido — se o cliente selecionar "Entrega" sem endereço, o pedido ainda pode ser enviado com "Endereço: *a informar*" no WhatsApp.
- Nenhuma mudança no `menu.json`, `PizzaBuilder`, `FlavorSelector`, `CartItem`, `CartPage`, `MenuPage`, `PaymentSelector`, `OrderSummary`, `EmptyCart`, `Layout` (exceto adição de rota `/enderecos` no roteador e possível link no footer).

---

## Decisões de Design (da Validação PO)

1. **Persistência via localStorage** — Alinhado com o Princípio I da Constituição (sem backend). Chave: `pizza-menu-addresses`.
2. **AddressContext separado** — Gerencia endereços com `useReducer`. `CartState` ganha `selectedAddressId` para referência — não duplica estado.
3. **Taxa de entrega do `menu.json`** — `CartContext` deve consumir `MenuContext` para obter `pizzaria.taxa_entrega` em vez de hardcodar `5`.
4. **Endereço NÃO bloqueia finalização** — Se o cliente selecionar "Entrega" sem endereço, o pedido ainda pode ser enviado (endereço aparece como "*a informar*" no WhatsApp).

### Pontos de Atenção Resolvidos

**1. Sincronização entre AddressContext e CartContext**: O `CartContext` NÃO duplica `selectedAddressId`. O campo `selectedAddressId` no `CartState` é populado pelo `CheckoutPage` quando o usuário seleciona um endereço. O `AddressContext` apenas gerencia a lista — o `CartContext` não o consome diretamente.

**2. Navegação de volta da tela de endereços**: Adicionar header secundário na tela `/enderecos` com botão "← Voltar" usando `useNavigate(-1)`.

**3. CartSummary no carrinho**: No carrinho, ajustar label: se `delivery === 'retirada'`, mostrar "Retirada: Grátis" em vez de "Taxa de entrega: Grátis".

**4. UX: Finalizar sem endereço**: Adicionar indicador visual leve (texto laranja "Endereço não informado") no card em vez de bloquear a finalização.
