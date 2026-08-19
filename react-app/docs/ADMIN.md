# پنل مدیریت HDKALA — ممیزی، معماری و راهنما

تاریخ: ۲۰۲۶-۰۸-۱۹

## ۱) گزارش ممیزی نسخه قبل از پنل

| مشکل | محل دقیق در کد | شدت | راه‌حل |
|---|---|---|---|
| محصولات فقط از JSON ثابت خوانده می‌شدند؛ ادمین هیچ دسترسی نوشتنی نداشت | `src/services/api.js`، `src/hooks/useProducts.js` | بحرانی | انتقال کاتالوگ به Zustand persist و خواندن فروشگاه از همان استور |
| هیچ احراز هویت ادمین و مسیر `/admin` وجود نداشت | `src/App.jsx`، `src/store/useStore.js` | بحرانی | نشست ادمین جدا + `RequireAdmin` + persist |
| نظرات بدون تأیید بلافاصله در صفحه محصول دیده می‌شدند | `src/pages/ProductDetailPage.jsx` → `CommentsSection`، `useStore.addComment` | بحرانی | فیلد `approved` و نمایش فقط نظرات تأییدشده |
| وضعیت سفارش فقط توسط خود کاربر (لغو) تغییر می‌کرد | `useStore.cancelOrder`، `ProfilePage.jsx` | مهم | `setOrderStatus` در پنل با چهار وضعیت استاندارد |
| کوپن و تنظیمات ارسال وجود نداشت؛ هزینه ارسال هاردکد بود | `src/utils/format.js` → `cartSummary`، `CartPage.jsx`، `CheckoutPage.jsx` | مهم | `settings` و `coupons` در استور مشترک + اعمال در تسویه |
| کاربران قابل جستجو/غیرفعال‌سازی نبودند | `useStore.users` / `login` | مهم | `setUserDisabled` و رد ورود حساب غیرفعال |
| دکمه پنل ادمین در هدر/فوتر نبود | `Header.jsx`، `Footer.jsx` | مهم | لینک «پنل ادمین» در هدر همه سایزها، منوی موبایل و فوتر |
| سفارش‌ها به کاربر وصل نبودند و همه سفارش‌ها در پروفایل دیده می‌شد | `placeOrder`، `ProfilePage.jsx` | مهم | ذخیره `userId` و فیلتر سفارش‌های همان کاربر |
| پروژه JS خالص بود و پنل TS-strict ممکن نبود | کل `src/` | مهم | `tsconfig` strict + تایپ‌های مشترک در `src/types` + پنل `.tsx` |
| هزینه ارسال و آستانه رایگان در چند جا تکرار شده بود | `cartSummary`، `CartPage`، `CartDrawer` | جزئی | خواندن از `settings` با مقادیر پیش‌فرض سازگار با تست‌های قبلی |
| کامپوننت‌های مشترک بدون تایپ برای مصرف از TS | `Field.jsx`، `Button.jsx`، `Drawer.jsx` | جزئی | تبدیل به TypeScript |

## ۲) تصمیم‌های معماری و دیزاین

| تصمیم | دلیل |
|---|---|
| یک Zustand persist واحد برای فروشگاه و پنل | تغییرات ادمین بدون API و بدون رفرش اجباری در فروشگاه دیده می‌شود |
| نشست ادمین جدا از کاربر مشتری | مدیر می‌تواند همزمان مشتری دمو باشد و سفارش را در پروفایل ببیند |
| تایپ‌های مشترک در `src/types/` | جلوگیری از دو مدل داده و سازگاری TS strict |
| پنل خارج از `Layout` فروشگاه | هدر/فوتر فروشگاه با سایدبار مدیریت قاطی نمی‌شود؛ دارک‌مود و فونت مشترک می‌ماند |
| نمودار SVG/CSS بدون کتابخانه چارت | سبک، بدون وابستگی سنگین، سازگار با RTL و دارک‌مود |
| اعتبارنامه دمو `admin / admin1234` | تست سریع بدون بک‌اند |
| مقادیر پیش‌فرض ارسال همان ۳۰٬۰۰۰ و آستانه ۵۰۰٬۰۰۰ | تست‌های قبلی جمع سبد نباید بشکنند |

## ۳) درخت فایل‌های جدید و تغییر‌یافته

```
react-app/
├── tsconfig.json
├── playwright.config.ts
├── e2e/
│   ├── admin.spec.ts
│   └── storefront.spec.ts
└── src/
    ├── types/index.ts
    ├── vite-env.d.ts
    ├── store/useStore.ts
    ├── services/api.ts
    ├── utils/format.ts
    ├── data/defaults.ts
    ├── hooks/useProducts.js          (خواندن از استور مشترک)
    ├── App.jsx                       (مسیرهای /admin)
    ├── components/{Field,Button,Drawer,RatingStars}.tsx
    ├── admin/
    │   ├── components/{AdminLayout,RequireAdmin,ConfirmDialog,SalesChart,StatusBadge}.tsx
    │   ├── pages/{AdminLogin,Dashboard,Products,Orders,Users,Comments,Coupons,Settings}Page.tsx
    │   └── utils/stats.ts
    └── pages/{Checkout,ProductDetail,Profile,Cart} + Header/Footer
```

## ۴) دستور اجرا و اعتبارنامه

```bash
cd react-app
npm install
npm run dev          # http://localhost:5173
npm run typecheck
npx playwright install chromium
npm test
```

- ورود ادمین: `admin` / `admin1234`
- ورود مشتری دمو: دکمه «ورود سریع با حساب دمو» یا `09120000000` / `demo1234`
- کوپن نمونه: `WELCOME10` (۱۰٪) و `SAVE50K` (۵۰ هزار تومان، حداقل سفارش ۲۰۰ هزار)

## ۵) فیکس‌های مرحله ۴

- کاتالوگ به استور منتقل شد تا CRUD ادمین فوری در لیست و جستجو دیده شود.
- نظرات پیش‌فرض تأییدنشده‌اند تا فروشگاه فقط دیدگاه معتبر نشان دهد.
- وضعیت سفارش چهار حالته شد و در پروفایل همان برچسب را نشان می‌دهد.
- کوپن و تنظیمات ارسال از استور خوانده می‌شوند تا تسویه با پنل هم‌خوان باشد.
- مسیرهای `/admin/*` قفل شدند تا مهمان به ورود هدایت شود.
- دکمه پنل ادمین در همه breakpointها اضافه شد.

## ۶) پیشنهادهای بعدی

1. اتصال `services/api.ts` به بک‌اند واقعی و JWT ادمین
2. آپلود تصویر محصول به‌جای انتخاب از کاتالوگ موجود
3. نقش‌های چندگانه (انباردار، پشتیبانی)
4. گزارش فروش Excel/CSV
5. OTP پیامکی به‌جای رمز ثابت
