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
