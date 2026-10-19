import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { KpiCard } from './components/KpiCard';
import { TransactionRow } from './components/TransactionRow';
import { formatBRL } from '@/utils/format';
import { transacaoService } from '@/services/transacaoService';
import type { TransacaoResponse } from '@/models/transacao';
import { TIPO_DESPESA, calcTotais, toTransaction } from '@/utils/transacao';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'sonner';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<TransacaoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Paliativo: sem endpoint de resumo, usa a maior página (100) para os agregados.
        const data = await transacaoService.list({ tamanho: 100 });
        setItems(data.itens);
      } catch (error) {
        console.error(error);
        toast.error(getErrorMessage(error, 'Erro ao carregar o dashboard.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const { receitas, despesas, saldo } = useMemo(() => calcTotais(items), [items]);

  const recentes = useMemo(
    () =>
      [...items]
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, 5)
        .map(toTransaction),
    [items]
  );

  const porCategoria = useMemo(() => {
    const map = new Map<string, number>();
    items
      .filter((t) => t.tipo === TIPO_DESPESA)
      .forEach((t) => map.set(t.categoria, (map.get(t.categoria) ?? 0) + Math.abs(t.valor)));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);

  const porMes = useMemo(() => {
    const map = new Map<string, { receitas: number; despesas: number }>();
    items.forEach((t) => {
      const d = new Date(t.data);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const cur = map.get(key) ?? { receitas: 0, despesas: 0 };
      if (t.tipo === TIPO_DESPESA) cur.despesas += Math.abs(t.valor);
      else cur.receitas += Math.abs(t.valor);
      map.set(key, cur);
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-6);
  }, [items]);

  const maxMes = Math.max(1, ...porMes.flatMap(([, v]) => [v.receitas, v.despesas]));
  const totalDespesas = porCategoria.reduce((acc, [, v]) => acc + v, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Topbar Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Dashboard</h1>
        <Button onClick={() => navigate('/transacoes/nova')}>
          <Plus size={16} className="mr-2" />
          Nova transação
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label="Saldo Total" value={formatBRL(saldo)} icon={<Wallet size={18} />} />
        <KpiCard label="Receitas" value={formatBRL(receitas)} icon={<TrendingUp size={18} />} />
        <KpiCard label="Despesas" value={formatBRL(despesas)} icon={<TrendingDown size={18} />} />
      </div>

      {/* Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-base font-semibold text-text-primary">Evolução Mensal</h3>
          {loading ? (
            <div className="py-4 text-center text-sm text-text-muted">Carregando...</div>
          ) : porMes.length === 0 ? (
            <div className="py-4 text-center text-sm text-text-muted">Sem dados para exibir.</div>
          ) : (
            <div className="flex items-end gap-4 h-[250px] bg-elevated rounded-button border border-border p-4">
              {porMes.map(([key, v]) => {
                const [ano, mes] = key.split('-');
                return (
                  <div key={key} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="flex items-end gap-1 w-full flex-1">
                      <div
                        className="flex-1 bg-success rounded-t"
                        style={{ height: `${(v.receitas / maxMes) * 100}%` }}
                        title={`Receitas: ${formatBRL(v.receitas)}`}
                      />
                      <div
                        className="flex-1 bg-danger rounded-t"
                        style={{ height: `${(v.despesas / maxMes) * 100}%` }}
                        title={`Despesas: ${formatBRL(v.despesas)}`}
                      />
                    </div>
                    <span className="text-xs text-text-muted">{mes}/{ano.slice(2)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="col-span-1 flex flex-col gap-4">
          <h3 className="text-base font-semibold text-text-primary">Últimas Transações</h3>
          <div className="flex flex-col">
            {loading ? (
              <div className="py-4 text-center text-sm text-text-muted">Carregando...</div>
            ) : recentes.length === 0 ? (
              <div className="py-4 text-center text-sm text-text-muted">Nenhuma transação.</div>
            ) : (
              recentes.map((tx) => <TransactionRow key={tx.id} transaction={tx} />)
            )}
          </div>
          <Button variant="secondary" className="w-full mt-2" onClick={() => navigate('/transacoes')}>
            Ver todas
          </Button>
        </Card>
      </div>

      <Card className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-text-primary">Despesas por Categoria</h3>
        {porCategoria.length === 0 ? (
          <div className="py-4 text-center text-sm text-text-muted">Sem despesas registradas.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {porCategoria.map(([categoria, valor]) => {
              const pct = totalDespesas ? (valor / totalDespesas) * 100 : 0;
              return (
                <div key={categoria} className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-primary font-medium">{categoria}</span>
                    <span className="text-text-secondary">
                      {formatBRL(valor)} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="bg-elevated rounded-full h-2 w-full overflow-hidden">
                    <div className="bg-gold h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
