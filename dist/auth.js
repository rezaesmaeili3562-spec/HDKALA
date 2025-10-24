/* ---------- User Dropdown ---------- */
function updateUserDropdown() {
    if (user) {
        userDropdownContent.innerHTML = `
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <div class="font-medium text-primary">${user.name}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">${user.phone}</div>
            </div>
            <a href="#profile" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">پروفایل من</a>
            <a href="#orders" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">سفارش‌های من</a>
            <a href="#wishlist" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">لیست علاقه‌مندی‌ها</a>
            <a href="#addresses" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">آدرس‌های من</a>
            <button id="logoutBtn" class="w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors">خروج</button>
        `;
    } else {
        userDropdownContent.innerHTML = `
            <button id="loginBtn" class="w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">ورود / ثبت‌نام</button>
        `;
    }
}

/* ---------- Authentication System ---------- */
function renderLoginPage(initialMode = 'login') {
    let currentMode = initialMode;

    const page = document.createElement('div');
    page.className = 'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8';
    page.innerHTML = `
        <div class="max-w-lg w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-primary/30">
            <div class="space-y-4">
                <div class="flex justify-center">
                    <a href="#home" class="text-2xl font-extrabold text-primary flex items-center gap-2">
                        <iconify-icon icon="mdi:cart" width="26"></iconify-icon>
                        HDKALA
                    </a>
                </div>
                <div class="text-center space-y-2">
                    <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">ورود یا ثبت‌نام</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">با شماره تماس خود وارد شوید یا حساب جدید بسازید</p>
                </div>
                <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/40 p-1 rounded-xl" role="tablist">
                    <button type="button" data-mode="login" class="auth-tab flex-1 py-2 rounded-lg font-medium transition-colors">
                        ورود کاربران
                    </button>
                    <button type="button" data-mode="signup" class="auth-tab flex-1 py-2 rounded-lg font-medium transition-colors">
                        ثبت‌نام سریع
                    </button>
                </div>
            </div>

            <form class="space-y-5" id="authForm" novalidate>
                <div>
                    <label for="authPhone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">شماره تماس <span class="text-red-500">*</span></label>
                    <input id="authPhone" type="tel" required pattern="09[0-9]{9}" maxlength="11"
                           class="w-full px-3 py-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                           placeholder="09xxxxxxxxx">
                    <div id="phoneError" class="text-red-500 text-xs mt-1 hidden">شماره تلفن باید با 09 شروع شده و 11 رقمی باشد</div>
                </div>

                <div>
                    <label for="authEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ایمیل (اختیاری)</label>
                    <input id="authEmail" type="email" class="w-full px-3 py-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="example@email.com">
                </div>

                <div id="passwordGroup" class="space-y-1">
                    <label for="authPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">رمز عبور (اختیاری)</label>
                    <input id="authPassword" type="password" class="w-full px-3 py-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="••••••">
                    <p class="text-xs text-gray-500 dark:text-gray-400">در صورت نداشتن رمز عبور، از ورود با کد تأیید استفاده کنید.</p>
                </div>

                <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                    دریافت کد تأیید
                </button>
            </form>

            <div id="authHint" class="text-center text-xs text-gray-500 dark:text-gray-400">
                حساب کاربری ندارید؟ شماره خود را وارد کنید تا ثبت‌نام انجام شود.
            </div>
        </div>
    `;

    contentRoot.innerHTML = '';
    contentRoot.appendChild(page);

    const tabs = $$('.auth-tab', page);
    const passwordGroup = $('#passwordGroup', page);
    const phoneInput = $('#authPhone', page);
    const emailInput = $('#authEmail', page);
    const passwordInput = $('#authPassword', page);
    const phoneError = $('#phoneError', page);
    const authHint = $('#authHint', page);

    function updateTabStyles() {
        tabs.forEach(tab => {
            const isActive = tab.getAttribute('data-mode') === currentMode;
            tab.classList.toggle('bg-primary', isActive);
            tab.classList.toggle('text-white', isActive);
            tab.classList.toggle('shadow-md', isActive);
            tab.classList.toggle('bg-white', !isActive);
            tab.classList.toggle('dark:bg-gray-800', !isActive);
            tab.classList.toggle('text-gray-600', !isActive);
            tab.classList.toggle('dark:text-gray-300', !isActive);
            tab.classList.toggle('hover:bg-gray-100', !isActive);
            tab.classList.toggle('dark:hover:bg-gray-700', !isActive);
        });

        if (currentMode === 'login') {
            passwordGroup.classList.remove('hidden');
            authHint.textContent = 'اگر رمز عبور ندارید، کد تأیید برای ورود ارسال می‌شود.';
        } else {
            passwordGroup.classList.add('hidden');
            passwordInput.value = '';
            authHint.textContent = 'با وارد کردن شماره تماس، کد تأیید برای ثبت‌نام ارسال خواهد شد.';
        }
    }

    updateTabStyles();

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            currentMode = tab.getAttribute('data-mode');
            updateTabStyles();
        });
    });

    phoneInput.addEventListener('input', () => {
        phoneError.classList.add('hidden');
    });

    $('#authForm', page).addEventListener('submit', (e) => {
        e.preventDefault();

        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!validatePhone(phone)) {
            phoneError.classList.remove('hidden');
            return;
        }

        phoneError.classList.add('hidden');

        if (currentMode === 'login' && password) {
            const existingUser = LS.get('HDK_user');
            if (existingUser && (existingUser.phone === phone || (email && existingUser.email === email))) {
                if (!existingUser.password) {
                    notify('برای این حساب رمز عبوری ثبت نشده است. از ورود با کد استفاده کنید.', true);
                    return;
                }
                if (existingUser.password !== password) {
                    notify('رمز عبور وارد شده نادرست است', true);
                    return;
                }

                user = { ...existingUser };
                if (email && email !== existingUser.email) {
                    user.email = email;
                }
                LS.set('HDK_user', user);
                updateUserLabel();
                notify('با موفقیت وارد شدید!');
                navigate('home');
                return;
            }

            notify('حسابی با این مشخصات یافت نشد. لطفا ثبت‌نام کنید.', true);
            return;
        }

        renderVerifyPage({ phone, mode: currentMode, email });
    });

    phoneInput.focus();
}

