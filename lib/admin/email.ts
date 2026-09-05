import { Resend } from "resend";

const FROM_ADDRESS = process.env.LEAD_FROM_EMAIL ?? "Spain Relocation Hub <onboarding@resend.dev>";

function client() {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

// Same swappable/dev-fallback pattern as lib/lead/email.ts — without
// RESEND_API_KEY set, this logs the reset link instead of emailing it, so
// local dev never needs live credentials to test the flow.
export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<{ delivered: boolean }> {
  const subject = "Reset your Spain Relocation Hub admin password";
  const text = [
    "Someone requested a password reset for the admin panel.",
    "",
    `Reset your password: ${resetUrl}`,
    "",
    "This link expires in 1 hour. If you didn't request this, you can ignore this email.",
  ].join("\n");

  const resend = client();
  if (!resend) {
    console.log(`[DEV email] To: ${to}\nSubject: ${subject}\n\n${text}`);
    return { delivered: true };
  }

  try {
    await resend.emails.send({ from: FROM_ADDRESS, to, subject, text });
    return { delivered: true };
  } catch (error) {
    console.error("[admin email] reset delivery failed", error);
    return { delivered: false };
  }
}
