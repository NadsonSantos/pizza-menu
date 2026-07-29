export interface MenuData {
  pizzaria: PizzariaInfo;
  categorias: Categoria[];
  bebidas: Bebida[];
}

export interface PizzariaInfo {
  nome: string;
  whatsapp: string;
  taxa_entrega: number;
}

export interface Categoria {
  id: string;
  nome: string;
  tipo: 'pizza';
  preco: number;
  sabores: Sabor[];
}

export interface Sabor {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  categoria_id: string;
}

export interface Bebida {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
}
