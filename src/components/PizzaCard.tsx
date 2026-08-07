import { Sabor } from '../types/menu';

interface Props {
  sabor: Sabor;
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function PizzaCard({ sabor, selected, onToggle, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled && !selected}
      className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-150
        ${selected
          ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500/30'
          : 'border-gray-200 bg-white hover:border-gray-300 active:scale-[0.98]'}
        ${disabled && !selected ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
          selected ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'
        }`}>
          {selected ? '✓' : '🍕'}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm">{sabor.nome}</h3>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{sabor.descricao}</p>
        </div>
      </div>
    </button>
  );
}
