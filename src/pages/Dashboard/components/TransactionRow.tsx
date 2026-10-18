import React from 'react';
import { formatBRL } from '@/utils/format';

export interface Transaction {
  id: string;
  description: string;
  date: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  icon?: React.ReactNode;
}

interface TransactionRowProps {
  transaction: Transaction;
}

export const TransactionRow = ({ transaction }: TransactionRowProps) => {
  const isExpense = transaction.type === 'expense';

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center text-gold">
          {transaction.icon}
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">{transaction.description}</p>
          <p className="text-xs text-text-muted">
            {transaction.date} • {transaction.category}
          </p>
        </div>
      </div>
      <span
        className={`font-mono text-sm font-semibold ${isExpense ? 'text-danger' : 'text-success'}`}
      >
        {isExpense ? '- ' : '+ '}
        {formatBRL(Math.abs(transaction.amount))}
      </span>
    </div>
  );
};
