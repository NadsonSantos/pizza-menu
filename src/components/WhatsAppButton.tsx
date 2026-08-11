import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';
import { useAddress } from '../context/AddressContext';
import { formatWhatsAppMessage, createWhatsAppLink } from '../utils/whatsapp';
import { formatAddress } from '../utils/address';
import { saveOrder } from '../utils/orderHistory';

export default function WhatsAppButton() {
  const { state, dispatch, subtotal, taxaEntrega, total } = useCart();
  const { menu } = useMenu();
  const { getSelectedAddress } = useAddress();

  if (!menu) return null;

  const handleFinish = () => {
    const selectedAddress = getSelectedAddress(state.selectedAddressId);
    const endereco =
      state.delivery === 'entrega' && selectedAddress ? formatAddress(selectedAddress) : undefined;
    const msg = formatWhatsAppMessage(state, menu.pizzaria.nome, subtotal, taxaEntrega, total, endereco);
    const url = createWhatsAppLink(menu.pizzaria.whatsapp, msg);
    window.open(url, '_blank');

    // NAD-6: persiste o pedido no histórico ANTES de limpar o carrinho (FR-001)
    if (state.items.length > 0) {
      saveOrder({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        items: state.items,
        delivery: state.delivery,
        payment: state.payment,
        troco: state.troco,
        addressId: state.selectedAddressId,
        subtotal,
        taxaEntrega,
        total,
      });
    }

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
