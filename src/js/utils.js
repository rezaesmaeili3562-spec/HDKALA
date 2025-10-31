/* ---------- Utility Functions ---------- */
const OTP_DIGIT_PATTERN = /[0-9\u06F0-\u06F9\u0660-\u0669]/;
const otpStateMap = new WeakMap();

function registerEnhancementModule(module) {
    if (!module || typeof module.init !== 'function') {
        return;
    }

    const registry = typeof window !== 'undefined' ? window.HDKEnhancements : null;

    if (registry && typeof registry.register === 'function') {
        registry.register(module);
        return;
    }

    if (typeof window !== 'undefined') {
        window.__HDK_PENDING_ENHANCEMENTS__ = window.__HDK_PENDING_ENHANCEMENTS__ || [];
        window.__HDK_PENDING_ENHANCEMENTS__.push(module);
    }
}

function createAutoClearInputManager(root = document) {
    let handler = null;

    return {
        init() {
            if (handler || !root) return;
            handler = (event) => {
                const target = event.target;
                if (!(target instanceof HTMLInputElement)) return;
                if (!target.matches('input[type="number"], input[type="text"], input[type="tel"]')) return;

                const normalized = target.value;
                if (normalized === '0' || normalized === '00') {
                    target.value = '';
                }
            };
            root.addEventListener('focus', handler, true);
        },
        destroy() {
            if (!handler || !root) return;
            root.removeEventListener('focus', handler, true);
            handler = null;
        }
    };
}

function createBlurValidationManager(root = document) {
    let handler = null;

    return {
        init() {
            if (handler || !root) return;
            handler = (event) => {
                const input = event.target;
                if (!(input instanceof HTMLInputElement)) return;

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
            };
            root.addEventListener('blur', handler, true);
        },
        destroy() {
            if (!handler || !root) return;
            root.removeEventListener('blur', handler, true);
            handler = null;
        }
    };
}

function normalizeDigitString(value = '') {
    return value
        .replace(/[۰-۹]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 1728))
        .replace(/[٠-٩]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 1632));
}

function ensureOtpStatusElement(container, providedElement) {
    if (providedElement) return providedElement;
    const existing = container.querySelector('[data-otp-status]');
    if (existing) return existing;
    const region = document.createElement('div');
    region.setAttribute('data-otp-status', 'true');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.className = 'sr-only';
    container.appendChild(region);
    return region;
}

