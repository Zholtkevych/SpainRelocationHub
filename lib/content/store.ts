import { db } from "@/lib/db";
import { locales, type Locale } from "@/lib/locale/config";

export type ContentTree = Record<string, unknown>;

async function loadDefaultContent(locale: Locale): Promise<ContentTree> {
  const mod = (await import(`@/messages/${locale}.json`)) as { default: ContentTree };
  return mod.default;
}

/**
 * Content now lives in SQLite (seeded from messages/*.json on first read),
 * not a static import — this is what lets the admin content editor publish
 * changes without a rebuild. Shape/keys are expected to stay identical to
 * the seed; the admin editor only edits string leaves, never structure.
 */
export async function getContent(locale: Locale): Promise<ContentTree> {
  const row = db.prepare("SELECT json FROM content WHERE locale = ?").get(locale) as
    | { json: string }
    | undefined;

  if (row) {
    return JSON.parse(row.json) as ContentTree;
  }

  const seeded = await loadDefaultContent(locale);
  db.prepare("INSERT INTO content (locale, json) VALUES (?, ?)").run(locale, JSON.stringify(seeded));
  return seeded;
}

export async function setContent(locale: Locale, content: ContentTree): Promise<void> {
  db.prepare(
    `INSERT INTO content (locale, json, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(locale) DO UPDATE SET json = excluded.json, updated_at = excluded.updated_at`,
  ).run(locale, JSON.stringify(content));
}

export async function getAllContent(): Promise<Record<Locale, ContentTree>> {
  const entries = await Promise.all(locales.map(async (locale) => [locale, await getContent(locale)] as const));
  return Object.fromEntries(entries) as Record<Locale, ContentTree>;
}
