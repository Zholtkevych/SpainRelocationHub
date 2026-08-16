import { getTranslations } from "next-intl/server";

type Step = { n: string; t: string; d: string };

export async function HowItWorks() {
  const t = await getTranslations("how");
  const steps = t.raw("steps") as Step[];

  return (
    <section id="how" className="bg-surface-alt px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2
          className="m-0 mb-3 max-w-lg font-heading font-normal text-navy"
          style={{ fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
        >
          {t("h2")}
        </h2>
        <p className="m-0 mb-12 max-w-2xl text-[17px] leading-relaxed text-muted">{t("lead")}</p>
        <ol
          className="grid gap-8"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
        >
          {steps.map((step) => (
            <li key={step.n} className="flex items-start gap-5">
              <div className="flex-none font-heading text-5xl leading-[0.9] text-gold-hover">
                {step.n}
              </div>
              <div>
                <div className="mb-2 text-lg font-semibold text-navy">{step.t}</div>
                <p className="m-0 text-[15px] leading-relaxed text-muted">{step.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
