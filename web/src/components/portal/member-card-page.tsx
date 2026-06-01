"use client";

import type { MeResponse } from "@/types/auth";
import { MemberIdentityCard } from "./member-identity-card";

export function MemberCardPage({ profile }: { profile: MeResponse }) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brass">
        Carteirinha do membro
      </p>
      <div className="mt-6 overflow-x-auto">
        <MemberIdentityCard profile={profile} />
      </div>
    </section>
  );
}
