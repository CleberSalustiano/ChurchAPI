"use client";

import type { MeResponse } from "@/types/auth";
import { formatAccessLabel, formatChurchScopeLabel } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatCpf(cpf?: string) {
  if (!cpf) return "Nao informado";

  const digits = cpf.replace(/\D/g, "");

  if (digits.length !== 11) return cpf;

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function getChurchLabel(profile: MeResponse) {
  const church = profile.member.church;

  if (!church?.location) {
    return `Igreja #${profile.member.id_church}`;
  }

  return `${church.type === "HEADQUARTER" ? "Sede" : "Congregacao"} • ${
    church.location.city
  }`;
}

export function MemberIdentityCard({ profile }: { profile: MeResponse }) {
  return (
    <article className="mx-auto w-full max-w-[680px] rounded-lg border border-white/80 bg-white p-5 text-ink shadow-panel sm:rounded-lg sm:p-6">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brass">
              Membro
            </p>
            <p className="mt-1.5 font-display text-xl text-ink sm:mt-2 sm:text-2xl">
              Carteirinha de membro
            </p>
          </div>

          <span className="rounded-lg border border-line bg-cloud/70 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-moss sm:px-3 sm:text-[10px]">
            Ativa
          </span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-line bg-[#edf5ff] text-xl font-semibold text-moss sm:h-20 sm:w-20 sm:rounded-lg sm:text-2xl">
            {getInitials(profile.member.name)}
          </div>

          <div className="min-w-0">
            <p className="break-words font-display text-lg leading-tight text-ink sm:text-2xl">
              {profile.member.name}
            </p>
            <p className="mt-1.5 text-xs text-ink/66 sm:mt-2 sm:text-sm">
              {getChurchLabel(profile)}
            </p>
            <p className="mt-1 break-all text-xs text-ink/52 sm:break-normal sm:text-sm">
              Login {profile.user.login}
            </p>
          </div>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
          <div className="rounded-lg border border-line bg-[#f7fbff] px-3 py-2.5 sm:rounded-lg sm:px-4 sm:py-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-ink/45">CPF</p>
            <p className="mt-1.5 text-xs font-semibold text-ink sm:mt-2 sm:text-sm">
              {formatCpf(profile.member.cpf)}
            </p>
          </div>
          <div className="rounded-lg border border-line bg-[#f7fbff] px-3 py-2.5 sm:rounded-lg sm:px-4 sm:py-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-ink/45">Codigo</p>
            <p className="mt-1.5 text-xs font-semibold text-ink sm:mt-2 sm:text-sm">
              #{profile.member.id}
            </p>
          </div>
          <div className="rounded-lg border border-line bg-[#f7fbff] px-3 py-2.5 sm:rounded-lg sm:px-4 sm:py-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-ink/45">Acesso</p>
            <p className="mt-1.5 text-xs font-semibold text-ink sm:mt-2 sm:text-sm">
              {formatAccessLabel(profile.access?.level)}
            </p>
          </div>
          <div className="rounded-lg border border-line bg-[#f7fbff] px-3 py-2.5 sm:rounded-lg sm:px-4 sm:py-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-ink/45">Escopo</p>
            <p className="mt-1.5 break-words text-xs font-semibold text-ink sm:mt-2 sm:text-sm">
              {formatChurchScopeLabel(profile.access?.scope)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line pt-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-ink/45">
              Cargo eclesiastico
            </p>
            <p className="mt-1.5 text-xs font-semibold text-ink sm:mt-2 sm:text-sm">
              {profile.member.ecclesiasticalRole}
            </p>
          </div>

          <p className="text-left text-[10px] leading-4 text-ink/46 sm:text-right sm:text-[11px] sm:leading-5">
            Identificacao do membro
          </p>
        </div>
      </div>
    </article>
  );
}
