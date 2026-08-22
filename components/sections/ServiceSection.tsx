import type { ReactNode } from "react";
import { SectionCta } from "@/components/sections/SectionCta";
import { Link } from "@/i18n/navigation";
import type { ServiceKey } from "@/lib/lead/constants";
import { getSetting } from "@/lib/settings/store";
import { sectionImageSettingKey, type SectionKey } from "@/lib/settings/keys";
import { photoBackgroundStyle } from "@/lib/media/background";

type Item = { t: string; d: string; n?: string };

const backgrounds = {
  white: { section: "bg-surface", heading: "text-navy", body: "text-muted", eyebrow: "text-gold-hover" },
  alt: { section: "bg-surface-alt", heading: "text-navy", body: "text-muted", eyebrow: "text-gold-hover" },
  navy: { section: "bg-navy", heading: "text-white", body: "text-[#C9D3E6]", eyebrow: "text-gold" },
  // Used automatically whenever a photo is set for this block, regardless
  // of the `background` prop passed in — a photo always wins visually.
  photo: {
    section: "bg-navy bg-cover bg-center",
    heading: "text-white",
    body: "text-[#C9D3E6]",
    eyebrow: "text-gold",
  },
} as const;

export function ServiceSection({
  id,
  background = "white",
  icon,
  eyebrow,
  heading,
  lead,
  items,
  itemStyle = "card",
  minItemWidth = 280,
  numbered = false,
  ruleColor = "navy",
  note,
  noteLinkHref,
  noteLinkLabel,
  cta,
  consultLabel,
}: {
  id: string;
  background?: keyof typeof backgrounds;
  icon?: ReactNode;
  eyebrow?: string;
  heading: string;
  lead?: string;
  items: Item[];
  itemStyle?: "card" | "rule";
  /** Matches the reference layout's per-section minmax() threshold in px. */
  minItemWidth?: number;
  numbered?: boolean;
  ruleColor?: "navy" | "gold";
  note?: string;
  noteLinkHref?: string;
  noteLinkLabel?: string;
  cta?: { label: string; service: ServiceKey; variant?: "solid" | "outline" } | null;
  consultLabel: string;
}) {
  // A photo, when set, always overrides the `background` prop — visually
  // it takes priority the same way it does for Hero.
  const image = getSetting(sectionImageSettingKey(id as SectionKey));
  const effectiveBackground = image ? "photo" : background;
  const isDarkSection = effectiveBackground === "navy" || effectiveBackground === "photo";

  const c = backgrounds[effectiveBackground];
  const ListTag = numbered ? "ol" : "ul";
  const itemBg =
    effectiveBackground === "navy"
      ? "bg-navy"
      : itemStyle === "card"
        ? "bg-surface"
        : "";
  const gridDivider =
    itemStyle === "card"
      ? effectiveBackground === "alt"
        ? "border border-border bg-border"
        : "border border-white/16 bg-white/16"
      : "";
  // Only meaningful for itemStyle "rule" (text sits directly on the section
  // background, no opaque card underneath it) — a "card" item's own fill
  // color (itemBg) decides its text color instead, checked separately below.
  const ruleBorder =
    ruleColor === "gold" ? "border-gold" : isDarkSection ? "border-white/30" : "border-navy";

  return (
    <section
      id={id}
      className={`${c.section} px-6 py-24`}
      style={image ? { backgroundImage: photoBackgroundStyle(image) } : undefined}
    >
      <div className="mx-auto max-w-6xl">
        {lead ? (
          <div className="mb-12 grid grid-cols-1 items-start gap-12 sm:grid-cols-2">
            <div>
              <SectionHead icon={icon} eyebrow={eyebrow} eyebrowClass={c.eyebrow} dark={isDarkSection} />
              <h2
                className={`m-0 font-heading font-normal ${c.heading}`}
                style={{ fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
              >
                {heading}
              </h2>
            </div>
            <p className={`m-0 text-[17px] leading-relaxed ${c.body}`}>{lead}</p>
          </div>
        ) : (
          <div className="mb-10">
            <SectionHead icon={icon} eyebrow={eyebrow} eyebrowClass={c.eyebrow} dark={isDarkSection} />
            <h2
              className={`m-0 max-w-lg font-heading font-normal ${c.heading}`}
              style={{ fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
            >
              {heading}
            </h2>
          </div>
        )}

        <ListTag
          className={`mb-10 ${itemStyle === "card" ? `gap-px ${gridDivider}` : "gap-5"}`}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`,
          }}
        >
          {items.map((item) => {
            // A "card" item's own fill color decides its text color (it's
            // an opaque box, legible regardless of what's behind it); a
            // "rule" item has no fill, so it inherits the section's own
            // light/dark verdict instead.
            const itemIsDark = itemStyle === "card" ? itemBg === "bg-navy" : isDarkSection;

            return (
              <li
                key={item.t}
                className={itemStyle === "card" ? `${itemBg} p-8` : `border-t-2 pt-4.5 ${ruleBorder}`}
              >
                {numbered && item.n ? (
                  <div className="mb-4 font-heading text-3xl leading-none text-gold">{item.n}</div>
                ) : null}
                <div
                  className={`mb-2.5 font-semibold ${itemStyle === "card" ? "text-[21px]" : "text-[17px]"} ${
                    itemIsDark ? "text-white" : "text-navy"
                  }`}
                >
                  {item.t}
                </div>
                <p
                  className={`m-0 text-[15px] leading-relaxed ${
                    itemIsDark ? "text-[#C9D3E6]" : "text-muted"
                  }`}
                >
                  {item.d}
                </p>
              </li>
            );
          })}
        </ListTag>

        {note ? (
          <div className="mb-10 border-l-[3px] border-gold bg-surface px-6.5 py-5.5 text-[15px] leading-relaxed text-ink">
            {note}{" "}
            {noteLinkHref && noteLinkLabel ? (
              <Link href={noteLinkHref} className="border-b border-gold text-gold-hover">
                {noteLinkLabel} →
              </Link>
            ) : null}
          </div>
        ) : null}

        {cta ? (
          <SectionCta
            label={consultLabel ?? cta.label}
            service={cta.service}
            variant={cta.variant === "outline" ? "outline" : "solid"}
          />
        ) : null}
      </div>
    </section>
  );
}

function SectionHead({
  icon,
  eyebrow,
  eyebrowClass,
  dark,
}: {
  icon?: ReactNode;
  eyebrow?: string;
  eyebrowClass: string;
  dark: boolean;
}) {
  if (!icon && !eyebrow) return null;
  return (
    <div className="mb-5 flex items-center gap-3.5">
      {icon ? <span className={dark ? "text-white" : "text-navy"}>{icon}</span> : null}
      {eyebrow ? (
        <div className={`text-[11px] font-medium tracking-widest uppercase ${eyebrowClass}`}>
          {eyebrow}
        </div>
      ) : null}
    </div>
  );
}
