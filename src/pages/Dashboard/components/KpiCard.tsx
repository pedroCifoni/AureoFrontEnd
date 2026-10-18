import React from 'react';
import { Card } from '@/components/ui/Card';

interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: React.ReactNode;
}

export const KpiCard = ({ label, value, change, positive, icon }: KpiCardProps) => (
  <Card className="flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium uppercase tracking-widest text-text-muted">{label}</span>
      <span className="text-gold">{icon}</span>
    </div>
    <span className="font-mono text-2xl font-bold text-text-primary">{value}</span>
    {change && (
      <span className={`text-xs font-medium ${positive ? 'text-success' : 'text-danger'}`}>
        {change} vs. mês anterior
      </span>
    )}
  </Card>
);
