import '../bootstrap.js';
import { SAMPLE_BLOGS } from '../data/sample-data.js';
import { clearChildren, create } from '../utils/dom.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('blogList');
  if (!container) return;
  clearChildren(container);
  SAMPLE_BLOGS.forEach((blog) => {
    const article = create('article', { className: 'space-y-3 rounded-2xl border border-slate-200 p-6 dark:border-slate-700' });
    article.append(
      create('h3', { className: 'text-xl font-semibold text-slate-800 dark:text-slate-100', text: blog.title }),
      create('div', { className: 'text-xs text-slate-400', text: blog.date }),
      create('p', { className: 'text-sm leading-7 text-slate-500 dark:text-slate-300', text: blog.excerpt })
    );
    const link = create('a', { className: 'inline-flex items-center gap-2 text-sm font-medium text-primary', text: 'ادامه مطلب' });
    link.href = `/blog/detail.html?id=${blog.id}`;
    article.appendChild(link);
    container.appendChild(article);
  });
});
