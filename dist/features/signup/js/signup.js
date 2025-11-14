import { validateSignup } from '../../../shared/js/validation.js';
import { saveUser } from '../../../shared/js/state.js';
import { showNotification } from '../../../shared/js/ui.js';

export default function signupController(root) {
  const form = root.querySelector('[data-signup-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const errors = validateSignup(payload);

    if (Object.keys(errors).length > 0) {
      const message = Object.values(errors).join('، ');
      showNotification(message, 'warning');
      return;
    }

    saveUser({ email: payload.email, name: payload.name });
    showNotification('ثبت نام با موفقیت انجام شد', 'success');
    window.location.hash = '#home';
  });
}
