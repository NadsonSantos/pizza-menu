import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';
import { formatWhatsAppMessage, createWhatsAppLink } from '../utils/whatsapp';

export default function WhatsAppButton() {
  const { state, dispatch, subtotal, taxaEntrega, total } = useCart();
  const { menu } = useMenu();

  if (!menu) return null;

  const handleFinish = () => {
    const msg = formatWhatsAppMessage(state, menu.pizzaria.nome, subtotal, taxaEntrega, total);
    const url = createWhatsAppLink(menu.pizzaria.whatsapp, msg);
    window.open(url, '_blank');
    dispatch({ type: 'CLEAR_CART' });
  };

  const canFinish = state.payment !== null;

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={handleFinish}
        disabled={!canFinish}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all cursor-pointer"
      >
        {canFinish ? '📤 Finalizar Pedido — WhatsApp' : 'Selecione a forma de pagamento'}
      </button>
      <p className="text-[11px] text-gray-400 mt-2">
        O WhatsApp abrirá com o resumo. Confirme o envio manualmente.
      </p>
    </div>
  );
}
