# 🗺️ نقشه تغییرات — هر فیکس مال کدوم فایل؟

سلام! اینجا دقیقاً میگم هر تغییری که زدم مال کدوم فایل اصلی پروژهته و توی اون فایل چی رو باید عوض کنی.

## اول ساختار پروژهت رو بشناس

| پوشه | چیه؟ |
|---|---|
| `store/templates/` | فایل‌های HTML صفحات (home.html، cart.html و...) |
| `store/scripts/scripts-shared/` | منطق مشترک همه صفحات (روتر، سبد خرید، ورود و...) |
| `store/scripts/scripts-pages/` | اسکریپت کوچک مخصوص هر صفحه |
| `store/scripts/loader/` | لودر ماژول‌های مشترک |
| `store/scripts/admin/` | اسکریپت‌های پنل ادمین جدا |
| `package.json` | اسکریپت‌های اجرای پروژه |

---

## 📄 تغییرات فایل به فایل (به ترتیب اهمیت)

### 1️⃣ `store/scripts/loader/loader.js` (لودر ماژول‌ها)
**۲ تا تغییر:**
- **الف)** فایل `admin.js` رو به آخر لیست ماژول‌ها اضافه کن (چون هیچ صفحه‌ای لودش نمی‌کرد و پنل ادمین کرش می‌کرد):
```js
{ file: 'constants.js', role: '...' },
{ file: '../scripts-pages/admin.js', role: 'Admin panel helpers' }   // ← این خط رو اضافه کن
```
- **ب)** آخر فایل، بعد از لود آخرین ماژول، صف init ها رو اجرا کن:
```js
if (lastScript) {
    const flush = () => {
        if (typeof window.__flushDomReadyQueue === 'function') {
            window.__flushDomReadyQueue();
        }
    };
    lastScript.addEventListener('load', flush);
    lastScript.addEventListener('error', flush);
}
```

---

### 2️⃣ `store/scripts/scripts-shared/dom.js` (ماژول قالب‌ها)
**فقط انتهای فایل** این helper رو اضافه کن (بقیه ماژول‌ها بهش نیاز دارن):
```js
window.__domReadyQueue = window.__domReadyQueue || [];
window.onDomReady = function(fn) {
    if (typeof fn !== 'function') return;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        window.__domReadyQueue.push(fn);
    }
};
window.__flushDomReadyQueue = function() {
    while (window.__domReadyQueue.length) {
        const fn = window.__domReadyQueue.shift();
        try { fn(); } catch (err) { console.error('Init error:', err); }
    }
};
```

---

### 3️⃣ `store/scripts/scripts-shared/router.js` (روتر صفحات)
**ابتدای فایل** (بعد از تعریف `navigate`) این بخش رو عوض کن:

❌ **کد قبلی:**
```js
window.addEventListener('hashchange', () => navigate(location.hash.slice(1)));
window.addEventListener('load', () => navigate(location.hash.slice(1) || 'home'));
```

✅ **کد جدید:**
```js
let routerReady = false;

window.addEventListener('hashchange', () => {
    if (!routerReady) return;
    navigate(location.hash.slice(1));
});

function initialNavigate() {
    routerReady = true;
    navigate(location.hash.slice(1) || 'home');
}

onDomReady(initialNavigate);
```
**انتهای فایل:** اون خط `document.addEventListener('DOMContentLoaded', () => { setupAdminNavigation(); });` رو تبدیل کن به `onDomReady(() => { setupAdminNavigation(); });`

---

### 4️⃣ `store/scripts/scripts-shared/storage.js` (داده‌ها و سبد خرید)
**۲ تا تغییر:**
- **الف)** انتهای فایل، لیسنر init رو اینطوری کن (قبلاً DCL بود که هرگز اجرا نمی‌شد):
```js
onDomReady(() => {
    updateUserLabel();
    updateAddressQuickPanel(true);
    updateCartBadge();      // ← این ۳ خط جدید اضافه شدن
    updateWishlistBadge();  //    تا بج‌ها بعد از رفرش از localStorage
    updateCompareBadge();   //    مقداردهی بشن
});
```
- **ب)** توی تابع `addToCart`، قبل از `notify('محصول به سبد اضافه شد.')` این رو اضافه کن:
```js
if (cartSidebar) {
    cartSidebar.classList.add('open');
}
```

