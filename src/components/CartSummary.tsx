import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/pricing';

export default function CartSummary() {
  const { subtotal, taxaEntrega, total } = useCart();
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Taxa de entrega</span>
        <span>{taxaEntrega > 0 ? formatCurrency(taxaEntrega) : 'Grátis'}</span>
      </div>
      <hr className="border-gray-100" />
      <div className="flex justify-between font-bold text-gray-900 text-base">
        <span>Total</span><span className="text-red-600">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
