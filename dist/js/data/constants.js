export const CATEGORIES = {
  electronics: {
    name: 'الکترونیک',
    subcategories: ['موبایل', 'لپ‌تاپ', 'هدفون', 'تبلت', 'دوربین', 'کنسول بازی']
  },
  fashion: {
    name: 'مد و پوشاک',
    subcategories: ['لباس مردانه', 'لباس زنانه', 'کفش', 'اکسسوری', 'کیف', 'ساعت']
  },
  home: {
    name: 'خانه و آشپزخانه',
    subcategories: ['مبلمان', 'لوازم آشپزخانه', 'دکوراسیون', 'لوازم برقی', 'سرویس خواب', 'فرش']
  },
  books: {
    name: 'کتاب',
    subcategories: ['رمان', 'علمی', 'تاریخی', 'کودک', 'دانشگاهی', 'خارجی']
  },
  sports: {
    name: 'ورزشی',
    subcategories: ['لباس ورزشی', 'کفش ورزشی', 'تجهیزات بدنسازی', 'توپ', 'کوهنوردی', 'شنا']
  }
};

export const PAYMENT_METHODS = [
  {
    id: 'online',
    name: 'پرداخت آنلاین',
    icon: 'mdi:credit-card',
    description: 'پرداخت امن از طریق درگاه بانکی'
  },
  {
    id: 'cash',
    name: 'پرداخت در محل',
    icon: 'mdi:cash',
    description: 'پرداخت هنگام دریافت سفارش'
  },
  {
    id: 'installment',
    name: 'اقساطی',
    icon: 'mdi:calendar-clock',
    description: 'بازپرداخت تا ۱۲ ماه با بهره کم'
  }
];
