import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ADMIN_DEMO } from '../../types';
import Field from '../../components/Field';
import Button from '../../components/Button';
import Toasts from '../../components/Toasts';
import { ShieldCheckIcon, SunIcon, MoonIcon } from '../../components/Icons';

interface LoginForm {
  username: string;
  password: string;
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = useStore((s) => s.admin);
  const loginAdmin = useStore((s) => s.loginAdmin);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({ mode: 'onTouched' });

  if (admin) {
    return <Navigate to="/admin" replace />;
  }

  const from = (location.state as { from?: string } | null)?.from || '/admin';

  const onSubmit = (data: LoginForm) => {
    setFormError('');
    const result = loginAdmin(data.username, data.password);
    if (!result.ok) {
      setFormError(result.message || 'ورود ناموفق بود');
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <div className="flex justify-end p-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
        >
          {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="card w-full max-w-md space-y-6 p-8">
          <div className="text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600/10 text-primary-600">
              <ShieldCheckIcon size={26} />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">ورود به پنل مدیریت</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              فقط مدیران فروشگاه به این بخش دسترسی دارند.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {formError && (
              <p role="alert" className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-500" data-testid="admin-login-error">
                {formError}
              </p>
            )}
            <Field label="نام کاربری" required id="admin-username" error={errors.username?.message}>
              <input
                id="admin-username"
                className="input-base"
                placeholder="admin"
                data-testid="admin-username"
                autoComplete="username"
                {...register('username', { required: 'نام کاربری الزامی است' })}
              />
            </Field>
            <Field label="رمز عبور" required id="admin-password" error={errors.password?.message}>
              <input
                id="admin-password"
                type="password"
                className="input-base"
                placeholder="••••••••"
                data-testid="admin-password"
                autoComplete="current-password"
                {...register('password', {
                  required: 'رمز عبور الزامی است',
                  minLength: { value: 6, message: 'رمز عبور حداقل ۶ کاراکتر است' }
                })}
              />
            </Field>
            <Button type="submit" full size="lg" loading={isSubmitting} data-testid="admin-login-submit">
              ورود به پنل
            </Button>
          </form>

          <div className="rounded-xl bg-primary-50 px-4 py-3 text-xs leading-6 text-primary-800 dark:bg-primary-950/40 dark:text-primary-200">
            حساب دمو: <span dir="ltr" className="font-bold">{ADMIN_DEMO.username}</span> /{' '}
            <span dir="ltr" className="font-bold">{ADMIN_DEMO.password}</span>
          </div>

          <p className="text-center text-sm text-slate-500">
            <Link to="/" className="font-bold text-primary-600 hover:text-primary-700 dark:text-primary-300">
              بازگشت به فروشگاه
            </Link>
          </p>
        </div>
      </div>
      <Toasts />
    </div>
  );
}
