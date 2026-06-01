"use client";

import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

export type SegmentedTabOption<T extends string> = {
  value: T;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  disabled?: boolean;
};

export function SegmentedTabs<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  options: Array<SegmentedTabOption<T>>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex w-full flex-wrap items-stretch gap-2 rounded-lg border border-line bg-cloud/72 p-2",
        className
      )}
      role="tablist"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex min-h-11 min-w-[132px] flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-center text-sm font-semibold leading-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass sm:min-w-0",
              isActive
                ? "bg-white text-ink shadow-sm"
                : "text-ink/62 hover:bg-white/72 hover:text-ink",
              option.disabled
                ? "cursor-not-allowed opacity-45 hover:bg-transparent hover:text-ink/62"
                : ""
            )}
          >
            {Icon ? <Icon className="h-4 w-4" /> : null}
            <span className="whitespace-normal">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
