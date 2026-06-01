"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth-provider";

const loginSchema = z.object({
  login: z.string().min(1, "Informe o login."),
  password: z.string().min(1, "Informe a senha."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);

    try {
      await login(values.login, values.password);

      startTransition(() => {
        router.push("/portal");
      });
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Nao foi possivel entrar agora."
      );
    }
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <Input
        label="Login"
        placeholder="Sua matricula ou login"
        autoComplete="username"
        error={form.formState.errors.login?.message}
        {...form.register("login")}
      />

      <Input
        label="Senha"
        type="password"
        placeholder="Sua senha"
        autoComplete="current-password"
        error={form.formState.errors.password?.message}
        {...form.register("password")}
      />

      {serverError ? (
        <div className="rounded-lg border border-ember/20 bg-ember/5 px-4 py-3 text-sm text-ember">
          {serverError}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 text-sm text-ink/62">
        <p>Use seu login de membro para entrar.</p>
        <Link
          href="/recuperar-senha"
          className="font-semibold text-moss transition hover:text-ink"
        >
          Esqueci minha senha
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/60">Senha inicial pode exigir troca.</p>

        <Button disabled={isPending} type="submit" className="min-w-36">
          {isPending ? "Entrando..." : "Acessar"}
        </Button>
      </div>
    </form>
  );
}
