import { fetchProductById, formatPrice } from '../../../shared/js/api.js';
import { addToCart } from '../../../shared/js/cart.js';
import { showNotification } from '../../../shared/js/ui.js';

export default async function productController(root, params) {
  const wrapper = root.querySelector('[data-product-wrapper]');
  if (!wrapper) return;

  const productId = params?.id;
  if (!productId) {
    wrapper.innerHTML = '<p class="rounded-2xl bg-rose-50 p-6 text-sm font-semibold text-rose-600">شناسه محصول نامعتبر است.</p>';
    return;
  }

  const product = await fetchProductById(productId);
  if (!product) {
    wrapper.innerHTML = '<p class="rounded-2xl bg-rose-50 p-6 text-sm font-semibold text-rose-600">محصول یافت نشد.</p>';
    return;
  }

  wrapper.innerHTML = `
    <figure class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <img src="${product.image}" alt="${product.name}" class="h-full w-full object-cover" />
    </figure>
    <div class="space-y-6">
      <header class="space-y-2">
        <p class="text-xs font-medium text-indigo-500">${product.badge}</p>
        <h1 class="text-2xl font-bold text-slate-900">${product.name}</h1>
        <p class="text-sm text-slate-600">${product.description}</p>
      </header>
      <div class="rounded-2xl bg-slate-50 p-5">
        <p class="text-sm text-slate-500">قیمت</p>
        <p class="mt-1 text-xl font-bold text-indigo-600">${formatPrice(product.price)}</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button type="button" data-buy-now class="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500">افزودن به سبد خرید</button>
        <a href="#checkout" class="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-indigo-500 hover:text-indigo-600">تسویه سریع</a>
      </div>
    </div>
  `;

  const buyButton = wrapper.querySelector('[data-buy-now]');
  buyButton?.addEventListener('click', () => {
    addToCart(product, 1);
    showNotification('محصول به سبد خرید اضافه شد', 'success');
  });
}
