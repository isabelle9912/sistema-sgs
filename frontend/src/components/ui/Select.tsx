import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      placeholder = "Selecione uma opção",
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          {label}
        </label>

        <select
          id={id}
          ref={ref}
          className={`w-full rounded-xl border bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 ${
            error ? "border-red-500" : "border-slate-700"
          } ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <span className="mt-1 block text-sm text-red-500">{error}</span>
        )}
      </div>
    );
  },
);
