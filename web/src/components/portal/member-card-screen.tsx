"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { MemberIdentityCard } from "./member-identity-card";

export function MemberCardScreen() {
  const router = useRouter();
  const { isAuthenticated, isHydrated, isLoadingProfile, profile } = useAuth();

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
        <div className="rounded-lg border border-white/70 bg-white/92 px-6 py-5 text-sm text-ink shadow-panel">
          Carregando carteirinha...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cloud bg-halo px-6">
        <div className="rounded-lg border border-ember/20 bg-white px-6 py-5 text-sm text-ember shadow-panel">
          Nao foi possivel carregar a carteirinha.
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cloud bg-halo px-5 py-8">
      <div className="w-full max-w-[680px] space-y-4">
        <Button type="button" variant="secondary" onClick={() => router.push("/portal")}>
          Voltar ao portal
        </Button>
        <MemberIdentityCard profile={profile} />
      </div>
    </main>
  );
}
