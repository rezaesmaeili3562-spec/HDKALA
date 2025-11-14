import { validateLogin } from '../../../shared/js/validation.js';
import { saveUser } from '../../../shared/js/state.js';
import { showNotification } from '../../../shared/js/ui.js';

export default function loginController(root) {
  const form = root.querySelector('[data-login-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const errors = validateLogin(payload);

    if (Object.keys(errors).length > 0) {
      const message = Object.values(errors).join('، ');
      showNotification(message, 'warning');
      return;
    }

    saveUser({ email: payload.email, name: payload.email.split('@')[0] });
    showNotification('ورود با موفقیت انجام شد', 'success');
    window.location.hash = '#home';
  });
}
