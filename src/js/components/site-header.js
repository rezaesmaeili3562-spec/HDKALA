import { getCartCount } from '../services/cart.js';
import { getWishlist } from '../services/lists.js';

const DEFAULT_LINKS = [
  { path: '/index.html', label: 'خانه' },
  { path: '/products/index.html', label: 'محصولات' },
  { path: '/blog/index.html', label: 'وبلاگ' },
  { path: '/about/index.html', label: 'درباره ما' },
  { path: '/contact/index.html', label: 'تماس با ما' }
];

function withBase(base, path) {
  if (!base) return path;
  if (path.startsWith('/')) {
    return `${base}${path}`;
  }
  return `${base}/${path}`;
}

export class SiteHeader extends HTMLElement {
  connectedCallback() {
    if (this._rendered) return;
    this._rendered = true;
    const base = this.getAttribute('data-root') || document.body?.dataset.base || '';
    const links = DEFAULT_LINKS.map((item) => ({ href: withBase(base, item.path), label: item.label }));
    this.classList.add('block', 'bg-white', 'dark:bg-slate-900', 'shadow-sm');
    const container = document.createElement('div');
    container.className = 'mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4';

    const brand = document.createElement('a');
    brand.href = withBase(base, '/index.html');
    brand.className = 'flex items-center gap-2 text-xl font-bold text-primary';
    const brandIcon = document.createElement('iconify-icon');
    brandIcon.setAttribute('icon', 'mdi:storefront-outline');
    brandIcon.setAttribute('width', '28');
    const brandText = document.createElement('span');
    brandText.textContent = 'HDKala';
    brand.append(brandIcon, brandText);

    const nav = document.createElement('nav');
    nav.className = 'hidden flex-1 items-center justify-center gap-6 text-sm font-medium lg:flex';
    links.forEach(({ href, label }) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      link.className = 'text-slate-600 transition-colors hover:text-primary dark:text-slate-300';
      if (this.dataset.active === label) {
        link.classList.add('text-primary');
      }
      nav.appendChild(link);
    });

    const actions = document.createElement('div');
    actions.className = 'flex items-center gap-4';

    const loginLink = document.createElement('a');
    loginLink.href = withBase(base, '/auth/login.html');
    loginLink.className = 'hidden items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300 lg:flex';
    loginLink.textContent = 'ورود / عضویت';

    const wishlistLink = document.createElement('a');
    wishlistLink.href = withBase(base, '/wishlist/index.html');
    wishlistLink.className = 'relative flex items-center text-slate-500 transition-colors hover:text-primary';
    const wishlistIcon = document.createElement('iconify-icon');
    wishlistIcon.setAttribute('icon', 'mdi:heart-outline');
    wishlistIcon.setAttribute('width', '22');
    const wishlistBadge = document.createElement('span');
    wishlistBadge.className = 'absolute -top-2 -left-2 rounded-full bg-red-500 px-1.5 text-xs text-white';
    wishlistBadge.textContent = String(getWishlist().length);
    wishlistBadge.dataset.element = 'wishlist-count';
    wishlistLink.append(wishlistIcon, wishlistBadge);

    const cartLink = document.createElement('a');
    cartLink.href = withBase(base, '/cart/index.html');
    cartLink.className = 'relative flex items-center text-slate-500 transition-colors hover:text-primary';
    const cartIcon = document.createElement('iconify-icon');
    cartIcon.setAttribute('icon', 'mdi:cart-outline');
    cartIcon.setAttribute('width', '22');
    const cartBadge = document.createElement('span');
    cartBadge.className = 'absolute -top-2 -left-2 rounded-full bg-primary px-1.5 text-xs text-white';
    cartBadge.textContent = String(getCartCount());
    cartBadge.dataset.element = 'cart-count';
    cartLink.append(cartIcon, cartBadge);

    const menuButton = document.createElement('button');
    menuButton.className = 'flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300 lg:hidden';
    menuButton.setAttribute('type', 'button');
    menuButton.dataset.element = 'menu-toggle';
    const menuIcon = document.createElement('iconify-icon');
    menuIcon.setAttribute('icon', 'mdi:menu');
    menuIcon.setAttribute('width', '24');
    menuButton.appendChild(menuIcon);

    actions.append(loginLink, wishlistLink, cartLink, menuButton);

    container.append(brand, nav, actions);

    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu hidden border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 lg:hidden';
    const mobileNav = document.createElement('nav');
    mobileNav.className = 'flex flex-col gap-3 text-sm';
    links.forEach(({ href, label }) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      link.className = 'rounded-lg px-4 py-2 text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary dark:text-slate-300';
      mobileNav.appendChild(link);
    });
    const authLink = document.createElement('a');
    authLink.href = withBase(base, '/auth/login.html');
    authLink.textContent = 'ورود / عضویت';
    authLink.className = 'rounded-lg px-4 py-2 font-medium text-primary';
    mobileNav.appendChild(authLink);
    mobileMenu.appendChild(mobileNav);
    mobileMenu.dataset.element = 'mobile-menu';

    this.append(container, mobileMenu);

    menuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

customElements.define('site-header', SiteHeader);
