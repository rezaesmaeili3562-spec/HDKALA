// ─────────────────────────────────────────────────────────────
//  کامپوننت‌های مشترک رابط کاربری — آیکون، دکمه، فرم، کشو،
//  هدر، فوتر، کارت محصول و محافظ‌های مسیر
// ─────────────────────────────────────────────────────────────
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type FormEvent,
  type ReactNode,
  type SVGProps
} from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from './store';
import { badgeOf, categories, getCategoryName } from './data';
import { cartSummary, faNum, faPrice, finalPrice, toFa } from './utils';
import type { Product, ToastItem } from './types';

// ═══════════════════════════ آیکون‌ها ═══════════════════════════
// مجموعه آیکون‌های SVG داخلی (بدون وابستگی خارجی)

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ children, size = 20, className = '', ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const BagIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </Icon>
);

export const HeartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </Icon>
);

export const StarIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M11.5 2.6a.5.5 0 0 1 .9 0l2.6 5.3 5.8.85a.5.5 0 0 1 .28.85l-4.2 4.1 1 5.8a.5.5 0 0 1-.73.52l-5.2-2.7-5.2 2.7a.5.5 0 0 1-.72-.52l1-5.8-4.2-4.1a.5.5 0 0 1 .27-.85l5.8-.85 2.6-5.3Z" />
  </Icon>
);

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Icon>
);

export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Icon>
);

export const XIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Icon>
);

export const SunIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);

export const MoonIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </Icon>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m15 18-6-6 6-6" />
  </Icon>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const TrashIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M10 11v6M14 11v6" />
  </Icon>
);

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const MinusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

export const AlertIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </Icon>
);

export const InfoIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </Icon>
);

export const UserIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Icon>
);

export const LogoutIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5M21 12H9" />
  </Icon>
);

export const MapPinIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);

export const PhoneIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  </Icon>
);

export const MailIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </Icon>
);

export const ClockIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </Icon>
);

export const TruckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </Icon>
);

export const ShieldIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

export const ShieldCheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

export const CreditCardIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <path d="M2 10h20" />
  </Icon>
);

export const HeadsetIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
  </Icon>
);

export const PackageIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
  </Icon>
);

export const HomeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    <path d="M9 22V12h6v10" />
  </Icon>
);

export const ChartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 3v18h18" />
    <path d="M7 16v-5" />
    <path d="M12 16V8" />
    <path d="M17 16v-9" />
  </Icon>
);

export const BoxesIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m21 8-9-5-9 5 9 5 9-5Z" />
    <path d="m3 8 9 5 9-5" />
    <path d="M12 13v8" />
    <path d="m7.5 10.5-4.5 2.5v6l9 5 9-5v-6l-4.5-2.5" />
  </Icon>
);

export const ClipboardIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect width="14" height="16" x="5" y="5" rx="2" />
    <path d="M9 5V3h6v2" />
    <path d="M9 12h6M9 16h4" />
  </Icon>
);

export const UsersIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Icon>
);

export const MessageIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  </Icon>
);

export const TicketIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 9a3 3 0 0 1 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2M13 17v2M13 11v2" />
  </Icon>
);

export const SettingsIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 1.8.3V9c.3.6.9 1 1.5 1.1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </Icon>
);

export const PencilIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </Icon>
);

// ═══════════════════════════ دکمه ═══════════════════════════

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  full?: boolean;
  children?: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  full = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-pop disabled:hover:shadow-sm',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-600/90 shadow-sm',
    outline:
      'border border-slate-300 bg-white text-slate-700 hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-primary-300',
    ghost:
      'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800'
  };
  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl'
  };

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      ) : (
        children
      )}
    </button>
  );
}

interface AddToCartButtonProps {
  inCart?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  compact?: boolean;
}

