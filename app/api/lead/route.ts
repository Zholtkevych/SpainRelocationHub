import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { leadRequestSchema } from "@/lib/lead/schema";
import { looksLikeSpam } from "@/lib/lead/spam";
import { sendInitialLeadEmail, sendQualificationEmail } from "@/lib/lead/email";
import { insertInitialLead, attachQualification } from "@/lib/leads/store";

// Bots get an identical success response either way, so failed checks never
// tip them off (PRD FR-06.10: invisible spam mitigation only).
const SILENT_OK = NextResponse.json({ ok: true });

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const lead = parsed.data;

  if (looksLikeSpam(lead.startedAt) || lead.company) {
    return SILENT_OK;
  }

  // Persist first, email second — the DB row is the durable record now, so
  // an email delivery failure (still logged below) no longer loses the
  // lead the way the pre-database version of this route did.
  if (lead.stage === "initial") {
    insertInitialLead(lead);
  } else {
    attachQualification(lead);
  }

  const result =
    lead.stage === "initial"
      ? await sendInitialLeadEmail(lead)
      : await sendQualificationEmail(lead);

  if (!result.delivered) {
    console.error("[api/lead] email dispatch failed for stage", lead.stage);
  }

  return NextResponse.json({ ok: true });
}
