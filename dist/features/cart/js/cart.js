import { getCart, updateCartItem, removeFromCart, clearCart, getCartSummary } from '../../../shared/js/cart.js';
import { formatPrice } from '../../../shared/js/api.js';
import { showNotification, formatNumber } from '../../../shared/js/ui.js';

function renderCartItems(container) {
  const items = getCart();
  if (!container) return;

  if (!items.length) {
    container.innerHTML = `
      <div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
        <p class="text-sm font-semibold text-slate-600">سبد خرید شما خالی است.</p>
        <a href="#products" class="mt-4 inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500">مشاهده محصولات</a>
      </div>
    `;
    return;
  }

  container.innerHTML = items
    .map(
      (item) => `
        <article class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          <img src="${item.image}" alt="${item.name}" class="h-28 w-28 rounded-xl object-cover" />
          <div class="flex-1 space-y-2">
            <h3 class="text-base font-semibold text-slate-900">${item.name}</h3>
            <p class="text-sm text-slate-500">قیمت واحد: ${formatPrice(item.price)}</p>
            <div class="flex items-center gap-3 text-xs text-slate-500">
              <span>تعداد</span>
              <div class="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1">
                <button type="button" data-quantity="minus" data-id="${item.id}" class="text-lg font-bold text-slate-500">−</button>
                <span data-quantity-value="${item.id}" class="w-6 text-center font-semibold text-slate-600">${formatNumber(item.quantity)}</span>
                <button type="button" data-quantity="plus" data-id="${item.id}" class="text-lg font-bold text-slate-500">+</button>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end gap-3">
            <p class="text-sm font-semibold text-indigo-600">${formatPrice(item.price * item.quantity)}</p>
            <button type="button" data-remove-item="${item.id}" class="text-xs font-semibold text-rose-500 transition hover:text-rose-600">حذف</button>
          </div>
        </article>
      `
    )
    .join('');
}

function renderSummary(root) {
  const summary = getCartSummary();
  const subtotalEl = root.querySelector('[data-cart-subtotal]');
  const shippingEl = root.querySelector('[data-cart-shipping]');
  const totalEl = root.querySelector('[data-cart-total]');

  if (subtotalEl) subtotalEl.textContent = formatPrice(summary.subtotal);
  if (shippingEl) shippingEl.textContent = summary.shipping === 0 ? 'رایگان' : formatPrice(summary.shipping);
  if (totalEl) totalEl.textContent = formatPrice(summary.total);
}

export default function cartController(root) {
  const cartList = root.querySelector('[data-cart-list]');
  const clearButton = root.querySelector('[data-clear-cart]');

  function refresh() {
    renderCartItems(cartList);
    renderSummary(root);
  }

  cartList?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const removeId = target.getAttribute('data-remove-item');
    if (removeId) {
      removeFromCart(removeId);
      showNotification('محصول از سبد خرید حذف شد', 'warning');
      refresh();
      return;
    }

    const quantityAction = target.getAttribute('data-quantity');
    const itemId = target.getAttribute('data-id');
    if (quantityAction && itemId) {
      const item = getCart().find((cartItem) => cartItem.id === itemId);
      if (!item) return;
      const delta = quantityAction === 'plus' ? 1 : -1;
      updateCartItem(itemId, item.quantity + delta);
      refresh();
    }
  });

  clearButton?.addEventListener('click', () => {
    clearCart();
    showNotification('سبد خرید خالی شد', 'warning');
    refresh();
  });

  refresh();
}