export function AddToCartButton({ inCart, onClick, disabled, compact = false }: AddToCartButtonProps) {
  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label="افزودن به سبد خرید"
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white transition hover:bg-primary-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {inCart ? <CheckIcon size={16} /> : <PlusIcon size={16} />}
      </button>
    );
  }
  return (
    <Button onClick={onClick} disabled={disabled} className="flex-1">
      {inCart ? (
        <>
          <CheckIcon size={16} /> در سبد خرید
        </>
      ) : (
        'افزودن به سبد'
      )}
    </Button>
  );
}

// ═══════════════════════════ اجزای فرم ═══════════════════════════

interface FieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  id?: string;
  className?: string;
  children?: ReactNode;
}

/** قاب استاندارد فیلد فرم: برچسب + ورودی + پیام خطا/راهنما */
const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, error, hint, required, id, className = '', children },
  ref
) {
  return (
    <div className={`space-y-1.5 ${className}`} ref={ref}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="ms-0.5 text-rose-500">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs font-medium text-rose-500" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
});

export { Field };

// ═══════════════════════════ نمایش عناصر محصول ═══════════════════════════

/** قیمت محصول: نهایی + قیمت قبلی خط‌خورده + درصد تخفیف */
export function Price({
  product,
  size = 'md',
  showDiscount = true
}: {
  product: Pick<Product, 'price' | 'discount'>;
  size?: 'sm' | 'md' | 'lg';
  showDiscount?: boolean;
}) {
  const final = finalPrice(product);
  const hasDiscount = product.discount > 0;

  const sizes: Record<'sm' | 'md' | 'lg', { final: string; old: string }> = {
    sm: { final: 'text-sm font-bold', old: 'text-xs' },
    md: { final: 'text-base font-bold', old: 'text-sm' },
    lg: { final: 'text-2xl font-extrabold', old: 'text-base' }
  };

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={`${sizes[size].final} text-slate-900 dark:text-white`}>
        {faNum(final)}
        <span className="ms-1 text-xs font-normal text-slate-400">تومان</span>
      </span>
      {hasDiscount && showDiscount && (
        <>
          <span className={`${sizes[size].old} text-slate-400 line-through dark:text-slate-500`}>
            {faNum(product.price)}
          </span>
          <span className="rounded-md bg-rose-500/10 px-1.5 py-0.5 text-xs font-bold text-rose-500">
            {faNum(product.discount)}٪ تخفیف
          </span>
        </>
      )}
    </div>
  );
}

/** ستاره‌های امتیاز */
export function RatingStars({
  rating = 0,
  count,
  size = 14,
  showCount = true
}: {
  rating?: number;
  count?: number;
  size?: number;
  showCount?: boolean;
}) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1" aria-label={`امتیاز ${faNum(rating)} از ۵`}>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon
            key={i}
            size={size}
            fill={i <= filled ? 'currentColor' : 'none'}
            className={i <= filled ? 'text-accent-400' : 'text-slate-300 dark:text-slate-600'}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {faNum(rating)}
          {typeof count === 'number' && ` (${faNum(count)} نظر)`}
        </span>
      )}
    </div>
  );
}

