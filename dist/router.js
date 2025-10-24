/* ---------- Dynamic Content Router ---------- */
const DEFAULT_ROUTE = 'home';
let currentRouteParams = [];

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
    blog: ({ params }) => {
        if (params[0] && typeof renderBlogDetailPage === 'function') {
            renderBlogDetailPage(params[0]);
        } else {
            renderBlogPage();
        }
    },
    profile: () => renderProfilePage(),
    orders: () => renderOrdersPage(),
    addresses: () => renderAddressesPage(),
    admin: () => renderAdminPage()
};

function parseHash(hash) {
    const normalized = (hash || '').replace(/^#/, '').trim();
    if (!normalized) {
        return { route: DEFAULT_ROUTE, params: [] };
    }

    const segments = normalized
        .split(':')
        .map(segment => segment.trim())
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
        if (route !== DEFAULT_ROUTE) {
            location.hash = `#${DEFAULT_ROUTE}`;
        } else {
            currentRouteParams = [];
            updateRouteState(DEFAULT_ROUTE, currentRouteParams);
            renderPage();
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

function renderPage(){
    contentRoot.innerHTML = '';

    const handler = ROUTE_HANDLERS[currentPage] || ROUTE_HANDLERS[DEFAULT_ROUTE];
    const context = {
        route: currentPage,
        params: currentRouteParams.slice()
    };

    handler(context);

    mobileMenu.classList.add('hidden');
    userDropdown.classList.remove('open');
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
    page.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">${currentCategory ? getCategoryName(currentCategory) : 'همه محصولات'}</h1>
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

/* ---------- New Pages ---------- */
function renderAddressesPage() {
    if (!user) {
        notify('لطفا ابتدا وارد حساب کاربری خود شوید', true);
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