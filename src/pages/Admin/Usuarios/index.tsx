import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Pencil, Receipt, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { adminService } from '@/services/adminService';
import type { UsuarioAdmin } from '@/models/admin';
import type { PagedResult } from '@/models/transacao';
import { getErrorMessage } from '@/utils/errors';

const TAMANHO = 20;

export const AdminUsuariosPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<PagedResult<UsuarioAdmin> | null>(null);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [busca, setBusca] = useState('');
  const [buscaDebounced, setBuscaDebounced] = useState('');
  const [pagina, setPagina] = useState(1);
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setBuscaDebounced(busca.trim());
      setPagina(1);
    }, 400);
    return () => clearTimeout(t);
  }, [busca]);

  const key = `${buscaDebounced}|${pagina}|${reload}`;
  const loading = loadedKey !== key;

  useEffect(() => {
    let cancelled = false;
    adminService
      .listUsuarios({ busca: buscaDebounced, pagina, tamanho: TAMANHO })
      .then((data) => {
        if (!cancelled) setPage(data);
      })
      .catch((error) => toast.error(getErrorMessage(error, 'Erro ao carregar usuários.')))
      .finally(() => {
        if (!cancelled) setLoadedKey(key);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const handleDelete = async (id: string) => {
    try {
      await adminService.deleteUsuario(id);
      toast.success('Usuário excluído.');
      if (page?.itens.length === 1 && pagina > 1) setPagina((p) => p - 1);
      else setReload((r) => r + 1);
    } catch (error) {
      // 409: tentou excluir a si mesmo ou o último admin
      toast.error(getErrorMessage(error, 'Falha ao excluir usuário.'));
    } finally {
      setConfirmandoId(null);
    }
  };

  const totalPaginas = page?.totalPaginas ?? 0;
  const usuarios = page?.itens ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-text-primary">Usuários</h1>

      <Card className="flex flex-col gap-4">
        <div className="max-w-sm">
          <Input
            label="Buscar"
            placeholder="Login ou e-mail..."
            maxLength={150}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {loading && !page ? (
          <div className="py-4 text-center text-sm text-text-muted">Carregando usuários...</div>
        ) : usuarios.length === 0 ? (
          <div className="py-4 text-center text-sm text-text-muted">Nenhum usuário encontrado.</div>
        ) : (
          <div className={`overflow-x-auto ${loading ? 'opacity-60 transition-opacity' : ''}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-text-muted border-b border-border">
                  <th className="py-2 pr-4 font-medium">Login</th>
                  <th className="py-2 pr-4 font-medium">E-mail</th>
                  <th className="py-2 pr-4 font-medium">Papel</th>
                  <th className="py-2 pr-4 font-medium">Criado em</th>
                  <th className="py-2 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium text-text-primary">{u.nome}</td>
                    <td className="py-3 pr-4 text-text-secondary">{u.email}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={u.papel === 'Admin' ? 'warning' : 'default'}>
                        {u.papel === 'Admin' ? 'Admin' : 'Usuário'}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-text-secondary">
                      {new Date(u.criadoEm).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          title="Ver transações"
                          onClick={() => navigate(`/admin/transacoes?usuarioId=${u.id}`)}
                          className="text-text-muted hover:text-gold transition-colors"
                        >
                          <Receipt size={14} />
                        </button>
                        <button
                          type="button"
                          title="Editar"
                          onClick={() => navigate(`/admin/usuarios/${u.id}/editar`)}
                          className="text-text-muted hover:text-gold transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        {confirmandoId === u.id ? (
                          <span className="flex items-center gap-2 text-xs">
                            <button type="button" onClick={() => handleDelete(u.id)} className="text-danger font-medium">
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
                            onClick={() => setConfirmandoId(u.id)}
                            className="text-text-muted hover:text-danger transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {confirmandoId && (
          <p className="text-xs text-text-muted">
            Excluir um usuário apaga também todas as transações e categorias dele. Não dá para desfazer.
          </p>
        )}

        {totalPaginas > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-xs text-text-muted">
              Página {page?.pagina} de {totalPaginas} • {page?.total} usuários
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" className="px-3" disabled={pagina <= 1 || loading} onClick={() => setPagina((p) => p - 1)}>
                <ChevronLeft size={16} />
              </Button>
              <Button variant="secondary" className="px-3" disabled={pagina >= totalPaginas || loading} onClick={() => setPagina((p) => p + 1)}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
