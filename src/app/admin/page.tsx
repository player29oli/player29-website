import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminEditor } from "@/components/admin/admin-editor";
import { isAdminConfigured } from "@/lib/auth/config";
import { issueCsrfToken, getSession } from "@/lib/auth/session";
import { getActiveStoreKind, readSiteContent } from "@/lib/content/store";

export const metadata: Metadata = {
  title: { absolute: "Edit site" },
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdminConfigured()) redirect("/login");
  const session = await getSession();
  if (!session) redirect("/login");

  const csrfToken = await issueCsrfToken();
  const { content, source } = await readSiteContent();
  const persistTo = getActiveStoreKind() === "blob" ? "blob" : "file";

  return (
    <AdminEditor
      initialContent={content}
      csrfToken={csrfToken}
      editorEmail={session.email}
      persistTo={persistTo}
      loadedFrom={source}
    />
  );
}
