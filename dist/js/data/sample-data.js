export const SAMPLE_PRODUCTS = [
  {
    id: 'p1',
    name: 'هدفون بی‌سیم Sony WH-1000XM4',
    price: 990000,
    desc: 'هدفون بی‌سیم با نویزکنسلینگ پیشرفته و کیفیت صدای استثنایی. مناسب برای مسافرت و محیط‌های پرسر و صدا.',
    img: '',
    rating: 5,
    discount: 15,
    category: 'electronics',
    status: 'new',
    stock: 50,
    brand: 'Sony',
    features: ['نویزکنسلینگ', 'باتری 30 ساعته', 'شارژ سریع', 'کنترل لمسی'],
    colors: ['مشکی', 'نقره‌ای', 'آبی'],
    specifications: {
      نوع: 'بی‌سیم',
      باتری: '30 ساعت',
      وزن: '254 گرم',
      اتصال: 'بلوتوث 5.0'
    }
  },
  {
    id: 'p2',
    name: 'گوشی هوشمند Samsung Galaxy S23',
    price: 25000000,
    desc: 'گوشی هوشمند قدرتمند با دوربین 200 مگاپیکسلی و پردازنده اسنپدراگون 8 نسل 2. مناسب برای بازی و عکاسی حرفه‌ای.',
    img: '',
    rating: 5,
    discount: 0,
    category: 'electronics',
    status: 'hot',
    stock: 12,
    brand: 'Samsung',
    features: ['دوربین 200MP', 'پردازنده اسنپدراگون', 'نمایشگر 120Hz', 'شارژ سریع 45W'],
    colors: ['مشکی', 'سبز', 'بنفش'],
    specifications: {
      نمایشگر: '6.8 اینچ',
      رم: '12GB',
      حافظه: '256GB',
      باتری: '5000 mAh'
    }
  },
  {
    id: 'p3',
    name: 'لپ‌تاپ Apple MacBook Pro 14',
    price: 85000000,
    desc: 'لپ‌تاپ حرفه‌ای با تراشه M2 Pro، نمایشگر Liquid Retina XDR و باتری تمام‌روزه. مناسب برای طراحان و برنامه‌نویسان.',
    img: '',
    rating: 5,
    discount: 10,
    category: 'electronics',
    status: 'bestseller',
    stock: 5,
    brand: 'Apple',
    features: ['تراشه M2 Pro', 'نمایشگر XDR', 'باتری 18 ساعته', '18GB رم'],
    colors: ['نقره‌ای', 'Space Gray'],
    specifications: {
      پردازنده: 'Apple M2 Pro',
      رم: '18GB',
      ذخیره‌سازی: '1TB SSD',
      نمایشگر: '14.2 اینچ'
    }
  },
  {
    id: 'p4',
    name: 'کتاب هفت عادت مردمان موثر',
    price: 85000,
    desc: 'کتاب پرفروش استفان کاوی درباره هفت عادتی که زندگی شما را متحول خواهد کرد.',
    img: '',
    rating: 4,
    discount: 20,
    category: 'books',
    status: '',
    stock: 100,
    brand: 'نشر پیکان',
    features: ['جلد گالینگور', 'ترجمه روان', 'کیفیت چاپ بالا'],
    colors: [],
    specifications: {
      نویسنده: 'استفان کاوی',
      مترجم: 'محمد رضا آل یاسین',
      'تعداد صفحات': '400',
      ناشر: 'پیکان'
    }
  },
  {
    id: 'p5',
    name: 'کفش ورزشی Nike Air Max',
    price: 4500000,
    desc: 'کفش ورزشی با تکنولوژی Air Max برای راحتی و عملکرد بهتر در ورزش.',
    img: '',
    rating: 4,
    discount: 25,
    category: 'sports',
    status: 'hot',
    stock: 30,
    brand: 'Nike',
    features: ['تکنولوژی Air Max', 'کفی اورتوپدی', 'مناسب دویدن', 'تنفس پذیری بالا'],
    colors: ['سفید', 'مشکی', 'قرمز'],
    specifications: {
      جنس: 'مش و چرم',
      سایز: '39-45',
      کاربرد: 'ورزشی و روزمره',
      کف: 'لاستیک با دوام'
    }
  },
  {
    id: 'p6',
    name: 'مبل راحتی 3 نفره',
    price: 35000000,
    desc: 'مبل راحتی با پارچه مخمل و قابلیت تنظیم پشتی. مناسب برای اتاق پذیرایی.',
    img: '',
    rating: 4,
    discount: 15,
    category: 'home',
    status: '',
    stock: 8,
    brand: 'مبل ایران',
    features: ['پارچه مخمل', 'قابلیت تنظیم پشتی', 'پر کوسن‌ها', 'قاب فلزی'],
    colors: ['مشکی', 'خاکستری', 'آبی'],
    specifications: {
      ابعاد: '200x90x80 سانتی‌متر',
      'جنس پارچه': 'مخمل',
      قاب: 'فلز',
      ظرفیت: '3 نفر'
    }
  },
  {
    id: 'p7',
    name: 'دستگاه قهوه ساز Delonghi',
    price: 12500000,
    desc: 'دستگاه قهوه ساز تمام اتوماتیک با قابلیت تهیه انواع قهوه اسپرسو، کاپوچینو و لاته.',
    img: '',
    rating: 5,
    discount: 30,
    category: 'home',
    status: 'new',
    stock: 15,
    brand: 'Delonghi',
    features: ['تمام اتوماتیک', 'ساخت کاپوچینو', 'پمپ 15 بار', 'سیستم گرمایش سریع'],
    colors: ['مشکی', 'نقره‌ای'],
    specifications: {
      نوع: 'اسپرسو ساز',
      'ظرفیت آب': '1.8 لیتر',
      قدرت: '1450 وات',
      ابعاد: '24x34x43 سانتی‌متر'
    }
  },
  {
    id: 'p8',
    name: 'کاپشن زمستانی مردانه',
    price: 2800000,
    desc: 'کاپشن زمستانی با پر طبیعی، مناسب برای هوای سرد. طراحی شیک و مدرن.',
    img: '',
    rating: 4,
    discount: 40,
    category: 'fashion',
    status: 'hot',
    stock: 25,
    brand: 'Zara',
    features: ['پر طبیعی', 'ضد آب', 'جیب‌های متعدد', 'کاپوت جدا شونده'],
    colors: ['مشکی', 'خاکستری', 'آبی دریایی'],
    specifications: {
      جنس: 'نایلون و پر',
      سایز: 'S-XXL',
      کاربرد: 'زمستانی',
      شستشو: 'خشک شویی'
    }
  }
];

export const SAMPLE_BLOGS = [
  {
    id: 'b1',
    title: '۱۰ نکته برای خرید هوشمندانه آنلاین',
    excerpt: 'در این مقاله با نکات مهم برای خرید آنلاین ایمن و هوشمندانه آشنا می‌شوید.',
    image: '',
    date: '۱۴۰۲/۱۰/۱۵',
    category: 'خرید آنلاین'
  },
  {
    id: 'b2',
    title: 'راهنمای انتخاب بهترین هدفون',
    excerpt: 'چگونه بر اساس نیاز خود بهترین هدفون را انتخاب کنید؟',
    image: '',
    date: '۱۴۰۲/۱۰/۱۰',
    category: 'الکترونیک'
  },
  {
    id: 'b3',
    title: 'مقایسه برندهای لوازم خانگی',
    excerpt: 'بررسی و مقایسه برندهای مطرح لوازم خانگی در بازار ایران',
    image: '',
    date: '۱۴۰۲/۱۰/۰۵',
    category: 'راهنمای خرید'
  }
];

export const SAMPLE_STATS = {
  products: 480,
  orders: 3200,
  users: 1250
};
