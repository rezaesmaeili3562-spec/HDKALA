// ─────────────────────────────────────────────────────────────
//  صفحات فروشگاه — خانه، محصولات، جزئیات محصول، سبد، تسویه،
//  ورود/ثبت‌نام، پروفایل، علاقه‌مندی، درباره، تماس و ۴۰۴
// ─────────────────────────────────────────────────────────────
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  getProductById,
  getRelatedProducts,
  selectApprovedComments,
  useProducts,
  useStore
} from './store';
import { badgeOf, categories, getCategoryName, paymentMethods, provinces, shippingMethods } from './data';
import { cartSummary, faDate, faNum, faPrice, finalPrice, rules, toFa } from './utils';
import { ORDER_STATUS_CLASS } from './types';
import type { Coupon, Order, Product } from './types';
import Button, {
  AddToCartButton,
  Drawer,
  EmptyState,
  Field,
  PageLoader,
  ProductCard,
  ProductGridSkeleton,
  QuantityControl,
  RatingStars,
  BagIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ClockIcon,
  CreditCardIcon,
  HeadsetIcon,
  HeartIcon,
  LogoutIcon,
  MailIcon,
  MapPinIcon,
  PackageIcon,
  PhoneIcon,
  SearchIcon,
  ShieldIcon,
  TrashIcon,
  TruckIcon,
  UserIcon,
  XIcon
} from './components';

// ═══════════════════════════ صفحه اصلی ═══════════════════════════

