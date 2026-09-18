import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { isAdminConfigured } from "@/lib/auth/config";
import { ensureCsrfToken, getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: { absolute: "Sign in" },
  description: "Sign in to edit Player29 site content.",
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  const configured = isAdminConfigured();
  const csrfToken = configured ? await ensureCsrfToken() : "";

  return (
    <main
      id="main"
      className="flex flex-1 flex-col items-center justify-center px-5 py-16"
    >
      <LoginForm configured={configured} csrfToken={csrfToken} />
    </main>
  );
}
