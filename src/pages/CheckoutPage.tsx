import { Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import DeliveryToggle from '../components/DeliveryToggle';
import PaymentSelector from '../components/PaymentSelector';
import OrderSummary from '../components/OrderSummary';
import WhatsAppButton from '../components/WhatsAppButton';

export default function CheckoutPage() {
  const { state } = useCart();

  if (state.items.length === 0) return <Navigate to="/carrinho" replace />;

  return (
    <div className="space-y-5 pb-8">
      <h2 className="text-lg font-bold text-gray-900">Finalizar Pedido</h2>
      <DeliveryToggle />
      <PaymentSelector />
      <OrderSummary />
      <WhatsAppButton />
    </div>
  );
}
