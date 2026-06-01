"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { requestPasswordReset } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const forgotPasswordSchema = z.object({
  email: z.string().email("Informe um email valido."),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function PasswordForgotForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [developmentToken, setDevelopmentToken] = useState<string | null>(null);
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = form.handleSubmit(async ({ email }) => {
    setServerError(null);
    setServerMessage(null);
    setDevelopmentToken(null);

    startTransition(async () => {
      try {
        const response = await requestPasswordReset(email);
        setServerMessage(response.message);
        setDevelopmentToken(response.resetToken ?? null);
      } catch (error) {
        setServerError(
          error instanceof Error
            ? error.message
            : "Nao foi possivel solicitar a recuperacao."
        );
      }
    });
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <Input
        label="Email cadastrado"
        placeholder="voce@igreja.com"
        autoComplete="email"
        error={form.formState.errors.email?.message}
        {...form.register("email")}
      />

      {serverError ? (
        <div className="rounded-lg border border-ember/20 bg-ember/5 px-4 py-3 text-sm text-ember">
          {serverError}
        </div>
      ) : null}

      {serverMessage ? (
        <div className="rounded-lg border border-moss/20 bg-moss/5 px-4 py-3 text-sm text-moss">
          {serverMessage}
        </div>
      ) : null}

      {developmentToken ? (
        <div className="rounded-lg border border-brass/20 bg-brass/8 px-4 py-3 text-sm text-ink">
          Token de desenvolvimento: <span className="font-semibold">{developmentToken}</span>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-sm font-semibold text-moss hover:text-ink">
          Voltar para o login
        </Link>

        <Button type="submit" disabled={isPending} className="min-w-40">
          {isPending ? "Enviando..." : "Solicitar link"}
        </Button>
      </div>
    </form>
  );
}
