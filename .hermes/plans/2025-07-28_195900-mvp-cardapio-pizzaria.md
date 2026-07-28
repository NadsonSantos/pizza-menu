# MVP Cardápio Digital de Pizzaria — Implementation Plan

> **For Hermes:** Use spec-kit workflow for SDD; each task references the spec at `specs/001-mvp-cardapio-pizzaria/spec.md`.

**Goal:** Construir um PWA de cardápio digital onde o cliente monta pizzas, gerencia carrinho e finaliza o pedido via WhatsApp — 100% estático, sem backend.

**Architecture:** React 18 + Vite 5 SPA com 3 rotas (Menu → Carrinho → Finalizar). Estado centralizado via Context + useReducer. Dados do cardápio em `public/menu.json` estático e tipado. PWA via vite-plugin-pwa (Workbox) com estratégia cache-first. Tailwind CSS para estilização mobile-first.

**Tech Stack:** React 18, Vite 5, TypeScript 5 (strict), Tailwind CSS 3, vite-plugin-pwa, Workbox

**Spec Reference:** `specs/001-mvp-cardapio-pizzaria/spec.md` (20 FRs, 6 user stories)

---

## Architecture Overview

### Routing

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | `MenuPage` | Cardápio com categorias, seleção de sabores |
| `/carrinho` | `CartPage` | Gestão de itens, quantidades, observações |
| `/finalizar` | `CheckoutPage` | Entrega/retirada, pagamento, resumo, WhatsApp |

### State Shape (useReducer)

```typescript
interface CartState {
  items: CartItem[];          // itens no carrinho
  delivery: 'entrega' | 'retirada';
  payment: 'dinheiro' | 'cartao' | 'pix' | null;
  troco: string;              // só relevante se payment === 'dinheiro'
}

interface CartItem {
  id: string;                 // uuid gerado ao adicionar
  tipo: 'pizza' | 'bebida';
  nome: string;               // nome da pizza ou bebida
  sabores: Sabor[];           // apenas para pizzas
  precoUnitario: number;      // preço calculado por unidade
  quantidade: number;
  observacao: string;
}
```

### menu.json Schema

```typescript
interface MenuData {
  pizzaria: {
    nome: string;
    whatsapp: string;        // DDI+DDD+NUMERO sem espaços
    taxa_entrega: number;
  };
  categorias: Categoria[];
  bebidas: Bebida[];
}

interface Categoria {
  id: string;
  nome: string;              // "Tradicionais Simples"
  tipo: 'pizza';
  preco: number;             // preço base da categoria
  sabores: Sabor[];
}

interface Sabor {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;            // caminho relativo: "imagens/mussarela.jpg"
}

interface Bebida {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
}
```

### Price Calculation (Core Algorithm)

```typescript
function calcularPrecoPizza(sabores: Sabor[]): number {
  if (sabores.length < 1 || sabores.length > 3) {
    throw new Error('Pizza deve ter de 1 a 3 sabores');
  }
  const precosCategoria = sabores.map(s => s.categoria.preco);
  const maiorPreco = Math.max(...precosCategoria);
  const acrescimoTerceiro = sabores.length === 3 ? 5 : 0;
  return maiorPreco + acrescimoTerceiro;
}
```

### WhatsApp Message Format

```
🍕 *Pedido — Pizzaria {nome}*

*Itens:*
2x Pizza Grande (Mussarela, Calabresa) — R$ 30,00
   Obs: sem cebola
1x Pepsi Lata 350ml — R$ 8,00

*Subtotal:* R$ 68,00
*Taxa de entrega:* R$ 5,00
*Total:* R$ 73,00

*Entrega:* Sim
*Pagamento:* Dinheiro (Troco para R$ 100)
```

### PWA Strategy

- **vite-plugin-pwa** com Workbox (`generateSW`)
- **Cache First** para assets estáticos (JS, CSS, imagens, `menu.json`)
- **Manifest**: `display: standalone`, `theme_color: #ef4444` (vermelho pizza), `orientation: portrait`
- **Service Worker**: pre-cache automático no build, atualização com skipWaiting + clientsClaim

