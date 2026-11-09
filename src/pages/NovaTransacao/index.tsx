import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { transacaoService } from '@/services/transacaoService';
import { categoriaService } from '@/services/categoriaService';
import type { CreateTransacaoRequest } from '@/models/transacao';
import type { CategoriaResponse } from '@/models/categoria';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';

export const NovaTransacaoPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState(isEdit);
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
  const [formData, setFormData] = useState<CreateTransacaoRequest>({
    descricao: '',
    categoriaId: '',
    valor: 0,
    tipo: 1,
    data: new Date().toLocaleDateString('en-CA'),
  });

  useEffect(() => {
    categoriaService
      .list()
      .then(setCategorias)
      .catch((error) => toast.error(getErrorMessage(error, 'Erro ao carregar categorias.')));
  }, []);

  useEffect(() => {
    if (!id) return;
    transacaoService
      .getById(id)
      .then((t) =>
        setFormData({
          descricao: t.descricao,
          categoriaId: t.categoriaId,
          valor: Math.abs(t.valor),
          tipo: t.tipo,
          data: new Date(t.data).toLocaleDateString('en-CA'),
        })
      )
      .catch((error) => {
        toast.error(getErrorMessage(error, 'Transação não encontrada.'));
        navigate('/transacoes', { replace: true });
      })
      .finally(() => setLoadingItem(false));
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'valor' || name === 'tipo' ? Number(value) : value,
      // A categoria precisa ter o mesmo tipo da transação.
      ...(name === 'tipo' ? { categoriaId: '' } : {}),
    }));
  };

  const categoriasDoTipo = categorias.filter((c) => c.tipo === formData.tipo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao.trim() || formData.descricao.length > 200) {
      toast.error('Descrição é obrigatória (até 200 caracteres).');
      return;
    }
    if (!formData.categoriaId) {
      toast.error('Selecione uma categoria.');
      return;
    }
    if (!(formData.valor > 0)) {
      toast.error('Valor deve ser maior que zero.');
      return;
    }
    try {
      setLoading(true);
      const body = {
        ...formData,
        data: new Date(`${formData.data}T12:00:00`).toISOString(),
      };
      if (id) await transacaoService.update(id, body);
      else await transacaoService.create(body);
      toast.success('Transação salva com sucesso!');
      navigate('/transacoes');
    } catch (error) {
      console.error('Erro detalhado:', error);
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
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          {isEdit ? 'Editar Transação' : 'Nova Transação'}
        </h1>
      </div>

      {loadingItem ? (
        <div className="py-4 text-center text-sm text-text-muted">Carregando...</div>
      ) : (
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
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-medium uppercase tracking-widest text-text-muted">
                Categoria
              </label>
              <select
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                required
                className="w-full bg-elevated border border-border rounded-button px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors appearance-none"
              >
                <option value="">Selecione...</option>
                {categoriasDoTipo.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
              {categoriasDoTipo.length === 0 && (
                <span className="text-xs text-text-muted">
                  Nenhuma categoria deste tipo.{' '}
                  <Link to="/categorias" className="text-gold hover:text-gold-muted">
                    Criar categoria
                  </Link>
                </span>
              )}
            </div>

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
      )}
    </div>
  );
};
