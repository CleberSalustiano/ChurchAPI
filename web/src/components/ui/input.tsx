import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-ink/80">{label}</span>
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-brass focus:ring-2 focus:ring-brass/20",
          error && "border-ember focus:border-ember focus:ring-ember/20",
          className
        )}
        {...props}
      />
      {error ? <span className="text-sm text-ember">{error}</span> : null}
    </label>
  )
);

Input.displayName = "Input";
