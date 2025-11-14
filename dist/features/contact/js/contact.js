import { showNotification } from '../../../shared/js/ui.js';

export default function contactController(root) {
  const form = root.querySelector('[data-contact-form]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    form.reset();
    showNotification('پیام شما با موفقیت ارسال شد', 'success');
  });
}
