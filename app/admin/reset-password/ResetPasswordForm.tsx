"use client";

import { useActionState } from "react";
import { resetPasswordAction, type ResetPasswordState } from "./actions";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<ResetPasswordState | undefined, FormData>(
    resetPasswordAction,
    undefined,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="token" value={token} />

      <label htmlFor="password" className="mt-6 block text-sm font-medium text-ink">
        New password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        minLength={8}
        autoFocus
        autoComplete="new-password"
        className="mt-1 w-full rounded-md border border-border-input px-3 py-2 text-ink outline-none focus-visible:border-navy"
      />

      <label htmlFor="confirm" className="mt-4 block text-sm font-medium text-ink">
        Confirm password
      </label>
      <input
        id="confirm"
        name="confirm"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        className="mt-1 w-full rounded-md border border-border-input px-3 py-2 text-ink outline-none focus-visible:border-navy"
      />

      {state?.error ? (
        <p role="alert" className="mt-3 text-sm text-error">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-md bg-gold px-4 py-2 font-medium text-navy transition-colors hover:bg-gold-hover disabled:opacity-60"
      >
        {pending ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
