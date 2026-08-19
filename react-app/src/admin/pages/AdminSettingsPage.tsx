import { useForm } from 'react-hook-form';
import { useStore } from '../../store/useStore';
import type { StoreSettings } from '../../types';
import Field from '../../components/Field';
import Button from '../../components/Button';
import { faPrice } from '../../utils/format';

export default function AdminSettingsPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<StoreSettings>({
    defaultValues: settings
  });

  const preview = watch();

  const onSubmit = (data: StoreSettings) => {
    updateSettings({
      storeName: data.storeName.trim() || 'HDKALA',
      shippingFee: Number(data.shippingFee) || 0,
      expressFee: Number(data.expressFee) || 0,
      freeShippingOver: Number(data.freeShippingOver) || 0
    });
  };

  return (
    <div className="page-enter space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">تنظیمات فروشگاه</h1>
        <p className="mt-1 text-sm text-slate-500">این مقادیر بلافاصله در تسویه حساب فروشگاه اعمال می‌شوند.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card max-w-xl space-y-5 p-6" noValidate>
        <Field label="نام فروشگاه" required id="store-name" error={errors.storeName?.message}>
          <input
            id="store-name"
            className="input-base"
            data-testid="settings-store-name"
            {...register('storeName', { required: 'نام فروشگاه الزامی است' })}
          />
        </Field>
        <Field label="هزینه ارسال عادی (تومان)" required id="ship-fee" error={errors.shippingFee?.message}>
          <input
            id="ship-fee"
            type="number"
            min={0}
            className="input-base"
            data-testid="settings-shipping-fee"
            {...register('shippingFee', { required: 'هزینه ارسال الزامی است' })}
          />
        </Field>
        <Field label="هزینه ارسال اکسپرس (تومان)" id="express-fee">
          <input id="express-fee" type="number" min={0} className="input-base" {...register('expressFee')} />
        </Field>
        <Field label="آستانه ارسال رایگان (تومان)" required id="free-over" error={errors.freeShippingOver?.message}>
          <input
            id="free-over"
            type="number"
            min={0}
            className="input-base"
            data-testid="settings-free-over"
            {...register('freeShippingOver', { required: 'آستانه ارسال رایگان الزامی است' })}
          />
        </Field>
        <div className="rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          پیش‌نمایش: ارسال عادی {faPrice(preview.shippingFee || 0)} — سفارش‌های بالای{' '}
          {faPrice(preview.freeShippingOver || 0)} رایگان است.
        </div>
        <Button type="submit" data-testid="settings-save">
          ذخیره تنظیمات
        </Button>
      </form>
    </div>
  );
}
