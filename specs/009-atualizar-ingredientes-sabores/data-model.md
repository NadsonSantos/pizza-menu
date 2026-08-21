# Data Model — Atualização de Ingredientes dos Sabores (009)

Esta feature **não altera** nenhuma estrutura de dados. A forma do `menu.json` e os tipos em `src/types/menu.ts` permanecem idênticos — apenas os **valores** do campo `descricao` mudam.

## Entidade existente (inalterada em estrutura)

### `Sabor` (`src/types/menu.ts` / `public/menu.json`)
- `id: string` — identificador estável; **chave do mapeamento** da nova descrição (inalterado)
- `nome: string` — inalterado ("4 Queijos" continua "4 Queijos"; "3 Queijos" continua "3 Queijos")
- `descricao: string` — **campo alterado**: recebe a lista de ingredientes normalizada em caixa baixa (ver `contracts/data-contract.md`)
- `imagem: string` — inalterado
- `categoria_id: string` — inalterado

## Regras de validação (derivadas da spec)

- Todos os 32 `id`s existentes em `menu.json` devem receber exatamente a `descricao` nova mapeada no data-contract (SC-001).
- Nenhum outro campo (`id`, `nome`, `categoria_id`, `imagem`, preços, `pizzaria`, `categorias`, `bebidas`) pode mudar (SC-002, FR-002, FR-003).
- Texto em caixa baixa, com `,` + espaço como separador e conjunção "e" minúscula (FR-005).
- `menu.json` deve permanecer JSON válido após a edição (SC-004).

## Contagem de sabores

| Categoria | Quantidade |
|---|---|
| tradicionais | 13 |
| especiais | 16 |
| sensacionais | 3 |
| **Total** | **32** |

A contagem casa 1:1 com o array `sabores` atual de `menu.json` — nenhum sabor é adicionado nem removido.
