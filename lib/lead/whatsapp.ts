import { siteConfig } from "@/lib/site-config";

export function buildWhatsAppHref(
  greeting: string,
  opts?: { serviceLabel?: string; service?: string },
) {
  const text =
    opts?.serviceLabel && opts?.service
      ? `${greeting}. ${opts.serviceLabel}: ${opts.service}`
      : greeting;

  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
