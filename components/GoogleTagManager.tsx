"use client";

import { useEffect, useState } from "react";
import { readConsent, CONSENT_CHANGED_EVENT, type ConsentValue } from "@/lib/analytics/consent";

// window.dataLayer is declared globally in WhatsAppButton.tsx.

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

let gtmScriptInjected = false;

function injectGtmScript(id: string) {
  if (gtmScriptInjected) return;
  gtmScriptInjected = true;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  document.head.appendChild(script);
}

/**
 * Consent-gated GTM loader (PRD FR-12.2: no non-essential script executes
 * before consent). Reads the existing consent cookie on mount and also
 * reacts live to CookieConsentBanner's accept click via a custom event, so
 * clicking "Accept" loads GTM immediately without a page reload. Renders
 * nothing (and loads nothing) if NEXT_PUBLIC_GTM_ID isn't set — analytics
 * is optional, not a hard requirement for the site to run.
 */
export function GoogleTagManager() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    if (!GTM_ID) return;

    function applyConsent(value: ConsentValue | null) {
      if (value !== "accepted") return;
      injectGtmScript(GTM_ID as string);
      setConsented(true);
    }

    applyConsent(readConsent());

    function onConsentChanged(event: Event) {
      applyConsent((event as CustomEvent<ConsentValue>).detail);
    }

    window.addEventListener(CONSENT_CHANGED_EVENT, onConsentChanged);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onConsentChanged);
  }, []);

  if (!GTM_ID || !consented) return null;

  // The noscript pixel is itself a tracking request — gated on the same
  // consent state as the script, not rendered unconditionally.
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
