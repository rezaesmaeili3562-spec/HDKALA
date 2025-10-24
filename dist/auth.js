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
function renderLoginPage() {
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
                    ورود به حساب کاربری
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    لطفا شماره تلفن خود را وارد کنید
                </p>
            </div>
            <form class="mt-8 space-y-6" id="loginForm">
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
                    <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                        دریافت کد تأیید
                    </button>
                </div>
            </form>
            <div class="text-center">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                    حساب کاربری ندارید؟ با وارد کردن شماره تلفن، حساب شما ساخته خواهد شد
                </p>
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
        if (existingUser && existingUser.phone === phone) {
            // Login
            user = existingUser;
            LS.set('HDK_user', user);
            updateUserLabel();
            notify('با موفقیت وارد شدید!');
            navigate('home');
        } else {
            // Signup - show user info form
            renderUserInfoForm(phone);
        }
    });
    
    $('#backToLogin').addEventListener('click', renderLoginPage);
}

function renderUserInfoForm(phone) {
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
                
                <form class="space-y-6" id="userInfoForm">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">نام <span class="text-red-500">*</span></label>
                            <input type="text" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">نام خانوادگی <span class="text-red-500">*</span></label>
                            <input type="text" required class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
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
                            <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700" placeholder="۱۳۷۰/۰۱/۰۱">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">نام پدر</label>
                            <input type="text" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">ایمیل (اختیاری)</label>
                        <input type="email" class="w-full p-3 border border-primary/30 rounded-lg bg-white dark:bg-gray-700">
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
    
    // Load provinces
    loadProvinces();
    
    $('#provinceSelect').addEventListener('change', function() {
        const province = this.value;
        loadCities(province);
    });
    
    $('#userInfoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate required fields
        const nationalCode = $('input[data-national]').value;
        if (!validateNationalCode(nationalCode)) {
            notify('کد ملی نامعتبر است', true);
            return;
        }
        
        const postalCode = $('input[data-postal]').value;
        if (!validatePostalCode(postalCode)) {
            notify('کد پستی باید 10 رقمی باشد', true);
            return;
        }
        
        // Create user
        user = {
            id: uid('u'),
            name: $('#userInfoForm input[type="text"]:nth-child(1)').value + ' ' + $('#userInfoForm input[type="text"]:nth-child(2)').value,
            phone: phone,
            nationalCode: nationalCode,
            province: $('#provinceSelect').value,
            city: $('#citySelect').value,
            address: $('#userInfoForm textarea').value,
            postalCode: postalCode,
            birthDate: $('#userInfoForm input[placeholder="۱۳۷۰/۰۱/۰۱"]').value,
            fatherName: $('#userInfoForm input[type="text"]:last-child').value,
            email: $('#userInfoForm input[type="email"]').value,
            created: new Date().toISOString()
        };
        
        LS.set('HDK_user', user);
        updateUserLabel();
        notify('ثبت‌نام با موفقیت انجام شد!');
        navigate('home');
    });
    
    $('#backToVerify').addEventListener('click', () => renderVerifyPage(phone));
}

function loadProvinces() {
    const provinceSelect = $('#provinceSelect');
    if (!provinceSelect) return;
    
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