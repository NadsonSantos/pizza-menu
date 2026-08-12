# Quickstart — Montagem de Pizza: 2 Sabores Padrão / 3º Excepcional

Guia de implementação e verificação para a feature 008.

## Ambiente

```bash
# a partir da raiz do projeto, na branch da feature
git checkout 008-montagem-pizza-2-sabores
npm install
```

## Arquivos afetados

| Arquivo | Mudança |
|---------|---------|
| `src/components/ThirdFlavorModal.tsx` | **NOVO** — modal de confirmação do 3º sabor |
| `src/components/FlavorSelector.tsx` | labels (US2), fluxo 2→3 (US1), posicionamento do indicador (US3), rolagem automática (US4) |
| `src/components/PizzaBuilder.tsx` | (sem mudança obrigatória; apenas se o modal do 3º for orquestrado aqui) |
| `src/pages/MenuPage.tsx` | (sem mudança obrigatória) |
| `src/components/FlavorSelector.test.tsx` | **NOVO** — testes de componente (US1/US2/US4) |

**Não tocar**: `src/utils/pricing.ts` (regra de preço), `src/types/menu.ts`, `public/menu.json`.

## Passo a passo sugerido

1. **US2 (labels)** — editar o indicador em `FlavorSelector.tsx` conforme `contracts/ui-contracts.md` §3.
2. **US3 (posicionamento)** — ajustar classes do indicador (`FlavorSelector.tsx:32-44`) para eliminar o espaçamento superior que o faz flutuar sobre os cards.
3. **US1 (modal)** — criar `ThirdFlavorModal` e interceptar `handleToggle` na transição 2→3; mensagem de "máximo 3 sabores" para o 4º.
4. **US4 (rolagem)** — adicionar `id={`sabor-${id}`}` aos cards e o `useEffect` de rolagem única ao pré-selecionado.
5. **Testes** — cobrir: modal aparece na transição 2→3; "Adicionar" inclui e encarece R$ 5,00; "Cancelar" não muda nada; 4º sabor bloqueado; label comunica regra; rolagem automática só na abertura.

## Verificação

```bash
npm run test       # vitest run — todos os testes passam
npm run build      # tsc -b && vite build — build de produção sem erros (SC-006)
```

### Checagem manual (mobile-first, 375px)

- Montar pizza com 2 sabores e tocar num 3º → modal aparece com "até 2 sabores / 3º + R$ 5,00".
- "Cancelar" → nada muda; "Adicionar" → 3º entra, preço sobe R$ 5,00.
- Com 3 sabores, tentar 4º → bloqueado com mensagem de máximo.
- Indicador não sobrepõe os cards em 320px+ (SC-004).
- Abrir montagem a partir de um sabor distante do topo (ex.: Sensacionais) → lista rola e o sabor fica visível em < 1s (SC-005).

## Pitfalls

- O `useEffect` de rolagem deve rodar **após** a montagem dos cards (dependência em `grupos`/`menu` já resolvida), e apenas uma vez — senão rouba a rolagem manual do usuário.
- O indicador é `sticky` dentro do container `overflow-y-auto` do `PizzaBuilder`; `scroll-mt` no card deve cobrir a altura do indicador para o sabor não ficar escondido.
- Não recalcular preço manualmente: sempre derivar de `calcularPrecoPizza` para manter a regra de negócio intacta.
