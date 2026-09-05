// Admin-account maintenance script: creates a new admin account for the
// given email, or resets the password for an existing one — never touches
// any other admin's row. Multiple admins can coexist (e.g. the business
// owner and an operator each with their own login). Generates a fresh
// random password and prints it once so it can be handed over securely.
// Mirrors hash-admin-password.mjs's hashing exactly.
//
// Run with: node scripts/set-admin-account.mjs "email@example.com"
import crypto from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const newEmail = process.argv[2];
if (!newEmail) {
  console.error('Usage: node scripts/set-admin-account.mjs "new-email@example.com"');
  process.exit(1);
}

const SCRYPT_N = 16384;
const KEY_LENGTH = 64;

const password = crypto.randomBytes(9).toString("base64url");
const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(password, salt, KEY_LENGTH, { N: SCRYPT_N });
const passwordHash = `scrypt:${SCRYPT_N}:${salt.toString("hex")}:${hash.toString("hex")}`;

const dbPath = path.join(process.cwd(), "data", "srh.db");
const db = new DatabaseSync(dbPath);

const email = newEmail.trim().toLowerCase();
const existing = db.prepare("SELECT id FROM admin_users WHERE email = ?").get(email);

if (existing) {
  db.prepare("UPDATE admin_users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?").run(
    passwordHash,
    existing.id,
  );
  console.log(`Reset password for existing admin ${email}.`);
} else {
  db.prepare("INSERT INTO admin_users (email, password_hash) VALUES (?, ?)").run(email, passwordHash);
  console.log(`Created new admin account for ${email}.`);
}

console.log(`\nEmail:    ${newEmail}`);
console.log(`Password: ${password}\n`);
console.log("Share this password securely and have them change it via /admin/forgot-password afterward if they'd like.");
