import '../bootstrap.js';
import { getCurrentUser } from '../services/auth.js';
import { clearChildren, create } from '../utils/dom.js';

const SAMPLE_ORDERS = [
  { id: 'O-1001', status: 'تحویل شده', total: 3250000, date: '۱۴۰۲/۱۰/۱۰' },
  { id: 'O-1002', status: 'در حال آماده‌سازی', total: 1580000, date: '۱۴۰۲/۱۰/۱۵' }
];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('ordersList');
  if (!container) return;
  clearChildren(container);
  const user = getCurrentUser();
  if (!user) {
    container.appendChild(create('div', { className: 'rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400', text: 'برای مشاهده سفارش‌ها وارد شوید.' }));
    return;
  }
  SAMPLE_ORDERS.forEach((order) => {
    const card = create('div', { className: 'rounded-2xl border border-slate-200 p-4 dark:border-slate-700' });
    card.append(
      create('div', { className: 'text-lg font-semibold text-slate-800 dark:text-slate-100', text: order.id }),
      create('div', { className: 'text-sm text-slate-500 dark:text-slate-300', text: `وضعیت: ${order.status}` }),
      create('div', { className: 'text-sm text-slate-500 dark:text-slate-300', text: `مبلغ: ${order.total.toLocaleString('fa-IR')} تومان` }),
      create('div', { className: 'text-xs text-slate-400', text: order.date })
    );
    container.appendChild(card);
  });
});
