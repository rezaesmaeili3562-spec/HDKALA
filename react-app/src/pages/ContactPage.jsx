import { useForm } from 'react-hook-form';
import { useStore } from '../store/useStore';
import { rules } from '../utils/format';
import Field from '../components/Field';
import Button from '../components/Button';
import { PhoneIcon, MailIcon, MapPinIcon, ClockIcon } from '../components/Icons';

const contactInfo = [
  { icon: PhoneIcon, title: 'تلفن پشتیبانی', value: '۰۲۱-۹۱۰۰۸۰۰۰', dir: 'ltr' },
  { icon: MailIcon, title: 'ایمیل', value: 'info@hdkala.ir', dir: 'ltr' },
  { icon: MapPinIcon, title: 'آدرس', value: 'تهران، خیابان ولیعصر، مرکز خرید HDKALA، طبقه سوم' },
  { icon: ClockIcon, title: 'ساعت پاسخگویی', value: 'همه‌روزه از ۹ صبح تا ۹ شب' }
];

// ---------- تماس با ما ----------
export default function ContactPage() {
  const toast = useStore((s) => s.toast);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({ mode: 'onTouched' });

  const onSubmit = () => {
    toast('پیام شما با موفقیت ارسال شد. به‌زودی با شما تماس می‌گیریم.');
    reset();
  };

  return (
    <div className="page-enter container-page py-10">
      <h1 className="mb-2 text-2xl font-extrabold text-slate-900 dark:text-white">تماس با ما</h1>
      <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
        سؤال یا پیشنهادی دارید؟ خوشحال می‌شویم از شما بشنویم.
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* اطلاعات تماس */}
        <div className="space-y-4">
          {contactInfo.map((c) => (
            <div key={c.title} className="card flex items-start gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600/10 text-primary-600 dark:text-primary-300">
                <c.icon size={20} />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400" dir={c.dir}>
                  {c.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 p-6 lg:col-span-2" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="نام و نام خانوادگی" required id="contact-name" error={errors.name?.message}>
              <input
                id="contact-name"
                className="input-base"
                data-testid="contact-name"
                {...register('name', { required: 'نام الزامی است' })}
              />
            </Field>
            <Field label="ایمیل" required id="contact-email" error={errors.email?.message}>
              <input
                id="contact-email"
                type="email"
                dir="ltr"
                className="input-base text-left"
                data-testid="contact-email"
                {...register('email', {
                  required: 'ایمیل الزامی است',
                  pattern: { value: rules.email.pattern, message: rules.email.message }
                })}
              />
            </Field>
          </div>
          <Field label="موضوع" required id="contact-subject" error={errors.subject?.message}>
            <input
              id="contact-subject"
              className="input-base"
              data-testid="contact-subject"
              {...register('subject', { required: 'موضوع الزامی است' })}
            />
          </Field>
          <Field label="پیام" required id="contact-message" error={errors.message?.message}>
            <textarea
              id="contact-message"
              rows={5}
              className="input-base resize-none"
              placeholder="متن پیام خود را بنویسید…"
              data-testid="contact-message"
              {...register('message', {
                required: 'متن پیام الزامی است',
                minLength: { value: 10, message: 'پیام باید حداقل ۱۰ کاراکتر باشد' }
              })}
            />
          </Field>
          <Button type="submit" size="lg" loading={isSubmitting}>ارسال پیام</Button>
        </form>
      </div>
    </div>
  );
}
