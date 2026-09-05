import { ResetPasswordForm } from "./ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-alt px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-8 shadow-sm">
        <h1 className="font-heading text-xl text-navy">Set a new password</h1>

        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <p className="mt-3 text-sm text-error">
            Missing reset link. Request a new one from the sign-in page.
          </p>
        )}
      </div>
    </main>
  );
}
