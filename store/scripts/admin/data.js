window.adminData = {
  users: [
    { id: 'U-1042', name: 'مریم احمدی', email: 'maryam@example.com', role: 'مدیر محتوا', status: 'فعال', orders: 42, lastLogin: '1403/08/18 12:40', phone: '09120000012' },
    { id: 'U-1043', name: 'امیررضا موسوی', email: 'amir@example.com', role: 'پشتیبانی', status: 'در انتظار', orders: 9, lastLogin: '1403/08/17 21:10', phone: '09350000045' },
    { id: 'U-1044', name: 'زهرا کریمی', email: 'zahra@example.com', role: 'مدیر سیستم', status: 'فعال', orders: 81, lastLogin: '1403/08/18 10:05', phone: '09190000011' },
    { id: 'U-1045', name: 'علیرضا حیدری', email: 'ali@example.com', role: 'تحلیل‌گر', status: 'معلق', orders: 0, lastLogin: '1403/08/15 08:25', phone: '09900000008' }
  ],
  roles: [
    { name: 'مدیر سیستم', permissions: ['کاربران', 'محصولات', 'سفارشات', 'تنظیمات'], members: 2 },
    { name: 'پشتیبانی', permissions: ['سفارشات', 'گزارشات', 'کاربران'], members: 3 },
    { name: 'مدیر محتوا', permissions: ['محصولات', 'دسته‌بندی', 'گزارشات'], members: 4 }
  ],
  products: [
    { id: 'P-3021', name: 'ایرفون بی‌سیم', category: 'دیجیتال', price: 1890000, stock: 38, status: 'فعال', rating: 4.6, sold: 164 },
    { id: 'P-3022', name: 'کتانی ورزشی', category: 'مد و پوشاک', price: 2150000, stock: 12, status: 'در انتظار', rating: 4.2, sold: 73 },
    { id: 'P-3023', name: 'مونوپاد حرفه‌ای', category: 'گجت', price: 740000, stock: 0, status: 'معلق', rating: 4.0, sold: 41 },
    { id: 'P-3024', name: 'ست آشپزخانه', category: 'خانه و آشپزخانه', price: 1290000, stock: 25, status: 'فعال', rating: 4.8, sold: 220 }
  ],
  categories: [
    { name: 'دیجیتال', items: 164 },
    { name: 'مد و پوشاک', items: 98 },
    { name: 'خانه و آشپزخانه', items: 132 },
    { name: 'زیبایی و سلامت', items: 76 }
  ],
  orders: [
    { id: 'O-8421', customer: 'نیلوفر زمانی', amount: 2890000, status: 'جدید', created: '1403/08/18 13:10', items: 3, city: 'تهران' },
    { id: 'O-8422', customer: 'پارسا داودی', amount: 1190000, status: 'در حال بررسی', created: '1403/08/18 12:55', items: 1, city: 'اصفهان' },
    { id: 'O-8423', customer: 'سارا رستمی', amount: 3890000, status: 'جدید', created: '1403/08/18 12:30', items: 5, city: 'تبریز' },
    { id: 'O-8424', customer: 'امید رفیعی', amount: 920000, status: 'جدید', created: '1403/08/18 11:48', items: 2, city: 'مشهد' }
  ],
  orderHistory: [
    { id: 'O-8300', customer: 'صبا جعفری', amount: 1750000, status: 'ارسال شد', created: '1403/08/12', updated: '1403/08/14', items: 2 },
    { id: 'O-8299', customer: 'امیرحسین عباسی', amount: 2350000, status: 'تحویل شد', created: '1403/08/10', updated: '1403/08/13', items: 4 },
    { id: 'O-8298', customer: 'گلاره مؤمنی', amount: 980000, status: 'مرجوعی', created: '1403/08/08', updated: '1403/08/11', items: 1 }
  ],
  reports: {
    sales: [52000000, 58400000, 64000000, 60500000, 67200000, 70200000],
    labels: ['اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر'],
    conversions: [3.4, 3.9, 4.1, 3.8, 4.4, 4.8]
  },
  income: [
    { month: 'مهر', gross: 125000000, costs: 42000000, net: 83000000, orders: 1240, growth: 12 },
    { month: 'شهریور', gross: 112000000, costs: 39500000, net: 72500000, orders: 1185, growth: 6 },
    { month: 'مرداد', gross: 102500000, costs: 38200000, net: 64300000, orders: 1102, growth: 4 }
  ],
  transactions: [
    { id: 'T-5501', type: 'واریز', amount: 1480000, channel: 'درگاه بانکی', status: 'تسویه شد', created: '1403/08/18 10:24' },
    { id: 'T-5502', type: 'برداشت', amount: 2200000, channel: 'حساب شرکتی', status: 'در حال بررسی', created: '1403/08/18 09:40' },
    { id: 'T-5503', type: 'واریز', amount: 980000, channel: 'کیف پول', status: 'تسویه شد', created: '1403/08/17 21:15' },
    { id: 'T-5504', type: 'برداشت', amount: 3120000, channel: 'درگاه بانکی', status: 'رد شد', created: '1403/08/17 19:05' }
  ],
  invoices: [
    { id: 'F-2024-18', customer: 'شرکت بهین دارو', amount: 15800000, status: 'پرداخت شده', due: '1403/08/25', created: '1403/08/18' },
    { id: 'F-2024-17', customer: 'کالای نو', amount: 4200000, status: 'سررسید', due: '1403/08/20', created: '1403/08/16' },
    { id: 'F-2024-16', customer: 'کانون آذرخش', amount: 7200000, status: 'پیش‌نویس', due: '1403/09/01', created: '1403/08/15' }
  ],
  backups: [
    { id: 'B-1201', type: 'فول بکاپ', size: '1.8GB', created: '1403/08/16 03:00', status: 'کامل' },
    { id: 'B-1200', type: 'دیتابیس', size: '420MB', created: '1403/08/15 03:00', status: 'کامل' }
  ]
};
