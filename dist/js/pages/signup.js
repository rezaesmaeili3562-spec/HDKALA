import '../bootstrap.js';
import { registerUser } from '../services/auth.js';
import { showNotification } from '../services/notifications.js';

function initSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const password = data.get('password');
    const confirm = data.get('confirm');
    if (password !== confirm) {
      showNotification('رمز عبور و تکرار آن یکسان نیست.', 'error');
      return;
    }
    try {
      registerUser({ name, email, password });
      showNotification('حساب کاربری ایجاد شد.');
      window.location.href = '/index.html';
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });
}

document.addEventListener('DOMContentLoaded', initSignupForm);
