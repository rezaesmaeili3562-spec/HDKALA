/* ---------- Cart Functions ---------- */
function updateCartDisplay() {
    if (!cartItems) return;
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = createEmptyState({
            icon: 'mdi:cart-off',
            title: 'سبد خرید شما خالی است',
            description: 'برای شروع خرید، محصولات مورد علاقه خود را به سبد اضافه کنید.',
            actions: '<a href="#products" class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"><iconify-icon icon="mdi:shopping-outline" width="18"></iconify-icon><span>مشاهده محصولات</span></a>'
        });
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
        
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg';
        cartItemEl.innerHTML = `
            <div class="flex-1">
                <h4 class="font-medium">${product.name}</h4>
                <div class="flex justify-between items-center mt-2">
                    <div class="flex items-center gap-2">
                        <button class="decrease-qty w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm" data-id="${product.id}">-</button>
                        <span class="w-8 text-center">${item.qty}</span>
                        <button class="increase-qty w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm" data-id="${product.id}">+</button>
                    </div>
                    <div class="text-primary font-medium">${formatPrice(finalPrice)}</div>
                </div>
                ${itemDiscount > 0 ? `
                    <div class="text-green-500 text-xs mt-1">
                        ${formatPrice(itemDiscount)} صرفه‌جویی
                    </div>
                ` : ''}
            </div>
            <button class="remove-from-cart text-red-500 hover:text-red-700 transition-colors" data-id="${product.id}">
                <iconify-icon icon="mdi:trash-can-outline"></iconify-icon>
            </button>
        `;
        cartItems.appendChild(cartItemEl);
    });
    
    const shippingCost = total > 500000 ? 0 : 30000;
    const finalTotal = total + shippingCost;
    
    cartTotal.textContent = formatPrice(total + totalDiscount);
    cartDiscount.textContent = formatPrice(totalDiscount);
    cartShipping.textContent = shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost);
    cartFinalTotal.textContent = formatPrice(finalTotal);
    
    // Add event listeners for cart actions
    $$('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('button').getAttribute('data-id');
            updateCartItemQty(productId, -1);
        });
    });
    
    $$('.increase-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('button').getAttribute('data-id');
            updateCartItemQty(productId, 1);
        });
    });
    
    $$('.remove-from-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('button').getAttribute('data-id');
            removeFromCart(productId);
        });
    });
}

function updateCartItemQty(productId, change) {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;
    
    const product = getProductById(productId);
    if (!product) return;
    
    if (change > 0 && item.qty >= product.stock) {
        notify(`فقط ${product.stock} عدد از این محصول در انبار موجود است`, 'warning');
        return;
    }
    
    item.qty += change;
    if (item.qty <= 0) {
        removeFromCart(productId);
    } else {
        LS.set('HDK_cart', cart);
        updateCartBadge();
        updateCartDisplay();
        notify(change > 0 ? 'تعداد محصول افزایش یافت' : 'تعداد محصول کاهش یافت', 'info');
    }
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.productId !== productId);
    LS.set('HDK_cart', cart);
    updateCartBadge();
    updateCartDisplay();
    notify('محصول از سبد خرید حذف شد', 'info');
}

function addToCart(productId, qty=1){
    const product = getProductById(productId);
    if (!product) return;
    
    if (product.stock === 0) {
        notify('این محصول در حال حاضر موجود نیست', 'warning');
        return;
    }
    
    const existing = cart.find(i => i.productId === productId);
    if(existing) {
        if (existing.qty + qty > product.stock) {
            notify(`فقط ${product.stock} عدد از این محصول در انبار موجود است`, 'warning');
            return;
        }
        existing.qty += qty;
    } else {
        if (qty > product.stock) {
            notify(`فقط ${product.stock} عدد از این محصول در انبار موجود است`, 'warning');
            return;
        }
        cart.push({ productId, qty });
    }
    
    LS.set('HDK_cart', cart); 
    updateCartBadge(); 
    updateCartDisplay();
    notify('محصول به سبد اضافه شد.', 'success');
}

