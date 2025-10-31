import { useAuth } from '../context/AuthContext.jsx';

export default function Header({ onOpenLogin, onOpenRegister }) {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="container header-content">
        <div className="brand">
          <span className="brand-logo">HD</span>
          <div>
            <div>اچ دی کالا</div>
            <small className="text-muted">تجربه متفاوت خرید آنلاین</small>
          </div>
        </div>

        <div className="header-actions">
          {user ? (
            <>
              <div className={`profile-chip ${user.role === 'admin' ? 'admin' : ''}`}>
                <span className="profile-avatar" aria-hidden="true">
                  {user.name?.charAt(0) ?? 'ک'}
                </span>
                <div className="profile-details">
                  <span className="profile-name">{user.name}</span>
                  <span className="profile-role">
                    {user.role === 'admin' ? 'مدیر سیستم' : 'کاربر ثبت‌شده'}
                  </span>
                </div>
              </div>
              <button type="button" className="logout-btn" onClick={logout}>
                خروج از حساب
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-login" onClick={onOpenLogin}>
                ورود
              </button>
              <button type="button" className="btn btn-register" onClick={onOpenRegister}>
                ثبت‌نام
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
