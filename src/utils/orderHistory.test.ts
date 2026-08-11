import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CartItem, OrderRecord } from '../types/cart';
import { getRecentOrders, hasRecentOrders, readOrderHistory, saveOrder } from './orderHistory';

const STORAGE_KEY = 'order_history';

// ---- localStorage shim (ambiente node, sem jsdom) ----
const store = new Map<string, string>();
let failWrites = false;

vi.stubGlobal('window', {
  localStorage: {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      if (failWrites) throw new Error('QuotaExceededError');
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  },
});

let seq = 0;

function makeItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: `item-${++seq}`,
    tipo: 'pizza',
    nome: 'Pizza Calabresa',
    sabores: [
      {
        id: 'calabresa',
        nome: 'Calabresa',
        descricao: '',
        imagem: '',
        categoria_id: 'tradicionais',
      },
    ],
    precoUnitario: 45,
    quantidade: 1,
    observacao: '',
    ...overrides,
  };
}

function makeOrder(timestamp: string, overrides: Partial<OrderRecord> = {}): OrderRecord {
  return {
    id: `order-${++seq}`,
    timestamp,
    items: [makeItem()],
    delivery: 'entrega',
    payment: 'pix',
    troco: '',
    addressId: null,
    subtotal: 45,
    taxaEntrega: 0,
    total: 45,
    ...overrides,
  };
}

function setRaw(value: string) {
  store.set(STORAGE_KEY, value);
}

beforeEach(() => {
  store.clear();
  failWrites = false;
});

describe('orderHistory (smoke test versionado — CR-004)', () => {
  it('leitura vazia retorna []', () => {
    expect(readOrderHistory()).toEqual([]);
    expect(hasRecentOrders()).toBe(false);
  });

  it('roundtrip save/read preserva o pedido', () => {
    const order = makeOrder(new Date().toISOString());
    saveOrder(order);
    const history = readOrderHistory();
    expect(history).toHaveLength(1);
    expect(history[0].id).toBe(order.id);
    expect(history[0].total).toBe(45);
  });

  it('filtra pedidos fora da janela de 90 dias', () => {
    const fresh = makeOrder(new Date().toISOString());
    const old = makeOrder(new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString());
    saveOrder(fresh);
    saveOrder(old);
    const recent = getRecentOrders();
    expect(recent).toHaveLength(1);
    expect(recent[0].id).toBe(fresh.id);
    expect(hasRecentOrders()).toBe(true);
  });

  it('ordena do mais recente para o mais antigo', () => {
    const older = makeOrder(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString());
    const newest = makeOrder(new Date().toISOString());
    const middle = makeOrder(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString());
    saveOrder(older);
    saveOrder(newest);
    saveOrder(middle);
    expect(getRecentOrders().map(o => o.id)).toEqual([newest.id, middle.id, older.id]);
  });

  it('JSON corrompido no storage retorna [] sem lançar', () => {
    setRaw('{corrompido');
    expect(readOrderHistory()).toEqual([]);
    setRaw('isto-nem-eh-json');
    expect(readOrderHistory()).toEqual([]);
    setRaw(JSON.stringify({ nao: 'eh array' }));
    expect(readOrderHistory()).toEqual([]);
  });

  it('registros inválidos são descartados silenciosamente', () => {
    const valid = makeOrder(new Date().toISOString());
    const invalid = makeOrder(new Date().toISOString(), { total: -5 });
    setRaw(JSON.stringify([valid, invalid]));
    const history = readOrderHistory();
    expect(history).toHaveLength(1);
    expect(history[0].id).toBe(valid.id);
  });

  it('timestamp inválido exclui o registro', () => {
    const valid = makeOrder(new Date().toISOString());
    const badTs = makeOrder('data-invalida');
    setRaw(JSON.stringify([valid, badTs]));
    const history = readOrderHistory();
    expect(history).toHaveLength(1);
    expect(history[0].id).toBe(valid.id);
  });

  it('quota excedida falha silenciosamente e preserva o histórico', () => {
    const first = makeOrder(new Date().toISOString());
    saveOrder(first);
    failWrites = true;
    expect(() => saveOrder(makeOrder(new Date().toISOString()))).not.toThrow();
    expect(readOrderHistory()).toHaveLength(1);
  });

  it('saveOrder ignora pedidos sem itens', () => {
    saveOrder(makeOrder(new Date().toISOString(), { items: [] }));
    expect(readOrderHistory()).toEqual([]);
  });
});
