"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  updateOwnLogin,
  updateOwnMemberProfile,
  updateOwnPassword,
} from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";
import type { MeResponse } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import {
  AccountIcon,
  CardIcon,
  EditIcon,
  WorkflowIcon,
} from "./portal-icons";

const loginSchema = z.object({
  login: z.string().min(3, "Informe um login valido."),
});

const personalSchema = z.object({
  name: z.string().min(3, "Informe seu nome completo."),
  email: z.string().email("Informe um email valido."),
  birth_date: z.string().min(1, "Informe a data de nascimento."),
  rg: z.coerce.number().int("Informe um RG valido."),
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(6, "A senha precisa ter pelo menos 6 caracteres.")
    .regex(/[A-Za-z]/, "A senha precisa conter ao menos 1 letra.")
    .regex(/\d/, "A senha precisa conter ao menos 1 numero."),
});

type PersonalValues = z.infer<typeof personalSchema>;
type LoginValues = z.infer<typeof loginSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;
type AccountWorkspaceTab = "personal" | "login" | "password";

function FormFeedback({
  error,
  success,
}: {
  error: string | null;
  success: string | null;
}) {
  if (error) {
    return (
      <div className="rounded-lg border border-ember/20 bg-ember/5 px-4 py-3 text-sm text-ember">
        {error}
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-lg border border-moss/20 bg-moss/5 px-4 py-3 text-sm text-moss">
        {success}
      </div>
    );
  }

  return null;
}

