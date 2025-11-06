import '../bootstrap.js';
import { getWishlist, toggleWishlist } from '../services/lists.js';
import { addToCart } from '../services/cart.js';
import { getProductById, formatPrice } from '../services/products.js';
import { clearChildren, create } from '../utils/dom.js';
import { resolvePath } from '../utils/base-path.js';
import { showNotification } from '../services/notifications.js';

function renderWishlist() {
  const container = document.getElementById('wishlistItems');
  if (!container) return;
  clearChildren(container);
  const list = getWishlist();
  if (list.length === 0) {
    container.appendChild(create('div', { className: 'rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400', text: 'لیست علاقه‌مندی شما خالی است.' }));
    return;
  }
  list.forEach((id) => {
    const product = getProductById(id);
    if (!product) return;
    const row = create('div', { className: 'flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700 md:flex-row md:items-center' });
    const info = create('div', { className: 'flex-1 space-y-2' });
    const title = create('a', { className: 'text-lg font-semibold text-slate-800 hover:text-primary dark:text-slate-100', text: product.name });
    title.href = resolvePath(`/products/detail.html?id=${product.id}`);
    const price = create('div', { className: 'text-sm text-slate-500 dark:text-slate-300', text: formatPrice(product.price) });
    info.append(title, price);

    const actions = create('div', { className: 'flex items-center gap-3' });
    const addBtn = create('button', { className: 'rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90', text: 'افزودن به سبد' });
    addBtn.type = 'button';
    addBtn.addEventListener('click', () => {
      addToCart(product.id, 1);
      showNotification('محصول به سبد خرید اضافه شد.');
    });
    const removeBtn = create('button', { className: 'rounded-full border border-red-300 px-4 py-2 text-sm text-red-500 transition hover:bg-red-50 dark:border-red-400/40 dark:hover:bg-red-500/10', text: 'حذف' });
    removeBtn.type = 'button';
    removeBtn.addEventListener('click', () => {
      toggleWishlist(product.id);
      renderWishlist();
    });
    actions.append(addBtn, removeBtn);
    row.append(info, actions);
    container.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', renderWishlist);
