/* ---------- LocalStorage wrapper ---------- */
const LS = {
    get(k, d){ try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } },
    set(k, v){ localStorage.setItem(k, JSON.stringify(v)); }
};

const ADMIN_NOTES_KEY = 'HDK_admin_notes';

/* ---------- Sample Data ---------- */
const sampleProducts = [
    { 
        id: 'p1', 
        name: 'هدفون بی‌سیم Sony WH-1000XM4', 
        price: 990000, 
        desc:'هدفون بی‌سیم با نویزکنسلینگ پیشرفته و کیفیت صدای استثنایی. مناسب برای مسافرت و محیط‌های پرسر و صدا.', 
        img:'', 
        rating: 5, 
        discount: 15, 
        category: 'electronics', 
        status: 'new', 
        stock: 50, 
        brand: 'Sony',
        features: ['نویزکنسلینگ', 'باتری 30 ساعته', 'شارژ سریع', 'کنترل لمسی'],
        colors: ['مشکی', 'نقره‌ای', 'آبی'],
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
        img:'', 
        rating: 5, 
        discount: 0, 
        category: 'electronics', 
        status: 'hot', 
        stock: 12, 
        brand: 'Samsung',
        features: ['دوربین 200MP', 'پردازنده اسنپدراگون', 'نمایشگر 120Hz', 'شارژ سریع 45W'],
        colors: ['مشکی', 'سبز', 'بنفش'],
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
        img:'', 
        rating: 5, 
        discount: 10, 
        category: 'electronics', 
        status: 'bestseller', 
        stock: 5, 
        brand: 'Apple',
        features: ['تراشه M2 Pro', 'نمایشگر XDR', 'باتری 18 ساعته', '18GB رم'],
        colors: ['نقره‌ای', 'Space Gray'],
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
        img:'', 
        rating: 4, 
        discount: 20, 
        category: 'books', 
        status: '', 
        stock: 100, 
        brand: 'نشر پیکان',
        features: ['جلد گالینگور', 'ترجمه روان', 'کیفیت چاپ بالا'],
        colors: [],
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
        img:'', 
        rating: 4, 
        discount: 25, 
        category: 'sports', 
        status: 'hot', 
        stock: 30, 
        brand: 'Nike',
        features: ['تکنولوژی Air Max', 'کفی اورتوپدی', 'مناسب دویدن', 'تنفس پذیری بالا'],
        colors: ['سفید', 'مشکی', 'قرمز'],
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
        img:'', 
        rating: 4, 
        discount: 15, 
        category: 'home', 
        status: '', 
        stock: 8, 
        brand: 'مبل ایران',
        features: ['پارچه مخمل', 'قابلیت تنظیم پشتی', 'پر کوسن‌ها', 'قاب فلزی'],
        colors: ['مشکی', 'خاکستری', 'آبی'],
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
        img:'', 
        rating: 5, 
        discount: 30, 
        category: 'home', 
        status: 'new', 
        stock: 15, 
        brand: 'Delonghi',
        features: ['تمام اتوماتیک', 'ساخت کاپوچینو', 'پمپ 15 بار', 'سیستم گرمایش سریع'],
        colors: ['مشکی', 'نقره‌ای'],
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
        img:'', 
        rating: 4, 
        discount: 40, 
        category: 'fashion', 
        status: 'hot', 
        stock: 25, 
        brand: 'Zara',
        features: ['پر طبیعی', 'ضد آب', 'جیب‌های متعدد', 'کاپوت جدا شونده'],
        colors: ['مشکی', 'خاکستری', 'آبی دریایی'],
        specifications: {
            'جنس': 'نایلون و پر',
            'سایز': 'S-XXL',
            'کاربرد': 'زمستانی',
            'شستشو': 'خشک شویی'
        }
    }
];

