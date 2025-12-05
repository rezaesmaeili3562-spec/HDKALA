function renderProductRow(product) {
  const badge =
    product.status === 'فعال'
      ? 'bg-emerald-500/15 text-emerald-200'
      : product.status === 'در انتظار'
        ? 'bg-amber-500/15 text-amber-200'
        : 'bg-rose-500/15 text-rose-200';
  const row = document.createElement('tr');
  row.className = 'hover:bg-slate-900/60';
  row.innerHTML = `
    <td class="px-3 py-3">
      <p class="font-semibold text-white">${product.name}</p>
      <p class="text-xs text-slate-400">${product.id}</p>
    </td>
    <td class="px-3 py-3 text-sm text-slate-200">${product.category}</td>
    <td class="px-3 py-3 text-sm text-sky-200">${product.price.toLocaleString('fa-IR')} تومان</td>
    <td class="px-3 py-3 text-sm ${product.stock ? 'text-emerald-200' : 'text-rose-200'}">${product.stock}</td>
    <td class="px-3 py-3 text-sm"><span class="rounded-full px-2 py-1 text-xs font-semibold ${badge}">${product.status}</span></td>
    <td class="px-3 py-3 text-sm text-sky-300">
      <button class="rounded-lg border border-slate-800 px-2 py-1 text-xs" data-product="${product.id}">تغییر وضعیت</button>
    </td>
  `;
  return row;
}

function fillCategoryFilter() {
  const select = document.getElementById('product-category');
  if (!select) return;
  const categories = Array.from(new Set(adminData.products.map((p) => p.category)));
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
}

function applyProductFilters() {
  const search = document.getElementById('product-search').value.trim();
  const category = document.getElementById('product-category').value;
  const status = document.getElementById('product-status').value;
  return adminData.products.filter((product) => {
    const matchSearch =
      !search ||
      product.name.includes(search) ||
      product.id.includes(search) ||
      product.category.includes(search);
    const matchCategory = category === 'all' || product.category === category;
    const matchStatus = status === 'all' || product.status === status;
    return matchSearch && matchCategory && matchStatus;
  });
}

function renderProducts() {
  const table = document.getElementById('product-table');
  if (!table) return;
  table.innerHTML = '';
  applyProductFilters().forEach((product) => table.appendChild(renderProductRow(product)));
}

function bindProductFilters() {
  const inputs = ['product-search', 'product-category', 'product-status'].map((id) => document.getElementById(id));
  inputs.forEach((input) => input?.addEventListener('input', renderProducts));
  const reset = document.getElementById('product-reset');
  reset?.addEventListener('click', () => {
    inputs.forEach((input) => {
      if (input?.tagName === 'INPUT') input.value = '';
      if (input?.tagName === 'SELECT') input.value = 'all';
    });
    renderProducts();
  });
}

function bindStatusChange() {
  const table = document.getElementById('product-table');
  if (!table) return;
  table.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-product]');
    if (!button) return;
    const product = adminData.products.find((p) => p.id === button.dataset.product);
    if (!product) return;
    const nextState = product.status === 'فعال' ? 'در انتظار' : 'فعال';
    product.status = nextState;
    renderProducts();
  });
}

function initProductsPage() {
  fillCategoryFilter();
  renderProducts();
  bindProductFilters();
  bindStatusChange();
}

document.addEventListener('DOMContentLoaded', initProductsPage);
