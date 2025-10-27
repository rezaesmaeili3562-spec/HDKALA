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
                notify('شماره تلفن باید با 09 شروع شده و 11 رقمی باشد', 'error');
            } else {
                input.classList.remove('border-red-500');
            }
        }
        
        if (input.hasAttribute('data-postal')) {
            if (input.value && !validatePostalCode(input.value)) {
                input.classList.add('border-red-500');
                notify('کد پستی باید 10 رقمی باشد', 'error');
            } else {
                input.classList.remove('border-red-500');
            }
        }
        
        if (input.hasAttribute('data-national')) {
            if (input.value && !validateNationalCode(input.value)) {
                input.classList.add('border-red-500');
                notify('کد ملی نامعتبر است', 'error');
            } else {
                input.classList.remove('border-red-500');
            }
        }
        
        if (input.type === 'email' && input.value) {
            if (!validateEmail(input.value)) {
                input.classList.add('border-red-500');
                notify('ایمیل وارد شده معتبر نیست', 'error');
            } else {
                input.classList.remove('border-red-500');
            }
        }
    });
}

// تابع برای مدیریت مربع‌های کد تأیید
function setupOtpInputs(container) {
    const inputs = $$('.otp-input', container);

    const isDigitKey = (event) => /\d/.test(event.key);

    inputs.forEach((input, index) => {
        input.setAttribute('dir', 'ltr');
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('pattern', '[0-9]*');
        input.setAttribute('autocomplete', 'one-time-code');
        input.type = 'tel';
        input.maxLength = 1;

        input.addEventListener('focus', () => {
            input.select();
        });

        input.addEventListener('input', (e) => {
            const value = e.target.value.replace(/[^\d]/g, '');
            e.target.value = value.slice(0, 1);

            e.target.classList.remove('border-red-500', 'border-green-500');
            if (!e.target.classList.contains('border-gray-300')) {
                e.target.classList.add('border-gray-300');
            }

            // فقط اعداد مجاز
            if (e.target.value.length === 1) {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            }
        });

        input.addEventListener('keydown', (e) => {
            const target = e.target;
            const key = e.key;

            if (key === 'ArrowLeft' && index > 0) {
                e.preventDefault();
                inputs[index - 1].focus();
                return;
            }

            if (key === 'ArrowRight' && index < inputs.length - 1) {
                e.preventDefault();
                inputs[index + 1].focus();
                return;
            }

            if (key === 'Backspace') {
                e.preventDefault();
                if (target.value) {
                    target.value = '';
                } else if (index > 0) {
                    inputs[index - 1].focus();
                    inputs[index - 1].value = '';
                }
                return;
            }

            if (key === 'Delete') {
                e.preventDefault();
                if (target.value) {
                    target.value = '';
                } else if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                    inputs[index + 1].value = '';
                }
                return;
            }

            if (key.length > 1) {
                return;
            }

            if (!isDigitKey(e)) {
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
                    inputs[i].classList.remove('border-red-500', 'border-green-500');
                    if (!inputs[i].classList.contains('border-gray-300')) {
                        inputs[i].classList.add('border-gray-300');
                    }
                }
            });

            if (inputs[numbers.length]) {
                inputs[numbers.length].focus();
            }
        });
    });

    if (inputs[0]) {
        inputs[0].focus();
    }
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

// تابع برای مدیریت اسکرول بدون اختلال در مسیریاب
function setupSmoothScroll() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        if (link.hasAttribute('data-route-link')) {
            return;
        }

        const hash = link.getAttribute('href');
        if (!hash || hash.length <= 1) return;

        const target = document.querySelector(hash);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
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

// بهبود و انیمیشن آیکون‌ها در سراسر پروژه
function setupIconAnimations() {
    const interactiveSelector = 'button, a, [role="button"], [data-icon-interactive-parent], .icon-action, .icon-button';

    const markIcon = (icon) => {
        if (!(icon instanceof HTMLElement)) return;

        icon.classList.add('icon-animated');

        const interactiveParent = icon.closest(interactiveSelector);
        const hasPointerClass = icon.classList.contains('cursor-pointer') || icon.classList.contains('hover:text-primary');
        const isInteractive = Boolean(interactiveParent) || hasPointerClass || icon.hasAttribute('data-icon-interactive');

        icon.dataset.iconInteractive = isInteractive ? 'true' : 'false';
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

function setupWishlistButtonInteractions() {
    const DEFAULT_ACTIVE_TEXT = 'حذف از علاقه‌مندی';
    const DEFAULT_INACTIVE_TEXT = 'افزودن به علاقه‌مندی';

    const getButtons = (root = document) => {
        if (!root || !root.querySelectorAll) return [];
        return Array.from(root.querySelectorAll('.wishlist-button'));
    };

    const updateButtonState = (button) => {
        if (!(button instanceof HTMLElement)) return;

        const productId = button.getAttribute('data-id');
        if (!productId) return;

        const wishlistState = (typeof wishlist !== 'undefined' && Array.isArray(wishlist)) ? wishlist : [];
        const isActive = wishlistState.includes(productId);
        button.dataset.wishlistActive = isActive ? 'true' : 'false';

        const currentIcon = button.querySelector('.wishlist-icon-current');
        const previewIcon = button.querySelector('.wishlist-icon-preview');
        const tooltip = button.querySelector('.wishlist-tooltip');

        if (currentIcon) {
            currentIcon.setAttribute('icon', isActive ? 'mdi:heart' : 'mdi:heart-outline');
        }

        if (previewIcon) {
            previewIcon.setAttribute('icon', isActive ? 'mdi:heart-off' : 'mdi:heart-plus');
        }

        const activeText = button.getAttribute('data-label-active') || DEFAULT_ACTIVE_TEXT;
        const inactiveText = button.getAttribute('data-label-inactive') || DEFAULT_INACTIVE_TEXT;
        const tooltipText = isActive ? activeText : inactiveText;
        if (tooltip) {
            tooltip.textContent = tooltipText;
        }

        const textLabel = button.querySelector('.wishlist-label-text');
        if (textLabel) {
            textLabel.textContent = isActive ? 'حذف علاقه‌مندی' : 'علاقه‌مندی';
        }

        const ariaLabel = isActive ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها';
        button.setAttribute('aria-label', ariaLabel);
    };

    const updateAll = (root) => {
        getButtons(root).forEach(updateButtonState);
    };

    updateAll(document);

    document.addEventListener('mouseenter', (event) => {
        const button = event.target.closest?.('.wishlist-button');
        if (!button) return;
        updateButtonState(button);
    }, true);

    document.addEventListener('click', (event) => {
        const button = event.target.closest?.('.wishlist-button');
        if (!button) return;
        requestAnimationFrame(() => updateButtonState(button));
        setTimeout(() => updateAll(document), 160);
    });

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (!(node instanceof HTMLElement)) return;
                if (node.matches?.('.wishlist-button')) {
                    updateButtonState(node);
                }
                updateAll(node);
            });
        });
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.refreshWishlistButtons = updateAll;
}

// Initialize all utilities
document.addEventListener('DOMContentLoaded', () => {
    setupAutoClearInputs();
    setupInputValidation();
    setupSmoothScroll();
    setupLazyLoading();
    setupResponsiveHandlers();
    setupWishlistButtonInteractions();
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