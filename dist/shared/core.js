/* ---------- helpers ---------- */
const $ = (s, ctx=document) => {
    const scope = ctx || document;
    try {
        return scope.querySelector(s);
    } catch (err) {
        if (typeof s === 'string' && s.startsWith('#')) {
            return scope.getElementById(s.slice(1));
        }
        return null;
    }
};
const $$ = (s, ctx=document) => {
    const scope = ctx || document;
    try {
        return Array.from(scope.querySelectorAll(s));
    } catch (err) {
        return [];
    }
};
const notifyEl = document.getElementById('notification');
const notifyMessageEl = document.getElementById('notificationMessage');
const notifyBaseHide = ['opacity-0', 'translate-y-4', 'scale-[0.98]', 'pointer-events-none'];
const notifyShowClasses = ['opacity-100', 'translate-y-0', 'scale-100', 'pointer-events-auto'];
const notifyErrorClasses = ['border-red-500'];
const notifySuccessClasses = ['border-green-500'];

function notify(msg, isError=false){
    if (!notifyEl) return;

    if (notifyMessageEl) {
        notifyMessageEl.textContent = msg;
    } else {
        notifyEl.textContent = msg;
    }

    notifyEl.classList.remove('notification--error', 'notification--success', 'show', ...notifyShowClasses, ...notifyErrorClasses, ...notifySuccessClasses);
    notifyEl.classList.add(...notifyBaseHide);
    void notifyEl.offsetWidth;
    notifyEl.classList.add(isError ? 'notification--error' : 'notification--success');
    notifyEl.classList.add('show', ...(isError ? notifyErrorClasses : notifySuccessClasses), ...notifyShowClasses);

    clearTimeout(notifyEl._t);
    notifyEl._t = setTimeout(() => {
        notifyEl.classList.remove('show', ...notifyShowClasses, ...notifyErrorClasses, ...notifySuccessClasses);
        notifyEl.classList.add(...notifyBaseHide);
    }, 3500);
}

function uid(prefix='id'){ return prefix + Math.random().toString(36).slice(2,9); }

function formatPrice(n){ return n.toLocaleString('fa-IR') + ' تومان'; }

function getCategoryName(category) {
    const categories = {
        'electronics': 'الکترونیک',
        'fashion': 'مد و پوشاک',
        'home': 'خانه و آشپزخانه',
        'books': 'کتاب',
        'sports': 'ورزشی'
    };
    return categories[category] || category;
}

function handleProductActions(e) {
    const addBtn = e.target.closest('.add-to-cart');
    if(addBtn){ 
        addToCart(addBtn.getAttribute('data-id'), 1); 
        return; 
    }
    const viewBtn = e.target.closest('.view-detail');
    if(viewBtn){ 
        location.hash = `product:${viewBtn.getAttribute('data-id')}`; 
        return; 
    }
    const favBtn = e.target.closest('.add-to-wishlist');
    if(favBtn){ 
        toggleWishlist(favBtn.getAttribute('data-id')); 
        return; 
    }
    const compBtn = e.target.closest('.add-to-compare');
    if(compBtn){ 
        toggleCompare(compBtn.getAttribute('data-id')); 
        return; 
    }
}

