import Link from "next/link";
import { getContent } from "@/lib/content/store";
import { locales, localeMeta, isLocale, defaultLocale, type Locale } from "@/lib/locale/config";
import ContentEditorTree from "./ContentEditorTree";

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const params = await searchParams;
  const locale: Locale = params.locale && isLocale(params.locale) ? params.locale : defaultLocale;
  const content = await getContent(locale);

  return (
    <div>
      <h1 className="font-heading text-2xl text-navy">Content</h1>
      <p className="mt-1 text-sm text-muted">
        Edit page text per language. Section and list structure is fixed — only wording is editable. Publishing
        updates the live site immediately, no rebuild needed.
      </p>

      <div className="mt-4 flex gap-2 border-b border-border">
        {locales.map((l) => (
          <Link
            key={l}
            href={`/admin/content?locale=${l}`}
            className={`rounded-t-md px-4 py-2 text-sm font-medium ${
              l === locale ? "border-b-2 border-gold text-navy" : "text-muted hover:text-navy"
            }`}
          >
            {localeMeta[l].label}
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface p-6">
        <ContentEditorTree key={locale} locale={locale} initialContent={content} />
      </div>
    </div>
  );
}
