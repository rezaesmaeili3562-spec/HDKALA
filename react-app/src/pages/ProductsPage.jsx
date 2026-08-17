import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { categories } from '../data/categories';
import { faNum, finalPrice } from '../utils/format';
import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductSkeleton';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import Drawer from '../components/Drawer';
import { SearchIcon, XIcon } from '../components/Icons';

const PAGE_SIZE = 12;

const sortOptions = [
  { value: 'popular', label: 'پربازدیدترین' },
  { value: 'newest', label: 'جدیدترین' },
  { value: 'price_asc', label: 'ارزان‌ترین' },
  { value: 'price_desc', label: 'گران‌ترین' },
  { value: 'discount', label: 'بیشترین تخفیف' }
];

const EMPTY_FILTERS = {
  q: '',
  category: '',
  brand: '',
  minPrice: '',
  maxPrice: '',
  inStock: false,
  onSale: false,
  minRating: 0
};

// ---------- صفحه لیست محصولات با فیلتر و مرتب‌سازی ----------
export default function ProductsPage() {
  const { products, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => ({
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

  // اعمال فیلترها و مرتب‌سازی
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
        list.sort((a, b) => new Date(b.created) - new Date(a.created));
        break;
      default:
        list.sort((a, b) => b.views - a.views);
    }
    return list;
  }, [products, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const updateFilters = (patch) => {
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

  const activeFiltersCount = Object.entries(filters).filter(([k, v]) => k !== 'q' && v && v !== false && v !== 0).length;

  if (error) {
    return (
      <div className="container-page">
        <EmptyState
          title="خطا در دریافت محصولات"
          description="مشکلی در بارگذاری داده‌ها پیش آمده است. لطفاً دوباره تلاش کنید."
        />
      </div>
    );
  }

  return (
    <div className="page-enter container-page py-8">
      {/* عنوان */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {filters.category
              ? categories.find((c) => c.id === filters.category)?.name || 'محصولات'
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
              label={`دسته: ${categories.find((c) => c.id === filters.category)?.name}`}
              onClear={() => updateFilters({ category: '' })}
            />
          )}
          {filters.brand && <Chip label={`برند: ${filters.brand}`} onClear={() => updateFilters({ brand: '' })} />}
          {filters.minPrice && <Chip label={`از ${faNum(filters.minPrice)} تومان`} onClear={() => updateFilters({ minPrice: '' })} />}
          {filters.maxPrice && <Chip label={`تا ${faNum(filters.maxPrice)} تومان`} onClear={() => updateFilters({ maxPrice: '' })} />}
          {filters.inStock && <Chip label="فقط موجود" onClear={() => updateFilters({ inStock: false })} />}
          {filters.onSale && <Chip label="تخفیف‌دار" onClear={() => updateFilters({ onSale: false })} />}
          {filters.minRating > 0 && <Chip label={`${faNum(filters.minRating)}+ ستاره`} onClear={() => updateFilters({ minRating: 0 })} />}
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
                    <PageBtn
                      key={i}
                      active={i + 1 === currentPage}
                      onClick={() => setPage(i + 1)}
                    >
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

// ---------- پنل فیلترها ----------
function FiltersPanel({ filters, updateFilters, brands }) {
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
            <option key={b} value={b}>{b}</option>
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

function Chip({ label, onClear }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-600/10 px-3 py-1 text-xs font-medium text-primary-700 dark:text-primary-300">
      {label}
      <button type="button" onClick={onClear} aria-label={`حذف فیلتر ${label}`} className="transition hover:text-rose-500">
        <XIcon size={12} />
      </button>
    </span>
  );
}

function PageBtn({ children, active, disabled, onClick }) {
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
