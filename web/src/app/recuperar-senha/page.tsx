import { PasswordForgotForm } from "@/components/auth/password-forgot-form";
import { Panel } from "@/components/ui/panel";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-cloud bg-halo px-4 py-5 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_520px]">
        <section className="rounded-lg border border-white/60 bg-[#0f2741] p-8 text-cloud shadow-panel sm:p-10 lg:p-12">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brass">
              Recuperacao de acesso
            </p>
            <h1 className="font-display text-4xl leading-tight sm:text-5xl">
              Recuperar senha
            </h1>
          </div>
        </section>

        <Panel className="rounded-lg p-8 sm:p-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brass">
              Solicitar link
            </p>
            <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
              Informe o email cadastrado.
            </h2>
          </div>

          <div className="mt-8">
            <PasswordForgotForm />
          </div>
        </Panel>
      </div>
    </main>
  );
}
