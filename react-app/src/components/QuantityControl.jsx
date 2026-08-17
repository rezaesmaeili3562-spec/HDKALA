import { MinusIcon, PlusIcon } from './Icons';
import { toFa } from '../utils/format';

// کنترل تعداد محصول (سبد خرید و صفحه محصول)
export default function QuantityControl({ value, onChange, min = 1, max = 99, small = false }) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  const btnCls = `flex items-center justify-center text-slate-600 transition hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-300 dark:hover:text-primary-300 ${
    small ? 'h-7 w-7' : 'h-9 w-9'
  }`;

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700 ${
        small ? '' : 'bg-white dark:bg-slate-800'
      }`}
    >
      <button type="button" onClick={inc} disabled={value >= max} className={btnCls} aria-label="افزایش تعداد">
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
      <button type="button" onClick={dec} disabled={value <= min} className={btnCls} aria-label="کاهش تعداد">
        <MinusIcon size={small ? 14 : 16} />
      </button>
    </div>
  );
}
