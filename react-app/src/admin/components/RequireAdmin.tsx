import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const admin = useStore((s) => s.admin);
  const location = useLocation();

  if (!admin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
