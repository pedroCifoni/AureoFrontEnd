import { api } from "./api";
import type {
  CreateTransacaoRequest,
  UpdateTransacaoRequest,
  ListarTransacoesParams,
  PagedResult,
  TransacaoResponse
} from "@/models/transacao";

export const transacaoService = {

  list: async (params: ListarTransacoesParams = {}): Promise<PagedResult<TransacaoResponse>> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') query.set(key, String(value));
    });
    const response = await api.get<PagedResult<TransacaoResponse>>(`/api/transacoes?${query}`);
    return response.data;
  },

  getById: async (id: string): Promise<TransacaoResponse> => {
    const response = await api.get<TransacaoResponse>(`/api/transacoes/${id}`);
    return response.data;
  },

  create: async (data: CreateTransacaoRequest): Promise<TransacaoResponse> => {
    const response = await api.post<TransacaoResponse>('/api/transacoes', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTransacaoRequest): Promise<TransacaoResponse> => {
    const response = await api.put<TransacaoResponse>(`/api/transacoes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/transacoes/${id}`);
  },
};
