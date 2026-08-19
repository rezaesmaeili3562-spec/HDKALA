import { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { ORDER_STATUSES, type Order, type OrderStatus } from '../../types';
import { faDate, faNum, faPrice, toFa } from '../../utils/format';
import StatusBadge from '../components/StatusBadge';

export default function AdminOrdersPage() {
  const orders = useStore((s) => s.orders);
  const setOrderStatus = useStore((s) => s.setOrderStatus);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = query.trim().toLowerCase();
      if (
        q &&
        !`${o.id} ${o.receiver.name} ${o.receiver.phone}`.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (status && o.status !== status) return false;
      return true;
    });
  }, [orders, query, status]);

  return (
    <div className="page-enter space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">مدیریت سفارش‌ها</h1>
        <p className="mt-1 text-sm text-slate-500">{faNum(filtered.length)} سفارش</p>
      </div>

      <div className="card flex flex-wrap gap-3 p-4">
        <input
          className="input-base min-w-[200px] flex-1"
          placeholder="جستجو کد سفارش، نام یا موبایل…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="input-base w-auto" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="فیلتر وضعیت">
          <option value="">همه وضعیت‌ها</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 text-start font-medium">کد</th>
              <th className="px-4 py-3 text-start font-medium">مشتری</th>
              <th className="px-4 py-3 text-start font-medium">مبلغ</th>
              <th className="px-4 py-3 text-start font-medium">تاریخ</th>
              <th className="px-4 py-3 text-start font-medium">وضعیت</th>
              <th className="px-4 py-3 text-start font-medium">جزئیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((order) => (
              <tr key={order.id} data-testid={`admin-order-row-${order.id}`}>
                <td className="px-4 py-3 font-bold" dir="ltr">
                  {order.id}
                </td>
                <td className="px-4 py-3">
                  <p>{order.receiver.name}</p>
                  <p className="text-xs text-slate-400" dir="ltr">
                    {order.receiver.phone}
                  </p>
                </td>
                <td className="px-4 py-3 font-medium">{faPrice(order.total)}</td>
                <td className="px-4 py-3 text-slate-500">{faDate(order.createdAt)}</td>
                <td className="px-4 py-3">
                  <select
                    className="input-base w-auto"
                    value={order.status}
                    aria-label={`وضعیت سفارش ${order.id}`}
                    data-testid={`order-status-${order.id}`}
                    onChange={(e) => setOrderStatus(order.id, e.target.value as OrderStatus)}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-sm font-medium text-primary-600"
                    onClick={() => setSelected(order)}
                  >
                    مشاهده
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-slate-400">سفارشی پیدا نشد.</p>}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0 bg-slate-950/50" aria-label="بستن" onClick={() => setSelected(null)} />
          <div className="card relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white" dir="ltr">
                  {selected.id}
                </h2>
                <p className="text-xs text-slate-400">{faDate(selected.createdAt)}</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {selected.receiver.name} · <span dir="ltr">{selected.receiver.phone}</span>
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {selected.address.province}، {selected.address.city} — {selected.address.fullAddress}
            </p>
            <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {selected.items.map((item) => (
                <li key={item.productId} className="flex items-center justify-between py-2 text-sm">
                  <span>
                    {item.name} × {toFa(item.qty)}
                  </span>
                  <span className="font-bold">{faPrice(Math.round(item.price * (1 - item.discount / 100)) * item.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between text-sm font-extrabold">
              <span>قابل پرداخت</span>
              <span>{faPrice(selected.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
