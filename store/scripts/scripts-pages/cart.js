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
            option.classList.remove(
                'border-green-500',
                'bg-green-50',
                'dark:bg-emerald-500/10',
                'shadow-[0_6px_18px_rgba(37,99,235,0.2)]'
            );
            option.classList.add('border-gray-300', 'dark:border-gray-700', 'bg-white', 'dark:bg-gray-800');
            option.dataset.selected = 'false';
            option.setAttribute('aria-checked', 'false');

            const indicator = option.querySelector('.payment-option-indicator');
            if (indicator) {
                indicator.classList.remove('bg-blue-600', 'border-blue-600', 'text-white', 'shadow-[0_6px_18px_rgba(37,99,235,0.2)]');
            }

            const icon = option.querySelector('.payment-option-icon');
            if (icon) {
                icon.classList.remove('text-emerald-500');
                icon.classList.add('text-gray-500');
            }

            const indicatorCheck = option.querySelector('.payment-option-check');
            if (indicatorCheck) {
                indicatorCheck.classList.add('opacity-0');
            }
        });

        if (!paymentOption) {
            console.warn('Payment option container not found for selected payment input.');
            return;
        }

        paymentOption.classList.add('border-green-500', 'bg-green-50', 'dark:bg-emerald-500/10', 'shadow-[0_6px_18px_rgba(37,99,235,0.2)]');
        paymentOption.classList.remove('border-gray-300', 'dark:border-gray-700', 'bg-white', 'dark:bg-gray-800');
        paymentOption.dataset.selected = 'true';
        paymentOption.setAttribute('aria-checked', 'true');

        const indicator = paymentOption.querySelector('.payment-option-indicator');
        if (indicator) {
            indicator.classList.add('bg-blue-600', 'border-blue-600', 'text-white', 'shadow-[0_6px_18px_rgba(37,99,235,0.2)]');
        }

        const indicatorCheck = paymentOption.querySelector('.payment-option-check');
        if (indicatorCheck) {
            indicatorCheck.classList.remove('opacity-0');
        }

        const icon = paymentOption.querySelector('.payment-option-icon');
        if (icon) {
            icon.classList.remove('text-gray-500');
            icon.classList.add('text-emerald-500');
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
