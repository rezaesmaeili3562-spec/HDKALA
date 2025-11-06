import '../bootstrap.js';
import { getCompareList, toggleCompare } from '../services/lists.js';
import { getProductById, formatPrice } from '../services/products.js';
import { clearChildren, create } from '../utils/dom.js';
import { resolvePath } from '../utils/base-path.js';

function renderCompare() {
  const container = document.getElementById('compareItems');
  if (!container) return;
  clearChildren(container);
  const list = getCompareList();
  if (list.length === 0) {
    container.appendChild(create('div', { className: 'rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400', text: 'لیست مقایسه شما خالی است.' }));
    return;
  }
  const table = create('div', { className: 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' });
  list.forEach((id) => {
    const product = getProductById(id);
    if (!product) return;
    const card = create('div', { className: 'flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700' });
    const title = create('a', { className: 'text-lg font-semibold text-slate-800 hover:text-primary dark:text-slate-100', text: product.name });
    title.href = resolvePath(`/products/detail.html?id=${product.id}`);
    const price = create('div', { className: 'text-sm text-slate-500 dark:text-slate-300', text: formatPrice(product.price) });
    const features = create('ul', { className: 'space-y-2 text-sm text-slate-600 dark:text-slate-300' });
    if (product.features.length === 0) {
      features.appendChild(create('li', { text: 'ویژگی ثبت نشده است.' }));
    } else {
      product.features.slice(0, 5).forEach((feature) => {
        features.appendChild(create('li', { text: feature }));
      });
    }
    const removeBtn = create('button', { className: 'rounded-full border border-red-300 px-4 py-2 text-sm text-red-500 transition hover:bg-red-50 dark:border-red-400/40 dark:hover:bg-red-500/10', text: 'حذف از مقایسه' });
    removeBtn.type = 'button';
    removeBtn.addEventListener('click', () => {
      toggleCompare(product.id);
      renderCompare();
    });
    card.append(title, price, features, removeBtn);
    table.appendChild(card);
  });
  container.appendChild(table);
}

document.addEventListener('DOMContentLoaded', renderCompare);
