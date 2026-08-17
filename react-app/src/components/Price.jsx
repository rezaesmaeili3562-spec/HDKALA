import { faNum, finalPrice } from '../utils/format';

// نمایش قیمت محصول: قیمت نهایی + قیمت قبلی خط‌خورده + درصد تخفیف
export default function Price({ product, size = 'md', showDiscount = true }) {
  const final = finalPrice(product);
  const hasDiscount = product.discount > 0;

  const sizes = {
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
