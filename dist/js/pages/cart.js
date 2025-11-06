import '../bootstrap.js';
import { getCartItems, updateCartItem, removeFromCart, clearCart } from '../services/cart.js';
import { getProductById, formatPrice } from '../services/products.js';
import { clearChildren, create } from '../utils/dom.js';
import { resolvePath } from '../utils/base-path.js';
import { showNotification } from '../services/notifications.js';

function calculateTotals(items) {
  return items.reduce(
    (acc, item) => {
      const product = getProductById(item.id);
      if (!product) return acc;
      const finalPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
      acc.subtotal += finalPrice * item.qty;
      if (product.discount > 0) {
        acc.savings += product.price * item.qty - finalPrice * item.qty;
      }
      return acc;
    },
    { subtotal: 0, savings: 0 }
  );
}

function renderTotals(items) {
  const totals = calculateTotals(items);
  const subtotalEl = document.getElementById('cartSubtotal');
  const savingsEl = document.getElementById('cartSavings');
  const payableEl = document.getElementById('cartPayable');
  if (subtotalEl) subtotalEl.textContent = formatPrice(totals.subtotal);
  if (savingsEl) savingsEl.textContent = totals.savings > 0 ? formatPrice(totals.savings) : '۰ تومان';
  if (payableEl) payableEl.textContent = formatPrice(totals.subtotal);
}

function renderItems() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  clearChildren(container);
  const items = getCartItems();
  if (items.length === 0) {
    const empty = create('div', { className: 'rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400', text: 'سبد خرید شما خالی است.' });
    container.appendChild(empty);
    renderTotals([]);
    return;
  }
  items.forEach((item) => {
    const product = getProductById(item.id);
    if (!product) return;
    const row = create('div', { className: 'flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700 md:flex-row md:items-center' });

    const info = create('div', { className: 'flex-1 space-y-2' });
    const title = create('a', { className: 'text-lg font-semibold text-slate-800 hover:text-primary dark:text-slate-100', text: product.name });
    title.href = resolvePath(`/products/detail.html?id=${product.id}`);
    const price = create('div', { className: 'text-sm text-slate-500 dark:text-slate-300', text: formatPrice(product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price) });
    info.append(title, price);

    const quantity = create('div', { className: 'flex items-center gap-3' });
    const decrease = create('button', { className: 'flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-lg dark:border-slate-700', text: '−' });
    decrease.type = 'button';
    const qty = create('span', { className: 'w-10 text-center text-sm font-medium', text: String(item.qty) });
    const increase = create('button', { className: 'flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-lg dark:border-slate-700', text: '+' });
    increase.type = 'button';
    decrease.addEventListener('click', () => {
      const next = Math.max(1, item.qty - 1);
      updateCartItem(item.id, next);
      renderItems();
    });
    increase.addEventListener('click', () => {
      updateCartItem(item.id, item.qty + 1);
      renderItems();
    });
    quantity.append(decrease, qty, increase);

    const remove = create('button', { className: 'rounded-full border border-red-300 px-4 py-2 text-sm text-red-500 transition hover:bg-red-50 dark:border-red-400/40 dark:hover:bg-red-500/10', text: 'حذف' });
    remove.type = 'button';
    remove.addEventListener('click', () => {
      removeFromCart(item.id);
      showNotification('محصول از سبد حذف شد.', 'success');
      renderItems();
    });

    row.append(info, quantity, remove);
    container.appendChild(row);
  });

  renderTotals(items);
}

function initClearCart() {
  const button = document.getElementById('clearCartButton');
  if (!button) return;
  button.addEventListener('click', () => {
    clearCart();
    renderItems();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderItems();
  initClearCart();
});