const sampleBlogs = [
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
const sampleAddresses = [];
const sampleNotifications = [];

/* ---------- Initial bootstrap data ---------- */
if(!LS.get('HDK_products')) {
    LS.set('HDK_products', sampleProducts);
}
if(!LS.get('HDK_cart')) LS.set('HDK_cart', []);
if(!LS.get('HDK_orders')) LS.set('HDK_orders', []);
if(!LS.get('HDK_user')) LS.set('HDK_user', null);
if(!LS.get('HDK_wishlist')) LS.set('HDK_wishlist', []);
if(!LS.get('HDK_comments')) LS.set('HDK_comments', {});
if(!LS.get('HDK_viewHistory')) LS.set('HDK_viewHistory', []);
if(!LS.get('HDK_compare')) LS.set('HDK_compare', []);
if(!LS.get(ADMIN_NOTES_KEY)) LS.set(ADMIN_NOTES_KEY, []);
if(!LS.get('HDK_blogs')) LS.set('HDK_blogs', sampleBlogs);
if(!LS.get('HDK_addresses')) LS.set('HDK_addresses', sampleAddresses);
if(!LS.get('HDK_notifications')) LS.set('HDK_notifications', sampleNotifications);

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
let adminNotes = LS.get(ADMIN_NOTES_KEY, []);
let currentPage = 'home';
let currentProductId = null;
let editingProductId = null;

/* ---------- DOM refs ---------- */
const contentRoot = $('#content');
const cartCountEl = $('#cartCount');
const wishlistCountEl = $('#wishlistCount');
const compareCountEl = $('#compareCount');
const userLabel = $('#userLabel');
const adminAccessLink = $('#adminAccessLink');
const mobileMenuBtn = $('#mobileMenuBtn');
const mobileMenu = $('#mobileMenu');
const searchInput = $('#searchInput');
const filterBtn = $('#filterBtn');
const filterSidebar = $('#filterSidebar');
const closeFilters = $('#closeFilters');
const userButton = $('#userButton');
const userDropdown = $('#userDropdown');
const userDropdownContent = $('#userDropdownContent');
const authButtonGroup = $('#authButtonGroup');
const mobileAuthButtons = $('#mobileAuthButtons');
const navLoginBtn = $('#navLoginBtn');
const navSignupBtn = $('#navSignupBtn');
const mobileLoginBtn = $('#mobileLoginBtn');
const mobileSignupBtn = $('#mobileSignupBtn');
const themeToggle = $('#themeToggle');
const themeIcon = $('#themeIcon');
const root = document.documentElement;
const cartBtn = $('#cartBtn');
const cartSidebar = $('#cartSidebar');
const closeCart = $('#closeCart');
const cartItems = $('#cartItems');
const cartTotal = $('#cartTotal');
const cartDiscount = $('#cartDiscount');
const cartFinalTotal = $('#cartFinalTotal');
const checkoutBtn = $('#checkoutBtn');
const compareBtn = $('#compareBtn');
const compareModal = $('#compareModal');
const closeCompareModal = $('#closeCompareModal');
const compareProducts = $('#compareProducts');
const addressQuickPanel = $('#addressQuickPanel');
const addressQuickContent = $('#addressQuickContent');
const closeAddressQuick = $('#closeAddressQuick');
const addressQuickTriggers = $$('.address-quick-trigger');

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

/* ---------- Admin Login Elements ---------- */
const adminLoginModal = $('#adminLoginModal');
const closeAdminLoginModal = $('#closeAdminLoginModal');
const adminLoginStep = $('#adminLoginStep');
const adminOtpStep = $('#adminOtpStep');
const adminLoginForm = $('#adminLoginForm');
const adminOtpForm = $('#adminOtpForm');
const adminOtpBack = $('#adminOtpBack');
const adminLoginMessage = $('#adminLoginMessage');

/* ---------- Filter Elements ---------- */
const sortSelect = $('#sortSelect');
const minPrice = $('#minPrice');
const maxPrice = $('#maxPrice');
const categoryFilter = $('#categoryFilter');
const discountFilter = $('#discountFilter');
const brandFilter = $('#brandFilter');
const stockFilter = $('#stockFilter');
const ratingFilter = $('#ratingFilter');
const priceRange = $('#priceRange');
const applyFilterBtn = $('#applyFilter');
const clearFilterBtn = $('#clearFilter');

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

function updateCartDisplay() {
    if (typeof Templates === 'undefined') return;
    if (!cartItems) return;
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.appendChild(Templates.clone('tpl-cart-empty'));
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

        const fragment = Templates.clone('tpl-cart-item');
        const cartItemEl = fragment.querySelector('[data-element="cart-item"]') || fragment.firstElementChild;
        if (!cartItemEl) {
            return;
        }

        const nameEl = fragment.querySelector('[data-element="cart-item-name"]');
        if (nameEl) {
            nameEl.textContent = product.name;
        }

        const qtyEl = fragment.querySelector('[data-element="cart-qty"]');
        if (qtyEl) {
            qtyEl.textContent = item.qty;
        }

        const priceEl = fragment.querySelector('[data-element="cart-price"]');
        if (priceEl) {
            priceEl.textContent = formatPrice(finalPrice);
        }

        const savingsEl = fragment.querySelector('[data-element="cart-savings"]');
        if (savingsEl) {
            if (itemDiscount > 0) {
                savingsEl.textContent = `${formatPrice(itemDiscount)} صرفه‌جویی`;
                savingsEl.classList.remove('hidden');
            } else {
                savingsEl.classList.add('hidden');
            }
        }

        const decreaseBtn = fragment.querySelector('[data-element="cart-decrease"]');
        if (decreaseBtn) {
            decreaseBtn.dataset.id = product.id;
            decreaseBtn.addEventListener('click', (e) => {
                const productId = e.currentTarget.getAttribute('data-id');
                updateCartItemQty(productId, -1);
            });
        }

        const increaseBtn = fragment.querySelector('[data-element="cart-increase"]');
        if (increaseBtn) {
            increaseBtn.dataset.id = product.id;
            increaseBtn.addEventListener('click', (e) => {
                const productId = e.currentTarget.getAttribute('data-id');
                updateCartItemQty(productId, 1);
            });
        }

        const removeBtn = fragment.querySelector('[data-element="cart-remove"]');
        if (removeBtn) {
            removeBtn.dataset.id = product.id;
            removeBtn.addEventListener('click', (e) => {
                const productId = e.currentTarget.getAttribute('data-id');
                removeFromCart(productId);
            });
        }

        cartItems.appendChild(fragment);
    });

    const shippingCost = total > 500000 ? 0 : 30000;
    const finalTotal = total + shippingCost;

    cartTotal.textContent = formatPrice(total + totalDiscount);
    cartDiscount.textContent = formatPrice(totalDiscount);
    cartShipping.textContent = shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost);
    cartFinalTotal.textContent = formatPrice(finalTotal);
}

