# Quickstart: Entrega Opcional com Gerenciamento de Endereços

**Feature**: `004-entrega-opcional-enderecos`  
**Date**: 2025-08-06

## O que muda

### Visualmente

| Antes | Depois |
|-------|--------|
| Taxa de entrega sempre R$ 5 no total | Taxa condicional: R$ 5 só em "Entrega"; R$ 0 em "Retirada" |
| DeliveryToggle hardcoda `+R$ 5,00` | DeliveryToggle lê `menu.json` para o valor da taxa |
| Checkout: só toggle + pagamento + resumo | Checkout: toggle + **card de endereço** (quando Entrega) + pagamento + resumo |
| CartSummary: "Taxa de entrega: Grátis" | CartSummary: "Retirada: Grátis" (quando retirada) |
| Sem tela de endereços | Nova tela `/enderecos` — lista + adicionar/remover endereços |
| WhatsApp sem endereço | WhatsApp inclui endereço formatado na entrega |

### Estruturalmente

| Change | File |
|--------|------|
| **Novo tipo** | `src/types/address.ts` — `Address`, `AddressState`, `AddressAction` |
| **Novo Context** | `src/context/AddressContext.tsx` — Provider + useReducer |
| **Nova página** | `src/pages/AddressPage.tsx` — tela `/enderecos` |
| **Novo componente** | `src/components/AddressCard.tsx` — card no checkout |
| **Modificado** | `src/types/cart.ts` — `CartState.selectedAddressId`, `CartAction.SET_ADDRESS` |
| **Modificado** | `src/context/CartContext.tsx` — taxa do `MenuContext`, `SET_ADDRESS` reducer |
| **Modificado** | `src/components/DeliveryToggle.tsx` — label do `MenuContext` |
| **Modificado** | `src/components/CartSummary.tsx` — label condicional |
| **Modificado** | `src/pages/CheckoutPage.tsx` — `<AddressCard />` condicional |
| **Modificado** | `src/components/WhatsAppButton.tsx` — endereço no texto |
| **Modificado** | `src/utils/whatsapp.ts` — parâmetro `endereco?` |
| **Modificado** | `src/App.tsx` — rota `/enderecos` |
| **Modificado** | `src/main.tsx` — `<AddressProvider>` |

### O que NÃO muda

- Preços, regras de negócio, limite de 3 sabores, R$ 5 no 3º sabor
- Carrinho (`CartPage`, `CartItem`, `EmptyCart`)
- Cardápio (`MenuPage`, `PizzaCard`, `PizzaBuilder`, `FlavorSelector`)
- Pagamento (`PaymentSelector`)
- PWA, Service Worker, manifest
- `menu.json`, `pricing.ts`, `loadMenu.ts`, `MenuContext.tsx`

## Verification

```bash
npm run build    # Build sem erros
```

### Testes manuais

```
1. Abrir app → adicionar pizza → ir para carrinho → checkout
2. Ver DeliveryToggle com taxas corretas do menu.json
3. Selecionar "Retirada" → total = subtotal (sem taxa)
4. Selecionar "Entrega" → card de endereço aparece; total = subtotal + taxa
5. Clicar "Adicionar endereço" → navega para /enderecos
6. Adicionar 2 endereços → verificar limite (botão desabilitado)
7. Remover 1 endereço → verificar que pode adicionar de novo
8. Selecionar endereço → voltar ao checkout → card mostra endereço
9. Finalizar pedido → WhatsApp inclui endereço formatado
10. Selecionar "Retirada" → finalizar → WhatsApp NÃO inclui endereço
```

### Fluxo: Entrega sem endereço

```
1. Carrinho com itens → checkout
2. Selecionar "Entrega" → não adicionar endereço
3. Selecionar pagamento → finalizar
4. WhatsApp mostra "Endereço: *a informar*"
5. Pedido enviado com sucesso (não bloqueia)
```

### Fluxo: Gerenciar endereços

```
1. Checkout → "Alterar endereço" → /enderecos
2. Ver 2 endereços existentes → "← Voltar" retorna ao checkout
3. Excluir 1 endereço → adicionar novo → salvar
4. Voltar ao checkout → card mostra novo endereço
```

## Persistência

Endereços são salvos em `localStorage` com chave `pizza-menu-addresses`. Para limpar:

```javascript
localStorage.removeItem('pizza-menu-addresses');
```

## Dependências

**Nenhuma nova dependência.** Apenas React nativo (Context, useReducer, useState) e React Router 6 (useNavigate, já instalado).
