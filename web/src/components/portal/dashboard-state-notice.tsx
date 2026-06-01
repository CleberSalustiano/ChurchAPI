"use client";

export function DashboardStateNotice({
  loading,
  error,
  empty,
  loadingLabel = "Atualizando dados...",
  emptyLabel = "Nenhum dado disponivel neste escopo ainda.",
}: {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  loadingLabel?: string;
  emptyLabel?: string;
}) {
  if (error) {
    return (
      <div className="rounded-lg border border-ember/18 bg-ember/5 px-5 py-4 text-sm text-ember">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-line bg-white/72 px-5 py-4 text-sm text-ink/68">
        {loadingLabel}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-stone px-5 py-4 text-sm text-ink/60">
        {emptyLabel}
      </div>
    );
  }

  return null;
}
