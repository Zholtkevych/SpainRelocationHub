"use server";

import { redirect } from "next/navigation";
import { consumeResetToken, markResetTokenUsed } from "@/lib/admin/reset";
import { updateAdminPassword } from "@/lib/admin/users";
import { hashPassword } from "@/lib/admin/password";

export type ResetPasswordState = { error?: string };

export async function resetPasswordAction(
  _prevState: ResetPasswordState | undefined,
  formData: FormData,
): Promise<ResetPasswordState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) {
    return { error: "Use at least 8 characters." };
  }
  if (password !== confirm) {
    return { error: "Passwords don't match." };
  }

  const consumed = consumeResetToken(token);
  if (!consumed) {
    return { error: "This reset link is invalid or has expired — request a new one." };
  }

  updateAdminPassword(consumed.adminUserId, hashPassword(password));
  markResetTokenUsed(consumed.resetId);

  redirect("/admin/login");
}
