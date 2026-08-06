import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAddress } from '../context/AddressContext';
import DeliveryToggle from '../components/DeliveryToggle';
import AddressCard from '../components/AddressCard';
import PaymentSelector from '../components/PaymentSelector';
import OrderSummary from '../components/OrderSummary';
import WhatsAppButton from '../components/WhatsAppButton';

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const { state: addressState } = useAddress();

  // Mantém CartState.selectedAddressId em sincronia com o AddressContext
  useEffect(() => {
    dispatch({ type: 'SET_ADDRESS', id: addressState.selectedId });
  }, [addressState.selectedId, dispatch]);

  if (state.items.length === 0) return <Navigate to="/carrinho" replace />;

  return (
    <div className="space-y-5 pb-8">
      <h2 className="text-lg font-bold text-gray-900">Finalizar Pedido</h2>
      <DeliveryToggle />
      {state.delivery === 'entrega' && <AddressCard />}
      <PaymentSelector />
      <OrderSummary />
      <WhatsAppButton />
    </div>
  );
}
