/* ---------- Admin Session Management ---------- */
const ADMIN_SESSION_KEY = 'HDK_admin_session';
const ADMIN_WINDOW_NAME = 'HDKALA_ADMIN_PANEL';

function getAdminSession() {
    return LS.get(ADMIN_SESSION_KEY, null);
}

function isAdminAuthenticated() {
    const session = getAdminSession();
    return !!(session && session.isAuthenticated);
}

function startAdminSession(info) {
    const sessionData = {
        isAuthenticated: true,
        info: info || {},
        lastLogin: new Date().toISOString()
    };
    LS.set(ADMIN_SESSION_KEY, sessionData);
    return sessionData;
}

function clearAdminSession() {
    try {
        localStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (err) {
        // ignore storage errors
    }
}

function openAdminDashboardWindow() {
    try {
        const adminUrl = new URL(window.location.href);
        adminUrl.hash = 'admin';
        adminUrl.searchParams.set('adminWindow', '1');
        window.open(adminUrl.toString(), ADMIN_WINDOW_NAME);
    } catch (err) {
        window.open('#admin', ADMIN_WINDOW_NAME);
    }
}

function ensureAdminAccess() {
    if (isAdminAuthenticated()) {
        return true;
    }

    if (typeof notify === 'function') {
        notify('پنل مدیریت در حالت نمایشی برای کاربران فعال شد. برای دسترسی کامل وارد شوید.', false);
    }

    if (typeof document !== 'undefined') {
        document.body.classList.add('admin-preview-mode');
    }

    return true;
}

function handleAdminQuickAction(action) {
    const detailsContainer = $('#adminActionDetails');
    if (!detailsContainer) {
        notify('بخش گزارشات در حال حاضر در دسترس نیست.', true);
        return;
    }

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(order => (order.status || '').toLowerCase() === 'processing').length;
    const deliveredOrders = orders.filter(order => (order.status || '').toLowerCase() === 'delivered').length;
    const lowStockProducts = products.filter(p => p.stock <= 3);
    const discountedProducts = products.filter(p => p.discount > 0);
    const recommendedBudget = totalRevenue ? Math.round(totalRevenue * 0.1) : 5000000;

    let html = '';

    switch (action) {
        case 'reports': {
            const averageOrder = orders.length ? Math.round(totalRevenue / Math.max(orders.length, 1)) : 0;
            const highlightedProducts = discountedProducts.slice(0, 3);
            html = `
                <div class="flex items-center justify-between"><span>درآمد کل</span><span class="font-semibold text-green-600">${formatPrice(totalRevenue)}</span></div>
                <div class="flex items-center justify-between"><span>میانگین ارزش سفارش</span><span class="font-semibold">${orders.length ? formatPrice(averageOrder) : '۰ تومان'}</span></div>
                <div class="flex items-center justify-between"><span>سفارش‌های فعال</span><span class="font-semibold text-blue-600">${pendingOrders}</span></div>
                <div class="pt-3 text-xs text-gray-500 dark:text-gray-400">پیشنهاد برای تبلیغ محصولات دارای تخفیف:</div>
                <ul class="mt-2 space-y-1 text-xs">
                    ${highlightedProducts.length ? highlightedProducts.map(product => `<li class="flex items-center justify-between"><span>${product.name}</span><span>${product.discount}% تخفیف</span></li>`).join('') : '<li>محصول تخفیف‌دار فعالی ثبت نشده است.</li>'}
                </ul>
            `;
            notify('گزارش فروش به‌روزرسانی شد.');
            break;
        }
        case 'inventory': {
            html = lowStockProducts.length
                ? `<p class="text-sm text-red-500 mb-2">محصولات با موجودی کم:</p>
                   <ul class="space-y-1 text-xs">${lowStockProducts.slice(0, 5).map(product => `<li class="flex items-center justify-between"><span>${product.name}</span><span>${product.stock} عدد</span></li>`).join('')}</ul>`
                : `<p class="text-sm text-green-600">تمام موجودی‌ها در وضعیت مناسب هستند.</p>`;
            notify('بررسی موجودی با موفقیت انجام شد.');
            break;
        }
        case 'users': {
            const favoriteCount = typeof wishlist !== 'undefined' ? wishlist.length : 0;
            html = `
                <div class="text-sm text-gray-600 dark:text-gray-300">کاربر فعال: <span class="font-semibold">${user ? user.name : 'هنوز سفارشی ثبت نشده'}</span></div>
                <div class="text-sm text-gray-600 dark:text-gray-300 mt-2">آیتم‌های لیست علاقه‌مندی: <span class="font-semibold">${favoriteCount}</span></div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-3">پیشنهاد می‌شود برای کاربران فعال پیام خوش‌آمدگویی و کد تخفیف ارسال شود.</p>
            `;
            notify('گزارش کاربران نمایش داده شد.');
            break;
        }
        case 'support': {
            html = `
                <p class="text-sm text-gray-600 dark:text-gray-300">درخواست پشتیبانی برای تیم مربوطه ثبت شد.</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">میانگین زمان پاسخ‌گویی کمتر از ۲ ساعت است.</p>
            `;
            notify('درخواست پشتیبانی ثبت گردید.');
            break;
        }
        case 'campaign': {
            const topCategories = [...new Set(products.map(product => product.category))].slice(0, 3);
            html = `
                <p class="text-sm text-gray-600 dark:text-gray-300">پیشنهاد کمپین جدید:</p>
                <ul class="mt-2 space-y-1 text-xs">${topCategories.length ? topCategories.map(category => `<li>تخفیف هدفمند برای دسته ${category}</li>`).join('') : '<li>دسته‌بندی ثبت نشده است.</li>'}</ul>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-3">بودجه پیشنهادی: ${formatPrice(recommendedBudget)}</p>
            `;
            notify('برنامه کمپین تبلیغاتی آماده شد.');
            break;
        }
        case 'dashboard': {
            html = `<p class="text-sm text-gray-600 dark:text-gray-300">در حال بارگذاری داشبورد مدیریت...</p>`;
            notify('داشبورد مدیریت در حال نمایش است.');
            break;
        }
        default: {
            html = `<p class="text-sm text-gray-600 dark:text-gray-300">گزارش انتخاب شده در دسترس نیست.</p>`;
            notify('گزینه مورد نظر یافت نشد.', true);
        }
    }

    detailsContainer.innerHTML = html;
}
/* ---------- Admin Panel Functions ---------- */
function openAdminPanel() {
    adminModal.classList.remove('hidden');
    renderAdminProducts();
    setupAdminInputHandlers();
}

function closeAdminPanel() {
    adminModal.classList.add('hidden');
    productForm.classList.add('hidden');
    editingProductId = null;
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
                $('#imagePreview').innerHTML = `
                    <img src="${e.target.result}" alt="Preview" class="w-32 h-32 object-cover rounded-lg">
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
        notify('محصول با موفقیت حذف شد');
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
        notify('لطفا نام و قیمت محصول را وارد کنید', true);
        return;
    }
    
    if (discount < 0 || discount > 100) {
        notify('تخفیف باید بین 0 تا 100 باشد', true);
        return;
    }
    
    if (stock < 0) {
        notify('موجودی نمی‌تواند منفی باشد', true);
        return;
    }
    
    // Get image data
    const imagePreview = $('#imagePreview img');
    const img = imagePreview ? imagePreview.src : '';
    
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
    notify(editingProductId ? 'محصول با موفقیت ویرایش شد' : 'محصول جدید با موفقیت اضافه شد');
    
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
    notify(blogId ? 'مقاله با موفقیت ویرایش شد' : 'مقاله جدید با موفقیت اضافه شد');
    
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
        notify('مقاله با موفقیت حذف شد');

        // Refresh blog management view
        if (currentPage === 'admin') {
            renderAdminPage();
        }
    }
}

/* ---------- Admin Login Flow ---------- */
const ADMIN_LOGIN_OTP = '864215';
let pendingAdminLogin = null;

function showAdminLoginStep(resetForm = false) {
    if (!adminLoginStep || !adminOtpStep) return;
    adminLoginStep.classList.remove('hidden');
    adminOtpStep.classList.add('hidden');
    if (resetForm && adminLoginForm) {
        adminLoginForm.reset();
        pendingAdminLogin = null;
    }
    if (adminLoginMessage) {
        adminLoginMessage.textContent = '';
    }
    if (typeof resetOtpInputs === 'function' && adminOtpStep) {
        resetOtpInputs(adminOtpStep);
    }
}

function showAdminOtpStep(message) {
    if (!adminLoginStep || !adminOtpStep) return;
    adminLoginStep.classList.add('hidden');
    adminOtpStep.classList.remove('hidden');
    if (adminLoginMessage) {
        adminLoginMessage.innerHTML = message;
    }
    if (typeof resetOtpInputs === 'function') {
        resetOtpInputs(adminOtpStep);
    }
    const inputs = adminOtpStep ? $$('.otp-input', adminOtpStep) : [];
    if (inputs.length) {
        inputs[0].focus();
    }
}

function openAdminLoginModal() {
    if (!adminLoginModal) return;
    if (isAdminAuthenticated()) {
        openAdminDashboardWindow();
        return;
    }
    adminLoginModal.classList.remove('hidden');
    adminLoginModal.classList.add('flex');
    showAdminLoginStep(true);
    if (adminLoginForm) {
        const nationalInput = adminLoginForm.querySelector('#adminNationalCode');
        if (nationalInput) {
            nationalInput.focus();
        }
    }
}

function closeAdminLoginModalHandler() {
    if (!adminLoginModal) return;
    adminLoginModal.classList.add('hidden');
    adminLoginModal.classList.remove('flex');
    showAdminLoginStep(true);
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
                    notify('لطفا فقط فایل تصویری انتخاب کنید', true);
                    e.target.value = '';
                    return;
                }
                
                // بررسی سایز فایل (حداکثر 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    notify('حجم فایل نباید بیشتر از 5 مگابایت باشد', true);
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
if (adminAccessLink) {
    adminAccessLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (isAdminAuthenticated()) {
            openAdminDashboardWindow();
        } else {
            openAdminLoginModal();
        }
    });
}

if (closeAdminLoginModal) {
    closeAdminLoginModal.addEventListener('click', closeAdminLoginModalHandler);
}

if (adminLoginModal) {
    adminLoginModal.addEventListener('click', (e) => {
        if (e.target === adminLoginModal) {
            closeAdminLoginModalHandler();
        }
    });
}

if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(adminLoginForm);
        const fullName = (formData.get('fullName') || '').toString().trim();
        const nationalCode = (formData.get('nationalCode') || '').toString().trim();
        const phone = (formData.get('phone') || '').toString().trim();
        const email = (formData.get('email') || '').toString().trim();
        const adminCode = (formData.get('adminCode') || '').toString().trim();

        if (!fullName || fullName.length < 3) {
            notify('لطفا نام و نام خانوادگی مدیر را وارد کنید.', true);
            return;
        }

        if (typeof validateNationalCode === 'function' && !validateNationalCode(nationalCode)) {
            notify('کد ملی وارد شده معتبر نیست.', true);
            return;
        }

        if (typeof validatePhone === 'function' && !validatePhone(phone)) {
            notify('شماره تماس باید با 09 شروع شده و 11 رقمی باشد.', true);
            return;
        }

        if (typeof validateEmail === 'function' && !validateEmail(email)) {
            notify('ایمیل وارد شده معتبر نیست.', true);
            return;
        }

        if (adminCode.length < 4) {
            notify('کد ادمین باید حداقل ۴ رقم باشد.', true);
            return;
        }

        pendingAdminLogin = { fullName, nationalCode, phone, email, adminCode };
        const message = `کد تأیید <strong>${ADMIN_LOGIN_OTP}</strong> به شماره <strong>${phone}</strong> ارسال شد.`;
        showAdminOtpStep(message);
        notify('کد تأیید برای شما ارسال شد.');
    });
}

if (adminOtpBack) {
    adminOtpBack.addEventListener('click', () => {
        if (!adminLoginForm || !pendingAdminLogin) {
            showAdminLoginStep(true);
            return;
        }
        showAdminLoginStep(false);
        const fullNameField = adminLoginForm.querySelector('#adminFullName');
        const nationalField = adminLoginForm.querySelector('#adminNationalCode');
        const phoneField = adminLoginForm.querySelector('#adminPhone');
        const emailField = adminLoginForm.querySelector('#adminEmail');
        const adminCodeField = adminLoginForm.querySelector('#adminCode');
        if (fullNameField) fullNameField.value = pendingAdminLogin.fullName || '';
        if (nationalField) nationalField.value = pendingAdminLogin.nationalCode;
        if (phoneField) phoneField.value = pendingAdminLogin.phone;
        if (emailField) emailField.value = pendingAdminLogin.email;
        if (adminCodeField) adminCodeField.value = pendingAdminLogin.adminCode;
    });
}

if (adminOtpForm) {
    adminOtpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!adminOtpStep) return;
        const code = typeof getOtpCode === 'function' ? getOtpCode(adminOtpStep) : '';
        if (code === ADMIN_LOGIN_OTP) {
            startAdminSession(pendingAdminLogin);
            pendingAdminLogin = null;
            notify('ورود مدیر با موفقیت انجام شد!');
            closeAdminLoginModalHandler();
            openAdminDashboardWindow();
            if (typeof updateUserLabel === 'function') {
                updateUserLabel();
            }
            location.hash = '#admin';
        } else {
            notify('کد تأیید نادرست است. لطفا مجددا تلاش کنید.', true);
            if (typeof resetOtpInputs === 'function') {
                resetOtpInputs(adminOtpStep);
            }
            const inputs = adminOtpStep ? $$('.otp-input', adminOtpStep) : [];
            if (inputs.length) {
                inputs[0].focus();
            }
        }
    });
}

closeAdminModal.addEventListener('click', closeAdminPanel);
addProductBtn.addEventListener('click', () => {
    editingProductId = null;
    showProductForm();
});
saveProductBtn.addEventListener('click', saveProduct);
cancelProductBtn.addEventListener('click', () => {
    productForm.classList.add('hidden');
    editingProductId = null;
});
adminSearch.addEventListener('input', renderAdminProducts);

// Initialize image upload and admin OTP inputs
document.addEventListener('DOMContentLoaded', () => {
    setupImageUpload();
    if (adminOtpStep && typeof setupOtpInputs === 'function') {
        setupOtpInputs(adminOtpStep);
    }
});

document.addEventListener('click', (event) => {
    const actionBtn = event.target.closest('[data-admin-action]');
    if (actionBtn) {
        event.preventDefault();
        const action = actionBtn.getAttribute('data-admin-action');
        handleAdminQuickAction(action);
        if (action === 'dashboard') {
            location.hash = '#admin';
        }
        if (typeof userDropdown !== 'undefined' && userDropdown) {
            userDropdown.classList.remove('open');
        }
    }

    if (event.target.id === 'adminLogoutBtn' || event.target.closest('#adminLogoutBtn')) {
        event.preventDefault();
        clearAdminSession();
        notify('خروج مدیر انجام شد.');
        if (typeof updateUserLabel === 'function') {
            updateUserLabel();
        }
        if (typeof userDropdown !== 'undefined' && userDropdown) {
            userDropdown.classList.remove('open');
        }
        if (location.hash === '#admin') {
            location.hash = '#home';
        }
    }
});
