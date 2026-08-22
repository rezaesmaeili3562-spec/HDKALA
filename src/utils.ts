// ─────────────────────────────────────────────────────────────
//  توابع کمکی — فرمت فارسی، قیمت، جمع سبد خرید، اعتبارسنجی
// ─────────────────────────────────────────────────────────────
import type { CartItem, CartSummary, CartSummaryOptions, Coupon } from './types';

// ─────────── اعداد و قیمت فارسی ───────────

const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** تبدیل ارقام انگلیسی به فارسی */
export const toFa = (value: unknown): string =>
  String(value ?? '').replace(/\d/g, (d) => faDigits[Number(d)]);

/** عدد با جداکننده هزارگان فارسی */
export const faNum = (value: unknown): string => Number(value || 0).toLocaleString('fa-IR');

/** قیمت با واحد تومان */
export const faPrice = (value: unknown): string => `${faNum(value)} تومان`;

/** تاریخ شمسی خوانا */
export const faDate = (iso: string): string => {
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

/** قیمت نهایی بعد از تخفیف */
export const finalPrice = (p: { price?: number; discount?: number }): number =>
  Math.round((p.price || 0) * (1 - (p.discount || 0) / 100));

/** مبلغ تخفیف یک کالا */
export const discountAmount = (p: { price?: number; discount?: number }): number =>
  (p.price || 0) - finalPrice(p);

/** مبلغ تخفیف کوپن روی جمع فاکتور */
export function couponDiscountOf(subtotal: number, coupon: Coupon | null | undefined): number {
  if (!coupon) return 0;
  if (coupon.type === 'percent') {
    return Math.min(subtotal, Math.round((subtotal * coupon.value) / 100));
  }
  return Math.min(subtotal, coupon.value);
}

// ─────────── محاسبه جمع سبد خرید ───────────

export function cartSummary(
  cart: CartItem[],
  shippingId = 'standard',
  extras: CartSummaryOptions = {}
): CartSummary {
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

  const shippingFee = extras.shippingFee ?? 30000;
  const expressFee = extras.expressFee ?? 60000;
  const freeShippingOver = extras.freeShippingOver ?? 500000;
  const couponDiscount = couponDiscountOf(subtotal, extras.coupon);
  const afterCoupon = Math.max(0, subtotal - couponDiscount);

  let shipping = 0;
  if (shippingId === 'standard') {
    shipping = afterCoupon >= freeShippingOver || afterCoupon === 0 ? 0 : shippingFee;
  } else if (shippingId === 'express') {
    shipping = afterCoupon === 0 ? 0 : expressFee;
  }

  return { count, subtotal, discount, couponDiscount, shipping, total: afterCoupon + shipping };
}

// ─────────── قوانین اعتبارسنجی فرم‌ها ───────────

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
  }
} as const;

// ─────────── ابزارهای عمومی ───────────

/** ساخت شناسه یکتا با پیشوند */
export const uid = (prefix = 'id'): string => prefix + Math.random().toString(36).slice(2, 9);
