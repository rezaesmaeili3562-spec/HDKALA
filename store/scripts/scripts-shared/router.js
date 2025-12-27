/* ---------- Dynamic Content Router ---------- */
const PRODUCTS_PER_PAGE = 12;
let currentProductsPage = 1;
let currentProductsList = [];
let productsGridRef = null;
let productsCountRef = null;
let productsPaginationRef = null;
let refreshProductsPageView = null;
let lastProductCategory = null;

function navigate(hash){
    const parts = hash.split(':');
    currentPage = parts[0] || 'home';
    currentProductId = currentPage === 'product' ? (parts[1] || null) : null;
    currentCategory = currentPage === 'products' ? (parts[1] || null) : null;
    renderPage();
}

window.addEventListener('hashchange', () => navigate(location.hash.slice(1)));
window.addEventListener('load', () => navigate(location.hash.slice(1) || 'home'));

function renderPage(){
    if (!contentRoot) {
        return;
    }
    contentRoot.innerHTML = '';

    if (currentPage !== 'products') {
        refreshProductsPageView = null;
        productsGridRef = null;
        productsCountRef = null;
        productsPaginationRef = null;
    }

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
        case 'shipping':
            renderShippingPage();
            break;
        case 'terms':
            renderTermsPage();
            break;
        case 'privacy':
            renderPrivacyPage();
            break;
        case 'faq':
            renderFaqPage();
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

    if (contentRoot) {
        contentRoot.classList.remove('page-motion');
        void contentRoot.offsetWidth;
        contentRoot.classList.add('page-motion');
    }
    
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
    if (userDropdown) {
        userDropdown.classList.remove('open');
    }
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
    const fragment = Templates.clone('tpl-home-page');
    contentRoot.appendChild(fragment);

    const pageRoot = $('#homePage', contentRoot);
    if (!pageRoot) {
        return;
    }

    const featuredProductsContainer = $('#featuredProducts', pageRoot);
    const quickAddDemo = $('#quickAddDemo', pageRoot);
    const blogList = $('#homeBlogList', pageRoot);

    if (featuredProductsContainer) {
        const featured = products.filter(p => p.discount > 0 || p.status === 'hot' || p.status === 'new').slice(0, 8);
        renderProductsList(featured, featuredProductsContainer);
        featuredProductsContainer.addEventListener('click', handleProductActions);
    }

    if (blogList) {
        blogList.innerHTML = '';
        blogs.slice(0, 3).forEach(blog => {
            const blogFragment = Templates.clone('tpl-blog-card');
            const card = blogFragment.querySelector('[data-element="blog-card"]') || blogFragment.firstElementChild;
            if (!card) {
                return;
            }

            const imageWrapper = blogFragment.querySelector('[data-element="blog-image-wrapper"]');
            const imageEl = blogFragment.querySelector('[data-element="blog-image"]');
            const placeholder = blogFragment.querySelector('[data-element="blog-placeholder"]');
            if (imageEl) {
                if (blog.image) {
                    imageEl.src = blog.image;
                    imageEl.alt = blog.title;
                    imageEl.classList.remove('hidden');
                    if (placeholder) {
                        placeholder.classList.add('hidden');
                    }
                } else {
                    imageEl.classList.add('hidden');
                    if (placeholder) {
                        placeholder.classList.remove('hidden');
                    }
                }
            }
            if (imageWrapper) {
                imageWrapper.setAttribute('aria-label', blog.title);
            }

            const categoryEl = blogFragment.querySelector('[data-element="blog-category"]');
            if (categoryEl) {
                categoryEl.textContent = blog.category;
            }

            const titleEl = blogFragment.querySelector('[data-element="blog-title"]');
            if (titleEl) {
                titleEl.textContent = blog.title;
            }

            const excerptEl = blogFragment.querySelector('[data-element="blog-excerpt"]');
            if (excerptEl) {
                excerptEl.textContent = blog.excerpt;
            }

            const dateEl = blogFragment.querySelector('[data-element="blog-date"]');
            if (dateEl) {
                dateEl.textContent = blog.date;
            }

            const linkEl = blogFragment.querySelector('[data-element="blog-link"]');
            if (linkEl) {
                linkEl.href = `#blog:${blog.id}`;
            }

            blogList.appendChild(blogFragment);
        });
    }

    const statProducts = pageRoot.querySelector('[data-element="stat-products"]');
    if (statProducts) {
        statProducts.textContent = `${products.length}+`;
    }

    const statOrders = pageRoot.querySelector('[data-element="stat-orders"]');
    if (statOrders) {
        statOrders.textContent = `${orders.length}+`;
    }

    const statUsers = pageRoot.querySelector('[data-element="stat-users"]');
    if (statUsers) {
        statUsers.textContent = `${user ? '۱' : '۰'}+`;
    }

    if (quickAddDemo) {
        quickAddDemo.addEventListener('click', quickAddDemoProduct);
    }
}


