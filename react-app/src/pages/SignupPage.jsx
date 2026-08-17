import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { rules } from '../utils/format';
import Field from '../components/Field';
import Button from '../components/Button';

// ---------- صفحه ثبت‌نام ----------
export default function SignupPage() {
  const navigate = useNavigate();
  const signup = useStore((s) => s.signup);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({ mode: 'onTouched' });

  const onSubmit = (data) => {
    const result = signup({
      name: data.name,
      phone: data.phone,
      email: data.email || '',
      password: data.password
    });
    if (!result.ok) {
      useStore.getState().toast(result.message, 'error');
      return;
    }
    navigate('/');
  };

  return (
    <div className="page-enter flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">ایجاد حساب کاربری</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            با ثبت‌نام در HDKALA از تخفیف‌ها و سفارش‌های سریع بهره‌مند شوید.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Field label="نام و نام خانوادگی" required id="name" error={errors.name?.message}>
            <input
              id="name"
              className="input-base"
              placeholder="مثلاً علی رضایی"
              data-testid="signup-name"
              {...register('name', {
                required: 'نام الزامی است',
                minLength: { value: 3, message: 'نام باید حداقل ۳ حرف باشد' }
              })}
            />
          </Field>
          <Field label="شماره موبایل" required id="phone" error={errors.phone?.message}>
            <input
              id="phone"
              type="tel"
              dir="ltr"
              maxLength={11}
              className="input-base text-left"
              placeholder="09xxxxxxxxx"
              data-testid="signup-phone"
              {...register('phone', {
                required: 'شماره موبایل الزامی است',
                pattern: { value: rules.phone.pattern, message: rules.phone.message }
              })}
            />
          </Field>
          <Field label="ایمیل" id="email" error={errors.email?.message} hint="اختیاری">
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
          <Field label="رمز عبور" required id="password" error={errors.password?.message} hint="حداقل ۶ کاراکتر">
            <input
              id="password"
              type="password"
              className="input-base"
              placeholder="••••••••"
              {...register('password', {
                required: 'رمز عبور الزامی است',
                minLength: { value: 6, message: 'رمز عبور حداقل ۶ کاراکتر است' }
              })}
            />
          </Field>
          <Field label="تکرار رمز عبور" required id="confirm" error={errors.confirm?.message}>
            <input
              id="confirm"
              type="password"
              className="input-base"
              placeholder="••••••••"
              {...register('confirm', {
                required: 'تکرار رمز عبور الزامی است',
                validate: (v) => v === watch('password') || 'رمز عبور و تکرار آن یکسان نیستند'
              })}
            />
          </Field>
          <Button type="submit" full size="lg" loading={isSubmitting} data-testid="signup-submit">
            ثبت‌نام
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link to="/login" className="font-bold text-primary-600 transition hover:text-primary-700 dark:text-primary-300">
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  );
}
