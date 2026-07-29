import { Link } from 'react-router-dom';

export default function EmptyCart() {
  return (
    <div className="text-center py-16">
      <p className="text-5xl mb-4">🛒</p>
      <h2 className="text-xl font-semibold text-gray-700">Seu carrinho está vazio</h2>
      <p className="text-gray-400 text-sm mt-2">Adicione pizzas e bebidas do cardápio!</p>
      <Link to="/" className="inline-block mt-8 px-8 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors">
        Ver Cardápio
      </Link>
    </div>
  );
}