function updateCartItemQty(productId, change) {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    const product = getProductById(productId);
    if (!product) return;

    if (change > 0 && item.qty >= product.stock) {
        notify(`فقط ${product.stock} عدد از این محصول در انبار موجود است`, true);
        return;
    }

    item.qty += change;
    if (item.qty <= 0) {
        removeFromCart(productId);
    } else {
        LS.set('HDK_cart', cart);
        updateCartBadge();
        updateCartDisplay();
        notify(change > 0 ? 'تداد محصول افزایش یافت' : 'تعداد محصول کاهش یافت');
    }
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.productId !== productId);
    LS.set('HDK_cart', cart);
    updateCartBadge();
    updateCartDisplay();
    notify('محصول از سبد خرید حذف شد');
}

function addToCart(productId, qty=1){
    const product = getProductById(productId);
    if (!product) return;

    if (product.stock === 0) {
        notify('این محصول در حال حاضر موجود نیست', true);
        return;
    }

    const existing = cart.find(i => i.productId === productId);
    if(existing) {
        if (existing.qty + qty > product.stock) {
            notify(`فقط ${product.stock} عدد از این محصول در انبار موجود است`, true);
            return;
        }
        existing.qty += qty;
    } else {
        if (qty > product.stock) {
            notify(`فقط ${product.stock} عدد از این محصول در انبار موجود است`, true);
            return;
        }
        cart.push({ productId, qty });
    }

    LS.set('HDK_cart', cart);
    updateCartBadge();
    updateCartDisplay();
    notify('محصول به سبد اضافه شد.');
}

function toggleWishlist(productId) {
    if (!productId) return;

    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        notify('محصول از علاقه‌مندی‌ها حذف شد');
    } else {
        wishlist.push(productId);
        notify('محصول به علاقه‌مندی‌ها اضافه شد');
    }

    LS.set('HDK_wishlist', wishlist);
    updateWishlistBadge();

    const isInWishlist = wishlist.includes(productId);
    $$(`.add-to-wishlist[data-id="${productId}"]`).forEach(btn => {
        btn.classList.toggle('active', isInWishlist);
        btn.setAttribute('aria-pressed', isInWishlist ? 'true' : 'false');

        const icon = btn.querySelector('iconify-icon');
        if (icon) {
            icon.setAttribute('icon', isInWishlist ? 'mdi:heart' : 'mdi:heart-outline');
            icon.classList.toggle('text-red-500', isInWishlist);
            icon.classList.toggle('text-gray-600', !isInWishlist);
            icon.classList.toggle('dark:text-gray-400', !isInWishlist);
        }
    });
}

