import { z } from "zod";
import { locales } from "@/lib/locale/config";
import { SERVICE_KEYS } from "@/lib/lead/constants";

const localeSchema = z.enum(locales);

// Never trust client-side validation (PRD 8.3 conventions) — the server
// re-validates independently even though ContactForm.tsx checks the same
// rules before submitting.
const spamFieldsSchema = z.object({
  // Honeypot: real visitors never fill this in (it's visually hidden). This
  // must NOT be constrained here (e.g. max(0)) — a schema rejection returns
  // a 400 that reveals the hidden field to a bot. Route.ts checks its value
  // after validation succeeds and responds with an identical 200 either way.
  company: z.string().max(500).optional().default(""),
  // Client-side mount timestamp; rejects submissions faster than a human
  // could plausibly fill the form. Soft heuristic, not a security boundary.
  startedAt: z.number(),
});

export const initialLeadSchema = z
  .object({
    stage: z.literal("initial"),
    name: z.string().trim().min(2).max(200),
    phone: z.string().trim().min(7).max(40),
    email: z.string().trim().email().max(320),
    services: z.array(z.enum(SERVICE_KEYS)).min(1),
    consent: z.literal(true),
    consentTextVersion: z.string(),
    locale: localeSchema,
    sourceSection: z.string().max(60).optional(),
    referrer: z.string().max(500).optional(),
  })
  .merge(spamFieldsSchema);

export const qualificationLeadSchema = z
  .object({
    stage: z.literal("qualification"),
    // Correlates with the initial submission; we don't have a DB record to
    // attach to in this phase, so both stages arrive as separate emails.
    email: z.string().trim().email().max(320),
    name: z.string().trim().min(2).max(200),
    countryOfResidence: z.string().trim().max(120).optional(),
    preferredLanguage: localeSchema.optional(),
    incomeSource: z.string().trim().max(60).optional(),
    timeline: z.string().trim().max(60).optional(),
    partySize: z.coerce.number().int().min(1).max(20).optional(),
    locale: localeSchema,
  })
  .merge(spamFieldsSchema);

export const leadRequestSchema = z.discriminatedUnion("stage", [
  initialLeadSchema,
  qualificationLeadSchema,
]);

export type InitialLeadInput = z.infer<typeof initialLeadSchema>;
export type QualificationLeadInput = z.infer<typeof qualificationLeadSchema>;
export type LeadRequestInput = z.infer<typeof leadRequestSchema>;
