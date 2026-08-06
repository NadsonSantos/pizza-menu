# menu.json: Nota sobre Categoria Simples

**Feature**: `003-fluxo-cardapio-unico`

O `menu.json` atual usa o nome `"Tradicionais"` para a primeira categoria. O stakeholder quer `"Simples"`.

**Se for alterar**, mude APENAS o campo `nome` na categoria:

```diff
{
  "categorias": [
-    { "id": "tradicionais", "nome": "Tradicionais", "preco": 30.00 },
+    { "id": "tradicionais", "nome": "Simples", "preco": 30.00 },
    { "id": "especiais", "nome": "Especiais", "preco": 35.00 },
    { "id": "sensacionais", "nome": "Sensacionais", "preco": 40.00 }
  ]
}
```

O `id` permanece `"tradicionais"` para não quebrar referências nos sabores. Apenas o nome de exibição muda.
