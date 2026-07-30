# Quickstart: Refatoração Pizzas e Sabores

**Feature**: `002-refatoracao-pizzas-sabores`
**Date**: 2025-07-30

## Migration Guide (v1 → v2 do menu.json)

### O que muda

| Antes (v1) | Depois (v2) |
|------------|------------|
| Sabores aninhados em `categorias[].sabores[]` | `sabores[]` plano com `categoria_id` |
| Preço implícito (categoria pai) | Preço explícito via `categoria_id` |
| 12 sabores | 32 sabores |

### Como migrar

1. Abra `public/menu.json`
2. Remova o array `"sabores"` de dentro de cada categoria
3. Adicione `"sabores": [...]` no nível raiz (após `"categorias"`)
4. Para cada sabor, adicione `"categoria_id": "<id da categoria>"`
5. Remova qualquer campo `"preco"` dentro dos sabores
6. Atualize a lista de sabores para os 32 novos

## Verification

```bash
# Type check
npx tsc --noEmit

# Build
npm run build

# Validate menu.json
python3 -c "
import json
with open('public/menu.json') as f:
    d = json.load(f)
cats = {c['id'] for c in d['categorias']}
for s in d['sabores']:
    assert s['categoria_id'] in cats, f\"{s['nome']}: categoria '{s['categoria_id']}' não existe\"
    assert 'preco' not in s, f\"{s['nome']}: sabor não pode ter preco\"
print('OK —', len(d['sabores']), 'sabores validados')
"
```

## Test Cases (manual)

```typescript
// 2 sabores Trad → R$30
calcularPrecoPizza([calabresa, portuguesa], categorias) // { total: 30 }

// 2 sabores (Trad + Esp) → R$35
calcularPrecoPizza([calabresa, frangoCatupiry], categorias) // { total: 35 }

// 3 sabores (Trad + Esp + Sens) → R$45
calcularPrecoPizza([calabresa, frangoCatupiry, quatroQueijos], categorias) // { total: 45 }

// 3 sabores (Esp + Esp + Trad) → R$40
calcularPrecoPizza([frangoCatupiry, portuguesa, baiana], categorias) // { total: 40 }
```
