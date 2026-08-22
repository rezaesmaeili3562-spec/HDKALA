// ─────────────────────────────────────────────────────────────
//  پنل مدیریت — قالب، داشبورد و صفحات مدیریت
//  (محصولات، سفارش‌ها، کاربران، نظرات، کوپن‌ها، تنظیمات)
// ─────────────────────────────────────────────────────────────
import { useMemo, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useStore } from './store';
import { badgeOf, categories, getCategoryName } from './data';
import { faDate, faNum, faPrice, toFa, uid } from './utils';
import { ADMIN_DEMO, ORDER_STATUSES, ORDER_STATUS_CLASS, PRODUCT_IMAGE_OPTIONS } from './types';
import type {
  Coupon,
  CouponType,
  Order,
  OrderStatus,
  Product,
  ProductBadge,
  ProductComment,
  StoreSettings,
  UserAccount
} from './types';
import Button, {
  ConfirmDialog,
  Drawer,
  Field,
  RatingStars,
  Toasts,
  BoxesIcon,
  ChartIcon,
  ClipboardIcon,
  HomeIcon,
  LogoutIcon,
  MenuIcon,
  MessageIcon,
  MoonIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SunIcon,
  TicketIcon,
  TrashIcon,
  UsersIcon
} from './components';

// ═══════════════════════════ محاسبات آماری ═══════════════════════════

interface DayPoint {
  label: string;
  value: number;
}

/** مجموع فروش ۷ روز اخیر (بدون سفارش‌های لغوشده) */
function lastSevenDaysSales(orders: Order[]): DayPoint[] {
  const days: DayPoint[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    const value = orders
      .filter((o) => {
        if (o.status === 'لغو شده') return false;
        const t = new Date(o.createdAt).getTime();
        return t >= day.getTime() && t < next.getTime();
      })
      .reduce((sum, o) => sum + (o.total || 0), 0);
    days.push({ label: day.toLocaleDateString('fa-IR', { weekday: 'narrow' }), value });
  }
  return days;
}

interface DashboardStats {
  revenue: number;
  orderCount: number;
  userCount: number;
  inStock: number;
  outOfStock: number;
  productCount: number;
}

function dashboardStats(orders: Order[], products: Product[], users: UserAccount[]): DashboardStats {
  const paid = orders.filter((o) => o.status !== 'لغو شده');
  return {
    revenue: paid.reduce((sum, o) => sum + (o.total || 0), 0),
    orderCount: orders.length,
    userCount: users.length,
    inStock: products.filter((p) => p.stock > 0 && p.active !== false).length,
    outOfStock: products.filter((p) => p.stock <= 0).length,
    productCount: products.length
  };
}

