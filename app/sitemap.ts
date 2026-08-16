import type { MetadataRoute } from "next";
import { locales } from "@/lib/locale/config";
import { siteConfig } from "@/lib/site-config";

const PATHS = ["", "/privacy", "/cookies", "/legal"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteConfig.siteUrl}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteConfig.siteUrl}/${l}${path}`]),
        ),
      },
      ...(path === "" ? { priority: 1 } : {}),
    })),
  );
}
