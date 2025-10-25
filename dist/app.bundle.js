/* HDKALA bundle generated: 2025-10-25T11:19:19.785Z */
// ---- core.js ----
/* ---------- helpers ---------- */
const $ = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => Array.from((ctx||document).querySelectorAll(s));
function uid(prefix='id'){ return prefix + Math.random().toString(36).slice(2,9); }

function formatPrice(n){ return n.toLocaleString('fa-IR') + ' تومان'; }

function getProductImages(product) {
    if (!product) return [];
    const images = Array.isArray(product.images)
        ? product.images.filter(Boolean)
        : [];
    if (images.length > 0) {
        return images;
    }
    if (product.img) {
        return [product.img];
    }
    return [];
}

function getPrimaryProductImage(product) {
    const images = getProductImages(product);
    return images.length > 0 ? images[0] : '';
}

function createEmptyState({ icon = 'mdi:information-outline', title = '', description = '', actions = '' } = {}) {
    return `
        <div class="empty-state bg-white dark:bg-gray-800 border border-dashed border-primary/30 rounded-2xl p-10 text-center flex flex-col items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl">
                <iconify-icon icon="${icon}" width="32"></iconify-icon>
            </div>
            <div>
                <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">${title}</h2>
                ${description ? `<p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">${description}</p>` : ''}
            </div>
            ${actions ? `<div class="flex flex-wrap items-center justify-center gap-2">${actions}</div>` : ''}
        </div>
    `;
}

function getCategoryName(category) {
    const categories = {
        'electronics': 'الکترونیک',
        'fashion': 'مد و پوشاک',
        'home': 'خانه و آشپزخانه',
        'books': 'کتاب',
        'sports': 'ورزشی'
    };
    return categories[category] || category;
}

// تابعی برای نگاشت مسیر به کلید ناوبری جهت هایلایت صحیح
function mapRouteToNavigationKey(route) {
    switch(route){
        case 'product':
        case 'compare':
        case 'wishlist':
            return 'products';
        case 'checkout':
            return 'cart';
        case 'addresses':
            return 'addresses';
        case 'orders':
        case 'order-success':
        case 'profile':
            return 'profile';
        default:
            return route || 'home';
    }
}

// تابعی برای بروزرسانی لینک‌های ناوبری بر اساس صفحه فعال
function setActiveNavigation(route) {
    const normalizedRoute = mapRouteToNavigationKey(route);
    const links = $$('[data-route-link]');

    links.forEach(link => {
        const targetRoute = link.getAttribute('data-route-link');
        const activeClasses = (link.getAttribute('data-active-class') || '').split(/\s+/).filter(Boolean);
        const inactiveClasses = (link.getAttribute('data-inactive-class') || '').split(/\s+/).filter(Boolean);
        const isActive = targetRoute === normalizedRoute;

        link.setAttribute('aria-current', isActive ? 'page' : 'false');

        activeClasses.forEach(cls => {
            if (!cls) return;
            link.classList.toggle(cls, isActive);
        });

        inactiveClasses.forEach(cls => {
            if (!cls) return;
            if (isActive) {
                link.classList.remove(cls);
            } else {
                link.classList.add(cls);
            }
        });
    });
}

function handleProductActions(e) {
    const addBtn = e.target.closest('.add-to-cart');
    if(addBtn){ 
        addToCart(addBtn.getAttribute('data-id'), 1); 
        return; 
    }
    const viewBtn = e.target.closest('.view-detail');
    if(viewBtn){ 
        location.hash = `product:${viewBtn.getAttribute('data-id')}`; 
        return; 
    }
    const favBtn = e.target.closest('.add-to-wishlist');
    if(favBtn){ 
        toggleWishlist(favBtn.getAttribute('data-id')); 
        return; 
    }
    const compBtn = e.target.closest('.add-to-compare');
    if(compBtn){ 
        toggleCompare(compBtn.getAttribute('data-id')); 
        return; 
    }
}

function renderProductsList(list, container){
    if(!container) return;
    container.innerHTML = '';
    if(!list || list.length===0){
        container.innerHTML = `
            <div class="col-span-full">
                ${createEmptyState({
                    icon: 'mdi:package-variant-remove',
                    title: 'محصولی یافت نشد',
                    description: 'لطفا فیلترهای خود را تغییر دهید یا دسته دیگری را امتحان کنید.'
                })}
            </div>
        `;
        return;
    }
    
    list.forEach(product => {
        const card = typeof createProductCard === 'function'
            ? createProductCard(product)
            : null;

        if (card) {
            container.appendChild(card);
        }
    });
}

function getOperatorLogo(phone) {
    if (phone.startsWith('099')) return 'irancell';
    if (phone.startsWith('091') || phone.startsWith('0990')) return 'mci';
    if (phone.startsWith('093')) return 'rightel';
    return 'unknown';
}

// ---- storage.js ----
/* ---------- Local Storage Helpers ---------- */
const LS = {
    get(key, defaultValue) {
        try {
            const rawValue = localStorage.getItem(key);
            return rawValue ? JSON.parse(rawValue) : defaultValue;
        } catch (error) {
            return defaultValue;
        }
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};

// ---- state.js ----
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

/* ---------- State ---------- */
let products = LS.get('HDK_products', []);
let cart = LS.get('HDK_cart', []);
let orders = LS.get('HDK_orders', []);
let user = LS.get('HDK_user', null);
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

function updateUserLabel(){ 
    userLabel.textContent = (user && user.name) ? user.name : 'ورود / ثبت‌نام'; 
    updateUserDropdown();
}

// ---- router.js ----
/* ---------- Dynamic Content Router ---------- */
const DEFAULT_ROUTE = 'home';
let currentRouteParams = [];
let pageRenderTimeout = null;

const ROUTE_HANDLERS = {
    login: () => renderLoginPage(),
    home: () => renderHomePage(),
    products: () => renderProductsPage(),
    product: ({ params }) => renderProductDetailPage(params[0]),
    wishlist: () => renderWishlistPage(),
    compare: () => renderComparePage(),
    cart: () => renderCartPage(),
    checkout: () => renderCheckoutPage(),
    about: () => renderAboutPage(),
    contact: () => renderContactPage(),
    search: ({ params }) => renderSearchPage(params),
    blog: ({ params }) => {
        if (params[0] && typeof renderBlogDetailPage === 'function') {
            renderBlogDetailPage(params[0]);
        } else {
            renderBlogPage();
        }
    },
    profile: () => renderProfilePage(),
    orders: () => renderOrdersPage(),
    'order-success': ({ params }) => renderOrderSuccessPage(params[0]),
    addresses: () => renderAddressesPage(),
    shipping: () => renderShippingPage(),
    terms: () => renderTermsPage(),
    privacy: () => renderPrivacyPage(),
    faq: () => renderFaqPage(),
    admin: () => renderAdminPage(),
    'not-found': () => renderNotFoundPage()
};

const DEFAULT_DOCUMENT_TITLE = 'HDKALA — فروشگاه آنلاین';
const DEFAULT_META_DESCRIPTION = 'فروشگاه اینترنتی HDKALA - بهترین تجربه خرید آنلاین با تنوع بی‌نظیر محصولات و قیمت‌های استثنایی.';
const metaDescriptionTag = document.querySelector('meta[name="description"]');

const ROUTE_LABELS = {
    home: 'خانه',
    products: 'محصولات',
    product: 'جزئیات محصول',
    wishlist: 'علاقه‌مندی‌ها',
    compare: 'مقایسه محصولات',
    cart: 'سبد خرید',
    checkout: 'تسویه حساب',
    login: 'ورود',
    profile: 'پروفایل کاربری',
    orders: 'سفارش‌ها',
    'order-success': 'ثبت موفق سفارش',
    addresses: 'آدرس‌ها',
    about: 'درباره HDKALA',
    contact: 'تماس با HDKALA',
    search: 'جستجو',
    blog: 'مجله HDKALA',
    shipping: 'ارسال و بازگشت کالا',
    terms: 'قوانین و مقررات',
    privacy: 'حریم خصوصی',
    faq: 'سوالات متداول',
    admin: 'مدیریت فروشگاه',
    'not-found': 'صفحه یافت نشد'
};

function normalizeRouteSegment(segment) {
    if (!segment) return '';
    return segment
        .toString()
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function resolveRouteLabel(route) {
    if (!route) {
        return ROUTE_LABELS.home || 'HDKALA';
    }
    if (ROUTE_LABELS[route]) {
        return ROUTE_LABELS[route];
    }

    const normalized = normalizeRouteSegment(route);
    if (!normalized) {
        return 'HDKALA';
    }

    return normalized
        .split(' ')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function buildFallbackMetadata(route) {
    if (!route || route === DEFAULT_ROUTE) {
        return {
            title: DEFAULT_DOCUMENT_TITLE,
            description: DEFAULT_META_DESCRIPTION
        };
    }

    const label = resolveRouteLabel(route);
    const normalizedLabel = label || 'HDKALA';

    return {
        title: `${normalizedLabel} | HDKALA`,
        description: `مشاهده صفحه ${normalizedLabel} در فروشگاه اینترنتی HDKALA.`
    };
}

// متادیتای مسیرها برای تعیین عنوان صفحه
const ROUTE_META = {
    home: {
        title: DEFAULT_DOCUMENT_TITLE,
        description: DEFAULT_META_DESCRIPTION
    },
    products: {
        title: (params = []) => {
            if (!params[0] || typeof getCategoryName !== 'function') {
                return 'محصولات HDKALA | دسته‌بندی‌ها';
            }
            const categoryName = getCategoryName(params[0]);
            return `محصولات ${categoryName} | HDKALA`;
        },
        description: (params = []) => {
            if (!params[0] || typeof getCategoryName !== 'function') {
                return 'لیست کامل محصولات HDKALA با قابلیت فیلتر و مرتب‌سازی.';
            }
            const categoryName = getCategoryName(params[0]);
            return `محصولات دسته ${categoryName} در فروشگاه HDKALA را با فیلترهای پیشرفته مشاهده کنید.`;
        }
    },
    product: {
        title: (params = []) => {
            const productId = params[0];
            if (!productId || typeof getProductById !== 'function') {
                return 'جزئیات محصول | HDKALA';
            }
            const product = getProductById(productId);
            return product ? `${product.name} | HDKALA` : 'جزئیات محصول | HDKALA';
        },
        description: (params = []) => {
            const productId = params[0];
            if (!productId || typeof getProductById !== 'function') {
                return 'مشاهده مشخصات، تصاویر و اطلاعات فنی محصولات در HDKALA.';
            }
            const product = getProductById(productId);
            return product ? `مشخصات کامل ${product.name} همراه با تصاویر، قیمت و نقد و بررسی در HDKALA.` : 'مشاهده مشخصات، تصاویر و اطلاعات فنی محصولات در HDKALA.';
        }
    },
    wishlist: {
        title: 'علاقه‌مندی‌های من | HDKALA',
        description: 'مدیریت لیست علاقه‌مندی‌ها و دسترسی سریع به محصولات محبوب شما.'
    },
    compare: {
        title: 'مقایسه محصولات | HDKALA',
        description: 'محصولات انتخابی خود را از نظر قیمت، مشخصات و ویژگی‌ها در HDKALA مقایسه کنید.'
    },
    cart: {
        title: 'سبد خرید شما | HDKALA',
        description: 'مشاهده و مدیریت اقلام موجود در سبد خرید پیش از تکمیل سفارش.'
    },
    checkout: {
        title: 'تسویه حساب | HDKALA',
        description: 'تکمیل فرآیند خرید با وارد کردن اطلاعات ارسال و پرداخت مطمئن در HDKALA.'
    },
    login: {
        title: 'ورود یا ثبت‌نام | HDKALA',
        description: 'ورود به حساب کاربری یا ایجاد حساب جدید برای استفاده از امکانات HDKALA.'
    },
    profile: {
        title: 'پروفایل کاربری | HDKALA',
        description: 'ویرایش اطلاعات شخصی و مدیریت حساب کاربری در HDKALA.'
    },
    orders: {
        title: 'سفارش‌های من | HDKALA',
        description: 'پیگیری وضعیت سفارش‌ها و مشاهده تاریخچه خرید شما در HDKALA.'
    },
    'order-success': {
        title: 'ثبت موفق سفارش | HDKALA',
        description: 'جزئیات سفارش ثبت‌شده شما در HDKALA.'
    },
    addresses: {
        title: 'آدرس‌های من | HDKALA',
        description: 'مدیریت و ذخیره آدرس‌های ارسال کالا برای خرید سریع‌تر.'
    },
    about: {
        title: 'درباره HDKALA',
        description: 'آشنایی با داستان، ماموریت و ارزش‌های فروشگاه اینترنتی HDKALA.'
    },
    contact: {
        title: 'تماس با HDKALA',
        description: 'راه‌های ارتباط با تیم پشتیبانی HDKALA و ارسال پیام برای ما.'
    },
    blog: {
        title: (params = []) => {
            const blogId = params[0];
            if (!blogId || !Array.isArray(blogs)) {
                return 'مجله HDKALA';
            }
            const blog = blogs.find(item => item.id === blogId);
            return blog ? `${blog.title} | مجله HDKALA` : 'مجله HDKALA';
        },
        description: (params = []) => {
            const blogId = params[0];
            if (!blogId || !Array.isArray(blogs)) {
                return 'جدیدترین مقالات، راهنماها و اخبار فناوری را در مجله HDKALA مطالعه کنید.';
            }
            const blog = blogs.find(item => item.id === blogId);
            return blog ? `مطالعه مقاله «${blog.title}» در مجله تخصصی HDKALA.` : 'جدیدترین مقالات، راهنماها و اخبار فناوری را در مجله HDKALA مطالعه کنید.';
        }
    },
    search: {
        title: (params = []) => {
            const query = (params[0] || '').trim();
            return query ? `نتایج جستجو برای "${query}" | HDKALA` : 'جستجوی محصولات | HDKALA';
        },
        description: (params = []) => {
            const query = (params[0] || '').trim();
            return query ? `نتایج مرتبط با "${query}" را در میان محصولات HDKALA مشاهده کنید.` : 'جستجوی سریع محصولات و برندها در فروشگاه HDKALA.';
        }
    },
    shipping: {
        title: 'ارسال و بازگشت کالا | HDKALA',
        description: 'اطلاعات کامل درباره روش‌های ارسال، مدت زمان تحویل و سیاست بازگشت کالا در HDKALA.'
    },
    terms: {
        title: 'قوانین و مقررات | HDKALA',
        description: 'شرایط و ضوابط استفاده از خدمات و خرید از فروشگاه اینترنتی HDKALA.'
    },
    privacy: {
        title: 'حریم خصوصی | HDKALA',
        description: 'اطلاع از نحوه جمع‌آوری و نگهداری اطلاعات شخصی کاربران در HDKALA.'
    },
    faq: {
        title: 'سوالات متداول | HDKALA',
        description: 'پاسخ به رایج‌ترین سوالات کاربران درباره سفارش، ارسال و خدمات HDKALA.'
    },
    admin: {
        title: 'مدیریت فروشگاه | HDKALA',
        description: 'دسترسی به ابزارهای مدیریتی برای کنترل محصولات، کاربران و محتوا در HDKALA.'
    },
    'not-found': {
        title: 'صفحه مورد نظر یافت نشد | HDKALA',
        description: 'متاسفانه صفحه‌ای که به دنبال آن هستید در HDKALA پیدا نشد. از سایر بخش‌های سایت بازدید کنید.'
    }
};

// تابعی برای بروزرسانی متادیتای صفحه با توجه به مسیر فعال
function updateDocumentMetadata(route, params = []) {
    const meta = ROUTE_META[route];
    const fallback = buildFallbackMetadata(route);
    let resolvedTitle = fallback.title || DEFAULT_DOCUMENT_TITLE;
    let resolvedDescription = fallback.description || DEFAULT_META_DESCRIPTION;

    if (meta && meta.title) {
        if (typeof meta.title === 'function') {
            const titleValue = meta.title(params);
            if (titleValue && typeof titleValue === 'string') {
                resolvedTitle = titleValue;
            }
        } else if (typeof meta.title === 'string' && meta.title.trim()) {
            resolvedTitle = meta.title;
        }
    }

    if (meta && meta.description) {
        if (typeof meta.description === 'function') {
            const descriptionValue = meta.description(params);
            if (descriptionValue && typeof descriptionValue === 'string') {
                resolvedDescription = descriptionValue;
            }
        } else if (typeof meta.description === 'string' && meta.description.trim()) {
            resolvedDescription = meta.description;
        }
    }

    document.title = resolvedTitle || DEFAULT_DOCUMENT_TITLE;
    if (metaDescriptionTag) {
        metaDescriptionTag.setAttribute('content', resolvedDescription || DEFAULT_META_DESCRIPTION);
    }
}

function parseHash(hash) {
    const normalized = (hash || '').replace(/^#/, '').trim();
    if (!normalized) {
        return { route: DEFAULT_ROUTE, params: [] };
    }

    const segments = normalized
        .split(':')
        .map(segment => {
            const trimmed = segment.trim();
            if (!trimmed) {
                return '';
            }
            try {
                return decodeURIComponent(trimmed.replace(/\+/g, ' '));
            } catch (error) {
                return trimmed.replace(/\+/g, ' ');
            }
        })
        .filter(Boolean);

    const [route = DEFAULT_ROUTE, ...params] = segments;
    return { route, params };
}

function updateRouteState(route, params) {
    currentPage = route;
    currentProductId = route === 'product' ? (params[0] || null) : null;
    currentCategory = route === 'products' ? (params[0] || null) : null;
}

function navigate(hash){
    const { route, params } = parseHash(hash);
    const handler = ROUTE_HANDLERS[route];

    if (!handler) {
        if (route !== 'not-found') {
            location.hash = '#not-found';
        }
        return;
    }

    if (route === 'product' && params.length === 0) {
        location.hash = '#products';
        return;
    }

    currentRouteParams = params;
    updateRouteState(route, params);

    renderPage();
}

window.addEventListener('hashchange', () => navigate(location.hash.slice(1)));
window.addEventListener('load', () => navigate(location.hash.slice(1) || 'home'));

function renderPageSkeleton() {
    if (!contentRoot) return;
    contentRoot.setAttribute('aria-busy', 'true');
    const skeletonCards = Array.from({ length: 6 }, () => '<div class="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>').join('');
    contentRoot.innerHTML = `
        <div class="space-y-6 animate-pulse" role="status" aria-live="polite">
            <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                <div class="space-y-4">
                    <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3"></div>
                    <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"></div>
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                ${skeletonCards}
            </div>
        </div>
    `;
}

function renderPage(){
    if (!contentRoot) return;

    renderPageSkeleton();

    const handler = ROUTE_HANDLERS[currentPage] || ROUTE_HANDLERS[DEFAULT_ROUTE];
    const context = {
        route: currentPage,
        params: currentRouteParams.slice()
    };

    clearTimeout(pageRenderTimeout);
    pageRenderTimeout = setTimeout(() => {
        if (!contentRoot) return;
        let renderError = null;

        try {
            contentRoot.innerHTML = '';
            handler(context);
        } catch (error) {
            renderError = error;
            console.error('HDKALA render error:', error);
            contentRoot.innerHTML = createEmptyState({
                icon: 'mdi:alert-circle-outline',
                title: 'خطا در بارگذاری صفحه',
                description: 'در بارگذاری این صفحه مشکلی پیش آمد. لطفاً دوباره تلاش کنید یا به صفحه دیگری بروید.'
            });
        } finally {
            contentRoot.removeAttribute('aria-busy');

            if (typeof setActiveNavigation === 'function') {
                setActiveNavigation(currentPage);
            }

            updateDocumentMetadata(currentPage, currentRouteParams);

            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
            if (userDropdown) {
                userDropdown.classList.remove('open');
            }

            window.scrollTo(0, 0);
        }

        return renderError;
    }, 250);
}

/* ---------- Home Page ---------- */
function renderHomePage(){
    const page = document.createElement('div');
    page.innerHTML = createSmallHero();
    
    page.innerHTML += `
        <!-- Featured Categories -->
        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 text-center">دسته‌بندی‌های محبوب</h2>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <a href="#products:electronics" class="bg-white dark:bg-gray-800 p-4 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow border border-primary/20">
                    <iconify-icon icon="mdi:laptop" width="40" class="text-primary mb-2"></iconify-icon>
                    <div class="font-medium">الکترونیک</div>
                </a>
                <a href="#products:fashion" class="bg-white dark:bg-gray-800 p-4 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow border border-primary/20">
                    <iconify-icon icon="mdi:tshirt-crew" width="40" class="text-primary mb-2"></iconify-icon>
                    <div class="font-medium">مد و پوشاک</div>
                </a>
                <a href="#products:home" class="bg-white dark:bg-gray-800 p-4 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow border border-primary/20">
                    <iconify-icon icon="mdi:sofa" width="40" class="text-primary mb-2"></iconify-icon>
                    <div class="font-medium">خانه و آشپزخانه</div>
                </a>
                <a href="#products:books" class="bg-white dark:bg-gray-800 p-4 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow border border-primary/20">
                    <iconify-icon icon="mdi:book-open" width="40" class="text-primary mb-2"></iconify-icon>
                    <div class="font-medium">کتاب</div>
                </a>
                <a href="#products:sports" class="bg-white dark:bg-gray-800 p-4 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow border border-primary/20">
                    <iconify-icon icon="mdi:dumbbell" width="40" class="text-primary mb-2"></iconify-icon>
                    <div class="font-medium">ورزشی</div>
                </a>
            </div>
        </section>
        
        <!-- Featured Products -->
        <section class="mb-12">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">محصولات ویژه</h2>
                <a href="#products" class="text-primary hover:text-primary/80 transition-colors">مشاهده همه</a>
            </div>
            <div id="featuredProducts" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"></div>
        </section>
        
        <!-- Recent Blogs -->
        <section class="mb-12">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">آخرین مقالات</h2>
                <a href="#blog" class="text-primary hover:text-primary/80 transition-colors">مشاهده همه</a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                ${blogs.slice(0, 3).map(blog => `
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-primary/20">
                        <div class="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            ${blog.image ? 
                                `<img src="${blog.image}" alt="${blog.title}" class="w-full h-48 object-cover" />` :
                                `<iconify-icon icon="mdi:image-off" width="48" class="text-gray-400"></iconify-icon>`
                            }
                        </div>
                        <div class="p-4">
                            <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">${blog.category}</span>
                            <h3 class="font-bold text-lg mt-2 mb-2">${blog.title}</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">${blog.excerpt}</p>
                            <div class="flex justify-between items-center text-xs text-gray-500">
                                <span>${blog.date}</span>
                                <a href="#blog:${blog.id}" class="text-primary hover:text-primary/80">ادامه مطلب</a>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
        
        <!-- Stats Section -->
        <section class="bg-primary/10 rounded-2xl p-8 mb-12">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                    <div class="text-3xl font-bold text-primary">${products.length}+</div>
                    <div class="text-gray-600 dark:text-gray-400">محصول</div>
                </div>
                <div>
                    <div class="text-3xl font-bold text-primary">${orders.length}+</div>
                    <div class="text-gray-600 dark:text-gray-400">سفارش موفق</div>
                </div>
                <div>
                    <div class="text-3xl font-bold text-primary">${user ? '۱' : '۰'}+</div>
                    <div class="text-gray-600 dark:text-gray-400">کاربر فعال</div>
                </div>
                <div>
                    <div class="text-3xl font-bold text-primary">۲۴/۷</div>
                    <div class="text-gray-600 dark:text-gray-400">پشتیبانی</div>
                </div>
            </div>
        </section>
    `;
    
    contentRoot.appendChild(page);
    const featuredProducts = $('#featuredProducts', page);
    const quickAddDemo = $('#quickAddDemo', page);
    
    // Show featured products (products with discount or special status)
    const featured = products.filter(p => p.discount > 0 || p.status === 'hot' || p.status === 'new').slice(0, 8);
    renderProductsList(featured, featuredProducts);
    featuredProducts.addEventListener('click', handleProductActions);
    quickAddDemo.addEventListener('click', quickAddDemoProduct);
}

/* ---------- Products Page ---------- */
function renderProductsPage(){
    const page = document.createElement('div');
    const categoryName = currentCategory ? getCategoryName(currentCategory) : null;
    page.innerHTML = `
        <nav class="mb-6" aria-label="مسیر راهنما">
            <ol class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#home" class="hover:text-primary transition-colors">خانه</a></li>
                <li aria-hidden="true"><iconify-icon icon="mdi:chevron-left" width="16"></iconify-icon></li>
                <li><a href="#products" class="hover:text-primary transition-colors">محصولات</a></li>
                ${categoryName ? `
                    <li aria-hidden="true"><iconify-icon icon="mdi:chevron-left" width="16"></iconify-icon></li>
                    <li><span class="text-primary">${categoryName}</span></li>
                ` : ''}
            </ol>
        </nav>

        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">${categoryName || 'همه محصولات'}</h1>
            <div class="flex items-center gap-4">
                <span class="text-sm text-gray-600 dark:text-gray-400" id="productsCount">${products.length} محصول</span>
                <button id="toggleView" class="p-2 text-gray-500 hover:text-primary transition-colors" aria-label="تغییر نمای محصولات">
                    <iconify-icon icon="mdi:view-grid" width="20"></iconify-icon>
                </button>
            </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-primary/20">
            <div class="flex flex-wrap gap-4 items-center">
                <span class="font-medium">فیلترهای فعال:</span>
                <div id="activeFilters" class="flex flex-wrap gap-2">
                    <!-- Active filters will be shown here -->
                </div>
                <button id="clearAllFilters" class="text-sm text-red-500 hover:text-red-700 transition-colors">پاک کردن همه فیلترها</button>
            </div>
        </div>
        
        <div id="productsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite"></div>
        
        <!-- Pagination -->
        <div class="flex justify-center mt-8">
            <div class="flex gap-2">
                <button class="px-3 py-2 border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">قبلی</button>
                <button class="px-3 py-2 bg-primary text-white rounded-lg">1</button>
                <button class="px-3 py-2 border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">2</button>
                <button class="px-3 py-2 border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">3</button>
                <button class="px-3 py-2 border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">بعدی</button>
            </div>
        </div>
    `;
    
    contentRoot.appendChild(page);
    const productsGrid = $('#productsGrid', page);
    const productsCount = $('#productsCount', page);
    const clearAllFilters = $('#clearAllFilters', page);
    
    // فیلتر کردن محصولات بر اساس دسته‌بندی
    let filteredProducts = products;
    if (currentCategory) {
        filteredProducts = products.filter(p => p.category === currentCategory);
    }
    
    // Render filtered products
    renderProductsList(filteredProducts, productsGrid);
    productsCount.textContent = `${filteredProducts.length} محصول`;
    productsGrid.addEventListener('click', handleProductActions);
    
    // Clear all filters
    clearAllFilters.addEventListener('click', () => {
        if (sortSelect) sortSelect.value = 'popular';
        if (minPrice) minPrice.value = '';
        if (maxPrice) maxPrice.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (discountFilter) discountFilter.value = '';
        if (brandFilter) brandFilter.value = '';
        if (stockFilter) stockFilter.value = '';
        if (ratingFilter) ratingFilter.value = '';
        
        applyFilters();
    });
}

function renderSearchPage(params = []){
    const page = document.createElement('div');
    const rawQuery = Array.isArray(params) ? (params[0] || '') : '';
    const query = rawQuery.trim();
    const hasQuery = query.length > 0;
    const escapeHtml = (value) => value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    const safeQuery = hasQuery ? escapeHtml(query) : '';
    const heading = hasQuery ? `نتایج جستجو برای "${safeQuery}"` : 'جستجوی محصولات';

    page.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold mb-2">${heading}</h1>
                <p id="searchResultsSummary" class="text-gray-600 dark:text-gray-400"></p>
            </div>
            <div class="flex gap-2">
                <button id="searchBackToProducts" class="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors">مشاهده همه محصولات</button>
                <button id="searchClear" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">پاک کردن جستجو</button>
            </div>
        </div>
        <div id="searchResultsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite"></div>
    `;

    contentRoot.appendChild(page);

    const resultsGrid = $('#searchResultsGrid', page);
    const summary = $('#searchResultsSummary', page);
    const backBtn = $('#searchBackToProducts', page);
    const clearBtn = $('#searchClear', page);

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            location.hash = '#products';
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
            }
            location.hash = '#search';
        });
    }

    if (searchInput) {
        searchInput.value = query;
    }

    if (!hasQuery) {
        if (summary) {
            summary.textContent = 'برای شروع جستجو، عبارت مورد نظر خود را در نوار جستجو وارد کنید.';
        }
        if (resultsGrid) {
            resultsGrid.innerHTML = `
                <div class="col-span-full">
                    ${createEmptyState({
                        icon: 'mdi:magnify',
                        title: 'جستجوی خود را آغاز کنید',
                        description: 'برای مشاهده نتایج، ابتدا عبارت مورد نظر خود را جستجو کنید.',
                        actions: '<a href="#products" class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors"><iconify-icon icon="mdi:shopping-outline" width="18"></iconify-icon><span>مشاهده محصولات</span></a>'
                    })}
                </div>
            `;
        }
        return;
    }

    let results = [];
    if (typeof searchProducts === 'function') {
        results = searchProducts(products, query);
    } else {
        const searchTerm = query.toLowerCase();
        results = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.desc.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm)
        );
    }

    if (results.length === 0) {
        if (summary) {
            summary.textContent = `نتیجه‌ای برای "${query}" یافت نشد.`;
        }
        if (resultsGrid) {
            resultsGrid.innerHTML = `
                <div class="col-span-full">
                    ${createEmptyState({
                        icon: 'mdi:emoticon-sad-outline',
                        title: `نتیجه‌ای برای "${safeQuery}" یافت نشد`,
                        description: 'محصولی مطابق با جستجوی شما پیدا نشد. از کلمات کلیدی عمومی‌تر استفاده کنید یا فیلترها را تغییر دهید.',
                        actions: '<a href="#products" class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"><iconify-icon icon="mdi:arrow-right-bold-circle" width="18"></iconify-icon><span>بازگشت به محصولات</span></a>'
                    })}
                </div>
            `;
        }
        return;
    }

    if (summary) {
        summary.textContent = `${results.length} نتیجه برای "${query}" پیدا شد.`;
    }
    if (resultsGrid) {
        renderProductsList(results, resultsGrid);
        resultsGrid.addEventListener('click', handleProductActions);
    }
}

/* ---------- New Pages ---------- */
function renderAddressesPage() {
    if (!user) {
        notify('لطفا ابتدا وارد حساب کاربری خود شوید', 'warning');
        location.hash = 'login';
        return;
    }
    
    const page = document.createElement('div');
    page.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">آدرس‌های من</h1>
            <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors" id="addAddressBtn">
                افزودن آدرس جدید
            </button>
        </div>
        
        <div id="addressesList" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${addresses.length === 0 ? `
                <div class="col-span-full text-center py-12">
                    <iconify-icon icon="mdi:map-marker-off" width="64" class="text-gray-400 mb-4"></iconify-icon>
                    <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">هنوز آدرسی ثبت نکرده‌اید</p>
                </div>
            ` : addresses.map(address => createAddressCard(address, address.isDefault)).join('')}
        </div>
        
        <div id="addressFormContainer" class="hidden"></div>
    `;
    
    contentRoot.appendChild(page);
    
    // Event listeners for addresses
    $('#addAddressBtn').addEventListener('click', () => {
        showAddressForm();
    });
    
    setupAddressEvents();
}

function renderAdminPage() {
    const adminFeatures = [
        {
            title: 'مدیریت پروفایل کاربران',
            points: [
                'ساخت، ویرایش و غیرفعال‌سازی حساب‌های مدیران',
                'تعیین نقش‌ها و سطح دسترسی هر کاربر',
                'ردیابی فعالیت‌های حساس برای هر پروفایل'
            ]
        },
        {
            title: 'مدیریت محتوا',
            points: [
                'ایجاد، ویرایش و انتشار مطالب و صفحات',
                'برنامه‌ریزی انتشار و پیش‌نمایش محتوا',
                'برچسب‌گذاری و دسته‌بندی برای مدیریت بهتر'
            ]
        },
        {
            title: 'امنیت و مجوزها',
            points: [
                'پیاده‌سازی احراز هویت چندمرحله‌ای و یادآوری رمز',
                'کنترل دقیق سطح دسترسی با ACL',
                'مدیریت سشن‌ها و گزارش رخدادهای امنیتی'
            ]
        },
        {
            title: 'حسابرسی',
            points: [
                'ثبت کامل زمان، نوع فعالیت و کاربر',
                'تهیه گزارش از فعالیت‌های حساس یا ناهنجاری‌ها',
                'جست‌وجو و فیلتر سریع رویدادهای ثبت‌شده'
            ]
        },
        {
            title: 'تعامل و ارتباط با کاربران',
            points: [
                'سیستم پیام‌رسانی یا تیکتینگ برای پشتیبانی',
                'ارسال اعلان‌ها و خبرنامه‌های هدفمند',
                'اتصال به API برای ارتباط از طریق سرویس‌های خارجی'
            ]
        },
        {
            title: 'میزان بازدید و کاربران فعال',
            points: [
                'داشبورد آمار بازدید و کاربران فعال',
                'نمودارهای لحظه‌ای و مقایسه‌ای',
                'امکان خروجی گرفتن از داده‌ها برای تحلیل'
            ]
        },
        {
            title: 'تبلیغات و کمپین‌ها',
            points: [
                'مدیریت کمپین‌های تبلیغاتی و زمان‌بندی نمایش',
                'نمایش عملکرد کمپین‌ها و نرخ تبدیل',
                'تقسیم‌بندی مخاطبان برای تبلیغات هدفمند'
            ]
        },
        {
            title: 'نظرات و شکایات',
            points: [
                'مدیریت دیدگاه‌ها و پاسخ‌دهی سریع',
                'پیگیری وضعیت شکایات تا حل نهایی',
                'گزارش‌گیری از میزان رضایت کاربران'
            ]
        }
    ];

    const featuresHTML = adminFeatures.map(feature => `
        <div class="bg-white/60 dark:bg-gray-900/60 border border-primary/10 rounded-2xl p-5 backdrop-blur">
            <h4 class="text-lg font-semibold text-primary mb-3">${feature.title}</h4>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed list-disc list-inside">
                ${feature.points.map(point => `<li>${point}</li>`).join('')}
            </ul>
        </div>
    `).join('');

    const page = document.createElement('div');
    page.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
            <h1 class="text-2xl font-bold mb-6">پنل مدیریت</h1>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-primary/10 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-primary">${products.length}</div>
                    <div class="text-gray-600 dark:text-gray-400">تعداد محصولات</div>
                </div>
                <div class="bg-green-500/10 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-green-500">${orders.length}</div>
                    <div class="text-gray-600 dark:text-gray-400">سفارشات</div>
                </div>
                <div class="bg-blue-500/10 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-blue-500">${user ? 1 : 0}</div>
                    <div class="text-gray-600 dark:text-gray-400">کاربران</div>
                </div>
                <div class="bg-purple-500/10 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-purple-500">${blogs.length}</div>
                    <div class="text-gray-600 dark:text-gray-400">مقالات</div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 class="text-lg font-semibold mb-4">مدیریت محصولات</h3>
                    <button class="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors mb-4" onclick="openAdminPanel()">
                        مدیریت محصولات
                    </button>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-4">مدیریت بلاگ</h3>
                    ${createBlogManagement()}
                </div>
            </div>

            <div class="mt-10">
                <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">قابلیت‌های کلیدی پنل ادمین</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    تمامی امکانات موردنیاز برای مدیریت حرفه‌ای فروشگاه در یک پنل گردآوری شده‌اند تا تیم شما بتواند کاربران، محتوا، امنیت و ارتباطات را با بیشترین کارایی کنترل کند.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    ${featuresHTML}
                </div>
            </div>
        </div>
    `;

    contentRoot.appendChild(page);
    setupBlogManagement();
}

function renderShippingPage() {
    const page = document.createElement('div');
    page.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-primary/20 space-y-8">
            <div>
                <h1 class="text-3xl font-bold text-primary mb-4">ارسال و بازگشت کالا</h1>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">در HDKALA تلاش می‌کنیم سفارش شما را در کوتاه‌ترین زمان ممکن و با بهترین کیفیت بسته‌بندی به دستتان برسانیم.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-6 border border-primary/20 rounded-xl bg-primary/5">
                    <h2 class="text-xl font-bold mb-3">روش‌های ارسال</h2>
                    <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                        <li>ارسال استاندارد (۲ تا ۴ روز کاری) برای تمام استان‌ها</li>
                        <li>ارسال اکسپرس (روز بعد) ویژه شهرهای تهران و کرج</li>
                        <li>تحویل حضوری در مراکز منتخب HDKALA</li>
                    </ul>
                </div>
                <div class="p-6 border border-primary/20 rounded-xl bg-green-500/5">
                    <h2 class="text-xl font-bold mb-3">هزینه ارسال</h2>
                    <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                        <li>ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان</li>
                        <li>محاسبه خودکار هزینه ارسال بر اساس مقصد و وزن سفارش</li>
                        <li>امکان پیگیری لحظه‌ای بسته با کد رهگیری</li>
                    </ul>
                </div>
            </div>
            <div class="p-6 border border-dashed border-primary/30 rounded-xl">
                <h2 class="text-xl font-bold mb-3">سیاست بازگشت کالا</h2>
                <p class="text-gray-600 dark:text-gray-300 mb-3">اگر از خرید خود رضایت ندارید، تا ۷ روز فرصت دارید کالا را مطابق شرایط زیر بازگردانید:</p>
                <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>عدم استفاده از کالا و سالم بودن بسته‌بندی</li>
                    <li>ارائه فاکتور یا کد سفارش هنگام مرجوعی</li>
                    <li>استرداد وجه پس از بررسی کیفیت کالا ظرف ۴۸ ساعت</li>
                </ul>
            </div>
        </div>
    `;

    contentRoot.appendChild(page);
}

function renderTermsPage() {
    const page = document.createElement('div');
    page.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-primary/20 space-y-6">
            <h1 class="text-3xl font-bold text-primary">قوانین و مقررات</h1>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">مطالعه دقیق قوانین به شما کمک می‌کند تا تجربه خریدی مطمئن‌تر در HDKALA داشته باشید.</p>
            <section>
                <h2 class="text-xl font-semibold mb-3">شرایط استفاده از خدمات</h2>
                <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>کاربران متعهد می‌شوند اطلاعات صحیح و کامل در اختیار HDKALA قرار دهند.</li>
                    <li>استفاده از محتوای سایت تنها با ذکر منبع مجاز است.</li>
                    <li>هرگونه سوءاستفاده از خدمات HDKALA موجب مسدود شدن حساب کاربری خواهد شد.</li>
                </ul>
            </section>
            <section>
                <h2 class="text-xl font-semibold mb-3">شرایط فروش و ارسال</h2>
                <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>قیمت‌های درج شده شامل مالیات بر ارزش افزوده می‌شوند.</li>
                    <li>ارسال سفارش‌ها مطابق زمان‌بندی اعلام شده صورت می‌گیرد.</li>
                    <li>در صورت تاخیر غیرمتعارف، تیم پشتیبانی با مشتری تماس خواهد گرفت.</li>
                </ul>
            </section>
        </div>
    `;

    contentRoot.appendChild(page);
}

function renderPrivacyPage() {
    const page = document.createElement('div');
    page.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-primary/20 space-y-6">
            <h1 class="text-3xl font-bold text-primary">سیاست حفظ حریم خصوصی</h1>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">حفظ اطلاعات شخصی کاربران برای HDKALA در اولویت است و مطابق استانداردهای امنیتی نگهداری می‌شود.</p>
            <section>
                <h2 class="text-xl font-semibold mb-3">اطلاعات جمع‌آوری شده</h2>
                <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>اطلاعات حساب کاربری شامل نام، شماره تماس و آدرس‌های ثبت شده</li>
                    <li>سوابق سفارش‌ها و تراکنش‌های مالی برای بهبود خدمات</li>
                    <li>داده‌های تحلیلی ناشناس برای بهینه‌سازی تجربه کاربری</li>
                </ul>
            </section>
            <section>
                <h2 class="text-xl font-semibold mb-3">نحوه استفاده از اطلاعات</h2>
                <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>ارسال اطلاع‌رسانی‌ها، فاکتورها و وضعیت سفارش‌ها</li>
                    <li>پیشنهادات شخصی‌سازی شده بر اساس علایق کاربر</li>
                    <li>رعایت الزامات قانونی و پاسخگویی به مراجع ذی‌صلاح</li>
                </ul>
            </section>
        </div>
    `;

    contentRoot.appendChild(page);
}

function renderFaqPage() {
    const faqItems = [
        {
            question: 'چگونه می‌توانم سفارش خود را پیگیری کنم؟',
            answer: 'پس از ورود به حساب کاربری، از بخش «سفارش‌های من» می‌توانید وضعیت لحظه‌ای سفارش را مشاهده کنید.'
        },
        {
            question: 'آیا امکان لغو سفارش وجود دارد؟',
            answer: 'تا پیش از ارسال، می‌توانید با تیم پشتیبانی تماس گرفته و درخواست لغو سفارش دهید.'
        },
        {
            question: 'روش‌های پرداخت در HDKALA چیست؟',
            answer: 'پرداخت آنلاین از طریق درگاه بانکی امن و همچنین پرداخت در محل برای برخی شهرها فعال است.'
        },
        {
            question: 'در صورت دریافت کالای معیوب چه باید کرد؟',
            answer: 'تا ۲۴ ساعت پس از دریافت کالا با پشتیبانی تماس بگیرید تا فرآیند تعویض یا بازگشت آغاز شود.'
        }
    ];

    const page = document.createElement('div');
    page.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-primary/20">
            <h1 class="text-3xl font-bold text-primary mb-6">سوالات متداول</h1>
            <div class="space-y-4">
                ${faqItems.map(item => `
                    <div class="border border-primary/20 rounded-xl p-5 bg-primary/5">
                        <h2 class="text-lg font-semibold mb-2">${item.question}</h2>
                        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">${item.answer}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    contentRoot.appendChild(page);
}

function renderNotFoundPage() {
    const page = document.createElement('div');
    page.innerHTML = `
        <div class="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-500/30 rounded-2xl p-10 text-center">
            <iconify-icon icon="mdi:alert-circle-outline" width="64" class="text-red-500 mb-4"></iconify-icon>
            <h1 class="text-3xl font-bold mb-3">صفحه مورد نظر یافت نشد</h1>
            <p class="text-gray-600 dark:text-gray-300 mb-6">آدرس وارد شده معتبر نیست یا صفحه جابجا شده است. می‌توانید از لینک‌های زیر برای ادامه استفاده کنید.</p>
            <div class="flex flex-wrap justify-center gap-3">
                <a href="#home" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">بازگشت به صفحه اصلی</a>
                <a href="#products" class="px-4 py-2 border border-primary/30 rounded-lg text-primary hover:bg-primary/10 transition-colors">مشاهده محصولات</a>
            </div>
        </div>
    `;

    contentRoot.appendChild(page);
}

/* ---------- Render products ---------- */
function renderProducts(list) {
    const productsGrid = $('#productsGrid');
    const productsCount = $('#productsCount');
    
    if (productsGrid && productsCount) {
        renderProductsList(list, productsGrid);
        productsCount.textContent = `${list.length} محصول`;
        productsGrid.addEventListener('click', handleProductActions);
    }
}

// اضافه کردن route جدید به navigation
function setupAdminNavigation() {
    // اضافه کردن لینک ادمین به navigation (فقط برای توسعه)
    const adminLink = document.createElement('a');
    adminLink.href = '#admin';
    adminLink.className = 'text-gray-700 dark:text-gray-300 hover:text-primary transition-colors';
    adminLink.textContent = 'پنل مدیریت';
    adminLink.style.marginRight = 'auto';
    
    const nav = $('nav .hidden.md\\:flex');
    if (nav) {
        nav.insertBefore(adminLink, nav.firstChild);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupAdminNavigation();
});

// ---- admin.js ----
/* ---------- Admin Panel Functions ---------- */
let pendingProductImage = '';

function openAdminPanel() {
    adminModal.classList.remove('hidden');
    renderAdminProducts();
    setupAdminInputHandlers();
}

function closeAdminPanel() {
    adminModal.classList.add('hidden');
    productForm.classList.add('hidden');
    editingProductId = null;
    pendingProductImage = '';
    $('#imagePreview').innerHTML = '';
}

function renderAdminProducts() {
    adminProductsList.innerHTML = '';
    let filteredProducts = products;
    const searchTerm = adminSearch.value.toLowerCase().trim();
    if (searchTerm) {
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filteredProducts.length === 0) {
        adminProductsList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <iconify-icon icon="mdi:package-variant-remove" width="48" class="mb-4"></iconify-icon>
                <p>محصولی یافت نشد</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const finalPrice = product.discount > 0 ? 
            product.price * (1 - product.discount / 100) : product.price;
        const productEl = document.createElement('div');
        productEl.className = 'bg-white dark:bg-gray-700 p-4 rounded-lg border border-primary/20';
        productEl.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 flex-1">
                    <div class="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        ${product.img ? 
                            `<img src="${product.img}" alt="${product.name}" class="w-16 h-16 object-cover rounded-lg">` :
                            `<iconify-icon icon="mdi:image-off" width="24" class="text-gray-400"></iconify-icon>`
                        }
                    </div>
                    <div class="flex-1">
                        <h4 class="font-semibold text-primary">${product.name}</h4>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                            <div class="flex flex-wrap gap-4">
                                <span>قیمت: ${formatPrice(product.price)}</span>
                                ${product.discount > 0 ? `
                                    <span>تخفیف: ${product.discount}% → ${formatPrice(finalPrice)}</span>
                                ` : ''}
                                <span>موجودی: ${product.stock}</span>
                                <span>دسته: ${getCategoryName(product.category)}</span>
                                ${product.brand ? `<span>برند: ${product.brand}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="edit-product bg-primary/20 text-primary px-3 py-1 rounded-lg hover:bg-primary/30 transition-colors" data-id="${product.id}">
                        ویرایش
                    </button>
                    <button class="delete-product bg-red-500/20 text-red-500 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-colors" data-id="${product.id}">
                        حذف
                    </button>
                </div>
            </div>
        `;
        adminProductsList.appendChild(productEl);
    });
    
    // Add event listeners for edit and delete buttons
    $$('.edit-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            editProduct(productId);
        });
    });
    
    $$('.delete-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            deleteProduct(productId);
        });
    });
    
    // Update stats
    updateAdminStats();
}

function updateAdminStats() {
    adminProductCount.textContent = products.length;
    adminInStockCount.textContent = products.filter(p => p.stock > 0).length;
    adminDiscountCount.textContent = products.filter(p => p.discount > 0).length;
    adminOrderCount.textContent = orders.length;
}

function showProductForm() {
    productForm.classList.remove('hidden');
    formTitle.textContent = editingProductId ? 'ویرایش محصول' : 'افزودن محصول جدید';
    
    if (editingProductId) {
        const product = getProductById(editingProductId);
        pendingProductImage = product?.img || '';
        $('#productName').value = product.name;
        $('#productPrice').value = product.price;
        $('#productDesc').value = product.desc;
        $('#productCategory').value = product.category;
        $('#productBrand').value = product.brand || '';
        $('#productDiscount').value = product.discount;
        $('#productStock').value = product.stock;
        $('#productStatus').value = product.status || '';
        $('#productRating').value = product.rating;
        
        // Set image preview if exists
        if (product.img) {
            $('#imagePreview').innerHTML = `
                <img src="${product.img}" alt="Preview" class="w-32 h-32 object-cover rounded-lg">
            `;
        }
    } else {
        pendingProductImage = '';
        // Reset form for new product
        $('#productName').value = '';
        $('#productPrice').value = '';
        $('#productDesc').value = '';
        $('#productCategory').value = 'electronics';
        $('#productBrand').value = '';
        $('#productDiscount').value = '0';
        $('#productStock').value = '0';
        $('#productStatus').value = '';
        $('#productRating').value = '5';
        $('#imagePreview').innerHTML = '';
    }
}

function setupAdminInputHandlers() {
    // Auto-clear zero values
    $$('#productForm input[type="number"]').forEach(input => {
        input.addEventListener('focus', function() {
            if (this.value === '0' || this.value === '00') {
                this.value = '';
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.value = '0';
            }
        });
    });
    
    // Image upload handler
    $('#productImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                pendingProductImage = e.target.result;
                $('#imagePreview').innerHTML = `
                    <img src="${pendingProductImage}" alt="Preview" class="w-32 h-32 object-cover rounded-lg">
                `;
            };
            reader.readAsDataURL(file);
        }
    });
}

function editProduct(productId) {
    editingProductId = productId;
    showProductForm();
}

function deleteProduct(productId) {
    if (confirm('آیا از حذف این محصول مطمئن هستید؟')) {
        products = products.filter(p => p.id !== productId);
        LS.set('HDK_products', products);
        renderAdminProducts();
        notify('محصول با موفقیت حذف شد', 'success');
        // Update main products view if on products page
        if (currentPage === 'home' || currentPage === 'products') {
            renderProducts(products);
            updateBrandFilter();
        }
    }
}

function saveProduct() {
    const name = $('#productName').value.trim();
    const price = parseInt($('#productPrice').value) || 0;
    const desc = $('#productDesc').value.trim();
    const category = $('#productCategory').value;
    const brand = $('#productBrand').value.trim();
    const discount = parseInt($('#productDiscount').value) || 0;
    const stock = parseInt($('#productStock').value) || 0;
    const status = $('#productStatus').value;
    const rating = parseInt($('#productRating').value) || 5;
    
    if (!name || !price) {
        notify('لطفا نام و قیمت محصول را وارد کنید', 'error');
        return;
    }
    
    if (discount < 0 || discount > 100) {
        notify('تخفیف باید بین 0 تا 100 باشد', 'error');
        return;
    }
    
    if (stock < 0) {
        notify('موجودی نمی‌تواند منفی باشد', 'error');
        return;
    }
    
    // Get image data
    const imagePreview = $('#imagePreview img');
    const img = pendingProductImage || (imagePreview ? imagePreview.src : '');
    
    const wasEditing = Boolean(editingProductId);

    if (editingProductId) {
        // Update existing product
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                price,
                desc,
                category,
                brand,
                discount,
                stock,
                status,
                rating,
                img: img || products[index].img
            };
        }
    } else {
        // Add new product
        const newProduct = {
            id: uid('p'),
            name,
            price,
            desc,
            img: img,
            rating,
            discount,
            category,
            status,
            stock,
            brand,
            features: [],
            colors: [],
            specifications: {},
            created: new Date().toISOString()
        };
        products.push(newProduct);
    }

    LS.set('HDK_products', products);
    renderAdminProducts();
    productForm.classList.add('hidden');
    editingProductId = null;
    pendingProductImage = '';
    $('#imagePreview').innerHTML = '';
    notify(wasEditing ? 'محصول با موفقیت ویرایش شد' : 'محصول جدید با موفقیت اضافه شد', 'success');
    
    // Update main products view if on products page
    if (currentPage === 'home' || currentPage === 'products') {
        renderProducts(products);
        updateBrandFilter();
    }
}

/* ---------- Blog Management ---------- */
function setupBlogManagement() {
    $('#addBlogBtn').addEventListener('click', showBlogForm);
    
    // Edit blog handlers
    $$('.edit-blog').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const blogId = e.target.getAttribute('data-id');
            editBlog(blogId);
        });
    });
    
    // Delete blog handlers
    $$('.delete-blog').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const blogId = e.target.getAttribute('data-id');
            deleteBlog(blogId);
        });
    });
}

function showBlogForm(blog = null) {
    const isEdit = !!blog;
    
    const formHTML = `
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold">${isEdit ? 'ویرایش مقاله' : 'افزودن مقاله جدید'}</h3>
                    <button class="close-blog-form p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <iconify-icon icon="mdi:close"></iconify-icon>
                    </button>
                </div>
                
                <form class="p-6 space-y-4" id="blogForm">
                    <div>
                        <label class="block text-sm font-medium mb-2">عنوان مقاله</label>
                        <input type="text" required 
                               class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                               value="${blog?.title || ''}">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">دسته‌بندی</label>
                        <input type="text" required 
                               class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                               value="${blog?.category || ''}">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">خلاصه مقاله</label>
                        <textarea required rows="3" 
                                  class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">${blog?.excerpt || ''}</textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">محتوای کامل</label>
                        <textarea required rows="6" 
                                  class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">${blog?.content || ''}</textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">آدرس تصویر (اختیاری)</label>
                        <input type="url" 
                               class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                               value="${blog?.image || ''}">
                    </div>
                    
                    <div class="flex gap-3 pt-4">
                        <button type="button" class="close-blog-form flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
                            انصراف
                        </button>
                        <button type="submit" class="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
                            ${isEdit ? 'ویرایش مقاله' : 'ذخیره مقاله'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    const formContainer = document.createElement('div');
    formContainer.innerHTML = formHTML;
    document.body.appendChild(formContainer);
    
    // Event listeners
    $('.close-blog-form').addEventListener('click', () => {
        formContainer.remove();
    });
    
    $('#blogForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveBlog(blog?.id, formContainer);
    });
}

function saveBlog(blogId = null, formContainer) {
    const form = $('#blogForm');
    const formData = new FormData(form);
    
    const blogData = {
        title: form.querySelector('input[type="text"]').value,
        category: form.querySelectorAll('input[type="text"]')[1].value,
        excerpt: form.querySelector('textarea').value,
        content: form.querySelectorAll('textarea')[1].value,
        image: form.querySelector('input[type="url"]').value,
        date: new Date().toLocaleDateString('fa-IR')
    };
    
    if (blogId) {
        // Edit existing blog
        const index = blogs.findIndex(b => b.id === blogId);
        if (index !== -1) {
            blogs[index] = { ...blogs[index], ...blogData };
        }
    } else {
        // Add new blog
        const newBlog = {
            id: uid('b'),
            ...blogData
        };
        blogs.push(newBlog);
    }
    
    LS.set('HDK_blogs', blogs);
    formContainer.remove();
    notify(blogId ? 'مقاله با موفقیت ویرایش شد' : 'مقاله جدید با موفقیت اضافه شد', 'success');
    
    // Refresh blog management view
    if (currentPage === 'admin') {
        renderAdminPage();
    }
}

function editBlog(blogId) {
    const blog = blogs.find(b => b.id === blogId);
    if (blog) {
        showBlogForm(blog);
    }
}

function deleteBlog(blogId) {
    if (confirm('آیا از حذف این مقاله مطمئن هستید؟')) {
        blogs = blogs.filter(b => b.id !== blogId);
        LS.set('HDK_blogs', blogs);
        notify('مقاله با موفقیت حذف شد', 'success');
        
        // Refresh blog management view
        if (currentPage === 'admin') {
            renderAdminPage();
        }
    }
}

/* ---------- Product Image Upload Fix ---------- */
function setupImageUpload() {
    // این تابع مشکل آپلود عکس را برطرف می‌کند
    document.addEventListener('change', (e) => {
        if (e.target.type === 'file' && e.target.accept.includes('image')) {
            const file = e.target.files[0];
            if (file) {
                // بررسی نوع فایل
                if (!file.type.startsWith('image/')) {
                    notify('لطفا فقط فایل تصویری انتخاب کنید', 'error');
                    e.target.value = '';
                    return;
                }
                
                // بررسی سایز فایل (حداکثر 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    notify('حجم فایل نباید بیشتر از 5 مگابایت باشد', 'error');
                    e.target.value = '';
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        // نمایش پیش‌نمایش
                        const previewContainer = e.target.parentElement.querySelector('.image-preview');
                        if (previewContainer) {
                            previewContainer.innerHTML = `
                                <img src="${e.target.result}" alt="Preview" class="w-32 h-32 object-cover rounded-lg">
                                <button type="button" class="remove-image absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                                    <iconify-icon icon="mdi:close"></iconify-icon>
                                </button>
                            `;
                            
                            // دکمه حذف عکس
                            previewContainer.querySelector('.remove-image').addEventListener('click', function() {
                                previewContainer.innerHTML = '';
                                e.target.value = '';
                            });
                        }
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    });
}

// Admin panel event listeners
adminBtn.addEventListener('click', openAdminPanel);
closeAdminModal.addEventListener('click', closeAdminPanel);
addProductBtn.addEventListener('click', () => {
    editingProductId = null;
    showProductForm();
});
saveProductBtn.addEventListener('click', saveProduct);
cancelProductBtn.addEventListener('click', () => {
    productForm.classList.add('hidden');
    editingProductId = null;
    pendingProductImage = '';
    $('#imagePreview').innerHTML = '';
});
adminSearch.addEventListener('input', renderAdminProducts);

// Initialize image upload
document.addEventListener('DOMContentLoaded', setupImageUpload);

// ---- cart.js ----
/* ---------- Cart Functions ---------- */
function updateCartDisplay() {
    if (!cartItems) return;
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = createEmptyState({
            icon: 'mdi:cart-off',
            title: 'سبد خرید شما خالی است',
            description: 'برای شروع خرید، محصولات مورد علاقه خود را به سبد اضافه کنید.',
            actions: '<a href="#products" class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"><iconify-icon icon="mdi:shopping-outline" width="18"></iconify-icon><span>مشاهده محصولات</span></a>'
        });
        cartTotal.textContent = '۰ تومان';
        cartDiscount.textContent = '۰ تومان';
        cartFinalTotal.textContent = '۰ تومان';
        return;
    }
    
    let total = 0;
    let totalDiscount = 0;
    
    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (!product) return;
        
        const finalPrice = product.discount > 0 ? 
            product.price * (1 - product.discount / 100) : product.price;
        const itemTotal = finalPrice * item.qty;
        const itemDiscount = (product.price - finalPrice) * item.qty;
        
        total += itemTotal;
        totalDiscount += itemDiscount;
        
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg';
        cartItemEl.innerHTML = `
            <div class="flex-1">
                <h4 class="font-medium">${product.name}</h4>
                <div class="flex justify-between items-center mt-2">
                    <div class="flex items-center gap-2">
                        <button class="decrease-qty w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm" data-id="${product.id}">-</button>
                        <span class="w-8 text-center">${item.qty}</span>
                        <button class="increase-qty w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm" data-id="${product.id}">+</button>
                    </div>
                    <div class="text-primary font-medium">${formatPrice(finalPrice)}</div>
                </div>
                ${itemDiscount > 0 ? `
                    <div class="text-green-500 text-xs mt-1">
                        ${formatPrice(itemDiscount)} صرفه‌جویی
                    </div>
                ` : ''}
            </div>
            <button class="remove-from-cart text-red-500 hover:text-red-700 transition-colors" data-id="${product.id}">
                <iconify-icon icon="mdi:trash-can-outline"></iconify-icon>
            </button>
        `;
        cartItems.appendChild(cartItemEl);
    });
    
    const shippingCost = total > 500000 ? 0 : 30000;
    const finalTotal = total + shippingCost;
    
    cartTotal.textContent = formatPrice(total + totalDiscount);
    cartDiscount.textContent = formatPrice(totalDiscount);
    cartShipping.textContent = shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost);
    cartFinalTotal.textContent = formatPrice(finalTotal);
    
    // Add event listeners for cart actions
    $$('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('button').getAttribute('data-id');
            updateCartItemQty(productId, -1);
        });
    });
    
    $$('.increase-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('button').getAttribute('data-id');
            updateCartItemQty(productId, 1);
        });
    });
    
    $$('.remove-from-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('button').getAttribute('data-id');
            removeFromCart(productId);
        });
    });
}

