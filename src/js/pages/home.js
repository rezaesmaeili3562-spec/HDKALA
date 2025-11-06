import '../bootstrap.js';
import { getFeaturedProducts, getLatestProducts } from '../services/products.js';
import { SAMPLE_BLOGS, SAMPLE_STATS } from '../data/sample-data.js';
import { clearChildren, create } from '../utils/dom.js';
import { resolvePath } from '../utils/base-path.js';

function renderProducts(container, products) {
  if (!container) return;
  clearChildren(container);
  products.forEach((product) => {
    const card = document.createElement('product-card');
    card.data = product;
    container.appendChild(card);
  });
}

function renderBlogs(container, blogs) {
  if (!container) return;
  clearChildren(container);
  blogs.forEach((blog) => {
    const article = create('article', { className: 'rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900' });
    const title = create('h3', { className: 'text-lg font-semibold text-slate-800 dark:text-slate-100', text: blog.title });
    const meta = create('div', { className: 'text-xs text-slate-400', text: blog.date });
    const excerpt = create('p', { className: 'mt-3 text-sm leading-6 text-slate-500 dark:text-slate-300', text: blog.excerpt });
    const link = create('a', { className: 'mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary', text: 'مطالعه بیشتر' });
    link.href = resolvePath(`/blog/detail.html?id=${blog.id}`);
    article.append(title, meta, excerpt, link);
    container.appendChild(article);
  });
}

function renderStats(stats) {
  const productsEl = document.querySelector('[data-element="stat-products"]');
  const ordersEl = document.querySelector('[data-element="stat-orders"]');
  const usersEl = document.querySelector('[data-element="stat-users"]');
  if (productsEl) productsEl.textContent = `${stats.products}+`;
  if (ordersEl) ordersEl.textContent = `${stats.orders}+`;
  if (usersEl) usersEl.textContent = `${stats.users}+`;
}

function initCategoryLinks() {
  document.querySelectorAll('[data-category-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const { category } = link.dataset;
      window.location.href = resolvePath(`/products/index.html?category=${category}`);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts(document.getElementById('featuredProducts'), getFeaturedProducts());
  renderProducts(document.getElementById('latestProducts'), getLatestProducts(4));
  renderBlogs(document.getElementById('homeBlogList'), SAMPLE_BLOGS);
  renderStats(SAMPLE_STATS);
  initCategoryLinks();
});