---

### 5️⃣ `store/scripts/scripts-shared/pages.js` (صفحات: آدرس‌ها، علاقه‌مندی، مقایسه...)
**در تابع `saveAddress`:**
- **الف)** قبل از ساخت `formData` (یا بعدش) این شرط رو اضافه کن — اولین آدرسِ کاربر خودکار پیش‌فرض بشه:
```js
if (!addressId && !addresses.some(addr => addr.userId === user.id && addr.isDefault)) {
    formData.isDefault = true;
}
```
- **ب)** حلقه «حذف پیش‌فرض از بقیه آدرس‌ها» رو اصلاح کن:

❌ **کد قبلی (باگ‌دار):**
```js
if (addr.userId === user.id && addr.id !== addressId) {
```
✅ **کد جدید:**
```js
const currentId = addressId || (addresses.length ? addresses[addresses.length - 1].id : null);
addresses.forEach(addr => {
    if (addr.userId === user.id && addr.id !== currentId) {
        addr.isDefault = false;
    }
});
```

---

### 6️⃣ `store/scripts/scripts-shared/ui.js` (صفحات: تسویه حساب، پروفایل، تماس با ما، سفارش‌ها)
**۳ تا تغییر:**
- **الف)** **فرم پروفایل:** به تگ `<form>` صفحه پروفایل `id="profileForm"` بده، به input نام `data-profile-name` و به input ایمیل `data-profile-email` بده، و بعد از `contentRoot.appendChild(page);` این هندلر رو اضافه کن:
```js
const profileForm = $('#profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!user) { notify('ابتدا وارد حساب کاربری خود شوید', true); location.hash = 'login'; return; }
        const nameInput = profileForm.querySelector('[data-profile-name]');
        const emailInput = profileForm.querySelector('[data-profile-email]');
        const newName = nameInput ? nameInput.value.trim() : '';
        const newEmail = emailInput ? emailInput.value.trim() : '';
        if (!newName) { notify('نام نمی‌تواند خالی باشد', true); return; }
        if (newEmail && !validateEmail(newEmail)) { notify('ایمیل نامعتبر است', true); return; }
        user.name = newName;
        user.email = newEmail;
        LS.set('HDK_user', user);
        updateUserLabel();
        notify('تغییرات پروفایل با موفقیت ذخیره شد');
    });
}
```
- **ب)** **فرم تماس با ما:** به فرمش `id="contactForm"` بده و بعد از `contentRoot.appendChild(page);` این رو اضافه کن:
```js
const contactForm = $('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = contactForm.querySelector('input[type="email"]');
        if (emailInput && emailInput.value.trim() && !validateEmail(emailInput.value.trim())) {
            notify('ایمیل وارد شده معتبر نیست', true);
            return;
        }
        notify('پیام شما با موفقیت ارسال شد. به زودی با شما تماس می‌گیریم.');
        contactForm.reset();
    });
}
```
- **ج)** **انتهای فایل:** `document.addEventListener('DOMContentLoaded', initCartAndCompareControls);` رو تبدیل کن به `onDomReady(initCartAndCompareControls);`

---

### 7️⃣ `store/scripts/scripts-pages/cart.js` (صفحه سبد خرید / تسویه حساب)
**۳ تا تغییر:**
- **الف)** **دکمه «پرداخت و ثبت سفارش»** (`#finalCheckoutBtn`): این گاردها رو به اولش اضافه کن:
```js
if (!user) {
    notify('برای ثبت سفارش ابتدا وارد حساب کاربری خود شوید', true);
    location.hash = 'login';
    return;
}
if (cart.length === 0) { notify('سبد خرید شما خالی است', true); return; }

const paymentRadio = $('input[name="payment"]:checked');
if (!paymentRadio) { notify('لطفا روش پرداخت را انتخاب کنید', true); return; }
const selectedPayment = paymentRadio.value;

const address = addresses.find(addr => addr.userId === user.id && addr.isDefault);
if (!address) { notify('لطفا یک آدرس برای ارسال انتخاب کنید', true); location.hash = 'addresses'; return; }
```
- **ب)** **انتهای فایل:** بلوک `if (!enhanceCheckoutRendering()) { window.addEventListener('load', ...) }` رو با نسخه‌ای که از صف `onDomReady` استفاده می‌کنه عوض کن (کد کاملش توی فایل فعلی هست).

