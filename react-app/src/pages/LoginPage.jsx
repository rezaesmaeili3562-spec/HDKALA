import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { rules } from '../utils/format';
import Field from '../components/Field';
import Button from '../components/Button';
import { UserIcon } from '../components/Icons';

// ---------- صفحه ورود ----------
export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useStore((s) => s.login);
  const loginDemo = useStore((s) => s.loginDemo);
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ mode: 'onTouched' });

  const next = searchParams.get('next');

  const onSubmit = (data) => {
    setFormError('');
    const result = login(data.phone, data.password);
    if (!result.ok) {
      setFormError(result.message);
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
              data-testid="login-phone"
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
              data-testid="login-password"
              {...register('password', {
                required: 'رمز عبور الزامی است',
                minLength: { value: 6, message: 'رمز عبور حداقل ۶ کاراکتر است' }
              })}
            />
          </Field>
          <Button type="submit" full size="lg" loading={isSubmitting} data-testid="login-submit">
            ورود
          </Button>
        </form>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          یا
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <Button type="button" variant="outline" full onClick={demoLogin} data-testid="demo-login">
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
