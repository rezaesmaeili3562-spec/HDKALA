import { Link } from 'react-router-dom';

// ---------- صفحه ۴۰۴ ----------
export default function NotFoundPage() {
  return (
    <div className="container-page flex flex-col items-center gap-5 py-24 text-center">
      <p className="bg-gradient-to-br from-primary-600 to-accent-400 bg-clip-text text-8xl font-extrabold text-transparent">
        ۴۰۴
      </p>
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">صفحه پیدا نشد!</h1>
      <p className="max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
        صفحه‌ای که دنبال آن هستید وجود ندارد یا جابه‌جا شده است. نگران نباشید، از اینجا می‌توانید
        به فروشگاه برگردید.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-700">
          صفحه اصلی
        </Link>
        <Link to="/products" className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:text-slate-200">
          مشاهده محصولات
        </Link>
      </div>
    </div>
  );
}
