import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export default function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="isolate flex min-h-full flex-1 flex-col bg-surface">{children}</div>
  );
}
