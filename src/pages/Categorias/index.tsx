import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { categoriaService } from '@/services/categoriaService';
import type { CategoriaResponse } from '@/models/categoria';
import type { TipoTransacao } from '@/models/transacao';
import { getErrorMessage } from '@/utils/errors';

const COR_PADRAO = '#6B7280';
const selectClass =
  'w-full bg-elevated border border-border rounded-button px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors appearance-none';

interface FormState {
  id: string | null; // null = criando
  nome: string;
  tipo: TipoTransacao;
  cor: string;
  icone: string;
}

const formVazio: FormState = { id: null, nome: '', tipo: 1, cor: COR_PADRAO, icone: '' };

export const CategoriasPage = () => {
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(formVazio);
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);

  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    categoriaService
      .list()
      .then((data) => {
        if (!cancelled) setCategorias(data);
      })
      .catch((error) => toast.error(getErrorMessage(error, 'Erro ao carregar categorias.')))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reload]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || form.nome.length > 50) {
      toast.error('Nome é obrigatório (até 50 caracteres).');
      return;
    }
    try {
      setSaving(true);
      const dados = { nome: form.nome.trim(), cor: form.cor, icone: form.icone.trim() || undefined };
      if (form.id) await categoriaService.update(form.id, dados);
      else await categoriaService.create({ ...dados, tipo: form.tipo });
      toast.success(form.id ? 'Categoria atualizada.' : 'Categoria criada.');
      setForm(formVazio);
      setReload((r) => r + 1);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Falha ao salvar categoria.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoriaService.delete(id);
      toast.success('Categoria excluída.');
      setConfirmandoId(null);
      setReload((r) => r + 1);
    } catch (error) {
      // 409: categoria em uso por transações
      toast.error(getErrorMessage(error, 'Falha ao excluir categoria.'));
      setConfirmandoId(null);
    }
  };

  const editar = (c: CategoriaResponse) =>
    setForm({ id: c.id, nome: c.nome, tipo: c.tipo, cor: c.cor, icone: c.icone ?? '' });

  const grupos: { titulo: string; tipo: TipoTransacao }[] = [
    { titulo: 'Despesas', tipo: 1 },
    { titulo: 'Receitas', tipo: 0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-text-primary">Categorias</h1>

      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <Input
            label="Nome"
            placeholder="Ex: Mercado"
            maxLength={50}
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-widest text-text-muted">Tipo</label>
            <select
              value={form.tipo}
              disabled={!!form.id}
              onChange={(e) => setForm({ ...form, tipo: Number(e.target.value) as TipoTransacao })}
              className={`${selectClass} disabled:opacity-50`}
            >
              <option value={1}>Despesa</option>
              <option value={0}>Receita</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-widest text-text-muted">Cor</label>
            <input
              type="color"
              value={form.cor}
              onChange={(e) => setForm({ ...form, cor: e.target.value.toUpperCase() })}
              className="h-[38px] w-full bg-elevated border border-border rounded-button p-1 cursor-pointer"
            />
          </div>
          <Input
            label="Ícone (opcional)"
            placeholder="Ex: cart"
            maxLength={50}
            value={form.icone}
            onChange={(e) => setForm({ ...form, icone: e.target.value })}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {form.id ? <Save size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
              {form.id ? 'Salvar' : 'Adicionar'}
            </Button>
            {form.id && (
              <Button type="button" variant="secondary" className="px-3" onClick={() => setForm(formVazio)}>
                <X size={16} />
              </Button>
            )}
          </div>
        </form>
      </Card>

      {loading ? (
        <div className="py-4 text-center text-sm text-text-muted">Carregando categorias...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {grupos.map(({ titulo, tipo }) => {
            const lista = categorias.filter((c) => c.tipo === tipo);
            return (
              <Card key={tipo} className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-text-primary">{titulo}</h3>
                {lista.length === 0 ? (
                  <div className="py-4 text-center text-sm text-text-muted">Nenhuma categoria.</div>
                ) : (
                  lista.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.cor }} />
                        <span className="text-sm font-medium text-text-primary">{c.nome}</span>
                        {c.icone && <span className="text-xs text-text-muted">{c.icone}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          title="Editar"
                          onClick={() => editar(c)}
                          className="text-text-muted hover:text-gold transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        {confirmandoId === c.id ? (
                          <span className="flex items-center gap-2 text-xs">
                            <button type="button" onClick={() => handleDelete(c.id)} className="text-danger font-medium">
                              Excluir
                            </button>
                            <button type="button" onClick={() => setConfirmandoId(null)} className="text-text-muted">
                              Cancelar
                            </button>
                          </span>
                        ) : (
                          <button
                            type="button"
                            title="Excluir"
                            onClick={() => setConfirmandoId(c.id)}
                            className="text-text-muted hover:text-danger transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
