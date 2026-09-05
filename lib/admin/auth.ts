import crypto from "node:crypto";
import { verifyPasswordHash } from "@/lib/admin/password";
import { getAdminUserByEmail, seedAdminUserIfEmpty } from "@/lib/admin/users";

// Scoped-down auth versus the SAD's full Identity module: any number of
// admin_users rows can coexist (see lib/admin/users.ts), but there are no
// roles/permissions — every account has identical access, and there's no
// TOTP. Session is a signed, expiring token in an httpOnly cookie; verified
// in proxy.ts before any /admin page renders.

export const SESSION_COOKIE = "srh_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) {
    throw new Error("ADMIN_SESSION_SECRET is not set — required to sign admin sessions.");
  }
  return value;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && Date.now() < expiresAt;
}

export function verifyCredentials(email: string, password: string): boolean {
  // Credentials live in the admin_users table, not env vars — that's what
  // makes self-service password reset possible (see lib/admin/users.ts).
  // Seeding is idempotent and cheap (a COUNT query when the table already
  // has a row), so it's safe to call on every login attempt rather than
  // requiring a separate startup step.
  seedAdminUserIfEmpty();

  const user = getAdminUserByEmail(email);
  if (!user) return false;
  return verifyPasswordHash(password, user.password_hash);
}
