/* ---------- helpers ---------- */
const $ = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => Array.from((ctx||document).querySelectorAll(s));
const notifyEl = document.getElementById('notification');

const PAGE_LINKS = {
    home: 'index.html',
    login: 'login.html',
    products: 'products.html',
    wishlist: 'wishlist.html',
    compare: 'compare.html',
    cart: 'cart.html',
    checkout: 'checkout.html',
    about: 'about.html',
    contact: 'contact.html',
    blog: 'blog.html',
    profile: 'profile.html',
    orders: 'orders.html',
    addresses: 'addresses.html',
    'admin-login': 'admin-login.html',
    admin: 'admin.html',
    'product:p1': 'product-p1.html'
};

function notify(msg, isError=false){
    notifyEl.textContent = msg;
    notifyEl.classList.toggle('error', isError);
    notifyEl.classList.add('show');
    clearTimeout(notifyEl._t);
    notifyEl._t = setTimeout(()=> notifyEl.classList.remove('show'), 3500);
}

function uid(prefix='id'){ return prefix + Math.random().toString(36).slice(2,9); }

function formatPrice(n){ return n.toLocaleString('fa-IR') + ' تومان'; }

function pageLink(slug){
    const file = PAGE_LINKS[slug];
    if(!file) return `#${slug}`;
    return `./${file}`;
}

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
function setupOtpInputs(container) {
    const inputs = $$('.otp-input', container);
    
    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1) {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            }
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value === '') {
                if (index > 0) {
                    inputs[index - 1].focus();
                }
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
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupAutoClearInputs();
    setupInputValidation();
});