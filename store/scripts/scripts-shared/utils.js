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
        input.style.backgroundColor = 'rgba(15, 23, 42, 0.85)';
        input.style.color = '#f8fafc';
        input.style.borderColor = '#475569';
        input.style.caretColor = '#f8fafc';

        input.addEventListener('focus', (e) => {
            e.target.select?.();
        });

        input.addEventListener('input', (e) => {
            e.target.classList.remove('border-red-500', 'border-green-500');
            e.target.style.borderColor = '#475569';
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

            inputs.forEach(inputEl => {
                inputEl.classList.remove('border-red-500', 'border-green-500');
                inputEl.style.borderColor = '#475569';
            });

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
        input.classList.remove('border-primary', 'border-red-500', 'border-green-500');
        input.style.borderColor = '#475569';
    });
    if (inputs[0]) inputs[0].focus();

    if (container && container.dataset) {
        delete container.dataset.otpSubmitting;
    }
}

// تابع برای هایلایت کردن مربع‌ها
function highlightOtpInputs(container, isValid) {
    const inputs = $$('.otp-input', container);
    inputs.forEach(input => {
        input.classList.remove('border-primary', 'border-red-500', 'border-green-500');
        if (isValid) {
            input.classList.add('border-green-500');
            input.style.borderColor = '#22c55e';
        } else {
            input.classList.add('border-red-500');
            input.style.borderColor = '#ef4444';
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
        if (!mobileMenu) return;
        if (window.innerWidth >= 1024) {
            mobileMenu.classList.add('hidden');
        }
    }

    window.addEventListener('resize', handleResize);
}

// بهبود و انیمیشن آیکون‌ها در سراسر پروژه
function setupIconAnimations() {
    const interactiveSelector = 'button, a, [role="button"], [data-icon-interactive-parent], .icon-action, .icon-button';

    const markIcon = (icon) => {
        if (!(icon instanceof HTMLElement)) return;

        const interactiveParent = icon.closest(interactiveSelector);
        const hasPointerClass = icon.classList.contains('cursor-pointer') || icon.classList.contains('hover:text-primary');
        const isInteractive = Boolean(interactiveParent) || hasPointerClass || icon.hasAttribute('data-icon-interactive');

        icon.classList.add(
            'inline-flex',
            'items-center',
            'justify-center',
            'align-middle',
            'leading-none',
            'origin-center',
            'transition',
            'duration-200',
            'ease-out',
            'animate-icon-pop'
        );

        if (isInteractive) {
            const hoverClasses = ['-translate-y-0.5', 'scale-105'];
            const activeClasses = ['scale-95'];

            icon.classList.add('cursor-pointer');

            const resetTransforms = () => {
                icon.classList.remove(...hoverClasses, ...activeClasses);
            };

            icon.addEventListener('mouseenter', () => {
                icon.classList.add(...hoverClasses);
                icon.classList.remove(...activeClasses);
            });

            icon.addEventListener('mouseleave', resetTransforms);
            icon.addEventListener('focus', () => icon.classList.add(...hoverClasses));
            icon.addEventListener('blur', resetTransforms);
            icon.addEventListener('mousedown', () => icon.classList.add(...activeClasses));
            icon.addEventListener('mouseup', () => icon.classList.remove(...activeClasses));
        }
    };

    const enhanceTree = (root) => {
        if (!root) return;

        if (root.tagName === 'ICONIFY-ICON') {
            markIcon(root);
            return;
        }

        root.querySelectorAll?.('iconify-icon').forEach(markIcon);
    };

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (!(node instanceof HTMLElement)) return;
                enhanceTree(node);
            });
        });
    });

    enhanceTree(document);

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

// Initialize all utilities
document.addEventListener('DOMContentLoaded', () => {
    setupAutoClearInputs();
    setupInputValidation();
    setupSmoothScroll();
    setupLazyLoading();
    setupResponsiveHandlers();
    setupIconAnimations();
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
        checkProductStock,
        setupIconAnimations
    };
}
