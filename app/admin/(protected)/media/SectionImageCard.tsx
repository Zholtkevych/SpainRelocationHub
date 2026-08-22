"use client";

import { useActionState } from "react";
import type { SectionKey } from "@/lib/settings/keys";
import { uploadSectionImageAction, removeSectionImageAction, type UploadSectionImageState } from "./actions";

export function SectionImageCard({
  section,
  label,
  imageUrl,
}: {
  section: SectionKey;
  label: string;
  imageUrl: string | null;
}) {
  const [state, formAction, pending] = useActionState<UploadSectionImageState | undefined, FormData>(
    uploadSectionImageAction,
    undefined,
  );

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{label}</h2>

      {imageUrl ? (
        <div className="mb-4 overflow-hidden rounded-md border border-border">
          {/* Preview only — plain img is fine here, no next/image sizing concerns for an admin thumbnail. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={`${label} background`} className="h-32 w-full object-cover" />
        </div>
      ) : (
        <div className="mb-4 flex h-32 items-center justify-center rounded-md border border-dashed border-border-input text-xs text-muted">
          No photo set — default look
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-2">
        <input type="hidden" name="section" value={section} />
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="text-xs text-ink"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-gold px-3 py-1.5 text-xs font-medium text-navy hover:bg-gold-hover disabled:opacity-60"
          >
            {pending ? "Uploading…" : "Set photo"}
          </button>
        </div>
        {state?.error ? <p className="text-xs text-error">{state.error}</p> : null}
      </form>

      {imageUrl ? (
        <form action={removeSectionImageAction} className="mt-2">
          <input type="hidden" name="section" value={section} />
          <button
            type="submit"
            className="rounded-md border border-border-input px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-alt"
          >
            Remove
          </button>
        </form>
      ) : null}
    </div>
  );
}
