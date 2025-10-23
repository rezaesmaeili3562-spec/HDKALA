/* ---------- Constants ---------- */
const provinces = [
    {
        name: 'تهران',
        cities: ['تهران', 'اسلامشهر', 'ری', 'شهریار', 'ورامین', 'قدس', 'پاکدشت', 'شمیرانات', 'رباط کریم']
    },
    {
        name: 'اصفهان',
        cities: ['اصفهان', 'کاشان', 'خمینی شهر', 'نجف آباد', 'شهرضا', 'اردستان', 'مبارکه', 'فلاورجان', 'گلپایگان']
    },
    {
        name: 'فارس',
        cities: ['شیراز', 'مرودشت', 'کازرون', 'فسا', 'لار', 'جهرم', 'داراب', 'آباده', 'اقلید']
    },
    {
        name: 'خراسان رضوی',
        cities: ['مشهد', 'نیشابور', 'سبزوار', 'تربت حیدریه', 'قوچان', 'کاشمر', 'گناباد', 'تایباد', 'خواف']
    },
    {
        name: 'آذربایجان شرقی',
        cities: ['تبریز', 'مراغه', 'مرند', 'اهر', 'میانه', 'اسکو', 'شبستر', 'هشترود', 'بناب']
    },
    {
        name: 'آذربایجان غربی',
        cities: ['ارومیه', 'خوی', 'مهاباد', 'میاندوآب', 'سلماس', 'پیرانشهر', 'اشنویه', 'بوکان', 'شاهین دژ']
    },
    {
        name: 'کرمان',
        cities: ['کرمان', 'رفسنجان', 'سیرجان', 'بم', 'جیرفت', 'زرند', 'کهنوج', 'انار', 'راور']
    },
    {
        name: 'خوزستان',
        cities: ['اهواز', 'آبادان', 'خرمشهر', 'دزفول', 'شوشتر', 'اندیمشک', 'مسجد سلیمان', 'بهبهان', 'شادگان']
    },
    {
        name: 'گیلان',
        cities: ['رشت', 'انزلی', 'لاهیجان', 'لنگرود', 'آستارا', 'آستانه اشرفیه', 'رودسر', 'صومعه سرا', 'فومن']
    },
    {
        name: 'مازندران',
        cities: ['ساری', 'بابل', 'آمل', 'قائم شهر', 'نور', 'نوشهر', 'چالوس', 'رامسر', 'بهشهر']
    },
    {
        name: 'البرز',
        cities: ['کرج', 'هشتگرد', 'نظرآباد', 'طالقان', 'اشتهارد', 'فردیس', 'ماهدشت', 'کمال شهر', 'محمودآباد']
    },
    {
        name: 'قم',
        cities: ['قم', 'جعفریه', 'کهک', 'دستجرد', 'سلفچگان']
    },
    {
        name: 'کردستان',
        cities: ['سنندج', 'سقز', 'مریوان', 'بانه', 'بیجار', 'قروه', 'کامیاران', 'دهگلان']
    },
    {
        name: 'همدان',
        cities: ['همدان', 'ملایر', 'نهاوند', 'تویسرکان', 'کبودرآهنگ', 'رزن', 'اسدآباد', 'بهار']
    },
    {
        name: 'مرکزی',
        cities: ['اراک', 'ساوه', 'خمین', 'محلات', 'تفرش', 'شازند', 'دلیجان', 'زرندیه']
    },
    {
        name: 'لرستان',
        cities: ['خرم آباد', 'بروجرد', 'دورود', 'کوهدشت', 'الیگودرز', 'نورآباد', 'پلدختر', 'ازنا']
    },
    {
        name: 'هرمزگان',
        cities: ['بندرعباس', 'قشم', 'میناب', 'بندر لنگه', 'رودان', 'حاجی آباد', 'بستک', 'خمیر']
    },
    {
        name: 'یزد',
        cities: ['یزد', 'میبد', 'اردکان', 'بافق', 'ابرکوه', 'تفت', 'مهریز', 'اشکذر']
    },
    {
        name: 'زنجان',
        cities: ['زنجان', 'ابهر', 'خرمدره', 'قیدار', 'خدابنده', 'ماهنشان', 'طارم', 'سلطانیه']
    },
    {
        name: 'سیستان و بلوچستان',
        cities: ['زاهدان', 'ایرانشهر', 'چابهار', 'خاش', 'زابل', 'سراوان', 'نیکشهر', 'کنارک']
    },
    {
        name: 'کرمانشاه',
        cities: ['کرمانشاه', 'اسلام آباد غرب', 'سنقر', 'هرسین', 'کنگاور', 'جوانرود', 'قصر شیرین', 'پاوه']
    },
    {
        name: 'کهگیلویه و بویراحمد',
        cities: ['یاسوج', 'گچساران', 'دهدشت', 'لیکک', 'سی سخت', 'چرام']
    },
    {
        name: 'بوشهر',
        cities: ['بوشهر', 'برازجان', 'گناوه', 'خورموج', 'عسلویه', 'جم', 'کنگان', 'دیر']
    },
    {
        name: 'اردبیل',
        cities: ['اردبیل', 'مشگین شهر', 'پارس آباد', 'خلخال', 'گرمی', 'نیر', 'نمین', 'بیله سوار']
    },
    {
        name: 'ایلام',
        cities: ['ایلام', 'دهلران', 'آبدانان', 'مهران', 'دره شهر', 'ایوان', 'سرابله']
    },
    {
        name: 'سمنان',
        cities: ['سمنان', 'شاهرود', 'دامغان', 'گرمسار', 'مهدی شهر', 'آرادان', 'میامی']
    },
    {
        name: 'چهارمحال و بختیاری',
        cities: ['شهرکرد', 'بروجن', 'فارسان', 'لردگان', 'اردل', 'سامان', 'بن', 'کیار']
    },
    {
        name: 'خراسان شمالی',
        cities: ['بجنورد', 'اسفراین', 'شیروان', 'آشخانه', 'جاجرم', 'فاروج', 'گرمه']
    },
    {
        name: 'خراسان جنوبی',
        cities: ['بیرجند', 'قائن', 'فردوس', 'نهبندان', 'سربیشه', 'درمیان', 'طبس']
    },
    {
        name: 'گلستان',
        cities: ['گرگان', 'گنبد کاووس', 'آق قلا', 'بندر گز', 'علی آباد', 'کردکوی', 'کلاله', 'مینودشت']
    }
];

