import { useEffect, type ReactNode } from 'react';
import { XIcon } from './Icons';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: 'end' | 'start';
  title: string;
  children?: ReactNode;
  footer?: ReactNode;
  labelledBy?: string;
}

export default function Drawer({
  open,
  onClose,
  side = 'end',
  title,
  children,
  footer,
  labelledBy
}: DrawerProps) {
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const position = side === 'end' ? 'left-0' : 'right-0';
  const offScreen = side === 'end' ? '-translate-x-full' : 'translate-x-full';

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-labelledby={labelledBy}
        className={`fixed inset-y-0 z-50 ${position} flex w-full max-w-sm flex-col bg-white shadow-2xl transition-[transform,visibility] duration-300 dark:bg-slate-900 ${
          open ? 'visible translate-x-0' : `invisible ${offScreen}`
        }`}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5 dark:border-slate-800">
          <h2 id={labelledBy} className="text-base font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <XIcon size={18} />
          </button>
        </header>
        <div className="custom-scrollbar flex-1 overflow-y-auto">{children}</div>
        {footer && <footer className="border-t border-slate-200 p-4 dark:border-slate-800">{footer}</footer>}
      </aside>
    </>
  );
}
