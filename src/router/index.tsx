import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { PublicRoute } from '@/router/PublicRoute';
import { AdminRoute } from '@/router/AdminRoute';
import { DashboardPage } from '@/pages/Dashboard';
import { TransacoesPage } from '@/pages/Transacoes';
import { MetasPage } from '@/pages/Metas';
import { HomePage } from '@/pages/Home';
import { LoginPage } from '@/pages/Login';
import { CreateAccountPage } from '@/pages/Login/form';
import { NovaTransacaoPage } from '@/pages/NovaTransacao';
import { CategoriasPage } from '@/pages/Categorias';
import { AdminUsuariosPage } from '@/pages/Admin/Usuarios';
import { AdminUsuarioEditarPage } from '@/pages/Admin/Usuarios/editar';
import { AdminTransacoesPage } from '@/pages/Admin/Transacoes';

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/login', element: <LoginPage /> },
          { path: '/criar-conta', element: <CreateAccountPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/transacoes', element: <TransacoesPage /> },
          { path: '/transacoes/nova', element: <NovaTransacaoPage /> },
          { path: '/transacoes/:id/editar', element: <NovaTransacaoPage /> },
          { path: '/categorias', element: <CategoriasPage /> },
          { path: '/metas', element: <MetasPage /> },
          {
            element: <AdminRoute />,
            children: [
              { path: '/admin/usuarios', element: <AdminUsuariosPage /> },
              { path: '/admin/usuarios/:id/editar', element: <AdminUsuarioEditarPage /> },
              { path: '/admin/transacoes', element: <AdminTransacoesPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);
