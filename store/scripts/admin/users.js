function renderUserRow(user) {
  const row = document.createElement('tr');
  const badgeClass =
    user.status === 'فعال'
      ? 'bg-emerald-500/15 text-emerald-200'
      : user.status === 'در انتظار'
        ? 'bg-amber-500/15 text-amber-200'
        : 'bg-rose-500/15 text-rose-200';
  row.className = 'hover:bg-slate-900/60';
  row.innerHTML = `
    <td class="px-3 py-3">
      <div class="space-y-1">
        <p class="font-semibold text-white">${user.name}</p>
        <p class="text-xs text-slate-400">${user.email}</p>
      </div>
    </td>
    <td class="px-3 py-3 text-sm text-slate-200">${user.role}</td>
    <td class="px-3 py-3 text-sm text-slate-200">${user.orders}</td>
    <td class="px-3 py-3 text-sm">
      <span class="rounded-full px-2 py-1 text-xs font-semibold ${badgeClass}">${user.status}</span>
    </td>
    <td class="px-3 py-3 text-sm text-sky-300">
      <button class="rounded-lg border border-slate-800 px-2 py-1 text-xs" data-action="select" data-user="${user.id}">مشاهده</button>
    </td>
  `;
  return row;
}

function fillUserTable(list) {
  const table = document.getElementById('user-table');
  if (!table) return;
  table.innerHTML = '';
  list.forEach((user) => table.appendChild(renderUserRow(user)));
}

function fillFilters() {
  const roleSelect = document.getElementById('user-role-filter');
  if (!roleSelect) return;
  const roles = Array.from(new Set(adminData.users.map((u) => u.role)));
  roles.forEach((role) => {
    const option = document.createElement('option');
    option.value = role;
    option.textContent = role;
    roleSelect.appendChild(option);
  });
}

function showUser(user) {
  const inspector = document.getElementById('user-inspector');
  if (!inspector) return;
  inspector.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <p class="text-lg font-semibold text-white">${user.name}</p>
        <p class="text-xs text-slate-400">${user.email}</p>
      </div>
      <span class="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200">${user.role}</span>
    </div>
    <div class="grid grid-cols-2 gap-2 text-sm">
      <div class="rounded-xl bg-slate-900/80 p-3">
        <p class="text-xs text-slate-400">آخرین ورود</p>
        <p class="font-semibold text-white">${user.lastLogin}</p>
      </div>
      <div class="rounded-xl bg-slate-900/80 p-3">
        <p class="text-xs text-slate-400">سفارشات</p>
        <p class="font-semibold text-white">${user.orders}</p>
      </div>
      <div class="rounded-xl bg-slate-900/80 p-3">
        <p class="text-xs text-slate-400">وضعیت</p>
        <p class="font-semibold text-white">${user.status}</p>
      </div>
      <div class="rounded-xl bg-slate-900/80 p-3">
        <p class="text-xs text-slate-400">شماره تماس</p>
        <p class="font-semibold text-white">${user.phone}</p>
      </div>
    </div>
    <div class="flex gap-2 pt-2 text-sm">
      <button id="user-activate" class="flex-1 rounded-xl bg-emerald-500/20 px-3 py-2 font-semibold text-emerald-100" data-user="${user.id}">فعال‌سازی</button>
      <button id="user-suspend" class="flex-1 rounded-xl bg-rose-500/20 px-3 py-2 font-semibold text-rose-100" data-user="${user.id}">تعلیق</button>
    </div>
  `;
  bindInspectorActions(user.id);
}

function bindInspectorActions(userId) {
  const activate = document.getElementById('user-activate');
  const suspend = document.getElementById('user-suspend');
  if (activate) {
    activate.addEventListener('click', () => updateStatus(userId, 'فعال'));
  }
  if (suspend) {
    suspend.addEventListener('click', () => updateStatus(userId, 'معلق'));
  }
}

function updateStatus(userId, status) {
  const target = adminData.users.find((u) => u.id === userId);
  if (!target) return;
  target.status = status;
  render();
  showUser(target);
}

function applyFilters() {
  const search = document.getElementById('user-search').value.trim();
  const role = document.getElementById('user-role-filter').value;
  const status = document.getElementById('user-status-filter').value;
  const onlyActive = document.getElementById('only-active').checked;

  return adminData.users.filter((user) => {
    const matchSearch =
      !search ||
      user.name.includes(search) ||
      user.email.includes(search) ||
      user.id.includes(search);
    const matchRole = role === 'all' || user.role === role;
    const matchStatus = status === 'all' || user.status === status;
    const matchOnlyActive = !onlyActive || user.status === 'فعال';
    return matchSearch && matchRole && matchStatus && matchOnlyActive;
  });
}

function bindFilters() {
  const search = document.getElementById('user-search');
  const role = document.getElementById('user-role-filter');
  const status = document.getElementById('user-status-filter');
  const onlyActive = document.getElementById('only-active');
  const reset = document.getElementById('user-filter-reset');
  [search, role, status, onlyActive].forEach((el) => el?.addEventListener('input', render));
  reset?.addEventListener('click', () => {
    if (search) search.value = '';
    if (role) role.value = 'all';
    if (status) status.value = 'all';
    if (onlyActive) onlyActive.checked = false;
    render();
  });
}

function bindTableClick() {
  const table = document.getElementById('user-table');
  if (!table) return;
  table.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-user]');
    if (!button) return;
    const user = adminData.users.find((u) => u.id === button.dataset.user);
    if (user) showUser(user);
  });
}

function renderStats() {
  const total = document.getElementById('users-total');
  const login = document.getElementById('users-login');
  const suspended = document.getElementById('users-suspended');
  total.textContent = adminData.users.length;
  login.textContent = adminData.users.filter((u) => u.status === 'فعال').length;
  suspended.textContent = adminData.users.filter((u) => u.status === 'معلق').length;
}

function render() {
  const filtered = applyFilters();
  fillUserTable(filtered);
  renderStats();
}

function initUsersPage() {
  fillFilters();
  render();
  bindFilters();
  bindTableClick();
}

document.addEventListener('DOMContentLoaded', initUsersPage);
