import type { ReactNode } from "react";
import Link from "next/link";
import { logoutAction } from "../actions";

// English-only admin UI for now — a known simplification versus the SAD's
// "usable by a non-technical operator working in Russian or Ukrainian"
// requirement, scoped out to ship an admin panel today at all.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-alt">
      <header className="border-b border-border bg-navy">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/admin/leads" className="font-heading text-lg text-surface">
            SRH Admin
          </Link>
          <nav className="flex items-center gap-5 text-sm text-surface/90">
            <Link href="/admin/leads" className="hover:text-gold">
              Leads
            </Link>
            <Link href="/admin/content" className="hover:text-gold">
              Content
            </Link>
            <Link href="/admin/media" className="hover:text-gold">
              Media
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="hover:text-gold">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