/* ---------- Enhanced Compare Functions ---------- */
function toggleCompare(productId) {
    const index = compareList.indexOf(productId);
    if (index > -1) {
        compareList.splice(index, 1);
        notify('محصول از لیست مقایسه حذف شد', 'info');
    } else {
        if (compareList.length >= 4) {
            notify('حداکثر ۴ محصول قابل مقایسه هستند', 'warning');
            return;
        }
        compareList.push(productId);
        notify('محصول به لیست مقایسه اضافه شد', 'success');
    }
    LS.set('HDK_compare', compareList);
    updateCompareBadge();
    if (!compareModal.classList.contains('hidden')) {
        renderCompareProducts();
    }
}

let isCompareModalClosing = false;

function openCompareModal() {
    if (!compareModal) return;

    isCompareModalClosing = false;
    compareModal.classList.remove('hidden', 'modal-closing');
    compareModal.setAttribute('aria-hidden', 'false');
    lockBodyScroll();
    requestAnimationFrame(() => compareModal.classList.add('modal-visible'));
    renderCompareProducts();

    if (compareList.length === 0) {
        notify('برای مقایسه، ابتدا چند محصول را به لیست اضافه کنید', 'info', { allowDuplicates: false });
    }

    const dialog = compareModal.querySelector('[data-modal-dialog]');
    if (dialog) {
        dialog.focus({ preventScroll: true });
    }
}

function closeCompareModalDialog() {
    if (!compareModal || compareModal.classList.contains('hidden') || isCompareModalClosing) {
        return;
    }

    isCompareModalClosing = true;
    compareModal.setAttribute('aria-hidden', 'true');
    compareModal.classList.remove('modal-visible');
    compareModal.classList.add('modal-closing');
    unlockBodyScroll();

    const cleanup = () => {
        compareModal.removeEventListener('transitionend', cleanup);
        compareModal.classList.add('hidden');
        compareModal.classList.remove('modal-closing');
        isCompareModalClosing = false;
    };

    compareModal.addEventListener('transitionend', cleanup);
    setTimeout(cleanup, 220);

    if (compareBtn && typeof compareBtn.focus === 'function') {
        compareBtn.focus();
    }
}

function renderCompareProducts() {
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
            // حذف محصولاتی که وجود ندارند
            compareList = compareList.filter(id => id !== productId);
            LS.set('HDK_compare', compareList);
            updateCompareBadge();
            return;
        }
        
        const productEl = document.createElement('div');
        productEl.innerHTML = createCompareProduct(product);
        compareProducts.appendChild(productEl);
    });
    
    // Add event listeners for compare actions
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
            renderCompareProducts(); // Refresh to update heart icon
        });
    });
}

function removeFromCompare(productId) {
    compareList = compareList.filter(id => id !== productId);
    LS.set('HDK_compare', compareList);
    updateCompareBadge();
    renderCompareProducts();
    notify('محصول از مقایسه حذف شد', 'info');
}

/* ---------- Enhanced Checkout ---------- */
let selectedCheckoutAddressId = null;
let selectedShippingMethodId = (typeof shippingMethods !== 'undefined' && shippingMethods.length > 0)
    ? shippingMethods[0].id
    : 'standard';

function renderEnhancedCheckoutPage() {
    if (user) {
        const userAddresses = addresses.filter(addr => addr.userId === user.id);
        const defaultAddress = userAddresses.find(addr => addr.isDefault) || userAddresses[0] || null;
        selectedCheckoutAddressId = defaultAddress ? defaultAddress.id : null;
    } else {
        selectedCheckoutAddressId = null;
    }

    const page = document.createElement('div');
    page.innerHTML = `
        <h1 class="text-2xl font-bold mb-6">تسویه حساب</h1>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
                <!-- اطلاعات ارسال -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                    <h2 class="text-lg font-bold mb-4">اطلاعات ارسال</h2>
                    <div id="checkoutAddressSection">
                        ${user ? '' : '<p class="text-gray-500">لطفا ابتدا وارد حساب کاربری خود شوید</p>'}
                    </div>
                </div>

                <!-- روش ارسال -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                    <h2 class="text-lg font-bold mb-4">روش ارسال</h2>
                    ${createShippingOptions(selectedShippingMethodId)}
                </div>

                <!-- روش پرداخت -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                    <h2 class="text-lg font-bold mb-4">روش پرداخت</h2>
                    ${createPaymentOptions('online')}
                </div>
            </div>

            <!-- خلاصه سفارش -->
            <div>
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20 sticky top-4">
                    <h2 class="text-lg font-bold mb-4">خلاصه سفارش</h2>
                    <div id="checkoutItems" class="space-y-3 mb-4 max-h-64 overflow-y-auto custom-scrollbar"></div>
                    <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                        <div class="flex justify-between">
                            <span>جمع کل:</span>
                            <span id="checkoutTotal">۰ تومان</span>
                        </div>
                        <div class="flex justify-between">
                            <span>تخفیف:</span>
                            <span id="checkoutDiscount" class="text-green-500">۰ تومان</span>
                        </div>
                        <div class="flex justify-between">
                            <span>هزینه ارسال:</span>
                            <span id="checkoutShipping">۰ تومان</span>
                        </div>
                        <div class="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                            <span>مبلغ قابل پرداخت:</span>
                            <span id="checkoutFinalTotal">۰ تومان</span>
                        </div>
                    </div>
                    <button class="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors mt-6" id="finalCheckoutBtn">
                        پرداخت و ثبت سفارش
                    </button>
                </div>
            </div>
        </div>
    `;
    contentRoot.appendChild(page);

    if (user) {
        refreshCheckoutAddressSection();
    }

    updateCheckoutDisplay();
    setupCheckoutEvents();
}

