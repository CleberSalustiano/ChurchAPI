"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { AppShell } from "./app-shell";

export function PortalClient() {
  const router = useRouter();
  const { isAuthenticated, isHydrated, isLoadingProfile, logout, profile } =
    useAuth();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  if (isLoadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cloud bg-halo px-6">
        <div className="rounded-lg border border-white/70 bg-white/88 px-6 py-5 text-sm text-ink shadow-panel">
          Carregando seu portal...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cloud bg-halo px-6">
        <div className="rounded-lg border border-ember/20 bg-white px-6 py-5 text-sm text-ember shadow-panel">
          Nao foi possivel carregar o perfil autenticado.
        </div>
      </div>
    );
  }

  return (
    <AppShell
      profile={profile}
      onLogout={() => {
        logout();
        router.replace("/");
      }}
    />
  );
}
