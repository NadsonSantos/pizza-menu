import { useState, useEffect, useRef } from 'react';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';
import PizzaBuilder from '../components/PizzaBuilder';
import DrinkCard from '../components/DrinkCard';
import { Bebida } from '../types/menu';
import { formatCurrency } from '../utils/pricing';

export default function MenuPage() {
  const { menu, loading, error } = useMenu();
  const { addItem } = useCart();
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [pizzaBuilderOpen, setPizzaBuilderOpen] = useState(false);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // MUST be before early returns to keep hook order stable
  useEffect(() => {
    if (!menu) return;
    // FR-017: primeira categoria como ativa default (ex.: conteúdo curto)
    setActiveCat((prev) => prev ?? menu.categorias[0]?.id ?? null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCat(entry.target.id.replace('cat-', ''));
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [menu]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorBox message={error} />;
  if (!menu) return null;

  const scrollTo = (id: string) => {
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pb-8">
      {/* Sticky Nav — FR-015: fixa abaixo do header do app (~56px), sem sobrepor o z-50 do Layout */}
      <nav className="sticky top-[56px] z-40 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 -mx-4 px-4 py-2 mb-4 flex gap-2 overflow-x-auto scrollbar-none">
        {menu.categorias.map(cat => (
          <button
            key={cat.id}
            onClick={() => scrollTo(cat.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all cursor-pointer ${
              activeCat === cat.id
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat.nome}
          </button>
        ))}
        <button
          onClick={() => scrollTo('bebidas')}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all cursor-pointer ${
            activeCat === 'bebidas'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Bebidas
        </button>
      </nav>

      {/* Category Sections */}
      {menu.categorias.map(cat => (
        <section
          key={cat.id}
          id={`cat-${cat.id}`}
          ref={el => { if (el) sectionRefs.current.set(cat.id, el); }}
          className="mb-8 scroll-mt-[120px]"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">{cat.nome}</h2>
            <span className="text-sm font-bold text-red-600">{formatCurrency(cat.preco)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {menu.sabores.filter(s => s.categoria_id === cat.id).map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setPizzaBuilderOpen(true)}
                className="bg-white rounded-xl border border-gray-200 p-3 text-left hover:border-gray-300 active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg mb-2">🍕</div>
                <h3 className="font-semibold text-gray-900 text-sm">{s.nome}</h3>
                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">{s.descricao}</p>
                <p className="text-[11px] text-red-600 font-medium mt-1">Montar →</p>
              </button>
            ))}
          </div>
        </section>
      ))}

      {/* Bebidas Section — FR-016: registrada no IntersectionObserver para destacar o item "Bebidas" */}
      <section
        id="cat-bebidas"
        ref={el => { if (el) sectionRefs.current.set('bebidas', el); }}
        className="scroll-mt-[120px]"
      >
        <DrinkSection bebidas={menu.bebidas} onAdd={b => addItem({
          tipo: 'bebida', nome: b.nome, sabores: [],
          precoUnitario: b.preco, quantidade: 1, observacao: '',
        })} />
      </section>

      {/* Pizza Builder Modal */}
      {pizzaBuilderOpen && (
        <PizzaBuilder onClose={() => setPizzaBuilderOpen(false)} />
      )}
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
      <div className="h-9 bg-gray-200 rounded-full w-64" />
      {[1,2,3].map(i => (
        <div key={i} className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="grid grid-cols-2 gap-3">
            {[1,2].map(j => <div key={j} className="h-28 bg-gray-100 rounded-xl" />)}
          </div>
        </div>
      ))}
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
