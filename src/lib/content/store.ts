import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { unstable_noStore as noStore } from "next/cache";

import defaultJson from "../../../content/default.json";
import {
  parseSiteContent,
  type ContentStoreKind,
  type SiteContent,
} from "@/lib/content/schema";

const LOCAL_DIR = path.join(process.cwd(), ".data");
const LOCAL_FILE = path.join(LOCAL_DIR, "content.json");
const BLOB_PATHNAME = "player29/content.json";

export type ContentReadResult = {
  content: SiteContent;
  source: ContentStoreKind;
};

function defaultContent(): SiteContent {
  const parsed = parseSiteContent(defaultJson);
  if (!parsed) {
    throw new Error("Committed content/default.json is not valid site content.");
  }
  return parsed;
}

function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readBlob(): Promise<unknown | null> {
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({
    prefix: BLOB_PATHNAME,
    limit: 20,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  if (blobs.length === 0) return null;
  const exact = blobs.find((blob) => blob.pathname === BLOB_PATHNAME);
  const chosen =
    exact ??
    [...blobs].sort(
      (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime(),
    )[0];
  if (!chosen) return null;
  const response = await fetch(chosen.url, { cache: "no-store" });
  if (!response.ok) return null;
  return response.json();
}

async function writeBlob(content: SiteContent): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(BLOB_PATHNAME, JSON.stringify(content, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

async function readLocalFile(): Promise<unknown | null> {
  try {
    const raw = await readFile(LOCAL_FILE, "utf8");
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

async function writeLocalFile(content: SiteContent): Promise<void> {
  await mkdir(LOCAL_DIR, { recursive: true });
  await writeFile(LOCAL_FILE, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}

export function getDefaultContent(): SiteContent {
  return defaultContent();
}

export async function getSiteContent(): Promise<SiteContent> {
  const { content } = await readSiteContent();
  return content;
}

export async function readSiteContent(): Promise<ContentReadResult> {
  noStore();

  if (blobConfigured()) {
    try {
      const stored = await readBlob();
      const parsed = parseSiteContent(stored);
      if (parsed) return { content: parsed, source: "blob" };
    } catch (error) {
      console.error("Failed to read content from Vercel Blob; using fallback.", error);
    }
  }

  const local = await readLocalFile();
  const parsedLocal = parseSiteContent(local);
  if (parsedLocal) return { content: parsedLocal, source: "file" };

  return { content: defaultContent(), source: "default" };
}

export async function saveSiteContent(input: unknown): Promise<SiteContent> {
  const parsed = parseSiteContent(input);
  if (!parsed) {
    throw new Error("The content document is not valid.");
  }
  const next: SiteContent = {
    ...parsed,
    version: 1,
    updatedAt: new Date().toISOString(),
  };

  if (blobConfigured()) {
    await writeBlob(next);
    return next;
  }

  await writeLocalFile(next);
  return next;
}

export function getActiveStoreKind(): ContentStoreKind {
  if (blobConfigured()) return "blob";
  return "file";
}