---

## Phase 1: Scaffolding & Configuration (Tasks 1–6)

### Task 1: Create Vite + React + TypeScript project

**Objective:** Scaffold the project with Vite, install all dependencies.

**Files:**
- Create: project scaffold via `npm create vite@latest`

**Steps:**

```bash
cd /Users/mac/projects/Personal/pizza-menu
npm create vite@latest . -- --template react-ts
npm install
```

**Verification:**
```bash
npm run dev
# Should open at localhost:5173 with Vite + React default page
```

---

### Task 2: Install and configure Tailwind CSS

**Objective:** Set up Tailwind CSS with mobile-first defaults.

**Files:**
- Modify: `tailwind.config.js` (scaffolded)
- Modify: `src/index.css` → replace with Tailwind directives
- Create: `postcss.config.js` (auto by tailwind init)

**Steps:**

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Configure `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Replace `src/index.css`:
```css
@import "tailwindcss";
```

Configure mobile-first breakpoint in CSS or config.

**Verification:**
```bash
npm run dev
# Add a div with className="text-red-500 bg-gray-100 p-4" in App.tsx
# Verify styles apply
```

---

### Task 3: Install remaining dependencies

**Objective:** Install React Router and vite-plugin-pwa.

```bash
npm install react-router-dom
npm install -D vite-plugin-pwa
```

**Verification:**
```bash
npm ls react-router-dom vite-plugin-pwa
```

---

### Task 4: Configure vite-plugin-pwa

**Objective:** Set up PWA manifest and Workbox service worker.

**Files:**
- Modify: `vite.config.ts`

```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Cardápio Digital',
        short_name: 'Cardápio',
        description: 'Cardápio digital de pizzaria',
        theme_color: '#dc2626',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,json}'],
        runtimeCaching: [
          {
            urlPattern: /\/menu\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'menu-cache',
              expiration: { maxEntries: 1 },
            },
          },
        ],
      },
    }),
  ],
})
```

**Verification:**
```bash
npm run build
# Check dist/ for sw.js, manifest.webmanifest, workbox-*.js
```

---

### Task 5: Create TypeScript types from menu.json schema

**Objective:** Define all TypeScript interfaces for the menu data structure.

**Files:**
- Create: `src/types/menu.ts`

```typescript
export interface MenuData {
  pizzaria: PizzariaInfo;
  categorias: Categoria[];
  bebidas: Bebida[];
}

export interface PizzariaInfo {
  nome: string;
  whatsapp: string;
  taxa_entrega: number;
}

export interface Categoria {
  id: string;
  nome: string;
  tipo: 'pizza';
  preco: number;
  sabores: Sabor[];
}

export interface Sabor {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
}

export interface Bebida {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
}
```

**Verification:**
```bash
npx tsc --noEmit
# No errors for types file
```

---

### Task 6: Create cart types and reducer

**Objective:** Define cart state shape, actions, and reducer logic.

**Files:**
- Create: `src/types/cart.ts`
- Create: `src/context/CartContext.tsx`

`src/types/cart.ts`:
```typescript
import { Sabor } from './menu';

export interface CartItem {
  id: string;
  tipo: 'pizza' | 'bebida';
  nome: string;
  sabores: Sabor[];
  precoUnitario: number;
  quantidade: number;
  observacao: string;
}

export type DeliveryMode = 'entrega' | 'retirada';
export type PaymentMethod = 'dinheiro' | 'cartao' | 'pix';

export interface CartState {
  items: CartItem[];
  delivery: DeliveryMode;
  payment: PaymentMethod | null;
  troco: string;
}

export type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QUANTITY'; id: string; quantidade: number }
  | { type: 'SET_DELIVERY'; mode: DeliveryMode }
  | { type: 'SET_PAYMENT'; method: PaymentMethod }
  | { type: 'SET_TROCO'; troco: string }
  | { type: 'CLEAR_CART' };
