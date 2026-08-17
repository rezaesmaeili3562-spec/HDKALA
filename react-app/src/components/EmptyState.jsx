import Button from './Button';

// حالت خالی یکپارچه برای لیست‌ها و صفحات
export default function EmptyState({ icon, title, description, actionLabel, onAction, actionTo }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        {icon}
      </div>
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h2>
      {description && (
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
      {actionLabel && (
        <Button className="mt-2" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {actionTo && <span className="hidden">{actionTo}</span>}
    </div>
  );
}
