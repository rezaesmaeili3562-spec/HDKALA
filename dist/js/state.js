/* ---------- Sample Data ---------- */
const defaultProducts = [
    { 
        id: 'p1', 
        name: 'هدفون بی‌سیم Sony WH-1000XM4', 
        price: 990000, 
        desc:'هدفون بی‌سیم با نویزکنسلینگ پیشرفته و کیفیت صدای استثنایی. مناسب برای مسافرت و محیط‌های پرسر و صدا.',
        images:[
            'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1510074377623-8cf13fb90a81?auto=format&fit=crop&w=800&q=80'
        ],
        img:'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80',
        rating: 5,
        discount: 15,
        category: 'electronics',
        status: 'new',
        stock: 50,
        brand: 'Sony',
        features: ['نویزکنسلینگ', 'باتری 30 ساعته', 'شارژ سریع', 'کنترل لمسی'],
        colors: ['مشکی', 'نقره‌ای', 'آبی'],
        sizes: [],
        specifications: {
            'نوع': 'بی‌سیم',
            'باتری': '30 ساعت',
            'وزن': '254 گرم',
            'اتصال': 'بلوتوث 5.0'
        }
    },
    { 
        id: 'p2', 
        name: 'گوشی هوشمند Samsung Galaxy S23', 
        price: 25000000, 
        desc:'گوشی هوشمند قدرتمند با دوربین 200 مگاپیکسلی و پردازنده اسنپدراگون 8 نسل 2. مناسب برای بازی و عکاسی حرفه‌ای.',
        images:[
            'https://images.unsplash.com/photo-1610945415295-1c071f2a1ed5?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=800&q=80'
        ],
        img:'https://images.unsplash.com/photo-1610945415295-1c071f2a1ed5?auto=format&fit=crop&w=800&q=80',
        rating: 5,
        discount: 0,
        category: 'electronics',
        status: 'hot',
        stock: 12,
        brand: 'Samsung',
        features: ['دوربین 200MP', 'پردازنده اسنپدراگون', 'نمایشگر 120Hz', 'شارژ سریع 45W'],
        colors: ['مشکی', 'سبز', 'بنفش'],
        sizes: [],
        specifications: {
            'نمایشگر': '6.8 اینچ',
            'رم': '12GB',
            'حافظه': '256GB',
            'باتری': '5000 mAh'
        }
    },
    { 
        id: 'p3', 
        name: 'لپ‌تاپ Apple MacBook Pro 14', 
        price: 85000000, 
        desc:'لپ‌تاپ حرفه‌ای با تراشه M2 Pro، نمایشگر Liquid Retina XDR و باتری تمام‌روزه. مناسب برای طراحان و برنامه‌نویسان.',
        images:[
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=800&q=80'
        ],
        img:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        rating: 5,
        discount: 10,
        category: 'electronics',
        status: 'bestseller',
        stock: 5,
        brand: 'Apple',
        features: ['تراشه M2 Pro', 'نمایشگر XDR', 'باتری 18 ساعته', '18GB رم'],
        colors: ['نقره‌ای', 'Space Gray'],
        sizes: [],
        specifications: {
            'پردازنده': 'Apple M2 Pro',
            'رم': '18GB',
            'ذخیره‌سازی': '1TB SSD',
            'نمایشگر': '14.2 اینچ'
        }
    },
    { 
        id: 'p4', 
        name: 'کتاب هفت عادت مردمان موثر', 
        price: 85000, 
        desc:'کتاب پرفروش استفان کاوی درباره هفت عادتی که زندگی شما را متحول خواهد کرد.',
        images:[
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80'
        ],
        img:'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
        rating: 4,
        discount: 20,
        category: 'books',
        status: '',
        stock: 100,
        brand: 'نشر پیکان',
        features: ['جلد گالینگور', 'ترجمه روان', 'کیفیت چاپ بالا'],
        colors: [],
        sizes: [],
        specifications: {
            'نویسنده': 'استفان کاوی',
            'مترجم': 'محمد رضا آل یاسین',
            'تعداد صفحات': '400',
            'ناشر': 'پیکان'
        }
    },
    { 
        id: 'p5', 
        name: 'کفش ورزشی Nike Air Max', 
        price: 4500000, 
        desc:'کفش ورزشی با تکنولوژی Air Max برای راحتی و عملکرد بهتر در ورزش.',
        images:[
            'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'
        ],
        img:'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=800&q=80',
        rating: 4,
        discount: 25,
        category: 'sports',
        status: 'hot',
        stock: 30,
        brand: 'Nike',
        features: ['تکنولوژی Air Max', 'کفی اورتوپدی', 'مناسب دویدن', 'تنفس پذیری بالا'],
        colors: ['سفید', 'مشکی', 'قرمز'],
        sizes: ['39', '40', '41', '42', '43', '44'],
        specifications: {
            'جنس': 'مش و چرم',
            'سایز': '39-45',
            'کاربرد': 'ورزشی و روزمره',
            'کف': 'لاستیک با دوام'
        }
    },
    { 
        id: 'p6', 
        name: 'مبل راحتی 3 نفره', 
        price: 35000000, 
        desc:'مبل راحتی با پارچه مخمل و قابلیت تنظیم پشتی. مناسب برای اتاق پذیرایی.',
        images:[
            'https://images.unsplash.com/photo-1549187774-b4e9b0445b07?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80'
        ],
        img:'https://images.unsplash.com/photo-1549187774-b4e9b0445b07?auto=format&fit=crop&w=800&q=80',
        rating: 4,
        discount: 15,
        category: 'home',
        status: '',
        stock: 8,
        brand: 'مبل ایران',
        features: ['پارچه مخمل', 'قابلیت تنظیم پشتی', 'پر کوسن‌ها', 'قاب فلزی'],
        colors: ['مشکی', 'خاکستری', 'آبی'],
        sizes: ['دو نفره', 'سه نفره', 'L شکل'],
        specifications: {
            'ابعاد': '200x90x80 سانتی‌متر',
            'جنس پارچه': 'مخمل',
            'قاب': 'فلز',
            'ظرفیت': '3 نفر'
        }
    },
    { 
        id: 'p7', 
        name: 'دستگاه قهوه ساز Delonghi', 
        price: 12500000, 
        desc:'دستگاه قهوه ساز تمام اتوماتیک با قابلیت تهیه انواع قهوه اسپرسو، کاپوچینو و لاته.',
        images:[
            'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80'
        ],
        img:'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
        rating: 5,
        discount: 30,
        category: 'home',
        status: 'new',
        stock: 15,
        brand: 'Delonghi',
        features: ['تمام اتوماتیک', 'ساخت کاپوچینو', 'پمپ 15 بار', 'سیستم گرمایش سریع'],
        colors: ['مشکی', 'نقره‌ای'],
        sizes: [],
        specifications: {
            'نوع': 'اسپرسو ساز',
            'ظرفیت آب': '1.8 لیتر',
            'قدرت': '1450 وات',
            'ابعاد': '24x34x43 سانتی‌متر'
        }
    },
    { 
        id: 'p8', 
        name: 'کاپشن زمستانی مردانه', 
        price: 2800000, 
        desc:'کاپشن زمستانی با پر طبیعی، مناسب برای هوای سرد. طراحی شیک و مدرن.',
        images:[
            'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
        ],
        img:'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80',
        rating: 4,
        discount: 40,
        category: 'fashion',
        status: 'hot',
        stock: 25,
        brand: 'Zara',
        features: ['پر طبیعی', 'ضد آب', 'جیب‌های متعدد', 'کاپوت جدا شونده'],
        colors: ['مشکی', 'خاکستری', 'آبی دریایی'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        specifications: {
            'جنس': 'نایلون و پر',
            'سایز': 'S-XXL',
            'کاربرد': 'زمستانی',
            'شستشو': 'خشک شویی'
        }
    }
];

const defaultBlogs = [
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
        category: 'لوازم خانگی'
    }
];

