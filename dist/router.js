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
    let resolvedTitle = DEFAULT_DOCUMENT_TITLE;
    let resolvedDescription = DEFAULT_META_DESCRIPTION;

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

    document.title = resolvedTitle;
    if (metaDescriptionTag) {
        metaDescriptionTag.setAttribute('content', resolvedDescription);
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

function renderPage(){
    contentRoot.innerHTML = '';

    const handler = ROUTE_HANDLERS[currentPage] || ROUTE_HANDLERS[DEFAULT_ROUTE];
    const context = {
        route: currentPage,
        params: currentRouteParams.slice()
    };

    handler(context);

    if (typeof setActiveNavigation === 'function') {
        setActiveNavigation(currentPage);
    }

    updateDocumentMetadata(currentPage, currentRouteParams);

    mobileMenu.classList.add('hidden');
    userDropdown.classList.remove('open');

    window.scrollTo(0, 0);
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
            <div class="col-span-full bg-white dark:bg-gray-800 border border-dashed border-primary/30 rounded-xl p-8 text-center">
                <iconify-icon icon="mdi:magnify" width="48" class="text-primary mb-3"></iconify-icon>
                <p class="text-gray-600 dark:text-gray-400">برای مشاهده نتایج، ابتدا عبارتی را جستجو کنید.</p>
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
                <div class="col-span-full bg-white dark:bg-gray-800 border border-red-200 dark:border-red-500/30 rounded-xl p-8 text-center">
                    <iconify-icon icon="mdi:emoticon-sad-outline" width="48" class="text-red-500 mb-3"></iconify-icon>
                <p class="text-gray-600 dark:text-gray-400">محصولی مطابق با جستجوی شما پیدا نشد. از کلمات کلیدی عمومی‌تر استفاده کنید.</p>
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