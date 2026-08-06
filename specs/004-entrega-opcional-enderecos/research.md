# Research & Decisions: Entrega Opcional com Gerenciamento de Endereços

**Feature**: `004-entrega-opcional-enderecos`  
**Date**: 2025-08-06

## Decisions

### 1. Persistência de Endereços: localStorage

**Decision**: Armazenar endereços em `localStorage` com chave `pizza-menu-addresses`, sem bibliotecas externas.

**Rationale**: Alinhado com o Princípio I (sem backend). `localStorage` é síncrono, disponível em todos os browsers mobile, e sobrevive a reloads. O limite de 2 endereços torna o volume de dados trivial (< 1KB). 

**Alternatives considered**:
- IndexedDB: Overkill para 2 registros. API assíncrona adiciona complexidade desnecessária.
- SessionStorage: Não sobrevive a reload de página — inaceitável.

**Fallback**: Se `localStorage` estiver indisponível (ex: modo privado que bloqueia), o `AddressContext` opera em memória sem crash. Endereços não persistem entre sessões, mas o app continua funcional.

---

### 2. AddressContext Separado do CartContext

**Decision**: Criar `AddressContext` com `useReducer` isolado, sem acoplamento direto com `CartContext`.

**Rationale**: Endereços e carrinho são domínios diferentes. O `CartContext` não precisa conhecer a lista de endereços — apenas qual está selecionado no momento (`selectedAddressId`). Separar contexts evita re-renders desnecessários e segue o princípio de responsabilidade única.

**Implementation**: 
- `AddressContext` expõe: `addresses`, `selectedId`, `addAddress()`, `removeAddress(id)`, `selectAddress(id)`.
- `CartState` ganha `selectedAddressId: string | null`.
- `CheckoutPage` sincroniza: ao selecionar endereço, chama `selectAddress(id)` no `AddressContext` e `dispatch({ type: 'SET_ADDRESS', id })` no `CartContext`.

**Why not merge into CartContext**: Violaria SRP e faria o `CartContext` gerenciar estado que não é de carrinho. Além disso, a tela `/enderecos` usaria `CartContext` desnecessariamente.

---

### 3. Taxa de Entrega do menu.json (Não Hardcoded)

**Decision**: `CartContext` consome `MenuContext` para obter `pizzaria.taxa_entrega` como valor da taxa. `DeliveryToggle` também lê de `MenuContext` para o label.

**Rationale**: O campo `taxa_entrega` já existe no tipo `PizzariaInfo` e no `menu.json`. Hardcodar `5` no código ignora a fonte de verdade configurável. Se o dono da pizzaria mudar a taxa no JSON, o app deve refletir automaticamente.

**Current bug**: `CartContext.tsx:54` hardcoda `5`. `DeliveryToggle.tsx:22` hardcoda `formatCurrency(5)`.

**Solution**: 
- `CartProvider` acessa `useMenu()` e usa `menu.pizzaria.taxa_entrega` (com fallback `5` se `menu` for null).
- `DeliveryToggle` acessa `useMenu()` para o label.

---

### 4. Formulário de Endereço: Inline vs Modal

**Decision**: Formulário exibido **inline** na `AddressPage`, alternando entre lista e formulário com estado local (`isAdding`).

**Rationale**: Mobile-first — modal em tela pequena é ruim de usar (teclado + scroll). Formulário inline com transição simples é mais natural. Botão "Adicionar endereço" expande o formulário abaixo ou substitui o estado de lista.

**Alternative rejected**: Modal/overlay — pior experiência mobile, problemas de scroll com teclado virtual.

---

### 5. Validação de Endereço

**Decision**: Validação client-side simples: `rua`, `numero`, `bairro` obrigatórios; `complemento` opcional. Campos com `maxLength` para evitar overflow.

**Rationale**: Não há backend para validar. Validação deve ser suficiente para garantir que o endereço está preenchido o bastante para entrega.

**Implementation**: Estado local no formulário com erros por campo. Validação no submit. Mensagens em português.

---

### 6. Sincronização selectedAddressId entre Contexts

**Decision**: `CheckoutPage` é o ponto de sincronização. Quando o usuário seleciona um endereço no `AddressCard`, a página chama `selectAddress(id)` no `AddressContext` e `dispatch({ type: 'SET_ADDRESS', id })` no `CartContext`.

**Rationale**: Duas fontes de verdade mínimas (endereços no `AddressContext`, referência no `CartContext`). A sincronização no componente que os une (`CheckoutPage`) é explícita e rastreável.

**Edge case — endereço ativo excluído**: Quando `removeAddress(id)` é chamado e o `id` coincide com `selectedId`, o reducer também limpa `selectedId`. O `AddressCard` detecta `selectedAddressId` órfão e mostra estado vazio.

---

### 7. Card de Endereço no Checkout

**Decision**: Criar componente `AddressCard` exibido condicionalmente (`delivery === 'entrega'`) no `CheckoutPage`.

**Rationale**: Separação de responsabilidades — o card gerencia seu próprio estado de exibição (endereço encontrado, vazio, não selecionado). O `CheckoutPage` apenas decide se mostra ou não.

**States do AddressCard**:
1. `delivery === 'retirada'` → não renderiza
2. `delivery === 'entrega'` + endereço selecionado → mostra endereço formatado + botão "Alterar"
3. `delivery === 'entrega'` + sem endereço → mostra "Nenhum endereço" + botão "Adicionar"

---

### 8. Navegação de Volta da Tela de Endereços

**Decision**: Header com botão "← Voltar" usando `useNavigate(-1)`.

**Rationale**: `useNavigate(-1)` retorna para a página anterior (checkout) sem hardcodar rota. Funciona independentemente de onde o usuário veio.

---

## No-Go Decisions

| Abordagem | Motivo da rejeição |
|-----------|-------------------|
| IndexedDB para endereços | Overkill — 2 registros, localStorage síncrono é suficiente |
| Biblioteca de formulários (react-hook-form, formik) | Dependência externa desnecessária para formulário de 4 campos |
| Estado global único (tudo no CartContext) | Violaria SRP — endereços não são domínio do carrinho |
| Modal para formulário de endereço | Pior UX mobile com teclado virtual |
| API de CEP/geolocalização | Fora de escopo MVP — sem backend, adiciona latência e dependência externa |
| Bloquear finalização sem endereço | Especificado como não-bloqueante — cliente pode informar depois |