/** کنترل تعداد (سبد خرید و صفحه محصول) */
export function QuantityControl({
  value,
  onChange,
  min = 1,
  max = 99,
  small = false
}: {
  value: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
  small?: boolean;
}) {
  const btnCls = `flex items-center justify-center text-slate-600 transition hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-300 dark:hover:text-primary-300 ${
    small ? 'h-7 w-7' : 'h-9 w-9'
  }`;

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700 ${
        small ? '' : 'bg-white dark:bg-slate-800'
      }`}
    >
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={btnCls}
        aria-label="افزایش تعداد"
      >
        <PlusIcon size={small ? 14 : 16} />
      </button>
      <span
        className={`text-center font-medium tabular-nums text-slate-800 dark:text-slate-100 ${
          small ? 'w-7 text-xs' : 'w-10 text-sm'
        }`}
        aria-live="polite"
      >
        {toFa(value)}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={btnCls}
        aria-label="کاهش تعداد"
      >
        <MinusIcon size={small ? 14 : 16} />
      </button>
    </div>
  );
}

// ═══════════════════════════ کشو و مودال ═══════════════════════════

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: 'end' | 'start';
  title: string;
  children?: ReactNode;
  footer?: ReactNode;
  labelledBy?: string;
}

export function Drawer({
  open,
  onClose,
  side = 'end',
  title,
  children,
  footer,
  labelledBy
}: DrawerProps) {
  // قفل اسکرول بدنه و بستن با Escape
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const position = side === 'end' ? 'left-0' : 'right-0';
  const offScreen = side === 'end' ? '-translate-x-full' : 'translate-x-full';

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-labelledby={labelledBy}
        className={`fixed inset-y-0 z-50 ${position} flex w-full max-w-sm flex-col bg-white shadow-2xl transition-[transform,visibility] duration-300 dark:bg-slate-900 ${
          open ? 'visible translate-x-0' : `invisible ${offScreen}`
        }`}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5 dark:border-slate-800">
          <h2 id={labelledBy} className="text-base font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <XIcon size={18} />
          </button>
        </header>
        <div className="custom-scrollbar flex-1 overflow-y-auto">{children}</div>
        {footer && <footer className="border-t border-slate-200 p-4 dark:border-slate-800">{footer}</footer>}
      </aside>
    </>
  );
}

/** دیالوگ تأیید عملیات حساس (حذف و…) */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'تأیید',
  danger = false,
  onConfirm,
  onCancel
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-slate-950/50" aria-label="بستن" onClick={onCancel} />
      <div className="card relative z-10 w-full max-w-md space-y-4 p-6">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{title}</h2>
        <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">{description}</p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            انصراف
          </Button>
          <Button type="button" variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════ حالت‌های نمایشی ═══════════════════════════

/** حالت خالی یکپارچه برای لیست‌ها و صفحات */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      {icon && (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          {icon}
        </div>
      )}
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h2>
      {description && (
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
      {actionLabel && (
        <Button className="mt-2" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

/** لودر تمام‌صفحه */
export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="در حال بارگذاری">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600 dark:border-slate-800 dark:border-t-primary-400" />
        <p className="text-sm text-slate-500 dark:text-slate-400">در حال بارگذاری…</p>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-square w-full rounded-none" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-6 w-1/3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ═══════════════════════════ اعلان‌ها ═══════════════════════════

const toastStyles: Record<ToastItem['type'], { border: string; icon: string }> = {
  success: { border: 'border-emerald-500/40', icon: 'text-emerald-500' },
  error: { border: 'border-rose-500/40', icon: 'text-rose-500' },
  info: { border: 'border-primary-500/40', icon: 'text-primary-500' }
};

export function Toasts() {
  const toasts = useStore((s) => s.toasts);
  const dismissToast = useStore((s) => s.dismissToast);

  if (!toasts.length) return null;

  return (
    <div
      className="fixed bottom-6 left-6 z-[70] flex w-[calc(100%-3rem)] max-w-sm flex-col gap-2"
      role="region"
      aria-label="اعلان‌ها"
    >
      {toasts.map((t) => {
        const st = toastStyles[t.type] || toastStyles.info;
        return (
          <div
            key={t.id}
            className={`animate-slide-up flex items-start gap-2.5 rounded-xl border ${st.border} bg-white/95 px-4 py-3 shadow-card backdrop-blur dark:bg-slate-900/95`}
            role="status"
          >
            <span className={`mt-0.5 shrink-0 ${st.icon}`}>
              {t.type === 'success' ? (
                <CheckIcon size={18} />
              ) : t.type === 'error' ? (
                <AlertIcon size={18} />
              ) : (
                <InfoIcon size={18} />
              )}
            </span>
            <p className="flex-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{t.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="بستن اعلان"
              className="shrink-0 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
            >
              <XIcon size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════ محافظ مسیرها ═══════════════════════════

/** مسیرهای خصوصی فروشگاه — کاربر مهمان به صفحه ورود می‌رود */
export function RequireAuth({ children }: { children: ReactNode }) {
  const user = useStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return children;
}

/** مسیرهای مدیریت — فقط ادمین واردشده */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const admin = useStore((s) => s.admin);
  const location = useLocation();

  if (!admin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

// ═══════════════════════════ کارت محصول ═══════════════════════════

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlist = useStore((s) => s.wishlist);

  const inWishlist = wishlist.includes(product.id);
  const inCart = useStore((s) => s.cart.some((i) => i.productId === product.id));
  const outOfStock = product.stock <= 0;
  const badge = badgeOf(product.status);

  return (
    <article className="group card relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-pop">
      {/* تصویر */}
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800"
        aria-label={product.name}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.discount > 0 && (
          <span className="absolute top-3 right-3 rounded-lg bg-rose-500 px-2 py-1 text-xs font-bold text-white shadow">
            {faNum(product.discount)}٪
          </span>
        )}
        {badge && (
          <span className={`absolute top-3 left-3 rounded-lg px-2 py-1 text-xs font-bold ${badge.cls}`}>
            {badge.label}
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-bold text-slate-500 backdrop-blur-sm dark:bg-slate-950/70 dark:text-slate-300">
            ناموجود
          </span>
        )}
      </Link>

      {/* علاقه‌مندی */}
      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-label={inWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
        aria-pressed={inWishlist}
        className={`absolute top-3 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 shadow backdrop-blur transition hover:scale-110 dark:bg-slate-900/90 ${
          inWishlist ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
        } ${badge ? 'top-11' : ''}`}
      >
        <HeartIcon size={18} fill={inWishlist ? 'currentColor' : 'none'} />
      </button>

      {/* بدنه */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500">
          <span>{getCategoryName(product.category)}</span>
          <span>{product.brand}</span>
        </div>
        <Link
          to={`/product/${product.id}`}
          className="line-clamp-2 min-h-12 font-medium text-slate-800 transition hover:text-primary-600 dark:text-slate-100 dark:hover:text-primary-300"
        >
          {product.name}
        </Link>
        <RatingStars rating={product.rating} count={product.ratingCount} showCount={false} />

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">
              {faNum(finalPrice(product))}
              <span className="ms-1 text-[10px] font-normal text-slate-400">تومان</span>
            </div>
            {product.discount > 0 && (
              <div className="text-xs text-slate-400 line-through dark:text-slate-500">
                {faNum(product.price)}
              </div>
            )}
          </div>
          <AddToCartButton
            compact
            disabled={outOfStock}
            inCart={inCart}
            onClick={() => addToCart(product)}
          />
        </div>
      </div>
    </article>
  );
}

// ═══════════════════════════ هدر ═══════════════════════════

const navItems = [
  { to: '/', label: 'خانه', end: true },
  { to: '/products', label: 'محصولات' },
  { to: '/about', label: 'درباره ما' },
  { to: '/contact', label: 'تماس با ما' }
];

export function Header() {
  const navigate = useNavigate();
  const store = useStore();
  const { cart, wishlist, user, admin, settings, theme, mobileMenuOpen } = store;

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  // بستن منوی کاربر با کلیک بیرون از آن
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    store.closeMobileMenu();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/85">
      <div className="container-page flex h-16 items-center gap-3">
        {/* منوی موبایل */}
        <button
          type="button"
          onClick={store.openMobileMenu}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="باز کردن منو"
        >
          <MenuIcon size={22} />
        </button>

        {/* لوگو */}
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="HDKALA - صفحه اصلی">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-400 text-sm font-extrabold text-white shadow-pop">
            HD
          </span>
          <span className="hidden text-xl font-extrabold tracking-tight text-slate-900 sm:block dark:text-white">
            {settings.storeName}
          </span>
        </Link>

        {/* جستجو (دسکتاپ) */}
        <form onSubmit={submitSearch} className="relative mx-2 hidden flex-1 md:block" role="search">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در محصولات…"
            aria-label="جستجو در محصولات"
            className="input-base pe-11"
          />
          <button
            type="submit"
            aria-label="جستجو"
            className="absolute inset-y-0 left-1 my-auto flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:text-primary-600"
          >
            <SearchIcon size={18} />
          </button>
        </form>

        <div className="ms-auto flex items-center gap-1.5">
          {/* جستجو (موبایل) */}
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="جستجو"
            aria-expanded={searchOpen}
          >
            {searchOpen ? <XIcon size={20} /> : <SearchIcon size={20} />}
          </button>

          {/* پنل ادمین */}
          <Link
            to={admin ? '/admin' : '/admin/login'}
            className="flex h-10 items-center gap-1 rounded-xl px-2 text-xs font-bold text-primary-600 transition hover:bg-primary-50 sm:px-3 sm:text-sm dark:text-primary-300 dark:hover:bg-primary-950/40"
          >
            <ShieldCheckIcon size={16} />
            <span className="hidden sm:inline">پنل ادمین</span>
            <span className="sm:hidden">ادمین</span>
          </Link>

          {/* تم */}
          <button
            type="button"
            onClick={store.toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
          >
            {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </button>

          {/* علاقه‌مندی */}
          <Link
            to="/wishlist"
            className="relative hidden h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 sm:flex dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={`علاقه‌مندی‌ها (${toFa(wishlist.length)} مورد)`}
          >
            <HeartIcon size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -left-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {toFa(wishlist.length)}
              </span>
            )}
          </Link>

          {/* سبد خرید */}
          <button
            type="button"
            onClick={store.openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={`باز کردن سبد خرید (${toFa(cartCount)} کالا)`}
          >
            <BagIcon size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -left-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
                {toFa(cartCount)}
              </span>
            )}
          </button>

          {/* ناحیه کاربر */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex h-10 items-center gap-1.5 rounded-xl px-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600/10 text-primary-600 dark:text-primary-300">
                  <UserIcon size={16} />
                </span>
                <span className="hidden max-w-24 truncate sm:block">{user.name}</span>
                <ChevronDownIcon size={14} className="hidden text-slate-400 sm:block" />
              </button>
              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute left-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-card animate-fade-in dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-white">{user.name}</p>
                    <p className="truncate text-xs text-slate-400" dir="ltr">
                      {user.phone}
                    </p>
                  </div>
                  <Link
                    role="menuitem"
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    پروفایل و سفارش‌ها
                  </Link>
                  <Link
                    role="menuitem"
                    to="/wishlist"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-primary-600 sm:hidden dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    علاقه‌مندی‌ها
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setUserMenuOpen(false);
                      store.logout();
                      navigate('/');
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  >
                    <LogoutIcon size={15} /> خروج از حساب
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden h-10 items-center rounded-xl bg-primary-600 px-4 text-sm font-medium text-white transition hover:bg-primary-700 sm:flex"
            >
              ورود / ثبت‌نام
            </Link>
          )}
        </div>
      </div>

      {/* جستجوی موبایل */}
      {searchOpen && (
        <form onSubmit={submitSearch} className="border-t border-slate-200 p-3 md:hidden dark:border-slate-800" role="search">
          <div className="relative">
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در محصولات…"
              aria-label="جستجو در محصولات"
              className="input-base pe-11"
            />
            <button
              type="submit"
              aria-label="جستجو"
              className="absolute inset-y-0 left-1 my-auto flex h-9 w-9 items-center justify-center rounded-lg text-primary-600"
            >
              <SearchIcon size={18} />
            </button>
          </div>
        </form>
      )}

      {/* ناوبری دسکتاپ */}
      <nav className="hidden border-t border-slate-100 lg:block dark:border-slate-800/60" aria-label="ناوبری اصلی">
        <div className="container-page flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'border-primary-600 text-primary-600 dark:text-primary-300'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`
              }
            >
              {item.to === '/' && <HomeIcon size={15} />}
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to={admin ? '/admin' : '/admin/login'}
            className={({ isActive }) =>
              `flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'border-primary-600 text-primary-600 dark:text-primary-300'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`
            }
          >
            <ShieldCheckIcon size={15} />
            پنل ادمین
          </NavLink>
        </div>
      </nav>

      <MobileMenu open={mobileMenuOpen} onClose={store.closeMobileMenu} />
    </header>
  );
}