function updateCartItemQty(productId, change) {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;
    
    const product = getProductById(productId);
    if (!product) return;
    
    if (change > 0 && item.qty >= product.stock) {
        notify(`فقط ${product.stock} عدد از این محصول در انبار موجود است`, 'warning');
        return;
    }
    
    item.qty += change;
    if (item.qty <= 0) {
        removeFromCart(productId);
    } else {
        LS.set('HDK_cart', cart);
        updateCartBadge();
        updateCartDisplay();
        notify(change > 0 ? 'تعداد محصول افزایش یافت' : 'تعداد محصول کاهش یافت', 'info');
    }
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.productId !== productId);
    LS.set('HDK_cart', cart);
    updateCartBadge();
    updateCartDisplay();
    notify('محصول از سبد خرید حذف شد', 'info');
}

function addToCart(productId, qty=1){
    const product = getProductById(productId);
    if (!product) return;
    
    if (product.stock === 0) {
        notify('این محصول در حال حاضر موجود نیست', 'warning');
        return;
    }
    
    const existing = cart.find(i => i.productId === productId);
    if(existing) {
        if (existing.qty + qty > product.stock) {
            notify(`فقط ${product.stock} عدد از این محصول در انبار موجود است`, 'warning');
            return;
        }
        existing.qty += qty;
    } else {
        if (qty > product.stock) {
            notify(`فقط ${product.stock} عدد از این محصول در انبار موجود است`, 'warning');
            return;
        }
        cart.push({ productId, qty });
    }
    
    LS.set('HDK_cart', cart); 
    updateCartBadge(); 
    updateCartDisplay();
    notify('محصول به سبد اضافه شد.', 'success');
}

