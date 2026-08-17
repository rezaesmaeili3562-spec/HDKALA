import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { toFa } from '../utils/format';
import Drawer from './Drawer';
import {
  BagIcon,
  HeartIcon,
  SearchIcon,
  MenuIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  LogoutIcon,
  HomeIcon,
  XIcon,
  ChevronDownIcon
} from './Icons';

const navItems = [
  { to: '/', label: 'خانه', end: true },
  { to: '/products', label: 'محصولات' },
  { to: '/about', label: 'درباره ما' },
  { to: '/contact', label: 'تماس با ما' }
];

// ---------- هدر اصلی فروشگاه ----------
export default function Header() {
  const navigate = useNavigate();
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const openCart = useStore((s) => s.openCart);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const mobileMenuOpen = useStore((s) => s.mobileMenuOpen);
  const openMobileMenu = useStore((s) => s.openMobileMenu);
  const closeMobileMenu = useStore((s) => s.closeMobileMenu);

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  // بستن منوی کاربر با کلیک بیرون
  useEffect(() => {
    const onClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    closeMobileMenu();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/85">
      <div className="container-page flex h-16 items-center gap-3">
        {/* منوی موبایل */}
        <button
          type="button"
          onClick={openMobileMenu}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="باز کردن منو"
        >
          <MenuIcon size={22} />
        </button>

        {/* لوگو */}
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="HDKALA - صفحه اصلی">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-400 text-sm font-extrabold text-white shadow-pop">
            HD
          </span>
          <span className="hidden text-xl font-extrabold tracking-tight text-slate-900 sm:block dark:text-white">
            HDKALA
          </span>
        </Link>

        {/* جستجو (دسکتاپ) */}
        <form onSubmit={submitSearch} className="relative mx-2 hidden flex-1 md:block" role="search">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در محصولات…"
            aria-label="جستجو در محصولات"
            className="input-base pe-11"
          />
          <button
            type="submit"
            aria-label="جستجو"
            className="absolute inset-y-0 left-1 my-auto flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:text-primary-600"
          >
            <SearchIcon size={18} />
          </button>
        </form>

        <div className="ms-auto flex items-center gap-1.5">
          {/* جستجو (موبایل) */}
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="جستجو"
            aria-expanded={searchOpen}
          >
            {searchOpen ? <XIcon size={20} /> : <SearchIcon size={20} />}
          </button>

          {/* تم */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
          >
            {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </button>

          {/* علاقه‌مندی */}
          <Link
            to="/wishlist"
            className="relative hidden h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 sm:flex dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={`علاقه‌مندی‌ها (${toFa(wishlist.length)} مورد)`}
          >
            <HeartIcon size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -left-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {toFa(wishlist.length)}
              </span>
            )}
          </Link>

          {/* سبد خرید — در همه صفحات و سایزها باز می‌شود */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={`باز کردن سبد خرید (${toFa(cartCount)} کالا)`}
            data-testid="cart-button"
          >
            <BagIcon size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -left-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
                {toFa(cartCount)}
              </span>
            )}
          </button>

          {/* ناحیه کاربر */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex h-10 items-center gap-1.5 rounded-xl px-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600/10 text-primary-600 dark:text-primary-300">
                  <UserIcon size={16} />
                </span>
                <span className="hidden max-w-24 truncate sm:block">{user.name}</span>
                <ChevronDownIcon size={14} className="hidden text-slate-400 sm:block" />
              </button>
              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute left-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-card animate-fade-in dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-white">{user.name}</p>
                    <p className="truncate text-xs text-slate-400" dir="ltr">{user.phone}</p>
                  </div>
                  <Link role="menuitem" to="/profile" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800">
                    پروفایل و سفارش‌ها
                  </Link>
                  <Link role="menuitem" to="/wishlist" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-primary-600 sm:hidden dark:text-slate-300 dark:hover:bg-slate-800">
                    علاقه‌مندی‌ها
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-start text-sm text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  >
                    <LogoutIcon size={15} /> خروج از حساب
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-1.5 rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-primary-400 hover:text-primary-600 sm:flex dark:border-slate-700 dark:text-slate-200"
            >
              <UserIcon size={16} /> ورود
            </Link>
          )}
        </div>
      </div>

      {/* جستجوی موبایل */}
      {searchOpen && (
        <form onSubmit={submitSearch} className="border-t border-slate-200 p-3 md:hidden dark:border-slate-800" role="search">
          <div className="relative">
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در محصولات…"
              aria-label="جستجو در محصولات"
              className="input-base pe-11"
            />
            <button
              type="submit"
              aria-label="جستجو"
              className="absolute inset-y-0 left-1 my-auto flex h-9 w-9 items-center justify-center rounded-lg text-primary-600"
            >
              <SearchIcon size={18} />
            </button>
          </div>
        </form>
      )}

      {/* ناوبری دسکتاپ */}
      <nav className="hidden border-t border-slate-100 lg:block dark:border-slate-800/60" aria-label="ناوبری اصلی">
        <div className="container-page flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'border-primary-600 text-primary-600 dark:text-primary-300'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`
              }
            >
              {item.to === '/' && <HomeIcon size={15} />}
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <MobileMenu open={mobileMenuOpen} onClose={closeMobileMenu} />
    </header>
  );
}

// ---------- منوی کشویی موبایل ----------
function MobileMenu({ open, onClose }) {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);

  const go = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <Drawer open={open} onClose={onClose} side="start" title="منو" labelledBy="mobile-menu-title">
      <nav className="p-3" aria-label="منوی موبایل">
        {navItems.map((item) => (
          <button
            key={item.to}
            type="button"
            onClick={() => go(item.to)}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-start text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {item.label}
          </button>
        ))}
        <div className="my-2 border-t border-slate-200 dark:border-slate-800" />
        <button
          type="button"
          onClick={() => go('/wishlist')}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-start text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          علاقه‌مندی‌ها
        </button>
        {user ? (
          <>
            <button
              type="button"
              onClick={() => go('/profile')}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-start text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              پروفایل و سفارش‌ها
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                logout();
                navigate('/');
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-start text-sm font-medium text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
            >
              خروج از حساب
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => go('/login')}
            className="mt-2 w-full rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            ورود / ثبت‌نام
          </button>
        )}
      </nav>
    </Drawer>
  );
}