export function AccountSettingsCard({ profile }: { profile: MeResponse }) {
  const { refreshProfile, session, updateStoredSession } = useAuth();
  const [workflowTab, setWorkflowTab] = useState<AccountWorkspaceTab>("personal");
  const [isUpdatingPersonal, startPersonalTransition] = useTransition();
  const [isUpdatingLogin, startLoginTransition] = useTransition();
  const [isUpdatingPassword, startPasswordTransition] = useTransition();
  const [personalError, setPersonalError] = useState<string | null>(null);
  const [personalSuccess, setPersonalSuccess] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const personalForm = useForm<PersonalValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      name: profile.member.name,
      email: profile.member.email,
      birth_date: profile.member.birth_date
        ? profile.member.birth_date.slice(0, 10)
        : "",
      rg: profile.member.rg ?? 0,
    },
  });

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: profile.user.login,
    },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmitPersonal = personalForm.handleSubmit(
    async ({ birth_date, email, name, rg }) => {
      if (!session) return;

      setPersonalError(null);
      setPersonalSuccess(null);

      startPersonalTransition(async () => {
        try {
          const response = await updateOwnMemberProfile(
            profile.member.id,
            session.token,
            {
              birth_date,
              email,
              name,
              rg,
            }
          );

          updateStoredSession((currentSession) => ({
            ...currentSession,
            member: {
              ...currentSession.member,
              birth_date: response.member.birth_date,
              email: response.member.email,
              name: response.member.name,
              rg: response.member.rg,
            },
          }));

          await refreshProfile();
          setPersonalSuccess("Dados pessoais atualizados com sucesso.");
        } catch (error) {
          setPersonalError(
            error instanceof Error
              ? error.message
              : "Nao foi possivel atualizar seus dados pessoais."
          );
        }
      });
    }
  );

  const onSubmitLogin = loginForm.handleSubmit(async ({ login }) => {
    if (!session) return;

    setLoginError(null);
    setLoginSuccess(null);

    startLoginTransition(async () => {
      try {
        const response = await updateOwnLogin(profile.user.id, session.token, login);

        updateStoredSession((currentSession) => ({
          ...currentSession,
          user: {
            ...currentSession.user,
            login: response.user.login,
          },
        }));

        await refreshProfile();
        setLoginSuccess("Login atualizado com sucesso.");
      } catch (error) {
        setLoginError(
          error instanceof Error ? error.message : "Nao foi possivel atualizar o login."
        );
      }
    });
  });

  const onSubmitPassword = passwordForm.handleSubmit(async ({ password }) => {
    if (!session) return;

    setPasswordError(null);
    setPasswordSuccess(null);

    startPasswordTransition(async () => {
      try {
        await updateOwnPassword(profile.user.id, session.token, password);

        updateStoredSession((currentSession) => ({
          ...currentSession,
          mustChangePassword: false,
        }));

        passwordForm.reset({ password: "" });
        await refreshProfile();
        setPasswordSuccess("Senha atualizada com sucesso.");
      } catch (error) {
        setPasswordError(
          error instanceof Error ? error.message : "Nao foi possivel atualizar a senha."
        );
      }
    });
  });

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <article className="rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brass">
            Minha conta
          </p>
          <h3 className="font-display text-2xl text-ink sm:text-3xl">
            Minha conta
          </h3>
        </div>

        <div className="mt-8 space-y-6">
          <SegmentedTabs
            value={workflowTab}
            onChange={setWorkflowTab}
            options={[
              { value: "personal", label: "Dados pessoais", icon: EditIcon },
              { value: "login", label: "Login", icon: AccountIcon },
              { value: "password", label: "Senha", icon: CardIcon },
            ]}
          />

          {workflowTab === "personal" ? (
            <form
              className="space-y-4 rounded-lg border border-line bg-stone p-5"
              onSubmit={onSubmitPersonal}
            >
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-moss">
                  Dados pessoais
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Nome completo"
                  className="sm:col-span-2"
                  error={personalForm.formState.errors.name?.message}
                  {...personalForm.register("name")}
                />
                <Input
                  label="Email"
                  type="email"
                  className="sm:col-span-2"
                  error={personalForm.formState.errors.email?.message}
                  {...personalForm.register("email")}
                />
                <Input
                  label="Nascimento"
                  type="date"
                  error={personalForm.formState.errors.birth_date?.message}
                  {...personalForm.register("birth_date")}
                />
                <Input
                  label="RG"
                  type="number"
                  error={personalForm.formState.errors.rg?.message}
                  {...personalForm.register("rg")}
                />
              </div>

              <FormFeedback error={personalError} success={personalSuccess} />

              <Button type="submit" disabled={isUpdatingPersonal}>
                {isUpdatingPersonal ? "Salvando..." : "Salvar dados pessoais"}
              </Button>
            </form>
          ) : null}

          {workflowTab === "login" ? (
            <form
              className="space-y-4 rounded-lg border border-line bg-stone p-5"
              onSubmit={onSubmitLogin}
            >
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-moss">
                  Login
                </p>
              </div>

              <Input
                label="Novo login"
                placeholder="Seu novo login"
                error={loginForm.formState.errors.login?.message}
                {...loginForm.register("login")}
              />

              <FormFeedback error={loginError} success={loginSuccess} />

              <Button type="submit" disabled={isUpdatingLogin}>
                {isUpdatingLogin ? "Salvando..." : "Atualizar login"}
              </Button>
            </form>
          ) : null}

          {workflowTab === "password" ? (
            <form
              className="space-y-4 rounded-lg border border-line bg-stone p-5"
              onSubmit={onSubmitPassword}
            >
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-moss">
                  Senha
                </p>
              </div>

              <Input
                label="Nova senha"
                type="password"
                placeholder="Crie uma senha definitiva"
                autoComplete="new-password"
                error={passwordForm.formState.errors.password?.message}
                {...passwordForm.register("password")}
              />

              <FormFeedback error={passwordError} success={passwordSuccess} />

              <Button type="submit" disabled={isUpdatingPassword}>
                {isUpdatingPassword ? "Salvando..." : "Atualizar senha"}
              </Button>
            </form>
          ) : null}
        </div>
      </article>

      <aside className="space-y-6">
        <div className="rounded-lg border border-white/70 bg-white/88 p-6 shadow-panel backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brass">
            Identidade atual
          </p>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-ink/48">Nome</dt>
              <dd className="mt-1 font-semibold text-ink">{profile.member.name}</dd>
            </div>
            <div>
              <dt className="text-ink/48">Login</dt>
              <dd className="mt-1 font-semibold text-ink">{profile.user.login}</dd>
            </div>
            <div>
              <dt className="text-ink/48">Email</dt>
              <dd className="mt-1 font-semibold text-ink">{profile.member.email}</dd>
            </div>
            <div>
              <dt className="text-ink/48">Fluxo ativo</dt>
              <dd className="mt-1 inline-flex items-center gap-2 font-semibold text-ink">
                <WorkflowIcon className="h-4 w-4 text-brass" />
                {workflowTab === "personal"
                  ? "Dados pessoais"
                  : workflowTab === "login"
                  ? "Login"
                  : "Senha"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-line bg-stone p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moss">
            Observacao
          </p>
          <p className="mt-3 text-sm leading-7 text-ink/70">
            Mesmo quando houver perfis administrativos, a troca de credenciais
            continua sendo tratada como uma acao pessoal do proprio usuario.
          </p>
        </div>
      </aside>
    </section>
  );
}
