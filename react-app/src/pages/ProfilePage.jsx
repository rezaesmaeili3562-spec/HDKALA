import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { faDate, faPrice, faNum, rules, toFa } from '../utils/format';
import Field from '../components/Field';
import Button from '../components/Button';
import { UserIcon, PackageIcon, HeartIcon, LogoutIcon } from '../components/Icons';

const orderStatusCls = {
  'در حال پردازش': 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  'لغو شده': 'bg-rose-500/15 text-rose-500',
  'تحویل شده': 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
};

// ---------- پنل کاربری و تاریخچه سفارش‌ها ----------
export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const orders = useStore((s) => s.orders);
  const wishlist = useStore((s) => s.wishlist);
  const updateUser = useStore((s) => s.updateUser);
  const cancelOrder = useStore((s) => s.cancelOrder);
  const logout = useStore((s) => s.logout);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onTouched',
    defaultValues: { name: user?.name || '', email: user?.email || '' }
  });

  const onSubmit = (data) => updateUser({ name: data.name, email: data.email });

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
              data-testid="profile-name"
              {...register('name', { required: 'نام الزامی است', minLength: { value: 3, message: 'نام باید حداقل ۳ حرف باشد' } })}
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
              data-testid="profile-email"
              {...register('email', { pattern: { value: rules.email.pattern, message: rules.email.message } })}
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
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${orderStatusCls[order.status] || 'bg-slate-500/10 text-slate-500'}`}>
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
                      {order.shippingLabel} · {order.paymentLabel} · {faNum(order.items.reduce((s, i) => s + i.qty, 0))} کالا
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