/* ---------- Products Page ---------- */
function renderProductsPage(){
    const fragment = Templates.clone('tpl-products-page');
    contentRoot.appendChild(fragment);

    const pageRoot = $('#productsPage', contentRoot);
    if (!pageRoot) {
        return;
    }

    const titleEl = pageRoot.querySelector('[data-element="products-title"]');
    if (titleEl) {
        titleEl.textContent = currentCategory ? getCategoryName(currentCategory) : 'همه محصولات';
    }

    const productsGrid = $('#productsGrid', pageRoot);
    const productsCount = $('#productsCount', pageRoot);
    const paginationContainer = $('#productsPagination', pageRoot);
    const clearAllFilters = $('#clearAllFilters', pageRoot);

    let filteredProducts = products;
    if (currentCategory) {
        filteredProducts = products.filter(p => p.category === currentCategory);
    }

    productsGridRef = productsGrid;
    productsCountRef = productsCount;
    productsPaginationRef = paginationContainer;
    currentProductsList = filteredProducts.slice();

    if (currentCategory !== lastProductCategory) {
        currentProductsPage = 1;
        lastProductCategory = currentCategory || null;
    }

    const updateProductsView = (requestedPage = null) => {
        if (typeof requestedPage === 'number') {
            currentProductsPage = requestedPage;
        }

        const totalItems = currentProductsList.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / PRODUCTS_PER_PAGE));
        if (currentProductsPage > totalPages) {
            currentProductsPage = totalPages;
        }
        if (currentProductsPage < 1) {
            currentProductsPage = 1;
        }

        const start = (currentProductsPage - 1) * PRODUCTS_PER_PAGE;
        const paginated = currentProductsList.slice(start, start + PRODUCTS_PER_PAGE);
        renderProductsList(paginated, productsGridRef);

        if (productsCountRef) {
            productsCountRef.textContent = `${totalItems} محصول`;
        }

        if (productsPaginationRef) {
            const createPageButton = (pageNumber, { label, disabled, active }) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = `px-3 py-2 rounded-lg border border-primary/30 transition-colors ${
                    active ? 'bg-primary text-white' : 'hover:bg-primary/10'
                } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`;
                button.textContent = label;
                if (!disabled) {
                    button.setAttribute('data-page', String(pageNumber));
                }
                return button;
            };

            const createControlButton = (action, { label, disabled }) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = `px-3 py-2 rounded-lg border border-primary/30 transition-colors ${
                    disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-primary/10'
                }`;
                button.textContent = label;
                if (!disabled) {
                    button.setAttribute('data-page', action);
                }
                return button;
            };

            productsPaginationRef.innerHTML = '';
            if (totalPages > 1) {
                productsPaginationRef.appendChild(createControlButton('prev', {
                    label: 'قبلی',
                    disabled: currentProductsPage === 1
                }));

                const pagesToRender = [];
                const windowSize = 5;
                let startPage = Math.max(1, currentProductsPage - 2);
                let endPage = Math.min(totalPages, startPage + windowSize - 1);
                if (endPage - startPage < windowSize - 1) {
                    startPage = Math.max(1, endPage - windowSize + 1);
                }

                if (startPage > 1) {
                    pagesToRender.push(1);
                    if (startPage > 2) {
                        pagesToRender.push('ellipsis-start');
                    }
                }

                for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
                    pagesToRender.push(pageNumber);
                }

                if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                        pagesToRender.push('ellipsis-end');
                    }
                    pagesToRender.push(totalPages);
                }

                pagesToRender.forEach(item => {
                    if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                        const span = document.createElement('span');
                        span.className = 'px-2 py-2 text-gray-400';
                        span.textContent = '...';
                        productsPaginationRef.appendChild(span);
                    } else {
                        const btn = createPageButton(item, {
                            label: String(item),
                            active: currentProductsPage === item
                        });
                        productsPaginationRef.appendChild(btn);
                    }
                });

                productsPaginationRef.appendChild(createControlButton('next', {
                    label: 'بعدی',
                    disabled: currentProductsPage === totalPages
                }));
            }
        }
    };

    refreshProductsPageView = updateProductsView;
    updateProductsView();
    if (productsGrid) {
        productsGrid.addEventListener('click', handleProductActions);
    }

    if (productsPaginationRef) {
        productsPaginationRef.addEventListener('click', (event) => {
            const target = event.target.closest('[data-page]');
            if (!target) {
                return;
            }

            event.preventDefault();
            const value = target.getAttribute('data-page');
            const totalPages = Math.max(1, Math.ceil(currentProductsList.length / PRODUCTS_PER_PAGE));

            if (value === 'prev' && currentProductsPage > 1) {
                currentProductsPage -= 1;
            } else if (value === 'next' && currentProductsPage < totalPages) {
                currentProductsPage += 1;
            } else if (!Number.isNaN(parseInt(value, 10))) {
                currentProductsPage = parseInt(value, 10);
            }

            updateProductsView();

            const productsSection = pageRoot.querySelector('h1');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    if (clearAllFilters) {
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
    // ✅ این گارد خطای ensureAdminWindowClasses is not defined را حل می‌کند
    if (typeof ensureAdminWindowClasses === 'function') {
        ensureAdminWindowClasses();
    }

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

    const themeTarget = typeof root !== 'undefined' ? root : document.documentElement;
    const isDarkTheme = themeTarget.classList.contains('dark');

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
                <button type="button" class="admin-action-btn admin-action-btn--secondary" id="adminThemeToggle" aria-pressed="${isDarkTheme ? 'true' : 'false'}" data-theme-state="${isDarkTheme ? 'dark' : 'light'}">
                    <iconify-icon data-theme-icon icon="${isDarkTheme ? 'ph:sun-duotone' : 'ph:moon-duotone'}" width="20"></iconify-icon>
                    <span data-theme-label>${isDarkTheme ? 'حالت روشن' : 'حالت تیره'}</span>
                </button>
                <button type="button" class="admin-action-btn admin-action-btn--primary" data-admin-action="reports">گزارش امروز</button>
                <button type="button" class="admin-action-btn admin-action-btn--secondary" data-admin-action="finance">خلاصه مالی</button>
                <button type="button" class="admin-action-btn" data-admin-action="tasks">برنامه کاری</button>
                <button type="button" class="admin-action-btn" data-admin-action="insights">بینش مشتریان</button>
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
                <div class="admin-quick-actions grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button type="button" class="px-4 py-3 rounded-xl border border-primary/20 text-right hover:bg-primary/10 transition-all duration-200" data-admin-action="reports">گزارش امروز</button>
                    <button type="button" class="px-4 py-3 rounded-xl border border-primary/20 text-right hover:bg-primary/10 transition-all duration-200" data-admin-action="inventory">کنترل موجودی</button>
                    <button type="button" class="px-4 py-3 rounded-xl border border-primary/20 text-right hover:bg-primary/10 transition-all duration-200" data-admin-action="finance">خلاصه مالی</button>
                    <button type="button" class="px-4 py-3 rounded-xl border border-primary/20 text-right hover:bg-primary/10 transition-all duration-200" data-admin-action="users">مشتریان وفادار</button>
                    <button type="button" class="px-4 py-3 rounded-xl border border-primary/20 text-right hover:bg-primary/10 transition-all duration-200" data-admin-action="insights">بینش مشتریان</button>
                    <button type="button" class="px-4 py-3 rounded-xl border border-primary/20 text-right hover:bg-primary/10 transition-all duration-200" data-admin-action="tasks">برنامه کاری امروز</button>
                    <button type="button" class="px-4 py-3 rounded-xl border border-primary/20 text-right hover:bg-primary/10 transition-all duration-200" data-admin-action="support">پشتیبانی مشتریان</button>
                    <button type="button" class="px-4 py-3 rounded-xl border border-primary/20 text-right hover:bg-primary/10 transition-all duration-200" data-admin-action="campaign">کمپین تبلیغاتی</button>
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
    const adminThemeToggle = $('#adminThemeToggle', page);
    if (adminThemeToggle) {
        if (typeof ensureAdminThemeStyles === 'function') {
            ensureAdminThemeStyles();
        }
        if (typeof updateAdminThemeButton === 'function') {
            updateAdminThemeButton(isDarkTheme);
        }
        adminThemeToggle.addEventListener('click', (event) => {
            event.preventDefault();
            if (typeof toggleAdminTheme === 'function') {
                toggleAdminTheme();
            }
        });
    }
    if (!options.skipWelcome && typeof handleAdminQuickAction === 'function') {
        handleAdminQuickAction('reports', { notifyMessage: 'شما وارد پنل مدیریت شدید' });
    }
}

/* ---------- Render products ---------- */
function renderProducts(list) {
    currentProductsList = list.slice();
    currentProductsPage = 1;

    if (typeof refreshProductsPageView === 'function') {
        refreshProductsPageView();
        if (productsGridRef) {
            productsGridRef.addEventListener('click', handleProductActions);
        }
    } else {
        const productsGrid = $('#productsGrid');
        const productsCount = $('#productsCount');
        if (productsGrid && productsCount) {
            renderProductsList(list, productsGrid);
            productsCount.textContent = `${list.length} محصول`;
            productsGrid.addEventListener('click', handleProductActions);
        }
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
