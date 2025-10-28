/* ---------- Sample Data ---------- */
const defaultProducts = [];


const defaultBlogs = [];


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
const initialProductCount = Array.isArray(products) ? products.length : 0;
const initialBlogCount = Array.isArray(blogs) ? blogs.length : 0;
let currentPage = 'home';
let currentProductId = null;
let currentCategory = null;
let editingProductId = null;
let filteredProductsCache = null;

const loadingRegistry = new Set();

function setDataLoading(key, loading) {
    if (!key) return;
    const normalized = String(key);
    if (loading) {
        loadingRegistry.add(normalized);
    } else {
        loadingRegistry.delete(normalized);
    }
    UIEventBus.emit('data:loading', { key: normalized, loading: !!loading });
}

function isDataLoading(key) {
    if (!key) return false;
    return loadingRegistry.has(String(key));
}

function setFilteredProductsCache(list) {
    filteredProductsCache = Array.isArray(list) ? list.slice() : null;
}

function getFilteredProductsCache() {
    return Array.isArray(filteredProductsCache) ? filteredProductsCache.slice() : null;
}

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
const themeToggle = $('#darkModeBtn') || $('#themeToggle');
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
const wishlistBtn = $('#wishlistBtn');
const compareModal = $('#compareModal');
const closeCompareModal = $('#closeCompareModal');
const compareProducts = $('#compareProducts');

function enhanceInteractiveButton(button, { pulse = false, shape = 'rounded' } = {}) {
    if (!button || button.dataset.interactiveEnhanced === 'true') {
        return;
    }

    button.dataset.interactiveEnhanced = 'true';

    if (button.hasAttribute('disabled')) {
        button.removeAttribute('disabled');
    }
    if (button.getAttribute('aria-disabled') === 'true') {
        button.setAttribute('aria-disabled', 'false');
    }

    if (!button.hasAttribute('tabindex')) {
        button.setAttribute('tabindex', '0');
    }

    button.classList.remove('cursor-not-allowed', 'opacity-50');
    button.classList.add('interactive-trigger');

    if (shape === 'circle') {
        button.dataset.shape = 'circle';
    }

    if (pulse) {
        button.dataset.animate = 'pulse';
    }

    const release = () => button.classList.remove('is-pressed');
    const press = () => button.classList.add('is-pressed');

    on(button, 'pointerdown', () => {
        press();
    });
    on(button, 'pointerup', release);
    on(button, 'pointerleave', release);
    on(button, 'blur', release);

    on(button, 'keydown', (event) => {
        if (event.key === ' ' || event.key === 'Enter') {
            press();
            if (event.key === ' ') {
                event.preventDefault();
            }
        }
    });

    on(button, 'keyup', (event) => {
        if (event.key === ' ' || event.key === 'Enter') {
            release();
            if (event.key === ' ') {
                event.preventDefault();
                button.click();
            }
        }
    });
}

function triggerBadgeAnimation(badge) {
    if (!badge) return;
    badge.classList.remove('badge-pop');
    // Trigger reflow to restart animation
    void badge.offsetWidth;
    badge.classList.add('badge-pop');
    setTimeout(() => badge.classList.remove('badge-pop'), 450);
}

const interactiveButtons = [
    { element: themeToggle, pulse: false, shape: 'circle' },
    { element: filterBtn, pulse: true, shape: 'circle' },
    { element: compareBtn, pulse: true, shape: 'circle' },
    { element: wishlistBtn, pulse: true, shape: 'circle' },
    { element: cartBtn, pulse: true, shape: 'circle' },
    { element: userButton, pulse: false },
    { element: adminBtn, pulse: false },
    { element: checkoutBtn, pulse: false }
];

interactiveButtons.forEach(({ element, pulse, shape }) => {
    enhanceInteractiveButton(element, { pulse, shape });
});

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
        triggerBadgeAnimation(cartCountEl);
    }
    updateCartDisplay();
}

function updateWishlistBadge(){
    if(wishlist.length === 0) {
        wishlistCountEl.classList.add('hidden');
    } else {
        wishlistCountEl.classList.remove('hidden');
        wishlistCountEl.textContent = String(wishlist.length);
        triggerBadgeAnimation(wishlistCountEl);
    }
}

function updateCompareBadge() {
    if(compareList.length === 0) {
        compareCountEl.classList.add('hidden');
    } else {
        compareCountEl.classList.remove('hidden');
        compareCountEl.textContent = String(compareList.length);
        triggerBadgeAnimation(compareCountEl);
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

['products', 'blogs', 'categories', 'provinces'].forEach(key => setDataLoading(key, true));

DataService.subscribe('products', (data, detail = {}) => {
    setDataLoading('products', false);
    if (!Array.isArray(data)) {
        return;
    }
    products = data;
    LS.set('HDK_products', products);
    UIEventBus.emit('products:update', { products, detail });
    if (typeof refreshCurrentRoute === 'function') {
        refreshCurrentRoute({ preserveScroll: true });
    }
});

DataService.subscribe('blogs', (data, detail = {}) => {
    setDataLoading('blogs', false);
    if (!Array.isArray(data)) {
        return;
    }
    blogs = data;
    LS.set('HDK_blogs', blogs);
    UIEventBus.emit('blogs:update', { blogs, detail });
});

DataService.subscribe('categories', () => setDataLoading('categories', false));
DataService.subscribe('provinces', () => setDataLoading('provinces', false));

DataService.bootstrap({
    products: {
        fallback: initialProductCount ? products : defaultProducts,
        prime: products
    },
    blogs: {
        fallback: initialBlogCount ? blogs : defaultBlogs,
        prime: blogs
    },
    categories: {
        fallback: DataService.getCached('categories') || {}
    },
    provinces: {
        fallback: DataService.getCached('provinces') || []
    }
}).catch(error => {
    console.warn('Failed to bootstrap data', error);
}).finally(() => {
    ['products', 'blogs', 'categories', 'provinces'].forEach(key => {
        if (loadingRegistry.has(key)) {
            setDataLoading(key, false);
        }
    });
});
