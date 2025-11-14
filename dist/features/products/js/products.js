import { fetchProducts, formatPrice, fetchProductById } from '../../../shared/js/api.js';
import { addToCart } from '../../../shared/js/cart.js';
import { showNotification } from '../../../shared/js/ui.js';

function renderProducts(list, container) {
  if (!container) return;
  if (!list.length) {
    container.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
        <p class="text-sm font-semibold text-slate-600">محصولی یافت نشد.</p>
        <p class="text-xs text-slate-500">شرایط جستجو یا دسته‌بندی را تغییر دهید.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list
    .map(
      (product) => `
        <article class="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div class="relative h-44 w-full overflow-hidden">
            <img src="${product.image}" alt="${product.name}" class="h-full w-full object-cover" loading="lazy" />
          </div>
          <div class="flex flex-1 flex-col gap-3 p-5">
            <div class="space-y-1">
              <h3 class="text-base font-semibold text-slate-900">${product.name}</h3>
              <p class="text-sm text-slate-600">${product.description}</p>
            </div>
            <div class="mt-auto flex items-center justify-between">
              <span class="text-sm font-semibold text-indigo-600">${formatPrice(product.price)}</span>
              <div class="flex items-center gap-3">
                <a href="#product/${product.id}" class="text-xs font-semibold text-slate-500 transition hover:text-indigo-500">جزئیات</a>
                <button type="button" data-add-to-cart="${product.id}" class="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500">افزودن</button>
              </div>
            </div>
          </div>
        </article>
      `
    )
    .join('');
}

async function handleAddToCart(id) {
  const product = await fetchProductById(id);
  if (!product) {
    showNotification('محصول مورد نظر یافت نشد', 'warning');
    return;
  }
  addToCart(product, 1);
  showNotification('محصول به سبد خرید اضافه شد', 'success');
}

export default function productsController(root) {
  const filterForm = root.querySelector('[data-filter-form]');
  const productsList = root.querySelector('[data-products-list]');
  const productsCount = root.querySelector('[data-products-count]');
  const resetFiltersButton = root.querySelector('[data-reset-filters]');

  async function applyFilters(formData) {
    const filters = Object.fromEntries(formData.entries());
    const list = await fetchProducts(filters);
    renderProducts(list, productsList);
    if (productsCount) {
      productsCount.textContent = list.length.toString();
    }
  }

  filterForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(filterForm);
    await applyFilters(formData);
  });

  resetFiltersButton?.addEventListener('click', async () => {
    filterForm?.reset();
    await applyFilters(new FormData(filterForm ?? new HTMLFormElement()));
  });

  productsList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-to-cart]');
    if (!button) return;
    const productId = button.getAttribute('data-add-to-cart');
    if (productId) {
      handleAddToCart(productId);
    }
  });

  applyFilters(new FormData(filterForm ?? new HTMLFormElement()));
}
