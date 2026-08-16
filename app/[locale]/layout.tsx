import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Onest, Source_Serif_4 } from "next/font/google";
import { locales, isLocale } from "@/lib/locale/config";
import { siteConfig } from "@/lib/site-config";
import { organizationJsonLd } from "@/lib/seo/jsonld";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { LeadSelectionProvider } from "@/components/LeadSelectionProvider";
import "../globals.css";

const onest = Onest({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-onest",
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-source-serif",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "seo" });

  const languages = Object.fromEntries(
    locales.map((l) => [l, `${siteConfig.siteUrl}/${l}`]),
  );

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(siteConfig.siteUrl),
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}`,
      languages: {
        ...languages,
        "x-default": `${siteConfig.siteUrl}/en`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteConfig.siteUrl}/${locale}`,
      siteName: siteConfig.name,
      locale,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Opts this locale's tree into static rendering with generateStaticParams
  // rather than reading the locale dynamically per-request.
  setRequestLocale(locale);

  const jsonLd = organizationJsonLd(locale);

  return (
    <html
      lang={locale}
      className={`${onest.variable} ${sourceSerif4.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-ink">
        <NextIntlClientProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <LeadSelectionProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:bg-navy focus:text-white focus:px-4 focus:py-2 focus:rounded"
            >
              Skip to content
            </a>
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
            <CookieConsentBanner />
          </LeadSelectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
