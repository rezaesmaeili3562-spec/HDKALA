import { addToCart } from '../services/cart.js';
import { toggleWishlist, getWishlist, toggleCompare, getCompareList } from '../services/lists.js';
import { formatPrice } from '../services/products.js';
import { showNotification } from '../services/notifications.js';
import { resolvePath } from '../utils/base-path.js';

export class ProductCard extends HTMLElement {
  connectedCallback() {
    const product = this.product ?? this.dataset.product ? JSON.parse(this.dataset.product) : null;
    if (!product) {
      return;
    }
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.className = 'flex flex-col rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900';

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'relative flex h-48 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800';
    if (product.discount > 0) {
      const badge = document.createElement('span');
      badge.className = 'absolute right-3 top-3 rounded-full bg-red-500 px-2 py-1 text-xs text-white';
      badge.textContent = `${product.discount}% تخفیف`;
      imageWrapper.appendChild(badge);
    }
    if (product.img) {
      const image = document.createElement('img');
      image.src = product.img;
      image.alt = product.name;
      image.className = 'h-full w-full rounded-xl object-cover';
      imageWrapper.appendChild(image);
    } else {
      const icon = document.createElement('iconify-icon');
      icon.setAttribute('icon', 'mdi:image-outline');
      icon.setAttribute('width', '48');
      icon.className = 'text-slate-400';
      imageWrapper.appendChild(icon);
    }

    const body = document.createElement('div');
    body.className = 'flex flex-1 flex-col gap-3 py-4';

    const title = document.createElement('a');
    title.href = resolvePath(`/products/detail.html?id=${product.id}`);
    title.textContent = product.name;
    title.className = 'line-clamp-2 font-semibold text-slate-800 hover:text-primary dark:text-slate-100';

    const price = document.createElement('div');
    price.className = 'flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400';
    const final = document.createElement('span');
    final.className = 'text-lg font-bold text-primary';
    const finalPrice = product.discount > 0 ? Math.round(product.price * (1 - product.discount / 100)) : product.price;
    final.textContent = formatPrice(finalPrice);
    price.appendChild(final);
    if (product.discount > 0) {
      const base = document.createElement('span');
      base.className = 'text-xs text-slate-400 line-through';
      base.textContent = formatPrice(product.price);
      price.appendChild(base);
    }

    const status = document.createElement('div');
    status.className = 'flex flex-wrap gap-2 text-xs';
    if (product.status === 'new') {
      const badge = document.createElement('span');
      badge.className = 'rounded-full bg-green-100 px-2 py-1 text-green-600';
      badge.textContent = 'جدید';
      status.appendChild(badge);
    }
    if (product.status === 'hot') {
      const badge = document.createElement('span');
      badge.className = 'rounded-full bg-red-100 px-2 py-1 text-red-600';
      badge.textContent = 'پرفروش';
      status.appendChild(badge);
    }

    const actions = document.createElement('div');
    actions.className = 'flex items-center justify-between gap-2 pt-2';

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90';
    addBtn.textContent = 'افزودن به سبد';

    const wishlistBtn = document.createElement('button');
    wishlistBtn.type = 'button';
    wishlistBtn.className = 'flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-red-400 hover:text-red-500 dark:border-slate-700 dark:text-slate-300';
    const wishlistIcon = document.createElement('iconify-icon');
    wishlistIcon.setAttribute('icon', getWishlist().includes(product.id) ? 'mdi:heart' : 'mdi:heart-outline');
    wishlistIcon.setAttribute('width', '20');
    wishlistBtn.appendChild(wishlistIcon);

    const compareBtn = document.createElement('button');
    compareBtn.type = 'button';
    compareBtn.className = 'flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300';
    const compareIcon = document.createElement('iconify-icon');
    compareIcon.setAttribute('icon', getCompareList().includes(product.id) ? 'mdi:scale-balance' : 'mdi:scale-balance');
    compareIcon.setAttribute('width', '20');
    compareBtn.appendChild(compareIcon);

    addBtn.addEventListener('click', () => {
      addToCart(product.id, 1);
      showNotification('محصول به سبد خرید اضافه شد.');
      const badge = document.querySelector('site-header [data-element="cart-count"]');
      if (badge) {
        const current = Number(badge.textContent) || 0;
        badge.textContent = String(current + 1);
      }
    });

    wishlistBtn.addEventListener('click', () => {
      const list = toggleWishlist(product.id);
      wishlistIcon.setAttribute('icon', list.includes(product.id) ? 'mdi:heart' : 'mdi:heart-outline');
      showNotification('به علاقه‌مندی‌ها به‌روزرسانی شد.');
      const badge = document.querySelector('site-header [data-element="wishlist-count"]');
      if (badge) {
        badge.textContent = String(list.length);
      }
    });

    compareBtn.addEventListener('click', () => {
      const list = toggleCompare(product.id);
      showNotification('لیست مقایسه به‌روزرسانی شد.');
      compareIcon.classList.toggle('text-primary', list.includes(product.id));
    });

    actions.append(addBtn, wishlistBtn, compareBtn);
    body.append(title, price, status, actions);
    this.append(imageWrapper, body);
  }

  set data(product) {
    this.product = product;
    this.connectedCallback();
  }
}

customElements.define('product-card', ProductCard);
