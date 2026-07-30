import { useState } from 'react';
import { Sabor, Categoria } from '../types/menu';
import { calcularPrecoPizza, formatCurrency } from '../utils/pricing';
import PizzaCard from './PizzaCard';

interface Props {
  sabores: Sabor[];
  categorias: Categoria[];
  onConfirm: (sabores: Sabor[], observacao: string) => void;
}

export default function FlavorSelector({ sabores, categorias, onConfirm }: Props) {
  const [selected, setSelected] = useState<Sabor[]>([]);
  const [observacao, setObservacao] = useState('');

  const maxReached = selected.length >= 3;

  const handleToggle = (sabor: Sabor) => {
    if (selected.find(s => s.id === sabor.id)) {
      setSelected(prev => prev.filter(s => s.id !== sabor.id));
    } else if (!maxReached) {
      setSelected(prev => [...prev, sabor]);
    }
  };

  const precoInfo = selected.length > 0 ? calcularPrecoPizza(selected, categorias) : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">
          {selected.length} de 3 sabores selecionados
        </span>
        {precoInfo && (
          <div className="text-right">
            <span className="text-sm font-bold text-red-600">{formatCurrency(precoInfo.total)}</span>
            {precoInfo.acrescimo > 0 && (
              <span className="text-[10px] text-gray-400 block">(+R$ 5,00 3º sabor)</span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {sabores.map(s => (
          <PizzaCard
            key={s.id}
            sabor={s}
            selected={!!selected.find(x => x.id === s.id)}
            onToggle={() => handleToggle(s)}
            disabled={maxReached}
          />
        ))}
      </div>

      <input
        type="text"
        placeholder="Observação (ex: sem cebola)"
        value={observacao}
        onChange={e => setObservacao(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400"
      />

      <button
        type="button"
        onClick={() => { if (selected.length > 0) { onConfirm(selected, observacao); setSelected([]); setObservacao(''); } }}
        disabled={selected.length === 0}
        className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all cursor-pointer"
      >
        Adicionar ao carrinho {precoInfo ? `— ${formatCurrency(precoInfo.total)}` : ''}
      </button>
    </div>
  );
}