function createUserAddressSection(userAddresses = []) {
    if (!Array.isArray(userAddresses) || userAddresses.length === 0) {
        return `
            <div class="space-y-4">
                <div class="text-center py-6 text-gray-500">
                    <iconify-icon icon="mdi:map-marker-off" width="36" class="mb-2"></iconify-icon>
                    <p class="mb-3">هیچ آدرسی ثبت نکرده‌اید</p>
                    <button type="button" id="toggleCheckoutAddressForm" class="text-primary hover:text-primary/80 font-medium">
                        افزودن آدرس جدید
                    </button>
                </div>
                <div id="checkoutAddressFormContainer" class="hidden"></div>
            </div>
        `;
    }

    const options = userAddresses.map(address => `
        <label class="checkout-address-option block p-4 border-2 rounded-xl transition-all cursor-pointer ${
            address.id === selectedCheckoutAddressId
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary/60'
        }" data-id="${address.id}">
            <div class="flex items-start gap-3">
                <input type="radio" name="checkoutAddress" value="${address.id}" ${address.id === selectedCheckoutAddressId ? 'checked' : ''}
                       class="mt-1 text-primary focus:ring-primary">
                <div class="space-y-2">
                    <div class="flex items-center gap-2">
                        <span class="font-medium">${address.title}</span>
                        ${address.isDefault ? '<span class="bg-primary text-white text-xs px-2 py-0.5 rounded-full">پیش‌فرض</span>' : ''}
                    </div>
                    <div class="text-sm text-gray-600 space-y-1">
                        <div>${address.province}، ${address.city}</div>
                        <div>${address.fullAddress}</div>
                        <div>کد پستی: ${address.postalCode}</div>
                        <div>تلفن: ${address.phone}</div>
                    </div>
                </div>
            </div>
        </label>
    `).join('');

    return `
        <div class="space-y-4">
            <div class="space-y-3">
                ${options}
            </div>
            <div class="flex flex-wrap gap-3 text-sm">
                <button type="button" id="toggleCheckoutAddressForm" class="flex items-center gap-1 text-primary hover:text-primary/80">
                    <iconify-icon icon="mdi:plus"></iconify-icon>
                    افزودن آدرس جدید
                </button>
                <a href="#addresses" id="checkoutManageAddresses" class="flex items-center gap-1 text-primary/80 hover:text-primary">
                    <iconify-icon icon="mdi:map-marker"></iconify-icon>
                    مدیریت آدرس‌ها
                </a>
            </div>
            <div id="checkoutAddressFormContainer" class="hidden"></div>
        </div>
    `;
}

function refreshCheckoutAddressSection() {
    const container = $('#checkoutAddressSection');
    if (!container || !user) return;

    const userAddresses = addresses.filter(addr => addr.userId === user.id);
    if (userAddresses.length === 0) {
        selectedCheckoutAddressId = null;
    } else if (!selectedCheckoutAddressId || !userAddresses.some(addr => addr.id === selectedCheckoutAddressId)) {
        const defaultAddress = userAddresses.find(addr => addr.isDefault) || userAddresses[0];
        selectedCheckoutAddressId = defaultAddress ? defaultAddress.id : null;
    }

    container.innerHTML = createUserAddressSection(userAddresses);
    bindCheckoutAddressEvents();
}

