import { CartItem as CartItemType } from '../types/cart';
import { formatCurrency } from '../utils/pricing';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }: { item: CartItemType }) {
  const { dispatch } = useCart();
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-gray-900 text-sm">{item.nome}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {formatCurrency(item.precoUnitario)} cada
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}
          className="text-gray-300 hover:text-brand-500 text-lg transition-colors cursor-pointer"
          aria-label="Remover"
        >
          ✕
        </button>
      </div>

      {item.observacao && (
        <p className="text-xs text-gray-500 italic">Obs: {item.observacao}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-2 py-1">
          <button
            type="button"
            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantidade: item.quantidade - 1 })}
            disabled={item.quantidade <= 1}
            className="text-gray-500 hover:text-gray-800 disabled:opacity-30 text-lg leading-none cursor-pointer"
          >−</button>
          <span className="text-sm font-medium w-6 text-center">{item.quantidade}</span>
          <button
            type="button"
            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantidade: item.quantidade + 1 })}
            className="text-gray-500 hover:text-gray-800 text-lg leading-none cursor-pointer"
          >+</button>
        </div>
        <span className="font-bold text-gray-900 text-sm">{formatCurrency(item.precoUnitario * item.quantidade)}</span>
      </div>
    </div>
  );
}