function toggleCompare(productId) {
    const index = compareList.indexOf(productId);
    if (index > -1) {
        compareList.splice(index, 1);
        notify('محصول از لیست مقایسه حذف شد');
    } else {
        if (compareList.length >= 4) {
            notify('حداکثر ۴ محصول قابل مقایسه هستند', true);
            return;
        }
        compareList.push(productId);
        notify('محصول به لیست مقایسه اضافه شد');
    }
    LS.set('HDK_compare', compareList);
    updateCompareBadge();
}

function openCompareModal() {
    if (compareList.length === 0) {
        notify('لطفا ابتدا محصولاتی برای مقایسه انتخاب کنید', true);
        return;
    }
    compareModal.classList.remove('hidden');
    compareModal.classList.add('flex');
    renderCompareProducts();
}

function renderCompareProducts() {
    if (!compareProducts) return;
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
            compareList = compareList.filter(id => id !== productId);
            LS.set('HDK_compare', compareList);
            updateCompareBadge();
            return;
        }

        const productEl = document.createElement('div');
        productEl.innerHTML = createCompareProduct(product);
        compareProducts.appendChild(productEl);
    });

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
            renderCompareProducts();
        });
    });
}

function removeFromCompare(productId) {
    compareList = compareList.filter(id => id !== productId);
    LS.set('HDK_compare', compareList);
    updateCompareBadge();
    renderCompareProducts();
    notify('محصول از مقایسه حذف شد');
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

function getUserAddressesSnapshot() {
    if (!user) {
        return [];
    }
    return addresses.filter(addr => addr.userId === user.id);
}

function createAddressPreview(address) {
    const locationParts = [address.province || '', address.city || ''].filter(Boolean).join('، ');
    return `
        <div class="rounded-xl border border-primary/20 bg-white dark:bg-gray-800 p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <h4 class="text-sm font-semibold text-primary">${address.title || 'آدرس ثبت شده'}</h4>
                ${address.isDefault ? '<span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">پیش‌فرض</span>' : ''}
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">${address.fullAddress || ''}</p>
            <div class="mt-3 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                ${locationParts ? `<div class="flex items-center gap-2"><iconify-icon icon="mdi:map-marker"></iconify-icon><span>${locationParts}</span></div>` : ''}
                <div class="flex items-center gap-2"><iconify-icon icon="mdi:phone"></iconify-icon><span>${address.phone || '---'}</span></div>
                ${address.postalCode ? `<div class="flex items-center gap-2"><iconify-icon icon="mdi:mailbox"></iconify-icon><span>${address.postalCode}</span></div>` : ''}
            </div>
        </div>
    `;
}

function updateAddressQuickPanel(forceClose = false) {
    if (!addressQuickPanel || !addressQuickContent) {
        return;
    }

    if (forceClose) {
        addressQuickPanel.classList.add('hidden');
    }

    if (!user) {
        addressQuickContent.innerHTML = '<p class="text-center text-sm text-gray-500">برای مشاهده آدرس‌ها ابتدا وارد حساب شوید.</p>';
        return;
    }

    const userAddresses = getUserAddressesSnapshot();
    if (userAddresses.length === 0) {
        addressQuickContent.innerHTML = `
            <div class="text-center space-y-3 text-sm">
                <p class="text-gray-500 dark:text-gray-400">هنوز آدرسی ثبت نکرده‌اید.</p>
                <button type="button" class="address-quick-create bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">ثبت آدرس جدید</button>
            </div>
        `;
        return;
    }

    const previews = [...userAddresses]
        .sort((a, b) => (b.isDefault === true) - (a.isDefault === true))
        .slice(0, 3)
        .map(createAddressPreview)
        .join('');

    addressQuickContent.innerHTML = previews;
}

function toggleAuthButtons(show){
    if (authButtonGroup) {
        authButtonGroup.classList.toggle('hidden', !show);
        authButtonGroup.classList.toggle('md:flex', show);
        if (show) {
            authButtonGroup.classList.add('flex');
        } else {
            authButtonGroup.classList.remove('flex');
        }
    }
    if (mobileAuthButtons) {
        mobileAuthButtons.classList.toggle('hidden', !show);
    }
}

function updateUserLabel(){
    const hasAdminSession = typeof getAdminSession === 'function' ? getAdminSession() : null;
    const isAdminActive = !!(hasAdminSession && hasAdminSession.isAuthenticated);

    if (isAdminActive) {
        const adminInfo = hasAdminSession.info || {};
        if (userLabel) {
            userLabel.textContent = (adminInfo.fullName && adminInfo.fullName.trim()) ? adminInfo.fullName : 'ادمین سیستم';
        }
        if (userButton) {
            userButton.classList.remove('hidden');
            userButton.classList.add('flex');
        }
        if (adminAccessLink) {
            adminAccessLink.classList.remove('hidden');
            adminAccessLink.textContent = 'پنل مدیریت';
        }
        toggleAuthButtons(false);
    } else if (user) {
        if (userLabel) {
            userLabel.textContent = (user.name && user.name.trim()) ? user.name : 'کاربر HDKALA';
        }
        if (userButton) {
            userButton.classList.remove('hidden');
            userButton.classList.add('flex');
        }
        if (adminAccessLink) {
            adminAccessLink.classList.remove('hidden');
            adminAccessLink.textContent = 'پنل مدیریت (نسخه نمایشی)';
        }
        toggleAuthButtons(false);
    } else {
        if (userLabel) {
            userLabel.textContent = 'ورود / ثبت‌نام';
        }
        if (userButton) {
            userButton.classList.add('hidden');
            userButton.classList.remove('flex');
        }
        if (adminAccessLink) {
            adminAccessLink.classList.remove('hidden');
            adminAccessLink.textContent = 'ورود مدیریت';
        }
        toggleAuthButtons(true);
    }

    if (typeof updateAddressQuickPanel === 'function') {
        updateAddressQuickPanel(true);
    }

    updateUserDropdown();
}

[navLoginBtn, mobileLoginBtn].filter(Boolean).forEach(btn => {
    btn.addEventListener('click', (event) => {
        event.preventDefault();
        if (userDropdown) {
            userDropdown.classList.remove('open');
        }
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
        location.hash = '#login';
    });
});

[navSignupBtn, mobileSignupBtn].filter(Boolean).forEach(btn => {
    btn.addEventListener('click', (event) => {
        event.preventDefault();
        if (userDropdown) {
            userDropdown.classList.remove('open');
        }
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
        location.hash = '#signup';
    });
});

addressQuickTriggers.forEach(trigger => {
    trigger.addEventListener('click', (event) => {
        event.preventDefault();

        if (userDropdown) {
            userDropdown.classList.remove('open');
        }

        if (!user) {
            notify('برای مدیریت آدرس‌ها ابتدا وارد شوید', true);
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
            location.hash = '#login';
            return;
        }

        const isMobileView = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
        const userAddresses = getUserAddressesSnapshot();

        if (isMobileView) {
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
            location.hash = '#addresses';
            return;
        }

        if (userAddresses.length === 0) {
            updateAddressQuickPanel(true);
            notify('برای ادامه لطفا آدرس جدید ثبت کنید');
            location.hash = '#addresses';
            return;
        }

        updateAddressQuickPanel();
        addressQuickPanel.classList.toggle('hidden');
    });
});

if (closeAddressQuick) {
    closeAddressQuick.addEventListener('click', () => updateAddressQuickPanel(true));
}

if (addressQuickPanel) {
    addressQuickPanel.addEventListener('click', (event) => {
        if (event.target.closest('.address-quick-create')) {
            updateAddressQuickPanel(true);
            location.hash = '#addresses';
        }
    });
}

document.addEventListener('click', (event) => {
    if (!addressQuickPanel || addressQuickPanel.classList.contains('hidden')) {
        return;
    }
    if (event.target.closest('#addressQuickPanel') || event.target.closest('.address-quick-trigger')) {
        return;
    }
    addressQuickPanel.classList.add('hidden');
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        updateAddressQuickPanel(true);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateUserLabel();
    updateAddressQuickPanel(true);
});