function renderProductsList(list, container){
    if(!container) return;
    container.innerHTML = '';

    if(!list || list.length===0){
        container.appendChild(Templates.clone('tpl-product-empty'));
        return;
    }

    list.forEach(p => {
        const fragment = Templates.clone('tpl-product-card');
        const root = fragment.querySelector('[data-element="product-card"]') || fragment.firstElementChild;
        if (!root) {
            return;
        }

        const finalPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
        const hasDiscount = p.discount > 0;
        const inWishlist = wishlist.includes(p.id);
        const inCompare = compareList.includes(p.id);

        const productLink = fragment.querySelector('[data-element="product-link"]');
        if (productLink) {
            productLink.href = `#product:${p.id}`;
        }

        const detailBtn = fragment.querySelector('[data-element="detail-button"]');
        if (detailBtn) {
            detailBtn.href = `#product:${p.id}`;
        }

        const wishlistBtn = fragment.querySelector('[data-element="wishlist-btn"]');
        const wishlistIcon = fragment.querySelector('[data-element="wishlist-icon"]');
        if (wishlistBtn) {
            wishlistBtn.dataset.id = p.id;
        }
        if (wishlistIcon) {
            wishlistIcon.setAttribute('icon', inWishlist ? 'mdi:heart' : 'mdi:heart-outline');
            wishlistIcon.classList.toggle('text-red-500', inWishlist);
            wishlistIcon.classList.toggle('text-gray-600', !inWishlist);
            wishlistIcon.classList.toggle('dark:text-gray-400', !inWishlist);
        }

        const compareBtn = fragment.querySelector('[data-element="compare-btn"]');
        const compareIcon = fragment.querySelector('[data-element="compare-icon"]');
        if (compareBtn) {
            compareBtn.dataset.id = p.id;
        }
        if (compareIcon) {
            compareIcon.classList.toggle('text-primary', inCompare);
            compareIcon.classList.toggle('text-gray-600', !inCompare);
            compareIcon.classList.toggle('dark:text-gray-400', !inCompare);
        }

        const imageEl = fragment.querySelector('[data-element="product-image"]');
        const placeholderIcon = fragment.querySelector('[data-element="product-placeholder"]');
        if (imageEl) {
            if (p.img) {
                imageEl.src = p.img;
                imageEl.alt = p.name;
                imageEl.classList.remove('hidden');
                if (placeholderIcon) {
                    placeholderIcon.classList.add('hidden');
                }
            } else {
                imageEl.classList.add('hidden');
                if (placeholderIcon) {
                    placeholderIcon.classList.remove('hidden');
                }
            }
        }

        const badgeDiscount = fragment.querySelector('[data-element="badge-discount"]');
        if (badgeDiscount) {
            if (hasDiscount) {
                badgeDiscount.textContent = `${p.discount}%`;
                badgeDiscount.classList.remove('hidden');
            } else {
                badgeDiscount.classList.add('hidden');
            }
        }

        const badgeNew = fragment.querySelector('[data-element="badge-new"]');
        if (badgeNew) {
            badgeNew.classList.toggle('hidden', p.status !== 'new');
        }

        const badgeHot = fragment.querySelector('[data-element="badge-hot"]');
        if (badgeHot) {
            badgeHot.classList.toggle('hidden', p.status !== 'hot');
        }

        const badgeBest = fragment.querySelector('[data-element="badge-bestseller"]');
        if (badgeBest) {
            badgeBest.classList.toggle('hidden', p.status !== 'bestseller');
        }

        const nameEl = fragment.querySelector('[data-element="product-name"]');
        if (nameEl) {
            nameEl.textContent = p.name;
        }

        const descEl = fragment.querySelector('[data-element="product-description"]');
        if (descEl) {
            descEl.textContent = p.desc || '';
        }

        const originalPriceEl = fragment.querySelector('[data-element="product-original-price"]');
        if (originalPriceEl) {
            if (hasDiscount) {
                originalPriceEl.textContent = formatPrice(p.price);
                originalPriceEl.classList.remove('hidden');
            } else {
                originalPriceEl.classList.add('hidden');
            }
        }

        const finalPriceEl = fragment.querySelector('[data-element="product-final-price"]');
        if (finalPriceEl) {
            finalPriceEl.textContent = formatPrice(finalPrice);
        }

        const ratingEl = fragment.querySelector('[data-element="product-rating"]');
        if (ratingEl) {
            const rating = Math.max(0, Math.min(5, p.rating || 0));
            ratingEl.textContent = `${'★'.repeat(rating)}${rating < 5 ? '☆'.repeat(5 - rating) : ''}`;
        }

        const stockEl = fragment.querySelector('[data-element="product-stock"]');
        if (stockEl) {
            if (p.stock > 0) {
                stockEl.innerHTML = `موجودی: <span class="text-green-500">${p.stock}</span>`;
            } else {
                stockEl.innerHTML = 'موجودی: <span class="text-red-500">ناموجود</span>';
            }
        }

        const brandEl = fragment.querySelector('[data-element="product-brand"]');
        if (brandEl) {
            brandEl.textContent = p.brand || '---';
        }

        const addToCartBtn = fragment.querySelector('[data-element="add-to-cart"]');
        if (addToCartBtn) {
            addToCartBtn.dataset.id = p.id;
            addToCartBtn.textContent = p.stock > 0 ? 'افزودن به سبد' : 'ناموجود';
            if (p.stock === 0) {
                addToCartBtn.disabled = true;
                addToCartBtn.classList.add('opacity-60', 'cursor-not-allowed');
            } else {
                addToCartBtn.disabled = false;
                addToCartBtn.classList.remove('opacity-60', 'cursor-not-allowed');
            }
        }

        container.appendChild(fragment);
    });
}

// اعتبارسنجی‌های جدید
function validatePhone(phone) {
    const phoneRegex = /^09[0-9]{9}$/;
    return phoneRegex.test(phone);
}

function validatePostalCode(code) {
    const postalRegex = /^[0-9]{10}$/;
    return postalRegex.test(code);
}

