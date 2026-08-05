# Quickstart: Fluxo Único de Cardápio

**Feature**: `003-fluxo-cardapio-unico`
**Date**: 2025-07-30

## Migration Guide

### O que muda visualmente

| Antes | Depois |
|-------|--------|
| Tabs horizontais no topo | Sticky nav com scroll suave |
| Apenas uma categoria visível por vez | Todas as categorias visíveis |
| PizzaBuilder por categoria | Seletor único com todos os sabores |
| Cards sem badge de categoria | Cards com nome da categoria visível |

### O que não muda

- Preços, regras de negócio, limite de 3 sabores, R$5 no 3º
- Carrinho, checkout, WhatsApp, PWA
- menu.json, types, services

## Verification

```bash
npm run build    # Build sem erros
```

Testes manuais:
```
1. Abrir app → ver 3 seções (Simples, Especiais, Sensacionais)
2. Clicar "Sensacionais" no sticky nav → scroll suave
3. Scroll manual → destaque no nav acompanha
4. Clicar "Montar Pizza" → ver sabores de todas as categorias
5. Selecionar sabores de 2+ categorias → preço correto
6. Testar carrinho, checkout, WhatsApp → funcionando
```
