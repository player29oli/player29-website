import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import {
  CSRF_COOKIE,
  getAuthSecret,
  getAdminEmail,
  isAdminConfigured,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  sessionCookieOptions,
} from "@/lib/auth/config";
import { secretsEqual } from "@/lib/auth/crypto";

export type AdminSession = {
  email: string;
};

export async function createSession(email: string): Promise<void> {
  const secret = getAuthSecret();
  if (!secret) return;
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret);

  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions());
  await ensureCsrfToken();
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  store.set(CSRF_COOKIE, "", sessionCookieOptions(0));
}

export async function getSession(): Promise<AdminSession | null> {
  if (!isAdminConfigured()) return null;
  const secret = getAuthSecret();
  const expectedEmail = getAdminEmail();
  if (!secret || !expectedEmail) return null;

  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    const email = typeof payload.email === "string" ? payload.email : payload.sub;
    if (!email || !secretsEqual(email, expectedEmail)) return null;
    return { email };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorised");
  }
  return session;
}

export async function ensureCsrfToken(): Promise<string> {
  const store = await cookies();
  const existing = store.get(CSRF_COOKIE)?.value;
  if (existing && existing.length >= 24) return existing;
  const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
  store.set(CSRF_COOKIE, token, sessionCookieOptions());
  return token;
}

export async function verifyCsrfToken(candidate: string | null | undefined): Promise<boolean> {
  const store = await cookies();
  const expected = store.get(CSRF_COOKIE)?.value;
  if (!expected || !candidate) return false;
  return secretsEqual(candidate, expected);
}

export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    const referer = request.headers.get("referer");
    if (!referer) return true;
    try {
      return new URL(referer).origin === new URL(request.url).origin;
    } catch {
      return false;
    }
  }
  try {
    return origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
