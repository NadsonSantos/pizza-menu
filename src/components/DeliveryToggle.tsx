import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';
import { formatCurrency } from '../utils/pricing';

export default function DeliveryToggle() {
  const { state, dispatch } = useCart();
  const { menu } = useMenu();
  const taxa = menu?.pizzaria?.taxa_entrega ?? 0;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700">Opção de recebimento</h3>
      <div className="grid grid-cols-2 gap-2">
        {(['entrega', 'retirada'] as const).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => dispatch({ type: 'SET_DELIVERY', mode: m })}
            aria-pressed={state.delivery === m}
            className={`p-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
              state.delivery === m
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <span className="block text-base mb-0.5">{m === 'entrega' ? '🛵' : '🚶'}</span>
            {m === 'entrega' ? `Entrega (+${formatCurrency(taxa)})` : 'Retirada'}
          </button>
        ))}
      </div>
    </div>
  );
}
