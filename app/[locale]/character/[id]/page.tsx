import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Users } from "lucide-react";
import { CharacterDetails } from "@/components/character/character-details";
import { CharactersSection } from "@/components/character/characters-section";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { EpisodeList } from "@/components/episode/episode-list";
import { getCharacter } from "@/services/graphql";
import { characterQuery } from "@/services/queries";
import { getQueryClient } from "@/services/query-client";
import { parseId } from "@/utils/parse-id";
import { localeAlternates, ogLocale } from "@/utils/site";

export async function generateMetadata(
  props: PageProps<"/[locale]/character/[id]">,
): Promise<Metadata> {
  const { id, locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "character" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  const parsed = parseId(id);
  const character = parsed ? await getCharacter(parsed) : null;
  if (!character) return { title: t("notFound") };

  return {
    title: character.name,
    description: `${character.name} — ${character.status} ${character.species}. ${t("episodeCount", { count: character.episodes.length })}.`,
    alternates: localeAlternates(locale, `/character/${parsed}`),
    // openGraph replaces the parent's rather than merging, so the site-wide
    // fields are repeated. "website" on purpose: under "profile" Next drops
    // og:site_name and og:locale entirely.
    openGraph: {
      type: "website",
      siteName: tMeta("homeTitle"),
      locale: ogLocale(locale),
      images: [{ url: character.image, alt: character.name }],
    },
  };
}

export default async function CharacterPage(
  props: PageProps<"/[locale]/character/[id]">,
) {
  const { id } = await props.params;
  const parsed = parseId(id);
  if (!parsed) notFound();

  const t = await getTranslations("character");
  const tEpisode = await getTranslations("episode");

  const queryClient = getQueryClient();
  // Awaited, not streamed: notFound() must run before the response commits or a
  // missing character still returns HTTP 200.
  await queryClient.prefetchQuery(characterQuery(parsed));

  const character = queryClient.getQueryData(characterQuery(parsed).queryKey);
  if (!character) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className="space-y-section py-10">
        <CharacterDetails character={character} />

        {character.episodes.length > 0 && (
          <Section title={tEpisode("title")}>
            <EpisodeList episodes={character.episodes} />
          </Section>
        )}

        <Section title={t("more")} icon={<Users size={20} />}>
          <CharactersSection />
        </Section>
      </Container>
    </HydrationBoundary>
  );
}
