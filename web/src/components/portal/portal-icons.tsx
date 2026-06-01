import { cn } from "@/lib/utils";

function iconClassName(className?: string) {
  return cn("h-5 w-5 shrink-0", className);
}

export function CardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName(className)}>
      <rect x="3.5" y="5" width="17" height="14" rx="3" />
      <path d="M3.5 9.5h17" />
      <path d="M7 14.5h4" />
    </svg>
  );
}

export function AccountIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName(className)}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 18.5c1.6-3.1 4-4.7 6.5-4.7s4.9 1.6 6.5 4.7" />
    </svg>
  );
}

export function ChurchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName(className)}>
      <path d="M12 3v5" />
      <path d="M9.5 5.5h5" />
      <path d="M6 10.5 12 6l6 4.5v9H6z" />
      <path d="M10 19v-4h4v4" />
    </svg>
  );
}

export function MembersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName(className)}>
      <circle cx="9" cy="9" r="2.6" />
      <circle cx="16.5" cy="10.5" r="2.2" />
      <path d="M4.8 18.5c1.1-2.5 3-4 5.2-4 2.1 0 4 1.5 5.1 4" />
      <path d="M14.2 18.5c.6-1.7 1.8-2.9 3.5-3.4" />
    </svg>
  );
}

export function LeadershipIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName(className)}>
      <path d="m12 3 1.9 3.9 4.3.6-3.1 3 0.7 4.3L12 12.9 8.2 14.8l0.7-4.3-3.1-3 4.3-.6z" />
      <path d="M7 20.5h10" />
    </svg>
  );
}

export function CultIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName(className)}>
      <path d="M12 4v4" />
      <path d="M10 6h4" />
      <rect x="5" y="9" width="14" height="10" rx="3" />
      <path d="M8 13h8" />
    </svg>
  );
}

export function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName(className)}>
      <rect x="4" y="5.5" width="16" height="14" rx="3" />
      <path d="M8 3.8v3.4" />
      <path d="M16 3.8v3.4" />
      <path d="M4 9.5h16" />
      <path d="M8 13h3" />
      <path d="M13 13h3" />
      <path d="M8 16.2h3" />
    </svg>
  );
}

export function FinanceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName(className)}>
      <path d="M12 4v16" />
      <path d="M16.5 7.5c-.7-.9-2.1-1.5-3.6-1.5-2.2 0-4 .9-4 2.6 0 3.8 7.8 1.5 7.8 5.8 0 1.8-1.8 3.1-4.3 3.1-1.8 0-3.4-.6-4.4-1.8" />
    </svg>
  );
}

export function FilterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName(className)}>
      <path d="M4.5 6h15" />
      <path d="M7.5 12h9" />
      <path d="M10.5 18h3" />
    </svg>
  );
}

export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName(className)}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function EditIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName(className)}>
      <path d="m4 20 4.4-1 9-9a2 2 0 0 0-2.8-2.8l-9 9z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

export function LinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName(className)}>
      <path d="M10 13.5 14 9.5" />
      <path d="M8.3 15.2 6.5 17a3 3 0 1 1-4.2-4.2l3-3a3 3 0 0 1 4.2 0" />
      <path d="M15.7 8.8 17.5 7a3 3 0 1 1 4.2 4.2l-3 3a3 3 0 0 1-4.2 0" />
    </svg>
  );
}

export function WorkflowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName(className)}>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="12" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <path d="M8 7.2 15.8 10.8" />
      <path d="M8 16.8 15.8 13.2" />
    </svg>
  );
}

export function ChevronDoubleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName(className)}>
      <path d="m14.5 6-5.5 6 5.5 6" />
      <path d="m19 6-5.5 6 5.5 6" />
    </svg>
  );
}