```

**Verification:**
```bash
npx tsc --noEmit
```

---

## Phase 2: Core Infrastructure (Tasks 7–10)

### Task 7: Create CartContext provider

**Objective:** Implement the Context + useReducer cart state management.

**Files:**
- Modify: `src/context/CartContext.tsx`

```typescript
import { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartState, CartAction, CartItem } from '../types/cart';

const initialState: CartState = {
  items: [],
  delivery: 'entrega',
  payment: null,
  troco: '',
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.item] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, quantidade: action.quantidade } : i
        ),
      };
    case 'SET_DELIVERY':
      return { ...state, delivery: action.mode };
    case 'SET_PAYMENT':
      return { ...state, payment: action.method, troco: action.method !== 'dinheiro' ? '' : state.troco };
    case 'SET_TROCO':
      return { ...state, troco: action.troco };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  subtotal: number;
  taxaEntrega: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children, taxaEntrega }: { children: ReactNode; taxaEntrega: number }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = { ...item, id: crypto.randomUUID() };
    dispatch({ type: 'ADD_ITEM', item: newItem });
  };

  const subtotal = state.items.reduce((sum, i) => sum + i.precoUnitario * i.quantidade, 0);
  const deliveryTax = state.delivery === 'entrega' ? taxaEntrega : 0;
  const total = subtotal + deliveryTax;
  const itemCount = state.items.reduce((sum, i) => sum + i.quantidade, 0);

  return (
    <CartContext.Provider value={{ state, dispatch, addItem, subtotal, taxaEntrega: deliveryTax, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
```

**Verification:**
```bash
npx tsc --noEmit
```

---

### Task 8: Create price calculation utility

**Objective:** Implement core business logic for pizza pricing.

**Files:**
- Create: `src/utils/pricing.ts`

```typescript
import { Sabor } from '../types/menu';

export function calcularPrecoPizza(sabores: Sabor[], categoriaPrecos: Record<string, number>): {
  precoBase: number;
  acrescimo: number;
  total: number;
} {
  if (sabores.length < 1 || sabores.length > 3) {
    throw new Error('Pizza deve ter de 1 a 3 sabores');
  }

  const precosSabores = sabores.map(s => categoriaPrecos[s.categoria_id] ?? 0);
  const precoBase = Math.max(...precosSabores);
  const acrescimo = sabores.length === 3 ? 5 : 0;
  const total = precoBase + acrescimo;

  return { precoBase, acrescimo, total };
}

export function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}
```

**Verification:** Write unit test inline:
```typescript
// Test: 2 sabores, Tradicional(R$30) + Especial(R$35) → R$35
const result = calcularPrecoPizza([saborTradicional, saborEspecial], precos);
assert(result.total === 35);
```

---

### Task 9: Create WhatsApp message formatter

**Objective:** Transform cart state into formatted WhatsApp message text.

**Files:**
- Create: `src/utils/whatsapp.ts`

```typescript
import { CartState, CartItem } from '../types/cart';
import { formatCurrency } from './pricing';

export function formatWhatsAppMessage(
  state: CartState,
  pizzariaNome: string,
  subtotal: number,
  taxaEntrega: number,
  total: number
): string {
  const lines: string[] = [];

  lines.push(`🍕 *Pedido — ${pizzariaNome}*`);
  lines.push('');
  lines.push('*Itens:*');

  for (const item of state.items) {
    const qtd = item.quantidade > 1 ? `${item.quantidade}x ` : '';
    const nome = item.tipo === 'pizza'
      ? `Pizza Grande (${item.sabores.map(s => s.nome).join(', ')})`
      : item.nome;
    lines.push(`${qtd}${nome} — ${formatCurrency(item.precoUnitario * item.quantidade)}`);
    if (item.observacao) {
      lines.push(`   Obs: ${item.observacao}`);
    }
  }

  lines.push('');
  lines.push(`*Subtotal:* ${formatCurrency(subtotal)}`);
  if (taxaEntrega > 0) {
    lines.push(`*Taxa de entrega:* ${formatCurrency(taxaEntrega)}`);
  }
  lines.push(`*Total:* ${formatCurrency(total)}`);
  lines.push('');
  lines.push(`*Entrega:* ${state.delivery === 'entrega' ? 'Sim' : 'Retirada no local'}`);
  lines.push(`*Pagamento:* ${formatPayment(state)}`);
  if (state.payment === 'dinheiro' && state.troco) {
    lines.push(`*Troco para:* R$ ${state.troco}`);
  }
  lines.push('');
  lines.push('_Obrigado pelo pedido!_');

  return lines.join('\n');
}

function formatPayment(state: CartState): string {
  const map: Record<string, string> = {
    dinheiro: 'Dinheiro',
    cartao: 'Cartão',
    pix: 'PIX',
  };
  return map[state.payment ?? ''] ?? 'Não informado';
}

export function createWhatsAppLink(whatsapp: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${whatsapp}?text=${encoded}`;
}
```

**Verification:** TypeScript compiles, manual test with sample cart data.

---

### Task 10: Create menu.json loader with error handling

**Objective:** Load and validate `menu.json` at runtime with user-friendly errors.

**Files:**
- Create: `src/utils/loadMenu.ts`

```typescript
import { MenuData } from '../types/menu';

export async function loadMenu(): Promise<MenuData> {
  try {
    const response = await fetch('/menu.json');
    if (!response.ok) {
      throw new Error(`Erro ao carregar o cardápio (HTTP ${response.status}).`);
    }
    const data: MenuData = await response.json();
    validateMenu(data);
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        'Erro ao carregar o cardápio. O arquivo menu.json está mal formatado. ' +
        'Verifique se todas as vírgulas e chaves estão corretas.'
      );
    }
    throw error;
  }
}

function validateMenu(data: MenuData): void {
  if (!data.pizzaria?.nome || !data.pizzaria?.whatsapp) {
    throw new Error('menu.json: faltam dados da pizzaria (nome, whatsapp).');
  }
  if (!Array.isArray(data.categorias) || data.categorias.length === 0) {
    throw new Error('menu.json: o campo "categorias" está vazio ou ausente.');
  }
  for (const cat of data.categorias) {
    if (!Array.isArray(cat.sabores) || cat.sabores.length === 0) {
      throw new Error(`menu.json: a categoria "${cat.nome}" não tem sabores.`);
    }
    if (typeof cat.preco !== 'number' || cat.preco <= 0) {
      throw new Error(`menu.json: preço inválido na categoria "${cat.nome}".`);
    }
  }
}
```

**Verification:** Create a sample `public/menu.json` and test load.

---

## Phase 3: Menu Page — Cardápio (Tasks 11–19)

### Task 11: Create sample menu.json

**Objective:** Create a complete sample menu.json for development and testing.

**Files:**
- Create: `public/menu.json`

```json
{
  "pizzaria": {
    "nome": "Pizza do Bairro",
    "whatsapp": "5511999999999",
    "taxa_entrega": 5.00
  },
  "categorias": [
    {
      "id": "tradicionais",
      "nome": "Tradicionais Simples",
      "tipo": "pizza",
      "preco": 30.00,
      "sabores": [
        { "id": "mussarela", "nome": "Mussarela", "descricao": "Queijo mussarela e tomate", "imagem": "" },
        { "id": "calabresa", "nome": "Calabresa", "descricao": "Calabresa fatiada com cebola", "imagem": "" },
        { "id": "marguerita", "nome": "Marguerita", "descricao": "Mussarela, tomate e manjericão", "imagem": "" }
      ]
    },
    {
      "id": "especiais",
      "nome": "Especiais",
      "tipo": "pizza",
      "preco": 35.00,
      "sabores": [
        { "id": "portuguesa", "nome": "Portuguesa", "descricao": "Presunto, ovo, cebola e ervilha", "imagem": "" },
        { "id": "frango-catupiry", "nome": "Frango com Catupiry", "descricao": "Frango desfiado com catupiry", "imagem": "" },
        { "id": "quatro-queijos", "nome": "Quatro Queijos", "descricao": "Mussarela, provolone, parmesão e gorgonzola", "imagem": "" }
      ]
    },
    {
      "id": "sensacionais",
      "nome": "Sensacionais",
      "tipo": "pizza",
      "preco": 40.00,
      "sabores": [
        { "id": "baccon", "nome": "Bacon com Cheddar", "descricao": "Bacon crocante com cheddar cremoso", "imagem": "" },
        { "id": "camarao", "nome": "Camarão Especial", "descricao": "Camarão com molho especial da casa", "imagem": "" }
      ]
    }
  ],
  "bebidas": [
    { "id": "pepsi", "nome": "Pepsi Lata 350ml", "preco": 8.00, "imagem": "" },
    { "id": "guarana", "nome": "Guaraná Antarctica Lata 350ml", "preco": 7.50, "imagem": "" }
  ]
}
```

**Verification:** JSON is valid. Run `python3 -m json.tool public/menu.json`.

---

### Task 12: Create App shell with routing

**Objective:** Set up React Router with Layout and three route pages.

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/Layout.tsx`
- Create: `src/pages/MenuPage.tsx` (placeholder)
- Create: `src/pages/CartPage.tsx` (placeholder)
- Create: `src/pages/CheckoutPage.tsx` (placeholder)
- Modify: `src/main.tsx`

`src/main.tsx`:
```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

`src/App.tsx`:
```typescript
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

export default function App() {
  return (
    <CartProvider taxaEntrega={5}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MenuPage />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/finalizar" element={<CheckoutPage />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}
```

`src/components/Layout.tsx`:
```typescript
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-red-600 text-white p-4 shadow">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🍕 Cardápio Digital</h1>
          {/* CartBadge will go here later */}
        </div>
      </header>
      <main className="max-w-lg mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
```

**Verification:** `npm run dev` — app loads at `/`, `/carrinho`, `/finalizar` with layout.

---

### Task 13: Load menu data in App and provide via context

**Objective:** Fetch menu.json on mount, handle loading/error states.

**Files:**
- Create: `src/context/MenuContext.tsx`

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuData } from '../types/menu';
import { loadMenu } from '../utils/loadMenu';

interface MenuContextValue {
  menu: MenuData | null;
  loading: boolean;
  error: string | null;
}

const MenuContext = createContext<MenuContextValue>({ menu: null, loading: true, error: null });

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMenu()
      .then(setMenu)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MenuContext.Provider value={{ menu, loading, error }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}
```

Wrap `App` with `MenuProvider` in `main.tsx`.

**Verification:** App loads, `useMenu()` returns data after fetch.

---

### Task 14: Create MenuPage with category tabs

**Objective:** Display categories as horizontal scrollable tabs, show items for selected category.

**Files:**
- Modify: `src/pages/MenuPage.tsx`

```typescript
import { useState } from 'react';
import { useMenu } from '../context/MenuContext';

export default function MenuPage() {
  const { menu, loading, error } = useMenu();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  if (loading) return <div className="text-center py-8">Carregando cardápio...</div>;
  if (error) return <ErrorDisplay message={error} />;
  if (!menu) return null;

  const allCategories = [
    ...menu.categorias.map(c => ({ id: c.id, nome: c.nome, tipo: 'pizza' as const })),
    { id: 'bebidas', nome: 'Bebidas', tipo: 'bebida' as const },
  ];

  const selected = activeCategory || allCategories[0]?.id;

  return (
    <div>
      {/* Horizontal scrollable category tabs */}
      <nav className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4">
        {allCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition
              ${selected === cat.id
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
          >
            {cat.nome}
          </button>
        ))}
      </nav>

      {/* Category content — will be expanded in later tasks */}
    </div>
  );
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      <p className="font-semibold">Erro ao carregar o cardápio</p>
      <p className="text-sm mt-1">{message}</p>
    </div>
  );
}
```

**Verification:** Tabs render, click switches active category, loading/error states show correctly.

---

### Task 15: Create PizzaCard component

**Objective:** Display a pizza sabor card with name, description, selection state.

**Files:**
- Create: `src/components/PizzaCard.tsx`

```typescript
import { Sabor } from '../types/menu';

