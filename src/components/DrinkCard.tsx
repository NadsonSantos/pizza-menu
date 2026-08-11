import { Bebida } from '../types/menu';
import { formatCurrency } from '../utils/pricing';

interface Props {
  bebida: Bebida;
  onAdd: () => void;
}

export default function DrinkCard({ bebida, onAdd }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">🥤</div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm">{bebida.nome}</h3>
        <p className="text-brand-600 font-bold text-sm mt-0.5">{formatCurrency(bebida.preco)}</p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 active:scale-95 transition-all cursor-pointer"
      >
        + Add
      </button>
    </div>
  );
}
