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
