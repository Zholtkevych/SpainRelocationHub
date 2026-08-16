"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { localeOrder, localeMeta } from "@/lib/locale/config";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const activeLocale = useLocale();
  const pathname = usePathname();

  return (
    <div className={`flex items-center gap-1 ${className}`} role="group" aria-label="Language">
      {localeOrder.map((code) => {
        const { short, label } = localeMeta[code];
        const isActive = code === activeLocale;
        return (
          <Link
            key={code}
            href={pathname}
            locale={code}
            aria-current={isActive ? "true" : undefined}
            aria-label={label}
            className={`rounded px-2 py-1 text-[13px] font-medium transition-colors ${
              isActive ? "bg-navy text-white" : "text-muted hover:text-navy"
            }`}
          >
            {short}
          </Link>
        );
      })}
    </div>
  );
}
