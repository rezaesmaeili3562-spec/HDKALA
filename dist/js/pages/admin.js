import '../bootstrap.js';
import { loadProducts, upsertProduct, deleteProduct, formatPrice } from '../services/products.js';
import { clearChildren, create, qs } from '../utils/dom.js';
import { showNotification } from '../services/notifications.js';

function renderProducts() {
  const container = document.getElementById('adminProducts');
  if (!container) return;
  clearChildren(container);
  const products = loadProducts();
  if (products.length === 0) {
    container.appendChild(create('div', { className: 'rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400', text: 'محصولی ثبت نشده است.' }));
    return;
  }
  products.forEach((product) => {
    const row = create('div', { className: 'grid gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700 md:grid-cols-[2fr_1fr_auto]' });
    const info = create('div', { className: 'space-y-2' });
    info.append(
      create('div', { className: 'text-lg font-semibold text-slate-800 dark:text-slate-100', text: product.name }),
      create('div', { className: 'text-sm text-slate-500 dark:text-slate-300', text: `دسته: ${product.category}` })
    );
    const price = create('div', { className: 'space-y-2 text-sm text-slate-500 dark:text-slate-300' });
    price.append(create('div', { text: formatPrice(product.price) }));
    price.append(create('div', { text: `تخفیف: ${product.discount}%` }));

    const actions = create('div', { className: 'flex items-center gap-3' });
    const editBtn = create('button', { className: 'rounded-full border border-primary px-4 py-2 text-sm text-primary transition hover:bg-primary/10', text: 'ویرایش' });
    editBtn.type = 'button';
    editBtn.addEventListener('click', () => populateForm(product));
    const deleteBtn = create('button', { className: 'rounded-full border border-red-300 px-4 py-2 text-sm text-red-500 transition hover:bg-red-50 dark:border-red-400/40 dark:hover:bg-red-500/10', text: 'حذف' });
    deleteBtn.type = 'button';
    deleteBtn.addEventListener('click', () => {
      deleteProduct(product.id);
      showNotification('محصول حذف شد.');
      renderProducts();
    });
    actions.append(editBtn, deleteBtn);

    row.append(info, price, actions);
    container.appendChild(row);
  });
}

function populateForm(product) {
  const form = qs('#adminProductForm');
  if (!form) return;
  form.dataset.editId = product.id;
  form.querySelector('#productName').value = product.name;
  form.querySelector('#productPrice').value = product.price;
  form.querySelector('#productCategory').value = product.category;
  form.querySelector('#productDiscount').value = product.discount;
  form.querySelector('#productStatus').value = product.status || '';
  form.querySelector('#productStock').value = product.stock ?? 0;
  const submit = form.querySelector('button[type="submit"]');
  if (submit) submit.textContent = 'به‌روزرسانی محصول';
}

function resetForm() {
  const form = qs('#adminProductForm');
  if (!form) return;
  form.reset();
  delete form.dataset.editId;
  const submit = form.querySelector('button[type="submit"]');
  if (submit) submit.textContent = 'افزودن محصول';
}

function initForm() {
  const form = qs('#adminProductForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const product = {
      id: form.dataset.editId || crypto.randomUUID(),
      name: data.get('name'),
      price: Number(data.get('price')),
      category: data.get('category'),
      discount: Number(data.get('discount')),
      status: data.get('status'),
      stock: Number(data.get('stock'))
    };
    upsertProduct(product);
    showNotification(form.dataset.editId ? 'محصول به‌روزرسانی شد.' : 'محصول جدید اضافه شد.');
    resetForm();
    renderProducts();
  });
  const cancelBtn = qs('#cancelEdit');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', (event) => {
      event.preventDefault();
      resetForm();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  initForm();
});