/* ---------- Enhanced Compare Functions ---------- */
function toggleCompare(productId) {
    const index = compareList.indexOf(productId);
    if (index > -1) {
        compareList.splice(index, 1);
        notify('محصول از لیست مقایسه حذف شد', 'info');
    } else {
        if (compareList.length >= 4) {
            notify('حداکثر ۴ محصول قابل مقایسه هستند', 'warning');
            return;
        }
        compareList.push(productId);
        notify('محصول به لیست مقایسه اضافه شد', 'success');
    }
    LS.set('HDK_compare', compareList);
    updateCompareBadge();
    if (!compareModal.classList.contains('hidden')) {
        renderCompareProducts();
    }
}

let isCompareModalClosing = false;

function openCompareModal() {
    if (compareList.length === 0) {
        notify('لطفا ابتدا محصولاتی برای مقایسه انتخاب کنید', 'warning');
        return;
    }
    if (!compareModal) return;

    isCompareModalClosing = false;
    compareModal.classList.remove('hidden', 'modal-closing');
    compareModal.setAttribute('aria-hidden', 'false');
    lockBodyScroll();
    requestAnimationFrame(() => compareModal.classList.add('modal-visible'));
    renderCompareProducts();

    const dialog = compareModal.querySelector('[data-modal-dialog]');
    if (dialog) {
        dialog.focus({ preventScroll: true });
    }
}

function closeCompareModalDialog() {
    if (!compareModal || compareModal.classList.contains('hidden') || isCompareModalClosing) {
        return;
    }

    isCompareModalClosing = true;
    compareModal.setAttribute('aria-hidden', 'true');
    compareModal.classList.remove('modal-visible');
    compareModal.classList.add('modal-closing');
    unlockBodyScroll();

    const cleanup = () => {
        compareModal.removeEventListener('transitionend', cleanup);
        compareModal.classList.add('hidden');
        compareModal.classList.remove('modal-closing');
        isCompareModalClosing = false;
    };

    compareModal.addEventListener('transitionend', cleanup);
    setTimeout(cleanup, 220);

    if (compareBtn && typeof compareBtn.focus === 'function') {
        compareBtn.focus();
    }
}

