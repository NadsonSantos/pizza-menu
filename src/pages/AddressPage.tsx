import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddress } from '../context/AddressContext';
import { formatAddress } from '../utils/address';

const MAX_ADDRESSES = 2;
const LIMITS = { rua: 100, numero: 10, complemento: 50, pontoReferencia: 100 } as const;

interface FormFields {
  rua: string;
  numero: string;
  complemento: string;
  pontoReferencia: string;
}

const emptyForm: FormFields = { rua: '', numero: '', complemento: '', pontoReferencia: '' };

export default function AddressPage() {
  const { state, addAddress, removeAddress, selectAddress } = useAddress();
  const navigate = useNavigate();

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormFields>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});

  const atLimit = state.addresses.length >= MAX_ADDRESSES;

  const setField = (field: keyof FormFields, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!form.rua.trim()) nextErrors.rua = 'Rua é obrigatória';
    if (!form.numero.trim()) nextErrors.numero = 'Número é obrigatório';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    addAddress({
      rua: form.rua.trim(),
      numero: form.numero.trim(),
      complemento: form.complemento.trim(),
      pontoReferencia: form.pontoReferencia.trim(),
    });
    setForm(emptyForm);
    setErrors({});
    setFormOpen(false);
  };

  const handleRemove = (id: string, label: string) => {
    if (window.confirm(`Excluir o endereço "${label}"?`)) {
      removeAddress(id);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="shrink-0 bg-gray-100 text-gray-700 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-gray-200 active:scale-[0.98] transition-all cursor-pointer"
        >
          ← Voltar
        </button>
        <h2 className="text-lg font-bold text-gray-900">Meus Endereços</h2>
      </div>

      {state.addresses.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center space-y-2">
          <p aria-hidden="true" className="text-3xl">📍</p>
          <p className="text-sm text-gray-600">Nenhum endereço cadastrado</p>
          <p className="text-xs text-gray-400">
            Cadastre até {MAX_ADDRESSES} endereços para agilizar seus pedidos.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {state.addresses.map(a => {
            const isSelected = a.id === state.selectedId;
            return (
              <li key={a.id}>
                <div
                  className={`bg-white rounded-xl border-2 p-4 flex items-start gap-3 ${
                    isSelected ? 'border-brand-500' : 'border-gray-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectAddress(a.id)}
                    aria-pressed={isSelected}
                    className="flex-1 min-w-0 text-left cursor-pointer"
                  >
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      {isSelected ? '✅ Selecionado' : 'Tocar para selecionar'}
                    </span>
                    <span className="block text-sm text-gray-900 break-words">
                      {formatAddress(a)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(a.id, `${a.rua}, ${a.numero}`)}
                    aria-label={`Excluir endereço ${a.rua}, ${a.numero}`}
                    className="shrink-0 text-gray-400 hover:text-brand-600 p-1.5 rounded-lg hover:bg-brand-50 transition-colors cursor-pointer"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {!formOpen && (
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          disabled={atLimit}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
            atLimit
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.98] cursor-pointer'
          }`}
        >
          {atLimit ? 'Limite de 2 endereços atingido' : '➕ Adicionar endereço'}
        </button>
      )}

      {atLimit && (
        <p className="text-xs text-gray-400 text-center">
          Você já cadastrou {MAX_ADDRESSES} endereços. Exclua um para adicionar outro.
        </p>
      )}

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-xl border border-gray-200 p-4 space-y-4"
        >
          <h3 className="text-sm font-semibold text-gray-700">Novo endereço</h3>

          <div>
            <label htmlFor="addr-rua" className="block text-xs font-medium text-gray-600 mb-1">
              Rua <span className="text-brand-500">*</span>
            </label>
            <input
              id="addr-rua"
              type="text"
              value={form.rua}
              onChange={e => setField('rua', e.target.value)}
              maxLength={LIMITS.rua}
              autoComplete="address-line1"
              aria-invalid={!!errors.rua}
              aria-describedby={errors.rua ? 'addr-rua-error' : undefined}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
            />
            {errors.rua && (
              <p id="addr-rua-error" role="alert" className="text-xs text-brand-600 mt-1">
                {errors.rua}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="addr-numero" className="block text-xs font-medium text-gray-600 mb-1">
              Número <span className="text-brand-500">*</span>
            </label>
            <input
              id="addr-numero"
              type="text"
              inputMode="numeric"
              value={form.numero}
              onChange={e => setField('numero', e.target.value)}
              maxLength={LIMITS.numero}
              autoComplete="address-line2"
              aria-invalid={!!errors.numero}
              aria-describedby={errors.numero ? 'addr-numero-error' : undefined}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
            />
            {errors.numero && (
              <p id="addr-numero-error" role="alert" className="text-xs text-brand-600 mt-1">
                {errors.numero}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="addr-complemento" className="block text-xs font-medium text-gray-600 mb-1">
              Complemento <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              id="addr-complemento"
              type="text"
              value={form.complemento}
              onChange={e => setField('complemento', e.target.value)}
              maxLength={LIMITS.complemento}
              autoComplete="address-line3"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
            />
          </div>

          <div>
            <label htmlFor="addr-ref" className="block text-xs font-medium text-gray-600 mb-1">
              Ponto de referência <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              id="addr-ref"
              type="text"
              value={form.pontoReferencia}
              onChange={e => setField('pontoReferencia', e.target.value)}
              maxLength={LIMITS.pontoReferencia}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-brand-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-600 active:scale-[0.98] transition-all cursor-pointer"
            >
              Salvar endereço
            </button>
            <button
              type="button"
              onClick={() => {
                setFormOpen(false);
                setForm(emptyForm);
                setErrors({});
              }}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
