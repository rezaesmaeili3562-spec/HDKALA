import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductById, getRelatedProducts } from '../services/api';
import { useStore } from '../store/useStore';
import { getCategoryName, statusLabels } from '../data/categories';
import { faNum, faDate, finalPrice } from '../utils/format';
import ProductCard from '../components/ProductCard';
import RatingStars from '../components/RatingStars';
import QuantityControl from '../components/QuantityControl';
import Button from '../components/Button';
import PageLoader from '../components/PageLoader';
import { HeartIcon, CheckIcon, ChevronLeftIcon, PackageIcon, TruckIcon, ShieldIcon } from '../components/Icons';

// ---------- صفحه جزئیات محصول ----------
export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let active = true;
    setProduct(null);
    setNotFound(false);
    setQty(1);
    getProductById(id)
      .then((p) => {
        if (!active) return;
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

// ---------- بخش اصلی: تصویر + اطلاعات خرید ----------
function ProductMain({ product, qty, setQty }) {
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlist = useStore((s) => s.wishlist);

  const inWishlist = wishlist.includes(product.id);
  const outOfStock = product.stock <= 0;
  const status = statusLabels[product.status];

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
        {product.colors?.length > 0 && (
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
        {/* مسیر */}
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
          {status && (
            <span className={`rounded-lg px-2 py-1 text-xs font-bold ${status.cls}`}>{status.label}</span>
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
            <Button
              className="flex-1"
              disabled={outOfStock}
              onClick={() => addToCart(product, qty)}
              data-testid="add-to-cart-detail"
            >
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

// ---------- تب مشخصات فنی ----------
function ProductInfo({ product }) {
  const [tab, setTab] = useState('specs');
  return (
    <section className="card mt-10 p-6">
      <div className="mb-5 flex gap-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'specs', label: 'مشخصات فنی' },
          { id: 'desc', label: 'توضیحات' }
        ].map((t) => (
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

// ---------- نظرات ----------
function CommentsSection({ productId }) {
  const comments = useStore((s) => s.comments[productId] || []);
  const addComment = useStore((s) => s.addComment);
  const user = useStore((s) => s.user);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);

  const submit = (e) => {
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
                <option key={r} value={r}>{faNum(r)} ستاره</option>
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
              هنوز دیدگاهی ثبت نشده است. اولین نفر باشید!
            </div>
          ) : (
            comments.map((c, i) => (
              <article key={i} className="card space-y-2 p-5">
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
