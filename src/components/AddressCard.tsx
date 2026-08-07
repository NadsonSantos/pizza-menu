import { useNavigate } from 'react-router-dom';
import { useAddress } from '../context/AddressContext';
import { formatAddress } from '../utils/address';

export default function AddressCard() {
  const { state } = useAddress();
  const navigate = useNavigate();
  const selected = state.addresses.find(a => a.id === state.selectedId) ?? null;

  const handleNavigate = () => navigate('/enderecos?from=checkout');

  if (!selected) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-3">
        <div className="flex items-start gap-2">
          <span aria-hidden="true" className="text-lg leading-none mt-0.5">📍</span>
          <div>
            <p className="text-sm font-semibold text-gray-900">Nenhum endereço salvo</p>
            <p className="text-xs text-orange-700 mt-0.5">
              Endereço não informado — você pode cadastrar agora ou informá-lo depois no WhatsApp.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleNavigate}
          className="w-full bg-brand-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-600 active:scale-[0.98] transition-all cursor-pointer"
        >
          ➕ Adicionar endereço
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-start gap-2">
        <span aria-hidden="true" className="text-lg leading-none mt-0.5">📍</span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Endereço de entrega
          </p>
          <p className="text-sm text-gray-900 mt-0.5 break-words">{formatAddress(selected)}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleNavigate}
        className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-200 active:scale-[0.98] transition-all cursor-pointer"
      >
        ✏️ Alterar endereço
      </button>
    </div>
  );
}
