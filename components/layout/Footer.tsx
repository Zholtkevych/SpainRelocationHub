import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/Logo";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";

const SERVICE_NAV_KEYS = [
  "property",
  "residency",
  "vehicles",
  "business",
  "insurance",
  "adaptation",
] as const;

const socialIcons = {
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" />
    </svg>
  ),
  facebook: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.29-.04-1.27-.12-2.4-.12-2.38 0-4 1.45-4 4.11V9.9H7.6V13h2.7v8h3.2Z" />
    </svg>
  ),
  linkedin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.4 21h3.2V8.9H3.4V21Zm6.1-12.1V21h3.2v-6.35c0-1.68.32-3.3 2.4-3.3 2.05 0 2.08 1.92 2.08 3.41V21h3.2v-6.88c0-3.4-.73-6.02-4.7-6.02-1.91 0-3.19 1.05-3.71 2.04h-.05V8.9H9.5Z" />
    </svg>
  ),
};

export async function Footer() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy px-6 py-16 pb-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 border-b border-white/16 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Logo className="h-9 w-9" stroke="#FFFFFF" />
              <span className="font-heading text-[19px] font-semibold text-white">
                Spain Relocation Hub
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-[#93A2BF]">
              {t("footer.blurb")}
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="mb-1.5 text-[11px] font-medium tracking-widest text-gold uppercase">
              {t("footer.services")}
            </div>
            {SERVICE_NAV_KEYS.map((key) => (
              <a
                key={key}
                href={`#${key}`}
                className="text-sm text-[#C9D3E6] hover:text-white"
              >
                {t(`nav.${key}`)}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="mb-1.5 text-[11px] font-medium tracking-widest text-gold uppercase">
              {t("footer.contactT")}
            </div>
            <a href={siteConfig.phoneHref} className="text-sm text-[#C9D3E6] hover:text-white">
              {siteConfig.phone}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-sm break-all text-[#C9D3E6] hover:text-white"
            >
              {siteConfig.email}
            </a>
            <div className="mt-1.5 flex gap-2.5">
              {(
                [
                  ["instagram", siteConfig.social.instagram],
                  ["facebook", siteConfig.social.facebook],
                  ["linkedin", siteConfig.social.linkedin],
                ] as const
              ).map(([key, href]) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={key}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/28 text-[#C9D3E6] hover:border-gold hover:text-gold"
                >
                  {socialIcons[key]}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="mb-1.5 text-[11px] font-medium tracking-widest text-gold uppercase">
              {t("footer.legalT")}
            </div>
            <Link href="/privacy" className="text-sm text-[#C9D3E6] hover:text-white">
              {t("footer.privacy")}
            </Link>
            <Link href="/cookies" className="text-sm text-[#C9D3E6] hover:text-white">
              {t("footer.cookies")}
            </Link>
            <Link href="/legal" className="text-sm text-[#C9D3E6] hover:text-white">
              {t("footer.notice")}
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-5 pt-7 text-[13px] text-[#93A2BF]">
          <div>© {year} Spain Relocation Hub</div>
          <div>{t("footer.rights")}</div>
        </div>
      </div>
    </footer>
  );
}
