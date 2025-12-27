const navGroups = [
  {
    key: 'dashboard',
    title: 'داشبورد',
    href: './index.html',
    icon: 'chart-pie'
  },
  {
    key: 'users',
    title: 'کاربران',
    icon: 'users',
    children: [
      { key: 'user-management', title: 'مدیریت کاربران', href: './users.html' },
      { key: 'add-user', title: 'افزودن کاربر', href: './add-user.html' },
      { key: 'roles', title: 'نقش‌ها', href: './roles.html' }
    ]
  },
  {
    key: 'products',
    title: 'محصولات',
    icon: 'cube',
    children: [
      { key: 'product-list', title: 'لیست محصولات', href: './products.html' },
      { key: 'add-product', title: 'افزودن محصول', href: './add-product.html' },
      { key: 'categories', title: 'دسته‌بندی', href: './categories.html' }
    ]
  },
  {
    key: 'orders',
    title: 'سفارشات',
    icon: 'receipt',
    children: [
      { key: 'new-orders', title: 'سفارشات جدید', href: './orders.html' },
      { key: 'order-history', title: 'تاریخچه سفارشات', href: './order-history.html' },
      { key: 'reports', title: 'گزارشات', href: './reports.html' }
    ]
  },
  {
    key: 'analytics',
    title: 'آمار و تحلیل',
    href: './reports.html',
    icon: 'spark'
  },
  {
    key: 'finance',
    title: 'مالی',
    icon: 'coins',
    children: [
      { key: 'income', title: 'گزارش درآمد', href: './finance-income.html' },
      { key: 'transactions', title: 'تراکنش‌ها', href: './transactions.html' },
      { key: 'invoices', title: 'صورتحساب', href: './invoices.html' }
    ]
  },
  {
    key: 'settings',
    title: 'تنظیمات',
    icon: 'settings',
    children: [
      { key: 'general-settings', title: 'تنظیمات عمومی', href: './settings.html' },
      { key: 'configuration', title: 'پیکربندی', href: './configuration.html' },
      { key: 'backups', title: 'پشتیبان‌گیری', href: './backups.html' }
    ]
  },
  {
    key: 'support',
    title: 'پشتیبانی مشتریان',
    icon: 'life-buoy',
    href: './support.html'
  }
];

const iconMap = {
  'chart-pie':
    '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 3.1v8.65h8.65A8.75 8.75 0 0011.25 3.1z"/><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 4.09A8.75 8.75 0 1019.9 14.25H9.75V4.09z"/></svg>',
  users:
    '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4" stroke-linecap="round" stroke-linejoin="round"/><path stroke-linecap="round" stroke-linejoin="round" d="M22 21v-2a4 4 0 00-3-3.87"/><path stroke-linecap="round" stroke-linejoin="round" d="M16 3.13a4 4 0 010 7.75"/></svg>',
  cube:
    '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M20.5 7.5L12 12 3.5 7.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 21V12"/><path stroke-linecap="round" stroke-linejoin="round" d="M20.5 7.5L12 3 3.5 7.5 12 12z"/></svg>',
  receipt:
    '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M7 4h10a2 2 0 012 2v13.5l-3-1.5-3 1.5-3-1.5-3 1.5V6a2 2 0 012-2z"/><path stroke-linecap="round" stroke-linejoin="round" d="M9 10h6M9 7h6"/></svg>',
  spark:
    '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3l2 6h6l-5 3.6L17 21l-5-3.4L7 21l2-8.4L4 9h6z"/></svg>',
  coins:
    '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="5" rx="7" ry="3"/><path stroke-linecap="round" stroke-linejoin="round" d="M5 5v5c0 1.66 3.13 3 7 3s7-1.34 7-3V5"/><path stroke-linecap="round" stroke-linejoin="round" d="M5 10v5c0 1.66 3.13 3 7 3s7-1.34 7-3v-5"/></svg>',
  settings:
    '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c0 .69.4 1.3 1 1.59.2.1.42.16.66.16H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  'life-buoy':
    '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M15.5 8.5l3-3M8.5 8.5l-3-3M15.5 15.5l3 3M8.5 15.5l-3 3"/></svg>'
};

