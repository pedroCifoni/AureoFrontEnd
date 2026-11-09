import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { adminService } from '@/services/adminService';
import type { ListarTransacoesAdminParams, TransacaoAdmin, UsuarioAdmin } from '@/models/admin';
import type { PagedResult } from '@/models/transacao';
import { formatBRL } from '@/utils/format';
import { getErrorMessage } from '@/utils/errors';

const TAMANHO = 20;
const selectClass =
  'w-full bg-elevated border border-border rounded-button px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors appearance-none';

// 'YYYY-MM' -> intervalo [início do mês, fim do mês] em ISO UTC
const intervaloDoMes = (mes: string) => {
  const [ano, m] = mes.split('-').map(Number);
  return {
    dataInicio: new Date(ano, m - 1, 1).toISOString(),
    dataFim: new Date(ano, m, 0, 23, 59, 59, 999).toISOString(),
  };
};

export const AdminTransacoesPage = () => {
  // O filtro de usuário vive na URL para o link "Ver transações" da tela de usuários funcionar.
  const [searchParams, setSearchParams] = useSearchParams();
  const usuarioId = searchParams.get('usuarioId') ?? '';

  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [page, setPage] = useState<PagedResult<TransacaoAdmin> | null>(null);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  const [busca, setBusca] = useState('');
  const [buscaDebounced, setBuscaDebounced] = useState('');
  const [tipo, setTipo] = useState<'' | '0' | '1'>('');
  const [mes, setMes] = useState('');
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    // 100 é o teto do backend; suficiente para o seletor enquanto a base é pequena.
    adminService
      .listUsuarios({ tamanho: 100 })
      .then((data) => setUsuarios(data.itens))
      .catch((error) => toast.error(getErrorMessage(error, 'Erro ao carregar usuários.')));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setBuscaDebounced(busca.trim());
      setPagina(1);
    }, 400);
    return () => clearTimeout(t);
  }, [busca]);

  const params: ListarTransacoesAdminParams = {
    usuarioId: usuarioId || undefined,
    busca: buscaDebounced,
    tipo: tipo === '' ? undefined : (Number(tipo) as 0 | 1),
    ...(mes ? intervaloDoMes(mes) : {}),
    pagina,
    tamanho: TAMANHO,
  };
  const key = JSON.stringify(params);
  const loading = loadedKey !== key;

  useEffect(() => {
    let cancelled = false;
    adminService
      .listTransacoes(params)
      .then((data) => {
        if (!cancelled) setPage(data);
      })
      .catch((error) => toast.error(getErrorMessage(error, 'Erro ao carregar transações.')))
      .finally(() => {
        if (!cancelled) setLoadedKey(key);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const mudaUsuario = (id: string) => {
    setSearchParams(id ? { usuarioId: id } : {});
    setPagina(1);
  };

  const totalPaginas = page?.totalPaginas ?? 0;
  const transacoes = page?.itens ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-text-primary">Transações dos usuários</h1>

      <Card className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-widest text-text-muted">Usuário</label>
            <select value={usuarioId} onChange={(e) => mudaUsuario(e.target.value)} className={selectClass}>
              <option value="">Todos</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Buscar"
            placeholder="Descrição..."
            maxLength={200}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-widest text-text-muted">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value as '' | '0' | '1');
                setPagina(1);
              }}
              className={selectClass}
            >
              <option value="">Todos</option>
              <option value="0">Receita</option>
              <option value="1">Despesa</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-widest text-text-muted">Mês</label>
            <input
              type="month"
              value={mes}
              onChange={(e) => {
                setMes(e.target.value);
                setPagina(1);
              }}
              className={selectClass}
            />
          </div>
        </div>

        {loading && !page ? (
          <div className="py-4 text-center text-sm text-text-muted">Carregando transações...</div>
        ) : transacoes.length === 0 ? (
          <div className="py-4 text-center text-sm text-text-muted">Nenhuma transação encontrada.</div>
        ) : (
          <div className={`overflow-x-auto ${loading ? 'opacity-60 transition-opacity' : ''}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-text-muted border-b border-border">
                  <th className="py-2 pr-4 font-medium">Data</th>
                  <th className="py-2 pr-4 font-medium">Usuário</th>
                  <th className="py-2 pr-4 font-medium">Descrição</th>
                  <th className="py-2 pr-4 font-medium">Categoria</th>
                  <th className="py-2 font-medium text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((t) => {
                  const despesa = t.tipo === 1;
                  return (
                    <tr key={t.id} className="border-b border-border last:border-0">
                      <td className="py-3 pr-4 text-text-secondary whitespace-nowrap">
                        {new Date(t.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 pr-4 font-medium text-text-primary">{t.usuarioNome}</td>
                      <td className="py-3 pr-4 text-text-primary">{t.descricao}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={despesa ? 'danger' : 'success'}>{t.categoria}</Badge>
                      </td>
                      <td
                        className={`py-3 text-right font-mono font-semibold whitespace-nowrap ${
                          despesa ? 'text-danger' : 'text-success'
                        }`}
                      >
                        {despesa ? '- ' : '+ '}
                        {formatBRL(Math.abs(t.valor))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPaginas > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-xs text-text-muted">
              Página {page?.pagina} de {totalPaginas} • {page?.total} transações
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" className="px-3" disabled={pagina <= 1 || loading} onClick={() => setPagina((p) => p - 1)}>
                <ChevronLeft size={16} />
              </Button>
              <Button variant="secondary" className="px-3" disabled={pagina >= totalPaginas || loading} onClick={() => setPagina((p) => p + 1)}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
