export class SiteFooter extends HTMLElement {
  connectedCallback() {
    if (this._rendered) return;
    this._rendered = true;
    const base = this.getAttribute('data-root') || document.body?.dataset.base || '';
    this.className = 'mt-16 border-t border-slate-200 bg-slate-50 py-10 dark:border-slate-800 dark:bg-slate-900';
    const container = document.createElement('div');
    container.className = 'mx-auto flex max-w-7xl flex-col gap-8 px-6 md:flex-row md:justify-between';

    const brand = document.createElement('div');
    brand.className = 'space-y-3';
    const title = document.createElement('h3');
    title.className = 'text-xl font-semibold text-primary';
    title.textContent = 'HDKala';
    const desc = document.createElement('p');
    desc.className = 'max-w-md text-sm text-slate-500 dark:text-slate-400';
    desc.textContent = 'فروشگاه اینترنتی HDKala با ارائه محصولات باکیفیت و خدمات پشتیبانی ۲۴ ساعته در کنار شماست.';
    brand.append(title, desc);

    const linksSection = document.createElement('div');
    linksSection.className = 'grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3';

    const columns = [
      {
        title: 'محصولات',
        links: [
          { href: `${base}/products/index.html?category=electronics`, label: 'الکترونیک' },
          { href: `${base}/products/index.html?category=fashion`, label: 'مد و پوشاک' },
          { href: `${base}/products/index.html?category=home`, label: 'خانه و آشپزخانه' }
        ]
      },
      {
        title: 'خدمات مشتریان',
        links: [
          { href: `${base}/about/index.html`, label: 'درباره ما' },
          { href: `${base}/contact/index.html`, label: 'تماس با ما' },
          { href: `${base}/profile/index.html`, label: 'حساب کاربری' }
        ]
      },
      {
        title: 'دسترسی سریع',
        links: [
          { href: `${base}/cart/index.html`, label: 'سبد خرید' },
          { href: `${base}/wishlist/index.html`, label: 'علاقه‌مندی‌ها' },
          { href: `${base}/compare/index.html`, label: 'مقایسه محصولات' }
        ]
      }
    ];

    columns.forEach((column) => {
      const columnEl = document.createElement('div');
      columnEl.className = 'space-y-3';
      const columnTitle = document.createElement('h4');
      columnTitle.className = 'text-sm font-semibold text-slate-700 dark:text-slate-200';
      columnTitle.textContent = column.title;
      columnEl.appendChild(columnTitle);
      const list = document.createElement('ul');
      list.className = 'space-y-2 text-sm text-slate-500 dark:text-slate-400';
      column.links.forEach((linkInfo) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = linkInfo.href;
        link.textContent = linkInfo.label;
        link.className = 'transition-colors hover:text-primary';
        item.appendChild(link);
        list.appendChild(item);
      });
      columnEl.appendChild(list);
      linksSection.appendChild(columnEl);
    });

    const copyright = document.createElement('div');
    copyright.className = 'text-sm text-slate-400 dark:text-slate-500';
    copyright.textContent = '© تمامی حقوق برای HDKala محفوظ است.';

    container.append(brand, linksSection);
    this.append(container, copyright);
  }
}

customElements.define('site-footer', SiteFooter);
