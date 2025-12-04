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
    { file: 'constants.js', role: 'Static texts, labels, and configuration defaults' }
  ];

  const currentScript = document.currentScript;
  const sharedBase = new URL('../scripts/scripts-shared/', currentScript.src);

  modules.forEach(({ file }) => {
    const script = document.createElement('script');
    script.src = new URL(file, sharedBase).toString();
    script.async = false;
    script.defer = true;
    document.head.appendChild(script);
  });
})();
