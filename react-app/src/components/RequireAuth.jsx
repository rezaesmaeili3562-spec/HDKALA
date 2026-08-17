import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

// محافظ مسیرهای خصوصی — کاربر مهمان به صفحه ورود هدایت می‌شود
export default function RequireAuth({ children }) {
  const user = useStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return children;
}
