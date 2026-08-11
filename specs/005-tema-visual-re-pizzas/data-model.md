# Data Model: Tema Visual Rê Pizza's

## Overview

Esta feature não introduz novas entidades de banco de dados ou APIs. As alterações são puramente de apresentação: design tokens CSS, estado efêmero de UI (splash), e um campo de dados estático.

## Design Tokens (CSS)

### Brand Palette

| Token | Hex | Tailwind Class Pattern |
|-------|-----|----------------------|
| `--color-brand-50` | #FFF6EC | `bg-brand-50`, `text-brand-50`, `border-brand-50` |
| `--color-brand-100` | #FDE4CE | `bg-brand-100`, ... |
| `--color-brand-200` | #FAC89A | ... |
| `--color-brand-300` | #F7AB65 | ... |
| `--color-brand-400` | #F48F32 | ... |
| `--color-brand-500` | #EF8A1F | Primary: buttons, links, active borders |
| `--color-brand-600` | #C96F16 | Hover states |
| `--color-brand-700` | #A05410 | Text on light backgrounds |
| `--color-brand-800` | #783C0F | Accent elements |
| `--color-brand-900` | #502807 | High-contrast typography |

### Accent Palette (Illustration/Destaque)

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-accent-cheese` | #F6C453 | Badges, ilustrações |
| `--color-accent-pepperoni` | #D8492F | Indicadores |
| `--color-accent-tomato` | #E2664A | Detalhes |
| `--color-accent-basil` | #5B8C4A | Selos |

## Splash State (sessionStorage)

| Key | Type | Values | Lifecycle |
|-----|------|--------|-----------|
| `splash_shown` | `string` | `"1"` ou ausente | Criado após fade-out do splash; morre ao fechar a aba/navegador |

**State machine**:
```
[Page Load] → sessionStorage.getItem('splash_shown') === null?
  ├── YES → Render SplashScreen → 2s timeout → fade-out 500ms → setItem('splash_shown', '1') → Render App
  └── NO  → Render App diretamente
```

## menu.json Update

| Campo | Valor Antigo | Valor Novo |
|-------|-------------|-----------|
| `pizzaria.nome` | `"Pizza do Bairro"` | `"Rê Pizza's"` |

**Type**: `string` (já tipado em `src/types/menu.ts` como `Pizzaria.nome`)

## PWA Manifest Update

| Campo | Valor Antigo | Valor Novo |
|-------|-------------|-----------|
| `theme_color` | `#dc2626` | `#EF8A1F` |
| `manifest.name` | `"Cardápio Digital de Pizzaria"` | `"Rê Pizza's — Cardápio Digital"` |

## File Manifest

| File | Change Type | Description |
|------|------------|-------------|
| `src/index.css` | MODIFY | Add `@theme` block with brand + accent tokens |
| `src/components/SplashScreen.tsx` | CREATE | New splash component |
| `src/App.tsx` | MODIFY | Integrate SplashScreen conditionally |
| `src/components/Layout.tsx` | MODIFY | Header colors, pizzaria name from menu.json |
| `src/components/PizzaCard.tsx` | MODIFY | `red-*` → `brand-*` (2 occurrences) |
| `src/components/FlavorSelector.tsx` | MODIFY | `red-*` → `brand-*` (5 occurrences) |
| `src/components/PaymentSelector.tsx` | MODIFY | `red-*` → `brand-*` (2 occurrences) |
| `src/components/CartBadge.tsx` | MODIFY | `red-*` → `brand-*` (1 occurrence) |
| `src/components/CartItem.tsx` | MODIFY | `red-*` → `brand-*` (1 occurrence) |
| `src/components/CartSummary.tsx` | MODIFY | `red-*` → `brand-*` (1 occurrence) |
| `src/components/DeliveryToggle.tsx` | MODIFY | `red-*` → `brand-*` (1 occurrence) |
| `src/components/OrderSummary.tsx` | MODIFY | `red-*` → `brand-*` (1 occurrence) |
| `src/components/AddressCard.tsx` | MODIFY | `red-*` → `brand-*` (1 occurrence) |
| `src/components/DrinkCard.tsx` | MODIFY | `red-*` → `brand-*` (2 occurrences) |
| `src/components/EmptyCart.tsx` | MODIFY | `red-*` → `brand-*` (1 occurrence) |
| `src/pages/MenuPage.tsx` | MODIFY | `red-*` → `brand-*` (7 occurrences) |
| `src/pages/CartPage.tsx` | MODIFY | `red-*` → `brand-*` (1 occurrence) |
| `src/pages/AddressPage.tsx` | MODIFY | `red-*` → `brand-*` (12 occurrences) |
| `public/menu.json` | MODIFY | `pizzaria.nome` → "Rê Pizza's" |
| `vite.config.ts` | MODIFY | `theme_color` → #EF8A1F, manifest name |
