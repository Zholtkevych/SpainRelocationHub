import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/locale/config";
import { LegalPageShell, PlaceholderNotice } from "@/components/legal/LegalPageShell";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("legalTitle") };
}

export default async function LegalNoticePage({ params }: PageProps<"/[locale]/legal">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("legal");

  return (
    <LegalPageShell title={t("legalTitle")}>
      <p>{t("legalIntro")}</p>

      <h2 className="mt-4 text-lg font-semibold text-navy">{t("legalCompany")}</h2>
      <PlaceholderNotice>{t("controllerEntity")}</PlaceholderNotice>

      <h2 className="mt-4 text-lg font-semibold text-navy">{t("legalActivity")}</h2>
      <p>{t("legalActivityBody")}</p>

      <h2 className="mt-4 text-lg font-semibold text-navy">{t("contact")}</h2>
      <p>
        {siteConfig.email} · {siteConfig.phone}
      </p>
    </LegalPageShell>
  );
}
