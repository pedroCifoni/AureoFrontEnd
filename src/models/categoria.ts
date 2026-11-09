import type { TipoTransacao } from './transacao';

export interface CategoriaResponse {
  id: string;
  nome: string;
  tipo: TipoTransacao;
  cor: string;
  icone: string | null;
}

export interface CreateCategoriaRequest {
  nome: string;
  tipo: TipoTransacao;
  cor?: string;
  icone?: string;
}

// O tipo não muda depois de criada.
export type UpdateCategoriaRequest = Omit<CreateCategoriaRequest, 'tipo'>;
