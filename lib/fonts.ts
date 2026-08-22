import { Onest, Source_Serif_4 } from "next/font/google";

// Shared between app/[locale]/layout.tsx and app/admin/layout.tsx — two
// separate <html>-owning root layouts (see comment in app/admin/layout.tsx
// for why there are two), but one font instance each so we're not loading
// duplicate subsets.
export const onest = Onest({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-onest",
  display: "swap",
});

export const sourceSerif4 = Source_Serif_4({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-source-serif",
  display: "swap",
});
