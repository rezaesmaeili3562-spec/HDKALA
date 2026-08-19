import { faNum, faPrice } from '../../utils/format';

interface DayPoint {
  label: string;
  value: number;
}

export default function SalesChart({ points }: { points: DayPoint[] }) {
  const max = Math.max(1, ...points.map((p) => p.value));

  return (
    <div className="flex h-48 items-end gap-2" data-testid="sales-chart" role="img" aria-label="نمودار فروش هفت روز اخیر">
      {points.map((p) => {
        const height = Math.round((p.value / max) * 100);
        return (
          <div key={p.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-[10px] font-medium text-slate-400">{p.value ? faPrice(p.value) : faNum(0)}</span>
            <div className="flex h-32 w-full items-end overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
              <div
                className="w-full rounded-xl bg-gradient-to-t from-primary-600 to-accent-400 transition-all"
                style={{ height: `${Math.max(height, p.value > 0 ? 8 : 2)}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">{p.label}</span>
          </div>
        );
      })}
    </div>
  );
}