/** منوی کشویی موبایل */
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const admin = useStore((s) => s.admin);
  const logout = useStore((s) => s.logout);

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  const itemCls =
    'flex w-full items-center gap-2 rounded-xl px-3 py-3 text-start text-sm font-medium transition';

  return (
    <Drawer open={open} onClose={onClose} side="start" title="منو" labelledBy="mobile-menu-title">
      <nav className="p-3" aria-label="منوی موبایل">
        {navItems.map((item) => (
          <button
            key={item.to}
            type="button"
            onClick={() => go(item.to)}
            className={`${itemCls} text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800`}
          >
            {item.label}
          </button>
        ))}
        <div className="my-2 border-t border-slate-200 dark:border-slate-800" />
        <button
          type="button"
          onClick={() => go(admin ? '/admin' : '/admin/login')}
          className={`${itemCls} text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-950/40`}
        >
          پنل ادمین
        </button>
        <button
          type="button"
          onClick={() => go('/wishlist')}
          className={`${itemCls} text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800`}
        >
          علاقه‌مندی‌ها
        </button>
        {user ? (
          <>
            <button
              type="button"
              onClick={() => go('/profile')}
              className={`${itemCls} text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800`}
            >
              پروفایل و سفارش‌ها
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                logout();
                navigate('/');
              }}
              className={`${itemCls} text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10`}
            >
              خروج از حساب
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => go('/login')}
            className="mt-2 w-full rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            ورود / ثبت‌نام
          </button>
        )}
      </nav>
    </Drawer>
  );
}

