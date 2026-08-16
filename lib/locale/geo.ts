import type { NextRequest } from "next/server";

/**
 * Best-effort "is this visitor in Spain" check, sourced from platform-injected
 * geo headers (Vercel, Cloudflare). Returns null when no such header is present
 * (e.g. self-hosted) so the caller can fall through to Accept-Language detection
 * instead of erroring. Isolated here so a real GeoIP lookup can replace it later
 * without touching the proxy/middleware composition.
 */
export function isRequestFromSpain(request: NextRequest): boolean | null {
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry");

  if (!country) return null;
  return country.toUpperCase() === "ES";
}
