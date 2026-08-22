import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale } from "@/lib/locale/config";
import { getContent } from "@/lib/content/store";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && isLocale(requested) ? requested : defaultLocale;

  return {
    locale,
    // DB-backed (seeded from messages/*.json) so admin content edits publish
    // without a rebuild — see lib/content/store.ts.
    messages: await getContent(locale),
  };
});
