/* ---------- Cart Functions ---------- */
function updateCartDisplay() {
    if (!cartItems) return;
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.appendChild(Templates.clone('tpl-cart-empty'));
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
        
        const fragment = Templates.clone('tpl-cart-item');
        const cartItemEl = fragment.querySelector('[data-element="cart-item"]') || fragment.firstElementChild;
        if (!cartItemEl) {
            return;
        }

        const nameEl = fragment.querySelector('[data-element="cart-item-name"]');
        if (nameEl) {
            nameEl.textContent = product.name;
        }

        const qtyEl = fragment.querySelector('[data-element="cart-qty"]');
        if (qtyEl) {
            qtyEl.textContent = item.qty;
        }

        const priceEl = fragment.querySelector('[data-element="cart-price"]');
        if (priceEl) {
            priceEl.textContent = formatPrice(finalPrice);
        }

        const savingsEl = fragment.querySelector('[data-element="cart-savings"]');
        if (savingsEl) {
            if (itemDiscount > 0) {
                savingsEl.textContent = `${formatPrice(itemDiscount)} صرفه‌جویی`;
                savingsEl.classList.remove('hidden');
            } else {
                savingsEl.classList.add('hidden');
            }
        }

        const decreaseBtn = fragment.querySelector('[data-element="cart-decrease"]');
        if (decreaseBtn) {
            decreaseBtn.dataset.id = product.id;
            decreaseBtn.addEventListener('click', (e) => {
                const productId = e.currentTarget.getAttribute('data-id');
                updateCartItemQty(productId, -1);
            });
        }

        const increaseBtn = fragment.querySelector('[data-element="cart-increase"]');
        if (increaseBtn) {
            increaseBtn.dataset.id = product.id;
            increaseBtn.addEventListener('click', (e) => {
                const productId = e.currentTarget.getAttribute('data-id');
                updateCartItemQty(productId, 1);
            });
        }

        const removeBtn = fragment.querySelector('[data-element="cart-remove"]');
        if (removeBtn) {
            removeBtn.dataset.id = product.id;
            removeBtn.addEventListener('click', (e) => {
                const productId = e.currentTarget.getAttribute('data-id');
                removeFromCart(productId);
            });
        }

        cartItems.appendChild(fragment);
    });

    const shippingCost = total > 500000 ? 0 : 30000;
    const finalTotal = total + shippingCost;

    cartTotal.textContent = formatPrice(total + totalDiscount);
    cartDiscount.textContent = formatPrice(totalDiscount);
    cartShipping.textContent = shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost);
    cartFinalTotal.textContent = formatPrice(finalTotal);
    
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

/* ---------- Wishlist Helpers ---------- */
function toggleWishlist(productId) {
    if (!productId) return;

    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        notify('محصول از علاقه‌مندی‌ها حذف شد');
    } else {
        wishlist.push(productId);
        notify('محصول به علاقه‌مندی‌ها اضافه شد');
    }

    LS.set('HDK_wishlist', wishlist);
    updateWishlistBadge();

    const isInWishlist = wishlist.includes(productId);
    $$(`.add-to-wishlist[data-id="${productId}"]`).forEach(btn => {
        btn.classList.toggle('active', isInWishlist);
        btn.setAttribute('aria-pressed', isInWishlist ? 'true' : 'false');

        const icon = btn.querySelector('iconify-icon');
        if (icon) {
            icon.setAttribute('icon', isInWishlist ? 'mdi:heart' : 'mdi:heart-outline');
            icon.classList.toggle('text-red-500', isInWishlist);
            icon.classList.toggle('text-gray-600', !isInWishlist);
            icon.classList.toggle('dark:text-gray-400', !isInWishlist);
        }
    });
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
    compareModal.classList.add('flex');
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
                    <a href="#addresses" class="text-primary hover:text-primary/80 mt-2 inline-block">افزودن آدرس</a>
                </div>
            `}
            
            <a href="#addresses" class="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
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
    const paymentOptions = $$('.payment-option');
    const paymentRadios = $$('input[name="payment"]');

    const activatePaymentOption = (paymentOption) => {
        const allOptions = $$('.payment-option');

        allOptions.forEach(option => {
            option.classList.remove('payment-option--active', 'border-green-500', 'bg-green-50', 'dark:bg-green-500/10');
            option.classList.add('border-gray-300');
            option.dataset.selected = 'false';
            option.setAttribute('aria-checked', 'false');

            const indicator = option.querySelector('.payment-option-indicator');
            if (indicator) {
                indicator.classList.remove('payment-option-indicator--active');
            }

            const icon = option.querySelector('.payment-option-icon');
            if (icon) {
                icon.classList.remove('text-green-500');
                if (!icon.classList.contains('text-gray-500')) {
                    icon.classList.add('text-gray-500');
                }
            }
        });

        if (!paymentOption) {
            console.warn('Payment option container not found for selected payment input.');
            return;
        }

        paymentOption.classList.add('payment-option--active', 'border-green-500', 'bg-green-50', 'dark:bg-green-500/10');
        paymentOption.classList.remove('border-gray-300');
        paymentOption.dataset.selected = 'true';
        paymentOption.setAttribute('aria-checked', 'true');

        const indicator = paymentOption.querySelector('.payment-option-indicator');
        if (indicator) {
            indicator.classList.add('payment-option-indicator--active');
        }

        const icon = paymentOption.querySelector('.payment-option-icon');
        if (icon) {
            icon.classList.remove('text-gray-500');
            icon.classList.add('text-green-500');
        }
    };

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const paymentOption = this.closest('.payment-option');
            activatePaymentOption(paymentOption);
        });
    });

    paymentOptions.forEach(option => {
        if (option.dataset.paymentEnhanced === 'true') {
            return;
        }

        option.dataset.paymentEnhanced = 'true';
        option.setAttribute('tabindex', '0');

        option.addEventListener('click', () => {
            const radio = option.querySelector('input[type="radio"][name="payment"]');
            if (!radio) {
                return;
            }

            if (!radio.checked) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                activatePaymentOption(option);
            }
        });

        option.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const radio = option.querySelector('input[type="radio"][name="payment"]');
                if (radio) {
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change', { bubbles: true }));
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
    compareModal.classList.remove('flex');
});

compareModal.addEventListener('click', (event) => {
    if (event.target === compareModal) {
        compareModal.classList.add('hidden');
        compareModal.classList.remove('flex');
    }
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
function enhanceCheckoutRendering() {
    if (typeof window === 'undefined') return false;

    const currentRender = window.renderCheckoutPage;

    if (typeof currentRender !== 'function') {
        return false;
    }

    if (currentRender === renderEnhancedCheckoutPage) {
        return true;
    }

    window.renderCheckoutPage = renderEnhancedCheckoutPage;
    return true;
}

if (!enhanceCheckoutRendering()) {
    window.addEventListener('load', enhanceCheckoutRendering, { once: true });
}

(function(){
  if (typeof document === 'undefined') return;
  const body = document.body;
  if (!body || body.dataset.page !== 'cart') return;

  function activate(){
    const target = '#cart';
    if (location.hash !== target) {
      location.hash = target;
    } else if (typeof renderPage === 'function') {
      renderPage();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', activate);
  } else {
    activate();
  }
})();
