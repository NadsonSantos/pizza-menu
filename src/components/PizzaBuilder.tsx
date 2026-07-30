import { Sabor } from '../types/menu';
import FlavorSelector from './FlavorSelector';
import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';
import { calcularPrecoPizza } from '../utils/pricing';

interface Props {
  onClose: () => void;
}

export default function PizzaBuilder({ onClose }: Props) {
  const { addItem } = useCart();
  const { menu } = useMenu();

  if (!menu) return null;

  const grupos = menu.categorias.map(cat => ({
    categoria: cat,
    sabores: menu.sabores.filter(s => s.categoria_id === cat.id),
  }));

  const handleConfirm = (sabores: Sabor[], observacao: string) => {
    const nome = sabores.length === 1
      ? sabores[0].nome
      : sabores.map(s => s.nome).join(' + ');
    const { total } = calcularPrecoPizza(sabores, menu.categorias);
    addItem({
      tipo: 'pizza',
      nome: `Pizza Grande (${nome})`,
      sabores,
      precoUnitario: total,
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
        <FlavorSelector
          grupos={grupos}
          categorias={menu.categorias}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
}
