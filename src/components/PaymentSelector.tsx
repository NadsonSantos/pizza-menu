import { useCart } from '../context/CartContext';

const opcoes = [
  { value: 'dinheiro' as const, label: 'Dinheiro', icon: '💵' },
  { value: 'cartao' as const, label: 'Cartão', icon: '💳' },
  { value: 'pix' as const, label: 'PIX', icon: '📱' },
];

export default function PaymentSelector() {
  const { state, dispatch } = useCart();
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700">Forma de pagamento</h3>
      <div className="grid grid-cols-3 gap-2">
        {opcoes.map(o => (
          <button
            key={o.value}
            type="button"
            onClick={() => dispatch({ type: 'SET_PAYMENT', method: o.value })}
            className={`p-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
              state.payment === o.value
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <span className="block text-lg mb-0.5">{o.icon}</span>
            {o.label}
          </button>
        ))}
      </div>

      {state.payment === 'dinheiro' && (
        <div className="mt-2">
          <label className="text-xs text-gray-500 block mb-1">Troco para (opcional):</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Ex: R$ 100"
            value={state.troco}
            onChange={e => dispatch({ type: 'SET_TROCO', troco: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          />
        </div>
      )}
    </div>
  );
}
