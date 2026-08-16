import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/locale/config";
import { LegalPageShell, PlaceholderNotice } from "@/components/legal/LegalPageShell";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("privacyTitle") };
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("legal");

  return (
    <LegalPageShell title={t("privacyTitle")}>
      <p>{t("intro")}</p>

      <h2 className="mt-4 text-lg font-semibold text-navy">{t("dataController")}</h2>
      <PlaceholderNotice>{t("controllerEntity")}</PlaceholderNotice>

      <h2 className="mt-4 text-lg font-semibold text-navy">{t("whatWeCollect")}</h2>
      <p>{t("whatWeCollectBody")}</p>

      <h2 className="mt-4 text-lg font-semibold text-navy">{t("retention")}</h2>
      <PlaceholderNotice>{t("retentionPeriod")}</PlaceholderNotice>

      <h2 className="mt-4 text-lg font-semibold text-navy">{t("rights")}</h2>
      <p>{t("rightsBody")}</p>

      <h2 className="mt-4 text-lg font-semibold text-navy">{t("contact")}</h2>
      <PlaceholderNotice>{t("dpoContact")}</PlaceholderNotice>
    </LegalPageShell>
  );
}
