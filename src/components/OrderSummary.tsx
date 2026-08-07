import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/pricing';
import { paymentLabelText } from '../utils/whatsapp';

export default function OrderSummary() {
  const { state, subtotal, taxaEntrega, total } = useCart();
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 text-sm">
      <h3 className="font-semibold text-gray-700">Resumo do pedido</h3>

      {state.items.map(i => (
        <div key={i.id} className="flex justify-between gap-2 text-gray-600">
          <span className="truncate">{i.quantidade}x {i.nome}{i.observacao ? ` (${i.observacao})` : ''}</span>
          <span className="shrink-0">{formatCurrency(i.precoUnitario * i.quantidade)}</span>
        </div>
      ))}
      <hr className="border-gray-100" />
      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>{state.delivery === 'entrega' ? 'Entrega' : 'Retirada'}</span>
        <span>{taxaEntrega > 0 ? formatCurrency(taxaEntrega) : 'Grátis'}</span>
      </div>
      {state.payment && (
        <div className="flex justify-between text-gray-600">
          <span>Pagamento</span><span>{paymentLabelText(state.payment)}</span>
        </div>
      )}
      {state.payment === 'dinheiro' && state.troco && (
        <div className="flex justify-between text-gray-600">
          <span>Troco para</span><span>R$ {state.troco}</span>
        </div>
      )}
      <hr className="border-gray-200" />
      <div className="flex justify-between font-bold text-gray-900 text-base">
        <span>Total</span><span className="text-brand-600">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
