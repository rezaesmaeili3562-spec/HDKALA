import { faDate } from '../../utils/format';
import type { Order, Product, UserAccount } from '../../types';

export function lastSevenDaysSales(orders: Order[]): { label: string; value: number }[] {
  const days: { label: string; value: number }[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    const value = orders
      .filter((o) => {
        if (o.status === 'لغو شده') return false;
        const t = new Date(o.createdAt).getTime();
        return t >= d.getTime() && t < next.getTime();
      })
      .reduce((sum, o) => sum + (o.total || 0), 0);
    days.push({
      label: d.toLocaleDateString('fa-IR', { weekday: 'narrow' }),
      value
    });
  }
  return days;
}

export function dashboardStats(orders: Order[], products: Product[], users: UserAccount[]) {
  const paid = orders.filter((o) => o.status !== 'لغو شده');
  const revenue = paid.reduce((sum, o) => sum + (o.total || 0), 0);
  const inStock = products.filter((p) => p.stock > 0 && p.active !== false).length;
  const outOfStock = products.filter((p) => p.stock <= 0).length;
  return {
    revenue,
    orderCount: orders.length,
    userCount: users.length,
    inStock,
    outOfStock,
    productCount: products.length
  };
}

export function recentOrders(orders: Order[], limit = 6): Order[] {
  return [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export { faDate };
