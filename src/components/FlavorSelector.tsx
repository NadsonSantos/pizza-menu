import { useEffect, useRef, useState } from 'react';
import { Sabor, Categoria } from '../types/menu';
import { calcularPrecoPizza, formatCurrency } from '../utils/pricing';
import { useMenu } from '../context/MenuContext';
import ThirdFlavorModal from './ThirdFlavorModal';

interface Props {
  grupos: { categoria: Categoria; sabores: Sabor[] }[];
  categorias: Categoria[];
  preselectedSabor?: Sabor;
  onConfirm: (sabores: Sabor[], observacao: string) => void;
}

// US2 (FR-008): comunica a regra "2 sabores padrão / 3º sabor + R$ 5,00" por estado
function getIndicadorLabel(count: number): string {
  if (count === 0) return 'Inclui até 2 sabores como padrão';
  if (count === 1) return '1 sabor • até 2 no padrão';
  if (count === 2) return '2 sabores (padrão) • 3º sabor + R$ 5,00';
  return '3º sabor + R$ 5,00 aplicado • máximo 3 sabores'; // FR-007: mensagem explícita de máximo
}

export default function FlavorSelector({ grupos, categorias, preselectedSabor, onConfirm }: Props) {
  const [selected, setSelected] = useState<Sabor[]>(preselectedSabor ? [preselectedSabor] : []);
  const [observacao, setObservacao] = useState('');
  // US1: sabor candidato a 3º, aguardando confirmação no modal (data-model.md)
  const [pendingThirdSabor, setPendingThirdSabor] = useState<Sabor | null>(null);
  // US4 (FR-011): garante que a rolagem automática ocorra uma única vez na abertura
  const hasAutoScrolled = useRef(false);
  const { getCategoriaNome } = useMenu();

  const maxReached = selected.length >= 3;

  // US4 (FR-010/FR-011): rolagem automática única até o sabor pré-selecionado,
  // após a montagem dos cards. Rolagem manual posterior não é interrompida.
  useEffect(() => {
    if (!preselectedSabor || hasAutoScrolled.current) return;
    hasAutoScrolled.current = true;
    const el = document.getElementById(`sabor-${preselectedSabor.id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [preselectedSabor]);

  const handleToggle = (sabor: Sabor) => {
    if (selected.find(s => s.id === sabor.id)) {
      // desselecionar (inclusive 3 → 2: remove o adicional sem abrir modal)
      setSelected(prev => prev.filter(s => s.id !== sabor.id));
      return;
    }
    if (selected.length >= 3) return; // FR-007: 4º sabor bloqueado (botões disabled)
    if (selected.length === 2) {
      // US1 (FR-002): transição 2 → 3 exige confirmação do adicional de R$ 5,00
      setPendingThirdSabor(sabor);
      return;
    }
    setSelected(prev => [...prev, sabor]);
  };

  const confirmarTerceiroSabor = () => {
    if (!pendingThirdSabor) return;
    // FR-005: fluxo atual mantido — calcularPrecoPizza reflete o + R$ 5,00 automaticamente
    setSelected(prev => [...prev, pendingThirdSabor]);
    setPendingThirdSabor(null);
  };

  const cancelarTerceiroSabor = () => setPendingThirdSabor(null);

  const precoInfo = selected.length > 0 ? calcularPrecoPizza(selected, categorias) : null;

  return (
    <div>
      {/* Indicador sticky — US3 (FR-009/SC-004): full-bleed (-mx-5 px-5 acompanha o p-5 do
          painel do PizzaBuilder), fundo sólido + borda, sem "flutuar" sobre os cards */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 -mx-5 px-5 py-2 flex items-center justify-between">
        <span aria-live="polite" className="text-xs font-medium text-gray-600">
          {getIndicadorLabel(selected.length)}
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

      <div className="space-y-3 pt-3">
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
                    id={`sabor-${s.id}`}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleToggle(s)}
                    disabled={maxReached && !isSelected}
                    className={`text-left p-3 rounded-xl border-2 transition-all duration-150 scroll-mt-12 ${
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

      {/* US1: modal do 3º sabor — única via para a transição 2 → 3 (spec: Assumptions) */}
      {pendingThirdSabor && (
        <ThirdFlavorModal
          sabor={pendingThirdSabor}
          onConfirm={confirmarTerceiroSabor}
          onCancel={cancelarTerceiroSabor}
        />
      )}
    </div>
  );
}