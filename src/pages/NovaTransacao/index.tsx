import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { transacaoService } from '@/services/transacaoService';
import type { CreateTransacaoRequest } from '@/models/transacao';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';

export const NovaTransacaoPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTransacaoRequest>({
    descricao: '',
    categoria: '',
    valor: 0,
    tipo: 1,
    data: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'valor' || name === 'tipo' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao.trim() || formData.descricao.length > 200) {
      toast.error('Descrição é obrigatória (até 200 caracteres).');
      return;
    }
    if (!formData.categoria.trim() || formData.categoria.length > 100) {
      toast.error('Categoria é obrigatória (até 100 caracteres).');
      return;
    }
    if (!(formData.valor > 0)) {
      toast.error('Valor deve ser maior que zero.');
      return;
    }
    try {
      setLoading(true);
      await transacaoService.create({
        ...formData,
        data: new Date(`${formData.data}T12:00:00`).toISOString(),
      });
      toast.success('Transação salva com sucesso!');
      navigate('/transacoes');
    } catch (error: any) {
      console.error('Erro detalhado:', error.response?.data || error);
      toast.error(getErrorMessage(error, 'Falha ao salvar transação.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate('/transacoes')} className="px-3">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Nova Transação</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Descrição"
            name="descricao"
            placeholder="Ex: Supermercado"
            value={formData.descricao}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Valor"
              name="valor"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={formData.valor || ''}
              onChange={handleChange}
              required
            />

            <Input
              label="Data"
              name="data"
              type="date"
              value={formData.data}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Categoria"
              name="categoria"
              placeholder="Ex: Alimentação"
              value={formData.categoria}
              onChange={handleChange}
              required
            />

            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-medium uppercase tracking-widest text-text-muted">
                Tipo
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
                className="w-full bg-elevated border border-border rounded-button px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors appearance-none"
              >
                <option value={1}>Despesa</option>
                <option value={0}>Receita</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border mt-2">
            <Button type="submit" disabled={loading}>
              {loading ? (
                'Salvando...'
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
