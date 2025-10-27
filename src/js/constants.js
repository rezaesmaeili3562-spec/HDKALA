/* ---------- Constants ---------- */
let provinces = DataService.getCached('provinces') || [];
let categories = DataService.getCached('categories') || {};

DataService.subscribe('provinces', (data) => {
    provinces = Array.isArray(data) ? data : [];
    UIEventBus.emit('provinces:update', { provinces });
});

DataService.subscribe('categories', (data) => {
    categories = data && typeof data === 'object' ? data : {};
    UIEventBus.emit('categories:update', { categories });
});

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

const shippingMethods = [
    {
        id: 'standard',
        name: 'ارسال عادی',
        icon: 'mdi:truck-delivery-outline',
        description: 'تحویل ۳ تا ۵ روز کاری',
        price: 30000,
        freeThreshold: 500000
    },
    {
        id: 'express',
        name: 'ارسال سریع',
        icon: 'mdi:truck-fast-outline',
        description: 'تحویل ۱ تا ۲ روز کاری',
        price: 70000
    },
    {
        id: 'pickup',
        name: 'تحویل حضوری',
        icon: 'mdi:storefront',
        description: 'تحویل از فروشگاه مرکزی',
        price: 0
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

function getShippingMethod(id) {
    return shippingMethods.find(method => method.id === id) || shippingMethods[0];
}