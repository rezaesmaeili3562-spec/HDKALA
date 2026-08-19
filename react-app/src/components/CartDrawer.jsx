import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { cartSummary, faPrice, toFa } from '../utils/format';
import Drawer from './Drawer';
import QuantityControl from './QuantityControl';
import Button from './Button';
import { BagIcon, TrashIcon } from './Icons';

// کشوی سبد خرید — از همه صفحات با دکمه سبد در هدر باز می‌شود
export default function CartDrawer() {
  const cartOpen = useStore((s) => s.cartOpen);
  const closeCart = useStore((s) => s.closeCart);
  const cart = useStore((s) => s.cart);
  const setQty = useStore((s) => s.setQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const settings = useStore((s) => s.settings);
  const navigate = useNavigate();

  const summary = cartSummary(cart, 'standard', {
    shippingFee: settings.shippingFee,
    expressFee: settings.expressFee,
    freeShippingOver: settings.freeShippingOver
  });

  const goTo = (path) => {
    closeCart();
    navigate(path);
  };

  return (
    <Drawer
      open={cartOpen}
      onClose={closeCart}
      side="end"
      title={`سبد خرید (${toFa(summary.count)} کالا)`}
      labelledBy="cart-drawer-title"
    >
      {cart.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
            <BagIcon size={28} />
          </div>
          <p className="font-medium text-slate-600 dark:text-slate-300">سبد خرید شما خالی است</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            محصولات مورد علاقه‌تان را به سبد اضافه کنید
          </p>
          <Button className="mt-2" onClick={() => goTo('/products')}>
            مشاهده محصولات
          </Button>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {cart.map((item) => (
              <li key={item.productId} className="flex gap-3 p-4">
                <button
                  type="button"
                  onClick={() => goTo(`/product/${item.productId}`)}
                  className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800"
                  aria-label={item.name}
                >
                  <img src={item.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
                <div className="flex flex-1 flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => goTo(`/product/${item.productId}`)}
                    className="line-clamp-1 text-start text-sm font-medium text-slate-800 hover:text-primary-600 dark:text-slate-100"
                  >
                    {item.name}
                  </button>
                  <div className="flex items-center justify-between">
                    <QuantityControl
                      small
                      value={item.qty}
                      max={item.stock}
                      onChange={(qty) => setQty(item.productId, qty)}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {faPrice(Math.round(item.price * (1 - item.discount / 100)) * item.qty)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        aria-label="حذف از سبد"
                        className="text-slate-400 transition hover:text-rose-500"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                  {item.discount > 0 && (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      سود شما: {faPrice((item.price - Math.round(item.price * (1 - item.discount / 100))) * item.qty)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-slate-100 p-4 dark:border-slate-800">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <dt>جمع کالاها</dt>
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
                <dd>{summary.subtotal === 0 || summary.subtotal >= 500000 ? 'رایگان' : faPrice(summary.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-slate-900 dark:border-slate-700 dark:text-white">
                <dt>مبلغ قابل پرداخت</dt>
                <dd>{faPrice(summary.total)}</dd>
              </div>
            </dl>
            <div className="mt-4 space-y-2">
              <Button full onClick={() => goTo('/cart')}>
                مشاهده سبد خرید
              </Button>
              <Button full variant="outline" onClick={closeCart}>
                ادامه خرید
              </Button>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}
