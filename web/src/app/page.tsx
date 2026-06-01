import { LoginForm } from "@/components/auth/login-form";
import { Panel } from "@/components/ui/panel";

export default function Home() {
  return (
    <main className="min-h-screen bg-cloud bg-halo px-4 py-5 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl gap-6 lg:grid-cols-[minmax(0,1.15fr)_520px]">
        <section className="rounded-lg border border-white/60 bg-[#0f2741] p-8 text-cloud shadow-panel sm:p-10 lg:p-12">
          <div className="flex h-full flex-col justify-between gap-10">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brass">
                Portal
              </p>
              <div className="space-y-4">
                <h1 className="max-w-3xl font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
                  Acesse sua igreja.
                </h1>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/6 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-brass">
                  Membro
                </p>
                <p className="mt-3 text-sm leading-7 text-cloud/74">
                  Carteirinha e conta.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/6 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-brass">
                  Dirigencia
                </p>
                <p className="mt-3 text-sm leading-7 text-cloud/74">
                  Gestao por escopo.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/6 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-brass">
                  Tesouraria
                </p>
                <p className="mt-3 text-sm leading-7 text-cloud/74">
                  Lancamentos financeiros.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Panel className="flex flex-col justify-between rounded-lg p-8 sm:p-10">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brass">
                Entrar
              </p>
              <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
                Acesse sua conta.
              </h2>
            </div>

            <LoginForm />
          </div>

          <div className="mt-8 rounded-lg border border-line bg-stone p-5 text-sm text-ink/70">
            Use seu login e senha para entrar.
          </div>
        </Panel>
      </div>
    </main>
  );
}
