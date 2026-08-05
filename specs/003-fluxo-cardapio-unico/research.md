# Research & Decisions: Fluxo Único de Cardápio

**Feature**: `003-fluxo-cardapio-unico`
**Date**: 2025-07-30

## Decisions

### 1. Página Única vs Tabs

**Decision**: Substituir tabs horizontais por página única com **seções verticais** para cada categoria.

**Rationale**: O usuário quer ver todas as categorias de uma vez. Tabs escondem conteúdo e forçam cliques extras. Página única com sticky nav é um padrão consagrado em cardápios digitais (iFood, rappi).

**Implementation**: Cada categoria vira uma `<section id="categoria-{id}">` dentro de `MenuPage`. O sticky nav contém links que scrollam via `element.scrollIntoView({ behavior: 'smooth' })`.

---

### 2. Sticky Nav

**Decision**: Usar `position: sticky` CSS nativo no menu de categorias, sem bibliotecas externas.

**Rationale**: `position: sticky` é suportado em todos os browsers mobile alvo (Chrome 56+, Safari 13+). Tailwind tem utilitário `sticky top-0 z-50` nativo. Zero dependências extras.

---

### 3. Detecção de Categoria Ativa

**Decision**: Usar `IntersectionObserver` para detectar qual seção está visível e destacar o link correspondente.

**Rationale**: `IntersectionObserver` é performático (não bloqueia a main thread), nativo em todos os browsers alvo, e mais preciso que calcular `scrollTop` manualmente. A alternativa (`getBoundingClientRect` + `scroll` event) causa layout thrashing.

**Threshold**: `rootMargin: '-40% 0px -55% 0px'` — considera a seção "ativa" quando seu topo está nos primeiros 40% da viewport (abaixo do sticky nav).

---

### 4. Seletor de Sabores Unificado

**Decision**: `FlavorSelector` recebe **todos** os sabores do cardápio (não apenas de uma categoria) e os organiza em seções visuais com badges/separadores.

**Rationale**: Para permitir seleção cross-categoria, o seletor precisa mostrar todos os sabores simultaneamente. O agrupamento visual (separadores com nome da categoria) mantém a usabilidade.

**Implementation**: `FlavorSelector` recebe `SaboresAgrupados = { categoria: Categoria; sabores: Sabor[] }[]`. Cada grupo renderiza um cabeçalho com nome da categoria + preço base. Os cards de sabor exibem um badge com o nome da categoria.

---

### 5. PizzaBuilder Desacoplado

**Decision**: `PizzaBuilder` deixa de receber uma `categoria: Categoria` única e passa a receber todo o `menu`. O botão "Montar Pizza" é único, não por categoria.

**Rationale**: Com a seleção cross-categoria, não faz sentido ter um PizzaBuilder por categoria. Agora há UM único ponto de entrada que abre o seletor unificado.

**Before**: `categoria.sabores.map(s => <PizzaCard ... />)`
**After**: `menu.categorias.map(cat => <GroupedSabores categoria={cat} sabores={menu.sabores.filter(s => s.categoria_id === cat.id)} />)`

---

### 6. Nomenclatura das Categorias

**Decision**: Usar os nomes definidos pelo stakeholder no menu.json: **Simples** (R$30), **Especiais** (R$35), **Sensacionais** (R$40).

**Rationale**: O menu.json pode ter `id: "tradicionais"` mas o `nome` deve ser `"Simples"` conforme o stakeholder. Se necessário, apenas o `nome` da categoria é alterado no JSON.

---

## No-Go Decisions

| Abordagem | Motivo da rejeição |
|-----------|-------------------|
| Scroll spy com jQuery ou lib externa | Overkill — IntersectionObserver nativo resolve |
| Multi-página com React Router | Viola requisito de "tudo na mesma página" |
| Modal grande para montagem pizza | Pior usabilidade mobile — preferível bottom sheet ou overlay |
| Categoria Simples separada de Tradicionais | Apenas 3 categorias: Simples, Especiais, Sensacionais |
