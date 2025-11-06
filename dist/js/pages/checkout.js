import '../bootstrap.js';
import { getCartItems, clearCart } from '../services/cart.js';
import { getProductById, formatPrice } from '../services/products.js';
import { clearChildren, create } from '../utils/dom.js';
import { showNotification } from '../services/notifications.js';

function renderSummary() {
  const container = document.getElementById('checkoutSummary');
  if (!container) return;
  clearChildren(container);
  const items = getCartItems();
  if (items.length === 0) {
    container.appendChild(create('div', { className: 'rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400', text: 'سبد خرید شما خالی است.' }));
    return;
  }
  let total = 0;
  items.forEach((item) => {
    const product = getProductById(item.id);
    if (!product) return;
    const finalPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
    total += finalPrice * item.qty;
    const row = create('div', { className: 'flex items-center justify-between text-sm text-slate-500 dark:text-slate-300' });
    row.append(
      create('span', { text: `${product.name} × ${item.qty}` }),
      create('span', { text: formatPrice(finalPrice * item.qty) })
    );
    container.appendChild(row);
  });
  container.appendChild(create('div', { className: 'mt-4 border-t border-slate-200 pt-4 text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-200', text: `مبلغ پرداختی: ${formatPrice(total)}` }));
}

function initCheckoutForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    showNotification('سفارش شما ثبت شد.');
    clearCart();
    form.reset();
    renderSummary();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderSummary();
  initCheckoutForm();
});
