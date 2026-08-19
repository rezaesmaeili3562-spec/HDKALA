// ---------- فرمت‌دهی اعداد فارسی و قیمت ----------
const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export const toFa = (value) =>
  String(value ?? '').replace(/\d/g, (d) => faDigits[Number(d)]);

export const faNum = (value) => Number(value || 0).toLocaleString('fa-IR');

export const faPrice = (value) => `${faNum(value)} تومان`;

export const faDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return '';
  }
};

// قیمت نهایی محصول با احتساب تخفیف
export const finalPrice = (p) =>
  Math.round((p.price || 0) * (1 - (p.discount || 0) / 100));

export const discountAmount = (p) => (p.price || 0) - finalPrice(p);

// ---------- محاسبه جمع سبد خرید ----------
export function cartSummary(cart, shippingId = 'standard') {
  let count = 0;
  let subtotal = 0;
  let discount = 0;
  cart.forEach((item) => {
    count += item.qty;
    const base = item.price * item.qty;
    const final = Math.round(item.price * (1 - item.discount / 100)) * item.qty;
    subtotal += final;
    discount += base - final;
  });

  const method = { standard: 30000, express: 60000 };
  let shipping = 0;
  if (shippingId === 'standard') {
    shipping = subtotal >= 500000 || subtotal === 0 ? 0 : method.standard;
  } else if (shippingId === 'express') {
    shipping = subtotal === 0 ? 0 : method.express;
  }

  return { count, subtotal, discount, shipping, total: subtotal + shipping };
}

// ---------- اعتبارسنجی ----------
export const rules = {
  phone: {
    pattern: /^09[0-9]{9}$/,
    message: 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد'
  },
  postal: {
    pattern: /^[0-9]{10}$/,
    message: 'کد پستی باید ۱۰ رقم باشد'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'ایمیل وارد شده معتبر نیست'
  },
  nationalCode: {
    pattern: /^[0-9]{10}$/,
    message: 'کد ملی باید ۱۰ رقم باشد'
  }
};

export const uid = (prefix = 'id') =>
  prefix + Math.random().toString(36).slice(2, 9);
