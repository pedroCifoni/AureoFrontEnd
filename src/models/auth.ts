export interface Usuario {
  id?: string;
  nome: string;
  email: string;
}

// ---------------- LOGIN ----------------
// O que você ENVIA para o backend tentar logar
export interface LoginRequest {
  nome: string;
  senha: string;
}


export interface LoginResponse {
  nome: string;
  email: string;
  token: string;
}

// ---------------- CRIAR CONTA ----------------
// O que você ENVIA para criar a conta
export interface CreateUsuarioRequest {
  nome: string;
  email: string;
  senha: string;
}

// O que o backend DEVOLVE após criar a conta
export interface CreateUsuarioResponse {
  id: string;
  nome: string;
  email: string;
  criadoEm: string;
}