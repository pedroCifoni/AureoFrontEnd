import type { Papel } from './auth';
import type { ListarTransacoesParams, TipoTransacao } from './transacao';

export interface UsuarioAdmin {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  criadoEm: string;
}

export interface AtualizarUsuarioAdminRequest {
  nome: string;
  email: string;
  papel: Papel;
}

export interface ListarUsuariosParams {
  busca?: string;
  pagina?: number;
  tamanho?: number;
}

export interface TransacaoAdmin {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  descricao: string;
  categoriaId: string;
  categoria: string;
  valor: number;
  tipo: TipoTransacao;
  data: string;
}

export interface ListarTransacoesAdminParams extends ListarTransacoesParams {
  usuarioId?: string;
}
