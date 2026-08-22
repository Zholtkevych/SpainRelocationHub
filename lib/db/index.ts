import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

// SQLite via Node's built-in driver (stable since Node 22) — no native
// dependency to install, and a real persistent store instead of hardcoded
// JSON, which is what the admin panel (leads + content editing) needs.
// This only works with a persistent filesystem (self-hosted / this local
// deploy) — it would NOT survive Vercel's ephemeral serverless filesystem,
// which is a real constraint if this moves back to Vercel later.

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "srh.db");

// Cached on globalThis so Next.js dev-mode module reloads don't reopen the
// file repeatedly and hit "database is locked".
const globalForDb = globalThis as unknown as { __srhDb?: DatabaseSync };

export const db = globalForDb.__srhDb ?? new DatabaseSync(DB_PATH);
globalForDb.__srhDb = db;

// `next build` collects page data across several worker processes, each
// opening its own connection to this same file at effectively the same
// instant — the very first statement on a fresh connection (even just
// setting busy_timeout) can itself race another process's exclusive lock
// before any timeout has taken effect. Retry with a short blocking sleep
// (synchronous — DatabaseSync has no async form) rather than relying on
// busy_timeout alone to cover that first-statement race.
function execWithRetry(sql: string, attempts = 20): void {
  for (let i = 0; i < attempts; i++) {
    try {
      db.exec(sql);
      return;
    } catch (error) {
      const isLocked = error instanceof Error && /database is locked/i.test(error.message);
      if (!isLocked || i === attempts - 1) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 50 + Math.random() * 100);
    }
  }
}

execWithRetry("PRAGMA busy_timeout = 5000;");
execWithRetry("PRAGMA journal_mode = WAL;");

execWithRetry(`
  CREATE TABLE IF NOT EXISTS content (
    locale TEXT PRIMARY KEY,
    json TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT NOT NULL,
    services TEXT,
    locale TEXT,
    source_section TEXT,
    referrer TEXT,
    consent_text_version TEXT,
    country_of_residence TEXT,
    preferred_language TEXT,
    income_source TEXT,
    timeline TEXT,
    party_size INTEGER,
    qualified_at TEXT
  );
`);
