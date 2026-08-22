import crypto from "node:crypto";

// Single-admin auth (SAD's Identity module scoped down for today: one
// operator, no roles, no TOTP — a real gap versus the SAD, acceptable for a
// first working admin panel). Session is a signed, expiring token in an
// httpOnly cookie; verified in proxy.ts before any /admin page renders.

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

export function checkPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const expectedBuf = Buffer.from(expected);
  const candidateBuf = Buffer.from(candidate);

  if (candidateBuf.length !== expectedBuf.length) {
    // Burn comparable time so a mismatched length doesn't return early.
    crypto.timingSafeEqual(expectedBuf, expectedBuf);
    return false;
  }

  return crypto.timingSafeEqual(candidateBuf, expectedBuf);
}
