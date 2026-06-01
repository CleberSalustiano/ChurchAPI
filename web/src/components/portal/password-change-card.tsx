"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateOwnPassword } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth-provider";
import type { MeResponse } from "@/types/auth";

const passwordSchema = z.object({
  password: z
    .string()
    .min(6, "A senha precisa ter pelo menos 6 caracteres.")
    .regex(/[A-Za-z]/, "A senha precisa conter ao menos 1 letra.")
    .regex(/\d/, "A senha precisa conter ao menos 1 numero."),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function PasswordChangeCard({ profile }: { profile: MeResponse }) {
  const { refreshProfile, session, updateStoredSession } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async ({ password }) => {
    if (!session) {
      return;
    }

    setServerError(null);
    setServerMessage(null);

    try {
      await updateOwnPassword(profile.user.id, session.token, password);

      updateStoredSession((currentSession) => ({
        ...currentSession,
        mustChangePassword: false,
      }));

      setServerMessage("Senha atualizada. Atualize a pagina para continuar.");

      startTransition(() => {
        void refreshProfile();
      });
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Nao foi possivel atualizar a senha."
      );
    }
  });

  return (
    <div className="space-y-5 rounded-lg border border-ember/15 bg-ember/5 p-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-ember">
          Troca obrigatoria
        </p>
        <h2 className="font-display text-2xl text-ink">
          Defina uma senha definitiva para continuar.
        </h2>
        <p className="text-sm leading-6 text-ink/70">Use ao menos 6 caracteres com letras e numeros.</p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Nova senha"
          type="password"
          placeholder="Use ao menos 6 caracteres com letras e numeros"
          autoComplete="new-password"
          error={form.formState.errors.password?.message}
          {...form.register("password")}
        />

        {serverError ? (
          <div className="rounded-lg border border-ember/20 bg-white px-4 py-3 text-sm text-ember">
            {serverError}
          </div>
        ) : null}

        {serverMessage ? (
          <div className="rounded-lg border border-moss/20 bg-white px-4 py-3 text-sm text-moss">
            {serverMessage}
          </div>
        ) : null}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar nova senha"}
        </Button>
      </form>
    </div>
  );
}
