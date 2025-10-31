/* ---------- User Dropdown ---------- */
function updateUserDropdown() {
    if (!userDropdownContent) return;

    const adminSession = typeof getAdminSession === 'function' ? getAdminSession() : null;
    if (adminSession && adminSession.isAuthenticated) {
        const info = adminSession.info || {};
        const name = (info.fullName && info.fullName.trim()) ? info.fullName : 'ادمین سیستم';
        const phone = info.phone || '---';
        const email = info.email || '---';
        const isAdminView = typeof document !== 'undefined' && document.body ? document.body.classList.contains('admin-mode') : false;

        const adminTools = isAdminView ? `
            <a href="#admin" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" data-admin-action="dashboard">پنل مدیریت</a>
            <button class="w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" data-admin-action="reports">گزارش‌های فروش</button>
            <button class="w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" data-admin-action="inventory">بررسی موجودی انبار</button>
            <button class="w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" data-admin-action="users">مدیریت کاربران</button>
            <button class="w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" data-admin-action="support">درخواست پشتیبانی</button>
        ` : `
            <p class="px-4 pt-2 pb-3 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                برای مشاهده ابزارهای مدیریتی وارد پنل مدیریت شوید.
            </p>
            <a href="#admin" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" data-admin-action="dashboard">ورود به پنل مدیریت</a>
        `;

        userDropdownContent.innerHTML = `
            <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div class="font-semibold text-primary">${name}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${phone}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">${email}</div>
            </div>
            ${adminTools}
            <button id="adminLogoutBtn" class="w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors">خروج مدیر</button>
        `;
        return;
    }

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
            <a href="#cart" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">سبد خرید من</a>
            <a href="#compare" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">مقایسه‌های من</a>
            <a href="#admin" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">ورود به پنل مدیریت</a>
            <button id="logoutBtn" class="w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors">خروج</button>
        `;
    } else {
        userDropdownContent.innerHTML = `
            <div class="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">برای دسترسی کامل، ابتدا وارد شوید یا ثبت‌نام کنید.</div>
            <button id="loginBtn" class="w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-blue-600">ورود</button>
            <button id="dropdownSignupBtn" class="w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-green-600">ثبت‌نام</button>
        `;
    }
}

/* ---------- Authentication System ---------- */
function renderLoginPage() {
    const page = document.createElement('div');
    page.className = 'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8';
    page.innerHTML = `
        <div class="max-w-2xl w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl border border-primary/30">
            <div class="flex flex-col gap-6">
                <div class="flex justify-center">
                    <a href="#home" class="text-2xl font-extrabold text-primary flex items-center gap-2">
                        <iconify-icon icon="mdi:cart" width="26"></iconify-icon>
                        HDKALA
                    </a>
                </div>
                <div class="text-center space-y-2">
                    <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">ورود به حساب کاربری</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">ابتدا شماره تماس خود را وارد کنید تا کد تأیید برایتان ارسال شود.</p>
                </div>
            </div>
            <form class="space-y-6" id="loginForm">
                <div class="relative">
                    <label for="phone" class="sr-only">شماره تلفن</label>
                    <input id="phone" name="phone" type="tel" required
                           class="relative block w-full px-3 py-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-left"
                           placeholder="09xxxxxxxxx"
                           pattern="09[0-9]{9}"
                           maxlength="11">
                    <div id="phoneError" class="text-red-500 text-xs mt-1 hidden">شماره تلفن باید با 09 شروع شده و 11 رقمی باشد</div>
                </div>
                <div>
                    <button type="submit" class="w-full py-2.5 px-4 rounded-lg text-white font-medium bg-primary hover:bg-primary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40">
                        دریافت کد تأیید
                    </button>
                </div>
            </form>
            <p class="text-center text-sm text-gray-500 dark:text-gray-400">
                حساب کاربری ندارید؟
                <a href="#signup" class="text-primary font-semibold hover:text-primary/80 transition-colors">ثبت‌نام کنید</a>
            </p>
            <div class="grid gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div class="flex items-center gap-2 justify-center text-blue-600 dark:text-blue-400">
                    <iconify-icon icon="mdi:shield-check" width="20"></iconify-icon>
                    <span>ورود تنها با شماره تماس و کد یک‌بار مصرف</span>
                </div>
                <div class="flex items-center gap-2 justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                        <path d="M15 14c2.761 0 5 2.239 5 5"/>
                        <path d="M4 19c0-2.761 2.239-5 5-5"/>
                        <circle cx="9" cy="8" r="4"/>
                        <path d="M19 11v6"/>
                        <path d="M16 14h6"/>
                    </svg>
                    <span>برای ایجاد حساب جدید روی گزینه ثبت‌نام کلیک کنید</span>
                </div>
            </div>
        </div>
    `;
    contentRoot.innerHTML = '';
    contentRoot.appendChild(page);

    $('#loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const phone = $('#phone').value.trim();
        const phoneError = $('#phoneError');

        if (!validatePhone(phone)) {
            phoneError.classList.remove('hidden');
            return;
        }

        phoneError.classList.add('hidden');
        if (phone) {
            renderVerifyPage(phone);
        }
    });
}

function renderVerifyPage(phone) {
    const operator = getOperatorLogo(phone);
    const operatorLogos = {
        'irancell': '<iconify-icon icon="mdi:signal" class="text-blue-500"></iconify-icon>',
        'mci': '<iconify-icon icon="mdi:sim" class="text-green-500"></iconify-icon>',
        'rightel': '<iconify-icon icon="mdi:wifi" class="text-red-500"></iconify-icon>',
        'unknown': '<iconify-icon icon="mdi:phone" class="text-gray-500"></iconify-icon>'
    };
    
    const page = document.createElement('div');
    page.className = 'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8';
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
                    تأیید شماره تلفن
                </h2>
                <div class="flex items-center justify-center gap-2 mt-2">
                    ${operatorLogos[operator]}
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        کد ۴ رقمی ارسال شده به ${phone} را وارد کنید
                    </p>
                </div>
                <p class="mt-2 text-center text-xs text-primary bg-primary/10 p-2 rounded-lg">
                    💡 در این نسخه آزمایشی، کد <strong>0315</strong> را وارد کنید
                </p>
            </div>
            <form class="mt-8 space-y-6" id="verifyForm">
                <div class="flex justify-center gap-2">
                    ${[0,1,2,3].map(i => `
                        <input type="text" 
                               maxlength="1" 
                               class="otp-input w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
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
        if (code === '0315') {
            // Check if user exists (login) or new (signup)
            const existingUser = LS.get('HDK_user');
            if (existingUser && existingUser.phone === phone) {
                // Login
                user = existingUser;
                LS.set('HDK_user', user);
                updateUserLabel();
                notify('با موفقیت وارد شدید!');
                navigate('home');
            } else {
                notify('حسابی با این شماره پیدا نشد. لطفا ثبت‌نام را تکمیل کنید.', true);
                setTimeout(() => {
                    renderSignupPage(phone, { fromLogin: true });
                }, 600);
            }
        } else {
            notify('کد تأیید نادرست است. لطفا کد 0315 را وارد کنید.', true);
            resetOtpInputs(page);
        }
    });
    
    $('#backToLogin').addEventListener('click', renderLoginPage);
}

