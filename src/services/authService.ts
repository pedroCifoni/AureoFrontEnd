import { api } from "./api";
import type { 
  LoginRequest, 
  LoginResponse, 
  CreateUsuarioRequest, 
  CreateUsuarioResponse 
} from "@/models/auth";

export const authService = {
  
  login: async (data: LoginRequest): Promise<void> => {
    const response = await api.post<LoginResponse>('/api/usuarios/login', data);
    
    
    const token = response.data.token;
    const nome = response.data.nome;
    const email = response.data.email;

    if (!token) {
      throw new Error('Resposta de login sem token.');
    }
    localStorage.setItem('aureo_token', token);
    localStorage.setItem('aureo_user', JSON.stringify({ nome, email }));
  }, 

  
  register: async (data: CreateUsuarioRequest): Promise<void> => {
    await api.post<CreateUsuarioResponse>('/api/usuarios', data);
  },

  logout: () => {
    localStorage.removeItem('aureo_token');
    localStorage.removeItem('aureo_user');
  },
};