// ═══════════════════════════ فوتر ═══════════════════════════

const footerBenefits = [
  { icon: TruckIcon, title: 'ارسال سریع', desc: 'به سراسر کشور' },
  { icon: ShieldIcon, title: 'ضمانت اصالت', desc: 'تضمین کالای اصل' },
  { icon: CreditCardIcon, title: 'پرداخت امن', desc: 'درگاه معتبر بانکی' },
  { icon: HeadsetIcon, title: 'پشتیبانی ۲۴/۷', desc: 'پاسخگویی همیشگی' }
];

export function Footer() {
  const settings = useStore((s) => s.settings);

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      {/* مزایا */}
      <div className="container-page grid grid-cols-2 gap-4 border-b border-slate-100 py-8 lg:grid-cols-4 dark:border-slate-800/60">
        {footerBenefits.map((b) => (
          <div key={b.title} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600/10 text-primary-600 dark:text-primary-300">
              <b.icon size={22} />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{b.title}</p>
              <p className="text-xs text-slate-400">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ستون‌های فوتر */}
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-400 text-sm font-extrabold text-white">
              HD
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{settings.storeName}</span>
          </div>
          <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
            فروشگاه اینترنتی HDKALA؛ مقصد مطمئن خرید آنلاین با هزاران کالای متنوع، ضمانت اصالت و
            ارسال سریع به سراسر ایران.
          </p>
          <div className="flex flex-wrap gap-2">
            {['نماد اعتماد', 'ساماندهی', 'ضمانت بازگشت ۷ روزه'].map((t) => (
              <span
                key={t}
                className="rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:border-slate-700 dark:text-slate-400"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <nav aria-label="دسترسی سریع">
          <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">دسترسی سریع</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              { to: '/', label: 'خانه' },
              { to: '/products', label: 'همه محصولات' },
              { to: '/cart', label: 'سبد خرید' },
              { to: '/wishlist', label: 'علاقه‌مندی‌ها' },
              { to: '/about', label: 'درباره ما' },
              { to: '/contact', label: 'تماس با ما' }
            ].map((l) => (
              <li key={l.to + l.label}>
                <Link to={l.to} className="text-slate-500 transition hover:text-primary-600 dark:text-slate-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="دسته‌بندی‌ها">
          <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">دسته‌بندی‌ها</h3>
          <ul className="space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/products?category=${c.id}`}
                  className="text-slate-500 transition hover:text-primary-600 dark:text-slate-400"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">ارتباط با ما</h3>
          <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <PhoneIcon size={16} className="text-primary-500" />
              <span dir="ltr">۰۲۱-۹۱۰۰۸۰۰۰</span>
            </li>
            <li className="flex items-center gap-2">
              <MailIcon size={16} className="text-primary-500" />
              info@hdkala.ir
            </li>
            <li className="flex items-start gap-2">
              <MapPinIcon size={16} className="mt-0.5 shrink-0 text-primary-500" />
              تهران، خیابان ولیعصر، مرکز خرید HDKALA، طبقه سوم
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 py-5 dark:border-slate-800/60">
        <p className="container-page text-center text-xs text-slate-400">
          © {toFa(1404)} فروشگاه اینترنتی {settings.storeName} — تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}

// ═══════════════════════════ کشوی سبد خرید ═══════════════════════════

export function CartDrawer() {
  const cartOpen = useStore((s) => s.cartOpen);
  const closeCart = useStore((s) => s.closeCart);
  const cart = useStore((s) => s.cart);
  const setQty = useStore((s) => s.setQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const settings = useStore((s) => s.settings);
  const navigate = useNavigate();

  const summary = cartSummary(cart, 'standard', {
    shippingFee: settings.shippingFee,
    expressFee: settings.expressFee,
    freeShippingOver: settings.freeShippingOver
  });

  const goTo = (path: string) => {
    closeCart();
    navigate(path);
  };

  return (
    <Drawer
      open={cartOpen}
      onClose={closeCart}
      side="end"
      title={`سبد خرید (${toFa(summary.count)} کالا)`}
      labelledBy="cart-drawer-title"
    >
      {cart.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
            <BagIcon size={28} />
          </div>
          <p className="font-medium text-slate-600 dark:text-slate-300">سبد خرید شما خالی است</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            محصولات مورد علاقه‌تان را به سبد اضافه کنید
          </p>
          <Button className="mt-2" onClick={() => goTo('/products')}>
            مشاهده محصولات
          </Button>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {cart.map((item) => (
              <li key={item.productId} className="flex gap-3 p-4">
                <button
                  type="button"
                  onClick={() => goTo(`/product/${item.productId}`)}
                  className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800"
                  aria-label={item.name}
                >
                  <img src={item.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
                <div className="flex flex-1 flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => goTo(`/product/${item.productId}`)}
                    className="line-clamp-1 text-start text-sm font-medium text-slate-800 hover:text-primary-600 dark:text-slate-100"
                  >
                    {item.name}
                  </button>
                  <div className="flex items-center justify-between">
                    <QuantityControl
                      small
                      value={item.qty}
                      max={item.stock}
                      onChange={(qty) => setQty(item.productId, qty)}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {faPrice(Math.round(item.price * (1 - item.discount / 100)) * item.qty)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        aria-label="حذف از سبد"
                        className="text-slate-400 transition hover:text-rose-500"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                  {item.discount > 0 && (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      سود شما:{' '}
                      {faPrice((item.price - Math.round(item.price * (1 - item.discount / 100))) * item.qty)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-slate-100 p-4 dark:border-slate-800">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <dt>جمع کالاها</dt>
                <dd>{faPrice(summary.subtotal)}</dd>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <dt>سود شما از تخفیف</dt>
                  <dd>{faPrice(summary.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <dt>هزینه ارسال</dt>
                <dd>
                  {summary.shipping === 0 ? 'رایگان' : faPrice(summary.shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-slate-900 dark:border-slate-700 dark:text-white">
                <dt>مبلغ قابل پرداخت</dt>
                <dd>{faPrice(summary.total)}</dd>
              </div>
            </dl>
            <div className="mt-4 space-y-2">
              <Button full onClick={() => goTo('/cart')}>
                مشاهده سبد خرید
              </Button>
              <Button full variant="outline" onClick={closeCart}>
                ادامه خرید
              </Button>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}

// ═══════════════════════════ قالب اصلی فروشگاه ═══════════════════════════

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1" id="main-content">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toasts />
    </div>
  );
}
