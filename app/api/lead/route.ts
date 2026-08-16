import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { leadRequestSchema } from "@/lib/lead/schema";
import { looksLikeSpam } from "@/lib/lead/spam";
import { sendInitialLeadEmail, sendQualificationEmail } from "@/lib/lead/email";

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

  const result =
    lead.stage === "initial"
      ? await sendInitialLeadEmail(lead)
      : await sendQualificationEmail(lead);

  if (!result.delivered) {
    // The lead is still acknowledged to the visitor (nothing they can fix by
    // retrying) — delivery failure is surfaced server-side only, per the
    // documented gap in lib/lead/email.ts.
    console.error("[api/lead] email dispatch failed for stage", lead.stage);
  }

  return NextResponse.json({ ok: true });
}
