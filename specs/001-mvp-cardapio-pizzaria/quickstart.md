# Quickstart: MVP Cardápio Digital de Pizzaria

**Feature**: `001-mvp-cardapio-pizzaria`
**Date**: 2025-07-28

## Prerequisites

- **Node.js** ≥ 18 (LTS)
- **npm** ≥ 9 (vem com Node)
- Navegador moderno (Chrome 92+, Safari 15.4+, Firefox 95+)

## Setup

```bash
# 1. Clone e entre no projeto
cd pizza-menu

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

O app abre em `http://localhost:5173`.

## Project Structure (key files)

```
pizza-menu/
├── public/
│   └── menu.json          ← Edite aqui para mudar o cardápio
├── src/
│   ├── main.tsx           ← Entry point
│   ├── App.tsx            ← Rotas + providers
│   ├── context/           ← Estado global (carrinho, menu)
│   ├── utils/             ← Lógica de negócio (preço, WhatsApp)
│   ├── components/        ← Componentes React reutilizáveis
│   └── pages/             ← Páginas (Menu, Carrinho, Finalizar)
├── specs/                 ← Documentação spec-driven
└── .hermes/plans/         ← Planos de implementação
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server com HMR (localhost:5173) |
| `npm run build` | Build de produção → `dist/` |
| `npm run preview` | Previa build de produção localmente |
| `npx tsc --noEmit` | Type check sem emitir arquivos |

## Development Workflow

1. **Editar menu.json**: Modifique `public/menu.json` para alterar cardápio. As mudanças são refletidas com refresh da página.
2. **Criar componentes**: Todos em `src/components/` seguindo mobile-first.
3. **Testar mobile**: Use Chrome DevTools Device Mode (375px width) para simular celular.
4. **Testar PWA**: `npm run build && npm run preview` — o Service Worker só funciona em produção. Verifique a aba "Application" > "Service Workers" no DevTools.

## Verifying PWA

```bash
npm run build
npx serve dist
```

1. Abra `http://localhost:3000` no Chrome
2. DevTools → Application → Service Workers: deve mostrar SW registrado
3. DevTools → Application → Manifest: deve mostrar o manifest
4. Lighthouse → PWA audit: deve atingir ≥ 90

## Testing Offline

1. `npm run build && npm run preview`
2. Abra o app, navegue pelo cardápio
3. DevTools → Network → marque "Offline"
4. Recarregue a página — o cardápio deve continuar visível

## Editing menu.json (for business owner)

1. Abra `public/menu.json` em qualquer editor de texto
2. Siga a estrutura do exemplo — cada `{ ... }` é um objeto, cada `"chave": "valor"` é um campo
3. **Cuidado com vírgulas**: todo item numa lista precisa de vírgula após, exceto o último
4. Salve o arquivo. O app recarrega automaticamente.
5. Se quebrar, o app mostra uma mensagem em português explicando onde está o erro.

## Build for Production

```bash
npm run build
```

O output vai para `dist/`. Faça deploy do conteúdo de `dist/` para Vercel, Netlify ou GitHub Pages.
