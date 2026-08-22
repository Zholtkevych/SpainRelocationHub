"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState | undefined, FormData>(loginAction, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-alt px-4">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-lg border border-border bg-surface p-8 shadow-sm"
      >
        <h1 className="font-heading text-xl text-navy">Spain Relocation Hub — Admin</h1>
        <p className="mt-1 text-sm text-muted">Sign in to manage leads and site content.</p>

        <label htmlFor="password" className="mt-6 block text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
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
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
