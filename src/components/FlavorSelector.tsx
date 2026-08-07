import { useState } from 'react';
import { Sabor, Categoria } from '../types/menu';
import { calcularPrecoPizza, formatCurrency } from '../utils/pricing';
import { useMenu } from '../context/MenuContext';

interface Props {
  grupos: { categoria: Categoria; sabores: Sabor[] }[];
  categorias: Categoria[];
  preselectedSabor?: Sabor;
  onConfirm: (sabores: Sabor[], observacao: string) => void;
}

export default function FlavorSelector({ grupos, categorias, preselectedSabor, onConfirm }: Props) {
  const [selected, setSelected] = useState<Sabor[]>(preselectedSabor ? [preselectedSabor] : []);
  const [observacao, setObservacao] = useState('');
  const { getCategoriaNome } = useMenu();

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
      <div className="flex items-center justify-between sticky top-0 bg-white pb-2 z-10">
        <span className="text-xs font-medium text-gray-500">
          {selected.length} de 3 sabores selecionados
        </span>
        {precoInfo && (
          <div className="text-right">
            <span className="text-sm font-bold text-brand-600">{formatCurrency(precoInfo.total)}</span>
            {precoInfo.acrescimo > 0 && (
              <span className="text-[10px] text-gray-400 block">(+R$ 5,00 3º sabor)</span>
            )}
          </div>
        )}
      </div>

      {grupos.map(grupo => (
        <div key={grupo.categoria.id}>
          <div className="flex items-center justify-between mb-2 mt-4 first:mt-0">
            <h3 className="text-sm font-semibold text-gray-700">{grupo.categoria.nome}</h3>
            <span className="text-xs text-gray-400">{formatCurrency(grupo.categoria.preco)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {grupo.sabores.map(s => {
              const isSelected = !!selected.find(x => x.id === s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleToggle(s)}
                  disabled={maxReached && !isSelected}
                  className={`text-left p-3 rounded-xl border-2 transition-all duration-150 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500/30'
                      : 'border-gray-200 bg-white hover:border-gray-300 active:scale-[0.98]'
                  } ${maxReached && !isSelected ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                      isSelected ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isSelected ? '✓' : '🍕'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm">{s.nome}</h4>
                      <span className="inline-block mt-0.5 text-[10px] font-medium text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">
                        {getCategoriaNome(s.categoria_id) || grupo.categoria.nome}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <input
        type="text"
        placeholder="Observação (ex: sem cebola)"
        value={observacao}
        onChange={e => setObservacao(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400"
      />

      <button
        type="button"
        onClick={() => { if (selected.length > 0) { onConfirm(selected, observacao); setSelected([]); setObservacao(''); } }}
        disabled={selected.length === 0}
        className="w-full bg-brand-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all cursor-pointer"
      >
        Adicionar ao carrinho {precoInfo ? `— ${formatCurrency(precoInfo.total)}` : ''}
      </button>
    </div>
  );
}
