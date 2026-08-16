import { getTranslations } from "next-intl/server";
import { SectionCta } from "@/components/sections/SectionCta";
import { WhatsAppHeroLink } from "@/components/sections/WhatsAppHeroLink";
import { siteConfig } from "@/lib/site-config";

const socialIcons = {
  instagram: (
    <svg width="31" height="31" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" />
    </svg>
  ),
  facebook: (
    <svg width="31" height="31" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.29-.04-1.27-.12-2.4-.12-2.38 0-4 1.45-4 4.11V9.9H7.6V13h2.7v8h3.2Z" />
    </svg>
  ),
  linkedin: (
    <svg width="31" height="31" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.4 21h3.2V8.9H3.4V21Zm6.1-12.1V21h3.2v-6.35c0-1.68.32-3.3 2.4-3.3 2.05 0 2.08 1.92 2.08 3.41V21h3.2v-6.88c0-3.4-.73-6.02-4.7-6.02-1.91 0-3.19 1.05-3.71 2.04h-.05V8.9H9.5Z" />
    </svg>
  ),
};

// No licensed photography exists yet (PDD risk register: "photography quality
// below the premium standard undermines positioning more than any copy
// decision"). This diagonal-stripe treatment is a deliberate placeholder,
// not a bug — swap in premium Madrid/Spain photography before launch.
export async function Hero() {
  const t = await getTranslations("hero");
  const tWa = await getTranslations("whatsapp");

  const points = t.raw("points") as string[];

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-navy"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, #10336C 0px, #10336C 10px, #0C2C61 10px, #0C2C61 20px), linear-gradient(90deg, rgba(10,42,94,0.94) 0%, rgba(10,42,94,0.72) 100%)",
      }}
    >
      <div className="absolute inset-y-0 right-20 z-[2] hidden flex-col justify-center gap-4 nav:flex">
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
            className="flex h-17 w-17 items-center justify-center rounded-2xl border border-white/30 text-white hover:border-gold hover:text-gold"
          >
            {socialIcons[key]}
          </a>
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16 pr-24 sm:py-24 nav:pr-56">
        <div className="mb-6 text-[11px] font-medium tracking-widest text-gold uppercase">
          {t("eyebrow")}
        </div>
        <h1
          className="mb-6 max-w-3xl font-heading font-normal text-white"
          style={{ fontSize: "clamp(38px, 6vw, 68px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}
        >
          {t("h1")}
        </h1>
        <p className="mb-10 max-w-2xl text-[#C9D3E6]" style={{ fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.6 }}>
          {t("sub")}
        </p>
        <div className="mb-14 flex flex-wrap gap-3.5">
          <SectionCta label={t("cta1")} className="!py-4 !text-base" />
          <WhatsAppHeroLink greeting={tWa("greeting")} />
        </div>
        <div className="grid grid-cols-1 gap-px border border-white/14 bg-white/14 sm:grid-cols-2 nav:grid-cols-4">
          {points.map((point) => (
            <div key={point} className="bg-navy p-5.5 text-[15px] leading-snug text-white">
              {point}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