function bindCheckoutAddressEvents() {
    $$('input[name="checkoutAddress"]').forEach(radio => {
        radio.addEventListener('change', function() {
            selectedCheckoutAddressId = this.value;
            updateCheckoutAddressHighlight();
        });
    });

    const toggleBtn = $('#toggleCheckoutAddressForm');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            renderCheckoutAddressForm();
        });
    }

    updateCheckoutAddressHighlight();
}

function updateCheckoutAddressHighlight() {
    $$('.checkout-address-option').forEach(option => {
        const isSelected = option.getAttribute('data-id') === selectedCheckoutAddressId;
        option.classList.toggle('border-primary', isSelected);
        option.classList.toggle('bg-primary/5', isSelected);
        option.classList.toggle('border-gray-200', !isSelected);
    });
}

function renderCheckoutAddressForm() {
    const container = $('#checkoutAddressFormContainer');
    if (!container) return;

    container.innerHTML = createCheckoutAddressForm();
    container.classList.remove('hidden');

    const provinceSelect = $('#checkoutAddressProvince');
    const citySelect = $('#checkoutAddressCity');

    populateCheckoutProvinceOptions(provinceSelect);
    provinceSelect.addEventListener('change', () => {
        populateCheckoutCityOptions(provinceSelect.value, citySelect);
    });

    $('#checkoutCancelAddress').addEventListener('click', () => {
        hideCheckoutAddressForm();
    });

    $('#checkoutAddressForm').addEventListener('submit', (e) => {
        e.preventDefault();

        if (!user) {
            notify('برای ثبت آدرس وارد حساب کاربری شوید', 'warning');
            return;
        }

        const formData = {
            title: $('#checkoutAddressTitle').value.trim(),
            province: provinceSelect.value,
            city: citySelect.value,
            fullAddress: $('#checkoutAddressText').value.trim(),
            postalCode: $('#checkoutAddressPostal').value.trim(),
            phone: $('#checkoutAddressPhone').value.trim(),
            isDefault: $('#checkoutAddressDefault').checked,
            userId: user.id
        };

        if (!formData.title || !formData.province || !formData.city || !formData.fullAddress) {
            notify('لطفا همه فیلدها را تکمیل کنید', 'error');
            return;
        }

        if (typeof validatePostalCode === 'function' && !validatePostalCode(formData.postalCode)) {
            notify('کد پستی باید ۱۰ رقمی باشد', 'error');
            return;
        }

        if (typeof validatePhone === 'function' && !validatePhone(formData.phone)) {
            notify('شماره تماس معتبر نیست', 'error');
            return;
        }

        if (formData.isDefault) {
            addresses.forEach(addr => {
                if (addr.userId === user.id) {
                    addr.isDefault = false;
                }
            });
        }

        const newAddress = {
            id: uid('addr'),
            ...formData
        };

        addresses.push(newAddress);
        LS.set('HDK_addresses', addresses);

        selectedCheckoutAddressId = newAddress.id;
        hideCheckoutAddressForm();
        notify('آدرس جدید با موفقیت اضافه شد', 'success');
        refreshCheckoutAddressSection();
    });
}

function hideCheckoutAddressForm() {
    const container = $('#checkoutAddressFormContainer');
    if (!container) return;
    container.classList.add('hidden');
    container.innerHTML = '';
}

function populateCheckoutProvinceOptions(select) {
    if (!select) return;
    select.innerHTML = '<option value="">انتخاب استان</option>';
    provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province.name;
        option.textContent = province.name;
        select.appendChild(option);
    });
}

function populateCheckoutCityOptions(provinceName, select) {
    if (!select) return;
    select.innerHTML = '<option value="">انتخاب شهر</option>';
    select.disabled = !provinceName;

    if (!provinceName) return;

    getProvinceCities(provinceName).forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        select.appendChild(option);
    });
}

