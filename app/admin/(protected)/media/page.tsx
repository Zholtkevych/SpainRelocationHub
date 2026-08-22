import { getSetting } from "@/lib/settings/store";
import { SECTION_KEYS, SECTION_LABELS, sectionImageSettingKey } from "@/lib/settings/keys";
import { SectionImageCard } from "./SectionImageCard";

export const dynamic = "force-dynamic";

export default function AdminMediaPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl text-navy">Media</h1>
      <p className="mt-1 text-sm text-muted">
        Set a background photo per section. Any section without one falls back to its normal look — solid navy
        for the hero, plain white/light backgrounds for the rest — so nothing needs a photo unless you set one.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {SECTION_KEYS.map((section) => (
          <SectionImageCard
            key={section}
            section={section}
            label={SECTION_LABELS[section]}
            imageUrl={getSetting(sectionImageSettingKey(section))}
          />
        ))}
      </div>
    </div>
  );
}
