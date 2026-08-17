import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductSkeleton';
import { CheckIcon } from '../components/Icons';
import { useStore } from '../store/useStore';

// ---------- صفحه اصلی ----------
export default function HomePage() {
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
      {/* ---------- هیرو ---------- */}
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
              جدیدترین محصولات از معتبرترین برندها؛ با ضمانت اصالت کالا، ارسال سریع به سراسر
              کشور و ۷ روز مهلت بازگشت.
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

      {/* ---------- دسته‌بندی‌ها ---------- */}
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

      {/* ---------- محصولات ویژه ---------- */}
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

      {/* ---------- پرفروش‌ترین‌ها ---------- */}
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

      {/* ---------- خبرنامه ---------- */}
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
  return (
    <form
      className="flex w-full max-w-md gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        toast('عضویت شما در خبرنامه ثبت شد 🎉');
        e.target.reset();
      }}
    >
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
