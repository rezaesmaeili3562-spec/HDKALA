import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { toFa } from '../utils/format';
import { PhoneIcon, MailIcon, MapPinIcon, TruckIcon, ShieldIcon, CreditCardIcon, HeadsetIcon } from './Icons';

const benefits = [
  { icon: TruckIcon, title: 'ارسال سریع', desc: 'به سراسر کشور' },
  { icon: ShieldIcon, title: 'ضمانت اصالت', desc: 'تضمین کالای اصل' },
  { icon: CreditCardIcon, title: 'پرداخت امن', desc: 'درگاه معتبر بانکی' },
  { icon: HeadsetIcon, title: 'پشتیبانی ۲۴/۷', desc: 'پاسخگویی همیشگی' }
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      {/* مزایا */}
      <div className="container-page grid grid-cols-2 gap-4 border-b border-slate-100 py-8 lg:grid-cols-4 dark:border-slate-800/60">
        {benefits.map((b) => (
          <div key={b.title} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600/10 text-primary-600 dark:text-primary-300">
              <b.icon size={22} />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{b.title}</p>
              <p className="text-xs text-slate-400">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ستون‌های فوتر */}
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-400 text-sm font-extrabold text-white">
              HD
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">HDKALA</span>
          </div>
          <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
            فروشگاه اینترنتی HDKALA؛ مقصد مطمئن خرید آنلاین با هزاران کالای متنوع، ضمانت اصالت
            و ارسال سریع به سراسر ایران.
          </p>
          <div className="flex gap-2">
            <span className="rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:border-slate-700 dark:text-slate-400">نماد اعتماد</span>
            <span className="rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:border-slate-700 dark:text-slate-400">ساماندهی</span>
            <span className="rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:border-slate-700 dark:text-slate-400">ضمانت بازگشت ۷ روزه</span>
          </div>
        </div>

        <nav aria-label="دسترسی سریع">
          <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">دسترسی سریع</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="text-slate-500 transition hover:text-primary-600 dark:text-slate-400">خانه</Link></li>
            <li><Link to="/products" className="text-slate-500 transition hover:text-primary-600 dark:text-slate-400">همه محصولات</Link></li>
            <li><Link to="/cart" className="text-slate-500 transition hover:text-primary-600 dark:text-slate-400">سبد خرید</Link></li>
            <li><Link to="/wishlist" className="text-slate-500 transition hover:text-primary-600 dark:text-slate-400">علاقه‌مندی‌ها</Link></li>
            <li><Link to="/about" className="text-slate-500 transition hover:text-primary-600 dark:text-slate-400">درباره ما</Link></li>
            <li><Link to="/contact" className="text-slate-500 transition hover:text-primary-600 dark:text-slate-400">تماس با ما</Link></li>
          </ul>
        </nav>

        <nav aria-label="دسته‌بندی‌ها">
          <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">دسته‌بندی‌ها</h3>
          <ul className="space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/products?category=${c.id}`} className="text-slate-500 transition hover:text-primary-600 dark:text-slate-400">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">ارتباط با ما</h3>
          <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <PhoneIcon size={16} className="text-primary-500" />
              <span dir="ltr">۰۲۱-۹۱۰۰۸۰۰۰</span>
            </li>
            <li className="flex items-center gap-2">
              <MailIcon size={16} className="text-primary-500" />
              info@hdkala.ir
            </li>
            <li className="flex items-start gap-2">
              <MapPinIcon size={16} className="mt-0.5 shrink-0 text-primary-500" />
              تهران، خیابان ولیعصر، مرکز خرید HDKALA، طبقه سوم
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 py-5 dark:border-slate-800/60">
        <p className="container-page text-center text-xs text-slate-400">
          © {toFa(1404)} فروشگاه اینترنتی HDKALA — تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
