import '../bootstrap.js';
import { showNotification } from '../services/notifications.js';

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    showNotification('پیام شما ارسال شد. کارشناسان ما به زودی با شما تماس می‌گیرند.');
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', initContactForm);