---

### 8️⃣ `store/templates/checkout.html` (صفحه تسویه حساب)
**فقط ۱ خط اضافه کن:**
```html
<script src="../scripts/scripts-pages/cart.js" defer></script>   <!-- این خط جدید -->
<script src="../scripts/scripts-pages/checkout.js" defer></script>
```
(چون کد دکمه پرداخت توی `cart.js` هست ولی این صفحه لودش نمی‌کرد!)

---

### 9️⃣ همه ۱۶ فایل `store/scripts/scripts-pages/` (home.js، product.js و...)
**یک تغییر یکسان توی همه:** بلوک `activate` رو عوض کن تا hash کاربر (لینک مستقیم) پاک نشه:

❌ **کد قبلی:**
```js
if (location.hash !== target) {
    location.hash = target;
} else if (typeof renderPage === 'function') {
    renderPage();
}
```
✅ **کد جدید:**
```js
if (!location.hash || location.hash === '#') {
    location.hash = target;
} else if (typeof renderPage === 'function') {
    renderPage();
}
```

---

### 🔟 همه ۱۶ فایل `store/templates/*.html`
**یک تغییر یکسان:** توی قالب‌ها `src=""` خالی دو تصویر رو حذف کن:
```html
<!-- قبلا: -->  <img data-element="product-image" src="" ... />
<!-- جدید:  -->  <img data-element="product-image" ... />

<!-- قبلا: -->  <img data-element="blog-image" src="" ... />
<!-- جدید:  -->  <img data-element="blog-image" ... />
```

---

### 1️⃣1️⃣ `package.json`
فقط خط server:
```json
"server": "npx serve store -l 3000"     ← قبلاً: "npx serve store/templates"
```

### 1️⃣2️⃣ فایل جدید: `store/index.html`
یک صفحه کوچک که فقط به `templates/home.html` ریدایرکت می‌کنه تا وقتی `npm run server` می‌زنی، سایت مستقیم باز بشه.

### 1️⃣3️⃣ `README.md`
فقط مسیرهای قدیمی (`dist/`) رو به مسیرهای جدید (`store/`) اصلاح کردم — اختیاریه.

---

## 🔧 توی فایل‌های دیگه (`scripts-shared/components.js, core.js, filters.js, utils.js, validation.js` و `scripts-pages/admin.js`)
**فقط ۱ خط تغییر:** هرجا این بود:
```js
document.addEventListener('DOMContentLoaded', () => { ... });
// یا
document.addEventListener('DOMContentLoaded', initializeFilters);
// یا
document.addEventListener('DOMContentLoaded', initCartAndCompareControls);
```
تبدیل شده به:
```js
onDomReady(() => { ... });
onDomReady(initializeFilters);
onDomReady(initCartAndCompareControls);
```
> دلیل: چون ماژول‌ها بعد از رویداد DOMContentLoaded لود می‌شن، این لیسنرها **هرگز** اجرا نمی‌شدن!

---

## 💡 خلاصه یک‌خطی

| فایل | مشکل | فیکس |
|---|---|---|
| `loader/loader.js` | admin.js لود نمی‌شد | + ماژول admin.js + فلاش init |
| `scripts-shared/dom.js` | — | + helper `onDomReady` |
| `scripts-shared/router.js` | hash پاک می‌شد / خطای race | ناوبری بعد از لود کامل ماژول‌ها |
| `scripts-shared/storage.js` | بج‌ها خالی بعد از رفرش | init از localStorage + باز شدن سایدبار سبد |
| `scripts-shared/pages.js` | آدرس پیش‌فرض باگ داشت | خودکار پیش‌فرض شدن آدرس اول |
| `scripts-shared/ui.js` | فرم پروفایل/تماس مرده | + هندلر هر دو فرم |
| `scripts-pages/cart.js` | پرداخت بدون گارد | + گارد کاربر/آدرس/روش پرداخت |
| `templates/checkout.html` | cart.js لود نمی‌شد | + ۱ خط اسکریپت |
| `scripts-pages/*.js` (۱۶ فایل) | پاک شدن hash لینک مستقیم | شرط `!location.hash` |
| `templates/*.html` (۱۶ فایل) | src="" اضافی | حذف src خالی |
| `package.json` | server اشتباه | سرو از ریشه store |
