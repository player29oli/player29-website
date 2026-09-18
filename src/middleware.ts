import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "p29_session";

function isConfigured(): boolean {
  const email = process.env.ADMIN_EMAIL?.trim() ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.AUTH_SECRET ?? "";
  return email.includes("@") && password.length >= 8 && secret.length >= 16;
}

async function hasSession(request: NextRequest): Promise<boolean> {
  if (!isConfigured()) return false;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return false;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      { algorithms: ["HS256"] },
    );
    const email =
      (typeof payload.email === "string" && payload.email) ||
      (typeof payload.sub === "string" && payload.sub) ||
      "";
    return email.trim().toLowerCase() === process.env.ADMIN_EMAIL!.trim().toLowerCase();
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const onAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const onLogin = pathname === "/login";

  if (!onAdmin && !onLogin) {
    return NextResponse.next();
  }

  const authed = await hasSession(request);

  if (onAdmin && !authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (onLogin && authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/admin", "/admin/:path*"],
};
