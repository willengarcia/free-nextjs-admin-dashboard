export type LoginRequest = {
  email: string;
  senha: string;
};

type LoginResponse = {
  id: number;
  nome: string;
  email: string;
  status: string;
  token: string;
};

type CurrentUserResponse = {
  id: number;
  nomeCompleto: string;
  email: string;
  status: string;
  role: string;
};

export type AdminSession = Pick<
  CurrentUserResponse,
  "id" | "nomeCompleto" | "email" | "status" | "role"
>;

export type { CurrentUserResponse, LoginResponse };
