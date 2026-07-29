# 🍕 Cardápio Digital de Pizzaria

PWA de cardápio digital — monte pizzas, gerencie o carrinho e envie o pedido pelo WhatsApp. 100% estático, sem backend.

## 🚀 Para o dono da pizzaria

### Como editar o cardápio

O cardápio inteiro fica em um único arquivo: **`public/menu.json`**. Você pode editá-lo com qualquer editor de texto (Bloco de Notas, TextEdit, VS Code).

Abra o arquivo e localize a seção que quer mudar:

#### Mudar preço de uma categoria

```json
{
  "id": "tradicionais",
  "nome": "Tradicionais Simples",
  "preco": 30.00,    ← Altere este número
  "sabores": [ ... ]
}
```

#### Adicionar um novo sabor

Dentro da categoria desejada, na lista `"sabores"`, adicione antes do `]`:

```json
{
  "id": "novo-sabor",
  "nome": "Nome do Sabor",
  "descricao": "Descrição curta do sabor",
  "imagem": ""
}
```

**Atenção:** coloque uma vírgula no item anterior se este não for o último!

#### Mudar o WhatsApp

```json
"pizzaria": {
  "whatsapp": "5511999999999",  ← DDI + DDD + número, sem espaços ou símbolos
  ...
}
```

#### Erros comuns

| ❌ Erro | ✅ Correto |
|---------|-----------|
| Esquecer vírgula entre itens: `{ } { }` | `{ }, { }` |
| Vírgula extra no último item: `{ }, ]` | `{ } ]` |
| Aspas sem fechar: `"nome: "João` | `"nome": "João"` |
| Preço com vírgula: `30,00` | `30.00` |

Se o arquivo quebrar, o app mostra uma mensagem em **português** explicando o problema.

## 🛠️ Para desenvolvedores

### Setup

```bash
npm install
npm run dev     # Servidor de desenvolvimento → http://localhost:5173
```

### Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server com hot reload |
| `npm run build` | Build de produção → `dist/` |
| `npm run preview` | Preview do build de produção |

### Build e deploy

```bash
npm run build
# Faça upload do conteúdo de dist/ para Vercel, Netlify ou GitHub Pages
```

### Stack

React 18 + Vite 6 + TypeScript 5 (strict) + Tailwind CSS 4 + React Router 7 + vite-plugin-pwa (Workbox).

### Estrutura

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Rotas
├── types/                # Interfaces TypeScript
├── context/              # MenuContext + CartContext (useReducer)
├── utils/                # pricing.ts, loadMenu.ts, whatsapp.ts
├── components/           # Componentes React
└── pages/                # MenuPage, CartPage, CheckoutPage
public/
├── menu.json             ← Cardápio — editável!
└── offline.html          # Fallback offline
```

## 📐 Spec-Driven Development

Este projeto usa **spec-kit** (github/spec-kit). Documentação complete em:

- `specs/001-mvp-cardapio-pizzaria/` — Spec, plano, modelo de dados, tarefas
- `.hermes/plans/` — Plano de implementação detalhado
