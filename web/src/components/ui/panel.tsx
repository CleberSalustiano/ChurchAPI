import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur",
        className
      )}
    >
      {children}
    </section>
  );
}
