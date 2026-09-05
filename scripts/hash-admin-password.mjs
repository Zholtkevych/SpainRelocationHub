// Generates an ADMIN_PASSWORD_HASH value for .env.local / your host's env
// vars. Run with: node scripts/hash-admin-password.mjs "your new password"
//
// Plain Node script (not TypeScript) so it runs standalone without the
// Next.js build pipeline — mirrors lib/admin/password.ts's format exactly;
// keep the two in sync if that file ever changes.
import crypto from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-admin-password.mjs "your new password"');
  process.exit(1);
}

if (password.length < 8) {
  console.error("Use at least 8 characters.");
  process.exit(1);
}

const SCRYPT_N = 16384;
const KEY_LENGTH = 64;

const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(password, salt, KEY_LENGTH, { N: SCRYPT_N });
// ":" delimiter, not "$" — Next.js's .env loader treats "$name" as a
// reference to another env var and silently mangles it.
const value = `scrypt:${SCRYPT_N}:${salt.toString("hex")}:${hash.toString("hex")}`;

console.log("\nAdd this to .env.local (or your host's environment variables):\n");
console.log(`ADMIN_PASSWORD_HASH=${value}\n`);
console.log("Restart the server for it to take effect.");
