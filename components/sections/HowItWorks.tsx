import { getTranslations } from "next-intl/server";
import { getSetting } from "@/lib/settings/store";
import { sectionImageSettingKey } from "@/lib/settings/keys";
import { photoBackgroundStyle } from "@/lib/media/background";

type Step = { n: string; t: string; d: string };

export async function HowItWorks() {
  const t = await getTranslations("how");
  const steps = t.raw("steps") as Step[];
  const image = getSetting(sectionImageSettingKey("how"));

  return (
    <section
      id="how"
      className={image ? "bg-navy bg-cover bg-center px-6 py-24" : "bg-surface-alt px-6 py-24"}
      style={image ? { backgroundImage: photoBackgroundStyle(image) } : undefined}
    >
      <div className="mx-auto max-w-6xl">
        <h2
          className={`m-0 mb-3 max-w-lg font-heading font-normal ${image ? "text-white" : "text-navy"}`}
          style={{ fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
        >
          {t("h2")}
        </h2>
        <p className={`m-0 mb-12 max-w-2xl text-[17px] leading-relaxed ${image ? "text-[#C9D3E6]" : "text-muted"}`}>
          {t("lead")}
        </p>
        <ol
          className="grid gap-8"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
        >
          {steps.map((step) => (
            <li key={step.n} className="flex items-start gap-5">
              <div
                className={`flex-none font-heading text-5xl leading-[0.9] ${image ? "text-gold" : "text-gold-hover"}`}
              >
                {step.n}
              </div>
              <div>
                <div className={`mb-2 text-lg font-semibold ${image ? "text-white" : "text-navy"}`}>
                  {step.t}
                </div>
                <p className={`m-0 text-[15px] leading-relaxed ${image ? "text-[#C9D3E6]" : "text-muted"}`}>
                  {step.d}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
