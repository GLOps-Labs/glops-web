import type { SupportedLocale } from "@/config/site";

export const LOCALE_COOKIE = "glops-locale";
export const COOKIE_MAX_AGE = 31536000;
const EN_PREFIX = "en";
const ES_PREFIX = "es";

export function isLocale(value: string | null): value is SupportedLocale {
  return value === "es" || value === "en";
}

function fromPrefix(value: string | null): SupportedLocale | null {
  if (value === null) return null;
  if (value.startsWith(EN_PREFIX)) return "en";
  if (value.startsWith(ES_PREFIX)) return "es";
  return null;
}

// Priority: explicit ?lang= override, saved cookie, browser language, ES default.
// Server-safe: pure function, no document/navigator (Node 22 exposes a global
// navigator with language "en-US", so browser sniffing must live behind
// request headers in proxy.ts, never in render paths).
export function resolveLocale({
  query,
  cookie,
  browser,
}: {
  query: string | null;
  cookie: string | null;
  browser: string | null;
}): SupportedLocale {
  if (isLocale(query)) return query;
  if (isLocale(cookie)) return cookie;
  return fromPrefix(browser) ?? "es";
}

export function writeLocaleCookie(locale: SupportedLocale): void {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}
