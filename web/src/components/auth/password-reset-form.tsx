"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { resetPassword } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Informe o token recebido."),
  password: z
    .string()
    .min(6, "A senha precisa ter pelo menos 6 caracteres.")
    .regex(/[A-Za-z]/, "A senha precisa conter ao menos 1 letra.")
    .regex(/\d/, "A senha precisa conter ao menos 1 numero."),
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function PasswordResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      password: "",
    },
  });

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      form.setValue("token", token);
    }
  }, [form, searchParams]);

  const onSubmit = form.handleSubmit(async ({ password, token }) => {
    setServerError(null);
    setServerMessage(null);

    startTransition(async () => {
      try {
        const response = await resetPassword(token, password);
        setServerMessage(response.message);
        window.setTimeout(() => {
          router.push("/");
        }, 1200);
      } catch (error) {
        setServerError(
          error instanceof Error
            ? error.message
            : "Nao foi possivel redefinir a senha."
        );
      }
    });
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <Input
        label="Token de recuperacao"
        placeholder="Cole o token ou abra o link recebido"
        error={form.formState.errors.token?.message}
        {...form.register("token")}
      />

      <Input
        label="Nova senha"
        type="password"
        placeholder="Use letras e numeros"
        autoComplete="new-password"
        error={form.formState.errors.password?.message}
        {...form.register("password")}
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-sm font-semibold text-moss hover:text-ink">
          Voltar para o login
        </Link>

        <Button type="submit" disabled={isPending} className="min-w-40">
          {isPending ? "Salvando..." : "Redefinir senha"}
        </Button>
      </div>
    </form>
  );
}
