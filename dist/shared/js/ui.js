const templateCache = new Map();

export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

export async function renderHTML(container, templatePath) {
  if (!container) return null;
  let markup = templateCache.get(templatePath);
  if (!markup) {
    const response = await fetch(templatePath);
    markup = await response.text();
    templateCache.set(templatePath, markup);
  }
  container.innerHTML = markup;
  return container;
}

export function showNotification(message, tone = 'info') {
  const notification = qs('#notification');
  if (!notification) return;

  const palette = {
    info: 'bg-slate-900/90',
    success: 'bg-emerald-600/95',
    warning: 'bg-amber-500/95',
    danger: 'bg-rose-600/95'
  };

  notification.textContent = message;
  notification.classList.remove('hidden', 'bg-slate-900/90', 'bg-emerald-600/95', 'bg-amber-500/95', 'bg-rose-600/95', 'opacity-0');
  notification.classList.add(palette[tone] ?? palette.info);

  window.clearTimeout(notification.dataset.timer);
  const timer = window.setTimeout(() => {
    notification.classList.add('opacity-0');
    window.setTimeout(() => notification.classList.add('hidden'), 250);
  }, 3200);
  notification.dataset.timer = timer;
}

export function setActiveNavigation(route) {
  qsa('[data-nav]').forEach((link) => {
    const isActive = link.dataset.nav === route;
    link.classList.toggle('text-indigo-600', isActive);
    link.classList.toggle('font-semibold', isActive);
  });
}

export function toggleMobileMenu(forceState) {
  const menu = qs('#mobileMenu');
  if (!menu) return;
  const shouldOpen = typeof forceState === 'boolean' ? forceState : menu.classList.contains('hidden');
  menu.classList.toggle('hidden', !shouldOpen);
}

export function formatNumber(value) {
  return new Intl.NumberFormat('fa-IR').format(value);
}
