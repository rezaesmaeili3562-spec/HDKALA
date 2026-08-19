import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '../../store/useStore';
import { faNum, faPrice, uid } from '../../utils/format';
import type { Coupon, CouponType } from '../../types';
import Field from '../../components/Field';
import Button from '../../components/Button';
import ConfirmDialog from '../components/ConfirmDialog';

interface CouponForm {
  code: string;
  type: CouponType;
  value: number;
  minOrder: number;
  active: boolean;
}

const emptyForm: CouponForm = { code: '', type: 'percent', value: 10, minOrder: 0, active: true };

export default function AdminCouponsPage() {
  const coupons = useStore((s) => s.coupons);
  const upsertCoupon = useStore((s) => s.upsertCoupon);
  const deleteCoupon = useStore((s) => s.deleteCoupon);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<Coupon | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<CouponForm>({ defaultValues: emptyForm });

  const type = watch('type');

  const openCreate = () => {
    setEditing(null);
    reset(emptyForm);
    setOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    reset({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrder: coupon.minOrder,
      active: coupon.active
    });
    setOpen(true);
  };

  const onSubmit = (data: CouponForm) => {
    const coupon: Coupon = {
      id: editing?.id || uid('cpn'),
      code: data.code.trim().toUpperCase(),
      type: data.type,
      value: Number(data.value) || 0,
      minOrder: Number(data.minOrder) || 0,
      active: data.active,
      usageCount: editing?.usageCount ?? 0,
      createdAt: editing?.createdAt ?? new Date().toISOString()
    };
    upsertCoupon(coupon);
    setOpen(false);
  };

  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">تخفیف‌ها و کوپن‌ها</h1>
          <p className="mt-1 text-sm text-slate-500">{faNum(coupons.length)} کد تخفیف</p>
        </div>
        <Button type="button" onClick={openCreate} data-testid="admin-add-coupon">
          ساخت کد تخفیف
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {coupons.map((c) => (
          <article key={c.id} className="card space-y-3 p-5" data-testid={`admin-coupon-${c.code}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-extrabold tracking-wide text-primary-600" dir="ltr">
                  {c.code}
                </p>
                <p className="text-sm text-slate-500">
                  {c.type === 'percent' ? `${faNum(c.value)}٪` : faPrice(c.value)} تخفیف
                  {c.minOrder > 0 ? ` · حداقل سفارش ${faPrice(c.minOrder)}` : ''}
                </p>
              </div>
              <span className={`rounded-lg px-2 py-1 text-xs font-bold ${c.active ? 'bg-emerald-500/15 text-emerald-600' : 'bg-slate-500/15 text-slate-500'}`}>
                {c.active ? 'فعال' : 'غیرفعال'}
              </span>
            </div>
            <p className="text-xs text-slate-400">استفاده: {faNum(c.usageCount)}</p>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => openEdit(c)}>
                ویرایش
              </Button>
              <Button type="button" size="sm" variant="danger" onClick={() => setPending(c)}>
                حذف
              </Button>
            </div>
          </article>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0 bg-slate-950/50" aria-label="بستن" onClick={() => setOpen(false)} />
          <form onSubmit={handleSubmit(onSubmit)} className="card relative z-10 w-full max-w-md space-y-4 p-6" noValidate>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{editing ? 'ویرایش کوپن' : 'کوپن جدید'}</h2>
            <Field label="کد تخفیف" required id="cpn-code" error={errors.code?.message}>
              <input
                id="cpn-code"
                className="input-base uppercase"
                dir="ltr"
                data-testid="coupon-code"
                {...register('code', { required: 'کد تخفیف الزامی است', minLength: { value: 3, message: 'حداقل ۳ کاراکتر' } })}
              />
            </Field>
            <Field label="نوع" id="cpn-type">
              <select id="cpn-type" className="input-base" data-testid="coupon-type" {...register('type')}>
                <option value="percent">درصدی</option>
                <option value="fixed">مبلغی</option>
              </select>
            </Field>
            <Field label={type === 'percent' ? 'درصد تخفیف' : 'مبلغ تخفیف (تومان)'} required id="cpn-value" error={errors.value?.message}>
              <input
                id="cpn-value"
                type="number"
                min={1}
                className="input-base"
                data-testid="coupon-value"
                {...register('value', { required: 'مقدار الزامی است', min: { value: 1, message: 'مقدار باید بزرگ‌تر از صفر باشد' } })}
              />
            </Field>
            <Field label="حداقل مبلغ سفارش" id="cpn-min">
              <input id="cpn-min" type="number" min={0} className="input-base" {...register('minOrder')} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-indigo-600" {...register('active')} />
              فعال باشد
            </label>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                انصراف
              </Button>
              <Button type="submit" data-testid="coupon-save">
                ذخیره
              </Button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pending)}
        title="حذف کوپن"
        description={`کد «${pending?.code || ''}» حذف می‌شود.`}
        confirmLabel="حذف"
        danger
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending) deleteCoupon(pending.id);
          setPending(null);
        }}
      />
    </div>
  );
}
