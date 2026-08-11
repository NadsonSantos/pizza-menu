import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import EmptyCart from '../components/EmptyCart';

export default function CartPage() {
  const { state, itemCount } = useCart();

  if (state.items.length === 0) return <EmptyCart />;

  return (
    <div className="space-y-4 pb-8">
      <h2 className="text-lg font-bold text-gray-900">
        Carrinho {itemCount > 0 && <span className="text-sm font-normal text-gray-400">({itemCount} {itemCount === 1 ? 'item' : 'itens'})</span>}
      </h2>

      <div className="space-y-3">
        {state.items.map(i => <CartItem key={i.id} item={i} />)}
      </div>

      <CartSummary />

      <Link
        to="/finalizar"
        className="block w-full bg-brand-500 text-white py-3 rounded-xl font-semibold text-sm text-center hover:bg-brand-600 active:scale-[0.98] transition-all"
      >
        Finalizar Pedido →
      </Link>

      <Link to="/cardapio" className="block text-center text-sm text-gray-400 hover:text-gray-600">
        ← Adicionar mais itens
      </Link>
    </div>
  );
}
