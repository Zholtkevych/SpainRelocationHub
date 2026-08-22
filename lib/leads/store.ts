import { db } from "@/lib/db";
import type { InitialLeadInput, QualificationLeadInput } from "@/lib/lead/schema";

export type LeadRow = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  phone: string | null;
  email: string;
  services: string | null;
  locale: string | null;
  source_section: string | null;
  referrer: string | null;
  consent_text_version: string | null;
  country_of_residence: string | null;
  preferred_language: string | null;
  income_source: string | null;
  timeline: string | null;
  party_size: number | null;
  qualified_at: string | null;
};

export function insertInitialLead(lead: InitialLeadInput): void {
  db.prepare(
    `INSERT INTO leads
      (name, phone, email, services, locale, source_section, referrer, consent_text_version)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    lead.name,
    lead.phone,
    lead.email,
    JSON.stringify(lead.services),
    lead.locale,
    lead.sourceSection ?? null,
    lead.referrer ?? null,
    lead.consentTextVersion,
  );
}

/**
 * Step 2 enrichment (SAD 6.2): attaches qualification data to the most
 * recent Step-1 record for the same email rather than blocking or creating
 * a disconnected entry. If no matching Step-1 row exists (shouldn't happen
 * in normal flow), a standalone row is inserted so the data isn't lost.
 */
export function attachQualification(lead: QualificationLeadInput): void {
  const existing = db
    .prepare(
      `SELECT id FROM leads WHERE email = ? AND qualified_at IS NULL
       ORDER BY created_at DESC LIMIT 1`,
    )
    .get(lead.email) as { id: number } | undefined;

  if (existing) {
    db.prepare(
      `UPDATE leads SET
        country_of_residence = ?,
        preferred_language = ?,
        income_source = ?,
        timeline = ?,
        party_size = ?,
        qualified_at = datetime('now'),
        updated_at = datetime('now')
       WHERE id = ?`,
    ).run(
      lead.countryOfResidence ?? null,
      lead.preferredLanguage ?? null,
      lead.incomeSource ?? null,
      lead.timeline ?? null,
      lead.partySize ?? null,
      existing.id,
    );
    return;
  }

  db.prepare(
    `INSERT INTO leads
      (name, email, locale, country_of_residence, preferred_language, income_source, timeline, party_size, qualified_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
  ).run(
    lead.name,
    lead.email,
    lead.locale,
    lead.countryOfResidence ?? null,
    lead.preferredLanguage ?? null,
    lead.incomeSource ?? null,
    lead.timeline ?? null,
    lead.partySize ?? null,
  );
}

export function listLeads(): LeadRow[] {
  return db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all() as unknown as LeadRow[];
}

export function leadsToCsv(leads: LeadRow[]): string {
  const columns: (keyof LeadRow)[] = [
    "id",
    "created_at",
    "name",
    "phone",
    "email",
    "services",
    "locale",
    "source_section",
    "referrer",
    "country_of_residence",
    "preferred_language",
    "income_source",
    "timeline",
    "party_size",
    "qualified_at",
  ];

  const escape = (value: unknown) => {
    const str = value === null || value === undefined ? "" : String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const header = columns.join(",");
  const rows = leads.map((lead) => columns.map((col) => escape(lead[col])).join(","));
  return [header, ...rows].join("\n");
}
