import type { Metadata } from "next";
import {
  Cairo,
  Inter,
  JetBrains_Mono,
  Noto_Sans_Arabic,
  Space_Grotesk,
} from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { BackToTop } from "@/components/layout/back-to-top";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { isRtl, locales, routing } from "@/i18n/routing";
import { ogLocale, siteUrl } from "@/utils/site";
import { Providers } from "../providers";
import "../globals.css";

// Body faces, one per script.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
});

// Display faces for headings, again one per script.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["600", "700"],
  variable: "--font-cairo",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: LayoutProps<"/[locale]">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    // Every relative URL below — and in each page's alternates — resolves against this.
    metadataBase: new URL(siteUrl),
    title: { default: t("homeTitle"), template: `%s · ${t("homeTitle")}` },
    description: t("homeDescription"),
    // Inherited by every route, which is what puts a share image on pages that
    // don't define one. Title and description are deliberately omitted: metadata
    // is inherited, so setting them here would stamp the home page's title onto
    // every card. Left absent, each route's own title and description fill in.
    openGraph: {
      type: "website",
      siteName: t("homeTitle"),
      locale: ogLocale(locale),
      alternateLocale: locales.filter((l) => l !== locale).map(ogLocale),
    },
    twitter: { card: "summary_large_image" },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Required for the statically rendered locales above.
  setRequestLocale(locale);

  const t = await getTranslations("nav");

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${inter.variable} ${notoArabic.variable} ${spaceGrotesk.variable} ${cairo.variable} ${jetbrainsMono.variable} antialiased`}
      /* next-themes sets data-theme on this element before paint */
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <Providers>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 
              focus:rounded-control focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
            >
              {t("skipToContent")}
            </a>
            <Navbar />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
            <BackToTop />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
