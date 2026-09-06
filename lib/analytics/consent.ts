// Shared between CookieConsentBanner.tsx (writes) and GoogleAnalytics.tsx
// (reads, and reacts live via the custom event below) — kept in one place
// so both agree on the cookie name and value shape.

export const CONSENT_COOKIE = "srh_cookie_consent";
export const CONSENT_CHANGED_EVENT = "srh:consent-changed";

export type ConsentValue = "accepted" | "rejected";

export function readConsent(): ConsentValue | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`${CONSENT_COOKIE}=([^;]+)`));
  return (match?.[1] as ConsentValue | undefined) ?? null;
}

export function writeConsent(value: ConsentValue) {
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=31536000; samesite=lax`;
  // Lets an already-mounted GoogleAnalytics component react immediately
  // (e.g. load gtag.js the instant "Accept" is clicked) instead of only
  // ever checking consent once on mount.
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: value }));
}
