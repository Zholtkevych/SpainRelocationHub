"use client";

import { useLocale } from "next-intl";
import { buildWhatsAppHref } from "@/lib/lead/whatsapp";
import { trackWhatsAppClick } from "@/components/WhatsAppButton";
import { siteConfig } from "@/lib/site-config";

export function WhatsAppContactLink({ greeting }: { greeting: string }) {
  const locale = useLocale();
  const href = buildWhatsAppHref(greeting);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      onClick={() => trackWhatsAppClick(locale)}
      className="flex items-center justify-between gap-4 bg-surface px-5.5 py-4.5 text-ink hover:bg-[#FAFBFC] hover:text-navy"
    >
      <span className="text-[13px] text-[#8A8F9A]">WhatsApp</span>
      <span className="text-base font-medium text-navy">{siteConfig.phone}</span>
    </a>
  );
}
