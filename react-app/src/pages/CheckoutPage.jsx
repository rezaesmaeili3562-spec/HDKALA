import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { cartSummary, faPrice, toFa, rules } from '../utils/format';
import { provinces, shippingMethods, paymentMethods } from '../data/categories';
import Field from '../components/Field';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { CheckIcon, BagIcon, TruckIcon, CreditCardIcon, PackageIcon } from '../components/Icons';

const STEPS = [
  { id: 1, title: 'اطلاعات گیرنده', icon: '👤' },
  { id: 2, title: 'آدرس و ارسال', icon: '📍' },
  { id: 3, title: 'پرداخت', icon: '💳' }
];

// ---------- فرآیند پرداخت چندمرحله‌ای ----------
export default function CheckoutPage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const cart = useStore((s) => s.cart);
  const placeOrder = useStore((s) => s.placeOrder);

  const [step, setStep] = useState(1);
  const [placedOrder, setPlacedOrder] = useState(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
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
  const summary = cartSummary(cart, shippingMethod);

  // اگر سفارش ثبت شد → صفحه موفقیت
  if (placedOrder) {
    return <SuccessView order={placedOrder} />;
  }

  // اگر سبد خالی است
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

  const nextStep = async () => {
    let valid = false;
    if (step === 1) {
      valid = await trigger(['receiverName', 'receiverPhone', 'email']);
    } else if (step === 2) {
      valid = await trigger(['province', 'city', 'address', 'postal']);
    }
    if (valid || step > 2) setStep((s) => Math.min(3, s + 1));
  };

  // ثبت نهایی سفارش در مرحله ۳ (بدون دکمه submit بومی —
  // تعویض درجای دکمه با دکمه submit باعث submit ناخواسته فرم می‌شد)
  const placeOrderNow = () => handleSubmit(onSubmit)();

  const onSubmit = (data) => {
    // اگر هنوز در مراحل اولیه هستیم (مثلاً با Enter)، فقط مرحله جلو می‌رود
    if (step < 3) {
      nextStep();
      return;
    }
    const order = placeOrder({
      receiver: {
        name: data.receiverName,
        phone: data.receiverPhone,
        email: data.email || ''
      },
      address: {
        province: data.province,
        city: data.city,
        fullAddress: data.address,
        postal: data.postal
      },
      shippingMethod: data.shippingMethod,
      shippingLabel: shippingMethods.find((m) => m.id === data.shippingMethod)?.name,
      paymentMethod: data.paymentMethod,
      paymentLabel: paymentMethods.find((m) => m.id === data.paymentMethod)?.name,
      total: summary.total,
      subtotal: summary.subtotal,
      discount: summary.discount,
      shipping: summary.shipping
    });
    setPlacedOrder(order);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="page-enter container-page py-8">
      <h1 className="mb-8 text-2xl font-extrabold text-slate-900 dark:text-white">تسویه حساب</h1>

      {/* نوار مراحل */}
      <ol className="mb-8 flex items-center gap-2" aria-label="مراحل خرید">
        {STEPS.map((s, i) => (
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
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />}
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3" noValidate>
        <div className="space-y-6 lg:col-span-2">
          {/* مرحله ۱: گیرنده */}
          {step === 1 && (
            <section className="card animate-fade-in space-y-5 p-6" aria-label="اطلاعات گیرنده">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">اطلاعات گیرنده</h2>
              <Field label="نام و نام خانوادگی" required id="receiverName" error={errors.receiverName?.message}>
                <input
                  id="receiverName"
                  className="input-base"
                  placeholder="مثلاً علی رضایی"
                  data-testid="receiver-name"
                  {...register('receiverName', { required: 'نام گیرنده الزامی است', minLength: { value: 3, message: 'نام باید حداقل ۳ حرف باشد' } })}
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
                    data-testid="receiver-phone"
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
                  <select id="province" className="input-base" data-testid="province" {...register('province', { required: 'استان را انتخاب کنید' })}>
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
                    data-testid="city"
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
                  data-testid="address"
                  {...register('address', { required: 'نشانی الزامی است', minLength: { value: 10, message: 'نشانی باید حداقل ۱۰ کاراکتر باشد' } })}
                />
              </Field>
              <Field label="کد پستی" required id="postal" error={errors.postal?.message}>
                <input
                  id="postal"
                  dir="ltr"
                  className="input-base text-left"
                  placeholder="10 رقم"
                  maxLength={10}
                  data-testid="postal"
                  {...register('postal', {
                    required: 'کد پستی الزامی است',
                    pattern: { value: rules.postal.pattern, message: rules.postal.message }
                  })}
                />
              </Field>

              <div>
                <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">روش ارسال</h3>
                <div className="space-y-3">
                  {shippingMethods.map((m) => (
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
                        {m.cost === 0 || (m.freeOver && summary.subtotal >= m.freeOver) ? 'رایگان' : faPrice(m.cost)}
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
                      watch('paymentMethod') === m.id
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
                با ثبت سفارش، قوانین و مقررات فروشگاه HDKALA را می‌پذیرید. اطلاعات پرداخت شما به‌صورت
                رمزنگاری‌شده منتقل می‌شود.
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
            {/* یک دکمه ثابت type="button" برای همه مراحل — فقط رفتارش عوض می‌شود */}
            <Button
              type="button"
              loading={isSubmitting}
              onClick={step < 3 ? nextStep : placeOrderNow}
              data-testid={step < 3 ? 'checkout-next' : 'place-order'}
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
            <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <dt>جمع کالاها</dt>
                <dd>{faPrice(summary.subtotal)}</dd>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <dt>تخفیف</dt>
                  <dd>{faPrice(summary.discount)}</dd>
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
      </form>
    </div>
  );
}

// ---------- صفحه تأیید سفارش ----------
function SuccessView({ order }) {
  return (
    <div className="container-page flex flex-col items-center gap-5 py-20 text-center">
      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
        <CheckIcon size={44} />
      </span>
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">سفارش شما با موفقیت ثبت شد 🎉</h1>
      <p className="max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
        سفارش شما با کد <span className="font-bold text-primary-600" dir="ltr">{order.id}</span> ثبت شد و در
        وضعیت «{order.status}» قرار گرفت. جزئیات سفارش به شماره{' '}
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
