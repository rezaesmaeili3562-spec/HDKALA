(function (global) {
    'use strict';

    const validators = global.Validators || {};

    const getValidator = (name, fallback) => {
        if (typeof validators[name] === 'function') {
            return validators[name];
        }
        if (typeof global[name] === 'function') {
            return global[name];
        }
        return fallback;
    };

    const validatePhone = getValidator('validatePhone', (phone) => /^09[0-9]{9}$/.test(String(phone || '')));
    const validatePostalCode = getValidator('validatePostalCode', (code) => /^[0-9]{10}$/.test(String(code || '')));
    const validateNationalCode = getValidator('validateNationalCode', (code) => {
        const nationalCode = String(code || '');
        if (!/^\d{10}$/.test(nationalCode)) {
            return false;
        }

        const checkDigit = parseInt(nationalCode[9], 10);
        let sum = 0;
        for (let i = 0; i < 9; i += 1) {
            sum += parseInt(nationalCode[i], 10) * (10 - i);
        }
        sum %= 11;
        return (sum < 2 && checkDigit === sum) || (sum >= 2 && checkDigit === 11 - sum);
    });
    const validateEmail = getValidator('validateEmail', (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '')));

    const setupAutoClearInputs = () => {
        document.addEventListener('focus', (event) => {
            const { target } = event;
            if (!(target instanceof HTMLInputElement)) {
                return;
            }

            if (['number', 'text'].includes(target.type) && ['0', '00'].includes(target.value)) {
                target.value = '';
            }
        }, true);
    };

    const setupInputValidation = () => {
        document.addEventListener('blur', (event) => {
            const input = event.target;
            if (!(input instanceof HTMLInputElement)) {
                return;
            }

            const showError = (message) => {
                if (typeof global.notify === 'function') {
                    global.notify(message, true);
                }
            };

            if (input.type === 'tel' && input.hasAttribute('data-phone')) {
                if (input.value && !validatePhone(input.value)) {
                    input.classList.add('border-red-500');
                    showError('شماره تلفن باید با 09 شروع شده و 11 رقمی باشد');
                } else {
                    input.classList.remove('border-red-500');
                }
            }

            if (input.hasAttribute('data-postal')) {
                if (input.value && !validatePostalCode(input.value)) {
                    input.classList.add('border-red-500');
                    showError('کد پستی باید 10 رقمی باشد');
                } else {
                    input.classList.remove('border-red-500');
                }
            }

            if (input.hasAttribute('data-national')) {
                if (input.value && !validateNationalCode(input.value)) {
                    input.classList.add('border-red-500');
                    showError('کد ملی نامعتبر است');
                } else {
                    input.classList.remove('border-red-500');
                }
            }

            if (input.type === 'email' && input.value) {
                if (!validateEmail(input.value)) {
                    input.classList.add('border-red-500');
                    showError('ایمیل وارد شده معتبر نیست');
                } else {
                    input.classList.remove('border-red-500');
                }
            }
        }, true);
    };

    const setupSmoothScroll = () => {
        document.addEventListener('click', (event) => {
            const anchor = event.target instanceof HTMLElement
                ? event.target.closest('a[href^="#"]')
                : null;

            if (!anchor) {
                return;
            }

            const targetId = anchor.getAttribute('href');
            if (!targetId) {
                return;
            }

            const target = global.document && global.document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    };

    const setupLazyLoading = () => {
        if (typeof global.IntersectionObserver !== 'function') {
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const img = entry.target;
                if (img instanceof HTMLImageElement && img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        const images = global.document ? global.document.querySelectorAll('img[data-src]') : [];
        images.forEach((img) => observer.observe(img));
    };

    const setupResponsiveHandlers = () => {
        const handleResize = () => {
            if (global.window && global.window.innerWidth >= 1024 && typeof global.mobileMenu !== 'undefined') {
                if (global.mobileMenu && typeof global.mobileMenu.classList !== 'undefined') {
                    global.mobileMenu.classList.add('hidden');
                }
            }
        };

        global.window?.addEventListener('resize', handleResize);
    };

    const FormBehaviors = {
        setupAutoClearInputs,
        setupInputValidation,
        setupSmoothScroll,
        setupLazyLoading,
        setupResponsiveHandlers,
        init() {
            setupAutoClearInputs();
            setupInputValidation();
            setupSmoothScroll();
            setupLazyLoading();
            setupResponsiveHandlers();
        }
    };

    global.FormBehaviors = FormBehaviors;
})(typeof window !== 'undefined' ? window : globalThis);
