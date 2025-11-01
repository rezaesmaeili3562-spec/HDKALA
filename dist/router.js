/* ---------- Dynamic Content Router ---------- */
function navigate(hash){
    const parts = hash.split(':');
    currentPage = parts[0] || 'home';
    currentProductId = parts[1] || null;
    currentCategory = parts[1] || null;
    renderPage();
}

window.addEventListener('hashchange', () => navigate(location.hash.slice(1)));
window.addEventListener('load', () => navigate(location.hash.slice(1) || 'home'));

function renderPage(){
    contentRoot.innerHTML = '';

    if (typeof document !== 'undefined') {
        document.body.classList.toggle('admin-mode', currentPage === 'admin');
    }

    switch(currentPage) {
        case 'login':
            renderLoginPage();
            break;
        case 'signup':
            renderSignupPage();
            break;
        case 'home':
            renderHomePage();
            break;
        case 'products':
            renderProductsPage();
            break;
        case 'product':
            renderProductDetailPage(currentProductId);
            break;
        case 'wishlist':
            renderWishlistPage();
            break;
        case 'compare':
            renderComparePage();
            break;
        case 'cart':
            renderCartPage();
            break;
        case 'checkout':
            renderCheckoutPage();
            break;
        case 'about':
            renderAboutPage();
            break;
        case 'contact':
            renderContactPage();
            break;
        case 'blog':
            renderBlogPage();
            break;
        case 'profile':
            renderProfilePage();
            break;
        case 'orders':
            renderOrdersPage();
            break;
        case 'addresses':
            renderAddressesPage();
            break;
        case 'admin':
            if (typeof ensureAdminAccess === 'function' && !ensureAdminAccess()) {
                if (location.hash !== '#home') {
                    location.hash = '#home';
                } else {
                    renderHomePage();
                }
                return;
            }
            renderAdminPage();
            break;
        default:
            renderHomePage();
    }
    
    mobileMenu.classList.add('hidden');
    userDropdown.classList.remove('open');
}

