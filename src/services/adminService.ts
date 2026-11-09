import { api } from "./api";
import type {
  AtualizarUsuarioAdminRequest,
  ListarTransacoesAdminParams,
  ListarUsuariosParams,
  TransacaoAdmin,
  UsuarioAdmin
} from "@/models/admin";
import type { PagedResult } from "@/models/transacao";

// Remove parâmetros vazios para não enviar "?busca=" à toa.
const limpar = <T extends object>(params: T) =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
  );

export const adminService = {

  listUsuarios: async (params: ListarUsuariosParams = {}): Promise<PagedResult<UsuarioAdmin>> => {
    const response = await api.get<PagedResult<UsuarioAdmin>>('/api/admin/usuarios', {
      params: limpar(params),
    });
    return response.data;
  },

  getUsuario: async (id: string): Promise<UsuarioAdmin> => {
    const response = await api.get<UsuarioAdmin>(`/api/admin/usuarios/${id}`);
    return response.data;
  },

  updateUsuario: async (id: string, data: AtualizarUsuarioAdminRequest): Promise<UsuarioAdmin> => {
    const response = await api.put<UsuarioAdmin>(`/api/admin/usuarios/${id}`, data);
    return response.data;
  },

  deleteUsuario: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/usuarios/${id}`);
  },

  listTransacoes: async (params: ListarTransacoesAdminParams = {}): Promise<PagedResult<TransacaoAdmin>> => {
    const response = await api.get<PagedResult<TransacaoAdmin>>('/api/admin/transacoes', {
      params: limpar(params),
    });
    return response.data;
  },
};
