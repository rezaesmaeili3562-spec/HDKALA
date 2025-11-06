import '../bootstrap.js';
import { SAMPLE_BLOGS } from '../data/sample-data.js';
import { clearChildren, create } from '../utils/dom.js';

function renderBlog(blog) {
  const container = document.getElementById('blogDetail');
  if (!container) return;
  clearChildren(container);
  const title = create('h1', { className: 'text-3xl font-bold text-slate-800 dark:text-slate-100', text: blog.title });
  const meta = create('div', { className: 'text-sm text-slate-400', text: blog.date });
  const body = create('p', { className: 'mt-6 leading-8 text-slate-600 dark:text-slate-300', text: blog.excerpt });
  container.append(title, meta, body);
}

function renderNotFound() {
  const container = document.getElementById('blogDetail');
  if (!container) return;
  clearChildren(container);
  container.appendChild(create('div', { className: 'rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400', text: 'مقاله یافت نشد.' }));
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const blog = SAMPLE_BLOGS.find((item) => item.id === id);
  if (!blog) {
    renderNotFound();
    return;
  }
  renderBlog(blog);
});
