function formatNumber(num) {
  return num.toLocaleString('fa-IR');
}

function formatCurrency(num) {
  return `${formatNumber(num)} تومان`;
}

function renderPerformanceHeader() {
  const latestIncome = adminData.income?.[0];
  if (!latestIncome) return;

  const netElement = document.getElementById('performance-net');
  const growthElement = document.getElementById('performance-growth');
  const monthElement = document.getElementById('performance-month');

  if (netElement) netElement.textContent = formatCurrency(latestIncome.net);
  if (growthElement) growthElement.textContent = `${latestIncome.growth}%`;
  if (monthElement) monthElement.textContent = latestIncome.month;

  const slaMinutes = Math.max(6, 24 - latestIncome.growth);
  const slaElement = document.getElementById('support-sla');
  const slaBar = document.getElementById('support-sla-bar');
  if (slaElement) slaElement.textContent = `${slaMinutes} دقیقه`;
  if (slaBar) slaBar.style.width = `${Math.min(100, 40 + latestIncome.growth)}%`;

  const orders = adminData.orders || [];
  const pendingOrders = orders.filter((order) => order.status === 'در حال بررسی').length;
  const onTimeRate = orders.length ? Math.round(((orders.length - pendingOrders) / orders.length) * 100) : 0;

  const onTimeElement = document.getElementById('on-time-rate');
  const onTimeBar = document.getElementById('on-time-bar');
  if (onTimeElement) onTimeElement.textContent = `${onTimeRate}%`;
  if (onTimeBar) onTimeBar.style.width = `${Math.max(30, onTimeRate)}%`;
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

function renderInsights() {
  const conversion = adminData.reports.conversions.at(-1) || 0;
  const monthLabel = adminData.reports.labels.at(-1) || '';
  const orders = adminData.orders || [];
  const averageOrder = orders.length ? Math.round(orders.reduce((sum, order) => sum + order.amount, 0) / orders.length) : 0;

  const lowStockItems = adminData.products.filter((product) => product.stock <= 20);
  const outOfStock = adminData.products.filter((product) => product.stock === 0).length;

  const conversionEl = document.getElementById('insight-conversion');
  const conversionHint = document.getElementById('insight-conversion-hint');
  if (conversionEl) conversionEl.textContent = `${conversion}%`;
  if (conversionHint) conversionHint.textContent = `آخرین به‌روزرسانی در ${monthLabel}`;

  const avgEl = document.getElementById('insight-average-order');
  const avgHint = document.getElementById('insight-average-order-hint');
  if (avgEl) avgEl.textContent = formatCurrency(averageOrder);
  if (avgHint) avgHint.textContent = `${orders.length} سفارش امروز`;

  const stockEl = document.getElementById('insight-stock');
  const stockHint = document.getElementById('insight-stock-hint');
  if (stockEl) stockEl.textContent = `${lowStockItems.length} کالا`; 
  if (stockHint) stockHint.textContent = `${outOfStock} مورد بدون موجودی / ${lowStockItems.length} نزدیک اتمام`;
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

function renderLowStockAlerts() {
  const container = document.getElementById('low-stock-list');
  if (!container) return;
  container.innerHTML = '';

  adminData.products
    .filter((product) => product.stock <= 20)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6)
    .forEach((product) => {
      const badgeColor = product.stock === 0 ? 'bg-rose-500/15 text-rose-200' : 'bg-amber-500/15 text-amber-100';
      const card = document.createElement('div');
      card.className = 'space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 shadow-inner shadow-slate-900/30';
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-white">${product.name}</p>
            <p class="text-xs text-slate-400">${product.category}</p>
          </div>
          <span class="rounded-full ${badgeColor} px-3 py-1 text-xs font-semibold">${product.status}</span>
        </div>
        <div class="flex items-center justify-between text-sm text-slate-300">
          <span class="text-amber-200">${product.stock} عدد در انبار</span>
          <span class="font-semibold text-sky-200">${formatCurrency(product.price)}</span>
        </div>
      `;
      container.appendChild(card);
    });
}

function renderOrderStatusDistribution() {
  const container = document.getElementById('orders-status-distribution');
  if (!container) return;
  container.innerHTML = '';

  const statusCounts = adminData.orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const total = adminData.orders.length || 1;

  Object.entries(statusCounts).forEach(([status, count]) => {
    const percent = Math.round((count / total) * 100);
    const row = document.createElement('div');
    row.className = 'space-y-1';
    row.innerHTML = `
      <div class="flex items-center justify-between text-sm text-slate-200">
        <p>${status}</p>
        <p class="font-semibold text-white">${count} / ${percent}%</p>
      </div>
      <div class="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div class="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" style="width:${percent}%"></div>
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
  renderPerformanceHeader();
  renderDashboardStats();
  renderInsights();
  renderOrdersPreview();
  renderTopProducts();
  renderLowStockAlerts();
  renderOrderStatusDistribution();
  renderReportBars();
  bindRangeSwitcher();
}

document.addEventListener('DOMContentLoaded', initDashboard);
