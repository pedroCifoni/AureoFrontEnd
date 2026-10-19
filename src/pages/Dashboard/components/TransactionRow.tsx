import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
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
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const TransactionRow = ({ transaction, onEdit, onDelete }: TransactionRowProps) => {
  const isExpense = transaction.type === 'expense';
  const [confirming, setConfirming] = useState(false);

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
      <div className="flex items-center gap-3">
        <span
          className={`font-mono text-sm font-semibold ${isExpense ? 'text-danger' : 'text-success'}`}
        >
          {isExpense ? '- ' : '+ '}
          {formatBRL(Math.abs(transaction.amount))}
        </span>
        {onEdit && (
          <button
            type="button"
            title="Editar"
            onClick={() => onEdit(transaction.id)}
            className="text-text-muted hover:text-gold transition-colors"
          >
            <Pencil size={14} />
          </button>
        )}
        {onDelete &&
          (confirming ? (
            <span className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => onDelete(transaction.id)}
                className="text-danger font-medium"
              >
                Excluir
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="text-text-muted"
              >
                Cancelar
              </button>
            </span>
          ) : (
            <button
              type="button"
              title="Excluir"
              onClick={() => setConfirming(true)}
              className="text-text-muted hover:text-danger transition-colors"
            >
              <Trash2 size={14} />
            </button>
          ))}
      </div>
    </div>
  );
};
