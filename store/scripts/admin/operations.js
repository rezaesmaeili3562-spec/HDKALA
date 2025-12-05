function renderRoles() {
  const table = document.getElementById('roles-table');
  if (!table) return;
  table.innerHTML = '';
  adminData.roles.forEach((role) => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-slate-900/60';
    row.innerHTML = `
      <td class="px-3 py-3 text-slate-100 font-semibold">${role.name}</td>
      <td class="px-3 py-3 text-sm text-slate-300">${role.permissions.join('، ')}</td>
      <td class="px-3 py-3 text-sm text-slate-300">${role.members}</td>
    `;
    table.appendChild(row);
  });
}

function bindRoleForm() {
  const form = document.getElementById('role-form');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const permissions = data.get('permissions').split(',').map((item) => item.trim()).filter(Boolean);
    adminData.roles.push({ name, permissions, members: 0 });
    renderRoles();
    form.reset();
  });
}

function bindAddProductForm() {
  const form = document.getElementById('add-product-form');
  const preview = document.getElementById('add-product-summary');
  const feedback = document.getElementById('add-product-feedback');
  if (!form) return;
  const updatePreview = () => {
    const data = new FormData(form);
    preview.innerHTML = '';
    ['name', 'category', 'price', 'stock', 'status'].forEach((key) => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between text-sm';
      row.innerHTML = `<span class="text-slate-400">${key}</span><span class="font-semibold text-slate-100">${data.get(key) || '—'}</span>`;
      preview.appendChild(row);
    });
  };
  form.addEventListener('input', updatePreview);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    adminData.products.unshift({
      id: `P-${3000 + adminData.products.length + 1}`,
      name: data.get('name'),
      category: data.get('category'),
      price: Number(data.get('price')),
      stock: Number(data.get('stock')),
      status: data.get('status'),
      rating: 0,
      sold: 0
    });
    feedback.textContent = 'محصول با موفقیت ذخیره شد';
    feedback.className = 'rounded-xl bg-emerald-500/15 p-3 text-sm text-emerald-100';
    form.reset();
    updatePreview();
  });
  updatePreview();
}

function renderCategories() {
  const list = document.getElementById('category-list');
  if (!list) return;
  list.innerHTML = '';
  adminData.categories.forEach((category) => {
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2';
    item.innerHTML = `<span class="font-semibold text-slate-100">${category.name}</span><span class="text-sm text-slate-300">${category.items} کالا</span>`;
    list.appendChild(item);
  });
}

function bindCategoryForm() {
  const form = document.getElementById('category-form');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    adminData.categories.push({ name: data.get('name'), items: 0 });
    renderCategories();
    form.reset();
  });
}

function renderHistory() {
  const table = document.getElementById('history-table');
  if (!table) return;
  table.innerHTML = '';
  adminData.orderHistory.forEach((order) => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-slate-900/60';
    row.innerHTML = `
      <td class="px-3 py-3 text-slate-200">${order.id}</td>
      <td class="px-3 py-3 text-slate-100">${order.customer}</td>
      <td class="px-3 py-3 text-sm text-slate-300">${order.created}</td>
      <td class="px-3 py-3 text-sm text-slate-300">${order.updated}</td>
      <td class="px-3 py-3 text-sm text-emerald-200">${order.status}</td>
      <td class="px-3 py-3 text-sm text-slate-300">${order.amount.toLocaleString('fa-IR')} تومان</td>
    `;
    table.appendChild(row);
  });
}

function renderReports() {
  const bars = document.getElementById('reports-bars');
  const conversions = document.getElementById('reports-conversions');
  if (bars) {
    bars.innerHTML = '';
    const max = Math.max(...adminData.reports.sales);
    adminData.reports.sales.forEach((value, index) => {
      const bar = document.createElement('div');
      bar.className = 'flex flex-col items-center gap-2';
      bar.innerHTML = `
        <div class="flex h-32 w-10 items-end overflow-hidden rounded-xl bg-slate-900/70">
          <div class="w-full rounded-xl bg-gradient-to-t from-sky-500 to-emerald-400" style="height:${Math.round((value / max) * 100)}%"></div>
        </div>
        <span class="text-xs text-slate-300">${adminData.reports.labels[index]}</span>
      `;
      bars.appendChild(bar);
    });
  }
  if (conversions) {
    conversions.innerHTML = '';
    adminData.reports.conversions.forEach((value, index) => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2';
      row.innerHTML = `<span class="text-slate-100">${adminData.reports.labels[index]}</span><span class="font-semibold text-emerald-200">${value}%</span>`;
      conversions.appendChild(row);
    });
  }
}

function renderIncome() {
  const table = document.getElementById('income-table');
  if (!table) return;
  table.innerHTML = '';
  adminData.income.forEach((rowData) => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-slate-900/60';
    row.innerHTML = `
      <td class="px-3 py-3 text-slate-100">${rowData.month}</td>
      <td class="px-3 py-3 text-sm text-slate-300">${rowData.gross.toLocaleString('fa-IR')}</td>
      <td class="px-3 py-3 text-sm text-slate-300">${rowData.costs.toLocaleString('fa-IR')}</td>
      <td class="px-3 py-3 text-sm text-emerald-200">${rowData.net.toLocaleString('fa-IR')}</td>
      <td class="px-3 py-3 text-sm text-slate-300">${rowData.orders}</td>
      <td class="px-3 py-3 text-sm ${rowData.growth >= 0 ? 'text-emerald-200' : 'text-rose-200'}">${rowData.growth}%</td>
    `;
    table.appendChild(row);
  });
}

