import { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';
import PizzaBuilder from '../components/PizzaBuilder';
import DrinkCard from '../components/DrinkCard';
import { Categoria, Bebida, Sabor } from '../types/menu';
import { formatCurrency } from '../utils/pricing';

export default function MenuPage() {
  const { menu, loading, error } = useMenu();
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [pizzaBuilderCat, setPizzaBuilderCat] = useState<Categoria | null>(null);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorBox message={error} />;
  if (!menu) return null;

  const tabs = [
    ...menu.categorias.map(c => ({ id: c.id, nome: c.nome })),
    { id: 'bebidas', nome: 'Bebidas' },
  ];

  const selected = activeTab || tabs[0]?.id;

  return (
    <div className="pb-8">
      {/* Category Tabs */}
      <nav className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-4 px-4 scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all cursor-pointer ${
              selected === tab.id
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.nome}
          </button>
        ))}
      </nav>

      {/* Content */}
      {selected === 'bebidas' ? (
        <DrinkSection bebidas={menu.bebidas} onAdd={b => addItem({
          tipo: 'bebida', nome: b.nome, sabores: [],
          precoUnitario: b.preco, quantidade: 1, observacao: '',
        })} />
      ) : (
        <PizzaSection
          categoria={menu.categorias.find(c => c.id === selected)!}
          sabores={menu.sabores.filter(s => s.categoria_id === selected)}
          onBuild={setPizzaBuilderCat}
        /> 
      )}

      {/* Pizza Builder Modal */}
      {pizzaBuilderCat && (
        <PizzaBuilder categoria={pizzaBuilderCat} onClose={() => setPizzaBuilderCat(null)} />
      )}
    </div>
  );
}

function PizzaSection({ categoria, sabores, onBuild }: { categoria: Categoria; sabores: Sabor[]; onBuild: (c: Categoria) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">{categoria.nome}</h2>
        <span className="text-sm font-bold text-red-600">{formatCurrency(categoria.preco)}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {sabores.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => onBuild(categoria)}
            className="bg-white rounded-xl border border-gray-200 p-3 text-left hover:border-gray-300 active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg mb-2">🍕</div>
            <h3 className="font-semibold text-gray-900 text-sm">{s.nome}</h3>
            <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">{s.descricao}</p>
            <p className="text-[11px] text-red-600 font-medium mt-1">Montar →</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function DrinkSection({ bebidas, onAdd }: { bebidas: Bebida[]; onAdd: (b: Bebida) => void }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-gray-900">Bebidas</h2>
      {bebidas.map(b => (
        <DrinkCard key={b.id} bebida={b} onAdd={() => onAdd(b)} />
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex gap-2 overflow-x-auto pb-3">
        {[1,2,3,4].map(i => <div key={i} className="h-9 w-24 bg-gray-200 rounded-full" />)}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-100 rounded-xl" />)}
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p className="text-3xl mb-3">⚠️</p>
      <p className="font-semibold text-red-700 mb-1">Erro ao carregar o cardápio</p>
      <p className="text-sm text-red-600">{message}</p>
    </div>
  );
}
