/* ---------- UI Components ---------- */

// کامپوننت فیلتر قیمت جدید
function createPriceFilter() {
    return `
        <div class="space-y-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">محدوده قیمت</label>
            <div class="space-y-2">
                <div class="flex items-center gap-2">
                    <input type="number"
                           id="minPrice"
                           placeholder="حداقل قیمت"
                           class="flex-1 p-2 border border-primary/30 rounded-lg bg-gray-50 dark:bg-gray-700 text-left text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <span class="text-gray-500">تومان</span>
                </div>
                <div class="flex items-center gap-2">
                    <input type="number"
                           id="maxPrice"
                           placeholder="حداکثر قیمت"
                           class="flex-1 p-2 border border-primary/30 rounded-lg bg-gray-50 dark:bg-gray-700 text-left text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <span class="text-gray-500">تومان</span>
                </div>
            </div>
        </div>
    `;
}

// کامپوننت هدر فیلترها با فلش جمع‌شونده
function createFilterHeader() {
    return `
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-2">
                <button id="filterCollapse" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <iconify-icon icon="mdi:chevron-left" class="text-xl"></iconify-icon>
                </button>
                <h3 class="text-lg font-semibold">فیلترها</h3>
            </div>
            <button id="closeFilters" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <iconify-icon icon="mdi:close" class="text-xl"></iconify-icon>
            </button>
        </div>
    `;
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

// کامپوننت گزینه‌های پرداخت
function createPaymentOptions(selectedMethod = 'online') {
    return `
        <div class="space-y-3" role="radiogroup" aria-label="روش پرداخت">
            ${paymentMethods.map(method => {
                const isSelected = selectedMethod === method.id;
                const inputId = `payment-${method.id}`;
                return `
                    <label class="payment-option flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                            ? 'payment-option--active border-green-500 bg-green-50 dark:bg-green-500/10'
                            : 'border-gray-300 hover:border-primary/50'
                    }"
                           data-method="${method.id}"
                           data-selected="${isSelected}"
                           role="radio"
                           aria-checked="${isSelected}"
                           for="${inputId}">
                        <input type="radio"
                               name="payment"
                               id="${inputId}"
                               value="${method.id}"
                               ${isSelected ? 'checked' : ''}
                               class="payment-option-input sr-only">
                        <span class="payment-option-indicator ${isSelected ? 'payment-option-indicator--active' : ''}" aria-hidden="true">
                            <iconify-icon icon="mdi:check" class="payment-option-check text-white text-sm"></iconify-icon>
                        </span>
                        <div class="flex items-center gap-3 flex-1">
                            <iconify-icon icon="${method.icon}" width="24" class="payment-option-icon ${
                                isSelected ? 'text-green-500' : 'text-gray-500'
                            }"></iconify-icon>
                            <div class="flex-1">
                                <div class="font-medium">${method.name}</div>
                                <div class="text-sm text-gray-500">${method.description}</div>
                            </div>
                        </div>
                    </label>
                `;
            }).join('')}
        </div>
    `;
}

// کامپوننت محصول برای مقایسه
function createCompareProduct(product) {
    const finalPrice = product.discount > 0 ? 
        product.price * (1 - product.discount / 100) : product.price;
    
    return `
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-primary/20 p-4 relative">
            <button class="remove-compare absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    data-id="${product.id}">
                <iconify-icon icon="mdi:close"></iconify-icon>
            </button>
            
            <div class="text-center mb-4">
                <h3 class="font-bold text-lg mb-2">${product.name}</h3>
                <div class="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                    ${product.img ? 
                        `<img src="${product.img}" alt="${product.name}" class="w-full h-40 object-cover rounded-lg">` :
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
                <button class="add-to-cart w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
                        data-id="${product.id}">
                    افزودن به سبد خرید
                </button>
                <button class="add-to-wishlist w-full border border-primary text-primary py-2 rounded-lg font-medium hover:bg-primary/10 transition-colors text-sm flex items-center justify-center gap-2"
                        data-id="${product.id}">
                    <iconify-icon icon="${wishlist.includes(product.id) ? 'mdi:heart' : 'mdi:heart-outline'}"></iconify-icon>
                    علاقه‌مندی
                </button>
            </div>
        </div>
    `;
}

// کامپوننت اطلاع‌رسانی موجود شدن محصول
function createNotifyMeModal(product) {
    return `
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">اطلاع‌رسانی هنگام موجود شدن</h3>
                    <button class="close-notify-modal p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <iconify-icon icon="mdi:close"></iconify-icon>
                    </button>
                </div>
                
                <div class="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div class="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        ${product.img ? 
                            `<img src="${product.img}" alt="${product.name}" class="w-12 h-12 object-cover rounded-lg">` :
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