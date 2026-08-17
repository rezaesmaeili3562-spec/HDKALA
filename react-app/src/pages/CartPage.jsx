import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { cartSummary, faPrice, toFa } from '../utils/format';
import QuantityControl from '../components/QuantityControl';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { BagIcon, TrashIcon, ChevronLeftIcon } from '../components/Icons';

// ---------- صفحه سبد خرید ----------
export default function CartPage() {
  const cart = useStore((s) => s.cart);
  const setQty = useStore((s) => s.setQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const clearCart = useStore((s) => s.clearCart);
  const navigate = useNavigate();

  const summary = cartSummary(cart);

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
                <dd>{summary.subtotal >= 500000 || summary.subtotal === 0 ? 'رایگان' : faPrice(summary.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold text-slate-900 dark:border-slate-700 dark:text-white">
                <dt>مبلغ قابل پرداخت</dt>
                <dd>{faPrice(summary.total)}</dd>
              </div>
            </dl>
            <Button full size="lg" onClick={() => navigate('/checkout')} data-testid="proceed-checkout">
              ادامه فرآیند خرید
            </Button>
            <p className="text-center text-xs text-slate-400">
              ارسال سفارش‌های بالای ۵۰۰ هزار تومان رایگان است.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