function renderCompareProducts() {
    compareProducts.innerHTML = '';
    
    if (compareList.length === 0) {
        compareProducts.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500">
                <iconify-icon icon="mdi:scale-off" width="48" class="mb-4"></iconify-icon>
                <p>محصولی برای مقایسه وجود ندارد</p>
            </div>
        `;
        return;
    }
    
    compareProducts.className = `grid grid-cols-1 md:grid-cols-${Math.min(compareList.length, 4)} gap-6`;
    
    compareList.forEach(productId => {
        const product = getProductById(productId);
        if (!product) {
            // حذف محصولاتی که وجود ندارند
            compareList = compareList.filter(id => id !== productId);
            LS.set('HDK_compare', compareList);
            updateCompareBadge();
            return;
        }
        
        const productEl = document.createElement('div');
        productEl.innerHTML = createCompareProduct(product);
        compareProducts.appendChild(productEl);
    });
    
    // Add event listeners for compare actions
    $$('.remove-compare').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('button').getAttribute('data-id');
            removeFromCompare(productId);
        });
    });
    
    $$('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('button').getAttribute('data-id');
            addToCart(productId, 1);
        });
    });
    
    $$('.add-to-wishlist').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('button').getAttribute('data-id');
            toggleWishlist(productId);
            renderCompareProducts(); // Refresh to update heart icon
        });
    });
}

function removeFromCompare(productId) {
    compareList = compareList.filter(id => id !== productId);
    LS.set('HDK_compare', compareList);
    updateCompareBadge();
    renderCompareProducts();
    notify('محصول از مقایسه حذف شد', 'info');
}

/* ---------- Enhanced Checkout ---------- */
let selectedCheckoutAddressId = null;
let selectedShippingMethodId = (typeof shippingMethods !== 'undefined' && shippingMethods.length > 0)
    ? shippingMethods[0].id
    : 'standard';

function renderEnhancedCheckoutPage() {
    if (user) {
        const userAddresses = addresses.filter(addr => addr.userId === user.id);
        const defaultAddress = userAddresses.find(addr => addr.isDefault) || userAddresses[0] || null;
        selectedCheckoutAddressId = defaultAddress ? defaultAddress.id : null;
    } else {
        selectedCheckoutAddressId = null;
    }

    const page = document.createElement('div');
    page.innerHTML = `
        <h1 class="text-2xl font-bold mb-6">تسویه حساب</h1>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
                <!-- اطلاعات ارسال -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                    <h2 class="text-lg font-bold mb-4">اطلاعات ارسال</h2>
                    <div id="checkoutAddressSection">
                        ${user ? '' : '<p class="text-gray-500">لطفا ابتدا وارد حساب کاربری خود شوید</p>'}
                    </div>
                </div>

                <!-- روش ارسال -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                    <h2 class="text-lg font-bold mb-4">روش ارسال</h2>
                    ${createShippingOptions(selectedShippingMethodId)}
                </div>

                <!-- روش پرداخت -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                    <h2 class="text-lg font-bold mb-4">روش پرداخت</h2>
                    ${createPaymentOptions('online')}
                </div>
            </div>

            <!-- خلاصه سفارش -->
            <div>
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20 sticky top-4">
                    <h2 class="text-lg font-bold mb-4">خلاصه سفارش</h2>
                    <div id="checkoutItems" class="space-y-3 mb-4 max-h-64 overflow-y-auto custom-scrollbar"></div>
                    <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                        <div class="flex justify-between">
                            <span>جمع کل:</span>
                            <span id="checkoutTotal">۰ تومان</span>
                        </div>
                        <div class="flex justify-between">
                            <span>تخفیف:</span>
                            <span id="checkoutDiscount" class="text-green-500">۰ تومان</span>
                        </div>
                        <div class="flex justify-between">
                            <span>هزینه ارسال:</span>
                            <span id="checkoutShipping">۰ تومان</span>
                        </div>
                        <div class="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                            <span>مبلغ قابل پرداخت:</span>
                            <span id="checkoutFinalTotal">۰ تومان</span>
                        </div>
                    </div>
                    <button class="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors mt-6" id="finalCheckoutBtn">
                        پرداخت و ثبت سفارش
                    </button>
                </div>
            </div>
        </div>
    `;
    contentRoot.appendChild(page);

    if (user) {
        refreshCheckoutAddressSection();
    }

    updateCheckoutDisplay();
    setupCheckoutEvents();
}

function createUserAddressSection(userAddresses = []) {
    if (!Array.isArray(userAddresses) || userAddresses.length === 0) {
        return `
            <div class="space-y-4">
                <div class="text-center py-6 text-gray-500">
                    <iconify-icon icon="mdi:map-marker-off" width="36" class="mb-2"></iconify-icon>
                    <p class="mb-3">هیچ آدرسی ثبت نکرده‌اید</p>
                    <button type="button" id="toggleCheckoutAddressForm" class="text-primary hover:text-primary/80 font-medium">
                        افزودن آدرس جدید
                    </button>
                </div>
                <div id="checkoutAddressFormContainer" class="hidden"></div>
            </div>
        `;
    }

    const options = userAddresses.map(address => `
        <label class="checkout-address-option block p-4 border-2 rounded-xl transition-all cursor-pointer ${
            address.id === selectedCheckoutAddressId
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary/60'
        }" data-id="${address.id}">
            <div class="flex items-start gap-3">
                <input type="radio" name="checkoutAddress" value="${address.id}" ${address.id === selectedCheckoutAddressId ? 'checked' : ''}
                       class="mt-1 text-primary focus:ring-primary">
                <div class="space-y-2">
                    <div class="flex items-center gap-2">
                        <span class="font-medium">${address.title}</span>
                        ${address.isDefault ? '<span class="bg-primary text-white text-xs px-2 py-0.5 rounded-full">پیش‌فرض</span>' : ''}
                    </div>
                    <div class="text-sm text-gray-600 space-y-1">
                        <div>${address.province}، ${address.city}</div>
                        <div>${address.fullAddress}</div>
                        <div>کد پستی: ${address.postalCode}</div>
                        <div>تلفن: ${address.phone}</div>
                    </div>
                </div>
            </div>
        </label>
    `).join('');

    return `
        <div class="space-y-4">
            <div class="space-y-3">
                ${options}
            </div>
            <div class="flex flex-wrap gap-3 text-sm">
                <button type="button" id="toggleCheckoutAddressForm" class="flex items-center gap-1 text-primary hover:text-primary/80">
                    <iconify-icon icon="mdi:plus"></iconify-icon>
                    افزودن آدرس جدید
                </button>
                <a href="#addresses" id="checkoutManageAddresses" class="flex items-center gap-1 text-primary/80 hover:text-primary">
                    <iconify-icon icon="mdi:map-marker"></iconify-icon>
                    مدیریت آدرس‌ها
                </a>
            </div>
            <div id="checkoutAddressFormContainer" class="hidden"></div>
        </div>
    `;
}

function refreshCheckoutAddressSection() {
    const container = $('#checkoutAddressSection');
    if (!container || !user) return;

    const userAddresses = addresses.filter(addr => addr.userId === user.id);
    if (userAddresses.length === 0) {
        selectedCheckoutAddressId = null;
    } else if (!selectedCheckoutAddressId || !userAddresses.some(addr => addr.id === selectedCheckoutAddressId)) {
        const defaultAddress = userAddresses.find(addr => addr.isDefault) || userAddresses[0];
        selectedCheckoutAddressId = defaultAddress ? defaultAddress.id : null;
    }

    container.innerHTML = createUserAddressSection(userAddresses);
    bindCheckoutAddressEvents();
}

function bindCheckoutAddressEvents() {
    $$('input[name="checkoutAddress"]').forEach(radio => {
        radio.addEventListener('change', function() {
            selectedCheckoutAddressId = this.value;
            updateCheckoutAddressHighlight();
        });
    });

    const toggleBtn = $('#toggleCheckoutAddressForm');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            renderCheckoutAddressForm();
        });
    }

    updateCheckoutAddressHighlight();
}

function updateCheckoutAddressHighlight() {
    $$('.checkout-address-option').forEach(option => {
        const isSelected = option.getAttribute('data-id') === selectedCheckoutAddressId;
        option.classList.toggle('border-primary', isSelected);
        option.classList.toggle('bg-primary/5', isSelected);
        option.classList.toggle('border-gray-200', !isSelected);
    });
}

function renderCheckoutAddressForm() {
    const container = $('#checkoutAddressFormContainer');
    if (!container) return;

    container.innerHTML = createCheckoutAddressForm();
    container.classList.remove('hidden');

    const provinceSelect = $('#checkoutAddressProvince');
    const citySelect = $('#checkoutAddressCity');

    populateCheckoutProvinceOptions(provinceSelect);
    provinceSelect.addEventListener('change', () => {
        populateCheckoutCityOptions(provinceSelect.value, citySelect);
    });

    $('#checkoutCancelAddress').addEventListener('click', () => {
        hideCheckoutAddressForm();
    });

    $('#checkoutAddressForm').addEventListener('submit', (e) => {
        e.preventDefault();

        if (!user) {
            notify('برای ثبت آدرس وارد حساب کاربری شوید', 'warning');
            return;
        }

        const formData = {
            title: $('#checkoutAddressTitle').value.trim(),
            province: provinceSelect.value,
            city: citySelect.value,
            fullAddress: $('#checkoutAddressText').value.trim(),
            postalCode: $('#checkoutAddressPostal').value.trim(),
            phone: $('#checkoutAddressPhone').value.trim(),
            isDefault: $('#checkoutAddressDefault').checked,
            userId: user.id
        };

        if (!formData.title || !formData.province || !formData.city || !formData.fullAddress) {
            notify('لطفا همه فیلدها را تکمیل کنید', 'error');
            return;
        }

        if (typeof validatePostalCode === 'function' && !validatePostalCode(formData.postalCode)) {
            notify('کد پستی باید ۱۰ رقمی باشد', 'error');
            return;
        }

        if (typeof validatePhone === 'function' && !validatePhone(formData.phone)) {
            notify('شماره تماس معتبر نیست', 'error');
            return;
        }

        if (formData.isDefault) {
            addresses.forEach(addr => {
                if (addr.userId === user.id) {
                    addr.isDefault = false;
                }
            });
        }

        const newAddress = {
            id: uid('addr'),
            ...formData
        };

        addresses.push(newAddress);
        LS.set('HDK_addresses', addresses);

        selectedCheckoutAddressId = newAddress.id;
        hideCheckoutAddressForm();
        notify('آدرس جدید با موفقیت اضافه شد', 'success');
        refreshCheckoutAddressSection();
    });
}

function hideCheckoutAddressForm() {
    const container = $('#checkoutAddressFormContainer');
    if (!container) return;
    container.classList.add('hidden');
    container.innerHTML = '';
}

function populateCheckoutProvinceOptions(select) {
    if (!select) return;
    select.innerHTML = '<option value="">انتخاب استان</option>';
    provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province.name;
        option.textContent = province.name;
        select.appendChild(option);
    });
}

function populateCheckoutCityOptions(provinceName, select) {
    if (!select) return;
    select.innerHTML = '<option value="">انتخاب شهر</option>';
    select.disabled = !provinceName;

    if (!provinceName) return;

    getProvinceCities(provinceName).forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        select.appendChild(option);
    });
}

function createCheckoutAddressForm() {
    return `
        <div class="bg-white dark:bg-gray-900 border border-primary/20 rounded-2xl p-4">
            <form id="checkoutAddressForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">عنوان آدرس</label>
                    <input id="checkoutAddressTitle" type="text" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" placeholder="مثلا: منزل">
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">استان</label>
                        <select id="checkoutAddressProvince" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                            <option value="">انتخاب استان</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">شهر</label>
                        <select id="checkoutAddressCity" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" disabled>
                            <option value="">ابتدا استان را انتخاب کنید</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">آدرس کامل</label>
                    <textarea id="checkoutAddressText" rows="3" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" placeholder="خیابان، پلاک، واحد"></textarea>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">کد پستی</label>
                        <input id="checkoutAddressPostal" type="text" maxlength="10" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">شماره تماس</label>
                        <input id="checkoutAddressPhone" type="tel" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <input id="checkoutAddressDefault" type="checkbox" class="rounded border-gray-300 text-primary focus:ring-primary">
                    <label for="checkoutAddressDefault" class="text-sm">تنظیم به عنوان آدرس پیش‌فرض</label>
                </div>
                <div class="flex gap-3">
                    <button type="button" id="checkoutCancelAddress" class="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">انصراف</button>
                    <button type="submit" class="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">ذخیره آدرس</button>
                </div>
            </form>
        </div>
    `;
}

function updateCheckoutDisplay() {
    const checkoutItems = $('#checkoutItems');
    const checkoutTotal = $('#checkoutTotal');
    const checkoutDiscount = $('#checkoutDiscount');
    const checkoutShipping = $('#checkoutShipping');
    const checkoutFinalTotal = $('#checkoutFinalTotal');
    
    if (!checkoutItems) return;
    
    checkoutItems.innerHTML = '';
    if (cart.length === 0) {
        checkoutItems.innerHTML = '<p class="text-gray-500 text-center">سبد خرید خالی است</p>';
        checkoutTotal.textContent = '۰ تومان';
        checkoutDiscount.textContent = '۰ تومان';
        checkoutShipping.textContent = '۰ تومان';
        checkoutFinalTotal.textContent = '۰ تومان';
        return;
    }
    
    let total = 0;
    let totalDiscount = 0;
    
    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (!product) return;
        
        const finalPrice = product.discount > 0 ? 
            product.price * (1 - product.discount / 100) : product.price;
        const itemTotal = finalPrice * item.qty;
        const itemDiscount = (product.price - finalPrice) * item.qty;
        
        total += itemTotal;
        totalDiscount += itemDiscount;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-700 pb-2';
        itemEl.innerHTML = `
            <div class="flex-1">
                <div class="font-medium">${product.name}</div>
                <div class="text-gray-500">${item.qty} × ${formatPrice(finalPrice)}</div>
            </div>
            <div class="font-medium">${formatPrice(itemTotal)}</div>
        `;
        checkoutItems.appendChild(itemEl);
    });
    
    const shippingCost = getCheckoutShippingCost(total);
    const finalTotal = total + shippingCost;

    checkoutTotal.textContent = formatPrice(total + totalDiscount);
    checkoutDiscount.textContent = formatPrice(totalDiscount);
    checkoutShipping.textContent = shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost);
    checkoutFinalTotal.textContent = formatPrice(finalTotal);
}

function getCheckoutShippingCost(orderTotal) {
    if (typeof getShippingMethod !== 'function') {
        return orderTotal > 500000 ? 0 : 30000;
    }

    const method = getShippingMethod(selectedShippingMethodId);
    if (!method) {
        return orderTotal > 500000 ? 0 : 30000;
    }

    let cost = method.price || 0;
    if (method.freeThreshold && orderTotal >= method.freeThreshold) {
        cost = 0;
    }

    return cost;
}

function setupCheckoutEvents() {
    // Payment method selection
    $$('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Update UI for selected payment method
            $$('.payment-option').forEach(option => {
                option.classList.remove('border-green-500', 'bg-green-50');
                option.classList.add('border-gray-300');
            });

            this.closest('.payment-option').classList.add('border-green-500', 'bg-green-50');
            this.closest('.payment-option').classList.remove('border-gray-300');
        });
    });

    const checkedPayment = $('input[name="payment"]:checked');
    if (checkedPayment) {
        checkedPayment.dispatchEvent(new Event('change'));
    }

    // Shipping method selection
    const shippingRadios = $$('input[name="shipping"]');
    if (shippingRadios.length > 0) {
        const checkedShipping = $('input[name="shipping"]:checked');
        if (checkedShipping) {
            selectedShippingMethodId = checkedShipping.value;
        }

        const applyShippingStyles = () => {
            $$('.shipping-option').forEach(option => {
                const isSelected = option.getAttribute('data-id') === selectedShippingMethodId;
                option.classList.toggle('border-blue-500', isSelected);
                option.classList.toggle('bg-blue-50', isSelected);
                option.classList.toggle('dark:bg-blue-500/10', isSelected);
                option.classList.toggle('border-gray-300', !isSelected);
            });
        };

        shippingRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                selectedShippingMethodId = this.value;
                applyShippingStyles();
                updateCheckoutDisplay();
            });
        });

        applyShippingStyles();
    }

    // Final checkout
    $('#finalCheckoutBtn').addEventListener('click', function() {
        if (cart.length === 0) {
            notify('سبد خرید شما خالی است', 'warning');
            return;
        }

        if (!user) {
            notify('لطفا برای ثبت سفارش وارد حساب کاربری شوید', 'warning');
            location.hash = 'login';
            return;
        }

        const paymentInput = $('input[name="payment"]:checked');
        const selectedPayment = paymentInput ? paymentInput.value : 'online';
        const address = addresses.find(addr => addr.userId === user.id && addr.id === selectedCheckoutAddressId);

        if (!address) {
            notify('لطفا یک آدرس برای ارسال انتخاب کنید', 'warning');
            return;
        }

        const totals = calculateCartTotal();
        const shippingCost = getCheckoutShippingCost(totals.total);
        const finalTotal = totals.total + shippingCost;
        const shippingInfo = typeof getShippingMethod === 'function' ? getShippingMethod(selectedShippingMethodId) : null;

        const order = {
            id: uid('o'),
            userId: user.id,
            items: cart.map(item => ({ ...item })),
            total: finalTotal,
            subtotal: totals.total,
            discount: totals.totalDiscount || 0,
            shippingCost,
            paymentMethod: selectedPayment,
            shippingMethod: shippingInfo ? shippingInfo.id : selectedShippingMethodId,
            shippingTitle: shippingInfo ? shippingInfo.name : '',
            address: {
                id: address.id,
                title: address.title,
                province: address.province,
                city: address.city,
                fullAddress: address.fullAddress,
                postalCode: address.postalCode,
                phone: address.phone
            },
            status: 'در حال پردازش',
            date: new Date().toISOString()
        };

        orders.push(order);
        LS.set('HDK_orders', orders);

        // Clear cart
        cart = [];
        LS.set('HDK_cart', cart);
        updateCartBadge();
        updateCheckoutDisplay();

        notify('سفارش شما با موفقیت ثبت شد!', 'success');
        location.hash = `order-success:${order.id}`;
    });
}

function openCartSidebar() {
    if (!cartSidebar || cartSidebar.classList.contains('open')) {
        return;
    }

    cartSidebar.classList.add('open');
    cartSidebar.setAttribute('aria-hidden', 'false');
    lockBodyScroll();

    if (cartOverlay) {
        cartOverlay.classList.remove('hidden');
        cartOverlay.setAttribute('aria-hidden', 'false');
    }

    cartSidebar.focus({ preventScroll: true });
}

function closeCartSidebar() {
    if (!cartSidebar || !cartSidebar.classList.contains('open')) {
        return;
    }

    cartSidebar.classList.remove('open');
    cartSidebar.setAttribute('aria-hidden', 'true');

    if (cartOverlay) {
        cartOverlay.classList.add('hidden');
        cartOverlay.setAttribute('aria-hidden', 'true');
    }

    unlockBodyScroll();

    if (cartBtn && typeof cartBtn.focus === 'function') {
        cartBtn.focus();
    }
}

// Cart and Compare event listeners
if (cartBtn) {
    cartBtn.addEventListener('click', openCartSidebar);
}

if (closeCart) {
    closeCart.addEventListener('click', closeCartSidebar);
}

if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCartSidebar);
}

if (compareBtn) {
    compareBtn.addEventListener('click', openCompareModal);
}

if (closeCompareModal) {
    closeCompareModal.addEventListener('click', closeCompareModalDialog);
}

if (compareModal) {
    compareModal.addEventListener('click', (event) => {
        if (event.target === compareModal) {
            closeCompareModalDialog();
        }
    });
}

const handleEscapeKey = (event) => {
    if (event.key !== 'Escape') return;

    if (cartSidebar && cartSidebar.classList.contains('open')) {
        event.preventDefault();
        closeCartSidebar();
        return;
    }

    if (compareModal && !compareModal.classList.contains('hidden')) {
        event.preventDefault();
        closeCompareModalDialog();
    }
};

document.addEventListener('keydown', handleEscapeKey);

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        notify('سبد خرید شما خالی است', 'warning');
        return;
    }
    location.hash = 'checkout';
    closeCartSidebar();
});

// Replace original checkout with enhanced version
const originalRenderCheckoutPage = renderCheckoutPage;
renderCheckoutPage = renderEnhancedCheckoutPage;

// ---- auth.js ----
/* ---------- User Dropdown ---------- */
function updateUserDropdown() {
    if (user) {
        userDropdownContent.innerHTML = `
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <div class="font-medium text-primary">${user.name}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">${user.phone}</div>
            </div>
            <a href="#profile" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">پروفایل من</a>
            <a href="#orders" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">سفارش‌های من</a>
            <a href="#wishlist" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">لیست علاقه‌مندی‌ها</a>
            <a href="#addresses" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">آدرس‌های من</a>
            <button id="logoutBtn" class="w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors">خروج</button>
        `;
    } else {
        userDropdownContent.innerHTML = `
            <button id="loginBtn" class="w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">ورود / ثبت‌نام</button>
        `;
    }
}

/* ---------- Authentication System ---------- */
function renderLoginPage(initialMode = 'login') {
    let currentMode = initialMode;

    const page = document.createElement('div');
    page.className = 'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8';
    page.innerHTML = `
        <div class="max-w-lg w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-primary/30">
            <div class="space-y-4">
                <div class="flex justify-center">
                    <a href="#home" class="text-2xl font-extrabold text-primary flex items-center gap-2">
                        <iconify-icon icon="mdi:cart" width="26"></iconify-icon>
                        HDKALA
                    </a>
                </div>
                <div class="text-center space-y-2">
                    <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">ورود یا ثبت‌نام</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">با شماره تماس خود وارد شوید یا حساب جدید بسازید</p>
                </div>
                <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/40 p-1 rounded-xl" role="tablist">
                    <button type="button" data-mode="login" class="auth-tab flex-1 py-2 rounded-lg font-medium transition-colors">
                        ورود کاربران
                    </button>
                    <button type="button" data-mode="signup" class="auth-tab flex-1 py-2 rounded-lg font-medium transition-colors">
                        ثبت‌نام سریع
                    </button>
                </div>
            </div>

            <form class="space-y-5" id="authForm" novalidate>
                <div>
                    <label for="authPhone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">شماره تماس <span class="text-red-500">*</span></label>
                    <input id="authPhone" type="tel" required pattern="09[0-9]{9}" maxlength="11"
                           class="w-full px-3 py-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                           placeholder="09xxxxxxxxx">
                    <div id="phoneError" class="text-red-500 text-xs mt-1 hidden">شماره تلفن باید با 09 شروع شده و 11 رقمی باشد</div>
                </div>

                <div>
                    <label for="authEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ایمیل (اختیاری)</label>
                    <input id="authEmail" type="email" class="w-full px-3 py-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="example@email.com">
                </div>

                <div id="passwordGroup" class="space-y-1">
                    <label for="authPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">رمز عبور (اختیاری)</label>
                    <input id="authPassword" type="password" class="w-full px-3 py-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="••••••">
                    <p class="text-xs text-gray-500 dark:text-gray-400">در صورت نداشتن رمز عبور، از ورود با کد تأیید استفاده کنید.</p>
                </div>

                <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                    دریافت کد تأیید
                </button>
            </form>

            <div id="authHint" class="text-center text-xs text-gray-500 dark:text-gray-400">
                حساب کاربری ندارید؟ شماره خود را وارد کنید تا ثبت‌نام انجام شود.
            </div>
        </div>
    `;

    contentRoot.innerHTML = '';
    contentRoot.appendChild(page);

    const tabs = $$('.auth-tab', page);
    const passwordGroup = $('#passwordGroup', page);
    const phoneInput = $('#authPhone', page);
    const emailInput = $('#authEmail', page);
    const passwordInput = $('#authPassword', page);
    const phoneError = $('#phoneError', page);
    const authHint = $('#authHint', page);

    function updateTabStyles() {
        tabs.forEach(tab => {
            const isActive = tab.getAttribute('data-mode') === currentMode;
            tab.classList.toggle('bg-primary', isActive);
            tab.classList.toggle('text-white', isActive);
            tab.classList.toggle('shadow-md', isActive);
            tab.classList.toggle('bg-white', !isActive);
            tab.classList.toggle('dark:bg-gray-800', !isActive);
            tab.classList.toggle('text-gray-600', !isActive);
            tab.classList.toggle('dark:text-gray-300', !isActive);
            tab.classList.toggle('hover:bg-gray-100', !isActive);
            tab.classList.toggle('dark:hover:bg-gray-700', !isActive);
        });

        if (currentMode === 'login') {
            passwordGroup.classList.remove('hidden');
            authHint.textContent = 'اگر رمز عبور ندارید، کد تأیید برای ورود ارسال می‌شود.';
        } else {
            passwordGroup.classList.add('hidden');
            passwordInput.value = '';
            authHint.textContent = 'با وارد کردن شماره تماس، کد تأیید برای ثبت‌نام ارسال خواهد شد.';
        }
    }

    updateTabStyles();

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            currentMode = tab.getAttribute('data-mode');
            updateTabStyles();
        });
    });

    phoneInput.addEventListener('input', () => {
        phoneError.classList.add('hidden');
    });

    $('#authForm', page).addEventListener('submit', (e) => {
        e.preventDefault();

        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!validatePhone(phone)) {
            phoneError.classList.remove('hidden');
            return;
        }

        phoneError.classList.add('hidden');

        if (currentMode === 'login' && password) {
            const existingUser = LS.get('HDK_user');
            if (existingUser && (existingUser.phone === phone || (email && existingUser.email === email))) {
                if (!existingUser.password) {
                    notify('برای این حساب رمز عبوری ثبت نشده است. از ورود با کد استفاده کنید.', 'warning');
                    return;
                }
                if (existingUser.password !== password) {
                    notify('رمز عبور وارد شده نادرست است', 'error');
                    return;
                }

                user = { ...existingUser };
                if (email && email !== existingUser.email) {
                    user.email = email;
                }
                LS.set('HDK_user', user);
                updateUserLabel();
                notify('با موفقیت وارد شدید!', 'success');
                navigate('home');
                return;
            }

            notify('حسابی با این مشخصات یافت نشد. لطفا ثبت‌نام کنید.', 'warning');
            return;
        }

        renderVerifyPage({ phone, mode: currentMode, email });
    });

    phoneInput.focus();
}

function renderVerifyPage({ phone, mode = 'login', email = '' }) {
    const operator = getOperatorLogo(phone);
    const operatorLogos = {
        'irancell': '<iconify-icon icon="mdi:signal" class="text-blue-500"></iconify-icon>',
        'mci': '<iconify-icon icon="mdi:sim" class="text-green-500"></iconify-icon>',
        'rightel': '<iconify-icon icon="mdi:wifi" class="text-red-500"></iconify-icon>',
        'unknown': '<iconify-icon icon="mdi:phone" class="text-gray-500"></iconify-icon>'
    };
    
    const page = document.createElement('div');
    page.className = 'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8';
    const isSignup = mode === 'signup';

    page.innerHTML = `
        <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-primary/30">
            <div>
                <div class="flex justify-center">
                    <a href="#home" class="text-2xl font-extrabold text-primary flex items-center gap-2">
                        <iconify-icon icon="mdi:cart" width="26"></iconify-icon>
                        HDKALA
                    </a>
                </div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    ${isSignup ? 'تأیید شماره برای ثبت‌نام' : 'تأیید شماره تلفن'}
                </h2>
                <div class="flex items-center justify-center gap-2 mt-2">
                    ${operatorLogos[operator]}
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        کد ۴ رقمی ارسال شده به ${phone} را وارد کنید
                    </p>
                </div>
            </div>
            <form class="mt-8 space-y-6" id="verifyForm">
                <div class="flex justify-center gap-2" dir="ltr">
                    ${[0,1,2,3].map(i => `
                        <input type="tel"
                               maxlength="1"
                               class="otp-input w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors text-gray-900 dark:text-white"
                               dir="ltr"
                               inputmode="numeric"
                               pattern="[0-9]"
                               autocomplete="one-time-code">
                    `).join('')}
                </div>
                <div>
                    <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                        تأیید و ورود
                    </button>
                </div>
            </form>
            <div class="text-center">
                <button type="button" id="backToLogin" class="text-sm text-primary hover:text-primary/80 transition-colors">
                    تغییر شماره تلفن
                </button>
            </div>
        </div>
    `;
    contentRoot.innerHTML = '';
    contentRoot.appendChild(page);
    
    // Setup OTP inputs
    setupOtpInputs(page);
    
    $('#verifyForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const code = getOtpCode(page);

        if (code.length !== 4) {
            highlightOtpInputs(page, false);
            notify('کد تأیید باید ۴ رقم باشد', 'error');
            return;
        }

        highlightOtpInputs(page, true);

        // Check if user exists (login) or new (signup)
        const existingUser = LS.get('HDK_user');
        if (mode === 'login') {
            if (existingUser && (existingUser.phone === phone || (email && existingUser.email === email))) {
                user = { ...existingUser };
                if (email && email !== existingUser.email) {
                    user.email = email;
                }
                LS.set('HDK_user', user);
                updateUserLabel();
                notify('با موفقیت وارد شدید!', 'success');
                navigate('home');
            } else {
                notify('حسابی با این شماره یافت نشد. لطفا ثبت‌نام کنید.', 'warning');
                renderLoginPage('signup');
            }
        } else {
            renderUserInfoForm({ phone, email });
        }
    });

    $('#backToLogin').addEventListener('click', () => renderLoginPage(mode));
}

function renderUserInfoForm({ phone, email = '' }) {
    const page = document.createElement('div');
    page.className = 'min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8';
    page.innerHTML = `
        <div class="max-w-2xl mx-auto">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-primary/30 p-8">
                <div class="flex justify-center mb-6">
                    <a href="#home" class="text-2xl font-extrabold text-primary flex items-center gap-2">
                        <iconify-icon icon="mdi:cart" width="26"></iconify-icon>
                        HDKALA
                    </a>
                </div>
                <h2 class="text-2xl font-bold text-center mb-6">تکمیل اطلاعات کاربری</h2>
                <p class="text-gray-600 dark:text-gray-400 text-center mb-6">
                    لطفا اطلاعات خود را برای تکمیل ثبت‌نام وارد کنید
                </p>

                <form class="space-y-6" id="userInfoForm" novalidate>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="firstName" class="block text-sm font-medium mb-2">نام <span class="text-red-500">*</span></label>
                            <input id="firstName" type="text" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                        </div>
                        <div>
                            <label for="lastName" class="block text-sm font-medium mb-2">نام خانوادگی <span class="text-red-500">*</span></label>
                            <input id="lastName" type="text" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                        </div>
                    </div>

                    <div>
                        <label for="nationalCode" class="block text-sm font-medium mb-2">کد ملی <span class="text-red-500">*</span></label>
                        <input id="nationalCode" type="text" data-national required
                               class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                               maxlength="10"
                               pattern="[0-9]{10}">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2" for="provinceSelect">استان محل سکونت <span class="text-red-500">*</span></label>
                            <select id="provinceSelect" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                                <option value="">انتخاب استان</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2" for="citySelect">شهر محل سکونت <span class="text-red-500">*</span></label>
                            <select id="citySelect" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" disabled>
                                <option value="">ابتدا استان را انتخاب کنید</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label for="addressText" class="block text-sm font-medium mb-2">آدرس دقیق <span class="text-red-500">*</span></label>
                        <textarea id="addressText" required rows="3" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"></textarea>
                    </div>

                    <div>
                        <label for="postalCode" class="block text-sm font-medium mb-2">کد پستی (اختیاری)</label>
                        <input id="postalCode" type="text" data-postal
                               class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                               maxlength="10"
                               pattern="[0-9]{10}">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="birthDate" class="block text-sm font-medium mb-2">تاریخ تولد</label>
                            <input id="birthDate" type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" placeholder="۱۳۷۰/۰۱/۰۱">
                        </div>
                        <div>
                            <label for="fatherName" class="block text-sm font-medium mb-2">نام پدر</label>
                            <input id="fatherName" type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                        </div>
                    </div>

                    <div>
                        <label for="userEmail" class="block text-sm font-medium mb-2">ایمیل (اختیاری)</label>
                        <input id="userEmail" type="email" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" value="${email || ''}">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="userPassword" class="block text-sm font-medium mb-2">رمز عبور (اختیاری)</label>
                            <input id="userPassword" type="password" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" placeholder="حداقل ۴ کاراکتر">
                        </div>
                        <div>
                            <label for="userPasswordConfirm" class="block text-sm font-medium mb-2">تکرار رمز عبور</label>
                            <input id="userPasswordConfirm" type="password" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" placeholder="تکرار رمز">
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <button type="button" id="backToVerify" class="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors">
                            بازگشت
                        </button>
                        <button type="submit" class="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors">
                            تکمیل ثبت‌نام
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    contentRoot.innerHTML = '';
    contentRoot.appendChild(page);

    loadProvinces();

    $('#provinceSelect').addEventListener('change', function() {
        const province = this.value;
        loadCities(province);
    });

    $('#userInfoForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const nationalCode = $('#nationalCode').value.trim();
        if (!validateNationalCode(nationalCode)) {
            notify('کد ملی نامعتبر است', 'error');
            return;
        }

        const postalCode = $('#postalCode').value.trim();
        if (postalCode && !validatePostalCode(postalCode)) {
            notify('کد پستی باید 10 رقمی باشد', 'error');
            return;
        }

        const passwordValue = $('#userPassword').value.trim();
        const passwordConfirm = $('#userPasswordConfirm').value.trim();
        if (passwordValue && passwordValue.length < 4) {
            notify('رمز عبور باید حداقل ۴ کاراکتر باشد', 'error');
            return;
        }
        if (passwordValue && passwordValue !== passwordConfirm) {
            notify('تکرار رمز عبور با رمز اصلی یکسان نیست', 'error');
            return;
        }

        const firstName = $('#firstName').value.trim();
        const lastName = $('#lastName').value.trim();
        const provinceValue = $('#provinceSelect').value;
        const cityValue = $('#citySelect').value;
        const addressValue = $('#addressText').value.trim();
        const emailValue = $('#userEmail').value.trim();
        const birthDate = $('#birthDate').value.trim();
        const fatherName = $('#fatherName').value.trim();

        user = {
            id: uid('u'),
            name: `${firstName} ${lastName}`.trim(),
            firstName,
            lastName,
            phone,
            nationalCode,
            province: provinceValue,
            city: cityValue,
            address: addressValue,
            postalCode: postalCode || null,
            birthDate,
            fatherName,
            email: emailValue,
            password: passwordValue || null,
            created: new Date().toISOString()
        };

        LS.set('HDK_user', user);
        updateUserLabel();
        notify('ثبت‌نام با موفقیت انجام شد!', 'success');
        navigate('home');
    });

    $('#backToVerify').addEventListener('click', () => {
        const currentEmail = $('#userEmail').value.trim();
        renderVerifyPage({ phone, mode: 'signup', email: currentEmail || email });
    });
}

function loadProvinces() {
    const provinceSelect = $('#provinceSelect');
    if (!provinceSelect) return;

    provinceSelect.innerHTML = '<option value="">انتخاب استان</option>';

    provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province.name;
        option.textContent = province.name;
        provinceSelect.appendChild(option);
    });
}

function loadCities(provinceName) {
    const citySelect = $('#citySelect');
    if (!citySelect) return;
    
    citySelect.innerHTML = '<option value="">انتخاب شهر</option>';
    citySelect.disabled = true;
    
    const province = provinces.find(p => p.name === provinceName);
    if (province) {
        province.cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
        citySelect.disabled = false;
    }
}

// User dropdown event listeners
userButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (user) {
        userDropdown.classList.toggle('open');
    } else {
        location.hash = 'login';
    }
});

document.addEventListener('click', () => {
    userDropdown.classList.remove('open');
});

// User Dropdown Delegation
document.addEventListener('click', (e) => {
    if (e.target.id === 'loginBtn' || e.target.closest('#loginBtn')) {
        location.hash = 'login';
    }
    if (e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn')) {
        if (confirm('آیا از خروج مطمئن هستید؟')) {
            LS.set('HDK_user', null);
            user = null;
            updateUserLabel();
            notify('خروج انجام شد', 'info');
            location.hash = 'home';
        }
    }
});

// ---- filters.js ----
/* ---------- Update Brand Filter ---------- */
function updateBrandFilter() {
    if (!brandFilter) return;
    brandFilter.innerHTML = '<option value="">همه برندها</option>';
    const brands = [...new Set(products.map(p => p.brand))].filter(b => b);
    brands.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b;
        opt.textContent = b;
        brandFilter.appendChild(opt);
    });
}

/* ---------- New Filter Functions ---------- */
function applyFilters(){
    let list = products.slice();
    const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if(q) list = list.filter(p => p.name.toLowerCase().includes(q) || (p.desc||'').toLowerCase().includes(q));
    
    const mn = Number(minPrice ? minPrice.value || 0 : 0), mx = Number(maxPrice ? maxPrice.value || 0 : 0);
    if(mn>0) list = list.filter(p => (p.price * (1 - (p.discount / 100))) >= mn);
    if(mx>0) list = list.filter(p => (p.price * (1 - (p.discount / 100))) <= mx);
    
    const cat = categoryFilter ? categoryFilter.value : '';
    if(cat) list = list.filter(p => p.category === cat);
    
    const disc = discountFilter ? discountFilter.value : '';
    if(disc === 'has_discount') list = list.filter(p => p.discount > 0);
    if(disc === 'no_discount') list = list.filter(p => p.discount === 0);
    if(disc === 'high_discount') list = list.filter(p => p.discount >= 50);
    
    const brand = brandFilter ? brandFilter.value : '';
    if(brand) list = list.filter(p => p.brand === brand);
    
    const stock = stockFilter ? stockFilter.value : '';
    if(stock === 'in_stock') list = list.filter(p => p.stock > 0);
    if(stock === 'out_of_stock') list = list.filter(p => p.stock === 0);
    
    const rating = ratingFilter ? ratingFilter.value : '';
    if(rating) list = list.filter(p => p.rating >= parseInt(rating));
    
    const sort = sortSelect ? sortSelect.value : 'popular';
    if(sort==='price_asc') list.sort((a,b)=> (a.price*(1-a.discount/100)) - (b.price*(1-b.discount/100)));
    else if(sort==='price_desc') list.sort((a,b)=> (b.price*(1-b.discount/100)) - (a.price*(1-a.discount/100)));
    else if(sort==='discount') list.sort((a,b)=>b.discount - a.discount);
    else if(sort==='newest') list.sort((a,b)=> new Date(b.created || 0) - new Date(a.created || 0));
    else list.sort((a,b)=> (b.rating||0) - (a.rating||0));
    
    renderProducts(list);
    updateActiveFilters();
}

// نمایش فیلترهای فعال
function updateActiveFilters() {
    const activeFilters = $('#activeFilters');
    if (!activeFilters) return;
    
    activeFilters.innerHTML = '';
    
    const filters = [];
    
    if (minPrice.value || maxPrice.value) {
        const min = minPrice.value ? formatPrice(parseInt(minPrice.value)) : '۰';
        const max = maxPrice.value ? formatPrice(parseInt(maxPrice.value)) : '∞';
        filters.push(`قیمت: ${min} - ${max}`);
    }
    
    if (categoryFilter.value) {
        filters.push(`دسته: ${getCategoryName(categoryFilter.value)}`);
    }
    
    if (brandFilter.value) {
        filters.push(`برند: ${brandFilter.value}`);
    }
    
    if (discountFilter.value) {
        const discountLabels = {
            'has_discount': 'دارای تخفیف',
            'no_discount': 'بدون تخفیف',
            'high_discount': 'تخفیف بالا'
        };
        filters.push(discountLabels[discountFilter.value]);
    }
    
    if (stockFilter.value) {
        filters.push(stockFilter.value === 'in_stock' ? 'فقط موجود' : 'فقط ناموجود');
    }
    
    if (ratingFilter.value) {
        filters.push(`${ratingFilter.value} ستاره و بالاتر`);
    }
    
    if (filters.length === 0) {
        activeFilters.innerHTML = '<span class="text-gray-500">هیچ فیلتری اعمال نشده</span>';
        return;
    }
    
    filters.forEach(filter => {
        const badge = document.createElement('span');
        badge.className = 'bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2';
        badge.innerHTML = `
            ${filter}
            <button class="clear-single-filter hover:text-red-500 transition-colors">
                <iconify-icon icon="mdi:close" width="14"></iconify-icon>
            </button>
        `;
        activeFilters.appendChild(badge);
    });
}

