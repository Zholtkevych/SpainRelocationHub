import type { ReactNode } from "react";
import type { Metadata } from "next";
import { onest, sourceSerif4 } from "@/lib/fonts";
import "../globals.css";

// A second, independent <html>-owning root layout. /admin/* sits outside
// the /[locale]/* tree entirely (no locale prefix, no next-intl), so it
// can't inherit app/[locale]/layout.tsx's <html>/<body>/globals.css — and
// there's deliberately no shared app/layout.tsx above both trees, because
// [locale]/layout.tsx already renders its own <html lang={locale}>; adding
// a shared root would nest <html> inside <html> for every public page.
export const metadata: Metadata = {
  title: "Spain Relocation Hub — Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${onest.variable} ${sourceSerif4.variable} h-full antialiased`}>
      <body className="min-h-full bg-surface text-ink">{children}</body>
    </html>
  );
}
