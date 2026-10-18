import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { TransactionRow } from '../Dashboard/components/TransactionRow';
import { transacaoService } from '@/services/transacaoService';
import type { TransacaoResponse } from '@/models/transacao';
import { toTransaction } from '@/utils/transacao';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'sonner';

export const TransacoesPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<TransacaoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState<'todos' | '0' | '1'>('todos');
  const [mes, setMes] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setItems(await transacaoService.getAll());
      } catch (error) {
        console.error('Erro ao buscar transações', error);
        toast.error(getErrorMessage(error, 'Erro ao carregar transações. Tente novamente mais tarde.'));
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const transactions = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return [...items]
      .filter((t) => tipo === 'todos' || String(t.tipo) === tipo)
      .filter((t) => !termo || t.descricao.toLowerCase().includes(termo))
      .filter((t) => {
        if (!mes) return true;
        const d = new Date(t.data);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === mes;
      })
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .map(toTransaction);
  }, [items, busca, tipo, mes]);

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
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
          <Input
            label="Buscar"
            placeholder="Descrição..."
            className="flex-1"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-medium uppercase tracking-widest text-text-muted">
              Tipo
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'todos' | '0' | '1')}
              className="w-full bg-elevated border border-border rounded-button px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors appearance-none"
            >
              <option value="todos">Todos</option>
              <option value="0">Receita</option>
              <option value="1">Despesa</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-medium uppercase tracking-widest text-text-muted">
              Mês
            </label>
            <input
              type="month"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="w-full bg-elevated border border-border rounded-button px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors"
            />
          </div>
        </div>

        {/* Lista */}
        <div className="flex flex-col">
          {loading ? (
            <div className="py-4 text-center text-sm text-text-muted">Carregando transações...</div>
          ) : transactions.length === 0 ? (
            <div className="py-4 text-center text-sm text-text-muted">Nenhuma transação encontrada.</div>
          ) : (
            transactions.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} />
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