// داده‌های جدید برای آدرس‌ها و اطلاع‌رسانی
const defaultAddresses = [];
const defaultNotifications = [];

/* ---------- Initial bootstrap data ---------- */
const storageDefaults = {
    HDK_products: defaultProducts,
    HDK_cart: [],
    HDK_orders: [],
    HDK_user: null,
    HDK_wishlist: [],
    HDK_comments: {},
    HDK_viewHistory: [],
    HDK_compare: [],
    HDK_blogs: defaultBlogs,
    HDK_addresses: defaultAddresses,
    HDK_notifications: defaultNotifications
};

Object.entries(storageDefaults).forEach(([key, fallback]) => {
    if (localStorage.getItem(key) === null) {
        LS.set(key, fallback);
    }
});

const ADMIN_CREDENTIALS = Object.freeze([
    {
        id: 'admin-1',
        name: 'مدیر سیستم',
        phone: '09120000000',
        email: 'admin@hdkala.com',
        password: 'Admin@123'
    }
]);

const ADMIN_ACCESS = Object.freeze({
    phones: ADMIN_CREDENTIALS.map(credential => credential.phone),
    emails: ADMIN_CREDENTIALS.map(credential => credential.email.toLowerCase())
});

const ADMIN_PERMISSIONS = Object.freeze([
    'products.manage',
    'orders.view',
    'blogs.manage'
]);

