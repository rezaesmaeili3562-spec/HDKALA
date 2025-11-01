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

function notify(msg, isError=false){
    if (!notifyEl) return;

    if (notifyMessageEl) {
        notifyMessageEl.textContent = msg;
    } else {
        notifyEl.textContent = msg;
    }

    notifyEl.classList.remove('notification--error', 'notification--success', 'show');
    void notifyEl.offsetWidth;
    notifyEl.classList.add(isError ? 'notification--error' : 'notification--success');
    notifyEl.classList.add('show');

    clearTimeout(notifyEl._t);
    notifyEl._t = setTimeout(() => {
        notifyEl.classList.remove('show');
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
        container.innerHTML = `
            <div class="col-span-full text-center text-gray-500 py-10">
                <iconify-icon icon="mdi:package-variant-remove" width="64" class="mb-4"></iconify-icon>
                <p class="text-lg">محصولی یافت نشد</p>
                <p class="text-sm mt-2">لطفا فیلترهای خود را تغییر دهید</p>
            </div>
        `; 
        return; 
    }
    
    list.forEach(p => {
        const finalPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
        const hasDiscount = p.discount > 0;
        const inWishlist = wishlist.includes(p.id);
        const inCompare = compareList.includes(p.id);
        
        const article = document.createElement('article');
        article.className = 'product-card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 relative border border-primary/20';
        article.innerHTML = `
            <div class="relative overflow-hidden">
                <a href="#product:${p.id}">
                    <div class="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        ${p.img ? 
                            `<img src="${p.img}" alt="${p.name}" class="w-full h-48 object-cover product-image zoom-image" loading="lazy" />` :
                            `<iconify-icon icon="mdi:image-off" width="48" class="text-gray-400"></iconify-icon>`
                        }
                    </div>
                </a>
                <div class="absolute top-2 left-2 flex gap-2">
                    <button aria-label="افزودن به علاقه‌مندی‌ها" data-id="${p.id}" class="add-to-wishlist bg-white/90 dark:bg-gray-800/90 rounded-full p-2 backdrop-blur-sm">
                        <iconify-icon icon="${inWishlist ? 'mdi:heart' : 'mdi:heart-outline'}" class="${inWishlist ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}"></iconify-icon>
                    </button>
                    <button aria-label="مقایسه محصول" data-id="${p.id}" class="add-to-compare bg-white/90 dark:bg-gray-800/90 rounded-full p-2 backdrop-blur-sm">
                        <iconify-icon icon="${inCompare ? 'mdi:scale-balance' : 'mdi:scale-balance'}" class="${inCompare ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}"></iconify-icon>
                    </button>
                </div>
                <div class="absolute top-2 right-2 flex flex-col gap-2">
                    ${hasDiscount ? `<div class="badge badge-discount">${p.discount}%</div>` : ''}
                    ${p.status === 'new' ? `<div class="badge badge-new">جدید</div>` : ''}
                    ${p.status === 'hot' ? `<div class="badge badge-hot">فروش ویژه</div>` : ''}
                    ${p.status === 'bestseller' ? `<div class="badge bg-purple-500 text-white">پرفروش</div>` : ''}
                </div>
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg mb-1 dark:text-white line-clamp-2">${p.name}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">${p.desc}</p>
                <div class="flex items-center justify-between mb-3">
                    <div>
                        ${hasDiscount ? `<div class="text-gray-500 line-through text-sm">${formatPrice(p.price)}</div>` : ''}
                        <span class="text-primary font-extrabold">${formatPrice(finalPrice)}</span>
                    </div>
                    <div class="text-yellow-500 text-sm">${'★'.repeat(p.rating)}${p.rating < 5 ? '☆'.repeat(5-p.rating) : ''}</div>
                </div>
                <div class="flex items-center justify-between mb-2 text-xs">
                    <div class="text-gray-500 dark:text-gray-400">موجودی: ${p.stock > 0 ? `<span class="text-green-500">${p.stock}</span>` : `<span class="text-red-500">ناموجود</span>`}</div>
                    <div class="text-gray-500 dark:text-gray-400">${p.brand || '---'}</div>
                </div>
                <div class="flex gap-2">
                    <button class="add-to-cart flex-1 bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-semibold transition-colors" data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>${p.stock > 0 ? 'افزودن به سبد' : 'ناموجود'}</button>
                    <a href="#product:${p.id}" class="view-detail w-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label="جزئیات">
                        <iconify-icon icon="mdi:eye" width="18"></iconify-icon>
                    </a>
                </div>
            </div>
        `;
        container.appendChild(article);
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