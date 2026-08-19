import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { faNum, faPrice, faDate } from '../../utils/format';
import { dashboardStats, lastSevenDaysSales, recentOrders } from '../utils/stats';
import SalesChart from '../components/SalesChart';
import StatusBadge from '../components/StatusBadge';

export default function AdminDashboardPage() {
  const orders = useStore((s) => s.orders);
  const products = useStore((s) => s.products);
  const users = useStore((s) => s.users);
  const stats = dashboardStats(orders, products, users);
  const chart = lastSevenDaysSales(orders);
  const latest = recentOrders(orders);

  const cards = [
    { label: 'درآمد خالص', value: faPrice(stats.revenue), hint: 'بدون سفارش‌های لغوشده', testId: 'stat-revenue' },
    { label: 'سفارش‌ها', value: faNum(stats.orderCount), hint: 'کل سفارش‌های ثبت‌شده', testId: 'stat-orders' },
    { label: 'کاربران', value: faNum(stats.userCount), hint: 'حساب‌های ثبت‌شده', testId: 'stat-users' },
    {
      label: 'موجودی کالا',
      value: `${faNum(stats.inStock)} / ${faNum(stats.outOfStock)}`,
      hint: 'موجود / ناموجود',
      testId: 'stat-stock'
    }
  ];

  return (
    <div className="page-enter space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">داشبورد</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">نمای کلی فروشگاه در یک نگاه</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <article key={c.label} className="card p-5" data-testid={c.testId}>
            <p className="text-xs font-medium text-slate-400">{c.label}</p>
            <p className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">{c.value}</p>
            <p className="mt-1 text-xs text-slate-400">{c.hint}</p>
          </article>
        ))}
      </section>

      <section className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">فروش ۷ روز اخیر</h2>
          <span className="text-xs text-slate-400">{faNum(stats.productCount)} محصول در کاتالوگ</span>
        </div>
        <SalesChart points={chart} />
      </section>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">آخرین سفارش‌ها</h2>
          <Link to="/admin/orders" className="text-sm font-medium text-primary-600 dark:text-primary-300">
            مشاهده همه
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">هنوز سفارشی ثبت نشده است.</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {latest.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100" dir="ltr">
                    {order.id}
                  </p>
                  <p className="text-xs text-slate-400">
                    {order.receiver.name} · {faDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">{faPrice(order.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