function recentOrders(orders: Order[], limit = 6): Order[] {
  return [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

// ═══════════════════════════ اجزای کوچک ادمین ═══════════════════════════

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${ORDER_STATUS_CLASS[status]}`}>
      {status}
    </span>
  );
}

function SalesChart({ points }: { points: DayPoint[] }) {
  const max = Math.max(1, ...points.map((p) => p.value));

  return (
    <div className="flex h-48 items-end gap-2" role="img" aria-label="نمودار فروش هفت روز اخیر">
      {points.map((p) => {
        const height = Math.round((p.value / max) * 100);
        return (
          <div key={p.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-[10px] font-medium text-slate-400">
              {p.value ? faPrice(p.value) : faNum(0)}
            </span>
            <div className="flex h-32 w-full items-end overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
              <div
                className="w-full rounded-xl bg-gradient-to-t from-primary-600 to-accent-400 transition-all"
                style={{ height: `${Math.max(height, p.value > 0 ? 8 : 2)}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">{p.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════ قالب پنل مدیریت ═══════════════════════════

const adminNav = [
  { to: '/admin', end: true, label: 'داشبورد', icon: ChartIcon },
  { to: '/admin/products', label: 'محصولات', icon: BoxesIcon },
  { to: '/admin/orders', label: 'سفارش‌ها', icon: ClipboardIcon },
  { to: '/admin/users', label: 'کاربران', icon: UsersIcon },
  { to: '/admin/comments', label: 'نظرات', icon: MessageIcon },
  { to: '/admin/coupons', label: 'کوپن‌ها', icon: TicketIcon },
  { to: '/admin/settings', label: 'تنظیمات', icon: SettingsIcon }
];

function AdminNavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1" aria-label="منوی مدیریت">
      {adminNav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
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

export function AdminLayout() {
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
      {/* سایدبار دسکتاپ */}
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
        <AdminNavItems />
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

      {/* منوی موبایل */}
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} side="start" title="منوی مدیریت">
        <div className="p-4">
          <AdminNavItems onNavigate={() => setMenuOpen(false)} />
        </div>
      </Drawer>
      <Toasts />
    </div>
  );
}

// ═══════════════════════════ ورود مدیر ═══════════════════════════

interface AdminLoginForm {
  username: string;
  password: string;
}

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = useStore((s) => s.admin);
  const loginAdmin = useStore((s) => s.loginAdmin);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AdminLoginForm>({ mode: 'onTouched' });

  if (admin) return <Navigate to="/admin" replace />;

  const from = (location.state as { from?: string } | null)?.from || '/admin';

  const onSubmit = (data: AdminLoginForm) => {
    setFormError('');
    const result = loginAdmin(data.username, data.password);
    if (!result.ok) {
      setFormError(result.message || 'ورود ناموفق بود');
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <div className="flex justify-end p-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
        >
          {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="card w-full max-w-md space-y-6 p-8">
          <div className="text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600/10 text-primary-600">
              <ShieldCheckIcon size={26} />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">ورود به پنل مدیریت</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              فقط مدیران فروشگاه به این بخش دسترسی دارند.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {formError && (
              <p role="alert" className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-500">
                {formError}
              </p>
            )}
            <Field label="نام کاربری" required id="admin-username" error={errors.username?.message}>
              <input
                id="admin-username"
                className="input-base"
                placeholder="admin"
                autoComplete="username"
                {...register('username', { required: 'نام کاربری الزامی است' })}
              />
            </Field>
            <Field label="رمز عبور" required id="admin-password" error={errors.password?.message}>
              <input
                id="admin-password"
                type="password"
                className="input-base"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password', {
                  required: 'رمز عبور الزامی است',
                  minLength: { value: 6, message: 'رمز عبور حداقل ۶ کاراکتر است' }
                })}
              />
            </Field>
            <Button type="submit" full size="lg" loading={isSubmitting}>
              ورود به پنل
            </Button>
          </form>

          <div className="rounded-xl bg-primary-50 px-4 py-3 text-xs leading-6 text-primary-800 dark:bg-primary-950/40 dark:text-primary-200">
            حساب دمو: <span dir="ltr" className="font-bold">{ADMIN_DEMO.username}</span> /{' '}
            <span dir="ltr" className="font-bold">{ADMIN_DEMO.password}</span>
          </div>

          <p className="text-center text-sm text-slate-500">
            <Link to="/" className="font-bold text-primary-600 hover:text-primary-700 dark:text-primary-300">
              بازگشت به فروشگاه
            </Link>
          </p>
        </div>
      </div>
      <Toasts />
    </div>
  );
}

// ═══════════════════════════ داشبورد ═══════════════════════════

