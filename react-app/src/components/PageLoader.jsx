export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="در حال بارگذاری">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600 dark:border-slate-800 dark:border-t-primary-400" />
        <p className="text-sm text-slate-500 dark:text-slate-400">در حال بارگذاری…</p>
      </div>
    </div>
  );
}
