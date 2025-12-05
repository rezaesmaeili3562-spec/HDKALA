function fillRoleOptions() {
  const select = document.querySelector('select[name="role"]');
  if (!select) return;
  adminData.roles.forEach((role) => {
    const option = document.createElement('option');
    option.value = role.name;
    option.textContent = role.name;
    select.appendChild(option);
  });
}

function updatePreview(formData) {
  const container = document.getElementById('add-user-summary');
  if (!container) return;
  container.innerHTML = '';
  const entries = [
    { label: 'نام', value: formData.get('name') },
    { label: 'ایمیل', value: formData.get('email') },
    { label: 'شماره تماس', value: formData.get('phone') },
    { label: 'نقش', value: formData.get('role') },
    { label: 'وضعیت', value: formData.get('status') },
    { label: 'ارسال ایمیل', value: formData.get('notify') ? 'بله' : 'خیر' },
    { label: 'اجبار تغییر رمز', value: formData.get('forceReset') ? 'بله' : 'خیر' }
  ];
  entries.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between text-slate-200';
    row.innerHTML = `<span class="text-slate-400">${item.label}</span><span class="font-semibold">${item.value || '—'}</span>`;
    container.appendChild(row);
  });
}

function bindForm() {
  const form = document.getElementById('add-user-form');
  const feedback = document.getElementById('add-user-feedback');
  if (!form) return;
  const update = () => updatePreview(new FormData(form));
  form.addEventListener('input', update);
  form.addEventListener('reset', () => {
    setTimeout(update, 0);
    if (feedback) feedback.textContent = 'در انتظار ثبت';
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const newUser = {
      id: `U-${1000 + adminData.users.length + 1}`,
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone'),
      role: data.get('role'),
      status: data.get('status'),
      orders: 0,
      lastLogin: 'هم‌اکنون'
    };
    adminData.users.unshift(newUser);
    if (feedback) {
      feedback.textContent = 'کاربر با موفقیت ثبت شد و به لیست اضافه شد';
      feedback.className = 'rounded-xl bg-emerald-500/15 p-3 text-sm text-emerald-100';
    }
    form.reset();
    update();
  });
  update();
}

function initAddUser() {
  fillRoleOptions();
  bindForm();
}

document.addEventListener('DOMContentLoaded', initAddUser);
