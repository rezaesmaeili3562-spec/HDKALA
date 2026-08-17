# HDKALA فروشگاه تک‌صفحه‌ای

![بنر HDKALA](./public/banner.png "بنر پیشنهادی برای معرفی فروشگاه")

## چکیده اجرایی
HDKALA یک فروشگاه اینترنتی تک‌صفحه‌ای (SPA) مبتنی بر Tailwind CSS و جاوااسکریپت ماژولار است که با ناوبری مبتنی بر `hash`، تجربه‌ای سریع و بدون بارگذاری مجدد ارائه می‌دهد. تمام صفحات (خانه، محصولات، جزییات محصول، سبد خرید، مقایسه، علاقه‌مندی‌ها و احراز هویت) به صورت پویا از طریق رندر DOM و قالب‌های قابل تکثیر مدیریت می‌شوند و داده‌ها در `localStorage` نگه‌داری می‌شوند تا بدون بک‌اند نیز قابل استفاده باشد.

این پروژه برای نمایش یک جریان کامل فروشگاه ایرانی طراحی شده است؛ از کشف محصول و فیلتر‌های پیشرفته تا احراز هویت OTP، مدیریت آدرس، سفارش‌ها، و یک پنل ادمین سبک برای آزمایش سریع. ساختار ماژولار فایل‌های مشترک در پوشه `store/scripts/scripts-shared` و داده‌های نمونه در `store/scripts/scripts-shared/storage.js` اجرای بدون وابستگی سرور را تسهیل می‌کند و امکان توسعه سریع فرانت‌اند یا اتصال به API واقعی را فراهم می‌سازد.

> **دمو محلی:** با اجرای `npm run server` و باز کردن `http://localhost:3000` (به‌صورت خودکار به `templates/home.html` منتقل می‌شوید) می‌توانید فروشگاه را مشاهده کنید.

## ویژگی‌های اصلی
- 🎯 **ناوبری تک‌صفحه‌ای بدون رفرش** – مسیریابی مبتنی بر هش بین صفحات اصلی، جزییات محصول و پنل ادمین.
- 🛒 **سبد خرید، علاقه‌مندی و مقایسه** – مدیریت چند لیست کاربری با رندر کارت محصول و اعلان‌های فوری.
- 🔐 **احراز هویت OTP و منوی کاربر تطبیقی** – فرم‌های ورود/ثبت‌نام، صفحه تأیید شماره و منوی کشویی پویا بر اساس وضعیت کاربر یا ادمین.
- 🧭 **فیلتر و صفحه‌بندی محصولات** – فیلتر بر اساس دسته، قیمت، برند، موجودی و امتیاز با صفحه‌بندی ۱۲ تایی و شمارنده نتایج.
- 📰 **بلاگ و محتوای الهام‌بخش** – کارت‌های وبلاگ در صفحه خانه و لیست اختصاصی بلاگ.
- 🧰 **پنل ادمین سبک** – دسترسی دمو برای افزودن سریع محصول و مشاهده ابزارهای مدیریتی.

> برای هر ویژگی در فایل‌های `store/templates/*` قالب HTML/JS اختصاصی و در `store/scripts/scripts-shared/*` منطق مشترک وجود دارد.

## پشته فناوری
| دسته | تکنولوژی‌ها | نقش در پروژه |
|------|--------------|---------------|
| فرانت‌اند | HTML، JavaScript، [Tailwind CSS 3.4](package.json) | استایل‌دهی اتمیک، رندر پویا و تعاملات DOM |
| آیکون و UI | Iconify Web Components | آیکون‌های واکنش‌گرا در کارت‌ها و منوها |
| مدیریت استایل | `store/css/input.css` → `store/css/output.css` | ورودی Tailwind و خروجی کامپایل‌شده برای صفحات |
| سروینگ محلی | `serve` (npm) | اجرای دمو از مسیر `store/templates` |
| داده/ذخیره‌سازی | `localStorage`، داده‌های نمونه در `store/scripts/scripts-shared/storage.js` | پایداری سبد، علاقه‌مندی، سفارش و بلاگ بدون سرور |

## معماری سیستم
```mermaid
graph TD
    A[Hash Router<br/>store/scripts/scripts-shared/router.js] --> B[Templates & UI Helpers<br/>store/scripts/scripts-shared/components.js]
    A --> C[Pages (HTML/JS)<br/>store/templates/*]
    A --> D[Authentication & User Menu<br/>store/scripts/scripts-shared/auth.js]
    A --> E[Filters & Pagination<br/>store/scripts/scripts-shared/router.js]
    C --> F[Local Storage Wrapper<br/>store/scripts/scripts-shared/storage.js]
    F --> G[Sample Products/Blogs]
    A --> H[Notifications & Utilities<br/>store/scripts/scripts-shared/core.js]
    C --> I[Styles<br/>store/css/output.css]
```
- **جریان داده:** داده‌های نمونه از `storage.js` در حافظه بارگذاری و در `localStorage` ذخیره می‌شوند؛ رندر صفحات توسط `router.js` و قالب‌ها در `components.js` انجام می‌شود.
- **الگوهای طراحی:** ماژولار بودن فایل‌های `shared`، جداسازی نگرانی‌ها (UI، ذخیره‌سازی، احراز هویت، مسیریابی) و استفاده از الگوهای DOM قابل کلون شدن برای کارت‌ها و لیست‌ها.

