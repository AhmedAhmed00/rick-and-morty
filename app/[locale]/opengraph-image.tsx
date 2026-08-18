import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { locales } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Multiverse Explorer";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}


export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "#1a1a1a",
          backgroundImage:
            "radial-gradient(circle at 80% 15%, #11b0c855 0%, transparent 45%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 30,
            color: "#bdfe42",
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#bdfe42",
            }}
          />
          Rick and Morty
        </div>

        <div
          style={{
            marginTop: 26,
            fontSize: 96,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.05,
          }}
        >
          Multiverse Explorer
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 36,
            color: "#a1a1a6",
            maxWidth: 900,
            lineHeight: 1.35,
          }}
        >
          {locale === "en"
            ? t("homeDescription")
            : "Characters, episodes and locations across the multiverse."}
        </div>

        <div
          style={{
            marginTop: 44,
            display: "flex",
            gap: 14,
            fontSize: 27,
            color: "#11b0c8",
          }}
        >
          Characters · Episodes · Locations
        </div>
      </div>
    ),
    size,
  );
}
