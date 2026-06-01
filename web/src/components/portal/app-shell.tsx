"use client";

import { ComponentType, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn, formatAccessLabel, formatChurchScopeLabel } from "@/lib/utils";
import type { MeResponse } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { AccountSettingsCard } from "./account-settings-card";
import { CultDashboard } from "./cult-dashboard";
import { FinanceDashboard } from "./finance-dashboard";
import { ManagementDashboard } from "./management-dashboard";
import { PasswordChangeCard } from "./password-change-card";
import {
  AccountIcon,
  CardIcon,
  ChevronDoubleIcon,
  CultIcon,
  FinanceIcon,
  LeadershipIcon,
} from "./portal-icons";

type NavigationItem = {
  id: string;
  label: string;
  shortLabel: string;
  eyebrow: string;
  icon: ComponentType<{ className?: string }>;
};

function buildNavigation(profile: MeResponse) {
  const items: NavigationItem[] = [
    {
      id: "card",
      label: "Minha carteirinha",
      shortLabel: "CM",
      eyebrow: "Membro",
      icon: CardIcon,
    },
    {
      id: "account",
      label: "Minha conta",
      shortLabel: "CT",
      eyebrow: "Acesso",
      icon: AccountIcon,
    },
  ];

  if (profile.permissions?.canViewManagementData) {
    items.push({
      id: "management",
      label: "Gestao",
      shortLabel: "GS",
      eyebrow: "Igrejas",
      icon: LeadershipIcon,
    });
  }

  if (profile.permissions?.canViewManagementData) {
    items.push({
      id: "cults",
      label: "Cultos",
      shortLabel: "CL",
      eyebrow: "Agenda",
      icon: CultIcon,
    });
  }

  if (profile.permissions?.canViewManagementData) {
    items.push({
      id: "finance",
      label: "Financeiro",
      shortLabel: "FN",
      eyebrow: "Tesouraria",
      icon: FinanceIcon,
    });
  }

  return items;
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-lg border border-line bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/65">
      {children}
    </span>
  );
}

function NavigationButton({
  item,
  isActive,
  isCollapsed,
  onSelect,
}: {
  item: NavigationItem;
  isActive: boolean;
  isCollapsed: boolean;
  onSelect: (viewId: string) => void;
}) {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onSelect(item.id)}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass",
        isCollapsed ? "justify-center px-0" : "",
        isActive
          ? "bg-white/12 text-white"
          : "text-cloud/72 hover:bg-white/6 hover:text-white"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-white/6 text-brass">
        <Icon className="h-5 w-5" />
      </span>

      {!isCollapsed ? (
        <span className="min-w-0">
          <span className="block text-[11px] uppercase tracking-[0.28em] text-cloud/50">
            {item.eyebrow}
          </span>
          <span className="mt-1 block truncate text-sm font-semibold">
            {item.label}
          </span>
        </span>
      ) : null}
    </button>
  );
}