function hasAdminIdentifier(record) {
    if (!record) {
        return false;
    }
    const phone = (record.phone || '').replace(/\s+/g, '');
    const email = (record.email || '').trim().toLowerCase();
    return (phone && ADMIN_ACCESS.phones.includes(phone)) ||
        (email && ADMIN_ACCESS.emails.includes(email));
}

function findAdminCredential({ phone, email, password }) {
    if (!phone || !email || !password) {
        return null;
    }

    const normalizedPhone = phone.replace(/\s+/g, '');
    const normalizedEmail = email.trim().toLowerCase();

    return ADMIN_CREDENTIALS.find(credential =>
        credential.phone === normalizedPhone &&
        credential.email.toLowerCase() === normalizedEmail &&
        credential.password === password
    ) || null;
}

function normalizeUser(record) {
    if (!record) {
        return null;
    }

    const normalized = { ...record };
    if (!normalized.name && (normalized.firstName || normalized.lastName)) {
        normalized.name = `${normalized.firstName || ''} ${normalized.lastName || ''}`.trim();
    }

    const isAdmin = hasAdminIdentifier(normalized) || normalized.role === 'admin' || normalized.isAdmin === true;
    normalized.role = isAdmin ? 'admin' : (normalized.role || 'customer');
    normalized.isAdmin = normalized.role === 'admin';

    let permissions = Array.isArray(normalized.permissions) ? normalized.permissions.slice() : [];
    if (normalized.isAdmin) {
        ADMIN_PERMISSIONS.forEach(permission => {
            if (!permissions.includes(permission)) {
                permissions.push(permission);
            }
        });
    } else {
        permissions = permissions.filter(permission => !ADMIN_PERMISSIONS.includes(permission));
    }
    normalized.permissions = permissions;

    return normalized;
}

/* ---------- State ---------- */
let products = LS.get('HDK_products', []);
let cart = LS.get('HDK_cart', []);
let orders = LS.get('HDK_orders', []);
let user = normalizeUser(LS.get('HDK_user', null));
let wishlist = LS.get('HDK_wishlist', []);
let comments = LS.get('HDK_comments', {});
let viewHistory = LS.get('HDK_viewHistory', []);
let compareList = LS.get('HDK_compare', []);
let blogs = LS.get('HDK_blogs', []);
let addresses = LS.get('HDK_addresses', []);
let notifications = LS.get('HDK_notifications', []);
let currentPage = 'home';
let currentProductId = null;
let currentCategory = null;
let editingProductId = null;

/* ---------- DOM refs ---------- */
const contentRoot = $('#content');
const cartCountEl = $('#cartCount');
const wishlistCountEl = $('#wishlistCount');
const compareCountEl = $('#compareCount');
const userLabel = $('#userLabel');
const adminBtn = $('#adminBtn');
const mobileMenuBtn = $('#mobileMenuBtn');
const mobileMenu = $('#mobileMenu');
const searchInput = $('#searchInput');
const filterBtn = $('#filterBtn');
let filterSidebar = $('#filterSidebar');
let closeFilters = $('#closeFilters');
let filterOverlay = $('#filterOverlay');
const userButton = $('#userButton');
const userDropdown = $('#userDropdown');
const userDropdownContent = $('#userDropdownContent');
const themeToggle = $('#themeToggle');
const themeIcon = $('#themeIcon');
const root = document.documentElement;
const cartBtn = $('#cartBtn');
const cartSidebar = $('#cartSidebar');
const closeCart = $('#closeCart');
const cartOverlay = $('#cartOverlay');
const cartItems = $('#cartItems');
const cartTotal = $('#cartTotal');
const cartDiscount = $('#cartDiscount');
const cartShipping = $('#cartShipping');
const cartFinalTotal = $('#cartFinalTotal');
const checkoutBtn = $('#checkoutBtn');
const compareBtn = $('#compareBtn');
const compareModal = $('#compareModal');
const closeCompareModal = $('#closeCompareModal');
const compareProducts = $('#compareProducts');

