function formatNumber(num) {
  return num.toLocaleString('fa-IR');
}

function renderDashboardStats() {
  const usersCount = adminData.users.length;
  const activeProducts = adminData.products.filter((p) => p.status === 'فعال').length;
  const newOrders = adminData.orders.length;
  const income = adminData.income[0]?.net || 0;

  const stats = [
    { id: 'stat-users', label: 'کاربران', value: usersCount, hint: 'فعال در ۳۰ روز اخیر' },
    { id: 'stat-products', label: 'محصولات فعال', value: activeProducts, hint: 'قابل فروش' },
    { id: 'stat-orders', label: 'سفارشات جدید', value: newOrders, hint: 'امروز دریافت شده' },
    { id: 'stat-income', label: 'سود خالص مهر', value: `${formatNumber(income)} تومان`, hint: 'آخرین گزارش مالی' }
  ];

  stats.forEach((item) => {
    const el = document.getElementById(item.id);
    if (!el) return;
    el.querySelector('[data-label]').textContent = item.label;
    el.querySelector('[data-value]').textContent = item.value;
    el.querySelector('[data-hint]').textContent = item.hint;
  });
}

function renderOrdersPreview() {
  const container = document.getElementById('dashboard-orders');
  if (!container) return;
  container.innerHTML = '';
  adminData.orders.slice(0, 4).forEach((order) => {
    const badgeColor = order.status === 'جدید' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-200';
    const card = document.createElement('div');
    card.className = 'flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-4';
    card.innerHTML = `
      <div>
        <p class="text-sm text-slate-400">${order.id}</p>
        <p class="text-base font-semibold text-slate-50">${order.customer}</p>
        <p class="text-xs text-slate-400">${order.city} • ${order.items} قلم • ${order.created}</p>
      </div>
      <div class="text-end space-y-2">
        <span class="inline-flex items-center gap-2 rounded-full ${badgeColor} px-3 py-1 text-xs font-semibold">${order.status}</span>
        <p class="text-lg font-bold text-sky-400">${formatNumber(order.amount)} تومان</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderTopProducts() {
  const container = document.getElementById('dashboard-products');
  if (!container) return;
  container.innerHTML = '';
  adminData.products
    .slice()
    .sort((a, b) => b.sold - a.sold)
    .forEach((product) => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between rounded-xl bg-slate-900/50 px-4 py-3 border border-slate-800';
      row.innerHTML = `
        <div>
          <p class="text-sm font-semibold text-slate-100">${product.name}</p>
          <p class="text-xs text-slate-400">${product.category}</p>
        </div>
        <div class="flex items-center gap-4 text-sm">
          <span class="text-amber-300">${product.rating} ★</span>
          <span class="text-slate-200">${product.sold} فروش</span>
          <span class="text-sky-300 font-semibold">${formatNumber(product.price)} تومان</span>
        </div>
      `;
      container.appendChild(row);
    });
}

function renderReportBars() {
  const container = document.getElementById('dashboard-report-bars');
  if (!container) return;
  container.innerHTML = '';
  const max = Math.max(...adminData.reports.sales);
  adminData.reports.sales.forEach((value, index) => {
    const height = Math.round((value / max) * 100);
    const bar = document.createElement('div');
    bar.className = 'flex flex-col items-center gap-2';
    bar.innerHTML = `
      <div class="relative flex h-28 w-10 items-end overflow-hidden rounded-xl bg-slate-900/70">
        <div class="w-full rounded-xl bg-gradient-to-t from-sky-500 to-emerald-400" style="height:${height}%"></div>
      </div>
      <span class="text-xs text-slate-300">${adminData.reports.labels[index]}</span>
    `;
    container.appendChild(bar);
  });
}

function bindRangeSwitcher() {
  const select = document.getElementById('dashboard-range');
  if (!select) return;
  select.addEventListener('change', (event) => {
    const value = event.target.value;
    const hint = document.getElementById('range-hint');
    if (hint) hint.textContent = value === '30' ? 'بر پایه ۳۰ روز' : 'بر پایه ۷ روز اخیر';
  });
}

function initDashboard() {
  renderDashboardStats();
  renderOrdersPreview();
  renderTopProducts();
  renderReportBars();
  bindRangeSwitcher();
}

document.addEventListener('DOMContentLoaded', initDashboard);
