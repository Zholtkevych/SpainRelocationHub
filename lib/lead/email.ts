import { Resend } from "resend";
import type { InitialLeadInput, QualificationLeadInput } from "@/lib/lead/schema";
import { siteConfig } from "@/lib/site-config";

type SendResult = { delivered: boolean };

const FROM_ADDRESS = process.env.LEAD_FROM_EMAIL ?? "Spain Relocation Hub <onboarding@resend.dev>";
const NOTIFY_ADDRESS = process.env.LEAD_NOTIFICATION_EMAIL ?? siteConfig.email;

function client() {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

/**
 * Swappable email interface — without RESEND_API_KEY set (local dev, or
 * before SRH confirms a provider), this logs instead of sending so `next
 * build`/`next dev` never fail on missing secrets. Known gap without a DB
 * (SAD FR-06.13's persist-then-alert guarantee needs the later DB phase):
 * a delivery failure here loses the lead beyond this log line.
 */
export async function sendInitialLeadEmail(lead: InitialLeadInput): Promise<SendResult> {
  const subject = `New enquiry — ${lead.name} (${lead.services.join(", ")})`;
  const text = [
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Services: ${lead.services.join(", ")}`,
    `Language: ${lead.locale}`,
    `Source section: ${lead.sourceSection ?? "-"}`,
    `Referrer: ${lead.referrer ?? "-"}`,
    `Consent: given (${lead.consentTextVersion})`,
  ].join("\n");

  return dispatch(subject, text);
}

export async function sendQualificationEmail(lead: QualificationLeadInput): Promise<SendResult> {
  const subject = `Qualification details — ${lead.name} (${lead.email})`;
  const text = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Country of residence: ${lead.countryOfResidence ?? "-"}`,
    `Preferred language: ${lead.preferredLanguage ?? "-"}`,
    `Income source: ${lead.incomeSource ?? "-"}`,
    `Timeline: ${lead.timeline ?? "-"}`,
    `Party size: ${lead.partySize ?? "-"}`,
  ].join("\n");

  return dispatch(subject, text);
}

async function dispatch(subject: string, text: string): Promise<SendResult> {
  const resend = client();

  if (!resend) {
    console.log(`[DEV email] To: ${NOTIFY_ADDRESS}\nSubject: ${subject}\n\n${text}`);
    return { delivered: true };
  }

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: NOTIFY_ADDRESS,
      replyTo: FROM_ADDRESS,
      subject,
      text,
    });
    return { delivered: true };
  } catch (error) {
    console.error("[lead email] delivery failed", error);
    return { delivered: false };
  }
}
