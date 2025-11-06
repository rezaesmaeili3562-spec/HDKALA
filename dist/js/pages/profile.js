import '../bootstrap.js';
import { getCurrentUser, logoutUser } from '../services/auth.js';
import { clearChildren, create } from '../utils/dom.js';

function renderProfile() {
  const container = document.getElementById('profileInfo');
  if (!container) return;
  clearChildren(container);
  const user = getCurrentUser();
  if (!user) {
    container.appendChild(create('div', { className: 'rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400', text: 'برای مشاهده اطلاعات حساب وارد شوید.' }));
    const link = create('a', { className: 'mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-white', text: 'ورود به حساب' });
    link.href = '/auth/login.html';
    container.appendChild(link);
    return;
  }
  container.append(
    create('div', { className: 'text-lg font-semibold text-slate-800 dark:text-slate-100', text: user.name }),
    create('div', { className: 'text-sm text-slate-500 dark:text-slate-300', text: user.email })
  );
  const logout = create('button', { className: 'mt-6 inline-flex items-center justify-center rounded-full border border-red-300 px-4 py-2 text-sm text-red-500 transition hover:bg-red-50 dark:border-red-400/40 dark:hover:bg-red-500/10', text: 'خروج از حساب' });
  logout.type = 'button';
  logout.addEventListener('click', () => {
    logoutUser();
    renderProfile();
  });
  container.appendChild(logout);
}

document.addEventListener('DOMContentLoaded', renderProfile);