// تابع برای مدیریت مربع‌های کد تأیید
function setupOtpInputs(container, options = {}) {
    const host = container instanceof HTMLElement ? container : document;
    const inputs = $$('.otp-input', host);

    if (!inputs || inputs.length === 0) {
        otpStateMap.delete(host);
        return { focusFirst: () => {}, destroy: () => {}, announce: () => {} };
    }

    const cleanup = [];
    const statusElement = ensureOtpStatusElement(host, options.statusElement);
    const announce = ({ message = '', type = 'status', politeness } = {}) => {
        if (!statusElement) return;
        const desiredPoliteness = politeness || (type === 'error' ? 'assertive' : 'polite');
        statusElement.setAttribute('aria-live', desiredPoliteness);
        statusElement.textContent = message;
    };

    const removeAllClasses = (input) => {
        input.classList.remove('border-primary', 'border-red-500', 'border-green-500');
        if (!input.classList.contains('border-gray-300')) {
            input.classList.add('border-gray-300');
        }
    };

    const focusFirst = () => {
        if (inputs[0] && typeof inputs[0].focus === 'function') {
            inputs[0].focus({ preventScroll: true });
            if (typeof inputs[0].select === 'function') {
                inputs[0].select();
            }
        }
    };

    const commitSequence = (startIndex, digits) => {
        const chars = digits.split('');
        chars.forEach((char, offset) => {
            const input = inputs[startIndex + offset];
            if (!input) return;
            input.value = char;
            removeAllClasses(input);
        });

        const nextIndex = startIndex + chars.length;
        if (inputs[nextIndex]) {
            inputs[nextIndex].focus();
        } else if (typeof options.onComplete === 'function') {
            options.onComplete(getOtpCode(host));
        }
    };

    inputs.forEach((input, index) => {
        input.setAttribute('dir', 'ltr');
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('pattern', '[0-9]*');
        input.setAttribute('autocomplete', 'one-time-code');
        input.type = 'tel';
        input.maxLength = 1;

        let isComposing = false;

        const handleFocus = () => {
            if (typeof input.select === 'function') {
                input.select();
            }
        };

        const handleInput = (event) => {
            if (isComposing) return;
            const target = event.target;
            const normalizedValue = normalizeDigitString(target.value);
            const digits = normalizedValue.replace(/\D+/g, '');

            if (!digits) {
                target.value = '';
                return;
            }

            commitSequence(index, digits.slice(0, inputs.length - index));
        };

        const handleKeydown = (event) => {
            const target = event.target;
            const key = event.key;

            if (key === 'ArrowLeft' && index > 0) {
                event.preventDefault();
                inputs[index - 1].focus();
                return;
            }

            if (key === 'ArrowRight' && index < inputs.length - 1) {
                event.preventDefault();
                inputs[index + 1].focus();
                return;
            }

            if (key === 'Backspace') {
                event.preventDefault();
                if (target.value) {
                    target.value = '';
                } else if (index > 0) {
                    inputs[index - 1].focus();
                    inputs[index - 1].value = '';
                }
                return;
            }

            if (key === 'Delete') {
                event.preventDefault();
                if (target.value) {
                    target.value = '';
                } else if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                    inputs[index + 1].value = '';
                }
                return;
            }

            if (key === 'Enter') {
                return;
            }

            if (key.length > 1) {
                return;
            }

            if (!OTP_DIGIT_PATTERN.test(key)) {
                event.preventDefault();
            }
        };

        const handlePaste = (event) => {
            event.preventDefault();
            const pasteData = event.clipboardData?.getData('text') || '';
            const digits = normalizeDigitString(pasteData).replace(/\D+/g, '');
            if (!digits) return;
            commitSequence(0, digits.slice(0, inputs.length));
        };

        const handleCompositionStart = () => {
            isComposing = true;
        };

        const handleCompositionEnd = (event) => {
            isComposing = false;
            handleInput(event);
        };

        input.addEventListener('focus', handleFocus);
        input.addEventListener('input', handleInput);
        input.addEventListener('keydown', handleKeydown);
        input.addEventListener('paste', handlePaste);
        input.addEventListener('compositionstart', handleCompositionStart);
        input.addEventListener('compositionend', handleCompositionEnd);

        cleanup.push(() => {
            input.removeEventListener('focus', handleFocus);
            input.removeEventListener('input', handleInput);
            input.removeEventListener('keydown', handleKeydown);
            input.removeEventListener('paste', handlePaste);
            input.removeEventListener('compositionstart', handleCompositionStart);
            input.removeEventListener('compositionend', handleCompositionEnd);
        });
    });

    const autoFocusMode = options.autoFocus ?? host.getAttribute('data-auto-focus') ?? 'interaction';

    if (autoFocusMode === 'immediate' || autoFocusMode === true) {
        requestAnimationFrame(focusFirst);
    } else if (autoFocusMode === 'interaction') {
        const activate = () => {
            focusFirst();
        };
        const pointerOptions = { once: true };
        const keyOptions = { once: true };
        host.addEventListener('pointerdown', activate, pointerOptions);
        host.addEventListener('keydown', activate, keyOptions);
        cleanup.push(() => {
            host.removeEventListener('pointerdown', activate, pointerOptions);
            host.removeEventListener('keydown', activate, keyOptions);
        });
    }

    host.setAttribute('role', host.getAttribute('role') || 'group');
    host.setAttribute('data-otp-initialized', 'true');

    const destroy = () => {
        cleanup.forEach(fn => {
            try {
                fn();
            } catch (error) {
                console.error('OTP cleanup error:', error);
            }
        });
        cleanup.length = 0;
        otpStateMap.delete(host);
    };

    const state = {
        inputs,
        focusFirst,
        destroy,
        announce: ({ message, type, politeness }) => announce({ message, type, politeness })
    };

    otpStateMap.set(host, state);

    return state;
}

// تابع برای جمع‌آوری کد از مربع‌ها
function getOtpCode(container) {
    const inputs = $$('.otp-input', container);
    return inputs.map(input => normalizeDigitString(input.value || '').replace(/\D+/g, '')).join('');
}

// تابع برای ریست کردن مربع‌های کد
function resetOtpInputs(container, { message = '' } = {}) {
    const state = otpStateMap.get(container);
    const inputs = state?.inputs || $$('.otp-input', container);
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('border-primary', 'border-red-500', 'border-green-500');
        if (!input.classList.contains('border-gray-300')) {
            input.classList.add('border-gray-300');
        }
    });
    if (state) {
        state.announce({ message, type: 'status', politeness: 'polite' });
        state.focusFirst();
    } else if (inputs[0]) {
        inputs[0].focus();
    }
}

// تابع برای هایلایت کردن مربع‌ها
function highlightOtpInputs(container, options = {}) {
    let config = options;
    if (typeof options === 'boolean') {
        config = { isValid: options };
    }

    const state = otpStateMap.get(container);
    const inputs = state?.inputs || $$('.otp-input', container);
    const isValid = config.isValid !== undefined ? config.isValid : true;

    inputs.forEach(input => {
        input.classList.remove('border-primary', 'border-red-500', 'border-green-500');
        input.classList.add(isValid ? 'border-green-500' : 'border-red-500');
    });

    if (state && config.message) {
        state.announce({
            message: config.message,
            type: isValid ? 'status' : 'error',
            politeness: config.politeness
        });
    }
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
function createSmoothScrollManager(root = document) {
    let handler = null;

    return {
        init() {
            if (handler || !root) return;
            handler = (event) => {
                const link = event.target.closest?.('a[href^="#"]');
                if (!link) return;

                if (link.hasAttribute('data-route-link')) {
                    return;
                }

                const hash = link.getAttribute('href');
                if (!hash || hash.length <= 1) return;

                const target = document.querySelector(hash);
                if (!target) return;

                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            };
            root.addEventListener('click', handler);
        },
        destroy() {
            if (!handler || !root) return;
            root.removeEventListener('click', handler);
            handler = null;
        }
    };
}

// تابع برای lazy loading تصاویر
function createLazyLoadingManager() {
    let observer = null;

    const ensureObserver = () => {
        if (observer) return observer;
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset && img.dataset.src) {
                        img.src = img.dataset.src;
                        delete img.dataset.src;
                    }
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        return observer;
    };

    const observeImages = (root = document) => {
        const activeObserver = ensureObserver();
        if (!root || !root.querySelectorAll) return;
        root.querySelectorAll('img[data-src]').forEach(img => {
            activeObserver.observe(img);
        });
    };

    return {
        init(root = document) {
            observeImages(root);
        },
        refresh(root = document) {
            observeImages(root);
        },
        destroy() {
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        }
    };
}