function renderVerifyPage({ phone, mode = 'login', email = '' }) {
    const operator = getOperatorLogo(phone);
    const operatorLogos = {
        'irancell': '<iconify-icon icon="mdi:signal" class="text-blue-500"></iconify-icon>',
        'mci': '<iconify-icon icon="mdi:sim" class="text-green-500"></iconify-icon>',
        'rightel': '<iconify-icon icon="mdi:wifi" class="text-red-500"></iconify-icon>',
        'unknown': '<iconify-icon icon="mdi:phone" class="text-gray-500"></iconify-icon>'
    };
    
    const page = document.createElement('div');
    page.className = 'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8';
    const isSignup = mode === 'signup';

    page.innerHTML = `
        <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-primary/30">
            <div>
                <div class="flex justify-center">
                    <a href="#home" class="text-2xl font-extrabold text-primary flex items-center gap-2">
                        <iconify-icon icon="mdi:cart" width="26"></iconify-icon>
                        HDKALA
                    </a>
                </div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    ${isSignup ? 'تأیید شماره برای ثبت‌نام' : 'تأیید شماره تلفن'}
                </h2>
                <div class="flex items-center justify-center gap-2 mt-2">
                    ${operatorLogos[operator]}
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        کد ۴ رقمی ارسال شده به ${phone} را وارد کنید
                    </p>
                </div>
            </div>
            <form class="mt-8 space-y-6" id="verifyForm">
                <div class="flex justify-center gap-2" dir="ltr">
                    ${[0,1,2,3].map(i => `
                        <input type="tel"
                               maxlength="1"
                               class="otp-input w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors text-gray-900 dark:text-white"
                               dir="ltr"
                               inputmode="numeric"
                               pattern="[0-9]"
                               autocomplete="one-time-code">
                    `).join('')}
                </div>
                <div>
                    <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                        تأیید و ورود
                    </button>
                </div>
            </form>
            <div class="text-center">
                <button type="button" id="backToLogin" class="text-sm text-primary hover:text-primary/80 transition-colors">
                    تغییر شماره تلفن
                </button>
            </div>
        </div>
    `;
    contentRoot.innerHTML = '';
    contentRoot.appendChild(page);
    
    // Setup OTP inputs
    setupOtpInputs(page);
    
    $('#verifyForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const code = getOtpCode(page);

        if (code.length !== 4) {
            highlightOtpInputs(page, false);
            notify('کد تأیید باید ۴ رقم باشد', true);
            return;
        }

        highlightOtpInputs(page, true);

        // Check if user exists (login) or new (signup)
        const existingUser = LS.get('HDK_user');
        if (mode === 'login') {
            if (existingUser && (existingUser.phone === phone || (email && existingUser.email === email))) {
                user = { ...existingUser };
                if (email && email !== existingUser.email) {
                    user.email = email;
                }
                LS.set('HDK_user', user);
                updateUserLabel();
                notify('با موفقیت وارد شدید!');
                navigate('home');
            } else {
                notify('حسابی با این شماره یافت نشد. لطفا ثبت‌نام کنید.', true);
                renderLoginPage('signup');
            }
        } else {
            renderUserInfoForm({ phone, email });
        }
    });

    $('#backToLogin').addEventListener('click', () => renderLoginPage(mode));
}