export function HomePage() {
  const { products, loading } = useProducts();

  const featured = (products || [])
    .filter((p) => p.discount > 0 || p.status === 'hot' || p.status === 'new')
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  const bestsellers = (products || [])
    .slice()
    .sort((a, b) => b.ratingCount - a.ratingCount)
    .slice(0, 4);

  return (
    <div className="page-enter">
      {/* هیرو */}
      <section className="relative overflow-hidden bg-gradient-to-l from-primary-700 via-primary-600 to-primary-800 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.35) 0, transparent 35%), radial-gradient(circle at 80% 70%, rgba(251,191,36,0.35) 0, transparent 40%)'
          }}
        />
        <div className="container-page relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent-400" />
              تخفیف‌های ویژه تا ۳۰٪
            </span>
            <h1 className="text-3xl font-extrabold leading-[1.35] sm:text-4xl lg:text-5xl lg:leading-[1.3]">
              خرید آنلاین، سریع و مطمئن
              <span className="mt-2 block text-accent-400">با HDKALA</span>
            </h1>
            <p className="max-w-xl text-base leading-8 text-indigo-100">
              جدیدترین محصولات از معتبرترین برندها؛ با ضمانت اصالت کالا، ارسال سریع به سراسر کشور
              و ۷ روز مهلت بازگشت.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                مشاهده محصولات
              </Link>
              <Link
                to="/products?sort=discount"
                className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                پیشنهادهای شگفت‌انگیز
              </Link>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-indigo-100">
              {['ارسال سریع ۲۴ ساعته', 'ضمانت اصالت کالا', 'پرداخت امن'].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckIcon size={14} className="text-accent-400" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 -m-8 rounded-full bg-white/10 blur-3xl" />
            <img
              src="./images/hero-headphones.jpg"
              alt="هدفون بی‌سیم HDKALA"
              className="relative mx-auto w-full max-w-md rotate-[-6deg] rounded-3xl border-4 border-white/20 shadow-2xl"
            />
            <span className="absolute -top-4 right-8 rounded-2xl bg-accent-400 px-4 py-2 text-sm font-extrabold text-slate-900 shadow-lg">
              تا ۳۰٪ تخفیف
            </span>
          </div>
        </div>
      </section>

      {/* دسته‌بندی‌ها */}
      <section className="container-page py-12" aria-labelledby="categories-title">
        <h2 id="categories-title" className="mb-6 text-xl font-extrabold text-slate-900 dark:text-white">
          دسته‌بندی‌های محبوب
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/products?category=${c.id}`}
              className={`group rounded-2xl border border-slate-200 bg-gradient-to-br ${c.gradient} p-5 transition hover:-translate-y-1 hover:border-primary-300 hover:shadow-card dark:border-slate-800`}
            >
              <span className="mb-3 inline-block text-3xl transition-transform group-hover:scale-110">{c.icon}</span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{c.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {c.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* محصولات ویژه */}
      <section className="container-page py-8" aria-labelledby="featured-title">
        <div className="mb-6 flex items-center justify-between">
          <h2 id="featured-title" className="text-xl font-extrabold text-slate-900 dark:text-white">
            محصولات ویژه
          </h2>
          <Link to="/products" className="text-sm font-medium text-primary-600 transition hover:text-primary-700 dark:text-primary-300">
            مشاهده همه ←
          </Link>
        </div>
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* پرفروش‌ترین‌ها */}
      <section className="container-page py-8" aria-labelledby="bestsellers-title">
        <div className="mb-6 flex items-center justify-between">
          <h2 id="bestsellers-title" className="text-xl font-extrabold text-slate-900 dark:text-white">
            پرفروش‌ترین‌ها
          </h2>
          <Link to="/products?sort=popular" className="text-sm font-medium text-primary-600 transition hover:text-primary-700 dark:text-primary-300">
            مشاهده همه ←
          </Link>
        </div>
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* خبرنامه */}
      <section className="container-page py-10">
        <div className="card flex flex-col items-center gap-4 bg-gradient-to-l from-primary-50 to-white p-8 text-center dark:from-primary-950/40 dark:to-slate-900 md:flex-row md:justify-between md:text-start">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              از تخفیف‌ها زودتر از همه باخبر شوید
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              ایمیل خود را وارد کنید تا جدیدترین پیشنهادها را برایتان بفرستیم.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}

function NewsletterForm() {
  const toast = useStore((s) => s.toast);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast('عضویت شما در خبرنامه ثبت شد 🎉');
    e.currentTarget.reset();
  };

  return (
    <form className="flex w-full max-w-md gap-2" onSubmit={submit}>
      <input
        type="email"
        required
        placeholder="ایمیل شما"
        aria-label="ایمیل برای خبرنامه"
        className="input-base flex-1"
      />
      <button type="submit" className="shrink-0 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700">
        عضویت
      </button>
    </form>
  );
}

// ═══════════════════════════ صفحه محصولات ═══════════════════════════

const PAGE_SIZE = 12;

const sortOptions = [
  { value: 'popular', label: 'پربازدیدترین' },
  { value: 'newest', label: 'جدیدترین' },
  { value: 'price_asc', label: 'ارزان‌ترین' },
  { value: 'price_desc', label: 'گران‌ترین' },
  { value: 'discount', label: 'بیشترین تخفیف' }
];

interface ProductFilters {
  q: string;
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  onSale: boolean;
  minRating: number;
}

const EMPTY_FILTERS: ProductFilters = {
  q: '',
  category: '',
  brand: '',
  minPrice: '',
  maxPrice: '',
  inStock: false,
  onSale: false,
  minRating: 0
};

export function ProductsPage() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<ProductFilters>(() => ({
    ...EMPTY_FILTERS,
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || ''
  }));
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const brands = useMemo(
    () => [...new Set((products || []).map((p) => p.brand))].sort(),
    [products]
  );

  // اعمال فیلترها و مرتب‌سازی روی کاتالوگ
  const filtered = useMemo(() => {
    if (!products) return [];
    let list = [...products];

    if (filters.q) {
      const q = filters.q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }
    if (filters.category) list = list.filter((p) => p.category === filters.category);
    if (filters.brand) list = list.filter((p) => p.brand === filters.brand);
    if (filters.minPrice) list = list.filter((p) => finalPrice(p) >= Number(filters.minPrice));
    if (filters.maxPrice) list = list.filter((p) => finalPrice(p) <= Number(filters.maxPrice));
    if (filters.inStock) list = list.filter((p) => p.stock > 0);
    if (filters.onSale) list = list.filter((p) => p.discount > 0);
    if (filters.minRating) list = list.filter((p) => p.rating >= filters.minRating);

    switch (sort) {
      case 'price_asc':
        list.sort((a, b) => finalPrice(a) - finalPrice(b));
        break;
      case 'price_desc':
        list.sort((a, b) => finalPrice(b) - finalPrice(a));
        break;
      case 'discount':
        list.sort((a, b) => b.discount - a.discount);
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        break;
      default:
        list.sort((a, b) => b.views - a.views);
    }
    return list;
  }, [products, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const updateFilters = (patch: Partial<ProductFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };

  const clearAll = () => {
    setFilters({ ...EMPTY_FILTERS });
    setSearchParams({}, { replace: true });
    setPage(1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => key !== 'q' && value && value !== false && value !== 0
  ).length;

  return (
    <div className="page-enter container-page py-8">
      {/* عنوان و مرتب‌سازی */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {filters.category
              ? getCategoryName(filters.category)
              : filters.q
                ? `نتایج جستجو برای «${filters.q}»`
                : 'همه محصولات'}
          </h1>
          {!loading && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {faNum(filtered.length)} کالا یافت شد
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-primary-400 hover:text-primary-600 lg:hidden dark:border-slate-700 dark:text-slate-200"
          >
            فیلترها
            {activeFiltersCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-xs text-white">
                {faNum(activeFiltersCount)}
              </span>
            )}
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="مرتب‌سازی"
            className="input-base w-auto"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* فیلترهای فعال */}
      {activeFiltersCount > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {filters.q && <Chip label={`جستجو: ${filters.q}`} onClear={() => updateFilters({ q: '' })} />}
          {filters.category && (
            <Chip
              label={`دسته: ${getCategoryName(filters.category)}`}
              onClear={() => updateFilters({ category: '' })}
            />
          )}
          {filters.brand && <Chip label={`برند: ${filters.brand}`} onClear={() => updateFilters({ brand: '' })} />}
          {filters.minPrice && (
            <Chip label={`از ${faNum(filters.minPrice)} تومان`} onClear={() => updateFilters({ minPrice: '' })} />
          )}
          {filters.maxPrice && (
            <Chip label={`تا ${faNum(filters.maxPrice)} تومان`} onClear={() => updateFilters({ maxPrice: '' })} />
          )}
          {filters.inStock && <Chip label="فقط موجود" onClear={() => updateFilters({ inStock: false })} />}
          {filters.onSale && <Chip label="تخفیف‌دار" onClear={() => updateFilters({ onSale: false })} />}
          {filters.minRating > 0 && (
            <Chip label={`${faNum(filters.minRating)}+ ستاره`} onClear={() => updateFilters({ minRating: 0 })} />
          )}
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-rose-500 transition hover:text-rose-600"
          >
            پاک کردن همه
          </button>
        </div>
      )}

      <div className="flex gap-6">
        {/* فیلترهای دسکتاپ */}
        <aside className="hidden w-64 shrink-0 lg:block" aria-label="فیلترها">
          <div className="card sticky top-32 space-y-6 p-5">
            <FiltersPanel filters={filters} updateFilters={updateFilters} brands={brands} />
          </div>
        </aside>

        {/* شبکه محصولات */}
        <div className="min-w-0 flex-1">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<SearchIcon size={30} />}
              title="محصولی پیدا نشد"
              description="فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید."
              actionLabel="پاک کردن فیلترها"
              onAction={clearAll}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {pageItems.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {/* صفحه‌بندی */}
              {totalPages > 1 && (
                <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="صفحه‌بندی محصولات">
                  <PageBtn disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
                    قبلی
                  </PageBtn>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PageBtn key={i} active={i + 1 === currentPage} onClick={() => setPage(i + 1)}>
                      {faNum(i + 1)}
                    </PageBtn>
                  ))}
                  <PageBtn disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
                    بعدی
                  </PageBtn>
                </nav>
              )}
            </>
          )}
        </div>
      </div>

      {/* فیلترهای موبایل */}
      <Drawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} side="start" title="فیلترها">
        <div className="space-y-6 p-5">
          <FiltersPanel filters={filters} updateFilters={updateFilters} brands={brands} />
          <Button full onClick={() => setMobileFiltersOpen(false)}>
            نمایش {faNum(filtered.length)} کالا
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

interface FiltersPanelProps {
  filters: ProductFilters;
  updateFilters: (patch: Partial<ProductFilters>) => void;
  brands: string[];
}

function FiltersPanel({ filters, updateFilters, brands }: FiltersPanelProps) {
  return (
    <>
      <div>
        <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">دسته‌بندی</h3>
        <div className="space-y-1.5">
          {categories.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
              <input
                type="radio"
                name="category"
                checked={filters.category === c.id}
                onChange={() => updateFilters({ category: c.id })}
                className="h-4 w-4 accent-indigo-600"
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">برند</h3>
        <select
          value={filters.brand}
          onChange={(e) => updateFilters({ brand: e.target.value })}
          className="input-base"
          aria-label="فیلتر برند"
        >
          <option value="">همه برندها</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">بازه قیمت (تومان)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="از"
            value={filters.minPrice}
            onChange={(e) => updateFilters({ minPrice: e.target.value })}
            className="input-base"
            aria-label="حداقل قیمت"
          />
          <span className="text-slate-400">تا</span>
          <input
            type="number"
            min="0"
            placeholder="تا"
            value={filters.maxPrice}
            onChange={(e) => updateFilters({ maxPrice: e.target.value })}
            className="input-base"
            aria-label="حداکثر قیمت"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => updateFilters({ inStock: e.target.checked })}
            className="h-4 w-4 rounded accent-indigo-600"
          />
          فقط کالاهای موجود
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={filters.onSale}
            onChange={(e) => updateFilters({ onSale: e.target.checked })}
            className="h-4 w-4 rounded accent-indigo-600"
          />
          فقط تخفیف‌دار
        </label>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">حداقل امتیاز</h3>
        <select
          value={filters.minRating}
          onChange={(e) => updateFilters({ minRating: Number(e.target.value) })}
          className="input-base"
          aria-label="حداقل امتیاز"
        >
          <option value="0">همه امتیازها</option>
          <option value="4">۴ ستاره و بالاتر</option>
          <option value="3">۳ ستاره و بالاتر</option>
        </select>
      </div>
    </>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-600/10 px-3 py-1 text-xs font-medium text-primary-700 dark:text-primary-300">
      {label}
      <button type="button" onClick={onClear} aria-label={`حذف فیلتر ${label}`} className="transition hover:text-rose-500">
        <XIcon size={12} />
      </button>
    </span>
  );
}

function PageBtn({
  children,
  active,
  disabled,
  onClick
}: {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? 'page' : undefined}
      className={`min-w-9 rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? 'bg-primary-600 text-white'
          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
      }`}
    >
      {children}
    </button>
  );
}

// ═══════════════════════════ صفحه جزئیات محصول ═══════════════════════════

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let active = true;
    setProduct(null);
    setNotFound(false);
    setQty(1);
    if (!id) {
      setNotFound(true);
      return undefined;
    }
    getProductById(id)
      .then((p) => {
        if (!active) return undefined;
        setProduct(p);
        return getRelatedProducts(p);
      })
      .then((r) => {
        if (active && r) setRelated(r);
      })
      .catch(() => {
        if (active) setNotFound(true);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (notFound) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <span className="text-6xl">🔍</span>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">محصول پیدا نشد</h1>
        <p className="text-slate-500">محصول مورد نظر شما وجود ندارد یا حذف شده است.</p>
        <Link to="/products" className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-700">
          بازگشت به محصولات
        </Link>
      </div>
    );
  }

  if (!product) return <PageLoader />;

  return (
    <div className="page-enter container-page py-8">
      <ProductMain product={product} qty={qty} setQty={setQty} />
      <ProductInfo product={product} />
      <CommentsSection productId={product.id} />
      {related.length > 0 && (
        <section className="mt-14" aria-labelledby="related-title">
          <h2 id="related-title" className="mb-6 text-xl font-extrabold text-slate-900 dark:text-white">
            محصولات مشابه
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/** بخش اصلی: تصویر + اطلاعات خرید */
function ProductMain({
  product,
  qty,
  setQty
}: {
  product: Product;
  qty: number;
  setQty: (qty: number) => void;
}) {
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlist = useStore((s) => s.wishlist);

  const inWishlist = wishlist.includes(product.id);
  const outOfStock = product.stock <= 0;
  const badge = badgeOf(product.status);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* تصویر */}
      <div className="card overflow-hidden p-4">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          {product.discount > 0 && (
            <span className="absolute top-4 right-4 rounded-xl bg-rose-500 px-3 py-1.5 text-sm font-bold text-white shadow">
              {faNum(product.discount)}٪ تخفیف
            </span>
          )}
        </div>
        {product.colors.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 px-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">رنگ‌بندی:</span>
            {product.colors.map((c) => (
              <span key={c} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* اطلاعات */}
      <div className="space-y-5">
        {/* مسیر صفحه */}
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400" aria-label="مسیر صفحه">
          <Link to="/" className="transition hover:text-primary-600">خانه</Link>
          <ChevronLeftIcon size={13} />
          <Link to="/products" className="transition hover:text-primary-600">محصولات</Link>
          <ChevronLeftIcon size={13} />
          <Link to={`/products?category=${product.category}`} className="transition hover:text-primary-600">
            {getCategoryName(product.category)}
          </Link>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-extrabold leading-9 text-slate-900 sm:text-2xl dark:text-white">
            {product.name}
          </h1>
          {badge && (
            <span className={`rounded-lg px-2 py-1 text-xs font-bold ${badge.cls}`}>{badge.label}</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <RatingStars rating={product.rating} count={product.ratingCount} />
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 dark:text-slate-400">برند: {product.brand}</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 dark:text-slate-400">{faNum(product.views)} بازدید</span>
        </div>

        <p className="leading-8 text-slate-600 dark:text-slate-300">{product.desc}</p>

        {/* ویژگی‌ها */}
        <ul className="grid gap-2 sm:grid-cols-2">
          {product.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckIcon size={12} />
              </span>
              {f}
            </li>
          ))}
        </ul>

        {/* قیمت و خرید */}
        <div className="card space-y-4 bg-primary-50/60 p-5 dark:bg-primary-950/30">
          <div className="flex items-end justify-between">
            <div>
              {product.discount > 0 && (
                <div className="text-sm text-slate-400 line-through">{faNum(product.price)} تومان</div>
              )}
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {faNum(finalPrice(product))}
                <span className="ms-2 text-sm font-normal text-slate-400">تومان</span>
              </div>
            </div>
            <span
              className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                outOfStock ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-600'
              }`}
            >
              {outOfStock ? 'ناموجود' : `موجود (${faNum(product.stock)} عدد)`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <QuantityControl value={qty} max={product.stock || 1} onChange={setQty} />
            <Button className="flex-1" disabled={outOfStock} onClick={() => addToCart(product, qty)}>
              {outOfStock ? 'ناموجود' : 'افزودن به سبد خرید'}
            </Button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label={inWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
              aria-pressed={inWishlist}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                inWishlist
                  ? 'border-rose-300 bg-rose-50 text-rose-500 dark:border-rose-500/40 dark:bg-rose-500/10'
                  : 'border-slate-300 text-slate-400 hover:text-rose-500 dark:border-slate-700'
              }`}
            >
              <HeartIcon size={20} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="grid gap-2 border-t border-primary-600/10 pt-4 text-xs text-slate-500 sm:grid-cols-3 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><TruckIcon size={16} className="text-primary-500" /> ارسال سریع</span>
            <span className="flex items-center gap-1.5"><ShieldIcon size={16} className="text-primary-500" /> ضمانت اصالت</span>
            <span className="flex items-center gap-1.5"><PackageIcon size={16} className="text-primary-500" /> بازگشت ۷ روزه</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** تب مشخصات فنی و توضیحات */
function ProductInfo({ product }: { product: Product }) {
  const [tab, setTab] = useState<'specs' | 'desc'>('specs');

  return (
    <section className="card mt-10 p-6">
      <div className="mb-5 flex gap-1 border-b border-slate-200 dark:border-slate-800">
        {(
          [
            { id: 'specs', label: 'مشخصات فنی' },
            { id: 'desc', label: 'توضیحات' }
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-selected={tab === t.id}
            role="tab"
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === t.id
                ? 'border-primary-600 text-primary-600 dark:text-primary-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'specs' ? (
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {Object.entries(product.specs || {}).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-dashed border-slate-200 pb-2 text-sm dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">{k}</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{v}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="leading-8 text-slate-600 dark:text-slate-300">{product.desc}</p>
      )}
    </section>
  );
}

/** بخش دیدگاه‌ها */
function CommentsSection({ productId }: { productId: string }) {
  const comments = useStore(selectApprovedComments(productId));
  const addComment = useStore((s) => s.addComment);
  const user = useStore((s) => s.user);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addComment(productId, {
      name: user?.name || 'کاربر مهمان',
      rating,
      text: text.trim(),
      createdAt: new Date().toISOString()
    });
    setText('');
    setRating(5);
  };

  return (
    <section className="mt-10" aria-labelledby="comments-title">
      <h2 id="comments-title" className="mb-5 text-xl font-extrabold text-slate-900 dark:text-white">
        دیدگاه‌ها ({faNum(comments.length)})
      </h2>
      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={submit} className="card h-fit space-y-4 p-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">دیدگاه خود را بنویسید</h3>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-slate-500 dark:text-slate-400">امتیاز شما:</span>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="input-base w-auto" aria-label="امتیاز">
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {faNum(r)} ستاره
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            required
            placeholder="تجربه خود را با این محصول بنویسید…"
            aria-label="متن دیدگاه"
            className="input-base resize-none"
          />
          <Button type="submit" full>ثبت دیدگاه</Button>
        </form>

        <div className="space-y-4 lg:col-span-2">
          {comments.length === 0 ? (
            <div className="card p-10 text-center text-sm text-slate-400">
              هنوز دیدگاهی تأییدشده‌ای ثبت نشده است. اولین نفر باشید!
            </div>
          ) : (
            comments.map((c) => (
              <article key={c.id} className="card space-y-2 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600/10 text-sm font-bold text-primary-600">
                      {c.name.slice(0, 1)}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{c.name}</p>
                      <p className="text-xs text-slate-400">{faDate(c.createdAt)}</p>
                    </div>
                  </div>
                  <RatingStars rating={c.rating} showCount={false} />
                </div>
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{c.text}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════ صفحه سبد خرید ═══════════════════════════

export function CartPage() {
  const cart = useStore((s) => s.cart);
  const setQty = useStore((s) => s.setQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const clearCart = useStore((s) => s.clearCart);
  const settings = useStore((s) => s.settings);
  const navigate = useNavigate();

  const summary = cartSummary(cart, 'standard', {
    shippingFee: settings.shippingFee,
    expressFee: settings.expressFee,
    freeShippingOver: settings.freeShippingOver
  });

  if (cart.length === 0) {
    return (
      <div className="container-page py-10">
        <EmptyState
          icon={<BagIcon size={30} />}
          title="سبد خرید شما خالی است"
          description="محصولات مورد علاقه‌تان را به سبد اضافه کنید."
          actionLabel="مشاهده محصولات"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  return (
    <div className="page-enter container-page py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          سبد خرید ({toFa(summary.count)} کالا)
        </h1>
        <button
          type="button"
          onClick={clearCart}
          className="flex items-center gap-1.5 text-sm text-rose-500 transition hover:text-rose-600"
        >
          <TrashIcon size={15} /> حذف همه
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* آیتم‌ها */}
        <ul className="space-y-4 lg:col-span-2">
          {cart.map((item) => {
            const unitFinal = Math.round(item.price * (1 - item.discount / 100));
            return (
              <li key={item.productId} className="card flex gap-4 p-4">
                <Link to={`/product/${item.productId}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                </Link>
                <div className="flex flex-1 flex-col gap-2">
                  <Link to={`/product/${item.productId}`} className="line-clamp-1 font-medium text-slate-800 transition hover:text-primary-600 dark:text-slate-100">
                    {item.name}
                  </Link>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <QuantityControl value={item.qty} max={item.stock} onChange={(qty) => setQty(item.productId, qty)} />
                    <div className="flex items-center gap-3">
                      <div className="text-start">
                        {item.discount > 0 && (
                          <div className="text-xs text-slate-400 line-through">{faPrice(item.price * item.qty)}</div>
                        )}
                        <div className="font-bold text-slate-900 dark:text-white">{faPrice(unitFinal * item.qty)}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        aria-label={`حذف ${item.name} از سبد`}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
                      >
                        <TrashIcon size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          <Link to="/products" className="inline-flex items-center gap-1 text-sm text-primary-600 transition hover:text-primary-700 dark:text-primary-300">
            <ChevronLeftIcon size={15} /> ادامه خرید
          </Link>
        </ul>

        {/* خلاصه سفارش */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-32">
          <div className="card space-y-3 p-6">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">خلاصه سفارش</h2>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <dt>جمع کالاها ({toFa(summary.count)})</dt>
                <dd>{faPrice(summary.subtotal)}</dd>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <dt>سود شما از تخفیف</dt>
                  <dd>{faPrice(summary.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <dt>هزینه ارسال</dt>
                <dd>{summary.shipping === 0 ? 'رایگان' : faPrice(summary.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold text-slate-900 dark:border-slate-700 dark:text-white">
                <dt>مبلغ قابل پرداخت</dt>
                <dd>{faPrice(summary.total)}</dd>
              </div>
            </dl>
            <Button full size="lg" onClick={() => navigate('/checkout')}>
              ادامه فرآیند خرید
            </Button>
            <p className="text-center text-xs text-slate-400">
              ارسال سفارش‌های بالای {faPrice(settings.freeShippingOver)} رایگان است.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ═══════════════════════════ صفحه تسویه حساب ═══════════════════════════

const CHECKOUT_STEPS = [
  { id: 1, title: 'اطلاعات گیرنده', icon: '👤' },
  { id: 2, title: 'آدرس و ارسال', icon: '📍' },
  { id: 3, title: 'پرداخت', icon: '💳' }
];

interface CheckoutForm {
  receiverName: string;
  receiverPhone: string;
  email: string;
  province: string;
  city: string;
  address: string;
  postal: string;
  shippingMethod: string;
  paymentMethod: string;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const cart = useStore((s) => s.cart);
  const placeOrder = useStore((s) => s.placeOrder);
  const settings = useStore((s) => s.settings);
  const validateCoupon = useStore((s) => s.validateCoupon);

  const [step, setStep] = useState(1);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutForm>({
    mode: 'onTouched',
    defaultValues: {
      receiverName: user?.name || '',
      receiverPhone: user?.phone || '',
      email: user?.email || '',
      province: '',
      city: '',
      address: '',
      postal: '',
      shippingMethod: 'standard',
      paymentMethod: 'online'
    }
  });

  const shippingMethod = watch('shippingMethod');
  const paymentMethod = watch('paymentMethod');

  // هزینه ارسال از تنظیمات فروشگاه می‌آید
  const methods = shippingMethods.map((m) => ({
    ...m,
    cost: m.id === 'express' ? settings.expressFee : settings.shippingFee,
    freeOver: m.id === 'standard' ? settings.freeShippingOver : m.freeOver
  }));
  const summary = cartSummary(cart, shippingMethod, {
    shippingFee: settings.shippingFee,
    expressFee: settings.expressFee,
    freeShippingOver: settings.freeShippingOver,
    coupon: appliedCoupon
  });

  const onSubmit = (data: CheckoutForm) => {
    const order = placeOrder({
      receiver: { name: data.receiverName, phone: data.receiverPhone, email: data.email || '' },
      address: {
        province: data.province,
        city: data.city,
        fullAddress: data.address,
        postal: data.postal
      },
      shippingMethod: data.shippingMethod,
      shippingLabel: methods.find((m) => m.id === data.shippingMethod)?.name,
      paymentMethod: data.paymentMethod,
      paymentLabel: paymentMethods.find((m) => m.id === data.paymentMethod)?.name,
      total: summary.total,
      subtotal: summary.subtotal,
      discount: summary.discount,
      couponDiscount: summary.couponDiscount,
      couponCode: appliedCoupon?.code,
      shipping: summary.shipping
    });
    setPlacedOrder(order);
    window.scrollTo({ top: 0 });
  };

  const nextStep = async () => {
    let valid = false;
    if (step === 1) valid = await trigger(['receiverName', 'receiverPhone', 'email']);
    else if (step === 2) valid = await trigger(['province', 'city', 'address', 'postal']);
    if (valid || step > 2) setStep((s) => Math.min(3, s + 1));
  };

  // دکمه ثابت پایین فرم — submit بومی استفاده نمی‌شود تا تعویض مرحله
  // با Enter سفارش را زودتر از موعد ثبت نکند.
  const placeOrderNow = () => handleSubmit(onSubmit)();

  const applyCoupon = () => {
    const result = validateCoupon(couponInput, summary.subtotal);
    if (!result.ok || !result.coupon) {
      setAppliedCoupon(null);
      setCouponError(result.message || 'کد تخفیف نامعتبر است');
      return;
    }
    setAppliedCoupon(result.coupon);
    setCouponError('');
  };

  if (placedOrder) return <OrderSuccessView order={placedOrder} />;

  if (cart.length === 0) {
    return (
      <div className="container-page py-10">
        <EmptyState
          icon={<BagIcon size={30} />}
          title="سبد خرید شما خالی است"
          description="برای ثبت سفارش ابتدا محصولی به سبد اضافه کنید."
          actionLabel="مشاهده محصولات"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  return (
    <div className="page-enter container-page py-8">
      <h1 className="mb-8 text-2xl font-extrabold text-slate-900 dark:text-white">تسویه حساب</h1>

      {/* نوار مراحل */}
      <ol className="mb-8 flex items-center gap-2" aria-label="مراحل خرید">
        {CHECKOUT_STEPS.map((s, i) => (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => s.id < step && setStep(s.id)}
              aria-current={step === s.id ? 'step' : undefined}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition sm:text-sm ${
                step === s.id
                  ? 'bg-primary-600 text-white shadow-pop'
                  : s.id < step
                    ? 'bg-primary-600/10 text-primary-700 dark:text-primary-300'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
              }`}
            >
              <span className="hidden sm:inline">{s.icon}</span>
              <span className="hidden md:inline">{s.title}</span>
              <span className="md:hidden">{toFa(s.id)}</span>
            </button>
            {i < CHECKOUT_STEPS.length - 1 && <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />}
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* مرحله ۱: اطلاعات گیرنده */}
          {step === 1 && (
            <section className="card animate-fade-in space-y-5 p-6" aria-label="اطلاعات گیرنده">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">اطلاعات گیرنده</h2>
              <Field label="نام و نام خانوادگی" required id="receiverName" error={errors.receiverName?.message}>
                <input
                  id="receiverName"
                  className="input-base"
                  placeholder="مثلاً علی رضایی"
                  {...register('receiverName', {
                    required: 'نام گیرنده الزامی است',
                    minLength: { value: 3, message: 'نام باید حداقل ۳ حرف باشد' }
                  })}
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="شماره موبایل" required id="receiverPhone" error={errors.receiverPhone?.message}>
                  <input
                    id="receiverPhone"
                    type="tel"
                    dir="ltr"
                    className="input-base text-left"
                    placeholder="09xxxxxxxxx"
                    maxLength={11}
                    {...register('receiverPhone', {
                      required: 'شماره موبایل الزامی است',
                      pattern: { value: rules.phone.pattern, message: rules.phone.message }
                    })}
                  />
                </Field>
                <Field label="ایمیل" id="email" error={errors.email?.message} hint="جهت اطلاع‌رسانی وضعیت سفارش">
                  <input
                    id="email"
                    type="email"
                    dir="ltr"
                    className="input-base text-left"
                    placeholder="you@example.com"
                    {...register('email', {
                      pattern: { value: rules.email.pattern, message: rules.email.message }
                    })}
                  />
                </Field>
              </div>
            </section>
          )}

          {/* مرحله ۲: آدرس و ارسال */}
          {step === 2 && (
            <section className="card animate-fade-in space-y-5 p-6" aria-label="آدرس و ارسال">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">آدرس ارسال</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="استان" required id="province" error={errors.province?.message}>
                  <select id="province" className="input-base" {...register('province', { required: 'استان را انتخاب کنید' })}>
                    <option value="">انتخاب استان…</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </Field>
                <Field label="شهر" required id="city" error={errors.city?.message}>
                  <input
                    id="city"
                    className="input-base"
                    placeholder="مثلاً تهران"
                    {...register('city', { required: 'شهر الزامی است' })}
                  />
                </Field>
              </div>
              <Field label="نشانی کامل" required id="address" error={errors.address?.message}>
                <textarea
                  id="address"
                  rows={3}
                  className="input-base resize-none"
                  placeholder="خیابان، کوچه، پلاک، واحد…"
                  {...register('address', {
                    required: 'نشانی الزامی است',
                    minLength: { value: 10, message: 'نشانی باید حداقل ۱۰ کاراکتر باشد' }
                  })}
                />
              </Field>
              <Field label="کد پستی" required id="postal" error={errors.postal?.message}>
                <input
                  id="postal"
                  dir="ltr"
                  className="input-base text-left"
                  placeholder="10 رقم"
                  maxLength={10}
                  {...register('postal', {
                    required: 'کد پستی الزامی است',
                    pattern: { value: rules.postal.pattern, message: rules.postal.message }
                  })}
                />
              </Field>

              <div>
                <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">روش ارسال</h3>
                <div className="space-y-3">
                  {methods.map((m) => (
                    <label
                      key={m.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${
                        shippingMethod === m.id
                          ? 'border-primary-500 bg-primary-50/60 dark:bg-primary-950/30'
                          : 'border-slate-200 hover:border-primary-300 dark:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        value={m.id}
                        className="h-4 w-4 accent-indigo-600"
                        {...register('shippingMethod')}
                      />
                      <TruckIcon size={22} className="shrink-0 text-primary-500" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{m.name}</p>
                        <p className="text-xs text-slate-400">{m.eta}</p>
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {m.cost === 0 || (m.freeOver > 0 && summary.subtotal - summary.couponDiscount >= m.freeOver)
                          ? 'رایگان'
                          : faPrice(m.cost)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* مرحله ۳: پرداخت */}
          {step === 3 && (
            <section className="card animate-fade-in space-y-5 p-6" aria-label="پرداخت">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">روش پرداخت</h2>
              <div className="space-y-3">
                {paymentMethods.map((m) => (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${
                      paymentMethod === m.id
                        ? 'border-primary-500 bg-primary-50/60 dark:bg-primary-950/30'
                        : 'border-slate-200 hover:border-primary-300 dark:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      value={m.id}
                      className="h-4 w-4 accent-indigo-600"
                      {...register('paymentMethod')}
                    />
                    <span className="text-xl">{m.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{m.name}</p>
                      <p className="text-xs text-slate-400">{m.desc}</p>
                    </div>
                    <CreditCardIcon size={20} className="text-slate-300" />
                  </label>
                ))}
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                با ثبت سفارش، قوانین و مقررات فروشگاه HDKALA را می‌پذیرید. اطلاعات پرداخت شما
                به‌صورت رمزنگاری‌شده منتقل می‌شود.
              </div>
            </section>
          )}

          {/* ناوبری مراحل */}
          <div className="flex items-center justify-between gap-3">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
                مرحله قبل
              </Button>
            ) : (
              <span />
            )}
            <Button
              type="button"
              loading={isSubmitting}
              onClick={step < 3 ? nextStep : placeOrderNow}
            >
              {step < 3 ? 'مرحله بعد' : 'پرداخت و ثبت سفارش'}
            </Button>
          </div>
        </div>

        {/* خلاصه سفارش */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-32">
          <div className="card p-6">
            <h2 className="mb-4 text-base font-extrabold text-slate-900 dark:text-white">خلاصه سفارش</h2>
            <ul className="custom-scrollbar max-h-56 space-y-3 overflow-y-auto pe-1">
              {cart.map((item) => (
                <li key={item.productId} className="flex items-center gap-3">
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                    <img src={item.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-xs font-medium text-slate-700 dark:text-slate-200">{item.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{toFa(item.qty)} عدد</p>
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {faPrice(Math.round(item.price * (1 - item.discount / 100)) * item.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 dark:border-slate-700">
              <label className="block text-xs font-medium text-slate-500" htmlFor="coupon-code">
                کد تخفیف
              </label>
              <div className="flex gap-2">
                <input
                  id="coupon-code"
                  className="input-base"
                  placeholder="مثلاً WELCOME10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={applyCoupon}>
                  اعمال
                </Button>
              </div>
              {couponError && (
                <p className="text-xs text-rose-500" role="alert">
                  {couponError}
                </p>
              )}
            </div>
            <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <dt>جمع کالاها</dt>
                <dd>{faPrice(summary.subtotal)}</dd>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <dt>تخفیف کالا</dt>
                  <dd>{faPrice(summary.discount)}</dd>
                </div>
              )}
              {summary.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <dt>کد تخفیف {appliedCoupon?.code}</dt>
                  <dd>{faPrice(summary.couponDiscount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <dt>هزینه ارسال</dt>
                <dd>{summary.shipping === 0 ? 'رایگان' : faPrice(summary.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold text-slate-900 dark:border-slate-700 dark:text-white">
                <dt>قابل پرداخت</dt>
                <dd>{faPrice(summary.total)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

/** نمای موفقیت‌آمیز ثبت سفارش */
function OrderSuccessView({ order }: { order: Order }) {
  return (
    <div className="container-page flex flex-col items-center gap-5 py-20 text-center">
      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
        <CheckIcon size={44} />
      </span>
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">سفارش شما با موفقیت ثبت شد 🎉</h1>
      <p className="max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
        سفارش شما با کد{' '}
        <span className="font-bold text-primary-600" dir="ltr">{order.id}</span> ثبت شد و در وضعیت
        «{order.status}» قرار گرفت. جزئیات سفارش به شماره{' '}
        <span dir="ltr">{order.receiver.phone}</span> پیامک می‌شود.
      </p>
      <div className="card w-full max-w-sm space-y-2.5 p-5 text-sm">
        <div className="flex justify-between text-slate-500 dark:text-slate-400">
          <span>مبلغ پرداختی</span>
          <span className="font-bold text-slate-900 dark:text-white">{faPrice(order.total)}</span>
        </div>
        <div className="flex justify-between text-slate-500 dark:text-slate-400">
          <span>روش ارسال</span>
          <span>{order.shippingLabel}</span>
        </div>
        <div className="flex justify-between text-slate-500 dark:text-slate-400">
          <span>روش پرداخت</span>
          <span>{order.paymentLabel}</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/profile" className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-700">
          مشاهده سفارش‌ها
        </Link>
        <Link to="/products" className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:text-slate-200">
          <PackageIcon size={16} className="ms-1 inline" /> ادامه خرید
        </Link>
      </div>
    </div>
  );
}

// ═══════════════════════════ ورود و ثبت‌نام ═══════════════════════════

interface LoginForm {
  phone: string;
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useStore((s) => s.login);
  const loginDemo = useStore((s) => s.loginDemo);
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({ mode: 'onTouched' });

  const next = searchParams.get('next');

  const onSubmit = (data: LoginForm) => {
    setFormError('');
    const result = login(data.phone, data.password);
    if (!result.ok) {
      setFormError(result.message || 'ورود ناموفق بود');
      return;
    }
    navigate(next ? decodeURIComponent(next) : '/');
  };

  const demoLogin = () => {
    loginDemo();
    navigate(next ? decodeURIComponent(next) : '/');
  };

  return (
    <div className="page-enter flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md space-y-6 p-8">
        <div className="text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600/10 text-primary-600">
            <UserIcon size={26} />
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">ورود به حساب کاربری</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            برای ادامه خرید و مشاهده سفارش‌ها وارد شوید.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {formError && (
            <p role="alert" className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-500">
              {formError}
            </p>
          )}
          <Field label="شماره موبایل" required id="phone" error={errors.phone?.message}>
            <input
              id="phone"
              type="tel"
              dir="ltr"
              maxLength={11}
              className="input-base text-left"
              placeholder="09xxxxxxxxx"
              {...register('phone', {
                required: 'شماره موبایل الزامی است',
                pattern: { value: rules.phone.pattern, message: rules.phone.message }
              })}
            />
          </Field>
          <Field label="رمز عبور" required id="password" error={errors.password?.message}>
            <input
              id="password"
              type="password"
              className="input-base"
              placeholder="••••••••"
              {...register('password', {
                required: 'رمز عبور الزامی است',
                minLength: { value: 6, message: 'رمز عبور حداقل ۶ کاراکتر است' }
              })}
            />
          </Field>
          <Button type="submit" full size="lg" loading={isSubmitting}>
            ورود
          </Button>
        </form>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          یا
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <Button type="button" variant="outline" full onClick={demoLogin}>
          ورود سریع با حساب دمو
        </Button>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          حساب کاربری ندارید؟{' '}
          <Link to="/signup" className="font-bold text-primary-600 transition hover:text-primary-700 dark:text-primary-300">
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
}

interface SignupForm {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirm: string;
}

export function SignupPage() {
  const navigate = useNavigate();
  const signup = useStore((s) => s.signup);
  const toast = useStore((s) => s.toast);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<SignupForm>({ mode: 'onTouched' });

  const onSubmit = (data: SignupForm) => {
    const result = signup({
      name: data.name,
      phone: data.phone,
      email: data.email || '',
      password: data.password
    });
    if (!result.ok) {
      toast(result.message || 'ثبت‌نام ناموفق بود', 'error');
      return;
    }
    navigate('/');
  };

  return (
    <div className="page-enter flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">ایجاد حساب کاربری</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            با ثبت‌نام در HDKALA از تخفیف‌ها و سفارش‌های سریع بهره‌مند شوید.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Field label="نام و نام خانوادگی" required id="name" error={errors.name?.message}>
            <input
              id="name"
              className="input-base"
              placeholder="مثلاً علی رضایی"
              {...register('name', {
                required: 'نام الزامی است',
                minLength: { value: 3, message: 'نام باید حداقل ۳ حرف باشد' }
              })}
            />
          </Field>
          <Field label="شماره موبایل" required id="phone" error={errors.phone?.message}>
            <input
              id="phone"
              type="tel"
              dir="ltr"
              maxLength={11}
              className="input-base text-left"
              placeholder="09xxxxxxxxx"
              {...register('phone', {
                required: 'شماره موبایل الزامی است',
                pattern: { value: rules.phone.pattern, message: rules.phone.message }
              })}
            />
          </Field>
          <Field label="ایمیل" id="email" error={errors.email?.message} hint="اختیاری">
            <input
              id="email"
              type="email"
              dir="ltr"
              className="input-base text-left"
              placeholder="you@example.com"
              {...register('email', {
                pattern: { value: rules.email.pattern, message: rules.email.message }
              })}
            />
          </Field>
          <Field label="رمز عبور" required id="password" error={errors.password?.message} hint="حداقل ۶ کاراکتر">
            <input
              id="password"
              type="password"
              className="input-base"
              placeholder="••••••••"
              {...register('password', {
                required: 'رمز عبور الزامی است',
                minLength: { value: 6, message: 'رمز عبور حداقل ۶ کاراکتر است' }
              })}
            />
          </Field>
          <Field label="تکرار رمز عبور" required id="confirm" error={errors.confirm?.message}>
            <input
              id="confirm"
              type="password"
              className="input-base"
              placeholder="••••••••"
              {...register('confirm', {
                required: 'تکرار رمز عبور الزامی است',
                validate: (v) => v === watch('password') || 'رمز عبور و تکرار آن یکسان نیستند'
              })}
            />
          </Field>
          <Button type="submit" full size="lg" loading={isSubmitting}>
            ثبت‌نام
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link to="/login" className="font-bold text-primary-600 transition hover:text-primary-700 dark:text-primary-300">
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════ پروفایل کاربر ═══════════════════════════

interface ProfileForm {
  name: string;
  email: string;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const orders = useStore((s) => s.orders.filter((o) => !o.userId || o.userId === user?.id));
  const wishlist = useStore((s) => s.wishlist);
  const updateUser = useStore((s) => s.updateUser);
  const cancelOrder = useStore((s) => s.cancelOrder);
  const logout = useStore((s) => s.logout);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProfileForm>({
    mode: 'onTouched',
    defaultValues: { name: user?.name || '', email: user?.email || '' }
  });

  const onSubmit = (data: ProfileForm) => updateUser({ name: data.name, email: data.email });

  return (
    <div className="page-enter container-page py-8">
      {/* کارت کاربر */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-400 text-2xl font-extrabold text-white shadow-pop">
            {(user?.name || 'ک').slice(0, 1)}
          </span>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{user?.name}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400" dir="ltr">{user?.phone}</p>
            <p className="text-xs text-slate-400">عضو HDKALA</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/wishlist" className="flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:text-slate-200">
            <HeartIcon size={16} /> علاقه‌مندی‌ها ({toFa(wishlist.length)})
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-1.5 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-medium text-rose-500 transition hover:bg-rose-50 dark:border-rose-500/30 dark:hover:bg-rose-500/10"
          >
            <LogoutIcon size={16} /> خروج
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ویرایش اطلاعات */}
        <form onSubmit={handleSubmit(onSubmit)} className="card h-fit space-y-5 p-6" noValidate>
          <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900 dark:text-white">
            <UserIcon size={18} className="text-primary-500" /> اطلاعات حساب
          </h2>
          <Field label="نام و نام خانوادگی" required id="profile-name" error={errors.name?.message}>
            <input
              id="profile-name"
              className="input-base"
              {...register('name', {
                required: 'نام الزامی است',
                minLength: { value: 3, message: 'نام باید حداقل ۳ حرف باشد' }
              })}
            />
          </Field>
          <Field label="شماره موبایل" id="profile-phone">
            <input id="profile-phone" value={user?.phone || ''} disabled dir="ltr" className="input-base text-left" />
          </Field>
          <Field label="ایمیل" id="profile-email" error={errors.email?.message}>
            <input
              id="profile-email"
              type="email"
              dir="ltr"
              className="input-base text-left"
              {...register('email', {
                pattern: { value: rules.email.pattern, message: rules.email.message }
              })}
            />
          </Field>
          <Button type="submit" full>ذخیره تغییرات</Button>
        </form>

        {/* سفارش‌ها */}
        <section className="space-y-4 lg:col-span-2" aria-labelledby="orders-title">
          <h2 id="orders-title" className="flex items-center gap-2 text-base font-extrabold text-slate-900 dark:text-white">
            <PackageIcon size={18} className="text-primary-500" /> سفارش‌های من ({toFa(orders.length)})
          </h2>
          {orders.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 p-12 text-center">
              <span className="text-4xl">📦</span>
              <p className="font-medium text-slate-600 dark:text-slate-300">هنوز سفارشی ثبت نکرده‌اید</p>
              <Link to="/products" className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700">
                مشاهده محصولات
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <article key={order.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-white" dir="ltr">{order.id}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{faDate(order.createdAt)}</p>
                  </div>
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${ORDER_STATUS_CLASS[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <ul className="divide-y divide-slate-100 py-2 dark:divide-slate-800">
                  {order.items.map((item) => (
                    <li key={item.productId} className="flex items-center gap-3 py-2.5">
                      <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                        <img src={item.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-medium text-slate-700 dark:text-slate-200">{item.name}</p>
                        <p className="text-xs text-slate-400">{toFa(item.qty)} عدد</p>
                      </div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {faPrice(Math.round(item.price * (1 - item.discount / 100)) * item.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="text-sm">
                    <p className="text-slate-500 dark:text-slate-400">
                      ارسال به: {order.address.city}، {order.address.province}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {order.shippingLabel} · {order.paymentLabel} ·{' '}
                      {faNum(order.items.reduce((s, i) => s + i.qty, 0))} کالا
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">{faPrice(order.total)}</span>
                    {order.status === 'در حال پردازش' && (
                      <button
                        type="button"
                        onClick={() => cancelOrder(order.id)}
                        className="text-xs font-medium text-rose-500 transition hover:text-rose-600"
                      >
                        لغو سفارش
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

// ═══════════════════════════ علاقه‌مندی‌ها ═══════════════════════════

export function WishlistPage() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const wishlist = useStore((s) => s.wishlist);

  const items = (products || []).filter((p) => wishlist.includes(p.id));

  return (
    <div className="page-enter container-page py-8">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-900 dark:text-white">
        علاقه‌مندی‌های من ({toFa(wishlist.length)})
      </h1>
      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<HeartIcon size={30} />}
          title="لیست علاقه‌مندی‌ها خالی است"
          description="با کلیک روی قلب محصولات، آن‌ها را اینجا نگه دارید."
          actionLabel="مشاهده محصولات"
          onAction={() => navigate('/products')}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════ درباره ما ═══════════════════════════

const aboutValues = [
  { icon: ShieldIcon, title: 'اعتماد', desc: 'ضمانت اصالت تمام کالاها و همکاری فقط با برندها و تأمین‌کنندگان معتبر.' },
  { icon: TruckIcon, title: 'سرعت', desc: 'ارسال سفارش‌ها در سریع‌ترین زمان ممکن به سراسر کشور با بسته‌بندی ایمن.' },
  { icon: HeadsetIcon, title: 'پشتیبانی', desc: 'تیم پشتیبانی ما هفت روز هفته آماده پاسخگویی و حل مشکلات شماست.' },
  { icon: CheckIcon, title: 'شفافیت', desc: 'قیمت‌گذاری منصفانه و اطلاع‌رسانی دقیق از وضعیت هر سفارش.' }
];

const aboutStats = [
  { value: '۵ سال', label: 'تجربه فروش آنلاین' },
  { value: '+۱٬۰۰۰', label: 'کالای متنوع' },
  { value: '+۵۰٬۰۰۰', label: 'مشتری راضی' },
  { value: '۳۱', label: 'استان تحت پوشش' }
];

export function AboutPage() {
  return (
    <div className="page-enter">
      {/* هیرو */}
      <section className="bg-gradient-to-l from-primary-700 via-primary-600 to-primary-800 py-16 text-white">
        <div className="container-page">
          <h1 className="text-3xl font-extrabold">درباره HDKALA</h1>
          <p className="mt-4 max-w-2xl leading-8 text-indigo-100">
            HDKALA یک فروشگاه اینترنتی ایرانی است که با هدف ساده‌کردن خرید آنلاین متولد شد؛ جایی که
            کیفیت، اعتماد و سرعت در اولویت قرار دارد.
          </p>
        </div>
      </section>

      {/* آمار */}
      <section className="container-page -mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="آمار فروشگاه">
        {aboutStats.map((s) => (
          <div key={s.label} className="card p-6 text-center">
            <p className="text-2xl font-extrabold text-primary-600 dark:text-primary-300">{s.value}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ارزش‌ها */}
      <section className="container-page py-14">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-900 dark:text-white">ارزش‌های ما</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {aboutValues.map((v) => (
            <div key={v.title} className="card p-6">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600/10 text-primary-600 dark:text-primary-300">
                <v.icon size={24} />
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{v.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* داستان */}
      <section className="container-page pb-14">
        <div className="card p-8 leading-8 text-slate-600 dark:text-slate-300">
          <h2 className="mb-4 text-xl font-extrabold text-slate-900 dark:text-white">داستان ما</h2>
          <p>
            HDKALA فعالیت خود را در سال {toFa(1399)} با یک تیم کوچک و یک هدف بزرگ آغاز کرد: حذف
            واسطه‌های غیرضروری و رساندن بهترین کالاها با قیمت منصفانه به دست مردم. امروز با همکاری
            ده‌ها برند معتبر داخلی و بین‌المللی، هزاران کالا را در دسته‌بندی‌های الکترونیک، مد و
            پوشاک، خانه و آشپزخانه، کتاب و ورزشی عرضه می‌کنیم.
          </p>
          <p className="mt-4">
            ما به این باور رسیده‌ایم که خرید آنلاین فقط «کلیک و پرداخت» نیست؛ یک تجربه کامل است که
            باید سریع، شفاف و لذت‌بخش باشد. به همین دلیل روی هر مرحله از مسیر خرید — از جستجو تا
            تحویل — تمرکز کرده‌ایم.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/products" className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-700">
              شروع خرید
            </Link>
            <Link to="/contact" className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:text-slate-200">
              تماس با ما
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════ تماس با ما ═══════════════════════════

const contactInfo = [
  { icon: PhoneIcon, title: 'تلفن پشتیبانی', value: '۰۲۱-۹۱۰۰۸۰۰۰', dir: 'ltr' as const },
  { icon: MailIcon, title: 'ایمیل', value: 'info@hdkala.ir', dir: 'ltr' as const },
  { icon: MapPinIcon, title: 'آدرس', value: 'تهران، خیابان ولیعصر، مرکز خرید HDKALA، طبقه سوم' },
  { icon: ClockIcon, title: 'ساعت پاسخگویی', value: 'همه‌روزه از ۹ صبح تا ۹ شب' }
];

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactPage() {
  const toast = useStore((s) => s.toast);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactForm>({ mode: 'onTouched' });

  const onSubmit = () => {
    toast('پیام شما با موفقیت ارسال شد. به‌زودی با شما تماس می‌گیریم.');
    reset();
  };

  return (
    <div className="page-enter container-page py-10">
      <h1 className="mb-2 text-2xl font-extrabold text-slate-900 dark:text-white">تماس با ما</h1>
      <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
        سؤال یا پیشنهادی دارید؟ خوشحال می‌شویم از شما بشنویم.
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* اطلاعات تماس */}
        <div className="space-y-4">
          {contactInfo.map((c) => (
            <div key={c.title} className="card flex items-start gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600/10 text-primary-600 dark:text-primary-300">
                <c.icon size={20} />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400" dir={c.dir}>
                  {c.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* فرم تماس */}
        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 p-6 lg:col-span-2" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="نام و نام خانوادگی" required id="contact-name" error={errors.name?.message}>
              <input
                id="contact-name"
                className="input-base"
                {...register('name', { required: 'نام الزامی است' })}
              />
            </Field>
            <Field label="ایمیل" required id="contact-email" error={errors.email?.message}>
              <input
                id="contact-email"
                type="email"
                dir="ltr"
                className="input-base text-left"
                {...register('email', {
                  required: 'ایمیل الزامی است',
                  pattern: { value: rules.email.pattern, message: rules.email.message }
                })}
              />
            </Field>
          </div>
          <Field label="موضوع" required id="contact-subject" error={errors.subject?.message}>
            <input
              id="contact-subject"
              className="input-base"
              {...register('subject', { required: 'موضوع الزامی است' })}
            />
          </Field>
          <Field label="پیام" required id="contact-message" error={errors.message?.message}>
            <textarea
              id="contact-message"
              rows={5}
              className="input-base resize-none"
              placeholder="متن پیام خود را بنویسید…"
              {...register('message', {
                required: 'متن پیام الزامی است',
                minLength: { value: 10, message: 'پیام باید حداقل ۱۰ کاراکتر باشد' }
              })}
            />
          </Field>
          <Button type="submit" size="lg" loading={isSubmitting}>
            ارسال پیام
          </Button>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════ صفحه ۴۰۴ ═══════════════════════════

export function NotFoundPage() {
  return (
    <div className="container-page flex flex-col items-center gap-5 py-24 text-center">
      <p className="bg-gradient-to-br from-primary-600 to-accent-400 bg-clip-text text-8xl font-extrabold text-transparent">
        ۴۰۴
      </p>
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">صفحه پیدا نشد!</h1>
      <p className="max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
        صفحه‌ای که دنبال آن هستید وجود ندارد یا جابه‌جا شده است. نگران نباشید، از اینجا می‌توانید به
        فروشگاه برگردید.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-700">
          صفحه اصلی
        </Link>
        <Link to="/products" className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:text-slate-200">
          مشاهده محصولات
        </Link>
      </div>
    </div>
  );
}
