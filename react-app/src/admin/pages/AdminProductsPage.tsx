import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '../../store/useStore';
import { categories, getCategoryName, statusLabels } from '../../data/categories';
import { faNum, faPrice, uid } from '../../utils/format';
import { PRODUCT_IMAGE_OPTIONS, type Product, type ProductBadge } from '../../types';
import Field from '../../components/Field';
import Button from '../../components/Button';
import ConfirmDialog from '../components/ConfirmDialog';
import { PencilIcon, TrashIcon, PlusIcon, SearchIcon } from '../../components/Icons';

interface ProductFormValues {
  name: string;
  category: string;
  brand: string;
  price: number;
  discount: number;
  stock: number;
  status: ProductBadge;
  image: string;
  desc: string;
  features: string;
  specs: string;
  colors: string;
  active: boolean;
}

const emptyForm: ProductFormValues = {
  name: '',
  category: 'electronics',
  brand: '',
  price: 0,
  discount: 0,
  stock: 0,
  status: '',
  image: PRODUCT_IMAGE_OPTIONS[0],
  desc: '',
  features: '',
  specs: '',
  colors: '',
  active: true
};

function toForm(product: Product): ProductFormValues {
  return {
    name: product.name,
    category: product.category,
    brand: product.brand,
    price: product.price,
    discount: product.discount,
    stock: product.stock,
    status: product.status || '',
    image: product.image,
    desc: product.desc,
    features: (product.features || []).join('\n'),
    specs: Object.entries(product.specs || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n'),
    colors: (product.colors || []).join('، '),
    active: product.active !== false
  };
}

function parseSpecs(raw: string): Record<string, string> {
  const specs: Record<string, string> = {};
  raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length) specs[key.trim()] = rest.join(':').trim();
    });
  return specs;
}

