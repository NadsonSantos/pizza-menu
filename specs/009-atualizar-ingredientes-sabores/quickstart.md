# Quickstart — Atualização de Ingredientes dos Sabores (009)

Guia de implementação e verificação para a feature 009.

## Ambiente

```bash
# a partir da raiz do projeto, na branch da feature
git checkout 009-atualizar-ingredientes-sabores
npm install
```

## Arquivo afetado

| Arquivo | Mudança |
|---------|---------|
| `public/menu.json` | **ÚNICO** — campo `descricao` dos 32 sabores substituído pelos valores de `contracts/data-contract.md` (caixa baixa) |

**Não tocar**: `src/` (nenhum arquivo), preços, `categorias`, `pizzaria`, `bebidas`, `nome`/`id`/`categoria_id`/`imagem` dos sabores.

## Passo a passo

1. Abrir `public/menu.json` e localizar o array `sabores`.
2. Para cada um dos 32 sabores, substituir o valor de `descricao` pelo texto correspondente na tabela de `contracts/data-contract.md` (já em caixa baixa).
3. Garantir que nenhum outro campo foi alterado acidentalmente.
4. Validar que o arquivo continua JSON válido.

## Verificação

```bash
npm run test       # vitest run — todos os testes passam (SC-003)
npm run build      # tsc -b && vite build — build de produção sem erros (SC-003)
node -e "JSON.parse(require('fs').readFileSync('public/menu.json','utf8')); console.log('JSON válido')"   # SC-004
```

### Checagem manual (conferência dos 32 valores)

- Conferir cada `descricao` contra `contracts/data-contract.md` (13 tradicionais + 16 especiais + 3 sensacionais = 32).
- Conferir que nomes divergentes seguem mapeados por `id` sem renomear: "4 Queijos" (`quatro-queijos`) e "3 Queijos" (`tres-queijos`).
- Abrir o cardápio e a montagem e confirmar que o texto aparece em minúsculas (SC-001).

## Pitfalls

- Não confundir `descricao` (o que muda) com `nome` (o que NÃO muda) — a tabela oficial usa "QUATRO QUEIJOS"/"3 QUEIJOS", mas o `nome` no app continua "4 Queijos"/"3 Queijos".
- Os ":" ao final dos nomes na fonte (ex.: "BAIANA:") não entram nos dados.
- Preservar acentos e a conjunção final "e" minúscula ("mussarela, calabresa ralada e pimenta").
- Não reordenar ingredientes: manter a ordem exata da tabela oficial.
