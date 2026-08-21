# Data Contract — Atualização de Ingredientes (009)

Contrato dos novos valores do campo `descricao` de cada sabor em `public/menu.json`. Fonte: tabela oficial fornecida pelo dono, **normalizada para caixa baixa (minúsculas)**, preservando conteúdo e ordem dos ingredientes.

**Regras de normalização**:
- Todo o texto em minúsculas (inclusive o primeiro caractere de cada ingrediente).
- Separador `,` seguido de espaço único; conjunção final "e" minúscula.
- Acentos preservados (orégano, pimentão, etc.).
- Mapeamento pelo `id` existente — **nenhum** `id`, `nome`, `categoria_id` ou `imagem` muda.

## Tradicionais (13)

| `id` | `descricao` (novo) |
|---|---|
| `baiana` | mussarela, calabresa ralada e pimenta |
| `bacon` | mussarela e bacon frito |
| `batata-palha` | mussarela e batata palha |
| `calabresa` | calabresa, mussarela e orégano |
| `catupiry` | mussarela e catupiry |
| `cheddar` | mussarela e cheddar |
| `frango` | mussarela e frango |
| `milho` | mussarela e milho |
| `mussarela` | mussarela e orégano |
| `lombinho` | mussarela e lombinho |
| `portuguesa` | mussarela, presunto, cebola, ovos, pimentão e azeitona |
| `presunto` | mussarela e presunto |
| `romeu-e-julieta` | mussarela e goiabada |

## Especiais (16)

| `id` | `descricao` (novo) |
|---|---|
| `atum` | mussarela, atum, cebola e azeitonas |
| `atum-catupiry` | mussarela, atum, catupiry, cebola e azeitonas |
| `atum-cheddar` | mussarela, atum, cheddar, cebola e azeitonas |
| `bacon-cheddar` | mussarela, bacon e cheddar |
| `bacon-catupiry` | mussarela, bacon e catupiry |
| `calacheddar` | mussarela, calabresa e cheddar |
| `calabacon` | mussarela, calabresa e bacon |
| `frango-catupiry` | mussarela, frango e catupiry |
| `frango-cheddar` | mussarela, frango e cheddar |
| `frango-palha` | mussarela, frango e batata palha |
| `frango-milho` | mussarela, frango e milho |
| `franbacon` | mussarela, frango e bacon |
| `mexicana` | mussarela, bacon, calabresa, pimentão, pimenta e orégano |
| `moda-da-casa` | mussarela, calabresa, bacon, milho, cebola e azeitona |
| `peito-de-peru` | mussarela e peito de peru |
| `tres-queijos` | mussarela, catupiry e cheddar |

## Sensacionais (3)

| `id` | `descricao` (novo) |
|---|---|
| `carne-seca` | mussarela, carne desfiada, cebola e orégano |
| `pepperoni` | mussarela, pepperoni e orégano |
| `quatro-queijos` | mussarela, provolone, catupiry e queijo parmesão |

**Total: 32 sabores.** Nenhum outro campo de `menu.json` é alterado.
