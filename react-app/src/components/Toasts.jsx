import { useStore } from '../store/useStore';
import { CheckIcon, AlertIcon, InfoIcon, XIcon } from './Icons';

const styles = {
  success: { border: 'border-emerald-500/40', icon: 'text-emerald-500' },
  error: { border: 'border-rose-500/40', icon: 'text-rose-500' },
  info: { border: 'border-primary-500/40', icon: 'text-primary-500' }
};

// اعلان‌های Toast سراسری
export default function Toasts() {
  const toasts = useStore((s) => s.toasts);
  const dismissToast = useStore((s) => s.dismissToast);

  if (!toasts.length) return null;

  return (
    <div
      className="fixed bottom-6 left-6 z-[70] flex w-[calc(100%-3rem)] max-w-sm flex-col gap-2"
      role="region"
      aria-label="اعلان‌ها"
    >
      {toasts.map((t) => {
        const st = styles[t.type] || styles.info;
        return (
          <div
            key={t.id}
            className={`animate-slide-up flex items-start gap-2.5 rounded-xl border ${st.border} bg-white/95 px-4 py-3 shadow-card backdrop-blur dark:bg-slate-900/95`}
            role="status"
          >
            <span className={`mt-0.5 shrink-0 ${st.icon}`}>
              {t.type === 'success' ? (
                <CheckIcon size={18} />
              ) : t.type === 'error' ? (
                <AlertIcon size={18} />
              ) : (
                <InfoIcon size={18} />
              )}
            </span>
            <p className="flex-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{t.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="بستن اعلان"
              className="shrink-0 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
            >
              <XIcon size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
