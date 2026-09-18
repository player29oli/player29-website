import "server-only";

export const SESSION_COOKIE = "p29_session";
export const SESSION_MAX_AGE = 60 * 60 * 12;

export function isAdminConfigured(): boolean {
  const email = process.env.ADMIN_EMAIL?.trim() ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.AUTH_SECRET ?? "";
  return email.includes("@") && password.length >= 8 && secret.length >= 16;
}

export function getAdminEmail(): string | null {
  if (!isAdminConfigured()) return null;
  return process.env.ADMIN_EMAIL!.trim().toLowerCase();
}

export function getAdminPassword(): string | null {
  if (!isAdminConfigured()) return null;
  return process.env.ADMIN_PASSWORD!;
}

export function getAuthSecret(): Uint8Array | null {
  if (!isAdminConfigured()) return null;
  return new TextEncoder().encode(process.env.AUTH_SECRET);
}

export function sessionCookieOptions(maxAge = SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
