import { db } from "@/lib/db";

export type AdminUser = { id: number; email: string; password_hash: string };

/**
 * ADMIN_EMAIL / ADMIN_PASSWORD_HASH are bootstrap-only: they seed the one
 * row in admin_users the first time the table is empty, then the database
 * becomes authoritative. This is what makes self-service password reset
 * possible — a credential that only ever lived in an env var can't be
 * changed by the app itself without a redeploy. After seeding, changing
 * those env vars again has no effect until the table is emptied.
 */
export function seedAdminUserIfEmpty(): void {
  const { n } = db.prepare("SELECT COUNT(*) as n FROM admin_users").get() as { n: number };
  if (n > 0) return;

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!email || !hash) return;

  db.prepare("INSERT INTO admin_users (email, password_hash) VALUES (?, ?)").run(email, hash);
}

export function getAdminUserByEmail(email: string): AdminUser | undefined {
  return db.prepare("SELECT * FROM admin_users WHERE email = ?").get(email.trim().toLowerCase()) as
    | AdminUser
    | undefined;
}

export function getAdminUserById(id: number): AdminUser | undefined {
  return db.prepare("SELECT * FROM admin_users WHERE id = ?").get(id) as AdminUser | undefined;
}

export function updateAdminPassword(userId: number, newHash: string): void {
  db.prepare("UPDATE admin_users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?").run(
    newHash,
    userId,
  );
}
