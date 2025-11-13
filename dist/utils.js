/* ---------- Utility Functions ---------- */
const globalScope = typeof window !== 'undefined' ? window : globalThis;

const formBehaviors = globalScope.FormBehaviors || null;
const otpManager = globalScope.OTPManager || null;

const noop = () => {};
const returnEmptyString = () => '';

const setupAutoClearInputs = formBehaviors && typeof formBehaviors.setupAutoClearInputs === 'function'
    ? formBehaviors.setupAutoClearInputs.bind(formBehaviors)
    : noop;
const setupInputValidation = formBehaviors && typeof formBehaviors.setupInputValidation === 'function'
    ? formBehaviors.setupInputValidation.bind(formBehaviors)
    : noop;
const setupSmoothScroll = formBehaviors && typeof formBehaviors.setupSmoothScroll === 'function'
    ? formBehaviors.setupSmoothScroll.bind(formBehaviors)
    : noop;
const setupLazyLoading = formBehaviors && typeof formBehaviors.setupLazyLoading === 'function'
    ? formBehaviors.setupLazyLoading.bind(formBehaviors)
    : noop;
const setupResponsiveHandlers = formBehaviors && typeof formBehaviors.setupResponsiveHandlers === 'function'
    ? formBehaviors.setupResponsiveHandlers.bind(formBehaviors)
    : noop;

const setupOtpInputs = otpManager && typeof otpManager.setup === 'function'
    ? otpManager.setup.bind(otpManager)
    : noop;
const getOtpCode = otpManager && typeof otpManager.getCode === 'function'
    ? otpManager.getCode.bind(otpManager)
    : returnEmptyString;
const resetOtpInputs = otpManager && typeof otpManager.reset === 'function'
    ? otpManager.reset.bind(otpManager)
    : noop;
const highlightOtpInputs = otpManager && typeof otpManager.highlight === 'function'
    ? otpManager.highlight.bind(otpManager)
    : noop;

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

// Initialize all utilities
document.addEventListener('DOMContentLoaded', () => {
    if (formBehaviors && typeof formBehaviors.init === 'function') {
        formBehaviors.init();
    } else {
        setupAutoClearInputs();
        setupInputValidation();
        setupSmoothScroll();
        setupLazyLoading();
        setupResponsiveHandlers();
    }

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