import { getCart, getCartSummary, clearCart } from '../../../shared/js/cart.js';
import { formatPrice } from '../../../shared/js/api.js';
import { showNotification } from '../../../shared/js/ui.js';
import { validateAddress } from '../../../shared/js/validation.js';

function renderSummary(root) {
  const summary = getCartSummary();
  root.querySelector('[data-checkout-subtotal]').textContent = formatPrice(summary.subtotal);
  root.querySelector('[data-checkout-shipping]').textContent = summary.shipping === 0 ? 'رایگان' : formatPrice(summary.shipping);
  root.querySelector('[data-checkout-total]').textContent = formatPrice(summary.total);
}

export default function checkoutController(root) {
  const form = root.querySelector('[data-checkout-form]');
  if (!form) return;

  renderSummary(root);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const cart = getCart();
    if (!cart.length) {
      showNotification('سبد خرید شما خالی است', 'warning');
      return;
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const errors = validateAddress(payload);

    if (Object.keys(errors).length > 0) {
      const message = Object.values(errors).join('، ');
      showNotification(message, 'warning');
      return;
    }

    clearCart();
    showNotification('سفارش شما با موفقیت ثبت شد', 'success');
    form.reset();
    renderSummary(root);
  });
}
