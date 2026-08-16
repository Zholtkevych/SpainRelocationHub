"use client";

import { useLocale } from "next-intl";
import { buildWhatsAppHref } from "@/lib/lead/whatsapp";
import { trackWhatsAppClick } from "@/components/WhatsAppButton";

export function WhatsAppHeroLink({ greeting }: { greeting: string }) {
  const locale = useLocale();
  const href = buildWhatsAppHref(greeting);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      onClick={() => trackWhatsAppClick(locale)}
      className="inline-flex min-h-12 items-center gap-2.5 rounded-lg border-[1.5px] border-[#6C82AB] px-6.5 text-base font-medium text-white hover:border-white"
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.5-5.6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.1-.2 0-.4.1-.5l.7-.8c.1-.2.1-.3 0-.5l-.7-1.7c-.1-.3-.3-.3-.5-.3h-.5c-.2 0-.5.1-.7.4-.3.3-.9 1-.9 2.3s1 2.7 1.1 2.9a9.6 9.6 0 0 0 3.9 3.4c1.6.6 2 .5 2.4.5.4 0 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1 0-.1-.1-.2-.2-.3Z" />
      </svg>
      WhatsApp
    </a>
  );
}
