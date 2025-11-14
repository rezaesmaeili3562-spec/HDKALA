import { fetchProducts, formatPrice } from '../../../shared/js/api.js';
import { showNotification } from '../../../shared/js/ui.js';

function createMetricCard(metric) {
  return `
    <article class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-xs font-medium text-slate-500">${metric.label}</p>
      <p class="text-2xl font-bold text-slate-900">${metric.value}</p>
      <p class="text-xs text-${metric.trend >= 0 ? 'emerald' : 'rose'}-500">${metric.trend >= 0 ? '▲' : '▼'} ${Math.abs(metric.trend)}٪ نسبت به ماه قبل</p>
    </article>
  `;
}

function createProductCard(product) {
  return `
    <article class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 class="text-sm font-semibold text-slate-900">${product.name}</h3>
      <p class="text-xs text-slate-500">${product.category}</p>
      <p class="text-sm font-semibold text-indigo-600">${formatPrice(product.price)}</p>
    </article>
  `;
}

function generateMetrics() {
  return [
    { label: 'درآمد ماه جاری', value: formatPrice(680000000), trend: 12 },
    { label: 'نرخ تبدیل', value: '۳.۴٪', trend: 2 },
    { label: 'میزان رضایت مشتریان', value: '۹۲٪', trend: 1 }
  ];
}

async function populateProducts(container) {
  const list = await fetchProducts();
  container.innerHTML = list.slice(0, 3).map(createProductCard).join('');
}

export default function adminController(root) {
  const metricsContainer = root.querySelector('[data-admin-metrics]');
  const productsContainer = root.querySelector('[data-admin-products]');
  const refreshButton = root.querySelector('[data-refresh-admin]');

  async function render() {
    if (metricsContainer) {
      metricsContainer.innerHTML = generateMetrics().map(createMetricCard).join('');
    }
    if (productsContainer) {
      await populateProducts(productsContainer);
    }
  }

  refreshButton?.addEventListener('click', async () => {
    await render();
    showNotification('اطلاعات بروزرسانی شد', 'success');
  });

  render();
}
