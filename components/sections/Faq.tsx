import { getTranslations } from "next-intl/server";
import { faqJsonLd } from "@/lib/seo/jsonld";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { getSetting } from "@/lib/settings/store";
import { sectionImageSettingKey } from "@/lib/settings/keys";
import { photoBackgroundStyle } from "@/lib/media/background";

type FaqItem = { q: string; a: string };

export async function Faq() {
  const t = await getTranslations("faq");
  const items = t.raw("items") as FaqItem[];
  const jsonLd = faqJsonLd(items);
  const image = getSetting(sectionImageSettingKey("faq"));

  return (
    <section
      id="faq"
      className={image ? "bg-navy bg-cover bg-center px-6 py-24" : "bg-surface px-6 py-24"}
      style={image ? { backgroundImage: photoBackgroundStyle(image) } : undefined}
    >
      <div className="mx-auto max-w-3xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <h2
          className={`m-0 mb-10 font-heading font-normal ${image ? "text-white" : "text-navy"}`}
          style={{ fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
        >
          {t("h2")}
        </h2>
        <FaqAccordion items={items} dark={Boolean(image)} />
      </div>
    </section>
  );
}
