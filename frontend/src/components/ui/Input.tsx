import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-300"
        >
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={`w-full rounded-xl border bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 ${
            error ? "border-red-500" : "border-slate-700"
          } ${className}`}
          {...props}
        />
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>
    );
  },
);
