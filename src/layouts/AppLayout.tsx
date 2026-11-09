import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, Target, LogOut, Coins, Tags, Users, ListChecks } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';
import {authService} from '@/services/authService';
import { useNavigate } from 'react-router-dom';

export const AppLayout = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  let iniciais = '?';
  try {
    const nome: string | undefined = JSON.parse(localStorage.getItem('aureo_user') ?? '{}').nome;
    if (nome) iniciais = nome.trim().slice(0, 2).toUpperCase();
  } catch {
    /* usuário ilegível no storage */
  }

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Transações', path: '/transacoes', icon: ArrowRightLeft },
    { label: 'Categorias', path: '/categorias', icon: Tags },
    { label: 'Metas', path: '/metas', icon: Target },
  ];

  const adminItems = [
    { label: 'Usuários', path: '/admin/usuarios', icon: Users },
    { label: 'Transações dos usuários', path: '/admin/transacoes', icon: ListChecks },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-button text-sm font-medium transition-colors ${
      isActive
        ? 'bg-gold/10 text-gold border border-gold/20'
        : 'text-text-secondary hover:bg-elevated hover:text-text-primary border border-transparent'
    }`;

  return (
    <div className="flex min-h-screen bg-base">
      {/* Sidebar */}
      <aside className="bg-surface border-r border-border w-60 flex-shrink-0 h-screen sticky top-0 flex flex-col">
        {/* Logo */}
        <div className="h-14 flex items-center px-6 border-b border-border gap-2">
          <div className="w-8 h-8 rounded-card bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Coins size={16} className="text-gold" />
          </div>
          <span className="font-bold text-text-primary tracking-tight">Aureo</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <p className="px-3 pt-4 pb-1 text-xs font-medium uppercase tracking-widest text-text-muted">
                Administração
              </p>
              {adminItems.map((item) => (
                <NavLink key={item.path} to={item.path} className={linkClass}>
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-button text-text-secondary hover:bg-elevated hover:text-text-primary text-sm font-medium transition-colors"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-surface">
          <h2 className="text-sm font-medium text-text-secondary">Visão Geral</h2>
          <div className="flex items-center gap-3">
            {isAdmin && <Badge variant="warning">Admin</Badge>}
            <div className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center text-text-primary font-bold text-xs">
              {iniciais}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-8 space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
