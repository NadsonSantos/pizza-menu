import { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartState, CartAction, CartItem } from '../types/cart';
import { useMenu } from './MenuContext';

const initialState: CartState = {
  items: [],
  delivery: 'entrega',
  payment: null,
  troco: '',
  selectedAddressId: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.item] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'UPDATE_QUANTITY':
      return { ...state, items: state.items.map(i =>
        i.id === action.id ? { ...i, quantidade: Math.max(1, action.quantidade) } : i
      )};
    case 'SET_DELIVERY':
      return { ...state, delivery: action.mode };
    case 'SET_PAYMENT':
      return { ...state, payment: action.method, troco: action.method !== 'dinheiro' ? '' : state.troco };
    case 'SET_TROCO':
      return { ...state, troco: action.troco };
    case 'SET_ADDRESS':
      return { ...state, selectedAddressId: action.id };
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { menu } = useMenu();

  const addItem = (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_ITEM', item: { ...item, id: crypto.randomUUID() } });
  };

  const subtotal = state.items.reduce((s, i) => s + i.precoUnitario * i.quantidade, 0);
  const taxaBase = menu?.pizzaria?.taxa_entrega ?? 0;
  const taxaEntrega = state.delivery === 'entrega' ? taxaBase : 0;
  const total = subtotal + taxaEntrega;
  const itemCount = state.items.reduce((s, i) => s + i.quantidade, 0);

  return (
    <CartContext.Provider value={{ state, dispatch, addItem, subtotal, taxaEntrega, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
