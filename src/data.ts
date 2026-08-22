// ─────────────────────────────────────────────────────────────
//  داده‌های پایه فروشگاه — دسته‌بندی‌ها، کاتالوگ اولیه، فرم‌ها
// ─────────────────────────────────────────────────────────────
import type { Category, Coupon, Product, ProductBadge, StoreSettings } from './types';
import { DEFAULT_SETTINGS } from './types';

// ─────────── دسته‌بندی‌ها ───────────

export const categories: Category[] = [
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

export const getCategoryName = (id: string): string =>
  categories.find((c) => c.id === id)?.name || id;

// برچسب وضعیت محصول (جدید / فروش ویژه / پرفروش)
export interface BadgeInfo {
  label: string;
  cls: string;
}

export const badgeOf = (status: ProductBadge): BadgeInfo | null => {
  const map: Record<Exclude<ProductBadge, ''>, BadgeInfo> = {
    new: { label: 'جدید', cls: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
    hot: { label: 'فروش ویژه', cls: 'bg-rose-500/15 text-rose-600 dark:text-rose-400' },
    bestseller: { label: 'پرفروش', cls: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' }
  };
  return status ? map[status] : null;
};

// ─────────── فرم‌های تسویه حساب ───────────

// استان‌های ایران برای فرم آدرس
export const provinces: string[] = [
  'تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی', 'آذربایجان غربی',
  'البرز', 'خوزستان', 'گیلان', 'مازندران', 'کرمان', 'قم', 'قزوین', 'کردستان',
  'همدان', 'مرکزی', 'لرستان', 'هرمزگان', 'یزد', 'زنجان', 'سیستان و بلوچستان',
  'کرمانشاه', 'کهگیلویه و بویراحمد', 'بوشهر', 'اردبیل', 'ایلام', 'سمنان',
  'چهارمحال و بختیاری', 'خراسان شمالی', 'خراسان جنوبی', 'گلستان'
];

export interface ShippingMethod {
  id: string;
  name: string;
  cost: number;
  freeOver: number;
  eta: string;
}

export const shippingMethods: ShippingMethod[] = [
  { id: 'standard', name: 'پست پیشتاز', cost: 30000, freeOver: 500000, eta: '۲ تا ۴ روز کاری' },
  { id: 'express', name: 'پیک اکسپرس', cost: 60000, freeOver: 0, eta: 'ارسال در همان روز' }
];

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

export const paymentMethods: PaymentMethod[] = [
  { id: 'online', name: 'پرداخت آنلاین', icon: '💳', desc: 'پرداخت امن از طریق درگاه بانکی' },
  { id: 'cash', name: 'پرداخت در محل', icon: '💵', desc: 'پرداخت هنگام تحویل کالا' }
];

// ─────────── تنظیمات و کوپن‌های پیش‌فرض ───────────

export const defaultSettings: StoreSettings = { ...DEFAULT_SETTINGS };

export const defaultCoupons: Coupon[] = [
  {
    id: 'cpn-welcome',
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    active: true,
    minOrder: 0,
    usageCount: 0,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'cpn-save50',
    code: 'SAVE50K',
    type: 'fixed',
    value: 50000,
    active: true,
    minOrder: 200000,
    usageCount: 0,
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

// ─────────── کاتالوگ اولیه محصولات (۲۰ کالا) ───────────

export const seedProducts: Product[] = [
  {
    "id": "p01",
    "name": "هدفون بی‌سیم Sony WH-1000XM4",
    "category": "electronics",
    "price": 12900000,
    "discount": 15,
    "rating": 4.8,
    "ratingCount": 214,
    "stock": 50,
    "brand": "Sony",
    "status": "new",
    "image": "./images/p01-headphones.jpg",
    "views": 1520,
    "created": "2026-01-15",
    "desc": "هدفون بی‌سیم با نویزکنسلینگ پیشرفته و کیفیت صدای استثنایی. مناسب برای مسافرت، کار و گوش دادن طولانی‌مدت موسیقی بدون خستگی.",
    "features": [
      "نویزکنسلینگ هوشمند",
      "باتری ۳۰ ساعته",
      "شارژ سریع USB-C",
      "کنترل لمسی"
    ],
    "specs": {
      "نوع اتصال": "بلوتوث 5.0",
      "عمر باتری": "۳۰ ساعت",
      "وزن": "۲۵۴ گرم",
      "رابط شارژ": "USB-C"
    },
    "colors": [
      "مشکی",
      "نقره‌ای",
      "آبی"
    ]
  },
  {
    "id": "p02",
    "name": "گوشی هوشمند Galaxy S24 Ultra",
    "category": "electronics",
    "price": 45900000,
    "discount": 8,
    "rating": 4.7,
    "ratingCount": 320,
    "stock": 12,
    "brand": "Samsung",
    "status": "hot",
    "image": "./images/p02-phone.jpg",
    "views": 2810,
    "created": "2026-02-02",
    "desc": "پرچم‌دار قدرتمند با دوربین ۲۰۰ مگاپیکسلی، پردازنده فوق سریع و نمایشگر ۱۲۰ هرتزی. انتخابی بی‌رقیب برای عکاسی حرفه‌ای و گیمینگ.",
    "features": [
      "دوربین ۲۰۰ مگاپیکسل",
      "نمایشگر 120Hz",
      "پردازنده Snapdragon 8 Gen 3",
      "شارژ سریع 45W"
    ],
    "specs": {
      "نمایشگر": "6.8 اینچ AMOLED",
      "رم": "12 گیگابایت",
      "حافظه": "256 گیگابایت",
      "باتری": "5000 میلی‌آمپر"
    },
    "colors": [
      "مشکی",
      "بنفش",
      "سبز"
    ]
  },
  {
    "id": "p03",
    "name": "لپ‌تاپ Apple MacBook Pro 14",
    "category": "electronics",
    "price": 89000000,
    "discount": 10,
    "rating": 4.9,
    "ratingCount": 98,
    "stock": 5,
    "brand": "Apple",
    "status": "bestseller",
    "image": "./images/p03-laptop.jpg",
    "views": 980,
    "created": "2026-01-20",
    "desc": "لپ‌تاپ حرفه‌ای با تراشه M2 Pro، نمایشگر Liquid Retina XDR و باتری تمام‌روزه. مناسب طراحان، برنامه‌نویسان و تولیدکنندگان محتوا.",
    "features": [
      "تراشه M2 Pro",
      "نمایشگر XDR",
      "باتری ۱۸ ساعته",
      "رم ۱۸ گیگابایت"
    ],
    "specs": {
      "پردازنده": "Apple M2 Pro",
      "رم": "18 گیگابایت",
      "ذخیره‌سازی": "1 ترابایت SSD",
      "نمایشگر": "14.2 اینچ"
    },
    "colors": [
      "نقره‌ای",
      "خاکستری"
    ]
  },
  {
    "id": "p04",
    "name": "تبلت iPad Air 11",
    "category": "electronics",
    "price": 34500000,
    "discount": 0,
    "rating": 4.6,
    "ratingCount": 76,
    "stock": 8,
    "brand": "Apple",
    "status": "",
    "image": "./images/p04-tablet.jpg",
    "views": 640,
    "created": "2026-03-05",
    "desc": "تبلت سبک و قدرتمند با نمایشگر Liquid Retina و تراشه M2. برای طراحی، مطالعه و سرگرمی روزمره عالی است.",
    "features": [
      "تراشه M2",
      "نمایشگر 11 اینچی",
      "پشتیبانی از Apple Pencil",
      "باتری ۱۰ ساعته"
    ],
    "specs": {
      "نمایشگر": "11 اینچ Liquid Retina",
      "حافظه": "128 گیگابایت",
      "وزن": "462 گرم",
      "سیستم‌عامل": "iPadOS 17"
    },
    "colors": [
      "آبی",
      "بنفش",
      "سفید"
    ]
  },
  {
    "id": "p05",
    "name": "دوربین بدون آینه Sony FX30",
    "category": "electronics",
    "price": 41800000,
    "discount": 8,
    "rating": 4.5,
    "ratingCount": 44,
    "stock": 6,
    "brand": "Sony",
    "status": "",
    "image": "./images/p05-camera.jpg",
    "views": 410,
    "created": "2026-02-18",
    "desc": "دوربین سینمایی بدون آینه با سنسور Super 35 و فیلم‌برداری 4K با نرخ ۱۲۰ فریم. انتخابی حرفه‌ای برای فیلمسازان.",
    "features": [
      "فیلم‌برداری 4K/120fps",
      "سنسور Super 35",
      "فوکوس خودکار سریع",
      "بدنه سبک"
    ],
    "specs": {
      "سنسور": "Super 35 CMOS",
      "رزولوشن": "4K / 120fps",
      "وزن": "646 گرم",
      "مانت": "Sony E"
    },
    "colors": [
      "مشکی"
    ]
  },
  {
    "id": "p06",
    "name": "کنسول بازی PlayStation 5",
    "category": "electronics",
    "price": 32400000,
    "discount": 12,
    "rating": 4.9,
    "ratingCount": 512,
    "stock": 15,
    "brand": "Sony",
    "status": "hot",
    "image": "./images/p06-console.jpg",
    "views": 4300,
    "created": "2026-01-10",
    "desc": "نسل جدید سرگرمی با گرافیک 4K، SSD فوق سریع و دسته DualSense با بازخورد لمسی. تجربه گیمینگ را دگرگون می‌کند.",
    "features": [
      "گرافیک 4K",
      "SSD فوق سریع",
      "دسته DualSense",
      "پشتیبانی از 8K"
    ],
    "specs": {
      "حافظه": "1 ترابایت SSD",
      "پردازنده": "AMD Zen 2",
      "خروجی": "4K/120Hz",
      "درایو": "Blu-ray"
    },
    "colors": [
      "سفید"
    ]
  },
  {
    "id": "p07",
    "name": "اسپیکر بلوتوثی JBL Flip 6",
    "category": "electronics",
    "price": 6700000,
    "discount": 15,
    "rating": 4.7,
    "ratingCount": 250,
    "stock": 35,
    "brand": "JBL",
    "status": "",
    "image": "./images/p07-speaker.jpg",
    "views": 890,
    "created": "2026-03-12",
    "desc": "اسپیکر قابل حمل با صدای قدرتمند و بیس عمیق. ضدآب با استاندارد IP67 و باتری ۱۲ ساعته برای هر ماجراجویی.",
    "features": [
      "ضدآب IP67",
      "باتری ۱۲ ساعته",
      "باس عمیق",
      "اتصال هم‌زمان دو اسپیکر"
    ],
    "specs": {
      "توان خروجی": "30 وات",
      "عمر باتری": "12 ساعت",
      "وزن": "550 گرم",
      "ضدآب": "IP67"
    },
    "colors": [
      "مشکی",
      "آبی",
      "قرمز"
    ]
  },
  {
    "id": "p08",
    "name": "ساعت هوشمند Galaxy Watch 6",
    "category": "electronics",
    "price": 9800000,
    "discount": 20,
    "rating": 4.4,
    "ratingCount": 160,
    "stock": 25,
    "brand": "Samsung",
    "status": "bestseller",
    "image": "./images/p08-smartwatch.jpg",
    "views": 720,
    "created": "2026-02-25",
    "desc": "ساعت هوشمند با پایش سلامت کامل: ضربان قلب، خواب، اکسیژن خون و بیش از ۹۰ حالت ورزشی. همراه همیشگی سبک زندگی سالم.",
    "features": [
      "پایش ضربان قلب",
      "ردیابی خواب",
      "GPS داخلی",
      "باتری ۴۰ ساعته"
    ],
    "specs": {
      "نمایشگر": "1.4 اینچ AMOLED",
      "عمر باتری": "40 ساعت",
      "وزن": "33 گرم",
      "ضدآب": "5ATM"
    },
    "colors": [
      "مشکی",
      "نقره‌ای"
    ]
  },
  {
    "id": "p09",
    "name": "کفش ورزشی Nike Pegasus 42",
    "category": "sports",
    "price": 5400000,
    "discount": 25,
    "rating": 4.6,
    "ratingCount": 260,
    "stock": 30,
    "brand": "Nike",
    "status": "hot",
    "image": "./images/p09-sneakers.jpg",
    "views": 1100,
    "created": "2026-01-28",
    "desc": "کفش دویدن با فوم واکنش‌گرا و رویه تنفس‌پذیر. راحتی و عملکرد بی‌نظیر برای دویدن‌های روزانه و تمرینات ورزشی.",
    "features": [
      "فوم ReactX",
      "رویه تنفس‌پذیر",
      "کفی ارگونومیک",
      "وزن سبک"
    ],
    "specs": {
      "جنس رویه": "مش مهندسی‌شده",
      "سایز": "39 تا 45",
      "کاربرد": "دویدن و روزمره",
      "کفی": "فوم واکنش‌گرا"
    },
    "colors": [
      "سفید",
      "نارنجی",
      "مشکی"
    ]
  },
  {
    "id": "p10",
    "name": "ساعت مچی مردانه کاسیو جی‌شاک",
    "category": "fashion",
    "price": 5200000,
    "discount": 0,
    "rating": 4.7,
    "ratingCount": 89,
    "stock": 20,
    "brand": "Casio",
    "status": "",
    "image": "./images/p10-watch.jpg",
    "views": 540,
    "created": "2026-03-01",
    "desc": "ساعت مقاوم و ضدضربه با طراحی کلاسیک جی‌شاک. مناسب استفاده روزمره و ورزش‌های ماجراجویانه.",
    "features": [
      "ضدضربه",
      "ضدآب ۲۰۰ متر",
      "کرنومتر",
      "نور پس‌زمینه"
    ],
    "specs": {
      "جنس بدنه": "رزین مقاوم",
      "ضدآب": "200 متر",
      "عمر باتری": "5 سال",
      "قطر": "45 میلی‌متر"
    },
    "colors": [
      "مشکی",
      "نارنجی"
    ]
  },
  {
    "id": "p11",
    "name": "تی‌شرت نخی ساده مردانه",
    "category": "fashion",
    "price": 450000,
    "discount": 30,
    "rating": 4.2,
    "ratingCount": 400,
    "stock": 100,
    "brand": "H&M",
    "status": "",
    "image": "./images/p11-tshirt.jpg",
    "views": 2100,
    "created": "2026-04-02",
    "desc": "تی‌شرت نخی با کیفیت بالا و دوخت تمیز. نرم، سبک و مناسب استفاده روزمره در تمام فصول.",
    "features": [
      "۱۰۰٪ پنبه",
      "دوخت مقاوم",
      "قابل شست‌وشو در ماشین",
      "رنگ ثابت"
    ],
    "specs": {
      "جنس": "100٪ پنبه",
      "سایز": "S تا XXL",
      "مناسب": "مردانه",
      "ساخت": "ترکیه"
    },
    "colors": [
      "سفید",
      "مشکی",
      "طوسی"
    ]
  },
  {
    "id": "p12",
    "name": "کوله‌پشتی چرم طبیعی",
    "category": "fashion",
    "price": 2800000,
    "discount": 15,
    "rating": 4.3,
    "ratingCount": 55,
    "stock": 40,
    "brand": "Steel Horse",
    "status": "",
    "image": "./images/p12-backpack.jpg",
    "views": 380,
    "created": "2026-02-10",
    "desc": "کوله‌پشتی دست‌دوز از چرم طبیعی با طراحی وینتیج. جادار، مقاوم و شیک برای استفاده روزمره و سفر.",
    "features": [
      "چرم طبیعی",
      "دست‌دوز",
      "بندهای قابل تنظیم",
      "جیب لپ‌تاپ ۱۵ اینچ"
    ],
    "specs": {
      "جنس": "چرم طبیعی",
      "حجم": "20 لیتر",
      "وزن": "900 گرم",
      "مناسب": "لپ‌تاپ تا 15 اینچ"
    },
    "colors": [
      "قهوه‌ای",
      "مشکی"
    ]
  },
  {
    "id": "p13",
    "name": "مبل راحتی سه‌نفره مدرن",
    "category": "home",
    "price": 35000000,
    "discount": 10,
    "rating": 4.5,
    "ratingCount": 30,
    "stock": 3,
    "brand": "HDK Home",
    "status": "",
    "image": "./images/p13-sofa.jpg",
    "views": 260,
    "created": "2026-01-05",
    "desc": "مبل راحتی با پارچه مخمل و فوم سرد باکیفیت. طراحی مدرن و مینیمال برای پذیرایی‌های امروزی.",
    "features": [
      "پارچه مخمل",
      "فوم سرد ۳۰ کیلوگرم",
      "کلاف چوب راش",
      "پایه فلزی"
    ],
    "specs": {
      "ابعاد": "220 × 90 × 85 سانتی‌متر",
      "جنس پارچه": "مخمل",
      "تعداد نفرات": "3 نفره",
      "رنگ": "طوسی روشن"
    },
    "colors": [
      "طوسی",
      "سبز",
      "بژ"
    ]
  },
  {
    "id": "p14",
    "name": "سرخ‌کن بدون روغن فیلیپس ۶ لیتری",
    "category": "home",
    "price": 8900000,
    "discount": 18,
    "rating": 4.8,
    "ratingCount": 210,
    "stock": 18,
    "brand": "Philips",
    "status": "bestseller",
    "image": "./images/p14-airfryer.jpg",
    "views": 1500,
    "created": "2026-02-15",
    "desc": "سرخ‌کن بدون روغن با فناوری Rapid Air؛ غذای ترد و خوشمزه با ۹۰٪ روغن کمتر. سالم‌ترین راه سرخ‌کردن برای خانواده.",
    "features": [
      "۹۰٪ روغن کمتر",
      "فناوری Rapid Air",
      "صفحه لمسی دیجیتال",
      "قابلیت شست‌وشو در ظرفشویی"
    ],
    "specs": {
      "ظرفیت": "6 لیتر",
      "توان": "2000 وات",
      "محدوده دما": "80 تا 200 درجه",
      "گارانتی": "24 ماه"
    },
    "colors": [
      "مشکی",
      "سفید"
    ]
  },
  {
    "id": "p15",
    "name": "جارو رباتی شیائومی با نقشه هوشمند",
    "category": "home",
    "price": 11500000,
    "discount": 22,
    "rating": 4.7,
    "ratingCount": 340,
    "stock": 10,
    "brand": "Xiaomi",
    "status": "hot",
    "image": "./images/p15-vacuum.jpg",
    "views": 1900,
    "created": "2026-03-20",
    "desc": "جارو رباتی با ناوبری لیزری و نقشه‌برداری هوشمند خانه. مکش قدرتمند ۲۲۰۰ پاسکال و کنترل با اپلیکیشن.",
    "features": [
      "ناوبری لیزری LDS",
      "مکش 2200 پاسکال",
      "کنترل با اپ",
      "باتری ۱۲۰ دقیقه"
    ],
    "specs": {
      "مکش": "2200 پاسکال",
      "عمر باتری": "120 دقیقه",
      "ظرفیت مخزن": "500 میلی‌لیتر",
      "سازگار": "Alexa و Google Home"
    },
    "colors": [
      "سفید",
      "مشکی"
    ]
  },
  {
    "id": "p16",
    "name": "سرویس قابلمه گرانیتی ۷ پارچه",
    "category": "home",
    "price": 6400000,
    "discount": 0,
    "rating": 4.4,
    "ratingCount": 62,
    "stock": 22,
    "brand": "HDK Kitchen",
    "status": "",
    "image": "./images/p16-cookware.jpg",
    "views": 470,
    "created": "2026-04-08",
    "desc": "سرویس کامل قابلمه و تابه با پوشش گرانیتی نچسب و دستگیره‌های مقاوم. مناسب همه اجاق‌ها از جمله القایی.",
    "features": [
      "پوشش گرانیتی",
      "نچسب واقعی",
      "مناسب اجاق القایی",
      "دستگیره ضدحرارت"
    ],
    "specs": {
      "تعداد قطعات": "7 پارچه",
      "پوشش": "گرانیتی",
      "سازگاری": "همه اجاق‌ها",
      "گارانتی": "18 ماه"
    },
    "colors": [
      "آبی",
      "مشکی",
      "طلایی"
    ]
  },
  {
    "id": "p17",
    "name": "کتاب هفت عادت مردمان مؤثر",
    "category": "books",
    "price": 285000,
    "discount": 20,
    "rating": 4.5,
    "ratingCount": 180,
    "stock": 100,
    "brand": "نشر پیکان",
    "status": "",
    "image": "./images/p17-book1.jpg",
    "views": 600,
    "created": "2026-01-08",
    "desc": "کتاب پرفروش استفان کاوی درباره هفت عادتی که زندگی شخصی و حرفه‌ای شما را متحول می‌کند.",
    "features": [
      "جلد گالینگور",
      "ترجمه روان",
      "چاپ با کیفیت",
      "پرفروش جهانی"
    ],
    "specs": {
      "نویسنده": "استفان کاوی",
      "مترجم": "محمد‌رضا آل یاسین",
      "تعداد صفحات": "400",
      "سال چاپ": "1404"
    },
    "colors": []
  },
  {
    "id": "p18",
    "name": "رمان مغازه خودکشی",
    "category": "books",
    "price": 165000,
    "discount": 10,
    "rating": 4.3,
    "ratingCount": 92,
    "stock": 60,
    "brand": "نشر چشمه",
    "status": "",
    "image": "./images/p18-book2.jpg",
    "views": 340,
    "created": "2026-02-22",
    "desc": "رمان طنزآمیز و تکان‌دهنده ژان تولی درباره خانواده‌ای که در دنیایی غم‌زده، مغازه‌ای عجیب دارند. طنز سیاهی که به زندگی معنا می‌دهد.",
    "features": [
      "جلد شومیز",
      "ترجمه ستایش",
      "نامزد جایزه",
      "داستان کوتاه خواندنی"
    ],
    "specs": {
      "نویسنده": "ژان تولی",
      "مترجم": "احسان کرم‌ویسی",
      "تعداد صفحات": "240",
      "ژانر": "طنز سیاه"
    },
    "colors": []
  },
  {
    "id": "p19",
    "name": "کتاب تاریخ فلسفه",
    "category": "books",
    "price": 420000,
    "discount": 0,
    "rating": 4.6,
    "ratingCount": 40,
    "stock": 25,
    "brand": "نشر نی",
    "status": "",
    "image": "./images/p19-book3.jpg",
    "views": 220,
    "created": "2026-03-15",
    "desc": "روایتی جامع و خواندنی از سیر اندیشه فلسفی از یونان باستان تا فیلسوفان معاصر. برای علاقه‌مندان به تفکر.",
    "features": [
      "جلد سخت",
      "روایت جامع",
      "مناسب مطالعه عمیق",
      "ارجاعات کامل"
    ],
    "specs": {
      "نویسنده": "ویل دورانت",
      "تعداد صفحات": "560",
      "ژانر": "فلسفه",
      "سال چاپ": "1403"
    },
    "colors": []
  },
  {
    "id": "p20",
    "name": "دمبل چدنی ۱۰ کیلویی جفت",
    "category": "sports",
    "price": 1950000,
    "discount": 15,
    "rating": 4.4,
    "ratingCount": 75,
    "stock": 40,
    "brand": "HDK Sport",
    "status": "",
    "image": "./images/p20-dumbbells.jpg",
    "views": 310,
    "created": "2026-04-01",
    "desc": "دمبل چدنی شش‌ضلعی با روکش ضدلغزش. مناسب تمرینات قدرتی در خانه و باشگاه.",
    "features": [
      "چدن یکپارچه",
      "روکش ضدلغزش",
      "شکل شش‌ضلعی ضدغلتش",
      "مناسب خانه و باشگاه"
    ],
    "specs": {
      "وزن هر دمبل": "10 کیلوگرم",
      "جنس": "چدن",
      "روکش": "پلاستیک ضدضربه",
      "تعداد": "2 عدد"
    },
    "colors": [
      "خاکستری"
    ]
  }
];
