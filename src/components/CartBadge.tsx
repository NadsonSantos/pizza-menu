import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartBadge() {
  const { itemCount } = useCart();
  return (
    <Link to="/carrinho" className="relative p-1" aria-label="Carrinho">
      🛒
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-800 text-[11px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-0.5">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}
