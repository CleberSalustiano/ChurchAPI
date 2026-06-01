import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, children, ...props }, ref) => (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-ink/80">{label}</span>
      <select
        ref={ref}
        className={cn(
          "h-12 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20",
          error && "border-ember focus:border-ember focus:ring-ember/20",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-sm text-ember">{error}</span> : null}
    </label>
  )
);

Select.displayName = "Select";
