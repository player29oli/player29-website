import "server-only";

import { cookies, headers } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import {
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
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", sessionCookieOptions(0));
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

export async function issueCsrfToken(): Promise<string> {
  const secret = getAuthSecret();
  if (!secret) return "";
  return new SignJWT({ purpose: "csrf" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
}

export async function verifyCsrfToken(candidate: string | null | undefined): Promise<boolean> {
  const secret = getAuthSecret();
  if (!secret || !candidate) return false;
  try {
    const { payload } = await jwtVerify(candidate, secret, { algorithms: ["HS256"] });
    return payload.purpose === "csrf";
  } catch {
    return false;
  }
}

export async function assertSameOrigin(): Promise<boolean> {
  const headerList = await headers();
  const origin = headerList.get("origin");
  if (!origin) {
    const referer = headerList.get("referer");
    if (!referer) return true;
    return hostMatches(referer, headerList);
  }
  return hostMatches(origin, headerList);
}

function hostMatches(urlValue: string, headerList: Headers): boolean {
  try {
    const urlHost = new URL(urlValue).host;
    const forwarded = headerList.get("x-forwarded-host");
    const host = (forwarded ?? headerList.get("host") ?? "").split(",")[0]?.trim();
    return Boolean(host) && urlHost === host;
  } catch {
    return false;
  }
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
