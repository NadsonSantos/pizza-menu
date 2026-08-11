import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAddress } from '../context/AddressContext';
import { readOrderHistory } from '../utils/orderHistory';
import { formatCurrency } from '../utils/pricing';
import { paymentLabelText } from '../utils/whatsapp';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();
  const { state: addressState } = useAddress();
  const navigate = useNavigate();

  // Dados vêm do localStorage — a tela não depende de menu.json (spec, Assumptions)
  const order = id ? readOrderHistory().find(o => o.id === id) : undefined;

  if (!order) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center space-y-3">
        <p className="text-3xl">🔍</p>
        <p className="font-semibold text-gray-900">Pedido não encontrado</p>
        <p className="text-sm text-gray-500">
          Este pedido pode ter expirado ou o link está incorreto.
        </p>
        <Link
          to="/"
          className="inline-block text-sm text-brand-600 font-medium hover:text-brand-700"
        >
          ← Voltar ao início
        </Link>
      </div>
    );
  }

  const handleReorder = () => {
    // Defensivo: se o endereço original foi removido do AddressContext,
    // restaura selectedAddressId como null (data-model.md, ciclo recompra)
    const addressExists =
      order.addressId !== null &&
      addressState.addresses.some(a => a.id === order.addressId);
    dispatch({
      type: 'ORDER_FROM_HISTORY',
      order: { ...order, addressId: addressExists ? order.addressId : null },
    });
    navigate('/carrinho');
  };

  return (
    <div className="space-y-4 pb-8">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        ← Voltar
      </button>

      <h2 className="text-lg font-bold text-gray-900">Detalhes do pedido</h2>
      <p className="text-xs text-gray-400 -mt-3">
        {new Date(order.timestamp).toLocaleString('pt-BR')}
      </p>

      <div className="space-y-3">
        {order.items.map(item => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900 text-sm">
                  {item.quantidade}x {item.nome}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {formatCurrency(item.precoUnitario)} cada
                </p>
              </div>
              <span className="font-bold text-gray-900 text-sm shrink-0">
                {formatCurrency(item.precoUnitario * item.quantidade)}
              </span>
            </div>
            {item.observacao && (
              <p className="text-xs text-gray-500 italic mt-2">Obs: {item.observacao}</p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>{order.delivery === 'entrega' ? 'Entrega' : 'Retirada'}</span>
          <span>{order.taxaEntrega > 0 ? formatCurrency(order.taxaEntrega) : 'Grátis'}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Pagamento</span>
          <span>{order.payment ? paymentLabelText(order.payment) : 'Não informado'}</span>
        </div>
        {order.payment === 'dinheiro' && order.troco && (
          <div className="flex justify-between text-gray-600">
            <span>Troco para</span>
            <span>R$ {order.troco}</span>
          </div>
        )}
        <hr className="border-gray-200" />
        <div className="flex justify-between font-bold text-gray-900 text-base">
          <span>Total</span>
          <span className="text-brand-600">{formatCurrency(order.total)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleReorder}
        className="w-full bg-brand-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-600 active:scale-[0.98] transition-all cursor-pointer"
      >
        🔁 Pedir novamente
      </button>
    </div>
  );
}
