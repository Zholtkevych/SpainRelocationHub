import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { isRequestFromSpain } from "@/lib/locale/geo";

const intlProxy = createMiddleware(routing);

const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * Next.js 16 renamed middleware.ts to proxy.ts (function export `proxy`,
 * Node runtime only — see node_modules/next/dist/docs/.../proxy.md).
 *
 * Locale resolution order (PDD 7.2 / SAD 9.2): stored cookie preference,
 * then geographic origin (Spain -> es), then browser Accept-Language,
 * then English fallback. Only the root path is ever redirected by
 * detection; a direct request to any /{locale} path is always honored
 * (next-intl's localePrefix:'always' guarantees this on its own).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasStoredPreference = request.cookies.has(LOCALE_COOKIE);

  if (pathname === "/" && !hasStoredPreference) {
    const fromSpain = isRequestFromSpain(request);
    if (fromSpain) {
      const url = new URL("/es", request.url);
      const response = NextResponse.redirect(url);
      response.cookies.set(LOCALE_COOKIE, "es", {
        sameSite: "lax",
        path: "/",
      });
      return response;
    }
  }

  return intlProxy(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
