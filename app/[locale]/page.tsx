import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/locale/config";
import { Hero } from "@/components/sections/Hero";
import { ServiceSection } from "@/components/sections/ServiceSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import {
  PropertyIcon,
  ResidencyIcon,
  VehiclesIcon,
  BusinessIcon,
  InsuranceIcon,
  AdaptationIcon,
} from "@/components/sections/icons";

type Item = { t: string; d: string; n?: string };

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const [tUi, tProperty, tResidency, tVehicles, tBusiness, tInsurance, tAdaptation, tWhy, tNav] =
    await Promise.all([
      getTranslations("ui"),
      getTranslations("property"),
      getTranslations("residency"),
      getTranslations("vehicles"),
      getTranslations("business"),
      getTranslations("insurance"),
      getTranslations("adaptation"),
      getTranslations("why"),
      getTranslations("nav"),
    ]);

  const consultLabel = tUi("consult");

  return (
    <>
      <Hero />

      <ServiceSection
        id="property"
        background="white"
        icon={<PropertyIcon />}
        eyebrow={tProperty("eyebrow")}
        heading={tProperty("h2")}
        lead={tProperty("lead")}
        items={tProperty.raw("items") as Item[]}
        minItemWidth={280}
        cta={{ label: consultLabel, service: "property" }}
        consultLabel={consultLabel}
      />

      <ServiceSection
        id="residency"
        background="alt"
        icon={<ResidencyIcon />}
        eyebrow={tResidency("eyebrow")}
        heading={tResidency("h2")}
        lead={tResidency("lead")}
        items={tResidency.raw("items") as Item[]}
        minItemWidth={280}
        note={tResidency("note")}
        noteLinkHref="/#insurance"
        noteLinkLabel={tNav("insurance")}
        cta={{ label: consultLabel, service: "residency" }}
        consultLabel={consultLabel}
      />

      <ServiceSection
        id="vehicles"
        background="white"
        icon={<VehiclesIcon />}
        eyebrow={tVehicles("eyebrow")}
        heading={tVehicles("h2")}
        items={tVehicles.raw("items") as Item[]}
        minItemWidth={300}
        cta={{ label: consultLabel, service: "vehicles", variant: "outline" }}
        consultLabel={consultLabel}
      />

      <ServiceSection
        id="business"
        background="navy"
        icon={<BusinessIcon />}
        eyebrow={tBusiness("eyebrow")}
        heading={tBusiness("h2")}
        lead={tBusiness("lead")}
        items={tBusiness.raw("items") as Item[]}
        minItemWidth={230}
        numbered
        cta={{ label: consultLabel, service: "business" }}
        consultLabel={consultLabel}
      />

      <ServiceSection
        id="insurance"
        background="white"
        icon={<InsuranceIcon />}
        eyebrow={tInsurance("eyebrow")}
        heading={tInsurance("h2")}
        items={tInsurance.raw("items") as Item[]}
        itemStyle="rule"
        minItemWidth={230}
        cta={{ label: consultLabel, service: "insurance", variant: "outline" }}
        consultLabel={consultLabel}
      />

      <ServiceSection
        id="adaptation"
        background="alt"
        icon={<AdaptationIcon />}
        eyebrow={tAdaptation("eyebrow")}
        heading={tAdaptation("h2")}
        lead={tAdaptation("lead")}
        items={tAdaptation.raw("items") as Item[]}
        minItemWidth={280}
        cta={{ label: consultLabel, service: "adaptation" }}
        consultLabel={consultLabel}
      />

      <ServiceSection
        id="why"
        background="white"
        heading={tWhy("h2")}
        items={tWhy.raw("items") as Item[]}
        itemStyle="rule"
        ruleColor="gold"
        minItemWidth={220}
        cta={null}
        consultLabel={consultLabel}
      />

      <HowItWorks />
      <Faq />
      <Contact />
    </>
  );
}