export function AppShell({
  profile,
  onLogout,
}: {
  profile: MeResponse;
  onLogout: () => void;
}) {
  const router = useRouter();
  const defaultView = profile.permissions?.canViewManagementData
    ? "management"
    : "account";
  const [activeView, setActiveView] = useState(defaultView);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = buildNavigation(profile);
  const activeNavigation = navigation.find((item) => item.id === activeView);
  const ActiveIcon = activeNavigation?.icon ?? CardIcon;

  useEffect(() => {
    const storedValue = window.localStorage.getItem("churchapp.sidebar.collapsed");
    if (storedValue === "true") {
      setIsSidebarCollapsed(true);
    }
  }, []);

  function handleNavigation(viewId: string) {
    if (viewId === "card") {
      setIsSidebarOpen(false);
      router.push("/portal/carteirinha");
      return;
    }

    setActiveView(viewId);
    setIsSidebarOpen(false);
  }

  function toggleSidebarCollapse() {
    setIsSidebarCollapsed((current) => {
      const nextValue = !current;
      window.localStorage.setItem(
        "churchapp.sidebar.collapsed",
        String(nextValue)
      );
      return nextValue;
    });
  }

  return (
    <div className="min-h-screen bg-cloud bg-halo text-ink lg:grid lg:grid-cols-[auto_minmax(0,1fr)]">
      <div
        className={cn(
          "fixed inset-0 z-30 bg-[#0f2741]/48 backdrop-blur-sm transition duration-300 lg:hidden",
          isSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[292px] flex-col border-r border-white/8 bg-[#0f2741] px-4 py-5 text-cloud shadow-panel transition-[transform,width,padding,border-radius] duration-500 ease-out sm:px-5 lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:translate-x-0 lg:rounded-r-2xl lg:border-r lg:px-5 lg:py-6",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          isSidebarCollapsed ? "lg:w-[112px]" : "lg:w-[308px]"
        )}
        aria-label="Navegacao principal do portal"
      >
        <div className="flex items-center justify-between gap-3">
          <div className={cn("min-w-0", isSidebarCollapsed ? "lg:hidden" : "")}>
            <p className="text-xs uppercase tracking-[0.34em] text-brass">
              Portal
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSidebarCollapse}
              className="hidden h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-cloud/72 transition duration-300 hover:bg-white/8 hover:text-white lg:inline-flex"
              aria-label={
                isSidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"
              }
              aria-expanded={!isSidebarCollapsed}
            >
              <ChevronDoubleIcon
                className={cn(
                  "h-4 w-4 transition-transform duration-500",
                  isSidebarCollapsed ? "rotate-180" : "rotate-0"
                )}
              />
            </button>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-semibold text-cloud/72 transition hover:bg-white/8 hover:text-white lg:hidden"
              aria-label="Fechar menu lateral"
            >
              X
            </button>
          </div>
        </div>

        <div
          className={cn(
            "mt-6 flex flex-wrap gap-2",
            isSidebarCollapsed ? "lg:hidden" : ""
          )}
        >
          <Badge>{formatAccessLabel(profile.access?.level)}</Badge>
          <Badge>{formatChurchScopeLabel(profile.access?.scope)}</Badge>
        </div>

        <nav className="mt-8 space-y-2" aria-label="Secoes do portal">
          {navigation.map((item) => (
            <NavigationButton
              key={item.id}
              item={item}
              isActive={activeView === item.id}
              isCollapsed={isSidebarCollapsed}
              onSelect={handleNavigation}
            />
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-8">
          <div
            className={cn(
              "rounded-lg border border-white/10 bg-white/5 p-4",
              isSidebarCollapsed ? "lg:px-3 lg:py-4" : ""
            )}
          >
            {!isSidebarCollapsed ? (
              <>
                <p className="text-xs uppercase tracking-[0.28em] text-brass">
                  Usuario
                </p>
                <p className="mt-2 text-sm leading-6 text-cloud/74">
                  {profile.member.name}
                </p>
              </>
            ) : (
              <div className="text-center text-[11px] uppercase tracking-[0.24em] text-brass">
                {profile.member.name
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase() ?? "")
                  .join("")}
              </div>
            )}
          </div>

          <Button
            variant="secondary"
            onClick={onLogout}
            className={cn(
              "w-full border-white/12 bg-white/6 !text-cloud hover:border-brass hover:bg-white/10 hover:!text-white",
              isSidebarCollapsed ? "lg:px-0" : ""
            )}
          >
            {isSidebarCollapsed ? "Sair" : "Encerrar sessao"}
          </Button>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <header className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-white/70 bg-white/88 px-4 py-3 shadow-panel backdrop-blur lg:hidden">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-cloud text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:border-brass hover:text-brass"
                aria-label="Abrir menu lateral"
                aria-controls="portal-main-header"
                aria-expanded={isSidebarOpen}
              >
                Menu
              </button>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">
                  Portal do membro
                </p>
                <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-ink">
                  <ActiveIcon className="h-4 w-4 text-brass" />
                  <p className="break-words">
                    {activeNavigation?.label ?? "Minha carteirinha"}
                  </p>
                </div>
              </div>
            </div>

            <div
              id="portal-main-header"
              className="flex flex-col gap-4 rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">
                  Portal do membro
                </p>
                <div className="mt-2 flex items-start gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-cloud text-brass">
                    <ActiveIcon className="h-5 w-5" />
                  </span>
                  <h2 className="break-words font-display text-2xl text-ink sm:text-3xl">
                    {profile.member.name}
                  </h2>
                </div>
                <p className="mt-2 break-all text-sm text-ink/70 sm:break-normal">
                  {profile.member.email} • Igreja #{profile.member.id_church}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 lg:hidden">
                <Badge>{formatAccessLabel(profile.access?.level)}</Badge>
                <Badge>{formatChurchScopeLabel(profile.access?.scope)}</Badge>
              </div>
            </div>
          </header>

          {profile.mustChangePassword ? (
            <PasswordChangeCard profile={profile} />
          ) : null}

          {activeView === "account" ? (
            <AccountSettingsCard profile={profile} />
          ) : null}

          {activeView === "management" ? (
            <ManagementDashboard profile={profile} />
          ) : null}

          {activeView === "cults" ? (
            <CultDashboard profile={profile} />
          ) : null}

          {activeView === "finance" ? (
            <FinanceDashboard profile={profile} />
          ) : null}
        </div>
      </main>
    </div>
  );
}