export function AdminDashboardPage() {
  const orders = useStore((s) => s.orders);
  const products = useStore((s) => s.products);
  const users = useStore((s) => s.users);
  const stats = dashboardStats(orders, products, users);
  const chart = lastSevenDaysSales(orders);
  const latest = recentOrders(orders);

  const cards = [
    { label: 'درآمد خالص', value: faPrice(stats.revenue), hint: 'بدون سفارش‌های لغوشده' },
    { label: 'سفارش‌ها', value: faNum(stats.orderCount), hint: 'کل سفارش‌های ثبت‌شده' },
    { label: 'کاربران', value: faNum(stats.userCount), hint: 'حساب‌های ثبت‌شده' },
    {
      label: 'موجودی کالا',
      value: `${faNum(stats.inStock)} / ${faNum(stats.outOfStock)}`,
      hint: 'موجود / ناموجود'
    }
  ];

  return (
    <div className="page-enter space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">داشبورد</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">نمای کلی فروشگاه در یک نگاه</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <article key={c.label} className="card p-5">
            <p className="text-xs font-medium text-slate-400">{c.label}</p>
            <p className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">{c.value}</p>
            <p className="mt-1 text-xs text-slate-400">{c.hint}</p>
          </article>
        ))}
      </section>

      <section className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">فروش ۷ روز اخیر</h2>
          <span className="text-xs text-slate-400">{faNum(stats.productCount)} محصول در کاتالوگ</span>
        </div>
        <SalesChart points={chart} />
      </section>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">آخرین سفارش‌ها</h2>
          <Link to="/admin/orders" className="text-sm font-medium text-primary-600 dark:text-primary-300">
            مشاهده همه
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">هنوز سفارشی ثبت نشده است.</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {latest.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100" dir="ltr">
                    {order.id}
                  </p>
                  <p className="text-xs text-slate-400">
                    {order.receiver.name} · {faDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">{faPrice(order.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// ═══════════════════════════ مدیریت محصولات ═══════════════════════════

interface ProductFormValues {
  name: string;
  category: string;
  brand: string;
  price: number;
  discount: number;
  stock: number;
  status: ProductBadge;
  image: string;
  desc: string;
  features: string;
  specs: string;
  colors: string;
  active: boolean;
}

const emptyProductForm: ProductFormValues = {
  name: '',
  category: 'electronics',
  brand: '',
  price: 0,
  discount: 0,
  stock: 0,
  status: '',
  image: PRODUCT_IMAGE_OPTIONS[0],
  desc: '',
  features: '',
  specs: '',
  colors: '',
  active: true
};

function productToForm(product: Product): ProductFormValues {
  return {
    name: product.name,
    category: product.category,
    brand: product.brand,
    price: product.price,
    discount: product.discount,
    stock: product.stock,
    status: product.status || '',
    image: product.image,
    desc: product.desc,
    features: (product.features || []).join('\n'),
    specs: Object.entries(product.specs || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n'),
    colors: (product.colors || []).join('، '),
    active: product.active !== false
  };
}

/** تبدیل متن «کلید: مقدار» خط‌به‌خط به آبجکت مشخصات */
function parseSpecs(raw: string): Record<string, string> {
  const specs: Record<string, string> = {};
  raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length) specs[key.trim()] = rest.join(':').trim();
    });
  return specs;
}