## ساختار پروژه
```
project-root/
├── store/
│   ├── css/                    # CSS کامپایل‌شده Tailwind و استایل هر صفحه
│   ├── scripts/
│   │   ├── scripts-shared/     # ماژول‌های مشترک (router، auth، core، storage و ...)
│   │   ├── scripts-pages/      # اسکریپت هر صفحه
│   │   ├── admin/              # اسکریپت‌های پنل ادمین
│   │   └── loader/             # لودر ماژول‌های مشترک
│   ├── templates/              # صفحات HTML (home، products، cart، admin، ...)
│   └── index.html              # ریدایرکت به templates/home.html
├── package.json                # اسکریپت‌ها و وابستگی‌ها
├── package-lock.json
└── tailwind.config.js
```

### توضیح پوشه‌های کلیدی
- **store/scripts/scripts-shared/**
  - **هدف:** منطق هسته شامل مسیریابی، احراز هویت، ذخیره‌سازی، اعلان، فیلتر و قالب‌ها.
  - **محتوا:** فایل‌هایی مانند `router.js` (مسیرهای hash و رندر صفحات)، `core.js` (ابزارها و رندر کارت محصول)، `auth.js` (فرم‌های ورود، تأیید و منوی کاربر)، `storage.js` (نمونه داده و wrapper `localStorage`).
  - **نقش معماری:** جداسازی منطق مشترک و تسهیل توسعه صفحه‌های جدید با استفاده از همان API‌ها.

- **store/templates/**
  - **هدف:** صفحات مستقل HTML/JS برای بخش‌های فروشگاه (خانه، محصولات، محصول، بلاگ، سبد، پرداخت، ادمین و ...).
  - **محتوا:** هر صفحه شامل قالب‌های DOM و اسکریپت اختصاصی است که به توابع `shared` متکی است.
  - **نقش معماری:** مرز نمایشی و نقطه ورود رابط کاربری برای هر مسیر.

- **store/css/input.css**
  - **هدف:** نقطه ورود Tailwind برای تولید `store/css/output.css`.
  - **محتوا:** دستورات `@tailwind base|components|utilities` برای فعال‌سازی طراحی اتمیک.
  - **نقش معماری:** منبع واحد استایل که در build به CSS آماده تولید تبدیل می‌شود.

- **package.json**
  - **هدف:** مدیریت وابستگی‌ها و اسکریپت‌های توسعه/ساخت/سرو.
  - **اسکریپت‌ها:**
    - `npm run dev` → کامپایل زنده Tailwind به `store/css/output.css`
    - `npm run build` → تولید CSS کمینه‌شده
    - `npm run server` → سرو فروشگاه از ریشه `store` روی پورت ۳۰۰۰

### توضیح تک‌به‌تک پوشه‌ها و فایل‌های HTML/JS
#### ماژول‌های مشترک (`store/scripts/scripts-shared/`)
- **core.js:** توابع کمکی DOM (`$`، `$$`)، سیستم اعلان، قالب رندر کارت محصول و مدیریت مقادیر عددی/تخفیف.
- **ui.js:** راه‌اندازی عناصر مشترک مثل منوی موبایل، نوار اعلان، مودال مقایسه و سایدبار سبد/فیلتر.
- **filters.js:** منطق فیلتر و صفحه‌بندی محصولات (دسته، برند، محدوده قیمت، امتیاز، موجودی) و اتصال به `router.js`.
- **constants.js:** ثابت‌های متنی و تنظیمات پیش‌فرض رابط (متون خالی، وضعیت دمو و… ).
- **utils.js:** ابزارهایی مثل `uid`، فرمت پول و تاریخ، دسترسی ایمن به localStorage و کمکی‌های مقایسه/جست‌وجو.
- **components.js:** ثبت و کلون قالب‌های HTML برای کارت محصول، آیتم سبد، آیتم علاقه‌مندی، کارت بلاگ و کامپوننت‌های خالی.
- **dom.js:** انتخابگرهای اولیه صفحه، مدیریت تم، اسکرول نرم، و هندل کردن رویدادهای UI سطح بالا.
- **auth.js:** رندر صفحات ورود/ثبت‌نام و OTP، مدیریت منوی کاربر و ادمین، و روال ورود/خروج با داده‌های نمونه.
- **validation.js:** اعتبارسنجی ورودی‌ها (شماره موبایل، ایمیل، الزامات فرم‌های چک‌اوت/آدرس) با پیام خطا دوستانه.
- **router.js:** مسیریاب مبتنی بر `hash` که صفحات مختلف را رندر می‌کند، صفحه محصولات را صفحه‌بندی می‌کند و حالت ادمین را سوییچ می‌کند.
- **storage.js:** داده‌های نمونه محصولات/بلاگ/آدرس، و wrapper امن `localStorage` برای سبد، علاقه‌مندی، مقایسه و سفارش‌ها.
- **pages.js:** توابع راه‌اندازی مشترک صفحات (هدر، فوتر، شمارنده‌ها) و اتصال به `router.js` برای بارگذاری پویا.

#### صفحات و فایل‌های مرتبط (`store/templates/`)
- **home/index.html & index.js:** خانه تک‌صفحه‌ای با هدر، بنر، لیست محصولات ویژه و بلاگ؛ اسکریپت هش را روی `#home` ست می‌کند تا مسیریاب UI را رندر کند.
- **products/products.html & products.js:** فهرست کامل محصولات با فیلترهای چندگانه، مرتب‌سازی، شمارنده نتایج و صفحه‌بندی ۱۲‌تایی.
- **product/product.html & product.js:** صفحه جزییات محصول شامل گالری، ویژگی‌ها، انتخاب رنگ/تعداد و CTA برای سبد، علاقه‌مندی و مقایسه.
- **cart/cart.html & cart.js:** نمایش سبد، محاسبه قیمت/تخفیف، تغییر تعداد، حذف آیتم و هدایت به پرداخت.
- **checkout/checkout.html & checkout.js:** فرم تسویه حساب، انتخاب آدرس، خلاصه سفارش، اعمال کد تخفیف دمو و بررسی ولیدیشن.
- **wishlist/wishlist.html & wishlist.js:** لیست علاقه‌مندی‌ها با امکان افزودن به سبد یا حذف و استفاده از قالب‌های مشترک کارت محصول.
- **compare/compare.html & compare.js:** جدول مقایسه محصولات انتخاب‌شده با هایلایت اختلاف‌ها و گزینه پاک‌سازی لیست.
- **login/login.html & login.js:** فرم ورود با شماره موبایل، درخواست OTP دمو، و پیوند به ثبت‌نام یا بازگشت به خانه.
- **signup/signup.html & signup.js:** ثبت‌نام سریع با شماره و نام، اتصال به جریان OTP و ذخیره کاربر در `localStorage` دمو.
- **profile/profile.html & profile.js:** داشبورد کاربر شامل کارت اطلاعات، فرم ویرایش، و لیست‌های میانبر به سفارش‌ها و آدرس‌ها.
- **orders/orders.html & orders.js:** تاریخچه سفارش‌ها از `storage.js` با امکان مشاهده وضعیت، مبلغ و دکمه دانلود فاکتور دمو.
- **addresses/addresses.html & addresses.js:** مدیریت آدرس‌ها (افزودن/ویرایش/حذف)، انتخاب آدرس پیش‌فرض و اتصال به پرداخت.
- **admin/admin.html & admin.js:** پنل ادمین سبک با نمودارهای دمو، لیست محصولات، فرم افزودن محصول نمایشی و چک دسترسی ادمین.
- **contact/contact.html & contact.js:** صفحه تماس با فرم پیام و نمایش اطلاعات ارتباطی فروشگاه.
- **about/about.html & about.js:** صفحه درباره ما با داستان برند، نقاط قوت و FAQ کوتاه.
- **blog/blog.html & blog.js:** لیست پست‌های بلاگ نمونه و کارت‌های قابل کلیک برای مطالعه بیشتر.

## مهارت‌های به‌کاررفته
- **Frontend:** مدیریت state سمت کلاینت، رندر پویا با قالب‌های DOM، طراحی واکنش‌گرا و تم تاریک با Tailwind، صفحه‌بندی و فیلتر.
- **Auth & UX:** فرم ورود OTP، تایمر، منوی کاربر/ادمین پویا، اعلان‌های در لحظه.
- **Data & State:** ذخیره‌سازی لوکال (`LS` wrapper)، داده‌های نمونه برای محصولات و بلاگ، مدیریت چند لیست (cart، wishlist، compare).
- **Tooling:** Tailwind CLI، سرو محلی، ساخت CSS کمینه.

## مثال‌های کد کلیدی
```js
// store/scripts/scripts-shared/core.js
function renderProductsList(list, container){
    if(!container) return;
    container.innerHTML = '';

    if(!list || list.length===0){
        container.appendChild(Templates.clone('tpl-product-empty'));
        return;
    }

    list.forEach(p => {
        const fragment = Templates.clone('tpl-product-card');
        const root = fragment.querySelector('[data-element="product-card"]') || fragment.firstElementChild;
        if (!root) {
            return;
        }
        // ... تنظیم قیمت، آیکون علاقه‌مندی/مقایسه، تصویر و نشان‌های تخفیف
        container.appendChild(fragment);
    });
}
```
- **هدف:** رندر کارت‌های محصول با پشتیبانی از لیست خالی، تخفیف، علاقه‌مندی و مقایسه.
- **دلیل انتخاب:** استفاده از قالب‌های قابل کلون شدن سرعت رندر را بالا می‌برد و منطق را از HTML جدا می‌کند.
- **جایگزین‌ها:** استفاده از کتابخانه‌های UI (React/Vue)؛ اما پیاده‌سازی سبک وزن فعلی برای دمو بدون وابستگی کافی است.
- **ارتباط:** توسط مسیریاب (`router.js`) در صفحات خانه، محصولات، علاقه‌مندی و مقایسه فراخوانی می‌شود.

```js
// store/scripts/scripts-shared/auth.js
function renderLoginPage() {
    const page = document.createElement('div');
    page.className = 'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8';
    page.innerHTML = `...`;
    contentRoot.innerHTML = '';
    contentRoot.appendChild(page);

    $('#loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const phone = $('#phone').value.trim();
        if (!validatePhone(phone)) { /* نمایش خطا */ return; }
        if (phone) { renderVerifyPage(phone); }
    });
}
```
- **هدف:** جریان ورود بر اساس شماره موبایل با اعتبارسنجی و هدایت به صفحه OTP.
- **دلیل انتخاب:** ساده‌سازی احراز هویت بدون نیاز به سرور در محیط دمو.
- **جایگزین‌ها:** ادغام سرویس OTP واقعی یا OAuth؛ در نسخه فعلی تمرکز بر UX و نمایش جریان است.
- **ارتباط:** منوی کاربر و مسیرهای `router.js` وضعیت احراز هویت را برای دسترسی به پروفایل و پنل ادمین بررسی می‌کنند.

## راه‌اندازی پروژه (Getting Started)
### پیش‌نیازها
- Node.js 18+
- npm 9+

### نصب و اجرا
```bash
git clone <repository-url>   # کلون کردن ریپازیتوری
cd HDKALA                     # ورود به پوشه پروژه
npm install                   # نصب وابستگی‌های Tailwind
npm run dev                   # کامپایل زنده CSS (watch)
npm run server                # سرو صفحات store/templates روی پورت 3000
```

### محیط‌ها
- **Development:** `npm run dev` (watch) + `npm run server`
- **Production:** `npm run build` برای تولید CSS کمینه و سرو فایل‌های `store/templates`

## تصاویر و گیف‌ها
- جای‌گذاری یک بنر در مسیر `public/banner.png` (یا لینک CDN) برای سربرگ.
- برای تعاملات مهم (افزودن به سبد، فیلتر، تأیید OTP) می‌توانید GIF‌های کوتاه از UI نهایی در پوشه `public/` اضافه کنید.

## مستندات API
این نسخه دمو فاقد بک‌اند است و داده‌ها از `localStorage` و نمونه‌های `storage.js` بارگذاری می‌شوند. در صورت اتصال به API واقعی، نقاط زیر پیشنهاد می‌شود:
- `GET /products`, `GET /products/:id`, `POST /cart`, `POST /auth/otp`
- احراز هویت: ارسال کد OTP و دریافت توکن موقت برای نگه‌داری در `localStorage`.

## تست‌ها
در حال حاضر تست خودکار وجود ندارد. برای اطمینان دستی:
- گردش ورود و تأیید OTP.
- افزودن/حذف از سبد، علاقه‌مندی و مقایسه.
- فیلتر و صفحه‌بندی محصولات.
- دسترسی به حالت ادمین و افزودن محصول نمایشی.

## مشارکت (Contributing)
1. فورک و کلون.
2. ایجاد شاخه فیچر: `git checkout -b feature/<name>`
3. اجرای `npm run dev` و اعمال تغییرات در `src/` یا فایل‌های `store/templates`/`store/scripts/scripts-shared`.
4. قبل از PR، `npm run build` را اجرا کنید و اسکرین‌شات تغییرات UI را پیوست کنید.
5. Pull Request با توضیح واضح تغییرات و اسکوپ صفحات ارسال شود.

## مجوز و تشکر
- مجوز: پروژه تحت **MIT License** منتشر می‌شود؛ متن کامل در فایل [`LICENSE`](./LICENSE) موجود است.
- با تشکر از کتابخانه‌های متن‌باز Tailwind و Iconify.
