import { locales, routing } from "@/i18n/routing";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

/** Open Graph wants a full territory code, not a bare language. */
const OG_LOCALES: Record<string, string> = { en: "en_US", ar: "ar_EG" };

export const ogLocale = (locale: string) => OG_LOCALES[locale] ?? locale;

/**
 * Canonical plus hreflang for one page, where `path` is the route below the
 * locale segment, e.g. "/characters/1". Declared per route because a canonical
 * set on the layout would be inherited by every page.
 */
export function localeAlternates(locale: string, path = "") {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
      "x-default": `/${routing.defaultLocale}${path}`,
    },
  };
}
