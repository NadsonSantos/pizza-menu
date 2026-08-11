import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/pricing';

export default function CartSummary() {
  const { subtotal } = useCart();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
      </div>
      <hr className="border-gray-100" />
      <div className="flex justify-between font-bold text-gray-900 text-base">
        <span>Total</span><span className="text-brand-600">{formatCurrency(subtotal)}</span>
      </div>
    </div>
  );
}