const categories = {
    'electronics': {
        name: 'الکترونیک',
        subcategories: ['موبایل', 'لپ‌تاپ', 'هدفون', 'تبلت', 'دوربین', 'کنسول بازی']
    },
    'fashion': {
        name: 'مد و پوشاک',
        subcategories: ['لباس مردانه', 'لباس زنانه', 'کفش', 'اکسسوری', 'کیف', 'ساعت']
    },
    'home': {
        name: 'خانه و آشپزخانه',
        subcategories: ['مبلمان', 'لوازم آشپزخانه', 'دکوراسیون', 'لوازم برقی', 'سرویس خواب', 'فرش']
    },
    'books': {
        name: 'کتاب',
        subcategories: ['رمان', 'علمی', 'تاریخی', 'کودک', 'دانشگاهی', 'خارجی']
    },
    'sports': {
        name: 'ورزشی',
        subcategories: ['لباس ورزشی', 'کفش ورزشی', 'تجهیزات بدنسازی', 'توپ', 'کوهنوردی', 'شنا']
    }
};

const paymentMethods = [
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
        description: 'پرداخت هنگام تحویل کالا'
    },
    {
        id: 'installment',
        name: 'پرداخت قسطی',
        icon: 'mdi:calendar',
        description: 'قسطی 4 ماهه با کارت‌های بانکی'
    }
];

const operatorLogos = {
    'irancell': {
        name: 'ایرانسل',
        icon: 'mdi:signal',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10'
    },
    'mci': {
        name: 'همراه اول',
        icon: 'mdi:sim',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10'
    },
    'rightel': {
        name: 'رایتل',
        icon: 'mdi:wifi',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10'
    },
    'unknown': {
        name: 'سایر',
        icon: 'mdi:phone',
        color: 'text-gray-500',
        bgColor: 'bg-gray-500/10'
    }
};

const productStatuses = [
    { value: '', label: 'بدون وضعیت' },
    { value: 'new', label: 'جدید' },
    { value: 'hot', label: 'فروش ویژه' },
    { value: 'bestseller', label: 'پرفروش' }
];

const sortOptions = [
    { value: 'popular', label: 'پربازدیدترین' },
    { value: 'newest', label: 'جدیدترین' },
    { value: 'price_asc', label: 'ارزان‌ترین' },
    { value: 'price_desc', label: 'گران‌ترین' },
    { value: 'discount', label: 'بیشترین تخفیف' }
];

const discountOptions = [
    { value: '', label: 'همه' },
    { value: 'has_discount', label: 'دارای تخفیف' },
    { value: 'no_discount', label: 'بدون تخفیف' },
    { value: 'high_discount', label: 'تخفیف بالا (50%+)' }
];

const stockOptions = [
    { value: '', label: 'همه' },
    { value: 'in_stock', label: 'موجود' },
    { value: 'out_of_stock', label: 'ناموجود' }
];

const ratingOptions = [
    { value: '', label: 'همه' },
    { value: '4', label: '4 ستاره و بالاتر' },
    { value: '3', label: '3 ستاره و بالاتر' },
    { value: '2', label: '2 ستاره و بالاتر' },
    { value: '1', label: '1 ستاره و بالاتر' }
];

// توابع کمکی برای constants
function getProvinceCities(provinceName) {
    const province = provinces.find(p => p.name === provinceName);
    return province ? province.cities : [];
}

function getCategorySubcategories(categoryId) {
    return categories[categoryId] ? categories[categoryId].subcategories : [];
}

function getOperatorInfo(phone) {
    if (phone.startsWith('099')) return operatorLogos.irancell;
    if (phone.startsWith('091') || phone.startsWith('0990')) return operatorLogos.mci;
    if (phone.startsWith('093')) return operatorLogos.rightel;
    return operatorLogos.unknown;
}

function getPaymentMethod(id) {
    return paymentMethods.find(method => method.id === id) || paymentMethods[0];
}