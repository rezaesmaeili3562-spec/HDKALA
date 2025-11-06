let container;

export function initNotifications() {
  container = document.getElementById('notification');
}

export function showNotification(message, type = 'success') {
  if (!container) return;
  const messageEl = container.querySelector('[data-element="message"]');
  if (messageEl) {
    messageEl.textContent = message;
  }
  container.dataset.type = type;
  container.classList.remove('opacity-0');
  clearTimeout(container._timeout);
  container._timeout = setTimeout(() => {
    container.classList.add('opacity-0');
  }, 3500);
}
