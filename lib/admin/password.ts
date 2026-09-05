import crypto from "node:crypto";

// scrypt: memory-hard, built into Node — matches the SAD's identity-module
// requirement ("hashed passwords using a memory-hard algorithm") without an
// extra dependency like bcrypt. Format: scrypt:<N>:<saltHex>:<hashHex>.
//
// Delimiter is ":", deliberately not "$": Next.js's .env loader (like
// dotenv-expand) treats "$name" in a value as a reference to another env
// var and silently substitutes it — a scrypt$16384$... value was getting
// mangled into garbage before the app ever saw it. Confirmed by testing:
// the verification logic was correct in isolation, but failed for every
// login once the value passed through .env.local loading.
const SCRYPT_N = 16384; // Node's own default cost parameter.
const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH, { N: SCRYPT_N });
  return `scrypt:${SCRYPT_N}:${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPasswordHash(candidate: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 4 || parts[0] !== "scrypt") return false;

  const n = Number(parts[1]);
  const salt = Buffer.from(parts[2], "hex");
  const expected = Buffer.from(parts[3], "hex");
  if (!Number.isFinite(n) || salt.length === 0 || expected.length === 0) return false;

  const candidateHash = crypto.scryptSync(candidate, salt, expected.length, { N: n });
  return crypto.timingSafeEqual(candidateHash, expected);
}
