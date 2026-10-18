import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { PublicRoute } from '@/router/PublicRoute';
import { DashboardPage } from '@/pages/Dashboard';
import { TransacoesPage } from '@/pages/Transacoes';
import { MetasPage } from '@/pages/Metas';
import { LoginPage } from '@/pages/Login';
import { CreateAccountPage } from '@/pages/Login/form';
import { NovaTransacaoPage } from '@/pages/NovaTransacao';

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
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
          { path: '/metas', element: <MetasPage /> },
        ],
      },
    ],
  },
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);
