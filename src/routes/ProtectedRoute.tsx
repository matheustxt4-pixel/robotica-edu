import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-display">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-robo-blue border-t-transparent rounded-full animate-spin" />
          <p className="font-extrabold text-slate-600">Carregando aventura...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirecionar se a role não tiver permissão
    return <Navigate to={user.role === 'teacher' ? '/teacher' : '/map'} replace />;
  }

  return <>{children}</>;
};

