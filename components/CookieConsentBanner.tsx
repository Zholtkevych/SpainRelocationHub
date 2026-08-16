"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const CONSENT_COOKIE = "srh_cookie_consent";

function readConsent(): "accepted" | "rejected" | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`${CONSENT_COOKIE}=([^;]+)`));
  return (match?.[1] as "accepted" | "rejected" | undefined) ?? null;
}

function writeConsent(value: "accepted" | "rejected") {
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=31536000; samesite=lax`;
}

export function CookieConsentBanner() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Must run post-mount, not as a lazy initializer: the server has no
    // cookie jar, so the first client render has to match the server's
    // "hidden" output exactly before this reveals the real client state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(readConsent() === null);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-surface px-6 py-5 shadow-[0_-2px_12px_rgba(10,42,94,0.1)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6">
        <p className="m-0 max-w-2xl text-sm leading-relaxed text-ink">{t("text")}</p>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => {
              writeConsent("accepted");
              setVisible(false);
            }}
            className="min-h-11 rounded-lg bg-gold px-5.5 text-sm font-semibold text-navy hover:bg-gold-hover"
          >
            {t("accept")}
          </button>
          <button
            onClick={() => {
              writeConsent("rejected");
              setVisible(false);
            }}
            className="min-h-11 rounded-lg border-[1.5px] border-border-input px-5 text-sm font-medium text-ink hover:border-navy hover:text-navy"
          >
            {t("reject")}
          </button>
        </div>
      </div>
    </div>
  );
}
