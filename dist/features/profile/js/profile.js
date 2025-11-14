import { loadUser, clearUser } from '../../../shared/js/state.js';
import { showNotification } from '../../../shared/js/ui.js';

export default function profileController(root) {
  const nameEl = root.querySelector('[data-profile-name]');
  const emailEl = root.querySelector('[data-profile-email]');
  const logoutButton = root.querySelector('[data-logout]');

  const user = loadUser();
  if (user) {
    if (nameEl) nameEl.textContent = user.name ?? 'کاربر HDKALA';
    if (emailEl) emailEl.textContent = user.email ?? '-';
  } else {
    if (nameEl) nameEl.textContent = 'کاربر مهمان';
    if (emailEl) emailEl.textContent = '-';
  }

  logoutButton?.addEventListener('click', () => {
    clearUser();
    showNotification('از حساب کاربری خارج شدید', 'warning');
    window.location.hash = '#home';
  });
}
