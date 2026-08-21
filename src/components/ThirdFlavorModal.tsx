import { useEffect, useRef } from 'react';
import { Sabor } from '../types/menu';

interface Props {
  sabor: Sabor; // o 3º sabor candidato (não incluído ainda)
  onConfirm: () => void; // "Adicionar" → inclui o sabor e aplica + R$ 5,00 via calcularPrecoPizza
  onCancel: () => void; // "Cancelar" (ou backdrop/Escape) → nada muda
}

/**
 * Modal de confirmação do 3º sabor (NAD-8, US1).
 *
 * Comunica que a pizza comporta até 2 sabores como padrão e que o 3º sabor
 * possui adicional de R$ 5,00. Segue o mesmo padrão visual do PizzaBuilder
 * (fixed inset-0 z-50 bg-black/40; painel bg-white rounded-2xl; em mobile
 * items-end, em sm centralizado) — constitution: sem bibliotecas de UI.
 */
export default function ThirdFlavorModal({ sabor, onConfirm, onCancel }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  // A11y: move o foco para o painel ao abrir e fecha via Escape (equivale a Cancelar)
  useEffect(() => {
    panelRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center"
      onClick={onCancel}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="third-flavor-modal-title"
        className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-5 outline-none"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="third-flavor-modal-title" className="text-lg font-bold text-gray-900">
          Adicionar 3º sabor?
        </h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          A pizza comporta até <strong>2 sabores como padrão</strong>. O sabor{' '}
          <strong>{sabor.nome}</strong> será o 3º e possui{' '}
          <strong>adicional de R$ 5,00</strong>.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-brand-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-600 active:scale-[0.98] transition-all cursor-pointer"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}