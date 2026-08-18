import Image from "next/image";
import { Globe, MonitorPlay, Users } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CharacterGrid } from "@/components/character/character-grid";
import { EpisodeGrid } from "@/components/episode/episode-card";
import { LocationGrid } from "@/components/location/location-card";
import { GlobalSearch } from "@/components/search/global-search";
import { getCharacters, getEpisodes, getLocations } from "@/lib/api";
import highlight from "@/public/HighLightImage.png";

// Two full rows in the widest grid.
const PREVIEW_COUNT = 10;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tNav = await getTranslations("nav");

  // A static overview, so the previews are fetched directly rather than
  // through React Query.
  const [characters, episodes, locations] = await Promise.all([
    getCharacters({ page: 1 }),
    getEpisodes({ page: 1 }),
    getLocations({ page: 1 }),
  ]);

  return (
    <>
      {/* Fills the viewport below the 4rem navbar. */}
      <Container className="grid min-h-[calc(100dvh-4rem)] items-center gap-8 pt-12 pb-0 md:grid-cols-2 md:pt-16 lg:gap-12">
        <div className="space-y-5 lg:space-y-6">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl xl:text-7xl">
            {t("titleLead")}{" "}
            <span className="text-primary-text">{t("titleHighlight")}</span>
          </h1>
          <p className="text-lg text-muted-fg lg:text-xl">{t("subtitle")}</p>
          <p className="text-sm text-primary-text lg:text-base">{t("tagline")}</p>
        </div>

        {/* Sits on the bottom edge of the hero from md up, as in the design. */}
        <Image
          src={highlight}
          alt={t("imageAlt")}
          sizes="(min-width: 1280px) 36rem, (min-width: 1024px) 32rem, (min-width: 768px) 28rem, 80vw"
          loading="eager"
          className="h-auto w-full max-w-xs self-end justify-self-center sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
        />
      </Container>



      <Container className="space-y-section py-section">
                  <GlobalSearch />

        <Section
          title={tNav("characters")}
          icon={<Users size={20} />}
          seeAllHref="/characters"
          seeAllLabel={t("seeAll")}
        >
          <CharacterGrid characters={characters.items.slice(0, PREVIEW_COUNT)} />
        </Section>

        <Section
          title={tNav("episodes")}
          icon={<MonitorPlay size={20} />}
          seeAllHref="/episodes"
          seeAllLabel={t("seeAll")}
        >
          <EpisodeGrid episodes={episodes.items.slice(0, 5)} />
        </Section>

        <Section
          title={tNav("locations")}
          icon={<Globe size={20} />}
          seeAllHref="/locations"
          seeAllLabel={t("seeAll")}
        >
          <LocationGrid locations={locations.items.slice(0, 10)} />
        </Section>
      </Container>
    </>
  );
}
