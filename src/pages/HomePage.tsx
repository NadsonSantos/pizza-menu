import { Link, useNavigate } from 'react-router-dom';
import { OrderRecord } from '../types/cart';
import { getRecentOrders } from '../utils/orderHistory';
import { formatCurrency } from '../utils/pricing';

const MAX_ORDERS = 3;

export default function HomePage() {
  const navigate = useNavigate();
  // Defensivo: App já garante elegibilidade, mas se não houver pedidos
  // recentes renderizamos um fallback em vez de uma lista vazia.
  const orders = getRecentOrders().slice(0, MAX_ORDERS);

  return (
    <div className="pb-8">
      <section className="text-center py-6">
        <h1 className="text-2xl font-bold text-gray-900">Bem-vindo(a) de volta! 🍕</h1>
        <p className="text-sm text-gray-500 mt-1">
          Que tal repetir aquele pedido que você amou?
        </p>
      </section>

      <button
        type="button"
        onClick={() => navigate('/cardapio')}
        className="w-full bg-brand-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-600 active:scale-[0.98] transition-all cursor-pointer"
      >
        🍕 Novo Pedido
      </button>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Seus últimos pedidos</h2>
        {orders.length === 0 ? (
          <EmptyHistory />
        ) : (
          <ul className="space-y-3">
            {orders.map(order => (
              <li key={order.id}>
                <Link
                  to={`/pedido/${order.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {describeOrder(order)}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {formatOrderDate(order.timestamp)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-brand-600 text-sm">
                        {formatCurrency(order.total)}
                      </p>
                      <p className="text-[11px] text-brand-500 font-medium mt-0.5">Ver mais →</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function EmptyHistory() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
      <p className="text-3xl mb-2">🛒</p>
      <p className="text-sm text-gray-500">Nenhum pedido recente por aqui ainda.</p>
    </div>
  );
}

function formatOrderDate(timestamp: string): string {
  try {
    return new Date(timestamp).toLocaleDateString('pt-BR');
  } catch {
    return '';
  }
}

/**
 * Descrição resumida do pedido (research.md, tópico 6):
 * - 1 pizza: "Pizza {primeiro sabor}"
 * - 2 pizzas: "Pizza {sabor1} + Pizza {sabor2}"
 * - 3+ itens: "Pizza {sabor1} + {n-1} itens"
 * - Sem pizzas: usa o primeiro item como referência
 */
function describeOrder(order: OrderRecord): string {
  const { items } = order;
  if (items.length === 0) return 'Pedido vazio';

  const pizzas = items.filter(i => i.tipo === 'pizza');
  const firstPizzaSabor = pizzas[0]?.sabores[0]?.nome ?? pizzas[0]?.nome;

  if (firstPizzaSabor) {
    if (items.length === 1) return `Pizza ${firstPizzaSabor}`;
    if (pizzas.length === 2 && items.length === 2) {
      const secondSabor = pizzas[1]?.sabores[0]?.nome ?? pizzas[1]?.nome ?? '';
      return `Pizza ${firstPizzaSabor} + Pizza ${secondSabor}`;
    }
    const restante = items.length - 1;
    return `Pizza ${firstPizzaSabor} + ${restante} ${restante === 1 ? 'item' : 'itens'}`;
  }

  const firstItem = items[0];
  if (items.length === 1) return firstItem.nome;
  const restante = items.length - 1;
  return `${firstItem.nome} + ${restante} ${restante === 1 ? 'item' : 'itens'}`;
}
