"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type LoginState } from "@/lib/auth/actions";

type LoginFormProps = {
  configured: boolean;
  csrfToken: string;
};

export function LoginForm({ configured, csrfToken }: LoginFormProps) {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginAction,
    null,
  );

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 flex justify-center">
        <Logo variant="light" href="/" priority />
      </div>
      <div className="rounded-[22px] border border-ink/8 bg-white p-6 shadow-[0_24px_80px_rgba(17,19,24,0.08)] md:p-8">
        <h1 className="font-display text-2xl font-bold">Sign in</h1>
        {configured ? (
          <>
            <p className="text-muted-text mt-2 text-[0.975rem] leading-relaxed">
              Use the founder credentials from the environment to edit the
              public site.
            </p>
            <form action={action} className="mt-6 grid gap-5" noValidate>
              <input type="hidden" name="csrf" value={csrfToken} />
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  className="h-11 min-h-11 rounded-[13px] bg-white px-3 text-[1rem]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-11 min-h-11 rounded-[13px] bg-white px-3 text-[1rem]"
                />
              </div>
              {state?.error ? (
                <p role="alert" className="text-sm font-medium text-red-700">
                  {state.error}
                </p>
              ) : null}
              <Button type="submit" size="cta" disabled={pending}>
                {pending ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </>
        ) : (
          <p className="text-muted-text mt-3 text-[0.975rem] leading-relaxed">
            Content admin is not enabled on this environment. Set{" "}
            <code className="font-mono text-sm text-ink">ADMIN_EMAIL</code>,{" "}
            <code className="font-mono text-sm text-ink">ADMIN_PASSWORD</code>{" "}
            and <code className="font-mono text-sm text-ink">AUTH_SECRET</code>{" "}
            in <code className="font-mono text-sm text-ink">.env.local</code>,
            then restart the server.
          </p>
        )}
      </div>
      <p className="mt-6 text-center text-sm">
        <Link
          href="/"
          className="font-semibold text-ink/70 underline-offset-4 hover:text-ink hover:underline"
        >
          Back to the homepage
        </Link>
      </p>
    </div>
  );
}
