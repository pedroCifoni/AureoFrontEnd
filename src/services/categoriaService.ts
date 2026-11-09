import { api } from "./api";
import type {
  CategoriaResponse,
  CreateCategoriaRequest,
  UpdateCategoriaRequest
} from "@/models/categoria";
import type { TipoTransacao } from "@/models/transacao";

export const categoriaService = {

  list: async (tipo?: TipoTransacao): Promise<CategoriaResponse[]> => {
    const response = await api.get<CategoriaResponse[]>('/api/categorias', {
      params: tipo === undefined ? undefined : { tipo },
    });
    return response.data;
  },

  create: async (data: CreateCategoriaRequest): Promise<CategoriaResponse> => {
    const response = await api.post<CategoriaResponse>('/api/categorias', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoriaRequest): Promise<CategoriaResponse> => {
    const response = await api.put<CategoriaResponse>(`/api/categorias/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/categorias/${id}`);
  },
};
