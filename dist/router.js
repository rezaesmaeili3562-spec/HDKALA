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
        const isDedicatedAdminWindow = currentPage === 'admin' && typeof isAdminWindow === 'function' && isAdminWindow();
        document.body.classList.toggle('admin-window', isDedicatedAdminWindow);
        if (!isDedicatedAdminWindow) {
            document.body.classList.remove('admin-window');
        }
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


function renderAdminPage(options = {}) {
    ensureAdminWindowClasses();

    const adminSession = typeof getAdminSession === 'function' ? getAdminSession() : null;
    const adminInfo = adminSession && adminSession.info ? adminSession.info : {};
    const adminName = (adminInfo.fullName && adminInfo.fullName.trim()) ? adminInfo.fullName : 'ادمین سیستم';
    const adminPhone = adminInfo.phone || '---';
    const adminEmail = adminInfo.email || '---';
    const lastLogin = adminSession && adminSession.lastLogin ? formatAdminDate(adminSession.lastLogin) : '---';

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(order => (order.status || '').toLowerCase() === 'processing').length;
    const shippedOrders = orders.filter(order => (order.status || '').toLowerCase() === 'shipped').length;
    const deliveredOrders = orders.filter(order => (order.status || '').toLowerCase() === 'delivered').length;
    const cancelledOrders = orders.filter(order => (order.status || '').toLowerCase() === 'cancelled').length;
    const inStockCount = products.filter(p => p.stock > 0).length;
    const lowStockCount = products.filter(p => p.stock <= 5).length;
    const discountProducts = products.filter(p => p.discount > 0).length;
    const averageOrder = orders.length ? Math.round(totalRevenue / Math.max(orders.length, 1)) : 0;
    const favoriteCount = typeof wishlist !== 'undefined' ? wishlist.length : 0;

    const lowStockProducts = products
        .filter(p => p.stock <= 5)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 6);

    const recentOrders = orders
        .slice()
        .sort((a, b) => {
            const aDate = new Date(a.date || 0).getTime();
            const bDate = new Date(b.date || 0).getTime();
            return bDate - aDate;
        })
        .slice(0, 5);

    const notesPreview = adminNotes.slice(0, 6);

    const recentOrdersHtml = recentOrders.length
        ? `<div class="space-y-4">${recentOrders.map(order => {
            const status = (order.status || '').toLowerCase();
            const items = Array.isArray(order.items) ? order.items : [];
            const totalItems = items.reduce((sum, item) => sum + (item.qty || 0), 0);
            const itemsPreview = items.slice(0, 3).map(item => {
                const product = getProductById(item.productId);
                const productName = product ? product.name : 'آیتم حذف شده';
                const qty = item.qty || 0;
                return `<li class="flex items-center justify-between"><span>${productName}</span><span>${qty} عدد</span></li>`;
            }).join('');
            const statusButtons = ['processing', 'shipped', 'delivered'].map(targetStatus => `
                <button type="button" class="admin-status-btn" data-order-action="status" data-status="${targetStatus}" data-id="${order.id}" ${status === targetStatus ? 'disabled' : ''}>${getOrderStatusLabel(targetStatus)}</button>
            `).join('');
            const cancelButton = `
                <button type="button" class="admin-status-btn" data-order-action="status" data-status="cancelled" data-id="${order.id}" ${status === 'cancelled' ? 'disabled' : ''}>لغو</button>
            `;
            return `
                <div class="rounded-2xl p-4" style="background: rgba(15,23,42,0.6); border: 1px solid rgba(148,163,184,0.18);">
                    <div class="flex items-start justify-between gap-2">
                        <div>
                            <h4 class="font-semibold text-white text-sm">سفارش #${order.id}</h4>
                            <p class="text-xs text-gray-300 mt-1">${formatAdminDate(order.date)}</p>
                        </div>
                        <span class="px-3 py-1 rounded-full text-xs ${getOrderStatusBadgeClass(status)}">${getOrderStatusLabel(status)}</span>
                    </div>
                    <div class="mt-3 flex items-center justify-between text-xs text-gray-300">
                        <span>تعداد اقلام: ${totalItems}</span>
                        <span>مبلغ کل: ${formatPrice(order.total || 0)}</span>
                    </div>
                    ${itemsPreview ? `<ul class="mt-3 space-y-1 text-xs text-gray-300">${itemsPreview}</ul>` : ''}
                    <div class="mt-3 flex flex-wrap gap-2">
                        ${statusButtons}
                        ${cancelButton}
                    </div>
                </div>
            `;
        }).join('')}</div>`
        : `<p class="text-sm text-gray-500 dark:text-gray-400">هنوز سفارشی برای مدیریت وجود ندارد.</p>`;

    const lowStockHtml = lowStockProducts.length
        ? `<div class="space-y-3">${lowStockProducts.map(product => `
            <div class="flex items-start justify-between gap-3 rounded-2xl p-3" style="background: rgba(30,41,59,0.55); border: 1px solid rgba(148,163,184,0.18);">
                <div class="flex-1">
                    <h4 class="font-semibold text-sm text-white">${product.name}</h4>
                    <p class="text-xs text-gray-300 mt-1">موجودی فعلی: ${product.stock} عدد</p>
                    <p class="text-xs text-gray-400 mt-1">دسته‌بندی: ${getCategoryName(product.category)}</p>
                </div>
                <div class="flex flex-col gap-2">
                    <button type="button" class="admin-stock-btn" data-stock-action="restock" data-id="${product.id}" data-amount="5">افزایش ۵ عددی</button>
                    <button type="button" class="admin-status-btn" data-stock-action="markout" data-id="${product.id}">اعلام اتمام</button>
                </div>
            </div>
        `).join('')}</div>`
        : `<p class="text-sm text-gray-500 dark:text-gray-400">تمام موجودی‌ها در وضعیت مناسبی قرار دارند.</p>`;

    const notesHtml = notesPreview.length
        ? notesPreview.map(note => `
            <div class="admin-note-card rounded-2xl p-4 flex flex-col gap-3">
                <div class="flex items-start justify-between gap-2">
                    <div>
                        <h4 class="font-semibold text-sm text-white">${note.title}</h4>
                        <p class="text-xs text-gray-300 mt-1">${formatAdminDate(note.createdAt)}</p>
                        ${note.owner ? `<p class="text-xs text-gray-400 mt-1">مسئول: ${note.owner}</p>` : ''}
                    </div>
                    <button type="button" class="admin-status-btn" data-note-action="remove" data-id="${note.id}">حذف</button>
                </div>
                <p class="text-sm text-gray-200 leading-relaxed">${note.details || '---'}</p>
            </div>
        `).join('')
        : `<p class="text-sm text-gray-500 dark:text-gray-400">هنوز یادداشتی ثبت نشده است.</p>`;

    const page = document.createElement('div');
    page.className = 'space-y-8';
    page.innerHTML = `
        <div class="admin-topbar rounded-2xl px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white">
            <div>
                <p class="text-sm text-white/70">داشبورد مدیریت فروشگاه</p>
                <h1 class="text-2xl font-bold mt-1">کنترل پنل HDKALA</h1>
                <p class="text-xs text-white/60 mt-2">آخرین ورود: ${lastLogin}</p>
            </div>
            <div class="flex flex-wrap gap-3">
                <button type="button" class="admin-action-btn admin-action-btn--primary" data-admin-action="reports">گزارش امروز</button>
                <button type="button" class="admin-action-btn admin-action-btn--secondary" data-admin-open-store>نمایش فروشگاه</button>
                <button type="button" class="admin-action-btn admin-action-btn--danger" data-admin-logout>خروج از مدیریت</button>
            </div>
        </div>

        <section class="relative overflow-hidden rounded-3xl text-white shadow-xl border border-primary/30" style="background: linear-gradient(135deg, rgba(37,99,235,0.92), rgba(124,58,237,0.85));">
            <div class="absolute -top-24 -left-20 w-72 h-72 rounded-full opacity-30" style="background: radial-gradient(circle, rgba(255,255,255,0.35), transparent 60%);"></div>
            <div class="absolute bottom-0 right-0 w-80 h-80 opacity-20" style="background: radial-gradient(circle, rgba(255,255,255,0.25), transparent 65%);"></div>
            <div class="relative z-10 p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <p class="text-sm uppercase tracking-widest text-white/70">مرکز کنترل مدیریت</p>
                    <h2 class="text-3xl font-bold mt-2">سلام، ${adminName}</h2>
                    <div class="mt-4 space-y-2 text-sm text-white/80">
                        <div class="flex items-center gap-2"><iconify-icon icon="mdi:email-outline" width="18"></iconify-icon><span>${adminEmail}</span></div>
                        <div class="flex items-center gap-2"><iconify-icon icon="mdi:phone" width="18"></iconify-icon><span>${adminPhone}</span></div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 text-center">
                    <div class="rounded-2xl px-4 py-3" style="background: rgba(255,255,255,0.12);">
                        <div class="text-xs text-white/70 mb-1">کل فروش</div>
                        <div class="text-xl font-bold">${formatPrice(totalRevenue)}</div>
                    </div>
                    <div class="rounded-2xl px-4 py-3" style="background: rgba(255,255,255,0.12);">
                        <div class="text-xs text-white/70 mb-1">سفارش‌های فعال</div>
                        <div class="text-xl font-bold">${pendingOrders}</div>
                    </div>
                    <div class="rounded-2xl px-4 py-3" style="background: rgba(255,255,255,0.12);">
                        <div class="text-xs text-white/70 mb-1">محصولات موجود</div>
                        <div class="text-xl font-bold">${inStockCount}</div>
                    </div>
                    <div class="rounded-2xl px-4 py-3" style="background: rgba(255,255,255,0.12);">
                        <div class="text-xs text-white/70 mb-1">لیست علاقه‌مندی</div>
                        <div class="text-xl font-bold">${favoriteCount}</div>
                    </div>
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
                <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">${lowStockCount} محصول در آستانه اتمام موجودی است.</p>
            </div>
            <div class="admin-dashboard-card bg-white dark:bg-gray-800 rounded-2xl border border-primary/20 p-6 shadow-md">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">درآمد کل</p>
                        <div class="text-3xl font-bold text-green-500 mt-2">${formatPrice(totalRevenue)}</div>
                    </div>
                    <iconify-icon icon="mdi:chart-line" width="30" class="text-green-500/70"></iconify-icon>
                </div>
                <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">${orders.length} سفارش در سیستم ثبت شده است.</p>
            </div>
            <div class="admin-dashboard-card bg-white dark:bg-gray-800 rounded-2xl border border-primary/20 p-6 shadow-md">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">وضعیت سفارش‌ها</p>
                        <div class="text-3xl font-bold text-blue-500 mt-2">${pendingOrders}</div>
                    </div>
                    <iconify-icon icon="mdi:clipboard-list" width="30" class="text-blue-500/70"></iconify-icon>
                </div>
                <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">${deliveredOrders} سفارش تحویل شده و ${shippedOrders} سفارش در مسیر ارسال است.</p>
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
                    <li class="flex items-center justify-between"><span>سفارش‌های ارسال شده</span><span class="font-semibold text-blue-400">${shippedOrders}</span></li>
                    <li class="flex items-center justify-between"><span>سفارش‌های تحویل شده</span><span class="font-semibold text-green-500">${deliveredOrders}</span></li>
                    <li class="flex items-center justify-between"><span>سفارش‌های لغو شده</span><span class="font-semibold text-red-500">${cancelledOrders}</span></li>
                    <li class="flex items-center justify-between"><span>میانگین ارزش سفارش</span><span class="font-semibold">${orders.length ? formatPrice(averageOrder) : '۰ تومان'}</span></li>
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
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold">مدیریت سفارش‌ها</h3>
                    <span class="text-xs text-gray-500 dark:text-gray-400">کل سفارش‌ها: ${orders.length}</span>
                </div>
                ${recentOrdersHtml}
            </div>
            <div class="admin-dashboard-card bg-white dark:bg-gray-800 rounded-2xl border border-primary/20 p-6 shadow-md">
                <h3 class="text-lg font-semibold mb-4">پایش موجودی</h3>
                ${lowStockHtml}
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="admin-dashboard-card bg-white dark:bg-gray-800 rounded-2xl border border-primary/20 p-6 shadow-md">
                <h3 class="text-lg font-semibold mb-4">مدیریت محصولات</h3>
                <div class="flex flex-col gap-4">
                    <button class="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors" onclick="openAdminPanel()">باز کردن پنل محصولات</button>
                    <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div class="p-4 rounded-xl" style="background: rgba(79, 70, 229, 0.12);">
                            <div class="text-xs text-gray-500 dark:text-gray-400">محصولات موجود</div>
                            <div class="text-xl font-semibold text-primary mt-1">${inStockCount}</div>
                        </div>
                        <div class="p-4 rounded-xl" style="background: rgba(239, 68, 68, 0.12);">
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

        <div class="admin-dashboard-card bg-white dark:bg-gray-800 rounded-2xl border border-primary/20 p-6 shadow-md">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h3 class="text-lg font-semibold">یادداشت‌های مدیریتی</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">برای پیگیری کارهای روزانه یادداشت ثبت کنید.</p>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">تعداد یادداشت‌ها: ${adminNotes.length}</span>
            </div>
            <form id="adminNoteForm" class="mt-6 space-y-3">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input type="text" name="title" class="admin-input" placeholder="عنوان یادداشت" required maxlength="80">
                    <input type="text" name="owner" class="admin-input" placeholder="مسئول پیگیری (اختیاری)" maxlength="40">
                </div>
                <textarea name="details" class="admin-textarea" placeholder="توضیحات یادداشت..."></textarea>
                <button type="submit" class="admin-action-btn admin-action-btn--secondary w-full md:w-auto">ثبت یادداشت</button>
            </form>
            <div class="mt-6 ${notesPreview.length ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}" id="adminNotesList">
                ${notesHtml}
            </div>
        </div>
    `;

    contentRoot.appendChild(page);
    setupBlogManagement();
    if (!options.skipWelcome && typeof handleAdminQuickAction === 'function') {
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