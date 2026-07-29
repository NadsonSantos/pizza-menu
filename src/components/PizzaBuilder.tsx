import { Categoria } from '../types/menu';
import FlavorSelector from './FlavorSelector';
import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';

interface Props {
  categoria: Categoria;
  onClose: () => void;
}

export default function PizzaBuilder({ categoria, onClose }: Props) {
  const { addItem } = useCart();
  const { menu } = useMenu();

  const categoriaPrecos = new Map(
    menu?.categorias.map(c => [c.id, c.preco]) ?? []
  );

  const handleConfirm = (sabores: typeof categoria.sabores, observacao: string) => {
    const nome = sabores.length === 1
      ? sabores[0].nome
      : sabores.map(s => s.nome).join(' + ');
    addItem({
      tipo: 'pizza',
      nome: `Pizza Grande (${nome})`,
      sabores,
      precoUnitario: (() => {
        const precos = sabores.map(s => categoriaPrecos.get(s.categoria_id) ?? 0);
        return Math.max(...precos) + (sabores.length === 3 ? 5 : 0);
      })(),
      quantidade: 1,
      observacao,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[85dvh] overflow-y-auto p-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Montar Pizza</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer">&times;</button>
        </div>
        <p className="text-xs text-gray-500 mb-3">Categoria: <span className="font-medium text-gray-700">{categoria.nome}</span> — a partir de R$ {categoria.preco.toFixed(2).replace('.', ',')}</p>
        <FlavorSelector
          sabores={categoria.sabores.map(s => ({ ...s, categoria_id: categoria.id }))}
          categoriaPrecos={categoriaPrecos}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
}
