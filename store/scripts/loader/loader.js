(function loadSharedModules() {
  const modules = [
    { file: 'dom.js', role: 'DOM scaffolding, theming, and top-level event wiring' },
    { file: 'core.js', role: 'Core helpers, notifications, and reusable render utilities' },
    { file: 'storage.js', role: 'Sample data bootstrapping and localStorage wrapper' },
    { file: 'router.js', role: 'Hash-based routing, navigation, and page mounting' },
    { file: 'auth.js', role: 'Authentication flow, OTP handling, and user menu state' },
    { file: 'filters.js', role: 'Product filters, pagination logic, and query helpers' },
    { file: 'pages.js', role: 'Page-level bootstrapping, counters, and shared setup' },
    { file: 'ui.js', role: 'UI chrome such as menus, modals, toasts, and sidebars' },
    { file: 'validation.js', role: 'Form validation rules and friendly error messaging' },
    { file: 'components.js', role: 'Template cloning for cards, lists, and empty states' },
    { file: 'utils.js', role: 'Generic utilities for formatting, IDs, and comparisons' },
    { file: 'constants.js', role: 'Static texts, labels, and configuration defaults' },
    // helpers پنل ادمین (SPA #admin) — پیش از این هیچ قالبی آن را لود نمی‌کرد و
    // باعث خطای setupBlogManagement is not defined می‌شد
    { file: '../scripts-pages/admin.js', role: 'Admin panel helpers for the in-app admin section' }
  ];

  const currentScript = document.currentScript;

  const sharedBase = (() => {
    // اگر مسیر sharedBase در HTML داده شده باشد
    if (currentScript?.dataset?.sharedBase) {
      return currentScript.dataset.sharedBase;
    }

    // اگر فایل loader.js از طریق src لود شده باشد (که معمولاً همین است)
    if (currentScript?.src) {
      // مسیر صحیح نسبت به ساختار پوشه‌های شما:
      // store/scripts/loader/loader.js → ../scripts-shared/
      return new URL('../scripts-shared/', currentScript.src).toString();
    }

    // حالت fallback، اگر به هر دلیلی currentScript.src وجود نداشت
    return new URL('../scripts-shared/', document.baseURI).toString();
  })();

  let lastScript = null;

  modules.forEach(({ file, role }) => {
    const script = document.createElement('script');
    script.src = new URL(file, sharedBase).toString();
    script.async = false;
    script.dataset.role = role;

    script.onerror = () =>
      console.error(`Failed to load shared module: ${script.src}`);

    document.head.appendChild(script);
    lastScript = script;
  });

  // پس از اجرای آخرین ماژول، صف init ها را اجرا می‌کنیم.
  // (لیسنرهای DOMContentLoaded ماژول‌ها قبلا هرگز اجرا نمی‌شدند چون ماژول‌ها دیر لود می‌شوند)
  if (lastScript) {
    const flush = () => {
      if (typeof window.__flushDomReadyQueue === 'function') {
        window.__flushDomReadyQueue();
      }
    };
    lastScript.addEventListener('load', flush);
    lastScript.addEventListener('error', flush);
  }
})();
