export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export type AdminDashboard = {
  pedidos: Record<string, number>;
  pagamentos: Record<string, number>;
  clientes: Record<string, number>;
  produtos: Record<string, number>;
};

export type AdminProduct = {
  id: number;
  nome: string;
  sku: string;
  preco: number;
  precoPromocional: number | null;
  quantidadeEstoque: number;
  quantidadeDisponivel: number;
  estoqueMinimo: number;
  status: string;
  categoriaId: number | null;
  categoriaNome: string | null;
  brandId: number | null;
  brandName: string | null;
};

export type AdminCategoryTree = {
  id: number;
  name: string;
  description: string;
  ativo: boolean;
  parentCategoryId: number | null;
  children: AdminCategoryTree[];
};

export type AdminBrand = {
  id: number;
  name: string;
  slug: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
};

export type AdminOrder = {
  orderId: number;
  valorTotal: number;
  status: string;
  customer: { nomeCompleto: string; email: string; telefone?: string };
  address?: { rua: string; numero: string; bairro: string; cidade: string; estado: string; cep: string };
  items: Array<{ nomeProduto: string; quantidade: number; precoUnitario: number; subTotal: number }>;
};

export type AdminPayment = {
  id: number;
  orderId: number;
  metodoPagamento: string;
  statusPagamento: string;
  provider: string;
  valor: number;
  dataCriacao: string;
};

export type AdminCustomer = {
  id: number;
  nomeCompleto: string;
  email: string;
  telefone: string;
  status: string;
  role: "ADMIN" | "CUSTOMER";
  dataCriacao: string;
};
