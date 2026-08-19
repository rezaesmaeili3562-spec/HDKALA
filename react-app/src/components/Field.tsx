import { forwardRef, type ReactNode } from 'react';

interface FieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  id?: string;
  className?: string;
  children?: ReactNode;
}

const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, error, hint, required, id, className = '', children },
  ref
) {
  return (
    <div className={`space-y-1.5 ${className}`} ref={ref}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="ms-0.5 text-rose-500">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs font-medium text-rose-500" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Field;
