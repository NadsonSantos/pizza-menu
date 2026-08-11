import { CartItem, OrderRecord } from '../types/cart';

const STORAGE_KEY = 'order_history';
const DEFAULT_DAYS = 90;

function isValidCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    item.id.length > 0 &&
    (item.tipo === 'pizza' || item.tipo === 'bebida') &&
    typeof item.nome === 'string' &&
    Array.isArray(item.sabores) &&
    typeof item.precoUnitario === 'number' &&
    typeof item.quantidade === 'number' &&
    typeof item.observacao === 'string'
  );
}

function isValidOrderRecord(value: unknown): value is OrderRecord {
  if (typeof value !== 'object' || value === null) return false;
  const order = value as Record<string, unknown>;
  if (typeof order.id !== 'string' || order.id.length === 0) return false;
  if (typeof order.timestamp !== 'string' || Number.isNaN(new Date(order.timestamp).getTime())) return false;
  if (!Array.isArray(order.items) || order.items.length === 0) return false;
  if (!order.items.every(isValidCartItem)) return false;
  if (order.delivery !== 'entrega' && order.delivery !== 'retirada') return false;
  if (
    order.payment !== null &&
    order.payment !== 'dinheiro' &&
    order.payment !== 'cartao' &&
    order.payment !== 'pix'
  ) {
    return false;
  }
  if (typeof order.troco !== 'string') return false;
  if (order.addressId !== null && typeof order.addressId !== 'string') return false;
  if (typeof order.subtotal !== 'number' || order.subtotal < 0) return false;
  if (typeof order.taxaEntrega !== 'number' || order.taxaEntrega < 0) return false;
  if (typeof order.total !== 'number' || order.total < 0) return false;
  return true;
}

/**
 * Lê e valida o histórico de pedidos do localStorage.
 * Dados corrompidos ou registros inválidos são descartados silenciosamente.
 * Nunca lança exceção — retorna [] em qualquer cenário de falha.
 */
export function readOrderHistory(): OrderRecord[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidOrderRecord);
  } catch {
    return [];
  }
}

/**
 * Adiciona um pedido finalizado ao histórico.
 * Falhas de armazenamento (quota, privacidade) falham silenciosamente —
 * o pedido já foi enviado via WhatsApp e não pode ser bloqueado por isso.
 */
export function saveOrder(order: OrderRecord): void {
  try {
    if (order.items.length === 0) return;
    const history = readOrderHistory();
    history.push(order);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // localStorage indisponível/quota excedida — falha silenciosa (FR-011)
  }
}

/**
 * Retorna pedidos dentro dos últimos `days` dias, do mais recente para o mais antigo.
 */
export function getRecentOrders(days: number = DEFAULT_DAYS): OrderRecord[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return readOrderHistory()
    .filter(order => new Date(order.timestamp).getTime() >= cutoff)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Indica se existe ao menos um pedido dentro dos últimos `days` dias.
 */
export function hasRecentOrders(days: number = DEFAULT_DAYS): boolean {
  return getRecentOrders(days).length > 0;
}
