import { CheckIcon, PlusIcon } from './Icons';

// دکمه با حالت‌های hover / active / disabled / loading
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  full = false,
  className = '',
  children,
  ...rest
}) {
  const variants = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-pop disabled:hover:shadow-sm',
    accent:
      'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-600/90 shadow-sm',
    outline:
      'border border-slate-300 bg-white text-slate-700 hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-primary-300',
    ghost:
      'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800'
  };
  const sizes = {
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

// دکمه افزودن به سبد با حالت موفقیت لحظه‌ای (قابل استفاده در کارت محصول)
export function AddToCartButton({ inCart, onClick, disabled, compact = false }) {
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
