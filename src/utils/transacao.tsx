import { ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';
import type { TransacaoResponse } from '@/models/transacao';
import type { Transaction } from '@/pages/Dashboard/components/TransactionRow';

export const TIPO_RECEITA = 0;
export const TIPO_DESPESA = 1;

export const toTransaction = (t: TransacaoResponse): Transaction => {
  let icon = <DollarSign size={16} />;
  if (t.categoria?.toLowerCase().includes('alimenta')) icon = <ShoppingCart size={16} />;
  else if (t.tipo === TIPO_RECEITA) icon = <TrendingUp size={16} />;

  const date = t.data
    ? new Date(t.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  const valor = Math.abs(t.valor);
  const isExpense = t.tipo === TIPO_DESPESA;

  return {
    id: t.id,
    description: t.descricao,
    date,
    category: t.categoria,
    amount: isExpense ? -valor : valor,
    type: isExpense ? 'expense' : 'income',
    icon,
  };
};

export const calcTotais = (list: TransacaoResponse[]) => {
  const receitas = list
    .filter((t) => t.tipo === TIPO_RECEITA)
    .reduce((acc, t) => acc + Math.abs(t.valor), 0);
  const despesas = list
    .filter((t) => t.tipo === TIPO_DESPESA)
    .reduce((acc, t) => acc + Math.abs(t.valor), 0);
  return { receitas, despesas, saldo: receitas - despesas };
};
