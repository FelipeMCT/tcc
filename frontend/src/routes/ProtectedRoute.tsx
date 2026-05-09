import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  if (!token || !userRaw) {
    return <Navigate to="/login" replace />;
  }

  let user: { role: string };
  try {
    user = JSON.parse(userRaw);
  } catch {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'GESTOR') return <Navigate to="/gestor" replace />;
    if (user.role === 'FUNCIONARIO') return <Navigate to="/funcionario" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
