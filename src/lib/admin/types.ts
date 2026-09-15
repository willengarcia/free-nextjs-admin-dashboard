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
  categoriaNome: string | null;
};

export type AdminOrder = {
  orderId: number;
  valorTotal: number;
  status: string;
  customer: { nomeCompleto: string; email: string };
  items: Array<{ nomeProduto: string; quantidade: number }>;
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
