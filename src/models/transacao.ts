// 0 = Receita, 1 = Despesa
export type TipoTransacao = 0 | 1;

export interface TransacaoResponse {
  id: string;
  descricao: string;
  categoria: string;
  valor: number;
  tipo: TipoTransacao;
  data: string;
}

export interface CreateTransacaoRequest {
  descricao: string;
  categoria: string;
  valor: number;
  tipo: TipoTransacao;
  data: string;
}

// PUT /api/transacoes/{id}: substituição completa, mesmo corpo do POST
export type UpdateTransacaoRequest = CreateTransacaoRequest;

export interface PagedResult<T> {
  itens: T[];
  pagina: number;
  tamanho: number;
  total: number;
  totalPaginas: number;
}

export interface ListarTransacoesParams {
  dataInicio?: string;
  dataFim?: string;
  tipo?: TipoTransacao;
  categoria?: string;
  busca?: string;
  ordenarPor?: 'Data' | 'Valor';
  decrescente?: boolean;
  pagina?: number;
  tamanho?: number;
}
