// Dark gradient overlay (left-to-right) guarantees text legibility over an
// arbitrary uploaded photo, per the PDD's hero background requirement.
// Shared by every section that can take a per-block photo (Hero and
// everything wired through ServiceSection/HowItWorks/Faq/Contact).
export function photoBackgroundStyle(url: string): string {
  return `linear-gradient(90deg, rgba(10,42,94,0.88) 0%, rgba(10,42,94,0.62) 55%, rgba(10,42,94,0.82) 100%), url('${url}')`;
}
