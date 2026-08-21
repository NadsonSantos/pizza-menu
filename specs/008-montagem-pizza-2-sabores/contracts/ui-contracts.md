# UI Contracts — Montagem de Pizza (008)

Contratos de interface entre os componentes desta feature. São a ponte entre spec (comportamento) e código (implementação).

## 1. `ThirdFlavorModal` (novo componente)

**Localização**: `src/components/ThirdFlavorModal.tsx`

```ts
interface ThirdFlavorModalProps {
  sabor: Sabor;          // o 3º sabor candidato (não incluído ainda)
  onConfirm: () => void; // "Adicionar" → inclui o sabor e aplica + R$ 5,00
  onCancel: () => void;  // "Cancelar" (ou backdrop click) → nada muda
}
```

**Comportamento contratual**:
- Renderiza mensagem informando "a pizza comporta até 2 sabores como padrão; o 3º sabor possui adicional de R$ 5,00".
- Dois botões: **Cancelar** e **Adicionar** (ordem e destaque visual: "Adicionar" como ação primária `bg-brand-500`, "Cancelar" como secundária).
- Backdrop click ≡ `onCancel`.
- Legível/acionável a partir de 320px (SC-004).
- Mesmo padrão visual de modal do `PizzaBuilder` (`fixed inset-0 z-50 bg-black/40`, painel `bg-white rounded-2xl`; em mobile `items-end`, em `sm` centralizado).

## 2. `FlavorSelector` — transição 2 → 3 sabores

**Contrato de fluxo** (no `handleToggle`):
- `selected.length === 2` + toque em sabor **não selecionado** → NÃO adiciona; emite abertura do `ThirdFlavorModal` com `sabor` = candidato.
- `onConfirm` → `setSelected([...prev, sabor])` (o cálculo de preço via `calcularPrecoPizza` reflete o + R$ 5,00 automaticamente).
- `onCancel` → seleção e preço inalterados.
- `selected.length === 3` + toque em sabor não selecionado → bloqueado (botões `disabled`), com mensagem "máximo de 3 sabores" visível (FR-007).

## 3. Indicador de contagem — textos contratuais

| `selected.length` | Texto do indicador |
|---|---|
| 0 | "Inclui até 2 sabores como padrão" |
| 1 | "1 sabor • até 2 no padrão" |
| 2 | "2 sabores (padrão) • 3º sabor + R$ 5,00" |
| 3 | "3º sabor + R$ 5,00 aplicado • máximo 3 sabores" |

*(O texto exato pode ser ajustado na implementação, desde que comunique "2 padrão / 3º + R$ 5,00".)*

## 4. Rolagem automática (US4)

**Contrato**:
- Cada card de sabor em `FlavorSelector` expõe `id={`sabor-${sabor.id}`}`.
- Ao montar com `preselectedSabor` definido, rola **uma única vez** até `#sabor-<id>` com `scrollIntoView({ behavior: 'smooth', block: 'center' })`.
- `scroll-mt` no card compensa a altura do indicador sticky (evita esconder o sabor atrás dele — edge case da spec).
- Sem `preselectedSabor` → inicia no topo (sem rolagem).
- Rolagem manual posterior não é interrompida (guard `hasAutoScrolled`).

## 5. `PizzaBuilder` / `MenuPage` — sem quebra de contrato

- `PizzaBuilder` continua recebendo `preselectedSabor?: Sabor` e repassando ao `FlavorSelector` (inalterado).
- `MenuPage` continua fazendo `setPreselectedSabor(s); setPizzaBuilderOpen(true)` (inalterado).
- `onConfirm(sabores, observacao)` do `FlavorSelector` e `handleConfirm` do `PizzaBuilder` permanecem com a mesma assinatura.