function validateNationalCode(code) {
    if (!/^\d{10}$/.test(code)) return false;
    
    const check = parseInt(code[9]);
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(code[i]) * (10 - i);
    }
    sum %= 11;
    
    return (sum < 2 && check === sum) || (sum >= 2 && check === 11 - sum);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getOperatorLogo(phone) {
    if (phone.startsWith('099')) return 'irancell';
    if (phone.startsWith('091') || phone.startsWith('0990')) return 'mci';
    if (phone.startsWith('093')) return 'rightel';
    return 'unknown';
}

// توابع جدید برای مدیریت inputها
function setupAutoClearInputs() {
    document.addEventListener('focus', (e) => {
        if (e.target.matches('input[type="number"], input[type="text"]')) {
            if (e.target.value === '0') {
                e.target.value = '';
            }
        }
    });
}

function setupInputValidation() {
    document.addEventListener('blur', (e) => {
        const input = e.target;
        
        if (input.type === 'tel' && input.hasAttribute('data-phone')) {
            if (input.value && !validatePhone(input.value)) {
                input.classList.add('border-red-500');
                notify('شماره تلفن باید با 09 شروع شده و 11 رقمی باشد', true);
            } else {
                input.classList.remove('border-red-500');
            }
        }
        
        if (input.hasAttribute('data-postal')) {
            if (input.value && !validatePostalCode(input.value)) {
                input.classList.add('border-red-500');
                notify('کد پستی باید 10 رقمی باشد', true);
            } else {
                input.classList.remove('border-red-500');
            }
        }
        
        if (input.hasAttribute('data-national')) {
            if (input.value && !validateNationalCode(input.value)) {
                input.classList.add('border-red-500');
                notify('کد ملی نامعتبر است', true);
            } else {
                input.classList.remove('border-red-500');
            }
        }
        
        if (input.type === 'email' && input.value) {
            if (!validateEmail(input.value)) {
                input.classList.add('border-red-500');
                notify('ایمیل وارد شده معتبر نیست', true);
            } else {
                input.classList.remove('border-red-500');
            }
        }
    });
}

// تابع برای مدیریت مربع‌های کد تأیید
function setupOtpInputs(container, options = {}) {
    if (!container) return;

    const inputs = $$('.otp-input', container);
    if (!inputs.length) return;

    const form = inputs[0] ? inputs[0].closest('form') : null;
    const { autoSubmit = true, onComplete } = options;

    const completeAndSubmit = () => {
        if (typeof onComplete === 'function') {
            onComplete(getOtpCode(container));
            return;
        }

        if (!autoSubmit || !form) {
            return;
        }

        if (container.dataset.otpSubmitting === 'true') {
            return;
        }

        container.dataset.otpSubmitting = 'true';

        if (typeof form.requestSubmit === 'function') {
            form.requestSubmit();
        } else {
            form.submit();
        }
    };

    inputs.forEach((input, index) => {
        input.type = 'text';
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('pattern', '\\d*');
        input.setAttribute('autocomplete', 'one-time-code');
        input.dir = 'ltr';
        input.style.direction = 'ltr';
        input.classList.add('text-gray-900', 'dark:text-white');

        input.addEventListener('focus', (e) => {
            e.target.select?.();
        });

        input.addEventListener('input', (e) => {
            const value = e.target.value.replace(/[^\d]/g, '');
            e.target.value = value.slice(-1);

            if (e.target.value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }

            if (inputs.every(inp => inp.value.length === 1)) {
                completeAndSubmit();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value === '') {
                if (index > 0) {
                    inputs[index - 1].focus();
                }
            }

            if (e.key === 'ArrowLeft' && index > 0) {
                inputs[index - 1].focus();
                e.preventDefault();
            }

            if (e.key === 'ArrowRight' && index < inputs.length - 1) {
                inputs[index + 1].focus();
                e.preventDefault();
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasteData = e.clipboardData.getData('text');
            const numbers = pasteData.replace(/[^\d]/g, '').split('');

            numbers.forEach((num, i) => {
                if (inputs[i]) {
                    inputs[i].value = num;
                }
            });

            if (numbers.length < inputs.length) {
                const nextInput = inputs[numbers.length];
                if (nextInput) {
                    nextInput.focus();
                }
            }

            if (inputs.every(inp => inp.value.length === 1)) {
                completeAndSubmit();
            }
        });
    });
}

// تابع برای جمع‌آوری کد از مربع‌ها
function getOtpCode(container) {
    const inputs = $$('.otp-input', container);
    return inputs.map(input => input.value).join('');
}

// تابع برای ریست کردن مربع‌های کد
function resetOtpInputs(container) {
    const inputs = $$('.otp-input', container);
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('border-primary', 'border-red-500');
    });
    if (inputs[0]) inputs[0].focus();

    if (container && container.dataset) {
        delete container.dataset.otpSubmitting;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupAutoClearInputs();
    setupInputValidation();
});