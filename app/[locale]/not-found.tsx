import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/locale/config";

// Not part of the PDD's eleven sections — a minimal, non-critical utility
// page, so a small inline dictionary is enough rather than extending
// messages/*.json for two strings.
const COPY: Record<Locale, { title: string; body: string; cta: string }> = {
  en: { title: "Page not found", body: "That page doesn't exist. Head back to the homepage.", cta: "Back to homepage" },
  es: { title: "Página no encontrada", body: "Esa página no existe. Vuelve a la página principal.", cta: "Volver al inicio" },
  uk: { title: "Сторінку не знайдено", body: "Такої сторінки не існує. Поверніться на головну.", cta: "На головну" },
  ru: { title: "Страница не найдена", body: "Такой страницы не существует. Вернитесь на главную.", cta: "На главную" },
};

export default async function LocaleNotFound() {
  const locale = (await getLocale()) as Locale;
  const copy = COPY[locale] ?? COPY.en;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start gap-4 px-6 py-32">
      <h1 className="font-heading text-4xl text-navy">{copy.title}</h1>
      <p className="text-muted">{copy.body}</p>
      <Link
        href="/"
        className="inline-flex min-h-12 items-center rounded-lg bg-gold px-6 font-semibold text-navy hover:bg-gold-hover"
      >
        {copy.cta}
      </Link>
    </div>
  );
}
