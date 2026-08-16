import type { ReactNode } from "react";

export function LegalPageShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="mb-8 font-heading text-4xl text-navy">{title}</h1>
      <div className="flex flex-col gap-5 text-[15px] leading-relaxed text-ink [&_p]:m-0">
        {children}
      </div>
    </div>
  );
}

export function PlaceholderNotice({ children }: { children: ReactNode }) {
  return (
    <p className="border-l-[3px] border-gold bg-surface-alt px-5 py-4 text-sm text-muted">
      {children}
    </p>
  );
}