function createCheckoutAddressForm() {
    return `
        <div class="bg-white dark:bg-gray-900 border border-primary/20 rounded-2xl p-4">
            <form id="checkoutAddressForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">عنوان آدرس</label>
                    <input id="checkoutAddressTitle" type="text" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" placeholder="مثلا: منزل">
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">استان</label>
                        <select id="checkoutAddressProvince" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                            <option value="">انتخاب استان</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">شهر</label>
                        <select id="checkoutAddressCity" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" disabled>
                            <option value="">ابتدا استان را انتخاب کنید</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">آدرس کامل</label>
                    <textarea id="checkoutAddressText" rows="3" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" placeholder="خیابان، پلاک، واحد"></textarea>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">کد پستی</label>
                        <input id="checkoutAddressPostal" type="text" maxlength="10" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">شماره تماس</label>
                        <input id="checkoutAddressPhone" type="tel" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <input id="checkoutAddressDefault" type="checkbox" class="rounded border-gray-300 text-primary focus:ring-primary">
                    <label for="checkoutAddressDefault" class="text-sm">تنظیم به عنوان آدرس پیش‌فرض</label>
                </div>
                <div class="flex gap-3">
                    <button type="button" id="checkoutCancelAddress" class="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">انصراف</button>
                    <button type="submit" class="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">ذخیره آدرس</button>
                </div>
            </form>
        </div>
    `;
}

function updateCheckoutDisplay() {
    const checkoutItems = $('#checkoutItems');
    const checkoutTotal = $('#checkoutTotal');
    const checkoutDiscount = $('#checkoutDiscount');
    const checkoutShipping = $('#checkoutShipping');
    const checkoutFinalTotal = $('#checkoutFinalTotal');
    
    if (!checkoutItems) return;
    
    checkoutItems.innerHTML = '';
    if (cart.length === 0) {
        checkoutItems.innerHTML = '<p class="text-gray-500 text-center">سبد خرید خالی است</p>';
        checkoutTotal.textContent = '۰ تومان';
        checkoutDiscount.textContent = '۰ تومان';
        checkoutShipping.textContent = '۰ تومان';
        checkoutFinalTotal.textContent = '۰ تومان';
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
        
        const itemEl = document.createElement('div');
        itemEl.className = 'flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-700 pb-2';
        itemEl.innerHTML = `
            <div class="flex-1">
                <div class="font-medium">${product.name}</div>
                <div class="text-gray-500">${item.qty} × ${formatPrice(finalPrice)}</div>
            </div>
            <div class="font-medium">${formatPrice(itemTotal)}</div>
        `;
        checkoutItems.appendChild(itemEl);
    });
    
    const shippingCost = getCheckoutShippingCost(total);
    const finalTotal = total + shippingCost;

    checkoutTotal.textContent = formatPrice(total + totalDiscount);
    checkoutDiscount.textContent = formatPrice(totalDiscount);
    checkoutShipping.textContent = shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost);
    checkoutFinalTotal.textContent = formatPrice(finalTotal);
}

function getCheckoutShippingCost(orderTotal) {
    if (typeof getShippingMethod !== 'function') {
        return orderTotal > 500000 ? 0 : 30000;
    }

    const method = getShippingMethod(selectedShippingMethodId);
    if (!method) {
        return orderTotal > 500000 ? 0 : 30000;
    }

    let cost = method.price || 0;
    if (method.freeThreshold && orderTotal >= method.freeThreshold) {
        cost = 0;
    }

    return cost;
}

