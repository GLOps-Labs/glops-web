import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_MAX_AGE, LOCALE_COOKIE, isLocale, resolveLocale } from "@/lib/locale";
import type { SupportedLocale } from "@/config/site";

const EN_ROOT = "/en";
const BOT_PATTERN = "bot|crawl|spider|slurp|mediapartners|google|bing|duckduckgo|perplexity|gptbot|claudebot";
const BOT_REGEX = new RegExp(BOT_PATTERN, "i");

function isBot(userAgent: string | null): boolean {
  if (userAgent === null) return false;
  return BOT_REGEX.test(userAgent);
}

function isEnglishPath(pathname: string): boolean {
  return pathname === EN_ROOT || pathname.startsWith(`${EN_ROOT}/`);
}

function savedCookie(request: NextRequest): string | null {
  return request.cookies.get(LOCALE_COOKIE)?.value ?? null;
}

function toEnglishPath(pathname: string): string {
  if (pathname === "/") return EN_ROOT;
  return `${EN_ROOT}${pathname}`;
}

function withLocaleCookie(response: NextResponse, locale: SupportedLocale): NextResponse {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}

// Locale routing with clean URLs for humans:
// - /en* is explicit English (crawlers + shared links).
// - valid ?lang= becomes a cookie and a clean redirect (never indexed).
// - saved cookie wins silently, URL untouched.
// - first visit without cookie: Accept-Language decides; EN redirects to /en,
//   ES serves / directly. Crawlers always get the ES default + hreflang.
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (isEnglishPath(pathname)) {
    return withLocaleCookie(NextResponse.next(), "en");
  }
  const query = searchParams.get("lang");
  if (isLocale(query)) {
    const target = query === "en" ? toEnglishPath(pathname) : pathname;
    const redirect = NextResponse.redirect(new URL(target, request.url));
    return withLocaleCookie(redirect, query);
  }
  if (isLocale(savedCookie(request))) return NextResponse.next();
  if (isBot(request.headers.get("user-agent"))) return NextResponse.next();
  const detected = resolveLocale({
    query: null,
    cookie: null,
    browser: request.headers.get("accept-language"),
  });
  if (detected === "en") {
    const redirect = NextResponse.redirect(new URL(toEnglishPath(pathname), request.url));
    return withLocaleCookie(redirect, "en");
  }
  return withLocaleCookie(NextResponse.next(), "es");
}

export const config = {
  matcher: ["/", "/en", "/en/:path*", "/beta-tareas"],
};
