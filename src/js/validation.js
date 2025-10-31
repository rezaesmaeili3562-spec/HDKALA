/* ---------- Validation Functions ---------- */
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

function validatePassword(password) {
    return password.length >= 6;
}

function validatePersianText(text) {
    const persianRegex = /^[\u0600-\u06FF\s]+$/;
    return persianRegex.test(text);
}

function validateNumber(input) {
    return /^\d+$/.test(input);
}

function validatePrice(price) {
    return /^\d+$/.test(price) && parseInt(price) > 0;
}

function validateStock(stock) {
    return /^\d+$/.test(stock) && parseInt(stock) >= 0;
}

function validateDiscount(discount) {
    return /^\d+$/.test(discount) && parseInt(discount) >= 0 && parseInt(discount) <= 100;
}

// اعتبارسنجی فیلدهای فرم
function validateForm(formData) {
    const errors = [];
    
    if (formData.phone && !validatePhone(formData.phone)) {
        errors.push('شماره تلفن معتبر نیست');
    }
    
    if (formData.nationalCode && !validateNationalCode(formData.nationalCode)) {
        errors.push('کد ملی معتبر نیست');
    }
    
    if (formData.postalCode && !validatePostalCode(formData.postalCode)) {
        errors.push('کد پستی معتبر نیست');
    }
    
    if (formData.email && !validateEmail(formData.email)) {
        errors.push('ایمیل معتبر نیست');
    }
    
    return errors;
}

// نمایش خطاهای اعتبارسنجی
function showValidationErrors(errors, container) {
    if (!container) return;
    
    container.innerHTML = '';
    if (errors.length === 0) return;
    
    const errorList = document.createElement('div');
    errorList.className = 'bg-red-50 border border-red-200 rounded-lg p-4 mb-4';
    errorList.innerHTML = `
        <div class="flex items-center gap-2 text-red-700 mb-2">
            <iconify-icon icon="mdi:alert-circle"></iconify-icon>
            <span class="font-medium">لطفا خطاهای زیر را修正 کنید:</span>
        </div>
        <ul class="list-disc list-inside text-red-600 text-sm space-y-1">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    container.appendChild(errorList);
}

// اعتبارسنجی real-time
function setupRealTimeValidation() {
    const handler = (e) => {
        const input = e.target;

        if (!(input instanceof HTMLInputElement)) return;

        if (input.type === 'tel' && input.hasAttribute('data-phone')) {
            validatePhoneField(input);
        }

        if (input.hasAttribute('data-national')) {
            validateNationalCodeField(input);
        }

        if (input.hasAttribute('data-postal')) {
            validatePostalCodeField(input);
        }

        if (input.type === 'email') {
            validateEmailField(input);
        }
    };

    document.addEventListener('input', handler);
    return () => document.removeEventListener('input', handler);
}

function validatePhoneField(input) {
    const isValid = !input.value || validatePhone(input.value);
    updateFieldValidationState(input, isValid, 'شماره تلفن معتبر نیست');
}

function validateNationalCodeField(input) {
    const isValid = !input.value || validateNationalCode(input.value);
    updateFieldValidationState(input, isValid, 'کد ملی معتبر نیست');
}

function validatePostalCodeField(input) {
    const isValid = !input.value || validatePostalCode(input.value);
    updateFieldValidationState(input, isValid, 'کد پستی معتبر نیست');
}

function validateEmailField(input) {
    const isValid = !input.value || validateEmail(input.value);
    updateFieldValidationState(input, isValid, 'ایمیل معتبر نیست');
}

function updateFieldValidationState(input, isValid, errorMessage) {
    const errorElement = input.parentNode.querySelector('.field-error');
    
    if (isValid) {
        input.classList.remove('border-red-500');
        input.classList.add('border-green-500');
        if (errorElement) {
            errorElement.remove();
        }
    } else {
        input.classList.remove('border-green-500');
        input.classList.add('border-red-500');
        if (!errorElement) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error text-red-500 text-xs mt-1';
            errorDiv.textContent = errorMessage;
            input.parentNode.appendChild(errorDiv);
        }
    }
}

// اعتبارسنجی فیلدهای عددی در پنل ادمین
function setupAdminInputValidation() {
    const handler = (e) => {
        const target = e.target;
        if (!(target instanceof HTMLInputElement)) return;
        if (target.matches('#productPrice, #productDiscount, #productStock')) {
            validateAdminNumberField(target);
        }
    };

    document.addEventListener('input', handler);
    return () => document.removeEventListener('input', handler);
}

function validateAdminNumberField(input) {
    let value = input.value;
    
    // حذف کاراکترهای غیر عددی
    value = value.replace(/[^\d]/g, '');
    
    // اعتبارسنجی بر اساس نوع فیلد
    let isValid = true;
    let errorMessage = '';
    
    switch(input.id) {
        case 'productPrice':
            isValid = validatePrice(value);
            errorMessage = 'قیمت باید عددی و بزرگتر از صفر باشد';
            break;
        case 'productStock':
            isValid = validateStock(value);
            errorMessage = 'موجودی باید عددی و بزرگتر یا مساوی صفر باشد';
            break;
        case 'productDiscount':
            isValid = validateDiscount(value);
            errorMessage = 'تخفیف باید بین 0 تا 100 باشد';
            break;
    }
    
    if (!isValid && value) {
        input.classList.add('border-red-500');
        notify(errorMessage, 'error');
    } else {
        input.classList.remove('border-red-500');
    }
    
    input.value = value;
}

const validationEnhancement = (() => {
    let cleanups = [];

    return {
        init() {
            if (cleanups.length > 0) return;
            cleanups = [
                setupRealTimeValidation(),
                setupAdminInputValidation()
            ].filter(Boolean);
        },
        destroy() {
            cleanups.forEach(fn => {
                try {
                    fn?.();
                } catch (error) {
                    console.error('Validation cleanup error:', error);
                }
            });
            cleanups = [];
        }
    };
})();

(function registerValidationEnhancement() {
    if (typeof window === 'undefined') return;
    const registry = window.HDKEnhancements;
    if (registry && typeof registry.register === 'function') {
        registry.register(validationEnhancement);
        return;
    }

    window.__HDK_PENDING_ENHANCEMENTS__ = window.__HDK_PENDING_ENHANCEMENTS__ || [];
    window.__HDK_PENDING_ENHANCEMENTS__.push(validationEnhancement);
})();