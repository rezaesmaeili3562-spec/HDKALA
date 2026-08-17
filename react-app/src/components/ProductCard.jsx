import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { statusLabels, getCategoryName } from '../data/categories';
import { faNum, finalPrice } from '../utils/format';
import RatingStars from './RatingStars';
import { AddToCartButton } from './Button';
import { HeartIcon, BagIcon } from './Icons';

// کارت محصول — لینک به جزئیات + افزودن به سبد + علاقه‌مندی
export default function ProductCard({ product }) {
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlist = useStore((s) => s.wishlist);

  const inWishlist = wishlist.includes(product.id);
  const inCart = useStore((s) => s.cart.some((i) => i.productId === product.id));
  const outOfStock = product.stock <= 0;
  const status = statusLabels[product.status];

  return (
    <article className="group card relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-pop">
      {/* تصویر */}
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800"
        aria-label={product.name}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.discount > 0 && (
          <span className="absolute top-3 right-3 rounded-lg bg-rose-500 px-2 py-1 text-xs font-bold text-white shadow">
            {faNum(product.discount)}٪
          </span>
        )}
        {status && (
          <span className={`absolute top-3 left-3 rounded-lg px-2 py-1 text-xs font-bold ${status.cls}`}>
            {status.label}
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-bold text-slate-500 backdrop-blur-sm dark:bg-slate-950/70 dark:text-slate-300">
            ناموجود
          </span>
        )}
      </Link>

      {/* علاقه‌مندی */}
      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-label={inWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
        aria-pressed={inWishlist}
        className={`absolute top-3 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 shadow backdrop-blur transition hover:scale-110 dark:bg-slate-900/90 ${
          inWishlist ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
        } ${status ? 'top-11' : ''}`}
      >
        <HeartIcon size={18} fill={inWishlist ? 'currentColor' : 'none'} />
      </button>

      {/* بدنه */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500">
          <span>{getCategoryName(product.category)}</span>
          <span>{product.brand}</span>
        </div>
        <Link to={`/product/${product.id}`} className="line-clamp-2 min-h-12 font-medium text-slate-800 transition hover:text-primary-600 dark:text-slate-100 dark:hover:text-primary-300">
          {product.name}
        </Link>
        <RatingStars rating={product.rating} count={product.ratingCount} showCount={false} />

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">
              {faNum(finalPrice(product))}
              <span className="ms-1 text-[10px] font-normal text-slate-400">تومان</span>
            </div>
            {product.discount > 0 && (
              <div className="text-xs text-slate-400 line-through dark:text-slate-500">
                {faNum(product.price)}
              </div>
            )}
          </div>
          <AddToCartButton
            compact
            disabled={outOfStock}
            inCart={inCart}
            onClick={() => addToCart(product)}
          />
        </div>
      </div>
    </article>
  );
}
