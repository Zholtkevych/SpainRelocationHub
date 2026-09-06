"use client";

import { useEffect } from "react";
import { readConsent, CONSENT_CHANGED_EVENT, type ConsentValue } from "@/lib/analytics/consent";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

let gtagScriptInjected = false;

function injectGtagScript(id: string) {
  if (gtagScriptInjected) return;
  gtagScriptInjected = true;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
}

/**
 * Consent-gated GA4 loader (PRD FR-12.2: no non-essential script executes
 * before consent). Reads the existing consent cookie on mount and also
 * reacts live to CookieConsentBanner's accept click via a custom event, so
 * clicking "Accept" loads GA4 immediately without a page reload. Renders
 * nothing (and loads nothing) if NEXT_PUBLIC_GA_MEASUREMENT_ID isn't set —
 * analytics is optional, not a hard requirement for the site to run.
 */
export function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    function applyConsent(value: ConsentValue | null) {
      if (value === "accepted") injectGtagScript(GA_MEASUREMENT_ID as string);
    }

    applyConsent(readConsent());

    function onConsentChanged(event: Event) {
      applyConsent((event as CustomEvent<ConsentValue>).detail);
    }

    window.addEventListener(CONSENT_CHANGED_EVENT, onConsentChanged);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onConsentChanged);
  }, []);

  return null;
}
