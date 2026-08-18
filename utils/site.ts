import { locales, routing } from "@/i18n/routing";

/**
 * Crawlers and share-card scrapers resolve nothing relative, so metadata needs an
 * absolute origin. Vercel exposes the production host at build time; the explicit
 * variable wins so a custom domain can override it.
 */
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
 * Canonical plus the hreflang set for one page. Declared per route rather than on
 * the layout: metadata is inherited, so a canonical set once at the top would make
 * every page in the app claim to be the home page.
 *
 * `path` is the route below the locale segment, e.g. "/character/1".
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
