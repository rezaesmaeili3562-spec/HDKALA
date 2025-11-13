(function (global) {
    'use strict';

    const ensureString = (value) => (value == null ? '' : String(value));

    const validators = {
        validatePhone: (phone) => /^09[0-9]{9}$/.test(ensureString(phone)),
        validatePostalCode: (code) => /^[0-9]{10}$/.test(ensureString(code)),
        validateNationalCode: (code) => {
            const nationalCode = ensureString(code);
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
        },
        validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ensureString(email)),
        validatePassword: (password) => ensureString(password).length >= 6,
        validatePersianText: (text) => /^[\u0600-\u06FF\s]+$/.test(ensureString(text)),
        validateNumber: (input) => /^\d+$/.test(ensureString(input)),
        validatePrice: (price) => {
            const numeric = ensureString(price);
            return /^\d+$/.test(numeric) && parseInt(numeric, 10) > 0;
        },
        validateStock: (stock) => {
            const numeric = ensureString(stock);
            return /^\d+$/.test(numeric) && parseInt(numeric, 10) >= 0;
        },
        validateDiscount: (discount) => {
            const numeric = ensureString(discount);
            if (!/^\d+$/.test(numeric)) {
                return false;
            }
            const value = parseInt(numeric, 10);
            return value >= 0 && value <= 100;
        }
    };

    const exposeGlobally = (name, fn) => {
        if (typeof global[name] !== 'function') {
            global[name] = fn;
        }
    };

    Object.entries(validators).forEach(([name, fn]) => {
        exposeGlobally(name, fn);
    });

    global.Validators = Object.freeze({
        validatePhone: validators.validatePhone,
        validatePostalCode: validators.validatePostalCode,
        validateNationalCode: validators.validateNationalCode,
        validateEmail: validators.validateEmail,
        validatePassword: validators.validatePassword,
        validatePersianText: validators.validatePersianText,
        validateNumber: validators.validateNumber,
        validatePrice: validators.validatePrice,
        validateStock: validators.validateStock,
        validateDiscount: validators.validateDiscount
    });
})(typeof window !== 'undefined' ? window : globalThis);
