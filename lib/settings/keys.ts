// Kept separate from the "use server" actions module — a "use server" file
// may only export async functions, not plain constants.

// Matches the SAD's page section registry / PDD 5.1 section map exactly —
// every block that can carry its own background photo.
export const SECTION_KEYS = [
  "hero",
  "property",
  "residency",
  "vehicles",
  "business",
  "insurance",
  "adaptation",
  "why",
  "how",
  "faq",
  "contact",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Hero",
  property: "Property",
  residency: "Residency",
  vehicles: "Vehicles",
  business: "Business",
  insurance: "Insurance",
  adaptation: "Adaptation",
  why: "Why Choose Us",
  how: "How We Work",
  faq: "FAQ",
  contact: "Contact",
};

export function sectionImageSettingKey(section: SectionKey): string {
  return `section_image:${section}`;
}
