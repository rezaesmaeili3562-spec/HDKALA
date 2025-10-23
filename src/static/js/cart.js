/* ---------- Cart Functions ---------- */
function updateCartDisplay() {
    if (!cartItems) return;
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <iconify-icon icon="mdi:cart-off" width="48" class="mb-4"></iconify-icon>
                <p>سبد خرید شما خالی است</p>
            </div>
        `;
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
        notify(`فقط ${product.stock} عدد از این محصول در انبار موجود است`, true);
        return;
    }
    
    item.qty += change;
    if (item.qty <= 0) {
        removeFromCart(productId);
    } else {
        LS.set('HDK_cart', cart);
        updateCartBadge();
        updateCartDisplay();
        notify(change > 0 ? 'تعداد محصول افزایش یافت' : 'تعداد محصول کاهش یافت');
    }
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.productId !== productId);
    LS.set('HDK_cart', cart);
    updateCartBadge();
    updateCartDisplay();
    notify('محصول از سبد خرید حذف شد');
}

function addToCart(productId, qty=1){
    const product = getProductById(productId);
    if (!product) return;
    
    if (product.stock === 0) {
        notify('این محصول در حال حاضر موجود نیست', true);
        return;
    }
    
    const existing = cart.find(i => i.productId === productId);
    if(existing) {
        if (existing.qty + qty > product.stock) {
            notify(`فقط ${product.stock} عدد از این محصول در انبار موجود است`, true);
            return;
        }
        existing.qty += qty;
    } else {
        if (qty > product.stock) {
            notify(`فقط ${product.stock} عدد از این محصول در انبار موجود است`, true);
            return;
        }
        cart.push({ productId, qty });
    }
    
    LS.set('HDK_cart', cart); 
    updateCartBadge(); 
    updateCartDisplay();
    notify('محصول به سبد اضافه شد.');
}

/* ---------- Enhanced Compare Functions ---------- */
function toggleCompare(productId) {
    const index = compareList.indexOf(productId);
    if (index > -1) {
        compareList.splice(index, 1);
        notify('محصول از لیست مقایسه حذف شد');
    } else {
        if (compareList.length >= 4) {
            notify('حداکثر ۴ محصول قابل مقایسه هستند', true);
            return;
        }
        compareList.push(productId);
        notify('محصول به لیست مقایسه اضافه شد');
    }
    LS.set('HDK_compare', compareList);
    updateCompareBadge();
}

function openCompareModal() {
    if (compareList.length === 0) {
        notify('لطفا ابتدا محصولاتی برای مقایسه انتخاب کنید', true);
        return;
    }
    compareModal.classList.remove('hidden');
    renderCompareProducts();
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
    notify('محصول از مقایسه حذف شد');
    if (compareList.length === 0) {
        compareModal.classList.add('hidden');
    }
}

/* ---------- Enhanced Checkout ---------- */
function renderEnhancedCheckoutPage() {
    const page = document.createElement('div');
    page.innerHTML = `
        <h1 class="text-2xl font-bold mb-6">تسویه حساب</h1>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
                <!-- اطلاعات ارسال -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-primary/20">
                    <h2 class="text-lg font-bold mb-4">اطلاعات ارسال</h2>
                    ${user ? createUserAddressSection() : '<p class="text-gray-500">لطفا ابتدا وارد حساب کاربری خود شوید</p>'}
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
    updateCheckoutDisplay();
    setupCheckoutEvents();
}

