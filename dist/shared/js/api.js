const products = [
  {
    id: 'p-1',
    name: 'گوشی هوشمند HDK One',
    description: 'گوشی پرچمدار با نمایشگر ۶.۵ اینچی و دوربین سه‌گانه.',
    price: 28990000,
    category: 'electronics',
    badge: 'جدید',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p-2',
    name: 'ساعت هوشمند HDK Fit',
    description: 'طراحی سبک با سنسورهای سلامتی و شارژدهی طولانی.',
    price: 5990000,
    category: 'electronics',
    badge: 'محبوب',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p-3',
    name: 'هدفون بی‌سیم HDK Air',
    description: 'کیفیت صدای ممتاز و حذف نویز فعال.',
    price: 3490000,
    category: 'electronics',
    badge: 'پیشنهاد ویژه',
    image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p-4',
    name: 'کفش ورزشی HDK Run',
    description: 'مناسب برای دویدن شهری و تمرین روزانه.',
    price: 1890000,
    category: 'sports',
    badge: 'حراج',
    image: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p-5',
    name: 'لباس راحتی HDK Cozy',
    description: 'پارچه لطیف با طراحی مینیمال برای استایل خانگی.',
    price: 920000,
    category: 'fashion',
    badge: 'پرفروش',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p-6',
    name: 'قهوه‌ساز HDK Brew',
    description: 'استخراج یکنواخت با قابلیت برنامه‌ریزی هوشمند.',
    price: 2490000,
    category: 'home',
    badge: 'ویژه',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
  }
];

const blogs = [
  {
    id: 'b-1',
    title: 'راهنمای خرید گوشی هوشمند',
    excerpt: 'نکات کلیدی برای انتخاب بهترین گوشی متناسب با بودجه و نیاز شما.',
    date: '1402/06/12'
  },
  {
    id: 'b-2',
    title: 'چطور سبد خرید خود را بهینه کنیم؟',
    excerpt: 'با تکنیک‌های ساده می‌توانید خرید هوشمندانه‌تری داشته باشید.',
    date: '1402/05/28'
  },
  {
    id: 'b-3',
    title: '۱۰ تمرین کوتاه برای ورزش روزانه',
    excerpt: 'این تمرینات را می‌توانید در خانه یا محیط کار انجام دهید.',
    date: '1402/05/10'
  }
];

const faCurrency = new Intl.NumberFormat('fa-IR', {
  style: 'currency',
  currency: 'IRR',
  maximumFractionDigits: 0
});

export function formatPrice(value) {
  return faCurrency.format(value);
}

export async function fetchProducts(filter = {}) {
  const { category, search } = filter;
  let list = [...products];

  if (category && category !== 'all') {
    list = list.filter((item) => item.category === category);
  }

  if (search) {
    const term = search.trim().toLowerCase();
    if (term) {
      list = list.filter((item) => item.name.toLowerCase().includes(term));
    }
  }

  return Promise.resolve(list);
}

export async function fetchProductById(id) {
  return Promise.resolve(products.find((item) => item.id === id) ?? null);
}

export async function fetchFeaturedProducts() {
  return Promise.resolve(products.slice(0, 3));
}

export async function fetchBlogs() {
  return Promise.resolve(blogs);
}