/* ---------- Admin Panel Elements ---------- */
const adminModal = $('#adminModal');
const closeAdminModal = $('#closeAdminModal');
const addProductBtn = $('#addProductBtn');
const adminProductsList = $('#adminProductsList');
const productForm = $('#productForm');
const formTitle = $('#formTitle');
const saveProductBtn = $('#saveProduct');
const cancelProductBtn = $('#cancelProduct');
const adminSearch = $('#adminSearch');
const adminProductCount = $('#adminProductCount');
const adminInStockCount = $('#adminInStockCount');
const adminDiscountCount = $('#adminDiscountCount');
const adminOrderCount = $('#adminOrderCount');

/* ---------- Filter Elements ---------- */
let sortSelect = $('#sortSelect');
let minPrice = $('#minPrice');
let maxPrice = $('#maxPrice');
let categoryFilter = $('#categoryFilter');
let discountFilter = $('#discountFilter');
let brandFilter = $('#brandFilter');
let stockFilter = $('#stockFilter');
let ratingFilter = $('#ratingFilter');
let priceRange = $('#priceRange');
let applyFilterBtn = $('#applyFilter');
let clearFilterBtn = $('#clearFilter');

/* ---------- utils ---------- */
function getProductById(id){ return products.find(p=>p.id === id); }

function addViewedProduct(id) {
    const p = getProductById(id);
    if(!p) return;
    viewHistory = viewHistory.filter(item => item.id !== id);
    viewHistory.unshift(p);
    if(viewHistory.length > 5) viewHistory.pop();
    LS.set('HDK_viewHistory', viewHistory);
}

function updateCartBadge(){ 
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if(totalItems === 0) {
        cartCountEl.classList.add('hidden'); 
    } else { 
        cartCountEl.classList.remove('hidden'); 
        cartCountEl.textContent = String(totalItems); 
    } 
    updateCartDisplay();
}

function updateWishlistBadge(){ 
    if(wishlist.length === 0) {
        wishlistCountEl.classList.add('hidden'); 
    } else { 
        wishlistCountEl.classList.remove('hidden'); 
        wishlistCountEl.textContent = String(wishlist.length); 
    } 
}

function updateCompareBadge() {
    if(compareList.length === 0) {
        compareCountEl.classList.add('hidden');
    } else {
        compareCountEl.classList.remove('hidden');
        compareCountEl.textContent = String(compareList.length);
    }
}

function getActiveUser() {
    return user;
}

function isAdminUser(candidate = user) {
    return !!(candidate && candidate.isAdmin);
}

function updateAdminVisibility() {
    const isAdmin = isAdminUser();

    if (adminBtn) {
        adminBtn.classList.remove('hidden');
        adminBtn.removeAttribute('aria-hidden');
        adminBtn.disabled = false;
        if (adminBtn.dataset) {
            adminBtn.dataset.adminState = isAdmin ? 'authorized' : 'locked';
        }
    }

    const nav = $('nav .hidden.md\\:flex');
    if (nav) {
        let link = nav.querySelector('[data-nav-admin]');
        if (!link) {
            link = document.createElement('a');
            link.textContent = 'پنل مدیریت';
            link.className = 'text-gray-700 dark:text-gray-300 hover:text-primary transition-colors';
            link.setAttribute('data-nav-admin', 'true');
            nav.insertBefore(link, nav.firstChild);
        }

        link.href = isAdmin ? '#admin' : '#admin-login';
        link.dataset.adminState = isAdmin ? 'authorized' : 'locked';
    }
}

function syncUserSession(nextUser) {
    user = nextUser ? normalizeUser(nextUser) : null;
    LS.set('HDK_user', user);
    updateUserLabel();
    return user;
}

function clearUserSession() {
    return syncUserSession(null);
}

function ensureAdminAccess({ showToast = true, redirect = true } = {}) {
    if (isAdminUser()) {
        return true;
    }

    if (showToast && typeof notify === 'function') {
        notify('دسترسی فقط برای مدیران مجاز است', 'error', { allowDuplicates: false });
    }

    if (redirect && typeof navigate === 'function') {
        navigate('admin-login');
    }

    return false;
}

function updateUserLabel(){
    if (userLabel) {
        userLabel.textContent = (user && user.name) ? user.name : 'ورود / ثبت‌نام';
        if (userLabel.dataset) {
            userLabel.dataset.userRole = user?.role || 'guest';
        }
    }
    updateAdminVisibility();
    updateUserDropdown();
}

updateAdminVisibility();
