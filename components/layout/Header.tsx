import { getTranslations } from "next-intl/server";
import { HeaderNav } from "@/components/layout/HeaderNav";

const NAV_KEYS = [
  "property",
  "residency",
  "vehicles",
  "business",
  "insurance",
  "adaptation",
  "how",
  "faq",
] as const;

export async function Header() {
  const t = await getTranslations("nav");
  const tUi = await getTranslations("ui");

  const navLabels = Object.fromEntries(NAV_KEYS.map((key) => [key, t(key)]));

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <HeaderNav navLabels={navLabels} consultLabel={tUi("consult")} />
    </header>
  );
}
