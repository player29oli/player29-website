import { NextResponse } from "next/server";

import { isAdminConfigured } from "@/lib/auth/config";
import {
  getSession,
  isAllowedOrigin,
  verifyCsrfToken,
} from "@/lib/auth/session";
import { putUploadedFile } from "@/lib/content/uploads";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin is not enabled." }, { status: 403 });
  }
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const csrf = request.headers.get("x-csrf-token");
  if (!(await verifyCsrfToken(csrf))) {
    return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Use a JPEG, PNG, WebP or GIF image." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Images must be 5 MB or smaller." },
      { status: 400 },
    );
  }

  try {
    const url = await putUploadedFile(file);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload failed", error);
    return NextResponse.json({ error: "The image could not be stored." }, { status: 500 });
  }
}
