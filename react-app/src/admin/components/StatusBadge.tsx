import { ORDER_STATUS_CLASS, type OrderStatus } from '../../types';

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${ORDER_STATUS_CLASS[status]}`}>
      {status}
    </span>
  );
}
