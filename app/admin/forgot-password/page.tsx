"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction, type ForgotPasswordState } from "./actions";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState<ForgotPasswordState | undefined, FormData>(
    forgotPasswordAction,
    undefined,
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-alt px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-8 shadow-sm">
        <h1 className="font-heading text-xl text-navy">Reset your password</h1>

        {state?.submitted ? (
          <>
            <p className="mt-3 text-sm text-ink">
              If that email has an admin account, a reset link is on its way — it expires in 1 hour.
            </p>
            <Link href="/admin/login" className="mt-6 block text-center text-sm text-gold-hover hover:text-navy">
              Back to sign in
            </Link>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-muted">Enter your admin email and we&apos;ll send a reset link.</p>

            <form action={formAction}>
              <label htmlFor="email" className="mt-6 block text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoFocus
                autoComplete="username"
                className="mt-1 w-full rounded-md border border-border-input px-3 py-2 text-ink outline-none focus-visible:border-navy"
              />

              <button
                type="submit"
                disabled={pending}
                className="mt-6 w-full rounded-md bg-gold px-4 py-2 font-medium text-navy transition-colors hover:bg-gold-hover disabled:opacity-60"
              >
                {pending ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <Link href="/admin/login" className="mt-4 block text-center text-sm text-muted hover:text-navy">
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