// پاک کردن تک فیلتر
function setupSingleFilterClearing() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.clear-single-filter')) {
            const filterText = e.target.closest('span').textContent.trim();
            clearSingleFilter(filterText);
        }
    });
}

function clearSingleFilter(filterText) {
    if (filterText.includes('قیمت')) {
        minPrice.value = '';
        maxPrice.value = '';
    } else if (filterText.includes('دسته')) {
        categoryFilter.value = '';
    } else if (filterText.includes('برند')) {
        brandFilter.value = '';
    } else if (filterText.includes('تخفیف')) {
        discountFilter.value = '';
    } else if (filterText.includes('موجود') || filterText.includes('ناموجود')) {
        stockFilter.value = '';
    } else if (filterText.includes('ستاره')) {
        ratingFilter.value = '';
    }
    
    applyFilters();
}

/* ---------- Filter Sidebar helpers ---------- */
let isFilterOpen = false;
let filterKeydownHandlerAttached = false;

function refreshFilterElements() {
    filterSidebar = $('#filterSidebar');
    closeFilters = $('#closeFilters');
    filterOverlay = $('#filterOverlay');
    sortSelect = $('#sortSelect');
    minPrice = $('#minPrice');
    maxPrice = $('#maxPrice');
    categoryFilter = $('#categoryFilter');
    discountFilter = $('#discountFilter');
    brandFilter = $('#brandFilter');
    stockFilter = $('#stockFilter');
    ratingFilter = $('#ratingFilter');
    priceRange = $('#priceRange');
    applyFilterBtn = $('#applyFilter');
    clearFilterBtn = $('#clearFilter');
}

function setupPriceAccordion() {
    const toggle = $('#togglePriceFilter');
    const fields = $('#priceFilterFields');
    const icon = $('#priceFilterIcon');

    if (!toggle || !fields) return;

    toggle.addEventListener('click', () => {
        const willOpen = fields.classList.contains('hidden');
        fields.classList.toggle('hidden');
        if (icon) {
            icon.classList.toggle('rotate-180', willOpen);
        }
    });
}

function openFilterSidebar() {
    if (!filterSidebar || isFilterOpen) return;
    filterSidebar.classList.add('open');
    filterSidebar.setAttribute('aria-hidden', 'false');
    if (filterOverlay) {
        filterOverlay.classList.remove('hidden');
        filterOverlay.setAttribute('aria-hidden', 'false');
    }
    lockBodyScroll();
    filterSidebar.focus({ preventScroll: true });
    isFilterOpen = true;
}

function closeFilterSidebar() {
    if (!filterSidebar || !isFilterOpen) return;
    filterSidebar.classList.remove('open');
    filterSidebar.setAttribute('aria-hidden', 'true');
    if (filterOverlay) {
        filterOverlay.classList.add('hidden');
        filterOverlay.setAttribute('aria-hidden', 'true');
    }
    unlockBodyScroll();
    isFilterOpen = false;
    if (filterBtn && typeof filterBtn.focus === 'function') {
        filterBtn.focus();
    }
}

/* ---------- Improved Filter Sidebar ---------- */
function setupFilterSidebar() {
    refreshFilterElements();
    setupPriceAccordion();
    updateBrandFilter();
}

/* ---------- Enhanced Filter Functionality ---------- */
function setupFilterToggle() {
    const collapseBtn = $('#filterCollapse');

    if (!filterBtn || !filterSidebar) return;

    filterBtn.addEventListener('click', () => {
        if (isFilterOpen) {
            closeFilterSidebar();
        } else {
            openFilterSidebar();
        }
    });

    if (filterOverlay) {
        filterOverlay.addEventListener('click', closeFilterSidebar);
    }

    if (closeFilters) {
        closeFilters.addEventListener('click', closeFilterSidebar);
    }

    if (collapseBtn) {
        collapseBtn.addEventListener('click', closeFilterSidebar);
    }

    if (!filterKeydownHandlerAttached) {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && isFilterOpen) {
                event.preventDefault();
                closeFilterSidebar();
            }
        });
        filterKeydownHandlerAttached = true;
    }
}

/* ---------- Search Functionality ---------- */
function setupSearch() {
    let searchTimeout;

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (typeof applyFilters === 'function' && currentPage === 'products') {
                    applyFilters();
                }
            }, 500);
        });

        const triggerSearchNavigation = () => {
            const value = searchInput.value.trim();
            const newHash = value ? `#search:${encodeURIComponent(value)}` : '#search';

            if (location.hash === newHash && typeof navigate === 'function') {
                navigate(newHash.slice(1));
            } else {
                location.hash = newHash;
            }
        };

        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                triggerSearchNavigation();
            }
        });

        searchInput.addEventListener('search', triggerSearchNavigation);

        // دکمه پاک کردن جستجو
        const searchContainer = searchInput.parentElement;
        const clearSearch = document.createElement('button');
        clearSearch.innerHTML = '<iconify-icon icon="mdi:close"></iconify-icon>';
        clearSearch.className = 'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors hidden';
        clearSearch.type = 'button';
        searchContainer.classList.add('relative');
        searchContainer.appendChild(clearSearch);
        
        searchInput.addEventListener('input', () => {
            if (searchInput.value) {
                clearSearch.classList.remove('hidden');
            } else {
                clearSearch.classList.add('hidden');
            }
        });
        
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            clearSearch.classList.add('hidden');
            if (typeof applyFilters === 'function' && currentPage === 'products') {
                applyFilters();
            }
            triggerSearchNavigation();
            searchInput.focus();
        });
    }
}

/* ---------- Category-based Filtering ---------- */
function setupCategoryFiltering() {
    document.addEventListener('click', (e) => {
        const categoryLink = e.target.closest('a[href^="#products:"]');
        if (categoryLink) {
            e.preventDefault();
            const category = categoryLink.getAttribute('href').split(':')[1];
            
            // Set category filter
            if (categoryFilter) {
                categoryFilter.value = category;
                applyFilters();
            }
            
            // Navigate to products page
            location.hash = 'products';
        }
    });
}

/* ---------- Price Range Validation ---------- */
function setupPriceValidation() {
    if (minPrice && maxPrice) {
        minPrice.addEventListener('blur', () => {
            const min = parseInt(minPrice.value);
            const max = parseInt(maxPrice.value);

            if (min && max && min > max) {
                notify('حداقل قیمت نمی‌تواند از حداکثر قیمت بیشتر باشد', 'error');
                minPrice.value = '';
                minPrice.focus();
            }
        });

        maxPrice.addEventListener('blur', () => {
            const min = parseInt(minPrice.value);
            const max = parseInt(maxPrice.value);

            if (min && max && max < min) {
                notify('حداکثر قیمت نمی‌تواند از حداقل قیمت کمتر باشد', 'error');
                maxPrice.value = '';
                maxPrice.focus();
            }
        });
    }
}

function bindFilterEvents() {
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);
    if (minPrice) minPrice.addEventListener('change', applyFilters);
    if (maxPrice) maxPrice.addEventListener('change', applyFilters);
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (discountFilter) discountFilter.addEventListener('change', applyFilters);
    if (brandFilter) brandFilter.addEventListener('change', applyFilters);
    if (stockFilter) stockFilter.addEventListener('change', applyFilters);
    if (ratingFilter) ratingFilter.addEventListener('change', applyFilters);

    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            maxPrice.value = e.target.value;
            applyFilters();
        });
    }

    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            applyFilters();
            closeFilterSidebar();
            notify('فیلترها اعمال شدند', 'success');
        });
    }

    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (sortSelect) sortSelect.value = 'popular';
            if (minPrice) minPrice.value = '';
            if (maxPrice) maxPrice.value = '';
            if (categoryFilter) categoryFilter.value = '';
            if (discountFilter) discountFilter.value = '';
            if (brandFilter) brandFilter.value = '';
            if (stockFilter) stockFilter.value = '';
            if (ratingFilter) ratingFilter.value = '';
            if (priceRange) priceRange.value = '50000000';

            applyFilters();
            closeFilterSidebar();
            notify('فیلترها بازنشانی شدند', 'info');
        });
    }
}

mobileMenuBtn.addEventListener('click', ()=> mobileMenu.classList.toggle('hidden'));

$('#wishlistBtn').addEventListener('click', () => location.hash = 'wishlist');
$('#homeLink').addEventListener('click', () => location.hash = 'home');

$$('a[href="#products"]').forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault();
    location.hash = 'products';
}));

$$('a[href="#about"]').forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault();
    location.hash = 'about';
}));

$$('a[href="#contact"]').forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault();
    location.hash = 'contact';
}));

$$('a[href="#blog"]').forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault();
    location.hash = 'blog';
}));

/* ---------- Theme toggle ---------- */
if(localStorage.getItem('hdk_dark') === 'true'){
    root.classList.add('dark'); 
    themeIcon.setAttribute('icon','ph:sun-duotone');
} else {
    themeIcon.setAttribute('icon','ph:moon-duotone');
}

themeToggle.addEventListener('click', ()=> { 
    root.classList.toggle('dark'); 
    const isDark = root.classList.contains('dark'); 
    localStorage.setItem('hdk_dark', String(isDark)); 
    themeIcon.setAttribute('icon', isDark ? 'ph:sun-duotone' : 'ph:moon-duotone'); 
});

/* ---------- Initialize Filters ---------- */
function initializeFilters() {
    setupFilterSidebar();
    bindFilterEvents();
    setupFilterToggle();
    setupSearch();
    setupCategoryFiltering();
    setupPriceValidation();
    setupSingleFilterClearing();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeFilters);

// ---- pages.js ----
/* ---------- Product Detail Page ---------- */
function renderProductDetailPage(id){
    const p = getProductById(id);
    if(!p){ 
        contentRoot.innerHTML = `
            <div class="text-center text-gray-500 py-20">
                <iconify-icon icon="mdi:package-variant-remove" width="64" class="mb-4"></iconify-icon>
                <p class="text-lg">محصول مورد نظر یافت نشد</p>
                <a href="#products" class="text-primary hover:text-primary/80 mt-4 inline-block">بازگشت به محصولات</a>
            </div>
        `; 
        return; 
    }
    
    addViewedProduct(id);
    const finalPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
    const inWishlist = wishlist.includes(p.id);
    const inCompare = compareList.includes(p.id);
    
    const productImages = typeof getProductImages === 'function' ? getProductImages(p) : (p.img ? [p.img] : []);
    const mainImage = productImages.length > 0 ? productImages[0] : '';
    const isOutOfStock = p.stock === 0;
    const initialQuantity = isOutOfStock ? 0 : 1;
    const hasColors = Array.isArray(p.colors) && p.colors.length > 0;
    const hasSizes = Array.isArray(p.sizes) && p.sizes.length > 0;
    const variantSummaryParts = [];
    if (hasColors && p.colors[0]) { variantSummaryParts.push(`رنگ: ${p.colors[0]}`); }
    if (hasSizes && p.sizes[0]) { variantSummaryParts.push(`سایز: ${p.sizes[0]}`); }
    const variantSummaryText = variantSummaryParts.length > 0
        ? `انتخاب شما — ${variantSummaryParts.join(' | ')}`
        : 'گزینه‌ای برای انتخاب وجود ندارد.';
    const addToCartButtonClasses = isOutOfStock
        ? 'add-to-cart flex-1 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2'
        : 'add-to-cart flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2';
    const addToCartIcon = isOutOfStock ? 'mdi:close-circle-outline' : 'mdi:cart-plus';
    const addToCartLabelMarkup = isOutOfStock
        ? '<span class="text-red-500 font-semibold">ناموجود</span>'
        : '<span>افزودن به سبد خرید</span>';
    const buyNowClasses = isOutOfStock
        ? 'buy-now flex-1 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed'
        : 'buy-now flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors';
    const stockLabel = isOutOfStock
        ? '<span class="text-red-500 font-semibold">ناموجود</span>'
        : `<span class="text-green-500 font-semibold">${p.stock} عدد در انبار</span>`;

    const page = document.createElement('div');
    page.innerHTML = `
        <nav class="mb-6" aria-label="مسیر راهنما">
            <ol class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#home" class="hover:text-primary transition-colors">خانه</a></li>
                <li aria-hidden="true"><iconify-icon icon="mdi:chevron-left" width="16"></iconify-icon></li>
                <li><a href="#products" class="hover:text-primary transition-colors">محصولات</a></li>
                <li aria-hidden="true"><iconify-icon icon="mdi:chevron-left" width="16"></iconify-icon></li>
                <li><a href="#products:${p.category}" class="hover:text-primary transition-colors">${getCategoryName(p.category)}</a></li>
                <li aria-hidden="true"><iconify-icon icon="mdi:chevron-left" width="16"></iconify-icon></li>
                <li><span class="text-primary">${p.name}</span></li>
            </ol>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                <div class="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                    ${mainImage
                        ? `<img id="mainProductImage" src="${mainImage}" alt="${p.name}" class="w-full h-96 object-cover rounded-lg" data-active="${mainImage}" />`
                        : `<iconify-icon icon="mdi:image-off" width="64" class="text-gray-400"></iconify-icon>`}
                </div>
                ${productImages.length > 1 ? `
                    <div class="grid grid-cols-4 gap-2 mt-4">
                        ${productImages.map((image, index) => `
                            <button type="button"
                                    class="product-thumbnail h-20 rounded-lg overflow-hidden border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors ${index === 0 ? 'border-primary ring-2 ring-primary/30 shadow-sm' : 'hover:border-primary/60'}"
                                    data-image="${image}"
                                    aria-label="تصویر ${index + 1}"
                                    aria-selected="${index === 0 ? 'true' : 'false'}">
                                <img src="${image}" alt="${p.name}" class="w-full h-20 object-cover" />
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                <div class="flex justify-between items-start mb-4">
                    <h1 class="text-2xl font-bold">${p.name}</h1>
                    <div class="flex gap-2">
                        <button class="add-to-wishlist wishlist-button wishlist-button--compact p-2 transition-colors"
                                data-id="${p.id}"
                                aria-label="${inWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}"
                                data-wishlist-active="${inWishlist ? 'true' : 'false'}"
                                data-label-active="حذف از علاقه‌مندی"
                                data-label-inactive="افزودن به علاقه‌مندی">
                            <span class="wishlist-icon-wrapper">
                                <iconify-icon icon="${inWishlist ? 'mdi:heart' : 'mdi:heart-outline'}" width="24" class="wishlist-icon wishlist-icon-current"></iconify-icon>
                                <iconify-icon icon="${inWishlist ? 'mdi:heart-off' : 'mdi:heart-plus'}" width="24" class="wishlist-icon wishlist-icon-preview"></iconify-icon>
                            </span>
                            <span class="wishlist-tooltip"></span>
                        </button>
                        <button class="add-to-compare p-2 text-gray-500 hover:text-primary transition-colors" data-id="${p.id}">
                            <iconify-icon icon="mdi:scale-balance" width="24"></iconify-icon>
                        </button>
                        ${isOutOfStock ? `
                            <button class="notify-me p-2 text-blue-500 hover:text-blue-600 transition-colors" data-id="${p.id}">
                                <iconify-icon icon="mdi:bell-alert-outline" width="24"></iconify-icon>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <div class="flex items-center gap-2 mb-4">
                    <div class="text-yellow-500">${'★'.repeat(p.rating)}${p.rating < 5 ? '☆'.repeat(5-p.rating) : ''}</div>
                    <span class="text-gray-500 text-sm">(۱۲ نظر)</span>
                </div>

                <div class="mb-6">
                    ${p.discount > 0 ? `
                        <div class="flex items-center gap-4 mb-2">
                            <span class="text-2xl font-bold text-primary">${formatPrice(finalPrice)}</span>
                            <span class="text-lg text-gray-500 line-through">${formatPrice(p.price)}</span>
                            <span class="bg-red-500 text-white px-2 py-1 rounded-full text-sm">${p.discount}% تخفیف</span>
                        </div>
                    ` : `
                        <div class="text-2xl font-bold text-primary mb-2">${formatPrice(finalPrice)}</div>
                    `}

                    ${p.status === 'new' ? `<span class="badge badge-new mr-2">جدید</span>` : ''}
                    ${p.status === 'hot' ? `<span class="badge badge-hot mr-2">فروش ویژه</span>` : ''}
                    ${p.status === 'bestseller' ? `<span class="badge bg-purple-500 text-white mr-2">پرفروش</span>` : ''}
                </div>

                <p class="text-gray-600 dark:text-gray-400 mb-6">${p.desc}</p>

                ${hasColors ? `
                <div class="mb-6">
                    <h3 class="font-medium mb-2">انتخاب رنگ</h3>
                    <div class="flex flex-wrap gap-2">
                        ${p.colors.map((color, index) => `
                            <button type="button"
                                    class="color-option px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${index === 0 ? 'bg-primary/5 border-primary text-primary ring-2 ring-primary/30 shadow-sm' : 'hover:border-primary/60'}"
                                    data-color="${color}"
                                    aria-pressed="${index === 0 ? 'true' : 'false'}">
                                ${color}
                            </button>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                ${hasSizes ? `
                <div class="mb-6">
                    <h3 class="font-medium mb-2">انتخاب سایز</h3>
                    <div class="flex flex-wrap gap-2">
                        ${p.sizes.map((size, index) => `
                            <button type="button"
                                    class="size-option px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${index === 0 ? 'bg-primary/5 border-primary text-primary ring-2 ring-primary/30 shadow-sm' : 'hover:border-primary/60'}"
                                    data-size="${size}"
                                    aria-pressed="${index === 0 ? 'true' : 'false'}">
                                ${size}
                            </button>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                ${(hasColors || hasSizes) ? `
                <div class="selected-variant text-sm text-gray-600 dark:text-gray-300 bg-primary/5 border border-dashed border-primary/30 rounded-xl px-4 py-3 mb-6">
                    ${variantSummaryText}
                </div>
                ` : ''}

                <div class="mb-6">
                    <h3 class="font-medium mb-2">تعداد:</h3>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <button type="button" class="decrease-qty w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : ''}" ${isOutOfStock ? 'disabled aria-disabled="true"' : ''}>-</button>
                            <span class="w-12 text-center text-lg quantity-display">${initialQuantity}</span>
                            <button type="button" class="increase-qty w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : ''}" ${isOutOfStock ? 'disabled aria-disabled="true"' : ''}>+</button>
                        </div>
                        <div class="text-sm text-gray-500">
                            ${stockLabel}
                        </div>
                    </div>
                </div>

                <div class="flex gap-3 mb-6">
                    <button class="${addToCartButtonClasses}" data-id="${p.id}" ${isOutOfStock ? 'disabled aria-disabled="true"' : ''}>
                        <iconify-icon icon="${addToCartIcon}" width="20"></iconify-icon>
                        ${addToCartLabelMarkup}
                    </button>
                    <button class="${buyNowClasses}" data-id="${p.id}" ${isOutOfStock ? 'disabled aria-disabled="true"' : ''}>
                        خرید الآن
                    </button>
                </div>

                <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div class="flex items-center gap-1">
                            <iconify-icon icon="mdi:package-variant"></iconify-icon>
                            <span>ارسال رایگان برای خرید بالای ۵۰۰ هزار تومان</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <iconify-icon icon="mdi:shield-check"></iconify-icon>
                            <span>ضمانت بازگشت ۷ روزه</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Product Tabs -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-primary/20 mb-12">
            <div class="border-b border-gray-200 dark:border-gray-700">
                <div class="flex gap-8 px-6">
                    <button class="tab-button py-4 border-b-2 border-primary text-primary font-medium" data-tab="description">توضیحات محصول</button>
                    <button class="tab-button py-4 border-b-2 border-transparent text-gray-500 hover:text-primary transition-colors" data-tab="specifications">مشخصات فنی</button>
                    <button class="tab-button py-4 border-b-2 border-transparent text-gray-500 hover:text-primary transition-colors" data-tab="reviews">نظرات (۱۲)</button>
                </div>
            </div>
            <div class="p-6">
                <div id="tab-description" class="tab-content active">
                    <p class="text-gray-600 dark:text-gray-400 leading-relaxed">${p.desc}</p>
                    ${p.features.length > 0 ? `
                        <div class="mt-6">
                            <h4 class="font-medium mb-3">ویژگی‌های اصلی:</h4>
                            <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                ${p.features.map(feature => `
                                    <li class="flex items-center gap-2 text-sm">
                                        <iconify-icon icon="mdi:check-circle" class="text-green-500"></iconify-icon>
                                        <span>${feature}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                
                <div id="tab-specifications" class="tab-content">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${Object.entries(p.specifications).map(([key, value]) => `
                            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                <span class="text-gray-600 dark:text-gray-400">${key}:</span>
                                <span class="font-medium">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div id="tab-reviews" class="tab-content">
                    <div class="space-y-6">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="text-center">
                                <div class="text-3xl font-bold text-primary">۴.۲</div>
                                <div class="text-yellow-500">★★★★☆</div>
                                <div class="text-sm text-gray-500 mt-1">بر اساس ۱۲ نظر</div>
                            </div>
                            <div class="flex-1 space-y-2">
                                ${[5,4,3,2,1].map(stars => `
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm w-8">${stars} ستاره</span>
                                        <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div class="bg-yellow-500 h-2 rounded-full" style="width: ${stars === 5 ? '70%' : stars === 4 ? '20%' : stars === 3 ? '8%' : stars === 2 ? '2%' : '0%'}"></div>
                                        </div>
                                        <span class="text-sm w-8 text-gray-500">${stars === 5 ? '۷۰%' : stars === 4 ? '۲۰%' : stars === 3 ? '۸%' : stars === 2 ? '۲%' : '۰%'}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="space-y-4">
                            ${[1,2,3].map(i => `
                                <div class="border-b border-gray-100 dark:border-gray-700 pb-4">
                                    <div class="flex justify-between items-start mb-2">
                                        <div>
                                            <div class="font-medium">کاربر ${i}</div>
                                            <div class="text-yellow-500 text-sm">★★★★★</div>
                                        </div>
                                        <span class="text-sm text-gray-500">۱۴۰۲/۱۰/${10+i}</span>
                                    </div>
                                    <p class="text-gray-600 dark:text-gray-400 text-sm">محصول بسیار با کیفیتی بود. از خریدم راضی هستم و توصیه می‌کنم.</p>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="mt-6">
                            <h4 class="font-medium mb-4">ثبت نظر</h4>
                            <form class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium mb-2">امتیاز شما</label>
                                    <div class="flex gap-1" id="rating-stars">
                                        ${[1,2,3,4,5].map(star => `
                                            <iconify-icon icon="mdi:star-outline" class="rating-star text-2xl text-gray-300 cursor-pointer" data-rating="${star}"></iconify-icon>
                                        `).join('')}
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-2">نظر شما</label>
                                    <textarea rows="4" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" placeholder="نظر خود را بنویسید..."></textarea>
                                </div>
                                <button type="submit" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">ثبت نظر</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Related Products -->
        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6">محصولات مرتبط</h2>
            <div id="relatedProducts" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"></div>
        </section>
    `;
    contentRoot.appendChild(page);
    
    // Show related products (same category)
    const related = products.filter(product => 
        product.category === p.category && product.id !== p.id
    ).slice(0, 4);
    renderProductsList(related, $('#relatedProducts'));
    
    // Add event listeners
    setupProductDetailEvents(page, p);
}

function setupProductDetailEvents(page, product) {
    const isOutOfStock = product.stock === 0;
    let quantity = isOutOfStock ? 0 : 1;
    const quantityDisplay = $('.quantity-display', page);
    const decreaseBtn = $('.decrease-qty', page);
    const increaseBtn = $('.increase-qty', page);
    const addToCartButton = $('.add-to-cart', page);
    const buyNowButton = $('.buy-now', page);
    const colorButtons = $$('.color-option', page);
    const sizeButtons = $$('.size-option', page);
    const variantSummary = $('.selected-variant', page);
    const thumbnails = $$('.product-thumbnail', page);
    const mainImageEl = $('#mainProductImage', page);
    let activeImage = mainImageEl ? (mainImageEl.getAttribute('data-active') || mainImageEl.getAttribute('src')) : null;
    let selectedColor = colorButtons.length > 0 ? colorButtons[0].getAttribute('data-color') : null;
    let selectedSize = sizeButtons.length > 0 ? sizeButtons[0].getAttribute('data-size') : null;

    if (quantityDisplay) {
        quantityDisplay.textContent = quantity;
    }

    const updateVariantButtons = (buttons, selectedValue, attribute) => {
        if (!Array.isArray(buttons) || buttons.length === 0) return;
        buttons.forEach(btn => {
            const value = btn.getAttribute(`data-${attribute}`);
            const isActive = value === selectedValue;
            btn.classList.toggle('border-primary', isActive);
            btn.classList.toggle('text-primary', isActive);
            btn.classList.toggle('bg-primary/5', isActive);
            btn.classList.toggle('shadow-sm', isActive);
            btn.classList.toggle('ring-2', isActive);
            btn.classList.toggle('ring-primary/30', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    };

    const updateVariantSummary = () => {
        if (!variantSummary) return;
        const parts = [];
        if (selectedColor) parts.push(`رنگ: ${selectedColor}`);
        if (selectedSize) parts.push(`سایز: ${selectedSize}`);
        variantSummary.textContent = parts.length > 0
            ? `انتخاب شما — ${parts.join(' | ')}`
            : 'گزینه‌ای برای انتخاب وجود ندارد.';
    };

    const syncVariantDataAttributes = () => {
        if (addToCartButton) {
            if (selectedColor) {
                addToCartButton.setAttribute('data-color', selectedColor);
            } else {
                addToCartButton.removeAttribute('data-color');
            }
            if (selectedSize) {
                addToCartButton.setAttribute('data-size', selectedSize);
            } else {
                addToCartButton.removeAttribute('data-size');
            }
        }
        if (buyNowButton) {
            if (selectedColor) {
                buyNowButton.setAttribute('data-color', selectedColor);
            } else {
                buyNowButton.removeAttribute('data-color');
            }
            if (selectedSize) {
                buyNowButton.setAttribute('data-size', selectedSize);
            } else {
                buyNowButton.removeAttribute('data-size');
            }
        }
    };

    const updateThumbnailState = (activeSrc) => {
        if (!Array.isArray(thumbnails) || thumbnails.length === 0) return;
        thumbnails.forEach(btn => {
            const isActive = btn.getAttribute('data-image') === activeSrc;
            btn.classList.toggle('border-primary', isActive);
            btn.classList.toggle('ring-2', isActive);
            btn.classList.toggle('ring-primary/30', isActive);
            btn.classList.toggle('shadow-sm', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    };

    updateVariantButtons(colorButtons, selectedColor, 'color');
    updateVariantButtons(sizeButtons, selectedSize, 'size');
    updateVariantSummary();
    syncVariantDataAttributes();
    updateThumbnailState(activeImage);

    // Quantity controls
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            if (isOutOfStock) return;
            if (quantity > 1) {
                quantity--;
                if (quantityDisplay) {
                    quantityDisplay.textContent = quantity;
                }
            }
        });
    }

    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            if (isOutOfStock) return;
            if (quantity < product.stock) {
                quantity++;
                if (quantityDisplay) {
                    quantityDisplay.textContent = quantity;
                }
            }
        });
    }

    // Product actions
    page.addEventListener('click', (e) => {
        const colorBtn = e.target.closest('.color-option');
        if (colorBtn) {
            selectedColor = colorBtn.getAttribute('data-color');
            updateVariantButtons(colorButtons, selectedColor, 'color');
            updateVariantSummary();
            syncVariantDataAttributes();
            return;
        }

        const sizeBtn = e.target.closest('.size-option');
        if (sizeBtn) {
            selectedSize = sizeBtn.getAttribute('data-size');
            updateVariantButtons(sizeButtons, selectedSize, 'size');
            updateVariantSummary();
            syncVariantDataAttributes();
            return;
        }

        const thumbnailBtn = e.target.closest('.product-thumbnail');
        if (thumbnailBtn) {
            const image = thumbnailBtn.getAttribute('data-image');
            if (image && mainImageEl) {
                mainImageEl.src = image;
                mainImageEl.setAttribute('data-active', image);
                activeImage = image;
            }
            updateThumbnailState(activeImage);
            return;
        }

        const addBtn = e.target.closest('.add-to-cart');
        if(addBtn){
            if (isOutOfStock) {
                notify('این محصول در حال حاضر موجود نیست', 'warning');
                return;
            }
            addToCart(addBtn.getAttribute('data-id'), quantity);
            return;
        }

        const favBtn = e.target.closest('.add-to-wishlist');
        if(favBtn){
            toggleWishlist(favBtn.getAttribute('data-id'));
            return;
        }

        const compBtn = e.target.closest('.add-to-compare');
        if(compBtn){
            toggleCompare(compBtn.getAttribute('data-id'));
            return;
        }

        const notifyBtn = e.target.closest('.notify-me');
        if(notifyBtn){
            showNotifyMeModal(product);
            return;
        }

        const buyBtn = e.target.closest('.buy-now');
        if(buyBtn){
            if (isOutOfStock) {
                notify('این محصول در حال حاضر موجود نیست', 'warning');
                return;
            }
            addToCart(buyBtn.getAttribute('data-id'), quantity);
            location.hash = 'checkout';
            return;
        }

        const tabBtn = e.target.closest('.tab-button');
        if(tabBtn){
            $$('.tab-button', page).forEach(btn => {
                btn.classList.remove('border-primary', 'text-primary');
                btn.classList.add('border-transparent', 'text-gray-500');
            });
            tabBtn.classList.add('border-primary', 'text-primary');
            tabBtn.classList.remove('border-transparent', 'text-gray-500');

            $$('.tab-content', page).forEach(content => content.classList.remove('active'));
            $(`#tab-${tabBtn.getAttribute('data-tab')}`, page).classList.add('active');
            return;
        }

        const star = e.target.closest('.rating-star');
        if(star){
            const rating = parseInt(star.getAttribute('data-rating'));
            $$('.rating-star', page).forEach((s, index) => {
                if(index < rating){
                    s.classList.add('filled');
                    s.setAttribute('icon', 'mdi:star');
                } else {
                    s.classList.remove('filled');
                    s.setAttribute('icon', 'mdi:star-outline');
                }
            });
            return;
        }
    });

    const relatedProducts = $('#relatedProducts', page);
    if (relatedProducts) {
        relatedProducts.addEventListener('click', handleProductActions);
    }
}

function showNotifyMeModal(product) {
    const modalHTML = createNotifyMeModal(product);
    const template = document.createElement('div');
    template.innerHTML = modalHTML.trim();
    const modalOverlay = template.firstElementChild;
    if (!modalOverlay) return;

    const dialog = modalOverlay.querySelector('[data-modal-dialog]');
    const closeButtons = modalOverlay.querySelectorAll('.close-notify-modal');
    const form = modalOverlay.querySelector('#notifyMeForm');
    const previouslyFocused = document.activeElement;

    let isClosing = false;

    const handleKeydown = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeModal();
        }
    };

    const handleOverlayClick = (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    };

    const closeModal = () => {
        if (isClosing) return;
        isClosing = true;
        modalOverlay.setAttribute('aria-hidden', 'true');
        modalOverlay.classList.remove('modal-visible');
        modalOverlay.classList.add('modal-closing');
        unlockBodyScroll();
        document.removeEventListener('keydown', handleKeydown);
        modalOverlay.removeEventListener('click', handleOverlayClick);
        closeButtons.forEach(btn => btn.removeEventListener('click', handleCloseButton));

        const removeModal = () => {
            modalOverlay.removeEventListener('transitionend', removeModal);
            if (modalOverlay.parentElement) {
                modalOverlay.parentElement.removeChild(modalOverlay);
            }
            if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
                previouslyFocused.focus();
            }
        };

        modalOverlay.addEventListener('transitionend', removeModal);
        setTimeout(removeModal, 220);
    };

    const handleCloseButton = (event) => {
        event.preventDefault();
        closeModal();
    };

    closeButtons.forEach(btn => btn.addEventListener('click', handleCloseButton));

    modalOverlay.addEventListener('click', handleOverlayClick);
    document.addEventListener('keydown', handleKeydown);

    document.body.appendChild(modalOverlay);
    modalOverlay.setAttribute('aria-hidden', 'false');
    lockBodyScroll();
    requestAnimationFrame(() => modalOverlay.classList.add('modal-visible'));

    if (dialog) {
        dialog.focus({ preventScroll: true });
    }

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        const phone = form.querySelector('input[type="tel"]').value;

        if (!validateEmail(email)) {
            notify('ایمیل وارد شده معتبر نیست', 'error');
            return;
        }

        if (!validatePhone(phone)) {
            notify('شماره تلفن معتبر نیست', 'error');
            return;
        }

        // Save notification request
        const notification = {
            id: uid('n'),
            productId: product.id,
            productName: product.name,
            email: email,
            phone: phone,
            date: new Date().toISOString(),
            notified: false
        };
        
        notifications.push(notification);
        LS.set('HDK_notifications', notifications);

        closeModal();
        notify('درخواست شما ثبت شد. هنگام موجود شدن محصول به شما اطلاع داده خواهد شد.', 'success');
    });
}

/* ---------- Wishlist Page ---------- */
function renderWishlistPage(){
    const wishlistProducts = products.filter(p => wishlist.includes(p.id));
    const page = document.createElement('div');
    page.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">لیست علاقه‌مندی‌ها</h1>
            <span class="text-gray-600 dark:text-gray-400">${wishlist.length} محصول</span>
        </div>
        ${wishlist.length === 0 ? `
            <div class="py-12">
                ${createEmptyState({
                    icon: 'mdi:heart-off',
                    title: 'لیست علاقه‌مندی‌های شما خالی است',
                    description: 'برای ذخیره محصولات محبوب خود، آن‌ها را به لیست علاقه‌مندی‌ها اضافه کنید.',
                    actions: '<a href="#products" class="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"><iconify-icon icon="mdi:shopping-outline" width="20"></iconify-icon><span>مشاهده محصولات</span></a>'
                })}
            </div>
        ` : `
            <div id="wishlistProducts" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"></div>
        `}
    `;
    contentRoot.appendChild(page);
    
    if(wishlist.length > 0){
        renderProductsList(wishlistProducts, $('#wishlistProducts'));
        $('#wishlistProducts').addEventListener('click', handleProductActions);
    }
}

/* ---------- Compare Page ---------- */
function renderComparePage(){
    openCompareModal();
    navigate('products');
}

/* ---------- Cart Page ---------- */
function renderCartPage(){
    cartSidebar.classList.add('open');
    navigate('products');
}

/* ---------- Address Management ---------- */
function renderAddressesPage() {
    if (!user) {
        notify('لطفا ابتدا وارد حساب کاربری خود شوید', 'warning');
        location.hash = 'login';
        return;
    }
    
    const userAddresses = addresses.filter(addr => addr.userId === user.id);
    
    const page = document.createElement('div');
    page.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">آدرس‌های من</h1>
            <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors" id="addAddressBtn">
                افزودن آدرس جدید
            </button>
        </div>
        
        <div id="addressesList" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            ${userAddresses.length === 0 ? `
                <div class="col-span-full text-center py-12">
                    <iconify-icon icon="mdi:map-marker-off" width="64" class="text-gray-400 mb-4"></iconify-icon>
                    <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">هنوز آدرسی ثبت نکرده‌اید</p>
                </div>
            ` : userAddresses.map(address => createAddressCard(address, address.isDefault)).join('')}
        </div>
        
        <div id="addressFormContainer" class="hidden"></div>
    `;
    
    contentRoot.appendChild(page);
    setupAddressEvents();
}

function setupAddressEvents() {
    $('#addAddressBtn').addEventListener('click', showAddressForm);
    
    // Edit address
    document.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-address');
        if (editBtn) {
            const addressId = editBtn.getAttribute('data-id');
            const address = addresses.find(addr => addr.id === addressId);
            if (address) {
                showAddressForm(address);
            }
        }
    });
    
    // Delete address
    document.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-address');
        if (deleteBtn) {
            const addressId = deleteBtn.getAttribute('data-id');
            deleteAddress(addressId);
        }
    });
    
    // Set default address
    document.addEventListener('click', (e) => {
        const setDefaultBtn = e.target.closest('.set-default-address');
        if (setDefaultBtn) {
            const addressId = setDefaultBtn.getAttribute('data-id');
            setDefaultAddress(addressId);
        }
    });
}

