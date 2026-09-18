"use server";

import { headers } from "next/headers";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { getAdminEmail, getAdminPassword, isAdminConfigured } from "@/lib/auth/config";
import { emailsEqual, secretsEqual } from "@/lib/auth/crypto";
import {
  consumeLoginAttempt,
  loginAttemptKey,
  resetLoginAttempts,
} from "@/lib/auth/rate-limit";
import {
  assertSameOrigin,
  clearSession,
  createSession,
  getSession,
  verifyCsrfToken,
} from "@/lib/auth/session";
import { parseSiteContent, type SiteContent } from "@/lib/content/schema";
import {
  CONTENT_CACHE_TAG,
  ContentPersistError,
  saveSiteContent,
} from "@/lib/content/store";

export type LoginState = { error: string } | null;

export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return {
      error:
        "Content admin is not enabled on this environment. Set ADMIN_EMAIL, ADMIN_PASSWORD and AUTH_SECRET, then restart the server.",
    };
  }

  if (!(await assertSameOrigin())) {
    return { error: "This form could not be verified. Refresh the page and try again." };
  }

  const csrf = String(formData.get("csrf") ?? "");
  if (!(await verifyCsrfToken(csrf))) {
    return {
      error: "This form could not be verified. Refresh the page and try again.",
    };
  }

  const headerList = await headers();
  const key = loginAttemptKey(headerList);
  const attempt = consumeLoginAttempt(key);
  if (!attempt.ok) {
    return {
      error: "Too many sign-in attempts. Please wait a few minutes and try again.",
    };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const expectedEmail = getAdminEmail()!;
  const expectedPassword = getAdminPassword()!;
  const matched =
    emailsEqual(email, expectedEmail) && secretsEqual(password, expectedPassword);

  if (!matched) {
    return { error: "Those details did not match." };
  }

  resetLoginAttempts(key);
  await createSession(expectedEmail);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}

export async function saveContentAction(
  csrfToken: string,
  input: SiteContent,
): Promise<{ ok: true; content: SiteContent } | { ok: false; error: string }> {
  if (!isAdminConfigured()) {
    return { ok: false, error: "Content admin is not enabled on this environment." };
  }
  const session = await getSession();
  if (!session) {
    return { ok: false, error: "Your session has expired. Sign in again." };
  }
  if (!(await verifyCsrfToken(csrfToken))) {
    return {
      ok: false,
      error: "This form could not be verified. Refresh the page and try again.",
    };
  }
  if (!(await assertSameOrigin())) {
    return { ok: false, error: "This form could not be verified. Refresh the page and try again." };
  }
  const parsed = parseSiteContent(input);
  if (!parsed) {
    return { ok: false, error: "The content document is not valid." };
  }
  try {
    const saved = await saveSiteContent(parsed);
    try {
      updateTag(CONTENT_CACHE_TAG);
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath("/privacy");
      revalidatePath("/privacy", "page");
    } catch (error) {
      console.error("Saved content, but the public cache could not be revalidated.", error);
    }
    return { ok: true, content: saved };
  } catch (error) {
    console.error("Failed to save site content", error);
    if (error instanceof ContentPersistError || (error instanceof Error && error.name === "ContentPersistError")) {
      return { ok: false, error: error.message };
    }
    return {
      ok: false,
      error: "The content could not be saved. Check storage and try again.",
    };
  }
}