function renderTransactions() {
  const table = document.getElementById('transactions-table');
  if (!table) return;
  const statusFilter = document.getElementById('transactions-status')?.value || 'all';
  table.innerHTML = '';
  adminData.transactions
    .filter((tx) => statusFilter === 'all' || tx.status === statusFilter)
    .forEach((tx) => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-slate-900/60';
      row.innerHTML = `
        <td class="px-3 py-3 text-slate-200">${tx.id}</td>
        <td class="px-3 py-3 text-sm text-slate-300">${tx.type}</td>
        <td class="px-3 py-3 text-sm text-sky-200">${tx.amount.toLocaleString('fa-IR')}</td>
        <td class="px-3 py-3 text-sm text-slate-300">${tx.channel}</td>
        <td class="px-3 py-3 text-sm text-emerald-200">${tx.status}</td>
        <td class="px-3 py-3 text-xs text-slate-400">${tx.created}</td>
      `;
      table.appendChild(row);
    });
}

function renderInvoices() {
  const table = document.getElementById('invoices-table');
  if (!table) return;
  const filter = document.getElementById('invoice-status')?.value || 'all';
  table.innerHTML = '';
  adminData.invoices
    .filter((invoice) => filter === 'all' || invoice.status === filter)
    .forEach((invoice) => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-slate-900/60';
      row.innerHTML = `
        <td class="px-3 py-3 text-slate-200">${invoice.id}</td>
        <td class="px-3 py-3 text-slate-100">${invoice.customer}</td>
        <td class="px-3 py-3 text-sm text-sky-200">${invoice.amount.toLocaleString('fa-IR')}</td>
        <td class="px-3 py-3 text-sm text-emerald-200">${invoice.status}</td>
        <td class="px-3 py-3 text-xs text-slate-400">${invoice.created}</td>
        <td class="px-3 py-3 text-xs text-slate-400">${invoice.due}</td>
      `;
      table.appendChild(row);
    });
}

function bindSimpleForm(formId, feedbackId) {
  const form = document.getElementById(formId);
  const feedback = document.getElementById(feedbackId);
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (feedback) {
      feedback.textContent = 'تغییرات ذخیره شد';
      feedback.className = 'rounded-xl bg-emerald-500/15 p-3 text-sm text-emerald-100';
    }
  });
}

function renderBackups() {
  const list = document.getElementById('backup-list');
  if (!list) return;
  list.innerHTML = '';
  adminData.backups.forEach((backup) => {
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2';
    item.innerHTML = `<div><p class="text-slate-100 font-semibold">${backup.type}</p><p class="text-xs text-slate-400">${backup.created}</p></div><span class="text-sm text-slate-300">${backup.size}</span>`;
    list.appendChild(item);
  });
}

function bindBackupCreate() {
  const button = document.getElementById('backup-create');
  if (!button) return;
  button.addEventListener('click', () => {
    const id = `B-${1200 + adminData.backups.length + 1}`;
    adminData.backups.unshift({ id, type: 'فول بکاپ', size: '1.9GB', created: 'هم‌اکنون', status: 'در حال تهیه' });
    renderBackups();
  });
}

function bindSupportForm() {
  const form = document.getElementById('support-form');
  const feedback = document.getElementById('support-feedback');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (feedback) {
      feedback.textContent = 'درخواست شما ثبت شد و در صف پشتیبانی قرار گرفت';
      feedback.className = 'rounded-xl bg-sky-500/15 p-3 text-sm text-sky-100';
    }
    form.reset();
  });
}

function initPage() {
  const key = document.body.dataset.pageKey;
  switch (key) {
    case 'roles':
      renderRoles();
      bindRoleForm();
      break;
    case 'add-product':
      bindAddProductForm();
      break;
    case 'categories':
      renderCategories();
      bindCategoryForm();
      break;
    case 'order-history':
      renderHistory();
      break;
    case 'reports':
    case 'analytics':
      renderReports();
      break;
    case 'income':
      renderIncome();
      break;
    case 'transactions':
      renderTransactions();
      document.getElementById('transactions-status')?.addEventListener('change', renderTransactions);
      break;
    case 'invoices':
      renderInvoices();
      document.getElementById('invoice-status')?.addEventListener('change', renderInvoices);
      break;
    case 'general-settings':
      bindSimpleForm('settings-form', 'settings-feedback');
      break;
    case 'configuration':
      bindSimpleForm('configuration-form', 'configuration-feedback');
      break;
    case 'backups':
      renderBackups();
      bindBackupCreate();
      break;
    case 'support':
      bindSupportForm();
      break;
    default:
      break;
  }
}

document.addEventListener('DOMContentLoaded', initPage);
