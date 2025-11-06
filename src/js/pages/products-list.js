import '../bootstrap.js';
import { getBrands, filterProducts, paginateProducts, formatPrice } from '../services/products.js';
import { clearChildren, create, qs } from '../utils/dom.js';

const state = {
  search: '',
  category: 'all',
  minPrice: '',
  maxPrice: '',
  discount: '',
  brand: 'all',
  stock: 'all',
  rating: 0,
  page: 1
};

function syncStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  state.category = params.get('category') || 'all';
  state.search = params.get('q') || '';
  state.page = Number(params.get('page') || 1);
}

function updateUrl() {
  const params = new URLSearchParams();
  if (state.category !== 'all') params.set('category', state.category);
  if (state.search) params.set('q', state.search);
  if (state.page > 1) params.set('page', String(state.page));
  const query = params.toString();
  const newUrl = query ? `?${query}` : window.location.pathname;
  window.history.replaceState({}, '', newUrl);
}

function renderProductsGrid(products) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  clearChildren(grid);
  if (products.length === 0) {
    const empty = create('div', { className: 'rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400', text: 'هیچ محصولی یافت نشد.' });
    grid.appendChild(empty);
    return;
  }
  products.forEach((product) => {
    const card = document.createElement('product-card');
    card.data = product;
    grid.appendChild(card);
  });
}

function renderPagination(meta) {
  const container = document.getElementById('productsPagination');
  if (!container) return;
  clearChildren(container);
  if (meta.pages <= 1) {
    return;
  }
  for (let page = 1; page <= meta.pages; page += 1) {
    const button = create('button', {
      className: `min-w-[2.5rem] rounded-full border px-3 py-1 text-sm transition ${page === meta.page ? 'border-primary text-primary' : 'border-slate-200 text-slate-500 hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300'}`,
      text: String(page)
    });
    button.type = 'button';
    button.addEventListener('click', () => {
      state.page = page;
      updateUrl();
      applyFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    container.appendChild(button);
  }
}

function renderSummary(meta) {
  const summary = document.getElementById('productsCount');
  if (summary) {
    summary.textContent = `${meta.total} محصول`;
  }
}

function populateFilters() {
  const brandSelect = qs('#brandFilter');
  if (brandSelect) {
    clearChildren(brandSelect);
    const defaultOption = create('option', { text: 'همه برندها' });
    defaultOption.value = 'all';
    brandSelect.appendChild(defaultOption);
    getBrands().forEach((brand) => {
      const option = create('option', { text: brand });
      option.value = brand;
      brandSelect.appendChild(option);
    });
    brandSelect.value = state.brand;
  }
  const categorySelect = qs('#categoryFilter');
  if (categorySelect) {
    categorySelect.value = state.category;
  }
  const searchInput = qs('#searchInput');
  if (searchInput) {
    searchInput.value = state.search;
  }
}

function handleFiltersChange() {
  const form = qs('#filtersForm');
  if (!form) return;
  form.addEventListener('input', () => {
    state.search = form.querySelector('#searchInput')?.value ?? '';
    state.category = form.querySelector('#categoryFilter')?.value ?? 'all';
    state.minPrice = form.querySelector('#minPrice')?.value ?? '';
    state.maxPrice = form.querySelector('#maxPrice')?.value ?? '';
    state.discount = form.querySelector('#discountFilter')?.value ?? '';
    state.brand = form.querySelector('#brandFilter')?.value ?? 'all';
    state.stock = form.querySelector('#stockFilter')?.value ?? 'all';
    state.rating = Number(form.querySelector('#ratingFilter')?.value ?? 0);
    state.page = 1;
    updateUrl();
    applyFilters();
  });
}

function applyFilters() {
  const products = filterProducts(state);
  const meta = paginateProducts(products, state.page, 12);
  renderProductsGrid(meta.items);
  renderPagination(meta);
  renderSummary(meta);
  renderActiveFilters();
}

function renderActiveFilters() {
  const container = document.getElementById('activeFilters');
  if (!container) return;
  clearChildren(container);
  const active = [];
  if (state.search) active.push({ label: `جستجو: ${state.search}`, key: 'search' });
  if (state.category !== 'all') active.push({ label: `دسته: ${state.category}`, key: 'category' });
  if (state.brand !== 'all') active.push({ label: `برند: ${state.brand}`, key: 'brand' });
  if (state.minPrice) active.push({ label: `حداقل قیمت: ${formatPrice(state.minPrice)}`, key: 'minPrice' });
  if (state.maxPrice) active.push({ label: `حداکثر قیمت: ${formatPrice(state.maxPrice)}`, key: 'maxPrice' });
  if (state.discount) active.push({ label: `حداقل تخفیف: ${state.discount}%`, key: 'discount' });
  if (state.stock !== 'all') active.push({ label: state.stock === 'in' ? 'موجود' : 'ناموجود', key: 'stock' });
  if (state.rating) active.push({ label: `حداقل امتیاز: ${state.rating}`, key: 'rating' });

  if (active.length === 0) {
    const text = create('span', { className: 'text-sm text-slate-400', text: 'هیچ فیلتری فعال نیست.' });
    container.appendChild(text);
    return;
  }

  active.forEach((item) => {
    const pill = create('button', {
      className: 'flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary',
      text: item.label
    });
    pill.type = 'button';
    pill.addEventListener('click', () => {
      if (item.key === 'search') state.search = '';
      if (item.key === 'category') state.category = 'all';
      if (item.key === 'brand') state.brand = 'all';
      if (item.key === 'minPrice') state.minPrice = '';
      if (item.key === 'maxPrice') state.maxPrice = '';
      if (item.key === 'discount') state.discount = '';
      if (item.key === 'stock') state.stock = 'all';
      if (item.key === 'rating') state.rating = 0;
      populateFilters();
      updateUrl();
      applyFilters();
    });
    container.appendChild(pill);
  });
}

function initClearButton() {
  const button = qs('#clearAllFilters');
  if (!button) return;
  button.addEventListener('click', () => {
    state.search = '';
    state.category = 'all';
    state.minPrice = '';
    state.maxPrice = '';
    state.discount = '';
    state.brand = 'all';
    state.stock = 'all';
    state.rating = 0;
    state.page = 1;
    populateFilters();
    updateUrl();
    applyFilters();
  });
}

syncStateFromUrl();

document.addEventListener('DOMContentLoaded', () => {
  populateFilters();
  handleFiltersChange();
  initClearButton();
  applyFilters();
});