function createUserAddressSection() {
    const userAddresses = addresses.filter(addr => addr.userId === user.id);
    const defaultAddress = userAddresses.find(addr => addr.isDefault) || userAddresses[0];
    
    return `
        <div class="space-y-4">
            ${defaultAddress ? `
                <div class="border-2 border-primary rounded-lg p-4 bg-primary/5">
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-medium">${defaultAddress.title}</span>
                        <span class="bg-primary text-white text-xs px-2 py-1 rounded-full">پیش‌فرض</span>
                    </div>
                    <div class="text-sm text-gray-600 space-y-1">
                        <div>${defaultAddress.province}، ${defaultAddress.city}</div>
                        <div>${defaultAddress.fullAddress}</div>
                        <div>کد پستی: ${defaultAddress.postalCode}</div>
                        <div>تلفن: ${defaultAddress.phone}</div>
                    </div>
                </div>
            ` : `
                <div class="text-center py-4 text-gray-500">
                    <iconify-icon icon="mdi:map-marker-off" width="32" class="mb-2"></iconify-icon>
                    <p>هیچ آدرسی ثبت نکرده‌اید</p>
            <a href="${pageLink('addresses')}" class="text-primary hover:text-primary/80 mt-2 inline-block">افزودن آدرس</a>
                </div>
            `}
            
            <a href="${pageLink('addresses')}" class="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
                <iconify-icon icon="mdi:plus"></iconify-icon>
                تغییر آدرس ارسال
            </a>
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
    
    const shippingCost = total > 500000 ? 0 : 30000;
    const finalTotal = total + shippingCost;
    
    checkoutTotal.textContent = formatPrice(total + totalDiscount);
    checkoutDiscount.textContent = formatPrice(totalDiscount);
    checkoutShipping.textContent = shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost);
    checkoutFinalTotal.textContent = formatPrice(finalTotal);
}

function setupCheckoutEvents() {
    // Payment method selection
    $$('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Update UI for selected payment method
            $$('.payment-option').forEach(option => {
                option.classList.remove('border-green-500', 'bg-green-50');
                option.classList.add('border-gray-300');
                const circle = option.querySelector('.payment-circle');
                if (circle) {
                    circle.classList.remove('border-blue-500', 'bg-blue-500');
                    circle.classList.add('border-gray-400');
                    const icon = circle.querySelector('iconify-icon');
                    if (icon) {
                        icon.remove();
                    }
                }
            });

            const currentOption = this.closest('.payment-option');
            currentOption.classList.add('border-green-500', 'bg-green-50');
            currentOption.classList.remove('border-gray-300');

            const activeCircle = currentOption.querySelector('.payment-circle');
            if (activeCircle) {
                activeCircle.classList.remove('border-gray-400');
                activeCircle.classList.add('border-blue-500', 'bg-blue-500');
                if (!activeCircle.querySelector('iconify-icon')) {
                    const icon = document.createElement('iconify-icon');
                    icon.setAttribute('icon', 'mdi:check');
                    icon.classList.add('text-white', 'text-sm');
                    activeCircle.appendChild(icon);
                }
            }
        });
    });
    
    // Final checkout
    $('#finalCheckoutBtn').addEventListener('click', function() {
        if (cart.length === 0) {
            notify('سبد خرید شما خالی است', true);
            return;
        }
        
        const selectedPayment = $('input[name="payment"]:checked').value;
        const address = addresses.find(addr => addr.userId === user.id && addr.isDefault);
        
        if (!address) {
            notify('لطفا یک آدرس برای ارسال انتخاب کنید', true);
            return;
        }
        
        // Create order
        const order = {
            id: uid('o'),
            userId: user.id,
            items: [...cart],
            total: calculateCartTotal().total,
            paymentMethod: selectedPayment,
            address: address,
            status: 'processing',
            date: new Date().toISOString()
        };
        
        orders.push(order);
        LS.set('HDK_orders', orders);
        
        // Clear cart
        cart = [];
        LS.set('HDK_cart', cart);
        updateCartBadge();
        
        notify('سفارش شما با موفقیت ثبت شد!');
        location.hash = 'orders';
    });
}

// Cart and Compare event listeners
cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('open');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
});

compareBtn.addEventListener('click', openCompareModal);

closeCompareModal.addEventListener('click', () => {
    compareModal.classList.add('hidden');
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        notify('سبد خرید شما خالی است', true);
        return;
    }
    location.hash = 'checkout';
    cartSidebar.classList.remove('open');
});

// Replace original checkout with enhanced version
const originalRenderCheckoutPage = renderCheckoutPage;
renderCheckoutPage = renderEnhancedCheckoutPage;