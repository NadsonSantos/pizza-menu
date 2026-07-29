import { MenuData } from '../types/menu';

export async function loadMenu(): Promise<MenuData> {
  try {
    const response = await fetch('/menu.json');
    if (!response.ok) {
      throw new Error(`Erro ao carregar o cardápio (HTTP ${response.status}).`);
    }
    const data: MenuData = await response.json();
    validateMenu(data);
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        'Erro ao carregar o cardápio. O arquivo menu.json está mal formatado. ' +
        'Verifique se todas as vírgulas e chaves estão corretas.'
      );
    }
    throw error;
  }
}

function validateMenu(data: MenuData): void {
  if (!data.pizzaria?.nome || !data.pizzaria?.whatsapp) {
    throw new Error('menu.json: faltam dados da pizzaria (nome, whatsapp).');
  }
  if (!Array.isArray(data.categorias) || data.categorias.length === 0) {
    throw new Error('menu.json: o campo "categorias" está vazio ou ausente.');
  }
  for (const cat of data.categorias) {
    if (!Array.isArray(cat.sabores) || cat.sabores.length === 0) {
      throw new Error(`menu.json: a categoria "${cat.nome}" não tem sabores.`);
    }
    if (typeof cat.preco !== 'number' || cat.preco <= 0) {
      throw new Error(`menu.json: preço inválido na categoria "${cat.nome}".`);
    }
  }
}
