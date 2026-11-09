import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { adminService } from '@/services/adminService';
import type { AtualizarUsuarioAdminRequest } from '@/models/admin';
import type { Papel } from '@/models/auth';
import { getErrorMessage } from '@/utils/errors';

export const AdminUsuarioEditarPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loadingItem, setLoadingItem] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AtualizarUsuarioAdminRequest>({ nome: '', email: '', papel: 'Usuario' });

  useEffect(() => {
    if (!id) return;
    adminService
      .getUsuario(id)
      .then((u) => setForm({ nome: u.nome, email: u.email, papel: u.papel }))
      .catch((error) => {
        toast.error(getErrorMessage(error, 'Usuário não encontrado.'));
        navigate('/admin/usuarios', { replace: true });
      })
      .finally(() => setLoadingItem(false));
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const erro =
      form.nome.trim().length < 3 || form.nome.length > 100 ? 'Login deve ter de 3 a 100 caracteres.'
      : !emailValido || form.email.length > 150 ? 'E-mail inválido.'
      : null;
    if (erro) {
      toast.error(erro);
      return;
    }

    try {
      setSaving(true);
      await adminService.updateUsuario(id, { ...form, nome: form.nome.trim(), email: form.email.trim() });
      toast.success('Usuário atualizado.');
      navigate('/admin/usuarios');
    } catch (error) {
      // 409: login/e-mail já em uso, ou tentou rebaixar a si mesmo / o último admin
      toast.error(getErrorMessage(error, 'Falha ao salvar usuário.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate('/admin/usuarios')} className="px-3">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Editar usuário</h1>
      </div>

      {loadingItem ? (
        <div className="py-4 text-center text-sm text-text-muted">Carregando...</div>
      ) : (
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              label="Login"
              value={form.nome}
              maxLength={100}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
            <Input
              label="E-mail"
              type="email"
              value={form.email}
              maxLength={150}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-widest text-text-muted">Papel</label>
              <select
                value={form.papel}
                onChange={(e) => setForm({ ...form, papel: e.target.value as Papel })}
                className="w-full bg-elevated border border-border rounded-button px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors appearance-none"
              >
                <option value="Usuario">Usuário</option>
                <option value="Admin">Administrador</option>
              </select>
              <span className="text-xs text-text-muted">
                A mudança de papel vale no próximo login do usuário.
              </span>
            </div>

            <div className="flex justify-end pt-4 border-t border-border mt-2">
              <Button type="submit" disabled={saving}>
                {saving ? (
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
