import '../bootstrap.js';
import { getProductById, formatPrice } from '../services/products.js';
import { addToCart } from '../services/cart.js';
import { toggleWishlist, getWishlist, toggleCompare, getCompareList } from '../services/lists.js';
import { showNotification } from '../services/notifications.js';
import { clearChildren, create } from '../utils/dom.js';

function renderProduct(product) {
  const title = document.getElementById('productTitle');
  const description = document.getElementById('productDescription');
  const price = document.getElementById('productPrice');
  const originalPrice = document.getElementById('productOriginalPrice');
  const badges = document.getElementById('productBadges');
  const features = document.getElementById('productFeatures');
  const specs = document.getElementById('productSpecs');
  const gallery = document.getElementById('productGallery');

  if (title) title.textContent = product.name;
  if (description) description.textContent = product.desc;
  if (price) price.textContent = formatPrice(product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price);
  if (originalPrice) {
    if (product.discount > 0) {
      originalPrice.textContent = formatPrice(product.price);
      originalPrice.classList.remove('hidden');
    } else {
      originalPrice.classList.add('hidden');
    }
  }
  if (badges) {
    clearChildren(badges);
    if (product.status === 'new') {
      const badge = create('span', { className: 'rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600', text: 'جدید' });
      badges.appendChild(badge);
    }
    if (product.status === 'hot') {
      const badge = create('span', { className: 'rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600', text: 'پرفروش' });
      badges.appendChild(badge);
    }
  }

  if (features) {
    clearChildren(features);
    if (product.features.length === 0) {
      features.appendChild(create('li', { className: 'text-slate-500', text: 'ویژگی ثبت نشده است.' }));
    } else {
      product.features.forEach((feature) => {
        features.appendChild(create('li', { className: 'text-sm text-slate-600 dark:text-slate-300', text: feature }));
      });
    }
  }

  if (specs) {
    clearChildren(specs);
    const entries = Object.entries(product.specifications || {});
    if (entries.length === 0) {
      specs.appendChild(create('div', { className: 'text-sm text-slate-500', text: 'مشخصات ثبت نشده است.' }));
    } else {
      entries.forEach(([key, value]) => {
        const row = create('div', { className: 'flex items-center justify-between rounded-lg bg-slate-100 px-4 py-2 text-sm dark:bg-slate-800' });
        row.appendChild(create('span', { className: 'font-medium text-slate-600 dark:text-slate-200', text: key }));
        row.appendChild(create('span', { className: 'text-slate-600 dark:text-slate-300', text: value }));
        specs.appendChild(row);
      });
    }
  }

  if (gallery) {
    clearChildren(gallery);
    const placeholder = create('div', { className: 'flex h-72 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800' });
    if (product.img) {
      const image = document.createElement('img');
      image.src = product.img;
      image.alt = product.name;
      image.className = 'h-full w-full rounded-xl object-cover';
      placeholder.appendChild(image);
    } else {
      const icon = document.createElement('iconify-icon');
      icon.setAttribute('icon', 'mdi:image-outline');
      icon.setAttribute('width', '64');
      icon.className = 'text-slate-400';
      placeholder.appendChild(icon);
    }
    gallery.appendChild(placeholder);
  }

  const wishlistButton = document.getElementById('wishlistToggle');
  const compareButton = document.getElementById('compareToggle');
  if (wishlistButton) {
    const update = () => {
      wishlistButton.textContent = getWishlist().includes(product.id) ? 'حذف از علاقه‌مندی' : 'افزودن به علاقه‌مندی';
    };
    wishlistButton.addEventListener('click', () => {
      toggleWishlist(product.id);
      update();
      showNotification('لیست علاقه‌مندی به‌روزرسانی شد.');
    });
    update();
  }
  if (compareButton) {
    const update = () => {
      compareButton.textContent = getCompareList().includes(product.id) ? 'حذف از مقایسه' : 'افزودن به مقایسه';
    };
    compareButton.addEventListener('click', () => {
      toggleCompare(product.id);
      update();
      showNotification('لیست مقایسه به‌روزرسانی شد.');
    });
    update();
  }

  const addToCartBtn = document.getElementById('addToCartButton');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      addToCart(product.id, 1);
      showNotification('محصول به سبد خرید اضافه شد.');
    });
  }
}

function showNotFound() {
  const container = document.getElementById('productDetail');
  if (!container) return;
  clearChildren(container);
  const message = create('div', { className: 'rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400', text: 'محصول مورد نظر یافت نشد.' });
  container.appendChild(message);
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    showNotFound();
    return;
  }
  const product = getProductById(id);
  if (!product) {
    showNotFound();
    return;
  }
  renderProduct(product);
});
