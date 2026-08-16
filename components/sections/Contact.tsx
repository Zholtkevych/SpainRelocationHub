import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/sections/ContactForm";
import { WhatsAppContactLink } from "@/components/sections/WhatsAppContactLink";
import { siteConfig } from "@/lib/site-config";

const socialIcons = {
  instagram: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" />
    </svg>
  ),
  facebook: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.29-.04-1.27-.12-2.4-.12-2.38 0-4 1.45-4 4.11V9.9H7.6V13h2.7v8h3.2Z" />
    </svg>
  ),
  linkedin: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.4 21h3.2V8.9H3.4V21Zm6.1-12.1V21h3.2v-6.35c0-1.68.32-3.3 2.4-3.3 2.05 0 2.08 1.92 2.08 3.41V21h3.2v-6.88c0-3.4-.73-6.02-4.7-6.02-1.91 0-3.19 1.05-3.71 2.04h-.05V8.9H9.5Z" />
    </svg>
  ),
};

export async function Contact() {
  const t = await getTranslations("contact");
  const tWa = await getTranslations("whatsapp");

  return (
    <section id="contact" className="bg-surface-alt px-6 py-24">
      <div
        className="mx-auto grid max-w-6xl items-start gap-14"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
      >
        <div>
          <h2
            className="m-0 mb-5 font-heading font-normal text-navy"
            style={{ fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
          >
            {t("h2")}
          </h2>
          <p className="m-0 mb-9 max-w-lg text-[17px] leading-relaxed text-muted">{t("lead")}</p>

          <div className="mb-7 flex flex-col gap-px border border-border bg-border">
            <a
              href={siteConfig.phoneHref}
              className="flex items-center justify-between gap-4 bg-surface px-5.5 py-4.5 text-ink hover:bg-[#FAFBFC] hover:text-navy"
            >
              <span className="text-[13px] text-[#8A8F9A]">{t("phone")}</span>
              <span className="text-base font-medium text-navy">{siteConfig.phone}</span>
            </a>
            <WhatsAppContactLink greeting={tWa("greeting")} />
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex flex-wrap items-center justify-between gap-4 bg-surface px-5.5 py-4.5 text-ink hover:bg-[#FAFBFC] hover:text-navy"
            >
              <span className="text-[13px] text-[#8A8F9A]">Email</span>
              <span className="text-[15px] font-medium break-all text-navy">{siteConfig.email}</span>
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
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
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-border-input text-navy hover:border-navy hover:bg-navy hover:text-white"
              >
                {socialIcons[key]}
              </a>
            ))}
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