function showAddressForm(address = null) {
    const formContainer = $('#addressFormContainer');
    formContainer.innerHTML = createAddressForm(address);
    formContainer.classList.remove('hidden');
    
    // Load provinces and cities
    loadProvinces();
    if (address?.province) {
        loadCities(address.province);
    }
    
    // Province change handler
    $('#addressProvince').addEventListener('change', function() {
        loadCities(this.value);
    });
    
    // Form submission
    $('#addressForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveAddress(address?.id);
    });
    
    // Cancel button
    $('.cancel-address-form').addEventListener('click', () => {
        formContainer.classList.add('hidden');
    });
}

function saveAddress(addressId = null) {
    const form = $('#addressForm');
    const formData = {
        title: form.querySelector('input[type="text"]').value,
        province: $('#addressProvince').value,
        city: $('#addressCity').value,
        fullAddress: form.querySelector('textarea').value,
        postalCode: form.querySelector('input[data-postal]').value,
        phone: form.querySelector('input[data-phone]').value,
        isDefault: form.querySelector('#isDefault').checked,
        userId: user.id
    };
    
    // Validation
    if (!validatePostalCode(formData.postalCode)) {
        notify('کد پستی باید 10 رقمی باشد', 'error');
        return;
    }

    if (!validatePhone(formData.phone)) {
        notify('شماره تلفن معتبر نیست', 'error');
        return;
    }
    
    if (addressId) {
        // Update existing address
        const index = addresses.findIndex(addr => addr.id === addressId);
        if (index !== -1) {
            addresses[index] = { ...addresses[index], ...formData };
        }
    } else {
        // Add new address
        const newAddress = {
            id: uid('addr'),
            ...formData
        };
        addresses.push(newAddress);
    }
    
    // If this is set as default, remove default from others
    if (formData.isDefault) {
        addresses.forEach(addr => {
            if (addr.userId === user.id && addr.id !== addressId) {
                addr.isDefault = false;
            }
        });
    }
    
    LS.set('HDK_addresses', addresses);
    $('#addressFormContainer').classList.add('hidden');
    notify(addressId ? 'آدرس با موفقیت ویرایش شد' : 'آدرس جدید با موفقیت اضافه شد', 'success');
    
    // Refresh addresses page
    if (currentPage === 'addresses') {
        renderAddressesPage();
    }
}

function deleteAddress(addressId) {
    if (confirm('آیا از حذف این آدرس مطمئن هستید؟')) {
        addresses = addresses.filter(addr => addr.id !== addressId);
        LS.set('HDK_addresses', addresses);
        notify('آدرس با موفقیت حذف شد', 'success');
        
        // Refresh addresses page
        if (currentPage === 'addresses') {
            renderAddressesPage();
        }
    }
}

function setDefaultAddress(addressId) {
    addresses.forEach(addr => {
        if (addr.userId === user.id) {
            addr.isDefault = addr.id === addressId;
        }
    });
    
    LS.set('HDK_addresses', addresses);
    notify('آدرس پیش‌فرض تغییر کرد', 'success');
    
    // Refresh addresses page
    if (currentPage === 'addresses') {
        renderAddressesPage();
    }
}

// ---- ui.js ----
/* ---------- Checkout Page ---------- */
function renderCheckoutPage(){
    const page = document.createElement('div');
    page.innerHTML = `
        <h1 class="text-2xl font-bold mb-6">تسویه حساب</h1>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20 mb-6">
                    <h2 class="text-lg font-bold mb-4">اطلاعات ارسال</h2>
                    <form class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">نام</label>
                                <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" value="${user ? user.name : ''}">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">نام خانوادگی</label>
                                <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">آدرس</label>
                            <textarea rows="3" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"></textarea>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">شهر</label>
                                <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">استان</label>
                                <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">کد پستی</label>
                                <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">شماره تماس</label>
                            <input type="tel" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" value="${user ? user.phone : ''}">
                        </div>
                    </form>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                    <h2 class="text-lg font-bold mb-4">روش پرداخت</h2>
                    ${createPaymentOptions('online')}
                </div>
            </div>
            
            <div>
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20 sticky top-4">
                    <h2 class="text-lg font-bold mb-4">خلاصه سفارش</h2>
                    <div id="checkoutItems" class="space-y-3 mb-4">
                        <!-- Cart items will be populated here -->
                    </div>
                    <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                        <div class="flex justify-between">
                            <span>جمع کل:</span>
                            <span id="checkoutTotal">۰ تومان</span>
                        </div>
                        <div class="flex justify-between">
                            <span>تخفیف:</span>
                            <span id="checkoutDiscount" class="text-green-500">۰ تومان</span>
                        </div>
                        <div class="flex justify-between">
                            <span>هزینه ارسال:</span>
                            <span id="checkoutShipping">۰ تومان</span>
                        </div>
                        <div class="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                            <span>مبلغ قابل پرداخت:</span>
                            <span id="checkoutFinalTotal">۰ تومان</span>
                        </div>
                    </div>
                    <button class="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors mt-6">
                        پرداخت و ثبت سفارش
                    </button>
                </div>
            </div>
        </div>
    `;
    contentRoot.appendChild(page);
    updateCheckoutDisplay();
}

function updateCheckoutDisplay() {
    const checkoutItems = $('#checkoutItems');
    const checkoutTotal = $('#checkoutTotal');
    const checkoutDiscount = $('#checkoutDiscount');
    const checkoutShipping = $('#checkoutShipping');
    const checkoutFinalTotal = $('#checkoutFinalTotal');
    
    if (!checkoutItems) return;
    
    checkoutItems.innerHTML = '';
    if (cart.length === 0) {
        checkoutItems.innerHTML = '<p class="text-gray-500 text-center">سبد خرید خالی است</p>';
        checkoutTotal.textContent = '۰ تومان';
        checkoutDiscount.textContent = '۰ تومان';
        checkoutShipping.textContent = '۰ تومان';
        checkoutFinalTotal.textContent = '۰ تومان';
        return;
    }
    
    let total = 0;
    let totalDiscount = 0;
    
    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (!product) return;
        
        const finalPrice = product.discount > 0 ? 
            product.price * (1 - product.discount / 100) : product.price;
        const itemTotal = finalPrice * item.qty;
        const itemDiscount = (product.price - finalPrice) * item.qty;
        
        total += itemTotal;
        totalDiscount += itemDiscount;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'flex justify-between items-center text-sm';
        itemEl.innerHTML = `
            <div>
                <div class="font-medium">${product.name}</div>
                <div class="text-gray-500">${item.qty} × ${formatPrice(finalPrice)}</div>
            </div>
            <div class="font-medium">${formatPrice(itemTotal)}</div>
        `;
        checkoutItems.appendChild(itemEl);
    });
    
    const shippingCost = total > 500000 ? 0 : 30000;
    const finalTotal = total + shippingCost;
    
    checkoutTotal.textContent = formatPrice(total + totalDiscount);
    checkoutDiscount.textContent = formatPrice(totalDiscount);
    checkoutShipping.textContent = shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost);
    checkoutFinalTotal.textContent = formatPrice(finalTotal);
}

/* ---------- About Page ---------- */
function renderAboutPage(){
    const page = document.createElement('div');
    page.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-primary/20">
            <h1 class="text-3xl font-bold mb-6 text-primary">درباره HDKALA</h1>
            <div class="prose prose-lg dark:prose-invert max-w-none">
                <p class="text-lg leading-relaxed mb-6">
                    فروشگاه اینترنتی HDKALA با هدف ارائه بهترین تجربه خرید آنلاین برای کاربران ایرانی در سال ۱۴۰۲ تأسیس شد. 
                    ما بر این باوریم که خرید آنلاین باید ساده, مطمئن و لذت‌بخش باشد.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                    <div class="bg-primary/10 p-6 rounded-xl">
                        <iconify-icon icon="mdi:shield-check" width="48" class="text-primary mb-4"></iconify-icon>
                        <h3 class="text-xl font-bold mb-2">ضمانت اصالت کالا</h3>
                        <p class="text-gray-600 dark:text-gray-400">همه محصولات ما دارای ضمانت اصالت و سلامت فیزیکی هستند.</p>
                    </div>
                    <div class="bg-green-500/10 p-6 rounded-xl">
                        <iconify-icon icon="mdi:package-variant" width="48" class="text-green-500 mb-4"></iconify-icon>
                        <h3 class="text-xl font-bold mb-2">ارسال سریع</h3>
                        <p class="text-gray-600 dark:text-gray-400">ارسال رایگان برای خریدهای بالای ۵۰۰ هزار تومان در سراسر کشور.</p>
                    </div>
                    <div class="bg-blue-500/10 p-6 rounded-xl">
                        <iconify-icon icon="mdi:headset" width="48" class="text-blue-500 mb-4"></iconify-icon>
                        <h3 class="text-xl font-bold mb-2">پشتیبانی ۲۴/۷</h3>
                        <p class="text-gray-600 dark:text-gray-400">تیم پشتیبانی ما همیشه آماده پاسخگویی به سوالات شماست.</p>
                    </div>
                    <div class="bg-purple-500/10 p-6 rounded-xl">
                        <iconify-icon icon="mdi:arrow-u-turn-left" width="48" class="text-purple-500 mb-4"></iconify-icon>
                        <h3 class="text-xl font-bold mb-2">بازگشت ۷ روزه</h3>
                        <p class="text-gray-600 dark:text-gray-400">امکان بازگشت کالا تا ۷ روز پس از دریافت برای همه محصولات.</p>
                    </div>
                </div>
                <h2 class="text-2xl font-bold mt-8 mb-4">چرا HDKALA را انتخاب کنید؟</h2>
                <ul class="space-y-3 mb-6">
                    <li class="flex items-center gap-2">
                        <iconify-icon icon="mdi:check-circle" class="text-green-500"></iconify-icon>
                        <span>تنوع بی‌نظیر محصولات از برندهای معتبر</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <iconify-icon icon="mdi:check-circle" class="text-green-500"></iconify-icon>
                        <span>قیمت‌های رقابتی و تخفیف‌های ویژه</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <iconify-icon icon="mdi:check-circle" class="text-green-500"></iconify-icon>
                        <span>سیستم ارسال سریع و بهینه</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <iconify-icon icon="mdi:check-circle" class="text-green-500"></iconify-icon>
                        <span>پشتیبانی حرفه‌ای و پاسخگویی سریع</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <iconify-icon icon="mdi:check-circle" class="text-green-500"></iconify-icon>
                        <span>امنیت کامل در پرداخت‌های آنلاین</span>
                    </li>
                </ul>
            </div>
        </div>
    `;
    contentRoot.appendChild(page);
}

/* ---------- Contact Page ---------- */
function renderContactPage(){
    const page = document.createElement('div');
    page.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-primary/20">
                <h1 class="text-3xl font-bold mb-6 text-primary">تماس با ما</h1>
                <form class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">نام</label>
                            <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">نام خانوادگی</label>
                            <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" required>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">ایمیل</label>
                        <input type="email" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">موضوع</label>
                        <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">پیام</label>
                        <textarea rows="5" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" required></textarea>
                    </div>
                    <button type="submit" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">ارسال پیام</button>
                </form>
            </div>
            <div class="space-y-6">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                    <h2 class="text-xl font-bold mb-4">اطلاعات تماس</h2>
                    <div class="space-y-4">
                        <div class="flex items-center gap-3">
                            <iconify-icon icon="mdi:phone" width="24" class="text-primary"></iconify-icon>
                            <div>
                                <div class="font-medium">تلفن پشتیبانی</div>
                                <div class="text-gray-600 dark:text-gray-400">۰۲۱-۱۲۳۴۵۶۷۸</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <iconify-icon icon="mdi:email" width="24" class="text-primary"></iconify-icon>
                            <div>
                                <div class="font-medium">ایمیل</div>
                                <div class="text-gray-600 dark:text-gray-400">info@hdkala.com</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <iconify-icon icon="mdi:map-marker" width="24" class="text-primary"></iconify-icon>
                            <div>
                                <div class="font-medium">آدرس</div>
                                <div class="text-gray-600 dark:text-gray-400">تهران، خیابان ولیعصر، پلاک ۱۲۳۴</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <iconify-icon icon="mdi:clock" width="24" class="text-primary"></iconify-icon>
                            <div>
                                <div class="font-medium">ساعات کاری</div>
                                <div class="text-gray-600 dark:text-gray-400">هر روز از ۹ صبح تا ۹ شب</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                    <h2 class="text-xl font-bold mb-4">پرسش‌های متداول</h2>
                    <div class="space-y-4">
                        <div>
                            <h3 class="font-medium mb-2">چگونه می‌توانم سفارشم را پیگیری کنم؟</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">پس از ثبت سفارش، کد رهگیری برای شما ارسال می‌شود که می‌توانید از طریق آن سفارش خود را پیگیری کنید.</p>
                        </div>
                        <div>
                            <h3 class="font-medium mb-2">شرایط بازگشت کالا چگونه است؟</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">تا ۷ روز پس از دریافت کالا امکان بازگشت وجود دارد. کالا باید در شرایط اولیه و بدون استفاده باشد.</p>
                        </div>
                        <div>
                            <h3 class="font-medium mb-2">هزینه ارسال چقدر است؟</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">برای خریدهای بالای ۵۰۰ هزار تومان، ارسال رایگان است. در غیر این صورت هزینه ارسال ۳۰ هزار تومان می‌باشد.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    contentRoot.appendChild(page);
}

/* ---------- Blog Page ---------- */
function renderBlogPage(){
    const page = document.createElement('div');
    page.innerHTML = `
        <h1 class="text-3xl font-bold mb-8 text-primary">بلاگ HDKALA</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${blogs.map(blog => `
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-primary/20 hover:shadow-lg transition-shadow">
                    <div class="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        ${blog.image ? 
                            `<img src="${blog.image}" alt="${blog.title}" class="w-full h-48 object-cover" />` :
                            `<iconify-icon icon="mdi:image-off" width="48" class="text-gray-400"></iconify-icon>`
                        }
                    </div>
                    <div class="p-6">
                        <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">${blog.category}</span>
                        <h3 class="font-bold text-xl mt-3 mb-2">${blog.title}</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">${blog.excerpt}</p>
                        <div class="flex justify-between items-center text-sm text-gray-500">
                            <span>${blog.date}</span>
                            <a href="#blog:${blog.id}" class="text-primary hover:text-primary/80 transition-colors">ادامه مطلب</a>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    contentRoot.appendChild(page);
}

/* ---------- Profile Page ---------- */
function renderProfilePage(){
    const page = document.createElement('div');
    page.innerHTML = `
        <h1 class="text-2xl font-bold mb-6">پروفایل کاربری</h1>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                    <h2 class="text-lg font-bold mb-4">اطلاعات شخصی</h2>
                    <form class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">نام</label>
                                <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" value="${user ? user.name : ''}">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">شماره تلفن</label>
                                <input type="tel" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" value="${user ? user.phone : ''}" readonly>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">ایمیل</label>
                            <input type="email" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                        </div>
                        <button type="submit" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">ذخیره تغییرات</button>
                    </form>
                </div>
            </div>
            <div class="space-y-6">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20 text-center">
                    <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <iconify-icon icon="mdi:user" width="32" class="text-primary"></iconify-icon>
                    </div>
                    <h3 class="font-bold text-lg">${user ? user.name : 'کاربر'}</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">${user ? user.phone : ''}</p>
                    <p class="text-gray-500 text-xs mt-2">عضو از ${user ? new Date(user.created).toLocaleDateString('fa-IR') : '---'}</p>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                    <h3 class="font-bold mb-4">آمار شما</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">تعداد سفارشات</span>
                            <span class="font-medium">${orders.length}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">علاقه‌مندی‌ها</span>
                            <span class="font-medium">${wishlist.length}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">نظرات</span>
                            <span class="font-medium">۰</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    contentRoot.appendChild(page);
}

/* ---------- Orders Page ---------- */
function formatOrderDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
        return date.toLocaleString('fa-IR');
    }
    return value;
}

