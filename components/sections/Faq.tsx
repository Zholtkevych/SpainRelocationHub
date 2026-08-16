import { getTranslations } from "next-intl/server";
import { faqJsonLd } from "@/lib/seo/jsonld";
import { FaqAccordion } from "@/components/sections/FaqAccordion";

type FaqItem = { q: string; a: string };

export async function Faq() {
  const t = await getTranslations("faq");
  const items = t.raw("items") as FaqItem[];
  const jsonLd = faqJsonLd(items);

  return (
    <section id="faq" className="bg-surface px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <h2
          className="m-0 mb-10 font-heading font-normal text-navy"
          style={{ fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
        >
          {t("h2")}
        </h2>
        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
