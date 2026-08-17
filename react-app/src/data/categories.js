// دسته‌بندی‌های فروشگاه — آیکون و توضیح هر دسته
export const categories = [
  {
    id: 'electronics',
    name: 'الکترونیک',
    icon: '📱',
    description: 'موبایل، لپ‌تاپ، هدفون و گجت‌های هوشمند',
    gradient: 'from-indigo-500/10 to-indigo-500/25'
  },
  {
    id: 'fashion',
    name: 'مد و پوشاک',
    icon: '👕',
    description: 'پوشاک، کیف، کفش و اکسسوری',
    gradient: 'from-rose-500/10 to-rose-500/25'
  },
  {
    id: 'home',
    name: 'خانه و آشپزخانه',
    icon: '🏠',
    description: 'لوازم خانه، آشپزخانه و دکوراسیون',
    gradient: 'from-amber-500/10 to-amber-500/25'
  },
  {
    id: 'books',
    name: 'کتاب و لوازم تحریر',
    icon: '📚',
    description: 'رمان، فلسفه، توسعه فردی و دانشگاهی',
    gradient: 'from-emerald-500/10 to-emerald-500/25'
  },
  {
    id: 'sports',
    name: 'ورزشی',
    icon: '⚽',
    description: 'تجهیزات ورزشی و تناسب اندام',
    gradient: 'from-sky-500/10 to-sky-500/25'
  }
];

export const getCategoryName = (id) =>
  categories.find((c) => c.id === id)?.name || id;

// وضعیت‌های محصول و برچسب فارسی آن‌ها
export const statusLabels = {
  new: { label: 'جدید', cls: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  hot: { label: 'فروش ویژه', cls: 'bg-rose-500/15 text-rose-600 dark:text-rose-400' },
  bestseller: { label: 'پرفروش', cls: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' }
};

// استان‌های ایران برای فرم آدرس
export const provinces = [
  'تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی', 'آذربایجان غربی',
  'البرز', 'خوزستان', 'گیلان', 'مازندران', 'کرمان', 'قم', 'قزوین', 'کردستان',
  'همدان', 'مرکزی', 'لرستان', 'هرمزگان', 'یزد', 'زنجان', 'سیستان و بلوچستان',
  'کرمانشاه', 'کهگیلویه و بویراحمد', 'بوشهر', 'اردبیل', 'ایلام', 'سمنان',
  'چهارمحال و بختیاری', 'خراسان شمالی', 'خراسان جنوبی', 'گلستان'
];

// روش‌های ارسال
export const shippingMethods = [
  { id: 'standard', name: 'پست پیشتاز', cost: 30000, freeOver: 500000, eta: '۲ تا ۴ روز کاری' },
  { id: 'express', name: 'پیک اکسپرس', cost: 60000, freeOver: 0, eta: 'ارسال در همان روز' }
];

// روش‌های پرداخت
export const paymentMethods = [
  { id: 'online', name: 'پرداخت آنلاین', icon: '💳', desc: 'پرداخت امن از طریق درگاه بانکی' },
  { id: 'cash', name: 'پرداخت در محل', icon: '💵', desc: 'پرداخت هنگام تحویل کالا' }
];