function getOrderStatusInfo(status) {
    const normalized = (status || '').toString().trim();
    const map = {
        'processing': { label: 'در حال پردازش', className: 'bg-yellow-500/10 text-yellow-500' },
        'در حال پردازش': { label: 'در حال پردازش', className: 'bg-yellow-500/10 text-yellow-500' },
        'shipped': { label: 'ارسال شده', className: 'bg-blue-500/10 text-blue-500' },
        'ارسال شده': { label: 'ارسال شده', className: 'bg-blue-500/10 text-blue-500' },
        'delivered': { label: 'تحویل شده', className: 'bg-green-500/10 text-green-500' },
        'تحویل شده': { label: 'تحویل شده', className: 'bg-green-500/10 text-green-500' },
        'cancelled': { label: 'لغو شده', className: 'bg-red-500/10 text-red-500' },
        'لغو شده': { label: 'لغو شده', className: 'bg-red-500/10 text-red-500' }
    };
    return map[normalized] || { label: normalized || 'نامشخص', className: 'bg-gray-500/10 text-gray-500' };
}

function renderOrdersPage(){
    const page = document.createElement('div');
    page.innerHTML = `
        <h1 class="text-2xl font-bold mb-6">سفارش‌های من</h1>
        ${orders.length === 0 ? `
            <div class="py-12">
                ${createEmptyState({
                    icon: 'mdi:clipboard-text-outline',
                    title: 'سفارشی ثبت نشده است',
                    description: 'پس از ثبت سفارش، تاریخچه و وضعیت سفارش‌های شما در اینجا نمایش داده می‌شود.',
                    actions: '<a href="#products" class="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"><iconify-icon icon="mdi:shopping-outline" width="20"></iconify-icon><span>شروع خرید</span></a>'
                })}
            </div>
        ` : `
            <div class="space-y-4">
                ${orders.map(order => {
                    const statusInfo = getOrderStatusInfo(order.status);
                    const paymentInfo = typeof getPaymentMethod === 'function' ? getPaymentMethod(order.paymentMethod) : null;
                    const shippingInfo = typeof getShippingMethod === 'function' ? getShippingMethod(order.shippingMethod) : null;
                    const shippingName = order.shippingTitle || (shippingInfo ? shippingInfo.name : '');
                    const shippingCostValue = typeof order.shippingCost === 'number' ? order.shippingCost : null;
                    const shippingCostLabel = shippingCostValue === null ? '—' : (shippingCostValue === 0 ? 'رایگان' : formatPrice(shippingCostValue));
                    const subtotal = typeof order.subtotal === 'number' ? order.subtotal : (typeof order.total === 'number' ? order.total : 0);
                    const discount = typeof order.discount === 'number' ? order.discount : 0;
                    const totalValue = typeof order.total === 'number' ? order.total : subtotal + (shippingCostValue || 0);
                    const items = Array.isArray(order.items) ? order.items : [];
                    const address = order.address || null;

                    const itemsMarkup = items.map(item => {
                        const product = getProductById(item.productId);
                        const itemName = product ? product.name : `محصول ${item.productId}`;
                        const itemImage = product ? (typeof getPrimaryProductImage === 'function' ? getPrimaryProductImage(product) : product.img) : null;
                        const itemQty = item.qty || 1;
                        const itemPrice = product
                            ? (product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price)
                            : null;
                        const lineTotal = itemPrice !== null ? formatPrice(itemPrice * itemQty) : '—';

                        return `
                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        ${itemImage
                                            ? `<img src=\"${itemImage}\" alt=\"${itemName}\" class=\"w-12 h-12 object-cover rounded-lg\" />`
                                            : `<iconify-icon icon=\"mdi:package\" width=\"20\" class=\"text-gray-400\"></iconify-icon>`}
                                    </div>
                                    <div>
                                        <div class="font-medium">${itemName}</div>
                                        <div class="text-gray-500 text-sm">${itemQty} عدد</div>
                                    </div>
                                </div>
                                <div class="font-medium">${lineTotal}</div>
                            </div>
                        `;
                    }).join('') || '<div class=\"text-sm text-gray-500\">آیتمی برای نمایش وجود ندارد</div>';

                    return `
                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3 class="font-bold text-lg">سفارش #${order.id}</h3>
                                    <p class="text-gray-600 dark:text-gray-400 text-sm">${formatOrderDate(order.date)}</p>
                                </div>
                                <span class="px-3 py-1 rounded-full text-sm ${statusInfo.className}">${statusInfo.label}</span>
                            </div>

                            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                ${shippingName ? `<span class=\"flex items-center gap-2\"><iconify-icon icon=\"mdi:truck\"></iconify-icon><span>${shippingName}</span></span>` : ''}
                                <span class="flex items-center gap-2"><iconify-icon icon="mdi:credit-card-outline"></iconify-icon><span>${paymentInfo ? paymentInfo.name : (order.paymentMethod || '---')}</span></span>
                                <span class="flex items-center gap-2"><iconify-icon icon="mdi:cash"></iconify-icon><span>هزینه ارسال: ${shippingCostLabel}</span></span>
                            </div>

                            ${address ? `
                                <div class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                                    <div class="font-medium text-gray-700 dark:text-gray-200 mb-2">${address.title || 'آدرس ارسال'}</div>
                                    <div>${[address.province, address.city].filter(Boolean).join('، ')}</div>
                                    <div class="mt-1">${address.fullAddress || ''}</div>
                                    <div class="mt-1">کد پستی: ${address.postalCode || '---'}</div>
                                    <div class="mt-1">تلفن: ${address.phone || '---'}</div>
                                </div>
                            ` : ''}

                            <div class="space-y-3 mb-4">
                                ${itemsMarkup}
                            </div>

                            <div class="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div class="text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-1">
                                    <span>جمع جزء: ${formatPrice(subtotal)}</span>
                                    ${discount > 0 ? `<span class="text-green-600 dark:text-green-400">تخفیف: ${formatPrice(discount)}</span>` : ''}
                                    <span>ارسال: ${shippingCostLabel}</span>
                                </div>
                                <div class="text-lg font-bold">${formatPrice(totalValue)}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `}
    `;
    contentRoot.appendChild(page);
}

function renderOrderSuccessPage(orderId){
    const order = orders.find(item => item.id === orderId);
    const page = document.createElement('div');

    if (!order) {
        page.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-primary/20 text-center">
                <iconify-icon icon="mdi:alert-circle-outline" width="64" class="text-yellow-500 mb-4"></iconify-icon>
                <h1 class="text-2xl font-bold mb-3">سفارشی با این مشخصات یافت نشد</h1>
                <p class="text-gray-600 dark:text-gray-400 mb-6">ممکن است شناسه سفارش را اشتباه وارد کرده باشید یا سفارش حذف شده باشد.</p>
                <a href="#orders" class="inline-flex items-center justify-center bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition-colors">بازگشت به سفارش‌ها</a>
            </div>
        `;
        contentRoot.appendChild(page);
        return;
    }

    const statusInfo = getOrderStatusInfo(order.status);
    const paymentInfo = typeof getPaymentMethod === 'function' ? getPaymentMethod(order.paymentMethod) : null;
    const shippingInfo = typeof getShippingMethod === 'function' ? getShippingMethod(order.shippingMethod) : null;
    const shippingName = order.shippingTitle || (shippingInfo ? shippingInfo.name : '');
    const shippingCostValue = typeof order.shippingCost === 'number' ? order.shippingCost : 0;
    const shippingCostLabel = shippingCostValue === 0 ? 'رایگان' : formatPrice(shippingCostValue);
    const subtotal = typeof order.subtotal === 'number' ? order.subtotal : (typeof order.total === 'number' ? order.total - shippingCostValue : 0);
    const discount = typeof order.discount === 'number' ? order.discount : 0;
    const totalValue = typeof order.total === 'number' ? order.total : subtotal + shippingCostValue;
    const address = order.address || null;
    const items = Array.isArray(order.items) ? order.items : [];

    page.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-primary/20">
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 text-green-500 mb-4">
                    <iconify-icon icon="mdi:check-circle" width="48"></iconify-icon>
                </div>
                <h1 class="text-3xl font-bold mb-2">سفارش شما با موفقیت ثبت شد!</h1>
                <p class="text-gray-600 dark:text-gray-400">از خرید شما سپاسگزاریم. جزئیات سفارش در زیر آمده است.</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <h2 class="font-semibold mb-3 text-gray-700 dark:text-gray-200">اطلاعات سفارش</h2>
                    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div class="flex justify-between">
                            <span>شناسه سفارش:</span>
                            <span class="font-medium text-gray-800 dark:text-gray-200">${order.id}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>تاریخ ثبت:</span>
                            <span>${formatOrderDate(order.date)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>وضعیت:</span>
                            <span class="px-3 py-1 rounded-full text-xs ${statusInfo.className}">${statusInfo.label}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>روش پرداخت:</span>
                            <span>${paymentInfo ? paymentInfo.name : (order.paymentMethod || '---')}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>روش ارسال:</span>
                            <span>${shippingName || '---'}</span>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 lg:col-span-2">
                    <h2 class="font-semibold mb-3 text-gray-700 dark:text-gray-200">آدرس تحویل</h2>
                    ${address ? `
                        <div class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <div>${[address.title, address.province, address.city].filter(Boolean).join('، ')}</div>
                            <div>${address.fullAddress || ''}</div>
                            <div>کد پستی: ${address.postalCode || '---'}</div>
                            <div>تلفن: ${address.phone || '---'}</div>
                        </div>
                    ` : '<p class="text-sm text-gray-500">آدرس ثبت شده‌ای برای این سفارش وجود ندارد.</p>'}
                </div>
            </div>

            <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-6">
                <h2 class="font-semibold mb-4 text-gray-700 dark:text-gray-200">اقلام سفارش</h2>
                <div class="space-y-4">
                    ${items.map(item => {
                        const product = getProductById(item.productId);
                        const itemName = product ? product.name : `محصول ${item.productId}`;
                        const itemImage = product?.img;
                        const itemQty = item.qty || 1;
                        const itemPrice = product
                            ? (product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price)
                            : null;
                        const lineTotal = itemPrice !== null ? formatPrice(itemPrice * itemQty) : '—';

                        return `
                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-3">
                                    <div class="w-14 h-14 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        ${itemImage
                                            ? `<img src="${itemImage}" alt="${itemName}" class="w-14 h-14 object-cover" />`
                                            : `<iconify-icon icon="mdi:package" width="24" class="text-gray-400"></iconify-icon>`}
                                    </div>
                                    <div>
                                        <div class="font-medium">${itemName}</div>
                                        <div class="text-gray-500 text-sm">${itemQty} عدد</div>
                                    </div>
                                </div>
                                <div class="font-medium">${lineTotal}</div>
                            </div>
                        `;
                    }).join('') || '<div class="text-sm text-gray-500">آیتمی برای نمایش وجود ندارد</div>'}
                </div>
            </div>

            <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>جمع جزء:</span>
                    <span>${formatPrice(subtotal)}</span>
                </div>
                ${discount > 0 ? `<div class="flex justify-between text-sm text-green-600 dark:text-green-400 mb-2"><span>تخفیف:</span><span>${formatPrice(discount)}</span></div>` : ''}
                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>هزینه ارسال:</span>
                    <span>${shippingCostLabel}</span>
                </div>
                <div class="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <span class="font-semibold text-lg">مبلغ قابل پرداخت:</span>
                    <span class="text-2xl font-bold text-primary">${formatPrice(totalValue)}</span>
                </div>
            </div>

            <div class="mt-8 flex flex-wrap gap-3 justify-center">
                <a href="#orders" class="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition-colors">مشاهده سفارش‌ها</a>
                <a href="#products" class="border border-primary text-primary px-5 py-2 rounded-lg hover:bg-primary/10 transition-colors">ادامه خرید</a>
            </div>
        </div>
    `;

    contentRoot.appendChild(page);
}

// ---- validation.js ----
/* ---------- Validation Functions ---------- */
function validatePhone(phone) {
    const phoneRegex = /^09[0-9]{9}$/;
    return phoneRegex.test(phone);
}

function validatePostalCode(code) {
    const postalRegex = /^[0-9]{10}$/;
    return postalRegex.test(code);
}

function validateNationalCode(code) {
    if (!/^\d{10}$/.test(code)) return false;
    
    const check = parseInt(code[9]);
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(code[i]) * (10 - i);
    }
    sum %= 11;
    
    return (sum < 2 && check === sum) || (sum >= 2 && check === 11 - sum);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validatePersianText(text) {
    const persianRegex = /^[\u0600-\u06FF\s]+$/;
    return persianRegex.test(text);
}

function validateNumber(input) {
    return /^\d+$/.test(input);
}

function validatePrice(price) {
    return /^\d+$/.test(price) && parseInt(price) > 0;
}

function validateStock(stock) {
    return /^\d+$/.test(stock) && parseInt(stock) >= 0;
}

function validateDiscount(discount) {
    return /^\d+$/.test(discount) && parseInt(discount) >= 0 && parseInt(discount) <= 100;
}

// اعتبارسنجی فیلدهای فرم
function validateForm(formData) {
    const errors = [];
    
    if (formData.phone && !validatePhone(formData.phone)) {
        errors.push('شماره تلفن معتبر نیست');
    }
    
    if (formData.nationalCode && !validateNationalCode(formData.nationalCode)) {
        errors.push('کد ملی معتبر نیست');
    }
    
    if (formData.postalCode && !validatePostalCode(formData.postalCode)) {
        errors.push('کد پستی معتبر نیست');
    }
    
    if (formData.email && !validateEmail(formData.email)) {
        errors.push('ایمیل معتبر نیست');
    }
    
    return errors;
}

// نمایش خطاهای اعتبارسنجی
function showValidationErrors(errors, container) {
    if (!container) return;
    
    container.innerHTML = '';
    if (errors.length === 0) return;
    
    const errorList = document.createElement('div');
    errorList.className = 'bg-red-50 border border-red-200 rounded-lg p-4 mb-4';
    errorList.innerHTML = `
        <div class="flex items-center gap-2 text-red-700 mb-2">
            <iconify-icon icon="mdi:alert-circle"></iconify-icon>
            <span class="font-medium">لطفا خطاهای زیر را修正 کنید:</span>
        </div>
        <ul class="list-disc list-inside text-red-600 text-sm space-y-1">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    container.appendChild(errorList);
}

// اعتبارسنجی real-time
function setupRealTimeValidation() {
    document.addEventListener('input', (e) => {
        const input = e.target;
        
        if (input.type === 'tel' && input.hasAttribute('data-phone')) {
            validatePhoneField(input);
        }
        
        if (input.hasAttribute('data-national')) {
            validateNationalCodeField(input);
        }
        
        if (input.hasAttribute('data-postal')) {
            validatePostalCodeField(input);
        }
        
        if (input.type === 'email') {
            validateEmailField(input);
        }
    });
}

function validatePhoneField(input) {
    const isValid = !input.value || validatePhone(input.value);
    updateFieldValidationState(input, isValid, 'شماره تلفن معتبر نیست');
}

function validateNationalCodeField(input) {
    const isValid = !input.value || validateNationalCode(input.value);
    updateFieldValidationState(input, isValid, 'کد ملی معتبر نیست');
}

function validatePostalCodeField(input) {
    const isValid = !input.value || validatePostalCode(input.value);
    updateFieldValidationState(input, isValid, 'کد پستی معتبر نیست');
}

function validateEmailField(input) {
    const isValid = !input.value || validateEmail(input.value);
    updateFieldValidationState(input, isValid, 'ایمیل معتبر نیست');
}

function updateFieldValidationState(input, isValid, errorMessage) {
    const errorElement = input.parentNode.querySelector('.field-error');
    
    if (isValid) {
        input.classList.remove('border-red-500');
        input.classList.add('border-green-500');
        if (errorElement) {
            errorElement.remove();
        }
    } else {
        input.classList.remove('border-green-500');
        input.classList.add('border-red-500');
        if (!errorElement) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error text-red-500 text-xs mt-1';
            errorDiv.textContent = errorMessage;
            input.parentNode.appendChild(errorDiv);
        }
    }
}

// اعتبارسنجی فیلدهای عددی در پنل ادمین
function setupAdminInputValidation() {
    document.addEventListener('input', (e) => {
        if (e.target.matches('#productPrice, #productDiscount, #productStock')) {
            validateAdminNumberField(e.target);
        }
    });
}

function validateAdminNumberField(input) {
    let value = input.value;
    
    // حذف کاراکترهای غیر عددی
    value = value.replace(/[^\d]/g, '');
    
    // اعتبارسنجی بر اساس نوع فیلد
    let isValid = true;
    let errorMessage = '';
    
    switch(input.id) {
        case 'productPrice':
            isValid = validatePrice(value);
            errorMessage = 'قیمت باید عددی و بزرگتر از صفر باشد';
            break;
        case 'productStock':
            isValid = validateStock(value);
            errorMessage = 'موجودی باید عددی و بزرگتر یا مساوی صفر باشد';
            break;
        case 'productDiscount':
            isValid = validateDiscount(value);
            errorMessage = 'تخفیف باید بین 0 تا 100 باشد';
            break;
    }
    
    if (!isValid && value) {
        input.classList.add('border-red-500');
        notify(errorMessage, 'error');
    } else {
        input.classList.remove('border-red-500');
    }
    
    input.value = value;
}

// Initialize validation
document.addEventListener('DOMContentLoaded', () => {
    setupRealTimeValidation();
    setupAdminInputValidation();
});

// ---- components.js ----
/* ---------- UI Components ---------- */

// اعلان‌ها
const TOAST_VARIANTS = {
    success: {
        icon: 'mdi:check-circle',
        label: 'موفقیت',
        className: 'toast--success',
        duration: 4000
    },
    error: {
        icon: 'mdi:alert-circle',
        label: 'خطا',
        className: 'toast--error',
        duration: 5500
    },
    warning: {
        icon: 'mdi:alert',
        label: 'هشدار',
        className: 'toast--warning',
        duration: 5000
    },
    info: {
        icon: 'mdi:information',
        label: 'اطلاعیه',
        className: 'toast--info',
        duration: 4500
    }
};

function ensureToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        container.setAttribute('role', 'region');
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'false');
        document.body.appendChild(container);
    }
    return container;
}

function notify(message, variant = 'info') {
    if (!message) return;

    if (typeof variant === 'boolean') {
        variant = variant ? 'error' : 'success';
    }

    if (typeof variant !== 'string') {
        variant = 'info';
    }

    const config = TOAST_VARIANTS[variant] || TOAST_VARIANTS.info;
    const container = ensureToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast ${config.className}`;
    toast.setAttribute('role', variant === 'error' ? 'alert' : 'status');

    const content = document.createElement('div');
    content.className = 'toast__content';

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'toast__icon';
    const icon = document.createElement('iconify-icon');
    icon.setAttribute('icon', config.icon);
    icon.setAttribute('width', '22');
    iconWrapper.appendChild(icon);

    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'toast__message';

    const label = document.createElement('span');
    label.className = 'toast__label';
    label.textContent = config.label;

    const text = document.createElement('div');
    text.className = 'toast__text';
    text.textContent = message;

    messageWrapper.appendChild(label);
    messageWrapper.appendChild(text);

    content.appendChild(iconWrapper);
    content.appendChild(messageWrapper);

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'toast__close';
    closeButton.setAttribute('aria-label', 'بستن اعلان');
    closeButton.appendChild(document.createTextNode('×'));

    toast.appendChild(content);
    toast.appendChild(closeButton);
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('toast--visible');
    });

    let autoHideTimeout;
    let isClosing = false;

    const clearAutoHide = () => {
        if (autoHideTimeout) {
            clearTimeout(autoHideTimeout);
            autoHideTimeout = null;
        }
    };

    const startAutoHide = () => {
        clearAutoHide();
        autoHideTimeout = setTimeout(() => dismissToast(), config.duration);
    };

    const dismissToast = () => {
        if (isClosing) return;
        isClosing = true;
        clearAutoHide();
        toast.classList.remove('toast--visible');
        const removeToast = () => {
            toast.removeEventListener('transitionend', removeToast);
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        };
        toast.addEventListener('transitionend', removeToast);
        setTimeout(removeToast, 250);
    };

    startAutoHide();

    toast.addEventListener('mouseenter', clearAutoHide);
    toast.addEventListener('mouseleave', startAutoHide);
    closeButton.addEventListener('click', dismissToast);
}

function lockBodyScroll() {
    const body = document.body;
    const currentCount = parseInt(body.dataset.scrollLockCount || '0', 10);
    if (currentCount === 0) {
        body.classList.add('is-scroll-locked');
    }
    body.dataset.scrollLockCount = String(currentCount + 1);
}

function unlockBodyScroll() {
    const body = document.body;
    const currentCount = parseInt(body.dataset.scrollLockCount || '0', 10);
    if (!currentCount || currentCount <= 1) {
        body.classList.remove('is-scroll-locked');
        delete body.dataset.scrollLockCount;
        return;
    }
    body.dataset.scrollLockCount = String(currentCount - 1);
}

// کامپوننت اسکرول بار سفارشی
function setupCustomScrollbar() {
    const style = document.createElement('style');
    style.textContent = `
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
            background: #374151;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #6b7280;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
        }
    `;
    document.head.appendChild(style);
}

// کامپوننت بنر کوچک‌تر صفحه اصلی
function createSmallHero() {
    return `
        <section class="bg-gradient-to-l from-primary to-primary-600 text-white rounded-2xl p-6 mb-8" id="home">
            <div class="md:flex md:items-center md:justify-between">
                <div class="flex-1">
                    <h1 class="text-2xl md:text-3xl font-extrabold mb-3">به HDKALA خوش آمدید</h1>
                    <p class="opacity-90 text-base mb-4">بهترین تجربه خرید آنلاین با تنوع بی‌نظیر محصولات و قیمت‌های استثنایی</p>
                    <div class="flex gap-3">
                        <a href="#products" class="bg-white text-primary rounded-full px-5 py-2.5 font-medium hover:bg-gray-100 transition-colors text-sm">
                            مشاهده محصولات
                        </a>
                        <button id="quickAddDemo" class="bg-white/20 border border-white/30 rounded-full px-5 py-2.5 hover:bg-white/30 transition-colors text-sm">
                            افزودن نمونه
                        </button>
                    </div>
                </div>
                <div class="hidden md:block flex-1 text-center">
                    <iconify-icon icon="mdi:shopping" width="150" class="opacity-80"></iconify-icon>
                </div>
            </div>
        </section>
    `;
}

// کارت محصول
function createProductCard(product) {
    const finalPrice = product.discount > 0
        ? product.price * (1 - product.discount / 100)
        : product.price;
    const hasDiscount = product.discount > 0;
    const inWishlist = Array.isArray(wishlist) && wishlist.includes(product.id);
    const inCompare = Array.isArray(compareList) && compareList.includes(product.id);
    const primaryImage = typeof getPrimaryProductImage === 'function'
        ? getPrimaryProductImage(product)
        : (product.img || '');
    const isOutOfStock = product.stock === 0;
    const addToCartClasses = isOutOfStock
        ? 'add-to-cart flex-1 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-2 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2'
        : 'add-to-cart flex-1 bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2';
    const addToCartIcon = isOutOfStock ? 'mdi:close-circle-outline' : 'mdi:cart-plus';

    const article = document.createElement('article');
    article.className = 'product-card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 relative border border-primary/20';
    article.innerHTML = `
        <div class="relative overflow-hidden">
            <a href="#product:${product.id}">
                <div class="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    ${primaryImage
                        ? `<img src="${primaryImage}" alt="${product.name}" class="w-full h-48 object-cover product-image zoom-image" loading="lazy" />`
                        : '<iconify-icon icon="mdi:image-off" width="48" class="text-gray-400"></iconify-icon>'}
                </div>
            </a>
            <div class="absolute top-2 left-2 flex gap-2">
                <button aria-label="${inWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}" data-id="${product.id}"
                        class="add-to-wishlist wishlist-button wishlist-button--compact bg-white/90 dark:bg-gray-800/90 rounded-full p-2 backdrop-blur-sm"
                        data-wishlist-active="${inWishlist ? 'true' : 'false'}"
                        data-label-active="حذف از علاقه‌مندی"
                        data-label-inactive="افزودن به علاقه‌مندی">
                    <span class="wishlist-icon-wrapper">
                        <iconify-icon icon="${inWishlist ? 'mdi:heart' : 'mdi:heart-outline'}" class="wishlist-icon wishlist-icon-current"></iconify-icon>
                        <iconify-icon icon="${inWishlist ? 'mdi:heart-off' : 'mdi:heart-plus'}" class="wishlist-icon wishlist-icon-preview"></iconify-icon>
                    </span>
                    <span class="wishlist-tooltip"></span>
                </button>
                <button aria-label="مقایسه محصول" data-id="${product.id}"
                        class="add-to-compare bg-white/90 dark:bg-gray-800/90 rounded-full p-2 backdrop-blur-sm">
                    <iconify-icon icon="mdi:scale-balance" class="${inCompare ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}"></iconify-icon>
                </button>
            </div>
            <div class="absolute top-2 right-2 flex flex-col gap-2">
                ${hasDiscount ? `<div class="badge badge-discount">${product.discount}%</div>` : ''}
                ${product.status === 'new' ? '<div class="badge badge-new">جدید</div>' : ''}
                ${product.status === 'hot' ? '<div class="badge badge-hot">فروش ویژه</div>' : ''}
                ${product.status === 'bestseller' ? '<div class="badge bg-purple-500 text-white">پرفروش</div>' : ''}
            </div>
        </div>
        <div class="p-4">
            <h3 class="font-bold text-lg mb-1 dark:text-white line-clamp-2">${product.name}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">${product.desc}</p>
            <div class="flex items-center justify-between mb-3">
                <div>
                    ${hasDiscount ? `<div class="text-gray-500 line-through text-sm">${formatPrice(product.price)}</div>` : ''}
                    <span class="text-primary font-extrabold">${formatPrice(finalPrice)}</span>
                </div>
                <div class="text-yellow-500 text-sm">${'★'.repeat(product.rating)}${product.rating < 5 ? '☆'.repeat(5 - product.rating) : ''}</div>
            </div>
            <div class="flex items-center justify-between mb-2 text-xs">
                <div class="text-gray-500 dark:text-gray-400">
                    موجودی: ${product.stock > 0
                        ? `<span class="text-green-500">${product.stock}</span>`
                        : '<span class="text-red-500">ناموجود</span>'}
                </div>
                <div class="text-gray-500 dark:text-gray-400">${product.brand || '---'}</div>
            </div>
            <div class="flex gap-2">
                <button type="button" class="${addToCartClasses}"
                        data-id="${product.id}" ${isOutOfStock ? 'disabled aria-disabled="true"' : ''}>
                    <iconify-icon icon="${addToCartIcon}" width="20"></iconify-icon>
                    ${isOutOfStock ? '<span class="text-red-500 font-semibold">ناموجود</span>' : '<span>افزودن به سبد</span>'}
                </button>
                <a href="#product:${product.id}"
                   class="view-detail w-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                   aria-label="جزئیات">
                    <iconify-icon icon="mdi:eye" width="18"></iconify-icon>
                </a>
            </div>
        </div>
    `;

    if (typeof window !== 'undefined' && typeof window.refreshWishlistButtons === 'function') {
        window.refreshWishlistButtons(article);
    }

    return article;
}

// کامپوننت گزینه‌های پرداخت
function createPaymentOptions(selectedMethod = 'online') {
    return `
        <div class="space-y-3">
            ${paymentMethods.map(method => `
                <label class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedMethod === method.id 
                    ? 'border-green-500 bg-green-50 dark:bg-green-500/10' 
                    : 'border-gray-300 hover:border-primary/50'
                }">
                    <input type="radio" name="payment" value="${method.id}" 
                           ${selectedMethod === method.id ? 'checked' : ''}
                           class="text-primary hidden">
                    <div class="flex items-center gap-3 flex-1">
                        <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedMethod === method.id 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-400'
                        }">
                            ${selectedMethod === method.id ? `
                                <iconify-icon icon="mdi:check" class="text-white text-sm"></iconify-icon>
                            ` : ''}
                        </div>
                        <iconify-icon icon="${method.icon}" width="24" class="${
                            selectedMethod === method.id ? 'text-green-500' : 'text-gray-500'
                        }"></iconify-icon>
                        <div class="flex-1">
                            <div class="font-medium">${method.name}</div>
                            <div class="text-sm text-gray-500">${method.description}</div>
                        </div>
                    </div>
                </label>
            `).join('')}
        </div>
    `;
}

