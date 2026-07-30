import { Sabor, Categoria } from '../types/menu';

export function calcularPrecoPizza(sabores: Sabor[], categorias: Categoria[]): {
  precoBase: number;
  acrescimo: number;
  total: number;
} {
  if (sabores.length < 1 || sabores.length > 3) {
    throw new Error('Pizza deve ter de 1 a 3 sabores');
  }

  const precos = new Map(categorias.map(c => [c.id, c.preco]));
  const precosSabores = sabores.map(s => precos.get(s.categoria_id) ?? 0);
  const precoBase = Math.max(...precosSabores);
  const acrescimo = sabores.length === 3 ? 5 : 0;
  const total = precoBase + acrescimo;

  return { precoBase, acrescimo, total };
}

export function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}