function quickAddDemoProduct(e){
    if (e) {
        e.preventDefault();
    }

    const demoIndex = products.filter(product => (product.id || '').startsWith('demo_')).length + 1;
    const demoProduct = {
        id: uid('demo_'),
        name: `محصول آزمایشی ${demoIndex}`,
        price: 1990000,
        desc: 'این آیتم برای تست سریع رابط کاربری به صورت نمایشی اضافه شده است.',
        img: '',
        rating: 4,
        discount: 10,
        category: 'electronics',
        status: 'new',
        stock: 5,
        brand: 'HDK Demo',
        features: ['محصول نمایشی', 'افزوده شده برای آزمایش'],
        colors: [],
        specifications: {},
        created: new Date().toISOString()
    };

    products = [demoProduct, ...products];
    LS.set('HDK_products', products);

    if (typeof updateBrandFilter === 'function') {
        updateBrandFilter();
    }

    const featuredContainer = $('#featuredProducts');
    if (featuredContainer) {
        const featured = products
            .filter(p => p.discount > 0 || p.status === 'hot' || p.status === 'new')
            .slice(0, 8);
        renderProductsList(featured, featuredContainer);
    }

    const productsGrid = $('#productsGrid');
    if (productsGrid) {
        const hasActiveFilters = (
            (searchInput && searchInput.value.trim() !== '') ||
            (minPrice && minPrice.value) ||
            (maxPrice && maxPrice.value) ||
            (categoryFilter && categoryFilter.value) ||
            (discountFilter && discountFilter.value) ||
            (brandFilter && brandFilter.value) ||
            (stockFilter && stockFilter.value) ||
            (ratingFilter && ratingFilter.value)
        );

        if (typeof applyFilters === 'function' && hasActiveFilters) {
            applyFilters();
        } else {
            const list = currentCategory
                ? products.filter(p => p.category === currentCategory)
                : products.slice();
            renderProducts(list);
        }
    }

    notify('یک محصول نمایشی برای آزمایش به لیست محصولات اضافه شد!');
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
    if (featuredProducts) {
        const featured = products.filter(p => p.discount > 0 || p.status === 'hot' || p.status === 'new').slice(0, 8);
        renderProductsList(featured, featuredProducts);
        featuredProducts.addEventListener('click', handleProductActions);
    }

    if (quickAddDemo) {
        quickAddDemo.addEventListener('click', quickAddDemoProduct);
    }
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
    const adminSession = typeof getAdminSession === 'function' ? getAdminSession() : null;
    const adminInfo = adminSession && adminSession.info ? adminSession.info : {};
    const adminName = (adminInfo.fullName && adminInfo.fullName.trim()) ? adminInfo.fullName : 'ادمین سیستم';
    const adminPhone = adminInfo.phone || '---';
    const adminEmail = adminInfo.email || '---';

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(order => (order.status || '').toLowerCase() === 'processing').length;
    const deliveredOrders = orders.filter(order => (order.status || '').toLowerCase() === 'delivered').length;
    const inStockCount = products.filter(p => p.stock > 0).length;
    const lowStockCount = products.filter(p => p.stock <= 3).length;
    const discountProducts = products.filter(p => p.discount > 0).length;

    const page = document.createElement('div');
    page.className = 'space-y-8';
    page.innerHTML = `
        <section class="relative overflow-hidden rounded-3xl text-white shadow-xl border border-primary/30" style="background: linear-gradient(135deg, #1d4ed8, #6d28d9);">
            <div class="absolute -top-24 -left-20 w-72 h-72 rounded-full opacity-30" style="background: radial-gradient(circle, rgba(255,255,255,0.4), transparent 60%);"></div>
            <div class="absolute bottom-0 right-0 w-80 h-80 opacity-20" style="background: radial-gradient(circle, rgba(255,255,255,0.3), transparent 65%);"></div>
            <div class="relative z-10 p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <p class="text-sm uppercase tracking-widest text-white/70">مرکز کنترل مدیریت</p>
                    <h1 class="text-3xl font-bold mt-2">خوش آمدید، ${adminName}</h1>
                    <div class="mt-4 space-y-2 text-sm text-white/80">
                        <div class="flex items-center gap-2"><iconify-icon icon="mdi:email-outline" width="18"></iconify-icon><span>${adminEmail}</span></div>
                        <div class="flex items-center gap-2"><iconify-icon icon="mdi:phone" width="18"></iconify-icon><span>${adminPhone}</span></div>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <button type="button" class="nav-auth-btn brand-outline" data-admin-action="reports">گزارش فروش امروز</button>
                    <a href="#products" class="nav-auth-btn brand-gradient">مشاهده فروشگاه</a>
                </div>
            </div>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div class="admin-dashboard-card bg-white dark:bg-gray-800 rounded-2xl border border-primary/20 p-6 shadow-md">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">محصولات فعال</p>
                        <div class="text-3xl font-bold text-primary mt-2">${products.length}</div>
                    </div>
                    <iconify-icon icon="mdi:package-variant" width="30" class="text-primary/70"></iconify-icon>
                </div>
                <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">${lowStockCount} محصول موجودی رو به اتمام دارند.</p>
            </div>
            <div class="admin-dashboard-card bg-white dark:bg-gray-800 rounded-2xl border border-primary/20 p-6 shadow-md">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">درآمد کل</p>
                        <div class="text-3xl font-bold text-green-500 mt-2">${formatPrice(totalRevenue)}</div>
                    </div>
                    <iconify-icon icon="mdi:chart-line" width="30" class="text-green-500/70"></iconify-icon>
                </div>
                <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">${orders.length} سفارش ثبت شده در سیستم.</p>
            </div>
            <div class="admin-dashboard-card bg-white dark:bg-gray-800 rounded-2xl border border-primary/20 p-6 shadow-md">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">وضعیت سفارش‌ها</p>
                        <div class="text-3xl font-bold text-blue-500 mt-2">${pendingOrders}</div>
                    </div>
                    <iconify-icon icon="mdi:clipboard-list" width="30" class="text-blue-500/70"></iconify-icon>
                </div>
                <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">${deliveredOrders} سفارش تحویل شده ثبت شده است.</p>
            </div>
            <div class="admin-dashboard-card bg-white dark:bg-gray-800 rounded-2xl border border-primary/20 p-6 shadow-md">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">محتوای دیجیتال</p>
                        <div class="text-3xl font-bold text-purple-500 mt-2">${blogs.length}</div>
                    </div>
                    <iconify-icon icon="mdi:pen" width="30" class="text-purple-500/70"></iconify-icon>
                </div>
                <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">${discountProducts} محصول دارای تخفیف فعال است.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div class="admin-dashboard-card bg-white dark:bg-gray-800 rounded-2xl border border-primary/20 p-6 shadow-md">
                <h3 class="text-lg font-semibold mb-4">عملیات سریع</h3>
                <div class="space-y-3">
                    <button type="button" class="w-full px-4 py-3 rounded-xl border border-primary/20 text-right hover:bg-primary/10 transition-all duration-200" data-admin-action="inventory">بررسی موجودی انبار</button>
                    <button type="button" class="w-full px-4 py-3 rounded-xl border border-primary/20 text-right hover:bg-primary/10 transition-all duration-200" data-admin-action="users">مدیریت مشتریان وفادار</button>
                    <button type="button" class="w-full px-4 py-3 rounded-xl border border-primary/20 text-right hover:bg-primary/10 transition-all duration-200" data-admin-action="support">ارسال پیام پشتیبانی</button>
                    <button type="button" class="w-full px-4 py-3 rounded-xl border border-primary/20 text-right hover:bg-primary/10 transition-all duration-200" data-admin-action="campaign">ایجاد کمپین تبلیغاتی</button>
                </div>
            </div>
            <div class="admin-dashboard-card bg-white dark:bg-gray-800 rounded-2xl border border-primary/20 p-6 shadow-md">
                <h3 class="text-lg font-semibold mb-4">شاخص‌های کلیدی</h3>
                <ul class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <li class="flex items-center justify-between"><span>سفارش‌های در انتظار بررسی</span><span class="font-semibold text-blue-500">${pendingOrders}</span></li>
                    <li class="flex items-center justify-between"><span>سفارش‌های تحویل شده</span><span class="font-semibold text-green-500">${deliveredOrders}</span></li>
                    <li class="flex items-center justify-between"><span>میانگین ارزش سفارش</span><span class="font-semibold">${orders.length ? formatPrice(Math.round(totalRevenue / Math.max(orders.length,1))) : '۰ تومان'}</span></li>
                    <li class="flex items-center justify-between"><span>محصولات دارای تخفیف</span><span class="font-semibold">${discountProducts}</span></li>
                </ul>
            </div>
            <div class="admin-dashboard-card bg-white dark:bg-gray-800 rounded-2xl border border-primary/20 p-6 shadow-md" id="adminActionOutput">
                <h3 class="text-lg font-semibold mb-4">مرکز اعلان‌ها</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">یکی از عملیات سریع را انتخاب کنید تا گزارش مربوطه نمایش داده شود.</p>
                <div id="adminActionDetails" class="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300"></div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="admin-dashboard-card bg-white dark:bg-gray-800 rounded-2xl border border-primary/20 p-6 shadow-md">
                <h3 class="text-lg font-semibold mb-4">مدیریت محصولات</h3>
                <div class="flex flex-col gap-4">
                    <button class="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors" onclick="openAdminPanel()">
                        باز کردن پنل محصولات
                    </button>
                    <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div class="p-4 rounded-xl bg-primary/10">
                            <div class="text-xs text-gray-500 dark:text-gray-400">محصولات موجود</div>
                            <div class="text-xl font-semibold text-primary mt-1">${inStockCount}</div>
                        </div>
                        <div class="p-4 rounded-xl bg-red-100 dark:bg-red-500/10">
                            <div class="text-xs text-red-500">نیازمند تأمین</div>
                            <div class="text-xl font-semibold text-red-500 mt-1">${lowStockCount}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="admin-dashboard-card bg-white dark:bg-gray-800 rounded-2xl border border-primary/20 p-6 shadow-md">
                <h3 class="text-lg font-semibold mb-4">مدیریت بلاگ</h3>
                ${createBlogManagement()}
            </div>
        </div>
    `;

    contentRoot.appendChild(page);
    setupBlogManagement();
    if (typeof handleAdminQuickAction === 'function') {
        handleAdminQuickAction('reports', { notifyMessage: 'شما وارد پنل مدیریت شدید' });
    }
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