function setupCheckoutEvents() {
    // Payment method selection
    $$('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Update UI for selected payment method
            $$('.payment-option').forEach(option => {
                option.classList.remove('border-green-500', 'bg-green-50');
                option.classList.add('border-gray-300');
            });

            this.closest('.payment-option').classList.add('border-green-500', 'bg-green-50');
            this.closest('.payment-option').classList.remove('border-gray-300');
        });
    });

    const checkedPayment = $('input[name="payment"]:checked');
    if (checkedPayment) {
        checkedPayment.dispatchEvent(new Event('change'));
    }

    // Shipping method selection
    const shippingRadios = $$('input[name="shipping"]');
    if (shippingRadios.length > 0) {
        const checkedShipping = $('input[name="shipping"]:checked');
        if (checkedShipping) {
            selectedShippingMethodId = checkedShipping.value;
        }

        const applyShippingStyles = () => {
            $$('.shipping-option').forEach(option => {
                const isSelected = option.getAttribute('data-id') === selectedShippingMethodId;
                option.classList.toggle('border-blue-500', isSelected);
                option.classList.toggle('bg-blue-50', isSelected);
                option.classList.toggle('dark:bg-blue-500/10', isSelected);
                option.classList.toggle('border-gray-300', !isSelected);
            });
        };

        shippingRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                selectedShippingMethodId = this.value;
                applyShippingStyles();
                updateCheckoutDisplay();
            });
        });

        applyShippingStyles();
    }

    // Final checkout
    $('#finalCheckoutBtn').addEventListener('click', function() {
        if (cart.length === 0) {
            notify('سبد خرید شما خالی است', 'warning');
            return;
        }

        if (!user) {
            notify('لطفا برای ثبت سفارش وارد حساب کاربری شوید', 'warning');
            location.hash = 'login';
            return;
        }

        const paymentInput = $('input[name="payment"]:checked');
        const selectedPayment = paymentInput ? paymentInput.value : 'online';
        const address = addresses.find(addr => addr.userId === user.id && addr.id === selectedCheckoutAddressId);

        if (!address) {
            notify('لطفا یک آدرس برای ارسال انتخاب کنید', 'warning');
            return;
        }

        const totals = calculateCartTotal();
        const shippingCost = getCheckoutShippingCost(totals.total);
        const finalTotal = totals.total + shippingCost;
        const shippingInfo = typeof getShippingMethod === 'function' ? getShippingMethod(selectedShippingMethodId) : null;

        const order = {
            id: uid('o'),
            userId: user.id,
            items: cart.map(item => ({ ...item })),
            total: finalTotal,
            subtotal: totals.total,
            discount: totals.totalDiscount || 0,
            shippingCost,
            paymentMethod: selectedPayment,
            shippingMethod: shippingInfo ? shippingInfo.id : selectedShippingMethodId,
            shippingTitle: shippingInfo ? shippingInfo.name : '',
            address: {
                id: address.id,
                title: address.title,
                province: address.province,
                city: address.city,
                fullAddress: address.fullAddress,
                postalCode: address.postalCode,
                phone: address.phone
            },
            status: 'در حال پردازش',
            date: new Date().toISOString()
        };

        orders.push(order);
        LS.set('HDK_orders', orders);

        // Clear cart
        cart = [];
        LS.set('HDK_cart', cart);
        updateCartBadge();
        updateCheckoutDisplay();

        notify('سفارش شما با موفقیت ثبت شد!', 'success');
        location.hash = `order-success:${order.id}`;
    });
}

function openCartSidebar() {
    if (!cartSidebar || cartSidebar.classList.contains('open')) {
        return;
    }

    cartSidebar.classList.add('open');
    cartSidebar.setAttribute('aria-hidden', 'false');
    lockBodyScroll();

    if (cartOverlay) {
        cartOverlay.classList.remove('hidden');
        cartOverlay.setAttribute('aria-hidden', 'false');
    }

    cartSidebar.focus({ preventScroll: true });
}

function closeCartSidebar() {
    if (!cartSidebar || !cartSidebar.classList.contains('open')) {
        return;
    }

    cartSidebar.classList.remove('open');
    cartSidebar.setAttribute('aria-hidden', 'true');

    if (cartOverlay) {
        cartOverlay.classList.add('hidden');
        cartOverlay.setAttribute('aria-hidden', 'true');
    }

    unlockBodyScroll();

    if (cartBtn && typeof cartBtn.focus === 'function') {
        cartBtn.focus();
    }
}

// Cart and Compare event listeners
if (cartBtn) {
    cartBtn.addEventListener('click', openCartSidebar);
}

if (closeCart) {
    closeCart.addEventListener('click', closeCartSidebar);
}

if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCartSidebar);
}

if (compareBtn) {
    compareBtn.addEventListener('click', openCompareModal);
}

if (closeCompareModal) {
    closeCompareModal.addEventListener('click', closeCompareModalDialog);
}

if (compareModal) {
    compareModal.addEventListener('click', (event) => {
        if (event.target === compareModal) {
            closeCompareModalDialog();
        }
    });
}

const handleEscapeKey = (event) => {
    if (event.key !== 'Escape') return;

    if (cartSidebar && cartSidebar.classList.contains('open')) {
        event.preventDefault();
        closeCartSidebar();
        return;
    }

    if (compareModal && !compareModal.classList.contains('hidden')) {
        event.preventDefault();
        closeCompareModalDialog();
    }
};

document.addEventListener('keydown', handleEscapeKey);

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        notify('سبد خرید شما خالی است', 'warning');
        return;
    }
    location.hash = 'checkout';
    closeCartSidebar();
});

// Replace original checkout with enhanced version
const originalRenderCheckoutPage = renderCheckoutPage;
renderCheckoutPage = renderEnhancedCheckoutPage;