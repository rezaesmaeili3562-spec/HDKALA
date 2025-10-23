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
    
    switch(currentPage) {
        case 'login':
            renderLoginPage();
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
        case 'admin-login':
            renderAdminLoginPage();
            break;
        case 'admin':
            renderAdminPage();
            break;
        default:
            renderHomePage();
    }
    
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
    if (!adminAuth || !adminAuth.loggedIn) {
        notify('برای ورود به پنل مدیریت ابتدا باید احراز هویت کنید', true);
        navigate('admin-login');
        return;
    }

    const page = document.createElement('div');
    page.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 class="text-2xl font-bold">داشبورد مدیریت</h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${adminAuth.adminName || adminAccount.name}</p>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">آخرین ورود: ${adminAuth.loginTime ? new Date(adminAuth.loginTime).toLocaleString('fa-IR') : '---'}</span>
                    <button id="adminLogout" class="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">خروج</button>
                </div>
            </div>

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
                    <div class="space-y-3">
                        <button id="openAdminPanel" class="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors">
                            مدیریت محصولات
                        </button>
                        <p class="text-xs text-gray-500 dark:text-gray-400">برای افزودن، ویرایش یا حذف محصولات از دکمه بالا استفاده کنید.</p>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold mb-4">مدیریت بلاگ</h3>
                    ${createBlogManagement()}
                </div>
            </div>
        </div>
    `;

    contentRoot.appendChild(page);
    setupBlogManagement();

    $('#openAdminPanel').addEventListener('click', openAdminPanel);
    $('#adminLogout').addEventListener('click', () => {
        adminAuth = { loggedIn: false };
        LS.set('HDK_adminAuth', adminAuth);
        notify('خروج مدیر انجام شد');
        navigate('admin-login');
    });
}

function renderAdminLoginPage() {
    const page = document.createElement('div');
    page.className = 'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8';
    page.innerHTML = `
        <div class="max-w-md w-full space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-primary/30">
            <div class="text-center">
                <a href="#home" class="text-2xl font-extrabold text-primary flex items-center gap-2 justify-center">
                    <iconify-icon icon="mdi:shield-account" width="28"></iconify-icon>
                    HDKALA Admin
                </a>
                <h2 class="mt-6 text-2xl font-bold text-gray-900 dark:text-white">ورود مدیر سیستم</h2>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">برای دسترسی به پنل مدیریت اطلاعات ورود را وارد کنید.</p>
            </div>

            <form id="adminLoginForm" class="space-y-4">
                <div class="space-y-2">
                    <label class="block text-sm font-medium">شماره تماس (اجباری)</label>
                    <div class="relative">
                        <input type="tel" id="adminPhone" name="phone" placeholder="09xxxxxxxxx" maxlength="11"
                               class="w-full p-3 pr-10 border border-primary/30 rounded-lg bg-white dark:bg-gray-700 text-left"
                               autocomplete="off">
                        <span id="adminOperator" class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"></span>
                    </div>
                    <p class="text-xs text-gray-400">در صورت تمایل می‌توانید ایمیل را نیز وارد کنید.</p>
                </div>

                <div class="space-y-2">
                    <label class="block text-sm font-medium">ایمیل (اختیاری)</label>
                    <input type="email" id="adminEmail" name="email" placeholder="admin@example.com"
                           class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                </div>

                <div class="space-y-2">
                    <label class="block text-sm font-medium">رمز ورود</label>
                    <input type="password" id="adminPassword" name="password" required
                           class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                           placeholder="رمز عبور">
                </div>

                <button type="submit" class="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium">
                    ورود به پنل مدیریت
                </button>
            </form>

            <div class="text-center text-xs text-gray-400">
                دسترسی فقط برای مدیران مجاز فراهم است.
            </div>
        </div>
    `;

    contentRoot.appendChild(page);

    const phoneInput = $('#adminPhone', page);
    const operatorEl = $('#adminOperator', page);

    phoneInput.addEventListener('input', () => {
        const value = phoneInput.value.trim();
        if (value.length > 11) {
            phoneInput.value = value.slice(0, 11);
        }
        const operator = getOperatorLogo(value);
        const operatorMeta = operatorLogos[operator];
        operatorEl.innerHTML = operatorMeta ? `<iconify-icon icon="${operatorMeta.icon}" class="${operatorMeta.color}"></iconify-icon>` : '';
    });

    $('#adminLoginForm', page).addEventListener('submit', (e) => {
        e.preventDefault();
        const phone = phoneInput.value.trim();
        const email = $('#adminEmail', page).value.trim();
        const password = $('#adminPassword', page).value;

        if (!phone) {
            notify('وارد کردن شماره تماس مدیر الزامی است', true);
            phoneInput.focus();
            return;
        }

        if (!validatePhone(phone)) {
            notify('شماره تماس وارد شده معتبر نیست', true);
            phoneInput.focus();
            return;
        }

        if (email && !validateEmail(email)) {
            notify('ایمیل وارد شده معتبر نیست', true);
            return;
        }

        const isPhoneMatch = phone === adminAccount.phone;
        const isEmailMatch = !email || email.toLowerCase() === adminAccount.email.toLowerCase();
        const isPasswordMatch = password === adminAccount.password;

        if (isPhoneMatch && isEmailMatch && isPasswordMatch) {
            adminAuth = {
                loggedIn: true,
                adminName: adminAccount.name,
                loginTime: new Date().toISOString()
            };
            LS.set('HDK_adminAuth', adminAuth);
            notify('ورود مدیر با موفقیت انجام شد');
            navigate('admin');
        } else {
            notify('اطلاعات ورود مدیر نادرست است', true);
        }
    });
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
    adminLink.href = '#admin-login';
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