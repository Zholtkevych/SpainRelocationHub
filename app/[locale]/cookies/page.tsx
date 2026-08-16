import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/locale/config";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("cookiesTitle") };
}

export default async function CookiesPage({ params }: PageProps<"/[locale]/cookies">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("legal");

  return (
    <LegalPageShell title={t("cookiesTitle")}>
      <p>{t("cookiesIntro")}</p>

      <h2 className="mt-4 text-lg font-semibold text-navy">{t("cookiesWhat")}</h2>
      <p>{t("cookiesWhatBody")}</p>

      <h2 className="mt-4 text-lg font-semibold text-navy">{t("cookiesEssential")}</h2>
      <p>{t("cookiesEssentialBody")}</p>

      <h2 className="mt-4 text-lg font-semibold text-navy">{t("cookiesAnalytics")}</h2>
      <p>{t("cookiesAnalyticsBody")}</p>

      <h2 className="mt-4 text-lg font-semibold text-navy">{t("cookiesControl")}</h2>
      <p>{t("cookiesControlBody")}</p>
    </LegalPageShell>
  );
}
