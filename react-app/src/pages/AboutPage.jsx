import { Link } from 'react-router-dom';
import { toFa } from '../utils/format';
import { TruckIcon, ShieldIcon, HeadsetIcon, CheckIcon } from '../components/Icons';

const values = [
  { icon: ShieldIcon, title: 'اعتماد', desc: 'ضمانت اصالت تمام کالاها و همکاری فقط با برندها و تأمین‌کنندگان معتبر.' },
  { icon: TruckIcon, title: 'سرعت', desc: 'ارسال سفارش‌ها در سریع‌ترین زمان ممکن به سراسر کشور با بسته‌بندی ایمن.' },
  { icon: HeadsetIcon, title: 'پشتیبانی', desc: 'تیم پشتیبانی ما هفت روز هفته آماده پاسخگویی و حل مشکلات شماست.' },
  { icon: CheckIcon, title: 'شفافیت', desc: 'قیمت‌گذاری منصفانه و اطلاع‌رسانی دقیق از وضعیت هر سفارش.' }
];

const stats = [
  { value: '۵ سال', label: 'تجربه فروش آنلاین' },
  { value: '+۱٬۰۰۰', label: 'کالای متنوع' },
  { value: '+۵۰٬۰۰۰', label: 'مشتری راضی' },
  { value: '۳۱', label: 'استان تحت پوشش' }
];

// ---------- درباره ما ----------
export default function AboutPage() {
  return (
    <div className="page-enter">
      {/* هیرو */}
      <section className="bg-gradient-to-l from-primary-700 via-primary-600 to-primary-800 py-16 text-white">
        <div className="container-page">
          <h1 className="text-3xl font-extrabold">درباره HDKALA</h1>
          <p className="mt-4 max-w-2xl leading-8 text-indigo-100">
            HDKALA یک فروشگاه اینترنتی ایرانی است که با هدف ساده‌کردن خرید آنلاین متولد شد؛
            جایی که کیفیت، اعتماد و سرعت در اولویت قرار دارد.
          </p>
        </div>
      </section>

      {/* آمار */}
      <section className="container-page -mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="آمار فروشگاه">
        {stats.map((s) => (
          <div key={s.label} className="card p-6 text-center">
            <p className="text-2xl font-extrabold text-primary-600 dark:text-primary-300">{s.value}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ارزش‌ها */}
      <section className="container-page py-14">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-900 dark:text-white">
          ارزش‌های ما
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="card p-6">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600/10 text-primary-600 dark:text-primary-300">
                <v.icon size={24} />
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{v.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* داستان */}
      <section className="container-page pb-14">
        <div className="card p-8 leading-8 text-slate-600 dark:text-slate-300">
          <h2 className="mb-4 text-xl font-extrabold text-slate-900 dark:text-white">داستان ما</h2>
          <p>
            HDKALA فعالیت خود را در سال {toFa(1399)} با یک تیم کوچک و یک هدف بزرگ آغاز کرد: حذف
            واسطه‌های غیرضروری و رساندن بهترین کالاها با قیمت منصفانه به دست مردم. امروز با
            همکاری ده‌ها برند معتبر داخلی و بین‌المللی، هزاران کالا را در دسته‌بندی‌های
            الکترونیک، مد و پوشاک، خانه و آشپزخانه، کتاب و ورزشی عرضه می‌کنیم.
          </p>
          <p className="mt-4">
            ما به این باور رسیده‌ایم که خرید آنلاین فقط «کلیک و پرداخت» نیست؛ یک تجربه کامل است
            که باید سریع، شفاف و لذت‌بخش باشد. به همین دلیل روی هر مرحله از مسیر خرید — از
            جستجو تا تحویل — تمرکز کرده‌ایم.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/products" className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-700">
              شروع خرید
            </Link>
            <Link to="/contact" className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:text-slate-200">
              تماس با ما
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
