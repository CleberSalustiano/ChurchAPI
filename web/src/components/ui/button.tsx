import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClassName: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-cloud shadow-panel hover:bg-[#133250] disabled:bg-[#6b7280]",
  secondary:
    "border border-line bg-white/92 text-ink hover:border-brass hover:text-brass",
  ghost: "text-ink hover:bg-white/70",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass disabled:cursor-not-allowed",
        variantClassName[variant],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
