import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "@/lib/locale/config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  // Root path never serves content directly; direct requests to any locale
  // path must always be honored regardless of detection (PDD 7.2 / PRD FR-02).
  localeDetection: true,
});
