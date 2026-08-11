# Quickstart: Tema Visual Rê Pizza's

## Pré-requisitos

- Node.js 18+
- `npm install` (dependências já instaladas)
- Imagem `public/splash_logo.jpeg` presente (já verificada)

## Ordem de Implementação

### Fase 1: Fundação (US1 — Sistema de Cores)

1. **Definir tokens no `src/index.css`**:
   ```css
   @import "tailwindcss";
   
   @theme {
     --color-brand-50: #FFF6EC;
     --color-brand-100: #FDE4CE;
     --color-brand-200: #FAC89A;
     --color-brand-300: #F7AB65;
     --color-brand-400: #F48F32;
     --color-brand-500: #EF8A1F;
     --color-brand-600: #C96F16;
     --color-brand-700: #A05410;
     --color-brand-800: #783C0F;
     --color-brand-900: #502807;
     --color-accent-cheese: #F6C453;
     --color-accent-pepperoni: #D8492F;
     --color-accent-tomato: #E2664A;
     --color-accent-basil: #5B8C4A;
   }
   ```

2. **Verificar**: `npm run dev` → inspecionar CSS no DevTools → confirmar `--color-brand-500: #EF8A1F`.

### Fase 2: Substituição em Massa (US2 — Atualização de Componentes)

3. **Substituir `red-*` → `brand-*`** em 13 arquivos, conforme mapeamento da spec:
   - `bg-red-600` → `bg-brand-500`
   - `hover:bg-red-700` → `hover:bg-brand-600`
   - `border-red-500` → `border-brand-500`
   - `bg-red-50` → `bg-brand-50`
   - `text-red-600` → `text-brand-600`
   - `text-red-700` → `text-brand-700`
   - `ring-red-500/30` → `ring-brand-500/30`
   - `ring-red-500/40` → `ring-brand-500/40`
   - `focus:ring-red-500/40` → `focus:ring-brand-500/40`
   - `focus:border-red-400` → `focus:border-brand-400`
   - `bg-gray-50` (Layout) → `bg-brand-50`

4. **Atualizar `vite.config.ts`**: `theme_color: '#dc2626'` → `'#EF8A1F'`

5. **Verificar**: `grep -r 'red-' src/` → zero resultados. `npm run build` → exit 0.

### Fase 3: Splash Page (US3)

6. **Criar `src/components/SplashScreen.tsx`**:
   - Renderiza logo `public/splash_logo.jpeg` centralizada
   - `sessionStorage` flag `splash_shown`
   - Timeout 2s + fade-out CSS 500ms
   - Fallback textual "Rê Pizza's" em `onError`

7. **Integrar em `App.tsx`**: wrapper condicional que mostra SplashScreen ou `<Routes>`.

8. **Verificar**: Abrir em janela anônima → splash visível → fade → cardápio. Navegar via Link interno → sem splash.

### Fase 4: Nome da Pizzaria (US4)

9. **Atualizar `public/menu.json`**: `"nome": "Pizza do Bairro"` → `"nome": "Rê Pizza's"`

10. **Atualizar `Layout.tsx`**: Header mostra nome do `menu.json` (via contexto), não hardcoded "🍕 Cardápio Digital".

### Verificação Final

```bash
npm run build        # Deve passar sem erros
grep -r 'red-' src/  # Deve retornar zero resultados
```

Navegar visualmente por todas as páginas (Menu, Carrinho, Checkout, Endereços) e confirmar ausência de elementos vermelhos.
