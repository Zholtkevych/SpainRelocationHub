import crypto from "node:crypto";
import { db } from "@/lib/db";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string): string {
  // Reset tokens are single-use, short-lived bearer credentials — hashed
  // at rest for the same reason passwords are: a DB read shouldn't hand
  // out something directly usable to reset an account.
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createResetToken(adminUserId: number): string {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

  db.prepare(
    "INSERT INTO admin_password_resets (admin_user_id, token_hash, expires_at) VALUES (?, ?, ?)",
  ).run(adminUserId, hashToken(token), expiresAt);

  return token;
}

export function consumeResetToken(token: string): { adminUserId: number; resetId: number } | null {
  const row = db
    .prepare("SELECT id, admin_user_id, expires_at, used_at FROM admin_password_resets WHERE token_hash = ?")
    .get(hashToken(token)) as
    | { id: number; admin_user_id: number; expires_at: string; used_at: string | null }
    | undefined;

  if (!row || row.used_at) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;

  return { adminUserId: row.admin_user_id, resetId: row.id };
}

export function markResetTokenUsed(resetId: number): void {
  db.prepare("UPDATE admin_password_resets SET used_at = datetime('now') WHERE id = ?").run(resetId);
}
