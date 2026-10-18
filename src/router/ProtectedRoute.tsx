import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen bg-base" />; // splash mínimo

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
