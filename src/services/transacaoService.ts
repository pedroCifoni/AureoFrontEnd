import { api } from "./api";
import type {
  CreateTransacaoRequest,
  TransacaoResponse
} from "@/models/transacao";

export const transacaoService = {

  getAll: async (): Promise<TransacaoResponse[]> => {
    const response = await api.get<TransacaoResponse[]>('/api/transacoes');
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

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/transacoes/${id}`);
  },
};
