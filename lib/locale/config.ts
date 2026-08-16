export const locales = ["en", "uk", "ru", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// Display order/labels for the language switcher, matching the prototype's LANGS array.
export const localeMeta: Record<Locale, { short: string; label: string }> = {
  es: { short: "ES", label: "Español" },
  en: { short: "EN", label: "English" },
  uk: { short: "УК", label: "Українська" },
  ru: { short: "РУ", label: "Русский" },
};

export const localeOrder: Locale[] = ["es", "en", "uk", "ru"];