function parseList(raw: string): string[] {
  return raw
    .split(/[\n,،]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AdminProductsPage() {
  const products = useStore((s) => s.products);
  const upsertProduct = useStore((s) => s.upsertProduct);
  const deleteProduct = useStore((s) => s.deleteProduct);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in' | 'out'>('all');
  const [editing, setEditing] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProductFormValues>({ defaultValues: emptyForm });

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = query.trim().toLowerCase();
      if (q && !`${p.name} ${p.brand}`.toLowerCase().includes(q)) return false;
      if (category && p.category !== category) return false;
      if (stockFilter === 'in' && p.stock <= 0) return false;
      if (stockFilter === 'out' && p.stock > 0) return false;
      return true;
    });
  }, [products, query, category, stockFilter]);

  const openCreate = () => {
    setEditing(null);
    reset(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    reset(toForm(product));
    setFormOpen(true);
  };

  const onSubmit = (data: ProductFormValues) => {
    const product: Product = {
      id: editing?.id || uid('p'),
      name: data.name.trim(),
      category: data.category,
      brand: data.brand.trim(),
      price: Number(data.price) || 0,
      discount: Math.min(100, Math.max(0, Number(data.discount) || 0)),
      stock: Math.max(0, Number(data.stock) || 0),
      status: data.status || '',
      image: data.image,
      desc: data.desc.trim(),
      features: parseList(data.features),
      specs: parseSpecs(data.specs),
      colors: parseList(data.colors),
      rating: editing?.rating ?? 0,
      ratingCount: editing?.ratingCount ?? 0,
      views: editing?.views ?? 0,
      created: editing?.created ?? new Date().toISOString().slice(0, 10),
      active: data.active
    };
    upsertProduct(product);
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">مدیریت محصولات</h1>
          <p className="mt-1 text-sm text-slate-500">{faNum(filtered.length)} کالا</p>
        </div>
        <Button type="button" onClick={openCreate} data-testid="admin-add-product">
          <PlusIcon size={16} /> افزودن محصول
        </Button>
      </div>

      <div className="card flex flex-wrap gap-3 p-4">
        <div className="relative min-w-[200px] flex-1">
          <SearchIcon size={16} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
          <input
            className="input-base pe-10"
            placeholder="جستجو نام یا برند…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="admin-product-search"
          />
        </div>
        <select className="input-base w-auto" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="فیلتر دسته">
          <option value="">همه دسته‌ها</option>
          {categories.map((c: { id: string; name: string }) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="input-base w-auto"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value as 'all' | 'in' | 'out')}
          aria-label="فیلتر موجودی"
        >
          <option value="all">همه موجودی‌ها</option>
          <option value="in">فقط موجود</option>
          <option value="out">فقط ناموجود</option>
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 text-start font-medium">محصول</th>
              <th className="px-4 py-3 text-start font-medium">دسته</th>
              <th className="px-4 py-3 text-start font-medium">قیمت</th>
              <th className="px-4 py-3 text-start font-medium">موجودی</th>
              <th className="px-4 py-3 text-start font-medium">وضعیت</th>
              <th className="px-4 py-3 text-start font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((p) => (
              <tr key={p.id} data-testid={`admin-product-row-${p.id}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{getCategoryName(p.category)}</td>
                <td className="px-4 py-3 font-medium">{faPrice(p.price)}</td>
                <td className="px-4 py-3">{faNum(p.stock)}</td>
                <td className="px-4 py-3">
                  {p.stock <= 0 ? (
                    <span className="text-xs font-bold text-rose-500">ناموجود</span>
                  ) : p.status && p.status in statusLabels ? (
                    <span className={`rounded-lg px-2 py-1 text-xs font-bold ${statusLabels[p.status as 'new' | 'hot' | 'bestseller'].cls}`}>
                      {statusLabels[p.status as 'new' | 'hot' | 'bestseller'].label}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">عادی</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      aria-label={`ویرایش ${p.name}`}
                      onClick={() => openEdit(p)}
                    >
                      <PencilIcon size={16} />
                    </button>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                      aria-label={`حذف ${p.name}`}
                      onClick={() => setPendingDelete(p)}
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-slate-400">محصولی پیدا نشد.</p>}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-slate-950/50 p-4" role="dialog" aria-modal="true">
          <div className="card mx-auto my-6 w-full max-w-3xl p-6">
            <h2 className="mb-5 text-lg font-extrabold text-slate-900 dark:text-white">
              {editing ? 'ویرایش محصول' : 'افزودن محصول'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
              <Field label="نام محصول" required id="p-name" error={errors.name?.message} className="sm:col-span-2">
                <input id="p-name" className="input-base" data-testid="product-name" {...register('name', { required: 'نام محصول الزامی است' })} />
              </Field>
              <Field label="دسته‌بندی" required id="p-cat">
                <select id="p-cat" className="input-base" data-testid="product-category" {...register('category', { required: true })}>
                  {categories.map((c: { id: string; name: string }) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="برند" required id="p-brand" error={errors.brand?.message}>
                <input id="p-brand" className="input-base" data-testid="product-brand" {...register('brand', { required: 'برند الزامی است' })} />
              </Field>
              <Field label="قیمت (تومان)" required id="p-price" error={errors.price?.message}>
                <input
                  id="p-price"
                  type="number"
                  min={0}
                  className="input-base"
                  data-testid="product-price"
                  {...register('price', { required: 'قیمت الزامی است', min: { value: 1, message: 'قیمت باید بزرگ‌تر از صفر باشد' } })}
                />
              </Field>
              <Field label="تخفیف (٪)" id="p-discount">
                <input id="p-discount" type="number" min={0} max={100} className="input-base" data-testid="product-discount" {...register('discount')} />
              </Field>
              <Field label="موجودی" required id="p-stock">
                <input id="p-stock" type="number" min={0} className="input-base" data-testid="product-stock" {...register('stock', { required: true })} />
              </Field>
              <Field label="وضعیت نمایش" id="p-status">
                <select id="p-status" className="input-base" {...register('status')}>
                  <option value="">عادی</option>
                  <option value="new">جدید</option>
                  <option value="hot">فروش ویژه</option>
                  <option value="bestseller">پرفروش</option>
                </select>
              </Field>
              <Field label="تصویر" id="p-image" className="sm:col-span-2">
                <select id="p-image" className="input-base" data-testid="product-image" {...register('image')}>
                  {PRODUCT_IMAGE_OPTIONS.map((src) => (
                    <option key={src} value={src}>
                      {src.replace('./images/', '')}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="توضیحات" required id="p-desc" error={errors.desc?.message} className="sm:col-span-2">
                <textarea id="p-desc" rows={3} className="input-base resize-none" data-testid="product-desc" {...register('desc', { required: 'توضیحات الزامی است' })} />
              </Field>
              <Field label="ویژگی‌ها (هر خط یک مورد)" id="p-features">
                <textarea id="p-features" rows={3} className="input-base resize-none" {...register('features')} />
              </Field>
              <Field label="مشخصات (کلید: مقدار)" id="p-specs">
                <textarea id="p-specs" rows={3} className="input-base resize-none" {...register('specs')} />
              </Field>
              <Field label="رنگ‌ها (با ویرگول)" id="p-colors">
                <input id="p-colors" className="input-base" {...register('colors')} />
              </Field>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input type="checkbox" className="h-4 w-4 accent-indigo-600" {...register('active')} />
                نمایش در فروشگاه
              </label>
              <div className="flex justify-end gap-2 sm:col-span-2">
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                  انصراف
                </Button>
                <Button type="submit" data-testid="product-save">
                  ذخیره محصول
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="حذف محصول"
        description={`محصول «${pendingDelete?.name || ''}» از فروشگاه حذف می‌شود.`}
        confirmLabel="حذف"
        danger
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteProduct(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
