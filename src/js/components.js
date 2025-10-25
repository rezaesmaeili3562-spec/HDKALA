/* ---------- UI Components ---------- */

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
                        data-id="${product.id}"
                        data-out-of-stock="${isOutOfStock ? 'true' : 'false'}"
                        ${isOutOfStock ? 'disabled aria-disabled="true"' : ''}>
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
                        data-id="${product.id}"
                        data-out-of-stock="${isOutOfStock ? 'true' : 'false'}"
                        ${isOutOfStock ? 'disabled aria-disabled="true"' : ''}>
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