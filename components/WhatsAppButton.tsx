"use client";

import { useLocale, useTranslations } from "next-intl";
import { buildWhatsAppHref } from "@/lib/lead/whatsapp";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackWhatsAppClick(locale: string) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: "whatsapp_click", lang: locale });
}

export function WhatsAppButton() {
  const locale = useLocale();
  const t = useTranslations("whatsapp");
  const href = buildWhatsAppHref(t("greeting"));

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp"
      onClick={() => trackWhatsAppClick(locale)}
      className="fixed right-5 bottom-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-colors hover:bg-[#1FB855]"
    >
      <svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.5-5.6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.1-.2 0-.4.1-.5l.7-.8c.1-.2.1-.3 0-.5l-.7-1.7c-.1-.3-.3-.3-.5-.3h-.5c-.2 0-.5.1-.7.4-.3.3-.9 1-.9 2.3s1 2.7 1.1 2.9a9.6 9.6 0 0 0 3.9 3.4c1.6.6 2 .5 2.4.5.4 0 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1 0-.1-.1-.2-.2-.3Z" />
      </svg>
    </a>
  );
}