function renderSignupPage(phone = '', options = {}) {
    const fromLogin = !!options.fromLogin;
    const page = document.createElement('div');
    page.className = 'min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8';
    page.innerHTML = `
        <div class="max-w-3xl mx-auto">
            <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-primary/30 p-8">
                <div class="flex justify-center mb-6">
                    <a href="#home" class="text-2xl font-extrabold text-primary flex items-center gap-2">
                        <iconify-icon icon="mdi:cart" width="26"></iconify-icon>
                        HDKALA
                    </a>
                </div>
                <h2 class="text-2xl font-bold text-center mb-3">${fromLogin ? 'تکمیل ثبت‌نام' : 'ایجاد حساب کاربری جدید'}</h2>
                <p class="text-gray-600 dark:text-gray-400 text-center mb-6">
                    ${fromLogin ? 'برای فعال‌سازی حساب، فرم زیر را کامل کنید.' : 'لطفا اطلاعات خود را برای ساخت حساب کاربری وارد کنید.'}
                </p>

                <form class="space-y-6" id="userInfoForm">
                    <div>
                        <label class="block text-sm font-medium mb-2">شماره تماس <span class="text-red-500">*</span></label>
                        <input type="tel" data-phone required
                               class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700 text-left"
                               placeholder="09xxxxxxxxx"
                               pattern="09[0-9]{9}"
                               maxlength="11"
                               value="${phone || ''}"
                               ${fromLogin ? 'readonly' : ''}>
                        <p class="text-xs text-gray-500 mt-1">کد تأیید به این شماره ارسال می‌شود.</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">نام <span class="text-red-500">*</span></label>
                            <input type="text" required data-first-name class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">نام خانوادگی <span class="text-red-500">*</span></label>
                            <input type="text" required data-last-name class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">کد ملی <span class="text-red-500">*</span></label>
                        <input type="text" data-national required
                               class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                               maxlength="10"
                               pattern="[0-9]{10}">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">استان محل سکونت <span class="text-red-500">*</span></label>
                            <select required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" id="provinceSelect">
                                <option value="">انتخاب استان</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">شهر محل سکونت <span class="text-red-500">*</span></label>
                            <select required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" id="citySelect" disabled>
                                <option value="">ابتدا استان را انتخاب کنید</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">آدرس دقیق <span class="text-red-500">*</span></label>
                        <textarea required rows="3" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">کد پستی <span class="text-red-500">*</span></label>
                        <input type="text" data-postal required
                               class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700"
                               maxlength="10"
                               pattern="[0-9]{10}">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">تاریخ تولد</label>
                            <input type="text" data-birth-date class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" placeholder="۱۳۷۰/۰۱/۰۱">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">نام پدر</label>
                            <input type="text" data-father-name class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">ایمیل (اختیاری)</label>
                        <input type="email" data-email class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                    </div>

                    <div class="flex gap-4">
                        <button type="button" id="${fromLogin ? 'backToVerify' : 'backToLoginPage'}" class="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors">
                            ${fromLogin ? 'بازگشت به تأیید شماره' : 'بازگشت به صفحه ورود'}
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
    
    // Load provinces
    loadProvinces();
    
    const provinceSelect = $('#provinceSelect');
    const citySelect = $('#citySelect');
    if (provinceSelect) {
        provinceSelect.addEventListener('change', function() {
            loadCities(this.value);
        });
    }

    const userInfoForm = $('#userInfoForm');
    if (userInfoForm) {
        userInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const phoneInput = userInfoForm.querySelector('[data-phone]');
            const phoneValue = phoneInput ? phoneInput.value.trim() : '';
            if (!phoneInput || !validatePhone(phoneValue)) {
                notify('شماره تماس نامعتبر است', true);
                return;
            }

            const nationalInput = userInfoForm.querySelector('input[data-national]');
            const nationalCode = nationalInput ? nationalInput.value.trim() : '';
            if (!nationalInput || !validateNationalCode(nationalCode)) {
                notify('کد ملی نامعتبر است', true);
                return;
            }

            const postalInput = userInfoForm.querySelector('input[data-postal]');
            const postalCode = postalInput ? postalInput.value.trim() : '';
            if (!postalInput || !validatePostalCode(postalCode)) {
                notify('کد پستی باید 10 رقمی باشد', true);
                return;
            }

            const firstNameInput = userInfoForm.querySelector('[data-first-name]');
            const lastNameInput = userInfoForm.querySelector('[data-last-name]');
            const firstName = firstNameInput ? firstNameInput.value.trim() : '';
            const lastName = lastNameInput ? lastNameInput.value.trim() : '';
            if (!firstName || !lastName) {
                notify('لطفا نام و نام خانوادگی را تکمیل کنید', true);
                return;
            }

            const addressInput = userInfoForm.querySelector('textarea');
            if (!addressInput || !addressInput.value.trim()) {
                notify('وارد کردن آدرس الزامی است', true);
                return;
            }

            const birthDateInput = userInfoForm.querySelector('[data-birth-date]');
            const fatherNameInput = userInfoForm.querySelector('[data-father-name]');
            const emailInput = userInfoForm.querySelector('[data-email]');

            user = {
                id: uid('u'),
                name: `${firstName} ${lastName}`.trim(),
                phone: phoneValue,
                nationalCode: nationalCode,
                province: provinceSelect ? provinceSelect.value : '',
                city: citySelect ? citySelect.value : '',
                address: addressInput.value.trim(),
                postalCode: postalCode,
                birthDate: birthDateInput ? birthDateInput.value.trim() : '',
                fatherName: fatherNameInput ? fatherNameInput.value.trim() : '',
                email: emailInput ? emailInput.value.trim() : '',
                created: new Date().toISOString()
            };

            LS.set('HDK_user', user);
            updateUserLabel();
            notify('ثبت‌نام با موفقیت انجام شد!');
            navigate('home');
        });
    }

    const backToVerifyBtn = $('#backToVerify');
    if (backToVerifyBtn) {
        backToVerifyBtn.addEventListener('click', () => renderVerifyPage(phone));
    }

    const backToLoginPageBtn = $('#backToLoginPage');
    if (backToLoginPageBtn) {
        backToLoginPageBtn.addEventListener('click', () => {
            location.hash = '#login';
        });
    }
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
if (userButton) {
    userButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const adminActive = typeof isAdminAuthenticated === 'function' ? isAdminAuthenticated() : false;
        if (user || adminActive) {
            if (userDropdown) {
                userDropdown.classList.toggle('open');
            }
        } else {
            location.hash = 'login';
        }
    });
}

document.addEventListener('click', () => {
    if (userDropdown) {
        userDropdown.classList.remove('open');
    }
});

// User Dropdown Delegation
document.addEventListener('click', (e) => {
    if (e.target.id === 'loginBtn' || e.target.closest('#loginBtn')) {
        location.hash = 'login';
    }
    if (e.target.id === 'dropdownSignupBtn' || e.target.closest('#dropdownSignupBtn')) {
        location.hash = 'signup';
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