function renderUserInfoForm({ phone, email = '' }) {
    const page = document.createElement('div');
    page.className = 'min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8';
    page.innerHTML = `
        <div class="max-w-2xl mx-auto">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-primary/30 p-8">
                <div class="flex justify-center mb-6">
                    <a href="#home" class="text-2xl font-extrabold text-primary flex items-center gap-2">
                        <iconify-icon icon="mdi:cart" width="26"></iconify-icon>
                        HDKALA
                    </a>
                </div>
                <h2 class="text-2xl font-bold text-center mb-6">تکمیل اطلاعات کاربری</h2>
                <p class="text-gray-600 dark:text-gray-400 text-center mb-6">
                    لطفا اطلاعات خود را برای تکمیل ثبت‌نام وارد کنید
                </p>

                <form class="space-y-6" id="userInfoForm" novalidate>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="firstName" class="block text-sm font-medium mb-2">نام <span class="text-red-500">*</span></label>
                            <input id="firstName" type="text" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                        </div>
                        <div>
                            <label for="lastName" class="block text-sm font-medium mb-2">نام خانوادگی <span class="text-red-500">*</span></label>
                            <input id="lastName" type="text" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                        </div>
                    </div>

                    <div>
                        <label for="nationalCode" class="block text-sm font-medium mb-2">کد ملی <span class="text-red-500">*</span></label>
                        <input id="nationalCode" type="text" data-national required
                               class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                               maxlength="10"
                               pattern="[0-9]{10}">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2" for="provinceSelect">استان محل سکونت <span class="text-red-500">*</span></label>
                            <select id="provinceSelect" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                                <option value="">انتخاب استان</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2" for="citySelect">شهر محل سکونت <span class="text-red-500">*</span></label>
                            <select id="citySelect" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" disabled>
                                <option value="">ابتدا استان را انتخاب کنید</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label for="addressText" class="block text-sm font-medium mb-2">آدرس دقیق <span class="text-red-500">*</span></label>
                        <textarea id="addressText" required rows="3" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"></textarea>
                    </div>

                    <div>
                        <label for="postalCode" class="block text-sm font-medium mb-2">کد پستی (اختیاری)</label>
                        <input id="postalCode" type="text" data-postal
                               class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                               maxlength="10"
                               pattern="[0-9]{10}">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="birthDate" class="block text-sm font-medium mb-2">تاریخ تولد</label>
                            <input id="birthDate" type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" placeholder="۱۳۷۰/۰۱/۰۱">
                        </div>
                        <div>
                            <label for="fatherName" class="block text-sm font-medium mb-2">نام پدر</label>
                            <input id="fatherName" type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                        </div>
                    </div>

                    <div>
                        <label for="userEmail" class="block text-sm font-medium mb-2">ایمیل (اختیاری)</label>
                        <input id="userEmail" type="email" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" value="${email || ''}">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="userPassword" class="block text-sm font-medium mb-2">رمز عبور (اختیاری)</label>
                            <input id="userPassword" type="password" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" placeholder="حداقل ۴ کاراکتر">
                        </div>
                        <div>
                            <label for="userPasswordConfirm" class="block text-sm font-medium mb-2">تکرار رمز عبور</label>
                            <input id="userPasswordConfirm" type="password" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" placeholder="تکرار رمز">
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <button type="button" id="backToVerify" class="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors">
                            بازگشت
                        </button>
                        <button type="submit" class="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors">
                            تکمیل ثبت‌نام
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    contentRoot.innerHTML = '';
    contentRoot.appendChild(page);

    loadProvinces();

    $('#provinceSelect').addEventListener('change', function() {
        const province = this.value;
        loadCities(province);
    });

    $('#userInfoForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const nationalCode = $('#nationalCode').value.trim();
        if (!validateNationalCode(nationalCode)) {
            notify('کد ملی نامعتبر است', true);
            return;
        }

        const postalCode = $('#postalCode').value.trim();
        if (postalCode && !validatePostalCode(postalCode)) {
            notify('کد پستی باید 10 رقمی باشد', true);
            return;
        }

        const passwordValue = $('#userPassword').value.trim();
        const passwordConfirm = $('#userPasswordConfirm').value.trim();
        if (passwordValue && passwordValue.length < 4) {
            notify('رمز عبور باید حداقل ۴ کاراکتر باشد', true);
            return;
        }
        if (passwordValue && passwordValue !== passwordConfirm) {
            notify('تکرار رمز عبور با رمز اصلی یکسان نیست', true);
            return;
        }

        const firstName = $('#firstName').value.trim();
        const lastName = $('#lastName').value.trim();
        const provinceValue = $('#provinceSelect').value;
        const cityValue = $('#citySelect').value;
        const addressValue = $('#addressText').value.trim();
        const emailValue = $('#userEmail').value.trim();
        const birthDate = $('#birthDate').value.trim();
        const fatherName = $('#fatherName').value.trim();

        user = {
            id: uid('u'),
            name: `${firstName} ${lastName}`.trim(),
            firstName,
            lastName,
            phone,
            nationalCode,
            province: provinceValue,
            city: cityValue,
            address: addressValue,
            postalCode: postalCode || null,
            birthDate,
            fatherName,
            email: emailValue,
            password: passwordValue || null,
            created: new Date().toISOString()
        };

        LS.set('HDK_user', user);
        updateUserLabel();
        notify('ثبت‌نام با موفقیت انجام شد!');
        navigate('home');
    });

    $('#backToVerify').addEventListener('click', () => {
        const currentEmail = $('#userEmail').value.trim();
        renderVerifyPage({ phone, mode: 'signup', email: currentEmail || email });
    });
}

function loadProvinces() {
    const provinceSelect = $('#provinceSelect');
    if (!provinceSelect) return;

    provinceSelect.innerHTML = '<option value="">انتخاب استان</option>';

    provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province.name;
        option.textContent = province.name;
        provinceSelect.appendChild(option);
    });
}

function loadCities(provinceName) {
    const citySelect = $('#citySelect');
    if (!citySelect) return;
    
    citySelect.innerHTML = '<option value="">انتخاب شهر</option>';
    citySelect.disabled = true;
    
    const province = provinces.find(p => p.name === provinceName);
    if (province) {
        province.cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
        citySelect.disabled = false;
    }
}

// User dropdown event listeners
userButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (user) {
        userDropdown.classList.toggle('open');
    } else {
        location.hash = 'login';
    }
});

document.addEventListener('click', () => {
    userDropdown.classList.remove('open');
});

// User Dropdown Delegation
document.addEventListener('click', (e) => {
    if (e.target.id === 'loginBtn' || e.target.closest('#loginBtn')) {
        location.hash = 'login';
    }
    if (e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn')) {
        if (confirm('آیا از خروج مطمئن هستید؟')) {
            LS.set('HDK_user', null);
            user = null;
            updateUserLabel();
            notify('خروج انجام شد');
            location.hash = 'home';
        }
    }
});