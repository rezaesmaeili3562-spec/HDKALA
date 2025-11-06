import '../bootstrap.js';
import { loginUser } from '../services/auth.js';
import { showNotification } from '../services/notifications.js';

function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = data.get('email');
    const password = data.get('password');
    try {
      loginUser({ email, password });
      showNotification('ورود با موفقیت انجام شد.');
      window.location.href = '/index.html';
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });
}

document.addEventListener('DOMContentLoaded', initLoginForm);