/** تبدیل لیست متنی (خط‌به‌خط یا با ویرگول) به آرایه */
function parseList(raw: string): string[] {
  return raw
    .split(/[\n,،]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function AdminProductsPage() {
  const products = useStore((s) => s.products);
  const upsertProduct = useStore((s) => s.upsertProduct);
  const deleteProduct = useStore((s) => s.deleteProduct);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in' | 'out'>('all');
  const [editing, setEditing] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProductFormValues>({ defaultValues: emptyProductForm });

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const q = query.trim().toLowerCase();
        if (q && !`${p.name} ${p.brand}`.toLowerCase().includes(q)) return false;
        if (category && p.category !== category) return false;
        if (stockFilter === 'in' && p.stock <= 0) return false;
        if (stockFilter === 'out' && p.stock > 0) return false;
        return true;
      }),
    [products, query, category, stockFilter]
  );

  const openCreate = () => {
    setEditing(null);
    reset(emptyProductForm);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    reset(productToForm(product));
    setFormOpen(true);
  };

  const onSubmit = (data: ProductFormValues) => {
    const product: Product = {
      id: editing?.id || uid('p'),
      name: data.name.trim(),
      category: data.category,
      brand: data.brand.trim(),
      price: Number(data.price) || 0,
      discount: Math.min(100, Math.max(0, Number(data.discount) || 0)),
      stock: Math.max(0, Number(data.stock) || 0),
      status: data.status || '',
      image: data.image,
      desc: data.desc.trim(),
      features: parseList(data.features),
      specs: parseSpecs(data.specs),
      colors: parseList(data.colors),
      rating: editing?.rating ?? 0,
      ratingCount: editing?.ratingCount ?? 0,
      views: editing?.views ?? 0,
      created: editing?.created ?? new Date().toISOString().slice(0, 10),
      active: data.active
    };
    upsertProduct(product);
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">مدیریت محصولات</h1>
          <p className="mt-1 text-sm text-slate-500">{faNum(filtered.length)} کالا</p>
        </div>
        <Button type="button" onClick={openCreate}>
          <PlusIcon size={16} /> افزودن محصول
        </Button>
      </div>

      {/* نوار جستجو و فیلتر */}
      <div className="card flex flex-wrap gap-3 p-4">
        <div className="relative min-w-[200px] flex-1">
          <SearchIcon size={16} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
          <input
            className="input-base pe-10"
            placeholder="جستجو نام یا برند…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="input-base w-auto"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="فیلتر دسته"
        >
          <option value="">همه دسته‌ها</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="input-base w-auto"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value as 'all' | 'in' | 'out')}
          aria-label="فیلتر موجودی"
        >
          <option value="all">همه موجودی‌ها</option>
          <option value="in">فقط موجود</option>
          <option value="out">فقط ناموجود</option>
        </select>
      </div>

      {/* جدول محصولات */}
      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 text-start font-medium">محصول</th>
              <th className="px-4 py-3 text-start font-medium">دسته</th>
              <th className="px-4 py-3 text-start font-medium">قیمت</th>
              <th className="px-4 py-3 text-start font-medium">موجودی</th>
              <th className="px-4 py-3 text-start font-medium">وضعیت</th>
              <th className="px-4 py-3 text-start font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((p) => {
              const badge = badgeOf(p.status);
              return (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{getCategoryName(p.category)}</td>
                  <td className="px-4 py-3 font-medium">{faPrice(p.price)}</td>
                  <td className="px-4 py-3">{faNum(p.stock)}</td>
                  <td className="px-4 py-3">
                    {p.stock <= 0 ? (
                      <span className="text-xs font-bold text-rose-500">ناموجود</span>
                    ) : badge ? (
                      <span className={`rounded-lg px-2 py-1 text-xs font-bold ${badge.cls}`}>{badge.label}</span>
                    ) : (
                      <span className="text-xs text-slate-400">عادی</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        aria-label={`ویرایش ${p.name}`}
                        onClick={() => openEdit(p)}
                      >
                        <PencilIcon size={16} />
                      </button>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        aria-label={`حذف ${p.name}`}
                        onClick={() => setPendingDelete(p)}
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-slate-400">محصولی پیدا نشد.</p>}
      </div>

      {/* مودال فرم محصول */}
      {formOpen && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-slate-950/50 p-4" role="dialog" aria-modal="true">
          <div className="card mx-auto my-6 w-full max-w-3xl p-6">
            <h2 className="mb-5 text-lg font-extrabold text-slate-900 dark:text-white">
              {editing ? 'ویرایش محصول' : 'افزودن محصول'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
              <Field label="نام محصول" required id="p-name" error={errors.name?.message} className="sm:col-span-2">
                <input id="p-name" className="input-base" {...register('name', { required: 'نام محصول الزامی است' })} />
              </Field>
              <Field label="دسته‌بندی" required id="p-cat">
                <select id="p-cat" className="input-base" {...register('category', { required: true })}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="برند" required id="p-brand" error={errors.brand?.message}>
                <input id="p-brand" className="input-base" {...register('brand', { required: 'برند الزامی است' })} />
              </Field>
              <Field label="قیمت (تومان)" required id="p-price" error={errors.price?.message}>
                <input
                  id="p-price"
                  type="number"
                  min={0}
                  className="input-base"
                  {...register('price', {
                    required: 'قیمت الزامی است',
                    min: { value: 1, message: 'قیمت باید بزرگ‌تر از صفر باشد' }
                  })}
                />
              </Field>
              <Field label="تخفیف (٪)" id="p-discount">
                <input id="p-discount" type="number" min={0} max={100} className="input-base" {...register('discount')} />
              </Field>
              <Field label="موجودی" required id="p-stock">
                <input id="p-stock" type="number" min={0} className="input-base" {...register('stock', { required: true })} />
              </Field>
              <Field label="وضعیت نمایش" id="p-status">
                <select id="p-status" className="input-base" {...register('status')}>
                  <option value="">عادی</option>
                  <option value="new">جدید</option>
                  <option value="hot">فروش ویژه</option>
                  <option value="bestseller">پرفروش</option>
                </select>
              </Field>
              <Field label="تصویر" id="p-image" className="sm:col-span-2">
                <select id="p-image" className="input-base" {...register('image')}>
                  {PRODUCT_IMAGE_OPTIONS.map((src) => (
                    <option key={src} value={src}>
                      {src.replace('./images/', '')}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="توضیحات" required id="p-desc" error={errors.desc?.message} className="sm:col-span-2">
                <textarea id="p-desc" rows={3} className="input-base resize-none" {...register('desc', { required: 'توضیحات الزامی است' })} />
              </Field>
              <Field label="ویژگی‌ها (هر خط یک مورد)" id="p-features">
                <textarea id="p-features" rows={3} className="input-base resize-none" {...register('features')} />
              </Field>
              <Field label="مشخصات (کلید: مقدار)" id="p-specs">
                <textarea id="p-specs" rows={3} className="input-base resize-none" {...register('specs')} />
              </Field>
              <Field label="رنگ‌ها (با ویرگول)" id="p-colors">
                <input id="p-colors" className="input-base" {...register('colors')} />
              </Field>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input type="checkbox" className="h-4 w-4 accent-indigo-600" {...register('active')} />
                نمایش در فروشگاه
              </label>
              <div className="flex justify-end gap-2 sm:col-span-2">
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                  انصراف
                </Button>
                <Button type="submit">ذخیره محصول</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="حذف محصول"
        description={`محصول «${pendingDelete?.name || ''}» از فروشگاه حذف می‌شود.`}
        confirmLabel="حذف"
        danger
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteProduct(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

// ═══════════════════════════ مدیریت سفارش‌ها ═══════════════════════════

export function AdminOrdersPage() {
  const orders = useStore((s) => s.orders);
  const setOrderStatus = useStore((s) => s.setOrderStatus);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const q = query.trim().toLowerCase();
        if (q && !`${o.id} ${o.receiver.name} ${o.receiver.phone}`.toLowerCase().includes(q)) {
          return false;
        }
        if (status && o.status !== status) return false;
        return true;
      }),
    [orders, query, status]
  );

  return (
    <div className="page-enter space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">مدیریت سفارش‌ها</h1>
        <p className="mt-1 text-sm text-slate-500">{faNum(filtered.length)} سفارش</p>
      </div>

      <div className="card flex flex-wrap gap-3 p-4">
        <input
          className="input-base min-w-[200px] flex-1"
          placeholder="جستجو کد سفارش، نام یا موبایل…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="input-base w-auto"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="فیلتر وضعیت"
        >
          <option value="">همه وضعیت‌ها</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 text-start font-medium">کد</th>
              <th className="px-4 py-3 text-start font-medium">مشتری</th>
              <th className="px-4 py-3 text-start font-medium">مبلغ</th>
              <th className="px-4 py-3 text-start font-medium">تاریخ</th>
              <th className="px-4 py-3 text-start font-medium">وضعیت</th>
              <th className="px-4 py-3 text-start font-medium">جزئیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-bold" dir="ltr">
                  {order.id}
                </td>
                <td className="px-4 py-3">
                  <p>{order.receiver.name}</p>
                  <p className="text-xs text-slate-400" dir="ltr">
                    {order.receiver.phone}
                  </p>
                </td>
                <td className="px-4 py-3 font-medium">{faPrice(order.total)}</td>
                <td className="px-4 py-3 text-slate-500">{faDate(order.createdAt)}</td>
                <td className="px-4 py-3">
                  <select
                    className="input-base w-auto"
                    value={order.status}
                    aria-label={`وضعیت سفارش ${order.id}`}
                    onChange={(e) => setOrderStatus(order.id, e.target.value as OrderStatus)}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-sm font-medium text-primary-600"
                    onClick={() => setSelected(order)}
                  >
                    مشاهده
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-slate-400">سفارشی پیدا نشد.</p>}
      </div>

      {/* مودال جزئیات سفارش */}
      {selected && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0 bg-slate-950/50" aria-label="بستن" onClick={() => setSelected(null)} />
          <div className="card relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white" dir="ltr">
                  {selected.id}
                </h2>
                <p className="text-xs text-slate-400">{faDate(selected.createdAt)}</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {selected.receiver.name} · <span dir="ltr">{selected.receiver.phone}</span>
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {selected.address.province}، {selected.address.city} — {selected.address.fullAddress}
            </p>
            <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {selected.items.map((item) => (
                <li key={item.productId} className="flex items-center justify-between py-2 text-sm">
                  <span>
                    {item.name} × {toFa(item.qty)}
                  </span>
                  <span className="font-bold">
                    {faPrice(Math.round(item.price * (1 - item.discount / 100)) * item.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between text-sm font-extrabold">
              <span>قابل پرداخت</span>
              <span>{faPrice(selected.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════ مدیریت کاربران ═══════════════════════════

export function AdminUsersPage() {
  const users = useStore((s) => s.users);
  const setUserDisabled = useStore((s) => s.setUserDisabled);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => `${u.name} ${u.phone} ${u.email}`.toLowerCase().includes(q));
  }, [users, query]);

  return (
    <div className="page-enter space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">مدیریت کاربران</h1>
        <p className="mt-1 text-sm text-slate-500">{faNum(filtered.length)} کاربر</p>
      </div>

      <div className="card p-4">
        <input
          className="input-base"
          placeholder="جستجو نام، موبایل یا ایمیل…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 text-start font-medium">کاربر</th>
              <th className="px-4 py-3 text-start font-medium">موبایل</th>
              <th className="px-4 py-3 text-start font-medium">ایمیل</th>
              <th className="px-4 py-3 text-start font-medium">عضویت</th>
              <th className="px-4 py-3 text-start font-medium">وضعیت</th>
              <th className="px-4 py-3 text-start font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-100">{user.name}</td>
                <td className="px-4 py-3" dir="ltr">
                  {user.phone}
                </td>
                <td className="px-4 py-3 text-slate-500">{user.email || '—'}</td>
                <td className="px-4 py-3 text-slate-500">{user.createdAt ? faDate(user.createdAt) : '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold ${user.disabled ? 'text-rose-500' : 'text-emerald-600'}`}>
                    {user.disabled ? 'غیرفعال' : 'فعال'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button
                    type="button"
                    size="sm"
                    variant={user.disabled ? 'outline' : 'danger'}
                    onClick={() => setUserDisabled(user.id, !user.disabled)}
                  >
                    {user.disabled ? 'فعال‌سازی' : 'غیرفعال‌سازی'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-slate-400">کاربری پیدا نشد.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════ مدیریت نظرات ═══════════════════════════

export function AdminCommentsPage() {
  const commentsMap = useStore((s) => s.comments);
  const products = useStore((s) => s.products);
  const approveComment = useStore((s) => s.approveComment);
  const deleteComment = useStore((s) => s.deleteComment);

  const comments = useMemo(() => {
    const list: ProductComment[] = [];
    Object.values(commentsMap).forEach((arr) => list.push(...arr));
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [commentsMap]);

  const productName = (id: string) => products.find((p) => p.id === id)?.name || id;

  return (
    <div className="page-enter space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">مدیریت نظرات</h1>
        <p className="mt-1 text-sm text-slate-500">{faNum(comments.length)} دیدگاه</p>
      </div>

      {comments.length === 0 ? (
        <div className="card py-16 text-center text-sm text-slate-400">دیدگاهی برای بررسی وجود ندارد.</div>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="card space-y-3 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{c.name}</p>
                  <p className="text-xs text-slate-400">
                    {productName(c.productId)} · {faDate(c.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <RatingStars rating={c.rating} showCount={false} />
                  <span
                    className={`rounded-lg px-2 py-1 text-xs font-bold ${
                      c.approved
                        ? 'bg-emerald-500/15 text-emerald-600'
                        : 'bg-amber-500/15 text-amber-600'
                    }`}
                  >
                    {c.approved ? 'تأییدشده' : 'در انتظار تأیید'}
                  </span>
                </div>
              </div>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{c.text}</p>
              <div className="flex gap-2">
                {!c.approved && (
                  <Button type="button" size="sm" onClick={() => approveComment(c.id)}>
                    تأیید
                  </Button>
                )}
                <Button type="button" size="sm" variant="danger" onClick={() => deleteComment(c.id)}>
                  حذف
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ═══════════════════════════ کوپن‌های تخفیف ═══════════════════════════

interface CouponForm {
  code: string;
  type: CouponType;
  value: number;
  minOrder: number;
  active: boolean;
}

const emptyCouponForm: CouponForm = { code: '', type: 'percent', value: 10, minOrder: 0, active: true };

export function AdminCouponsPage() {
  const coupons = useStore((s) => s.coupons);
  const upsertCoupon = useStore((s) => s.upsertCoupon);
  const deleteCoupon = useStore((s) => s.deleteCoupon);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<Coupon | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<CouponForm>({ defaultValues: emptyCouponForm });

  const couponType = watch('type');

  const openCreate = () => {
    setEditing(null);
    reset(emptyCouponForm);
    setOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    reset({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrder: coupon.minOrder,
      active: coupon.active
    });
    setOpen(true);
  };

  const onSubmit = (data: CouponForm) => {
    const coupon: Coupon = {
      id: editing?.id || uid('cpn'),
      code: data.code.trim().toUpperCase(),
      type: data.type,
      value: Number(data.value) || 0,
      minOrder: Number(data.minOrder) || 0,
      active: data.active,
      usageCount: editing?.usageCount ?? 0,
      createdAt: editing?.createdAt ?? new Date().toISOString()
    };
    upsertCoupon(coupon);
    setOpen(false);
  };

  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">تخفیف‌ها و کوپن‌ها</h1>
          <p className="mt-1 text-sm text-slate-500">{faNum(coupons.length)} کد تخفیف</p>
        </div>
        <Button type="button" onClick={openCreate}>
          ساخت کد تخفیف
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {coupons.map((c) => (
          <article key={c.id} className="card space-y-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-extrabold tracking-wide text-primary-600" dir="ltr">
                  {c.code}
                </p>
                <p className="text-sm text-slate-500">
                  {c.type === 'percent' ? `${faNum(c.value)}٪` : faPrice(c.value)} تخفیف
                  {c.minOrder > 0 ? ` · حداقل سفارش ${faPrice(c.minOrder)}` : ''}
                </p>
              </div>
              <span
                className={`rounded-lg px-2 py-1 text-xs font-bold ${
                  c.active ? 'bg-emerald-500/15 text-emerald-600' : 'bg-slate-500/15 text-slate-500'
                }`}
              >
                {c.active ? 'فعال' : 'غیرفعال'}
              </span>
            </div>
            <p className="text-xs text-slate-400">استفاده: {faNum(c.usageCount)}</p>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => openEdit(c)}>
                ویرایش
              </Button>
              <Button type="button" size="sm" variant="danger" onClick={() => setPending(c)}>
                حذف
              </Button>
            </div>
          </article>
        ))}
      </div>

      {/* مودال ساخت/ویرایش کوپن */}
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0 bg-slate-950/50" aria-label="بستن" onClick={() => setOpen(false)} />
          <form onSubmit={handleSubmit(onSubmit)} className="card relative z-10 w-full max-w-md space-y-4 p-6" noValidate>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {editing ? 'ویرایش کوپن' : 'کوپن جدید'}
            </h2>
            <Field label="کد تخفیف" required id="cpn-code" error={errors.code?.message}>
              <input
                id="cpn-code"
                className="input-base uppercase"
                dir="ltr"
                {...register('code', {
                  required: 'کد تخفیف الزامی است',
                  minLength: { value: 3, message: 'حداقل ۳ کاراکتر' }
                })}
              />
            </Field>
            <Field label="نوع" id="cpn-type">
              <select id="cpn-type" className="input-base" {...register('type')}>
                <option value="percent">درصدی</option>
                <option value="fixed">مبلغی</option>
              </select>
            </Field>
            <Field
              label={couponType === 'percent' ? 'درصد تخفیف' : 'مبلغ تخفیف (تومان)'}
              required
              id="cpn-value"
              error={errors.value?.message}
            >
              <input
                id="cpn-value"
                type="number"
                min={1}
                className="input-base"
                {...register('value', {
                  required: 'مقدار الزامی است',
                  min: { value: 1, message: 'مقدار باید بزرگ‌تر از صفر باشد' }
                })}
              />
            </Field>
            <Field label="حداقل مبلغ سفارش" id="cpn-min">
              <input id="cpn-min" type="number" min={0} className="input-base" {...register('minOrder')} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-indigo-600" {...register('active')} />
              فعال باشد
            </label>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                انصراف
              </Button>
              <Button type="submit">{editing ? 'ذخیره تغییرات' : 'ساخت کوپن'}</Button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pending)}
        title="حذف کوپن"
        description={`کد «${pending?.code || ''}» حذف می‌شود.`}
        confirmLabel="حذف"
        danger
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending) deleteCoupon(pending.id);
          setPending(null);
        }}
      />
    </div>
  );
}

// ═══════════════════════════ تنظیمات فروشگاه ═══════════════════════════

export function AdminSettingsPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<StoreSettings>({ defaultValues: settings });

  const preview = watch();

  const onSubmit = (data: StoreSettings) => {
    updateSettings({
      storeName: data.storeName.trim() || 'HDKALA',
      shippingFee: Number(data.shippingFee) || 0,
      expressFee: Number(data.expressFee) || 0,
      freeShippingOver: Number(data.freeShippingOver) || 0
    });
  };

  return (
    <div className="page-enter space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">تنظیمات فروشگاه</h1>
        <p className="mt-1 text-sm text-slate-500">
          این مقادیر بلافاصله در تسویه حساب فروشگاه اعمال می‌شوند.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card max-w-xl space-y-5 p-6" noValidate>
        <Field label="نام فروشگاه" required id="store-name" error={errors.storeName?.message}>
          <input
            id="store-name"
            className="input-base"
            {...register('storeName', { required: 'نام فروشگاه الزامی است' })}
          />
        </Field>
        <Field label="هزینه ارسال عادی (تومان)" required id="ship-fee" error={errors.shippingFee?.message}>
          <input
            id="ship-fee"
            type="number"
            min={0}
            className="input-base"
            {...register('shippingFee', { required: 'هزینه ارسال الزامی است' })}
          />
        </Field>
        <Field label="هزینه ارسال اکسپرس (تومان)" id="express-fee">
          <input id="express-fee" type="number" min={0} className="input-base" {...register('expressFee')} />
        </Field>
        <Field label="آستانه ارسال رایگان (تومان)" required id="free-over" error={errors.freeShippingOver?.message}>
          <input
            id="free-over"
            type="number"
            min={0}
            className="input-base"
            {...register('freeShippingOver', { required: 'آستانه ارسال رایگان الزامی است' })}
          />
        </Field>
        <div className="rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          پیش‌نمایش: ارسال عادی {faPrice(preview.shippingFee || 0)} — سفارش‌های بالای{' '}
          {faPrice(preview.freeShippingOver || 0)} رایگان است.
        </div>
        <Button type="submit">ذخیره تنظیمات</Button>
      </form>
    </div>
  );
}
