"use client";

import { useState, useTransition } from "react";
import type { Locale } from "@/lib/locale/config";
import type { ContentTree } from "@/lib/content/store";
import { saveContentAction } from "./actions";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type PathSegment = string | number;

function setPath(obj: Json, path: PathSegment[], value: string): Json {
  if (path.length === 0) return value;
  const [head, ...rest] = path;

  if (Array.isArray(obj)) {
    const copy = obj.slice();
    copy[head as number] = setPath(copy[head as number] ?? null, rest, value);
    return copy;
  }

  if (obj && typeof obj === "object") {
    return { ...obj, [head]: setPath((obj as Record<string, Json>)[head as string] ?? null, rest, value) };
  }

  return obj;
}

// Walks the content tree and renders an input/textarea for every string
// leaf only — objects and arrays render as structure (labels/groups), never
// as something the operator can add to or remove from. This is the same
// intent as the SAD's per-block-type constrained editor (AD-04), built as
// one generic recursive walk instead of a schema per block type, to ship
// today: real editing freedom over wording, none over structure.
function FieldTree({
  node,
  path,
  onChange,
}: {
  node: Json;
  path: PathSegment[];
  onChange: (path: PathSegment[], value: string) => void;
}) {
  if (typeof node === "string") {
    const label = path.slice(-2).join(" › ") || "value";
    const long = node.length > 80;

    return (
      <div className="mb-3">
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">{label}</label>
        {long ? (
          <textarea
            defaultValue={node}
            rows={3}
            className="w-full rounded-md border border-border-input px-3 py-2 text-sm text-ink outline-none focus-visible:border-navy"
            onBlur={(e) => onChange(path, e.target.value)}
          />
        ) : (
          <input
            defaultValue={node}
            className="w-full rounded-md border border-border-input px-3 py-2 text-sm text-ink outline-none focus-visible:border-navy"
            onBlur={(e) => onChange(path, e.target.value)}
          />
        )}
      </div>
    );
  }

  if (Array.isArray(node)) {
    return (
      <div className="ml-2 space-y-3 border-l border-border pl-4">
        {node.map((item, i) => (
          <div key={i} className="rounded-md bg-surface-alt p-3">
            <div className="mb-2 text-xs font-semibold text-muted">Item {i + 1}</div>
            <FieldTree node={item} path={[...path, i]} onChange={onChange} />
          </div>
        ))}
      </div>
    );
  }

  if (node && typeof node === "object") {
    return (
      <div>
        {Object.entries(node).map(([key, value]) => {
          const isGroup = value !== null && typeof value === "object";
          return (
            <div key={key}>
              {isGroup ? (
                <div className="mb-2 mt-5 border-b border-border pb-1 text-sm font-semibold text-navy first:mt-0">
                  {key}
                </div>
              ) : null}
              <FieldTree node={value} path={[...path, key]} onChange={onChange} />
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

export default function ContentEditorTree({
  locale,
  initialContent,
}: {
  locale: Locale;
  initialContent: ContentTree;
}) {
  const [content, setContent] = useState<ContentTree>(initialContent);
  const [pending, startTransition] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  function handleChange(path: PathSegment[], value: string) {
    setJustSaved(false);
    setContent((prev) => setPath(prev as Json, path, value) as ContentTree);
  }

  function handleSave() {
    startTransition(async () => {
      await saveContentAction(locale, content);
      setJustSaved(true);
    });
  }

  return (
    <div>
      <div className="sticky top-0 z-10 mb-4 flex items-center gap-3 border-b border-border bg-surface py-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-hover disabled:opacity-60"
        >
          {pending ? "Publishing…" : "Publish changes"}
        </button>
        {justSaved && !pending ? <span className="text-sm text-muted">Published — live on the site now.</span> : null}
      </div>
      <FieldTree node={content as Json} path={[]} onChange={handleChange} />
    </div>
  );
}
