function renderOrderRow(order) {
  const badge = order.status === 'جدید' ? 'bg-amber-500/15 text-amber-200' : 'bg-sky-500/15 text-sky-200';
  const row = document.createElement('tr');
  row.className = 'hover:bg-slate-900/60';
  row.innerHTML = `
    <td class="px-3 py-3 text-slate-200">${order.id}</td>
    <td class="px-3 py-3">
      <p class="font-semibold text-white">${order.customer}</p>
      <p class="text-xs text-slate-400">${order.items} قلم</p>
    </td>
    <td class="px-3 py-3 text-sm text-slate-300">${order.city}</td>
    <td class="px-3 py-3 text-sm text-sky-200">${order.amount.toLocaleString('fa-IR')} تومان</td>
    <td class="px-3 py-3 text-sm"><span class="rounded-full px-2 py-1 text-xs font-semibold ${badge}">${order.status}</span></td>
    <td class="px-3 py-3 text-sm text-sky-300 space-x-2 space-x-reverse">
      <button class="rounded-lg border border-slate-800 px-2 py-1 text-xs" data-action="approve" data-order="${order.id}">تایید</button>
      <button class="rounded-lg border border-slate-800 px-2 py-1 text-xs" data-action="priority" data-order="${order.id}">اولویت</button>
    </td>
  `;
  return row;
}

function applyOrderFilters() {
  const search = document.getElementById('orders-search').value.trim();
  const status = document.getElementById('orders-status').value;
  return adminData.orders.filter((order) => {
    const matchSearch = !search || order.customer.includes(search) || order.id.includes(search) || order.city.includes(search);
    const matchStatus = status === 'all' || order.status === status;
    return matchSearch && matchStatus;
  });
}

function renderOrders() {
  const table = document.getElementById('orders-table');
  if (!table) return;
  table.innerHTML = '';
  applyOrderFilters().forEach((order) => table.appendChild(renderOrderRow(order)));
  renderOrderStats();
}

function renderOrderStats() {
  const open = document.getElementById('orders-open');
  const approved = document.getElementById('orders-approved');
  const priority = document.getElementById('orders-priority');
  const approvedList = adminData.orders.filter((o) => o.status === 'تایید شد');
  const priorityList = adminData.orders.filter((o) => o.priority);
  open.textContent = adminData.orders.length;
  approved.textContent = approvedList.length;
  priority.textContent = priorityList.length;
}

function bindOrderFilters() {
  const search = document.getElementById('orders-search');
  const status = document.getElementById('orders-status');
  const clear = document.getElementById('orders-clear');
  [search, status].forEach((el) => el?.addEventListener('input', renderOrders));
  clear?.addEventListener('click', () => {
    if (search) search.value = '';
    if (status) status.value = 'all';
    renderOrders();
  });
}

function bindOrderActions() {
  const table = document.getElementById('orders-table');
  if (!table) return;
  table.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-order]');
    if (!button) return;
    const order = adminData.orders.find((o) => o.id === button.dataset.order);
    if (!order) return;
    const action = button.dataset.action;
    if (action === 'approve') {
      order.status = 'تایید شد';
    }
    if (action === 'priority') {
      order.priority = !order.priority;
    }
    renderOrders();
  });
}

function bindSyncButtons() {
  document.getElementById('orders-refresh')?.addEventListener('click', () => renderOrders());
  document.getElementById('orders-export')?.addEventListener('click', () => alert('لیست برای خروجی اکسل آماده شد'));
}

function initOrders() {
  renderOrders();
  bindOrderFilters();
  bindOrderActions();
  bindSyncButtons();
}

document.addEventListener('DOMContentLoaded', initOrders);
