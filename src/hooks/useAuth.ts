import type { Usuario } from '@/models/auth';

const lerUsuario = (): Usuario | null => {
  try {
    return JSON.parse(localStorage.getItem('aureo_user') ?? 'null');
  } catch {
    return null;
  }
};

export const useAuth = () => {
  const token = localStorage.getItem('aureo_token');
  const usuario = lerUsuario();
  return {
    isAuthenticated: !!token,
    // Só esconde/mostra telas: quem protege os dados é o backend (403 sem o papel).
    isAdmin: usuario?.papel === 'Admin',
    usuario,
    isLoading: false,
  };
};
