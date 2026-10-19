import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { TransactionRow } from '../Dashboard/components/TransactionRow';
import { transacaoService } from '@/services/transacaoService';
import type { PagedResult, TransacaoResponse, ListarTransacoesParams } from '@/models/transacao';
import { toTransaction } from '@/utils/transacao';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'sonner';

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

export const TransacoesPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<PagedResult<TransacaoResponse> | null>(null);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  const [busca, setBusca] = useState('');
  const [buscaDebounced, setBuscaDebounced] = useState('');
  const [tipo, setTipo] = useState<'' | '0' | '1'>('');
  const [categoria, setCategoria] = useState('');
  const [categoriaDebounced, setCategoriaDebounced] = useState('');
  const [mes, setMes] = useState('');
  const [ordenarPor, setOrdenarPor] = useState<'Data' | 'Valor'>('Data');
  const [decrescente, setDecrescente] = useState(true);
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      setBuscaDebounced(busca.trim());
      setCategoriaDebounced(categoria.trim());
      setPagina(1);
    }, 400);
    return () => clearTimeout(t);
  }, [busca, categoria]);

  const params: ListarTransacoesParams = {
    busca: buscaDebounced,
    categoria: categoriaDebounced,
    tipo: tipo === '' ? undefined : (Number(tipo) as 0 | 1),
    ...(mes ? intervaloDoMes(mes) : {}),
    ordenarPor,
    decrescente,
    pagina,
    tamanho: TAMANHO,
  };
  const key = `${JSON.stringify(params)}#${reload}`;
  const loading = loadedKey !== key;

  useEffect(() => {
    let cancelled = false;
    transacaoService
      .list(params)
      .then((data) => {
        if (!cancelled) setPage(data);
      })
      .catch((error) => {
        console.error('Erro ao buscar transações', error);
        toast.error(getErrorMessage(error, 'Erro ao carregar transações. Tente novamente mais tarde.'));
      })
      .finally(() => {
        if (!cancelled) setLoadedKey(key);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const transactions = useMemo(() => (page?.itens ?? []).map(toTransaction), [page]);

  const handleDelete = async (id: string) => {
    try {
      await transacaoService.delete(id);
      toast.success('Transação excluída.');
      if (transactions.length === 1 && pagina > 1) setPagina((p) => p - 1);
      else setReload((r) => r + 1);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Falha ao excluir transação.'));
      // 404: item já não existe, atualiza a lista
      setReload((r) => r + 1);
    }
  };

  const mudaFiltro = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPagina(1);
  };

  const totalPaginas = page?.totalPaginas ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Topbar Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Transações</h1>
        <Button onClick={() => navigate('/transacoes/nova')}>
          <Plus size={16} className="mr-2" />
          Adicionar
        </Button>
      </div>

      <Card className="flex flex-col gap-4">
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4 items-end">
          <Input
            label="Buscar"
            placeholder="Descrição..."
            maxLength={200}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <Input
            label="Categoria"
            placeholder="Ex: Alimentação"
            maxLength={100}
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-widest text-text-muted">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => mudaFiltro(setTipo)(e.target.value as '' | '0' | '1')}
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
              onChange={(e) => mudaFiltro(setMes)(e.target.value)}
              className={selectClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-widest text-text-muted">Ordenar por</label>
            <select
              value={ordenarPor}
              onChange={(e) => mudaFiltro(setOrdenarPor)(e.target.value as 'Data' | 'Valor')}
              className={selectClass}
            >
              <option value="Data">Data</option>
              <option value="Valor">Valor</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-widest text-text-muted">Ordem</label>
            <select
              value={decrescente ? 'desc' : 'asc'}
              onChange={(e) => mudaFiltro(setDecrescente)(e.target.value === 'desc')}
              className={selectClass}
            >
              <option value="desc">Decrescente</option>
              <option value="asc">Crescente</option>
            </select>
          </div>
        </div>

        {/* Lista */}
        <div className="flex flex-col">
          {loading && !page ? (
            <div className="py-4 text-center text-sm text-text-muted">Carregando transações...</div>
          ) : transactions.length === 0 ? (
            <div className="py-4 text-center text-sm text-text-muted">Nenhuma transação encontrada.</div>
          ) : (
            <div className={loading ? 'opacity-60 transition-opacity' : ''}>
              {transactions.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  transaction={tx}
                  onEdit={(id) => navigate(`/transacoes/${id}/editar`)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-xs text-text-muted">
              Página {page?.pagina} de {totalPaginas} • {page?.total} transações
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="px-3"
                disabled={pagina <= 1 || loading}
                onClick={() => setPagina((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="secondary"
                className="px-3"
                disabled={pagina >= totalPaginas || loading}
                onClick={() => setPagina((p) => p + 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
