/* ---------- Utility Functions ---------- */
function setupAutoClearInputs() {
    document.addEventListener('focus', (e) => {
        if (e.target.matches('input[type="number"], input[type="text"]')) {
            if (e.target.value === '0' || e.target.value === '00') {
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
            const value = e.target.value;
            
            // فقط اعداد مجاز
            if (!/^\d*$/.test(value)) {
                e.target.value = '';
                return;
            }
            
            if (value.length === 1) {
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
            
            if (e.key === 'ArrowLeft' && index > 0) {
                inputs[index - 1].focus();
            }
            
            if (e.key === 'ArrowRight' && index < inputs.length - 1) {
                inputs[index + 1].focus();
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
            
            if (inputs[numbers.length]) {
                inputs[numbers.length].focus();
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
        input.classList.remove('border-primary', 'border-red-500', 'border-green-500');
        input.classList.add('border-gray-300');
    });
    if (inputs[0]) inputs[0].focus();
}

// تابع برای هایلایت کردن مربع‌ها
function highlightOtpInputs(container, isValid) {
    const inputs = $$('.otp-input', container);
    inputs.forEach(input => {
        input.classList.remove('border-primary', 'border-red-500', 'border-green-500');
        if (isValid) {
            input.classList.add('border-green-500');
        } else {
            input.classList.add('border-red-500');
        }
    });
}

// تابع برای ایجاد delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// تابع برای format کردن تاریخ
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
}

// تابع برای truncate متن
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// تابع برای ایجاد slug
function createSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\u0600-\u06FF]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// تابع برای فیلتر کردن محصولات بر اساس دسته‌بندی
function filterProductsByCategory(products, category) {
    if (!category) return products;
    return products.filter(product => product.category === category);
}

// تابع برای جستجو در محصولات
function searchProducts(products, query) {
    if (!query) return products;
    
    const searchTerm = query.toLowerCase().trim();
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.desc.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
}

// تابع برای مرتب‌سازی محصولات
function sortProducts(products, sortBy) {
    const sorted = [...products];
    
    switch(sortBy) {
        case 'price_asc':
            return sorted.sort((a, b) => {
                const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
                const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
                return priceA - priceB;
            });
            
        case 'price_desc':
            return sorted.sort((a, b) => {
                const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
                const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
                return priceB - priceA;
            });
            
        case 'discount':
            return sorted.sort((a, b) => b.discount - a.discount);
            
        case 'newest':
            return sorted.sort((a, b) => new Date(b.created || 0) - new Date(a.created || 0));
            
        case 'popular':
        default:
            return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
}

// تابع برای محاسبه مجموع سبد خرید
function calculateCartTotal() {
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
    });
    
    return { total, totalDiscount };
}

// تابع برای بررسی موجودی محصول
function checkProductStock(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return false;
    
    const cartItem = cart.find(item => item.productId === productId);
    const currentQty = cartItem ? cartItem.qty : 0;
    
    return product.stock >= (currentQty + quantity);
}

// تابع برای مدیریت اسکرول
function setupSmoothScroll() {
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = $(e.target.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// تابع برای lazy loading تصاویر
function setupLazyLoading() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    $$('img[data-src]').forEach(img => {
        observer.observe(img);
    });
}

// تابع برای مدیریت responsive
function setupResponsiveHandlers() {
    function handleResize() {
        if (window.innerWidth >= 1024) {
            mobileMenu.classList.add('hidden');
        }
    }
    
    window.addEventListener('resize', handleResize);
}

// Initialize all utilities
document.addEventListener('DOMContentLoaded', () => {
    setupAutoClearInputs();
    setupInputValidation();
    setupSmoothScroll();
    setupLazyLoading();
    setupResponsiveHandlers();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setupOtpInputs,
        getOtpCode,
        resetOtpInputs,
        highlightOtpInputs,
        delay,
        formatDate,
        truncateText,
        createSlug,
        filterProductsByCategory,
        searchProducts,
        sortProducts,
        calculateCartTotal,
        checkProductStock
    };
}