function createNavLink(item, activeKey) {
  const isActive = activeKey === item.key;
  const baseClasses = 'flex items-center justify-between rounded-xl px-3 py-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500';
  const activeClasses = isActive ? 'bg-sky-900/50 text-sky-100 border border-sky-500/40 shadow-lg shadow-sky-900/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent';

  if (item.children) {
    const childActive = item.children.some((child) => child.key === activeKey);
    const wrapper = document.createElement('div');
    wrapper.className = `admin-nav-group space-y-1 ${childActive ? 'open' : ''}`;
    const listId = `admin-submenu-${item.key}`;

    const header = document.createElement('button');
    header.type = 'button';
    header.className = `${baseClasses} w-full ${childActive ? 'bg-sky-900/40 text-sky-100 border border-sky-500/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'}`;
    header.setAttribute('aria-expanded', childActive ? 'true' : 'false');
    header.setAttribute('aria-controls', listId);
    header.innerHTML = `
      <span class="flex items-center gap-2">${iconMap[item.icon] || ''}<span class="text-sm font-semibold">${item.title}</span></span>
      <span class="flex items-center gap-2 text-xs text-slate-400">
        <span data-status>${childActive ? 'باز' : 'بسته'}</span>
        <span class="admin-nav-chevron text-slate-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/></svg>
        </span>
      </span>
    `;
    const updateSubmenuState = (isOpen) => {
      wrapper.classList.toggle('open', isOpen);
      header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      list.style.maxHeight = isOpen ? `${list.scrollHeight}px` : '0px';
      list.style.opacity = isOpen ? '1' : '0';
      const status = header.querySelector('[data-status]');
      if (status) status.textContent = isOpen ? 'باز' : 'بسته';
    };

    const list = document.createElement('div');
    list.className = 'admin-submenu space-y-1 ps-7 pt-2';
    list.id = listId;
    list.setAttribute('role', 'group');
    list.style.overflow = 'hidden';
    list.style.transition = 'max-height 0.35s ease, opacity 0.3s ease';
    item.children.forEach((child) => {
      const childLink = document.createElement('a');
      childLink.href = child.href;
      childLink.className = `${baseClasses} justify-start text-sm ${activeKey === child.key ? 'bg-sky-900/70 text-sky-100 border border-sky-500/60 shadow shadow-sky-900/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'}`;
      childLink.innerHTML = `<span class="w-1.5 h-1.5 rounded-full me-2 ${activeKey === child.key ? 'bg-sky-400' : 'bg-slate-500'}"></span>${child.title}`;
      list.appendChild(childLink);
    });

    wrapper.append(header, list);
    updateSubmenuState(childActive);
    header.addEventListener('click', () => {
      const isOpen = !wrapper.classList.contains('open');
      updateSubmenuState(isOpen);
    });
    return wrapper;
  }

  const link = document.createElement('a');
  link.href = item.href;
  link.className = `${baseClasses} ${activeClasses}`;
  link.innerHTML = `<span class="flex items-center gap-2">${iconMap[item.icon] || ''}<span class="text-sm font-semibold">${item.title}</span></span>`;
  return link;
}

function buildSidebar(activeKey) {
  const container = document.getElementById('admin-sidebar-nav');
  if (!container) return;
  container.innerHTML = '';
  navGroups.forEach((item) => container.appendChild(createNavLink(item, activeKey)));
}

function bindMobileToggle() {
  const toggler = document.getElementById('admin-mobile-toggle');
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('admin-sidebar-overlay');

  if (!toggler || !sidebar || !overlay) return;

  const setOpenState = (isOpen) => {
    sidebar.classList.toggle('translate-x-full', !isOpen);
    sidebar.classList.toggle('translate-x-0', isOpen);
    overlay.classList.toggle('hidden', !isOpen);
    toggler.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.classList.toggle('overflow-hidden', isOpen);
  };

  const toggle = () => {
    const isOpen = sidebar.classList.contains('translate-x-full');
    setOpenState(isOpen);
  };

  toggler.addEventListener('click', toggle);
  overlay.addEventListener('click', () => setOpenState(false));
}

function initHeaderTitle() {
  const title = document.getElementById('admin-page-title');
  const subtitle = document.getElementById('admin-page-subtitle');
  const pageTitle = document.body.dataset.pageTitle;
  const pageDescription = document.body.dataset.pageDescription;
  if (title && pageTitle) title.textContent = pageTitle;
  if (subtitle && pageDescription) subtitle.textContent = pageDescription;
}

function initAdminLayout() {
  const activeKey = document.body.dataset.pageKey || 'dashboard';
  buildSidebar(activeKey);
  bindMobileToggle();
  initHeaderTitle();
}

document.addEventListener('DOMContentLoaded', initAdminLayout);
