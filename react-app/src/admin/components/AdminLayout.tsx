import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Toasts from '../../components/Toasts';
import Drawer from '../../components/Drawer';
import {
  ChartIcon,
  BoxesIcon,
  ClipboardIcon,
  UsersIcon,
  MessageIcon,
  TicketIcon,
  SettingsIcon,
  LogoutIcon,
  MenuIcon,
  SunIcon,
  MoonIcon,
  HomeIcon
} from '../../components/Icons';

const nav = [
  { to: '/admin', end: true, label: 'داشبورد', icon: ChartIcon, testId: 'admin-nav-dashboard' },
  { to: '/admin/products', label: 'محصولات', icon: BoxesIcon, testId: 'admin-nav-products' },
  { to: '/admin/orders', label: 'سفارش‌ها', icon: ClipboardIcon, testId: 'admin-nav-orders' },
  { to: '/admin/users', label: 'کاربران', icon: UsersIcon, testId: 'admin-nav-users' },
  { to: '/admin/comments', label: 'نظرات', icon: MessageIcon, testId: 'admin-nav-comments' },
  { to: '/admin/coupons', label: 'کوپن‌ها', icon: TicketIcon, testId: 'admin-nav-coupons' },
  { to: '/admin/settings', label: 'تنظیمات', icon: SettingsIcon, testId: 'admin-nav-settings' }
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1" aria-label="منوی مدیریت">
      {nav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          data-testid={item.testId}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? 'bg-primary-600 text-white shadow-pop'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`
          }
        >
          <item.icon size={18} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const admin = useStore((s) => s.admin);
  const settings = useStore((s) => s.settings);
  const logoutAdmin = useStore((s) => s.logoutAdmin);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="hidden w-64 shrink-0 border-l border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="mb-8 flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-400 text-sm font-extrabold text-white shadow-pop">
            HD
          </span>
          <div>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white">پنل مدیریت</p>
            <p className="text-xs text-slate-400">{settings.storeName}</p>
          </div>
        </div>
        <NavItems />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/85 px-4 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/85">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="باز کردن منوی مدیریت"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon size={20} />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-800 dark:text-white">{admin?.name}</p>
            <p className="text-xs text-slate-400">نشست مدیریت فعال است</p>
          </div>
          <div className="ms-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="hidden h-10 items-center gap-1.5 rounded-xl px-3 text-sm text-slate-600 hover:bg-slate-100 sm:flex dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <HomeIcon size={16} /> فروشگاه
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
            >
              {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              data-testid="admin-logout"
              className="flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
            >
              <LogoutIcon size={16} /> خروج
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} side="start" title="منوی مدیریت">
        <div className="p-4">
          <NavItems onNavigate={() => setMenuOpen(false)} />
        </div>
      </Drawer>
      <Toasts />
    </div>
  );
}