function createShippingOptions(selectedMethod = (shippingMethods[0]?.id || 'standard')) {
    return `
        <div class="space-y-3">
            ${shippingMethods.map(method => `
                <label class="shipping-option flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                    : 'border-gray-300 hover:border-primary/50'
                }" data-id="${method.id}">
                    <input type="radio" name="shipping" value="${method.id}" ${selectedMethod === method.id ? 'checked' : ''}
                           class="text-primary hidden">
                    <div class="flex items-center gap-3 flex-1">
                        <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedMethod === method.id ? 'border-primary bg-primary text-white' : 'border-gray-400 text-gray-500'
                        }">
                            <iconify-icon icon="${method.icon}" width="18"></iconify-icon>
                        </div>
                        <div class="flex-1">
                            <div class="font-medium flex items-center justify-between gap-3">
                                <span>${method.name}</span>
                                <span class="text-sm text-gray-500">${method.price === 0 ? 'رایگان' : formatPrice(method.price)}</span>
                            </div>
                            <div class="text-sm text-gray-500">${method.description}</div>
                        </div>
                    </div>
                </label>
            `).join('')}
        </div>
    `;
}

// کامپوننت محصول برای مقایسه
function createCompareProduct(product) {
    const finalPrice = product.discount > 0 ?
        product.price * (1 - product.discount / 100) : product.price;
    const primaryImage = typeof getPrimaryProductImage === 'function'
        ? getPrimaryProductImage(product)
        : (product.img || '');
    const isOutOfStock = product.stock === 0;
    const addToCartClasses = isOutOfStock
        ? 'add-to-cart w-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-2 rounded-lg font-medium cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2'
        : 'add-to-cart w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2';
    const addToCartIcon = isOutOfStock ? 'mdi:close-circle-outline' : 'mdi:cart-plus';
    const isInWishlist = Array.isArray(wishlist) && wishlist.includes(product.id);

    return `
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-primary/20 p-4 relative">
            <button class="remove-compare absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    data-id="${product.id}">
                <iconify-icon icon="mdi:close"></iconify-icon>
            </button>
            
            <div class="text-center mb-4">
                <h3 class="font-bold text-lg mb-2">${product.name}</h3>
                <div class="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                    ${primaryImage ?
                        `<img src="${primaryImage}" alt="${product.name}" class="w-full h-40 object-cover rounded-lg">` :
                        `<iconify-icon icon="mdi:image-off" width="32" class="text-gray-400"></iconify-icon>`
                    }
                </div>
            </div>
            
            <div class="space-y-2 text-sm">
                <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400">قیمت:</span>
                    <span class="font-medium text-primary">${formatPrice(finalPrice)}</span>
                </div>
                
                ${product.discount > 0 ? `
                <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400">تخفیف:</span>
                    <span class="text-green-500 font-medium">${product.discount}%</span>
                </div>
                ` : ''}
                
                <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400">امتیاز:</span>
                    <span class="text-yellow-500">${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</span>
                </div>
                
                <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400">برند:</span>
                    <span class="font-medium">${product.brand}</span>
                </div>
                
                <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400">موجودی:</span>
                    <span class="${product.stock > 0 ? 'text-green-500' : 'text-red-500'} font-medium">
                        ${product.stock > 0 ? product.stock + ' عدد' : 'ناموجود'}
                    </span>
                </div>
            </div>

            <div class="mt-4 space-y-2">
                <button class="${addToCartClasses}"
                        data-id="${product.id}" ${isOutOfStock ? 'disabled aria-disabled="true"' : ''}>
                    <iconify-icon icon="${addToCartIcon}" width="18"></iconify-icon>
                    ${isOutOfStock ? '<span class="text-red-500 font-semibold">ناموجود</span>' : '<span>افزودن به سبد خرید</span>'}
                </button>
                <button class="add-to-wishlist wishlist-button wishlist-button--inline w-full border border-primary text-primary py-2 rounded-lg font-medium hover:bg-primary/10 transition-colors text-sm flex items-center justify-center gap-2"
                        data-id="${product.id}"
                        aria-label="${isInWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}"
                        data-wishlist-active="${isInWishlist ? 'true' : 'false'}"
                        data-label-active="حذف از علاقه‌مندی"
                        data-label-inactive="افزودن به علاقه‌مندی">
                    <span class="wishlist-icon-wrapper">
                        <iconify-icon icon="${isInWishlist ? 'mdi:heart' : 'mdi:heart-outline'}" class="wishlist-icon wishlist-icon-current"></iconify-icon>
                        <iconify-icon icon="${isInWishlist ? 'mdi:heart-off' : 'mdi:heart-plus'}" class="wishlist-icon wishlist-icon-preview"></iconify-icon>
                    </span>
                    <span class="wishlist-tooltip"></span>
                    <span class="wishlist-label-text">علاقه‌مندی</span>
                </button>
            </div>
        </div>
    `;
}

// کامپوننت اطلاع‌رسانی موجود شدن محصول
function createNotifyMeModal(product) {
    const primaryImage = typeof getPrimaryProductImage === 'function'
        ? getPrimaryProductImage(product)
        : (product.img || '');
    const modalId = uid('notify-modal-');
    const titleId = `${modalId}-title`;
    const descriptionId = `${modalId}-description`;
    return `
        <div class="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-modal-overlay aria-hidden="true">
            <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6" data-modal-dialog role="dialog" aria-modal="true" aria-labelledby="${titleId}" aria-describedby="${descriptionId}" tabindex="-1">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold" id="${titleId}">اطلاع‌رسانی هنگام موجود شدن</h3>
                    <button class="close-notify-modal p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <iconify-icon icon="mdi:close"></iconify-icon>
                    </button>
                </div>

                <div class="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg" id="${descriptionId}">
                    <div class="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        ${primaryImage ?
                            `<img src="${primaryImage}" alt="${product.name}" class="w-12 h-12 object-cover rounded-lg">` :
                            `<iconify-icon icon="mdi:package" class="text-gray-400"></iconify-icon>`
                        }
                    </div>
                    <div>
                        <div class="font-medium">${product.name}</div>
                        <div class="text-sm text-gray-500">${product.brand}</div>
                    </div>
                </div>
                
                <form class="space-y-4" id="notifyMeForm">
                    <div>
                        <label class="block text-sm font-medium mb-2">ایمیل</label>
                        <input type="email" required 
                               class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                               placeholder="email@example.com">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">شماره تلفن</label>
                        <input type="tel" required 
                               class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                               placeholder="09xxxxxxxxx"
                               data-phone>
                    </div>
                    
                    <div class="flex gap-3">
                        <button type="button" class="close-notify-modal flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
                            انصراف
                        </button>
                        <button type="submit" class="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
                            ثبت درخواست
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// کامپوننت آدرس‌های کاربر
function createAddressCard(address, isDefault = false) {
    return `
        <div class="bg-white dark:bg-gray-800 rounded-xl border-2 p-4 ${
            isDefault ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700'
        }">
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-2">
                    <span class="font-medium">${address.title}</span>
                    ${isDefault ? `
                        <span class="bg-primary text-white text-xs px-2 py-1 rounded-full">پیش‌فرض</span>
                    ` : ''}
                </div>
                <div class="flex gap-1">
                    <button class="edit-address p-1 text-gray-500 hover:text-primary transition-colors" data-id="${address.id}">
                        <iconify-icon icon="mdi:pencil"></iconify-icon>
                    </button>
                    <button class="delete-address p-1 text-gray-500 hover:text-red-500 transition-colors" data-id="${address.id}">
                        <iconify-icon icon="mdi:trash-can-outline"></iconify-icon>
                    </button>
                </div>
            </div>
            
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div class="flex items-center gap-2">
                    <iconify-icon icon="mdi:map-marker"></iconify-icon>
                    <span>${address.province}، ${address.city}</span>
                </div>
                <div>${address.fullAddress}</div>
                <div class="flex items-center gap-2">
                    <iconify-icon icon="mdi:post"></iconify-icon>
                    <span>کد پستی: ${address.postalCode}</span>
                </div>
                <div class="flex items-center gap-2">
                    <iconify-icon icon="mdi:phone"></iconify-icon>
                    <span>${address.phone}</span>
                </div>
            </div>
            
            ${!isDefault ? `
                <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button class="set-default-address text-primary text-sm hover:text-primary/80 transition-colors" data-id="${address.id}">
                        تنظیم به عنوان آدرس پیش‌فرض
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

// کامپوننت فرم افزودن/ویرایش آدرس
function createAddressForm(address = null) {
    const isEdit = !!address;
    
    return `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
            <h3 class="text-lg font-semibold mb-4">${isEdit ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}</h3>
            
            <form class="space-y-4" id="addressForm">
                <div>
                    <label class="block text-sm font-medium mb-2">عنوان آدرس</label>
                    <input type="text" required 
                           class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                           placeholder="مثلا: منزل، محل کار"
                           value="${address?.title || ''}">
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">استان</label>
                        <select required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" id="addressProvince">
                            <option value="">انتخاب استان</option>
                            ${provinces.map(province => `
                                <option value="${province.name}" ${address?.province === province.name ? 'selected' : ''}>
                                    ${province.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">شهر</label>
                        <select required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" id="addressCity" 
                                ${!address?.province ? 'disabled' : ''}>
                            <option value="">ابتدا استان را انتخاب کنید</option>
                            ${address?.province ? getProvinceCities(address.province).map(city => `
                                <option value="${city}" ${address?.city === city ? 'selected' : ''}>${city}</option>
                            `).join('') : ''}
                        </select>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-2">آدرس کامل</label>
                    <textarea required rows="3" 
                              class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                              placeholder="خیابان، پلاک، واحد، ...">${address?.fullAddress || ''}</textarea>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">کد پستی</label>
                        <input type="text" required data-postal
                               class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                               maxlength="10"
                               value="${address?.postalCode || ''}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">شماره تماس</label>
                        <input type="tel" required data-phone
                               class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                               value="${address?.phone || ''}">
                    </div>
                </div>
                
                <div class="flex items-center gap-2">
                    <input type="checkbox" id="isDefault" ${address?.isDefault ? 'checked' : ''}
                           class="rounded border-gray-300 text-primary focus:ring-primary">
                    <label for="isDefault" class="text-sm">تنظیم به عنوان آدرس پیش‌فرض</label>
                </div>
                
                <div class="flex gap-3 pt-4">
                    <button type="button" class="cancel-address-form flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
                        انصراف
                    </button>
                    <button type="submit" class="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
                        ${isEdit ? 'ویرایش آدرس' : 'ذخیره آدرس'}
                    </button>
                </div>
            </form>
        </div>
    `;
}

// کامپوننت مدیریت بلاگ در پنل ادمین
function createBlogManagement() {
    return `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold">مدیریت مقالات بلاگ</h3>
                <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors" id="addBlogBtn">
                    افزودن مقاله جدید
                </button>
            </div>
            
            <div class="space-y-4" id="blogList">
                ${blogs.map(blog => `
                    <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div class="flex-1">
                            <h4 class="font-medium">${blog.title}</h4>
                            <div class="text-sm text-gray-500 mt-1">
                                <span>${blog.category}</span> • 
                                <span>${blog.date}</span>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button class="edit-blog bg-primary/20 text-primary px-3 py-1 rounded-lg hover:bg-primary/30 transition-colors" data-id="${blog.id}">
                                ویرایش
                            </button>
                            <button class="delete-blog bg-red-500/20 text-red-500 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-colors" data-id="${blog.id}">
                                حذف
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    setupCustomScrollbar();
});

// ---- utils.js ----
/* ---------- Utility Functions ---------- */
function setupAutoClearInputs() {
    document.addEventListener('focus', (e) => {
        if (e.target.matches('input[type="number"], input[type="text"]')) {
            if (e.target.value === '0' || e.target.value === '00') {
                e.target.value = '';
            }
        }
    });
}

function setupInputValidation() {
    document.addEventListener('blur', (e) => {
        const input = e.target;
        
        if (input.type === 'tel' && input.hasAttribute('data-phone')) {
            if (input.value && !validatePhone(input.value)) {
                input.classList.add('border-red-500');
                notify('شماره تلفن باید با 09 شروع شده و 11 رقمی باشد', 'error');
            } else {
                input.classList.remove('border-red-500');
            }
        }
        
        if (input.hasAttribute('data-postal')) {
            if (input.value && !validatePostalCode(input.value)) {
                input.classList.add('border-red-500');
                notify('کد پستی باید 10 رقمی باشد', 'error');
            } else {
                input.classList.remove('border-red-500');
            }
        }
        
        if (input.hasAttribute('data-national')) {
            if (input.value && !validateNationalCode(input.value)) {
                input.classList.add('border-red-500');
                notify('کد ملی نامعتبر است', 'error');
            } else {
                input.classList.remove('border-red-500');
            }
        }
        
        if (input.type === 'email' && input.value) {
            if (!validateEmail(input.value)) {
                input.classList.add('border-red-500');
                notify('ایمیل وارد شده معتبر نیست', 'error');
            } else {
                input.classList.remove('border-red-500');
            }
        }
    });
}

// تابع برای مدیریت مربع‌های کد تأیید
function setupOtpInputs(container) {
    const inputs = $$('.otp-input', container);

    inputs.forEach((input, index) => {
        input.setAttribute('dir', 'ltr');
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('pattern', '[0-9]*');
        input.type = 'tel';

        input.addEventListener('focus', () => {
            input.select();
        });

        input.addEventListener('input', (e) => {
            const value = e.target.value.replace(/[^\d]/g, '');
            e.target.value = value.slice(0, 1);

            e.target.classList.remove('border-red-500', 'border-green-500');
            if (!e.target.classList.contains('border-gray-300')) {
                e.target.classList.add('border-gray-300');
            }

            // فقط اعداد مجاز
            if (e.target.value.length === 1) {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            }
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value === '') {
                if (index > 0) {
                    inputs[index - 1].focus();
                }
            }
            
            if (e.key === 'ArrowLeft' && index > 0) {
                inputs[index - 1].focus();
            }
            
            if (e.key === 'ArrowRight' && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
        
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasteData = e.clipboardData.getData('text');
            const numbers = pasteData.replace(/[^\d]/g, '').split('');

            numbers.forEach((num, i) => {
                if (inputs[i]) {
                    inputs[i].value = num;
                    inputs[i].classList.remove('border-red-500', 'border-green-500');
                    if (!inputs[i].classList.contains('border-gray-300')) {
                        inputs[i].classList.add('border-gray-300');
                    }
                }
            });

            if (inputs[numbers.length]) {
                inputs[numbers.length].focus();
            }
        });
    });

    if (inputs[0]) {
        inputs[0].focus();
    }
}

// تابع برای جمع‌آوری کد از مربع‌ها
function getOtpCode(container) {
    const inputs = $$('.otp-input', container);
    return inputs.map(input => input.value).join('');
}

// تابع برای ریست کردن مربع‌های کد
function resetOtpInputs(container) {
    const inputs = $$('.otp-input', container);
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('border-primary', 'border-red-500', 'border-green-500');
        input.classList.add('border-gray-300');
    });
    if (inputs[0]) inputs[0].focus();
}

// تابع برای هایلایت کردن مربع‌ها
function highlightOtpInputs(container, isValid) {
    const inputs = $$('.otp-input', container);
    inputs.forEach(input => {
        input.classList.remove('border-primary', 'border-red-500', 'border-green-500');
        if (isValid) {
            input.classList.add('border-green-500');
        } else {
            input.classList.add('border-red-500');
        }
    });
}

// تابع برای ایجاد delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// تابع برای format کردن تاریخ
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
}

// تابع برای truncate متن
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// تابع برای ایجاد slug
function createSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\u0600-\u06FF]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// تابع برای فیلتر کردن محصولات بر اساس دسته‌بندی
function filterProductsByCategory(products, category) {
    if (!category) return products;
    return products.filter(product => product.category === category);
}

// تابع برای جستجو در محصولات
function searchProducts(products, query) {
    if (!query) return products;
    
    const searchTerm = query.toLowerCase().trim();
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.desc.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
}

// تابع برای مرتب‌سازی محصولات
function sortProducts(products, sortBy) {
    const sorted = [...products];
    
    switch(sortBy) {
        case 'price_asc':
            return sorted.sort((a, b) => {
                const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
                const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
                return priceA - priceB;
            });
            
        case 'price_desc':
            return sorted.sort((a, b) => {
                const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
                const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
                return priceB - priceA;
            });
            
        case 'discount':
            return sorted.sort((a, b) => b.discount - a.discount);
            
        case 'newest':
            return sorted.sort((a, b) => new Date(b.created || 0) - new Date(a.created || 0));
            
        case 'popular':
        default:
            return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
}

// تابع برای محاسبه مجموع سبد خرید
function calculateCartTotal() {
    let total = 0;
    let totalDiscount = 0;
    
    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (!product) return;
        
        const finalPrice = product.discount > 0 ? 
            product.price * (1 - product.discount / 100) : product.price;
        const itemTotal = finalPrice * item.qty;
        const itemDiscount = (product.price - finalPrice) * item.qty;
        
        total += itemTotal;
        totalDiscount += itemDiscount;
    });
    
    return { total, totalDiscount };
}

// تابع برای بررسی موجودی محصول
function checkProductStock(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return false;
    
    const cartItem = cart.find(item => item.productId === productId);
    const currentQty = cartItem ? cartItem.qty : 0;
    
    return product.stock >= (currentQty + quantity);
}

// تابع برای مدیریت اسکرول بدون اختلال در مسیریاب
function setupSmoothScroll() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        if (link.hasAttribute('data-route-link')) {
            return;
        }

        const hash = link.getAttribute('href');
        if (!hash || hash.length <= 1) return;

        const target = document.querySelector(hash);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
    });
}

// تابع برای lazy loading تصاویر
function setupLazyLoading() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    $$('img[data-src]').forEach(img => {
        observer.observe(img);
    });
}

// تابع برای مدیریت responsive
function setupResponsiveHandlers() {
    function handleResize() {
        if (window.innerWidth >= 1024) {
            mobileMenu.classList.add('hidden');
        }
    }

    window.addEventListener('resize', handleResize);
}

// بهبود و انیمیشن آیکون‌ها در سراسر پروژه
function setupIconAnimations() {
    const interactiveSelector = 'button, a, [role="button"], [data-icon-interactive-parent], .icon-action, .icon-button';

    const markIcon = (icon) => {
        if (!(icon instanceof HTMLElement)) return;

        icon.classList.add('icon-animated');

        const interactiveParent = icon.closest(interactiveSelector);
        const hasPointerClass = icon.classList.contains('cursor-pointer') || icon.classList.contains('hover:text-primary');
        const isInteractive = Boolean(interactiveParent) || hasPointerClass || icon.hasAttribute('data-icon-interactive');

        icon.dataset.iconInteractive = isInteractive ? 'true' : 'false';
    };

    const enhanceTree = (root) => {
        if (!root) return;

        if (root.tagName === 'ICONIFY-ICON') {
            markIcon(root);
            return;
        }

        root.querySelectorAll?.('iconify-icon').forEach(markIcon);
    };

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (!(node instanceof HTMLElement)) return;
                enhanceTree(node);
            });
        });
    });

    enhanceTree(document);

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

function setupWishlistButtonInteractions() {
    const DEFAULT_ACTIVE_TEXT = 'حذف از علاقه‌مندی';
    const DEFAULT_INACTIVE_TEXT = 'افزودن به علاقه‌مندی';

    const getButtons = (root = document) => {
        if (!root || !root.querySelectorAll) return [];
        return Array.from(root.querySelectorAll('.wishlist-button'));
    };

    const updateButtonState = (button) => {
        if (!(button instanceof HTMLElement)) return;

        const productId = button.getAttribute('data-id');
        if (!productId) return;

        const wishlistState = (typeof wishlist !== 'undefined' && Array.isArray(wishlist)) ? wishlist : [];
        const isActive = wishlistState.includes(productId);
        button.dataset.wishlistActive = isActive ? 'true' : 'false';

        const currentIcon = button.querySelector('.wishlist-icon-current');
        const previewIcon = button.querySelector('.wishlist-icon-preview');
        const tooltip = button.querySelector('.wishlist-tooltip');

        if (currentIcon) {
            currentIcon.setAttribute('icon', isActive ? 'mdi:heart' : 'mdi:heart-outline');
        }

        if (previewIcon) {
            previewIcon.setAttribute('icon', isActive ? 'mdi:heart-off' : 'mdi:heart-plus');
        }

        const activeText = button.getAttribute('data-label-active') || DEFAULT_ACTIVE_TEXT;
        const inactiveText = button.getAttribute('data-label-inactive') || DEFAULT_INACTIVE_TEXT;
        const tooltipText = isActive ? activeText : inactiveText;
        if (tooltip) {
            tooltip.textContent = tooltipText;
        }

        const textLabel = button.querySelector('.wishlist-label-text');
        if (textLabel) {
            textLabel.textContent = isActive ? 'حذف علاقه‌مندی' : 'علاقه‌مندی';
        }

        const ariaLabel = isActive ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها';
        button.setAttribute('aria-label', ariaLabel);
    };

    const updateAll = (root) => {
        getButtons(root).forEach(updateButtonState);
    };

    updateAll(document);

    document.addEventListener('mouseenter', (event) => {
        const button = event.target.closest?.('.wishlist-button');
        if (!button) return;
        updateButtonState(button);
    }, true);

    document.addEventListener('click', (event) => {
        const button = event.target.closest?.('.wishlist-button');
        if (!button) return;
        requestAnimationFrame(() => updateButtonState(button));
        setTimeout(() => updateAll(document), 160);
    });

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (!(node instanceof HTMLElement)) return;
                if (node.matches?.('.wishlist-button')) {
                    updateButtonState(node);
                }
                updateAll(node);
            });
        });
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.refreshWishlistButtons = updateAll;
}

// Initialize all utilities
document.addEventListener('DOMContentLoaded', () => {
    setupAutoClearInputs();
    setupInputValidation();
    setupSmoothScroll();
    setupLazyLoading();
    setupResponsiveHandlers();
    setupWishlistButtonInteractions();
    setupIconAnimations();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setupOtpInputs,
        getOtpCode,
        resetOtpInputs,
        highlightOtpInputs,
        delay,
        formatDate,
        truncateText,
        createSlug,
        filterProductsByCategory,
        searchProducts,
        sortProducts,
        calculateCartTotal,
        checkProductStock,
        setupIconAnimations
    };
}

// ---- constants.js ----
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
