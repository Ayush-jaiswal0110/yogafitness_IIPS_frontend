import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '@/lib/auth';
import AdminLogin from './AdminLogin';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticated = AuthService.isAuthenticated();
    const admin = AuthService.isAdmin();
    setIsAuthenticated(authenticated);
    setIsAdmin(admin);
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    const authenticated = AuthService.isAuthenticated();
    const admin = AuthService.isAdmin();
    setIsAuthenticated(authenticated);
    setIsAdmin(admin);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (requireAdmin) {
      return <AdminLogin onLogin={handleLogin} />;
    }
    return <Navigate to="/register" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;