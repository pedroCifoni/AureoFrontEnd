import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen bg-base" />;

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};
