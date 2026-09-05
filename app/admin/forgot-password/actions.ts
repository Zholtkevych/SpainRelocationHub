"use server";

import { getAdminUserByEmail, seedAdminUserIfEmpty } from "@/lib/admin/users";
import { createResetToken } from "@/lib/admin/reset";
import { sendPasswordResetEmail } from "@/lib/admin/email";
import { siteConfig } from "@/lib/site-config";

export type ForgotPasswordState = { submitted?: boolean };

export async function forgotPasswordAction(
  _prevState: ForgotPasswordState | undefined,
  formData: FormData,
): Promise<ForgotPasswordState> {
  seedAdminUserIfEmpty();
  const email = String(formData.get("email") ?? "").trim();

  const user = email ? getAdminUserByEmail(email) : undefined;

  // Same response either way, whether or not the email matched — the page
  // must not reveal which emails have an account (PRD-equivalent spam/enum
  // discipline applied to auth instead of the lead form this time).
  if (user) {
    const token = createResetToken(user.id);
    const resetUrl = `${siteConfig.siteUrl}/admin/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email, resetUrl);
  }

  return { submitted: true };
}