// تابع برای مدیریت responsive
function createResponsiveHandlersManager() {
    let resizeHandler = null;

    return {
        init() {
            if (resizeHandler) return;
            resizeHandler = () => {
                if (typeof mobileMenu !== 'undefined' && mobileMenu && window.innerWidth >= 1024) {
                    mobileMenu.classList.add('hidden');
                }
            };
            window.addEventListener('resize', resizeHandler);
            resizeHandler();
        },
        destroy() {
            if (!resizeHandler) return;
            window.removeEventListener('resize', resizeHandler);
            resizeHandler = null;
        }
    };
}

// بهبود و انیمیشن آیکون‌ها در سراسر پروژه
function createIconAnimationManager() {
    const interactiveSelector = 'button, a, [role="button"], [data-icon-interactive-parent], .icon-action, .icon-button';
    let observer = null;

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

    return {
        init(root = document) {
            enhanceTree(root || document);
            if (!observer && document.body) {
                observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                            if (!(node instanceof HTMLElement)) return;
                            enhanceTree(node);
                        });
                    });
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }
        },
        refresh(root = document) {
            enhanceTree(root || document);
        },
        destroy() {
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        }
    };
}

function createWishlistButtonManager() {
    const DEFAULT_ACTIVE_TEXT = 'حذف از علاقه‌مندی';
    const DEFAULT_INACTIVE_TEXT = 'افزودن به علاقه‌مندی';
    let mouseenterHandler = null;
    let clickHandler = null;
    let observer = null;

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

    return {
        init(root = document) {
            updateAll(root || document);

            if (!mouseenterHandler) {
                mouseenterHandler = (event) => {
                    const button = event.target.closest?.('.wishlist-button');
                    if (!button) return;
                    updateButtonState(button);
                };
                document.addEventListener('mouseenter', mouseenterHandler, true);
            }

            if (!clickHandler) {
                clickHandler = (event) => {
                    const button = event.target.closest?.('.wishlist-button');
                    if (!button) return;
                    requestAnimationFrame(() => updateButtonState(button));
                    setTimeout(() => updateAll(document), 160);
                };
                document.addEventListener('click', clickHandler);
            }

            if (!observer && document.body) {
                observer = new MutationObserver((mutations) => {
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
                observer.observe(document.body, { childList: true, subtree: true });
            }

            window.refreshWishlistButtons = updateAll;
        },
        refresh(root = document) {
            updateAll(root || document);
        },
        destroy() {
            if (mouseenterHandler) {
                document.removeEventListener('mouseenter', mouseenterHandler, true);
                mouseenterHandler = null;
            }

            if (clickHandler) {
                document.removeEventListener('click', clickHandler);
                clickHandler = null;
            }

            if (observer) {
                observer.disconnect();
                observer = null;
            }

            if (window.refreshWishlistButtons === updateAll) {
                delete window.refreshWishlistButtons;
            }
        }
    };
}

const autoClearManager = createAutoClearInputManager();
const blurValidationManager = createBlurValidationManager();
const smoothScrollManager = createSmoothScrollManager();
const lazyLoadingManager = createLazyLoadingManager();
const responsiveHandlersManager = createResponsiveHandlersManager();
const wishlistButtonManager = createWishlistButtonManager();
const iconAnimationManager = createIconAnimationManager();

registerEnhancementModule(autoClearManager);
registerEnhancementModule(blurValidationManager);
registerEnhancementModule(smoothScrollManager);
registerEnhancementModule(lazyLoadingManager);
registerEnhancementModule(responsiveHandlersManager);
registerEnhancementModule(wishlistButtonManager);
registerEnhancementModule(iconAnimationManager);

function setupAutoClearInputs(root) {
    autoClearManager.init(root || document);
}

function setupInputValidation(root) {
    blurValidationManager.init(root || document);
}

function setupSmoothScroll(root) {
    smoothScrollManager.init(root || document);
}

function setupLazyLoading(root) {
    lazyLoadingManager.init(root || document);
}

function setupResponsiveHandlers() {
    responsiveHandlersManager.init();
}

function setupWishlistButtonInteractions(root) {
    wishlistButtonManager.init(root || document);
}

function setupIconAnimations(root) {
    iconAnimationManager.init(root || document);
}

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