interface PizzaCardProps {
  sabor: Sabor;
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function PizzaCard({ sabor, selected, onToggle, disabled }: PizzaCardProps) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`w-full text-left p-3 rounded-lg border-2 transition
        ${selected
          ? 'border-red-500 bg-red-50'
          : 'border-gray-200 bg-white hover:border-gray-300'}
        ${disabled && !selected ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <h3 className="font-semibold text-gray-900">{sabor.nome}</h3>
      <p className="text-sm text-gray-500 mt-1">{sabor.descricao}</p>
    </button>
  );
}
```

**Verification:** Cards render in a grid, click toggles selection state visually.

---

### Task 16: Create flavor selector with price display

**Objective:** Allow selecting 1–3 sabores, show live price calculation.

**Files:**
- Create: `src/components/FlavorSelector.tsx`

Key logic:
- Select up to 3 sabores across any categories
- Calculate and display price in real-time using `calcularPrecoPizza`
- Show count indicator ("1/3 sabores", "2/3 sabores", "3/3 sabores")
- "Adicionar ao carrinho" button disabled when 0 sabores selected

**Verification:** Select 1 flavor → price = category price. Select 2 flavors from different categories → price = higher category. Select 3 → price = max + R$5.

---

### Task 17: Create DrinkCard component

**Objective:** Simple drink item with name, price, and add-to-cart button.

**Files:**
- Create: `src/components/DrinkCard.tsx`

**Verification:** Drink renders with name, price, and "Adicionar" button.

---

### Task 18: Integrate flavor selector into PizzaBuilder modal

**Objective:** When user taps a pizza category, show the flavor selection UI.

**Files:**
- Create: `src/components/PizzaBuilder.tsx`

The PizzaBuilder:
1. Shows all sabores from the selected category in a grid
2. User selects 1–3 sabores (PizzaCard components)
3. Live price display updates
4. Optional observation text field
5. "Adicionar ao carrinho" button → dispatches ADD_ITEM

**Verification:** Select sabores, add observation, tap "Adicionar" → item appears in cart context.

---

### Task 19: Wire up MenuPage with all components

**Objective:** Connect category tabs, PizzaBuilder, DrinkCard, and add-to-cart flow.

**Files:**
- Modify: `src/pages/MenuPage.tsx`

**Verification:** Full menu browsing flow: tap category → see items → select sabores → add to cart.

---

## Phase 4: Cart Page (Tasks 20–23)

### Task 20: Create CartItem component

**Objective:** Display one cart item with quantity controls, remove button, observation.

**Files:**
- Create: `src/components/CartItem.tsx`

Features:
- Item name and description (sabores for pizza, plain name for drink)
- Quantity +/- buttons (min 1)
- Remove button (trash icon)
- Observation display (if present)
- Unit price × quantity = subtotal

**Verification:** Item renders, +/- adjusts quantity, remove removes item.

---

### Task 21: Create EmptyCart component

**Objective:** Friendly empty state with link back to menu.

**Files:**
- Create: `src/components/EmptyCart.tsx`

```typescript
import { Link } from 'react-router-dom';

export default function EmptyCart() {
  return (
    <div className="text-center py-12">
      <p className="text-5xl mb-4">🛒</p>
      <h2 className="text-xl font-semibold text-gray-700">Seu carrinho está vazio</h2>
      <p className="text-gray-500 mt-2">Adicione pizzas e bebidas do cardápio!</p>
      <Link
        to="/"
        className="inline-block mt-6 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
      >
        Ver Cardápio
      </Link>
    </div>
  );
}
```

**Verification:** Navigate to `/carrinho` with empty cart → empty state shows.

---

### Task 22: Create CartSummary component

**Objective:** Display subtotal, delivery tax, total at bottom of cart.

**Files:**
- Create: `src/components/CartSummary.tsx`

**Verification:** Subtotal and total update live as items change.

---

### Task 23: Complete CartPage

**Objective:** Assemble CartItem list, EmptyCart, CartSummary, and "Finalizar" button.

**Files:**
- Modify: `src/pages/CartPage.tsx`

- "Finalizar Pedido" button → navigates to `/finalizar`
- Disabled if cart is empty

**Verification:** Full cart management: add items from menu → see in cart → adjust → proceed to checkout.

---

## Phase 5: Checkout & WhatsApp (Tasks 24–28)

### Task 24: Create DeliveryToggle component

**Objective:** Switch between Entrega (+R$5) and Retirada (R$0).

**Files:**
- Create: `src/components/DeliveryToggle.tsx`

**Verification:** Toggle changes delivery mode in cart context; total updates.

---

### Task 25: Create PaymentSelector component

**Objective:** Three payment options with conditional troco field.

**Files:**
- Create: `src/components/PaymentSelector.tsx`

- Radio buttons: Dinheiro, Cartão, Pix
- Troco text input (only visible when Dinheiro selected)
- Troco is optional

**Verification:** Select Dinheiro → troco field appears. Select Cartão → troco field hides and troco state clears.

---

### Task 26: Create OrderSummary component

**Objective:** Final review before sending — all items, totals, delivery, payment.

**Files:**
- Create: `src/components/OrderSummary.tsx`

Shows:
- All items with quantities and observations
- Subtotal
- Delivery tax (if applicable)
- Total
- Delivery mode
- Payment method (+ troco if applicable)

**Verification:** Summary matches cart state exactly.

---

### Task 27: Create WhatsApp button and message generation

**Objective:** "Finalizar Pedido" button that generates WhatsApp link and opens it.

**Files:**
- Create: `src/components/WhatsAppButton.tsx`

- Uses `formatWhatsAppMessage` and `createWhatsAppLink`
- Opens `wa.me` link in new tab
- After opening, clears cart (CLEAR_CART action)

**Verification:** Click button → WhatsApp opens in new tab with formatted message → cart is empty.

---

### Task 28: Complete CheckoutPage

**Objective:** Assemble all checkout components.

**Files:**
- Modify: `src/pages/CheckoutPage.tsx`

Guard: if cart is empty, redirect to `/carrinho`.

**Verification:** Full checkout flow: delivery → payment → review → WhatsApp.

---

## Phase 6: PWA & Polish (Tasks 29–33)

### Task 29: Add PWA icons and manifest verification

**Objective:** Create placeholder icon PNGs (192×192, 512×512), verify manifest.

**Files:**
- Create: `public/icon-192.png` (solid red square with 🍕 emoji)
- Create: `public/icon-512.png`

**Verification:** `npm run build` → `dist/manifest.webmanifest` is valid JSON.

---

### Task 30: Create offline fallback page

**Objective:** Friendly page shown when user is offline and page isn't cached.

**Files:**
- Create: `public/offline.html`

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Offline — Cardápio Digital</title>
<style>body{font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center;padding:2rem;color:#374151;background:#f9fafb}
h1{font-size:1.5rem;margin-bottom:.5rem}p{color:#6b7280}</style></head>
<body><div><h1>📡 Sem conexão</h1><p>Você está offline. Conecte-se à internet para acessar o cardápio completo.</p></div></body>
</html>
```

**Verification:** `npm run build` includes offline.html in dist.

---

### Task 31: Create CartBadge component for header

**Objective:** Show item count in header, links to cart.

**Files:**
- Create: `src/components/CartBadge.tsx`
- Modify: `src/components/Layout.tsx`

```typescript
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartBadge() {
  const { itemCount } = useCart();
  return (
    <Link to="/carrinho" className="relative">
      🛒
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
```

**Verification:** Badge appears in header, shows count, navigates to cart.

---

### Task 32: Build production and run Lighthouse

**Objective:** Generate production build and audit PWA score.

```bash
npm run build
npx serve dist  # or use Vercel CLI / Netlify CLI
# Run Lighthouse in Chrome DevTools (mobile, 3G throttling)
```

**Target:** PWA score ≥ 90.

---

### Task 33: Document menu.json structure for business owner

**Objective:** Create a README.md explaining how to edit the menu.

**Files:**
- Modify: `README.md`

Include:
- menu.json structure with comments
- How to add a new sabor
- How to change prices
- How to change WhatsApp number
- Common mistakes (missing commas, unclosed brackets)

**Verification:** A non-technical person can follow the docs.

---

## Files Summary

| File | Action | Phase |
|------|--------|-------|
| `package.json` | modify (install deps) | 1 |
| `vite.config.ts` | create | 1 |
| `tsconfig.json` | scaffold | 1 |
| `tailwind.config.js` | create | 1 |
| `postcss.config.js` | create | 1 |
| `src/index.css` | modify | 1 |
| `src/main.tsx` | modify | 2 |
| `src/App.tsx` | modify | 2 |
| `src/types/menu.ts` | create | 1 |
| `src/types/cart.ts` | create | 1 |
| `src/context/CartContext.tsx` | create | 2 |
| `src/context/MenuContext.tsx` | create | 2 |
| `src/utils/pricing.ts` | create | 2 |
| `src/utils/whatsapp.ts` | create | 2 |
| `src/utils/loadMenu.ts` | create | 2 |
| `src/components/Layout.tsx` | create | 2 |
| `src/components/CartBadge.tsx` | create | 6 |
| `src/components/PizzaCard.tsx` | create | 3 |
| `src/components/FlavorSelector.tsx` | create | 3 |
| `src/components/DrinkCard.tsx` | create | 3 |
| `src/components/PizzaBuilder.tsx` | create | 3 |
| `src/components/CartItem.tsx` | create | 4 |
| `src/components/EmptyCart.tsx` | create | 4 |
| `src/components/CartSummary.tsx` | create | 4 |
| `src/components/DeliveryToggle.tsx` | create | 5 |
| `src/components/PaymentSelector.tsx` | create | 5 |
| `src/components/OrderSummary.tsx` | create | 5 |
| `src/components/WhatsAppButton.tsx` | create | 5 |
| `src/pages/MenuPage.tsx` | create | 3 |
| `src/pages/CartPage.tsx` | create | 4 |
| `src/pages/CheckoutPage.tsx` | create | 5 |
| `public/menu.json` | create | 3 |
| `public/icon-192.png` | create | 6 |
| `public/icon-512.png` | create | 6 |
| `public/offline.html` | create | 6 |
| `README.md` | modify | 6 |

---

## Risk & Tradeoffs

| Risk | Mitigation |
|------|-----------|
| WhatsApp `wa.me` link truncates long messages on some devices | Keep message concise; test on Android + iOS |
| PWA offline breaks if `menu.json` isn't cached | Cache-first strategy with NetworkFirst fallback in Workbox config |
| `crypto.randomUUID()` not available in all browsers | Add polyfill or use `Date.now() + Math.random()` fallback |
| Lighthouse PWA score < 90 | Verify HTTPS, manifest completeness, service worker registration; iterate on Workbox config |
| Dono não-técnico quebra `menu.json` | Strict validation with Portuguese error messages + README docs |

## Open Questions

- Imagens reais ou placeholders no MVP? → Assumindo placeholders inicialmente, caminho para imagens reais documentado
- Nome e WhatsApp da pizzaria real? → Usar placeholder "Pizza do Bairro / 5511999999999"
- Precisa de tela de "pedido enviado com sucesso" pós-WhatsApp? → Não: o WhatsApp abre e o carrinho limpa; cliente vê carrinho vazio
