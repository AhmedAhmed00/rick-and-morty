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
import { charactersQuery } from "@/services/queries";
import { characterQuery } from "@/services/graphql";
import { getQueryClient } from "@/lib/query-client";
import { parseId } from "@/utils/parse-id";
import { readPage } from "@/utils/search-params";
import { localeAlternates, ogLocale } from "@/utils/site";

export async function generateMetadata(
  props: PageProps<"/[locale]/characters/[id]">,
): Promise<Metadata> {
  const { id, locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "character" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  const parsed = parseId(id);
  // Same client the page body uses, so this fetch serves both.
  const character = parsed
    ? await getQueryClient().fetchQuery(characterQuery(parsed))
    : null;
  if (!character) return { title: t("notFound") };

  return {
    title: character.name,
    description: `${character.name} — ${character.status} ${character.species}. ${t("episodeCount", { count: character.episodes.length })}.`,
    alternates: localeAlternates(locale, `/characters/${parsed}`),
  
    openGraph: {
      type: "website",
      siteName: tMeta("homeTitle"),
      locale: ogLocale(locale),
      images: [{ url: character.image, alt: character.name }],
    },
  };
}

export default async function CharacterPage(
  props: PageProps<"/[locale]/characters/[id]">,
) {
  const { id } = await props.params;
  const parsed = parseId(id);
  if (!parsed) notFound();

  const t = await getTranslations("character");
  const tEpisode = await getTranslations("episode");

  const page = readPage(await props.searchParams);
  const queryClient = getQueryClient();

  // In parallel, and awaited rather than streamed: notFound() must run before
  // the response commits or a missing character still returns HTTP 200.
  await Promise.all([
    queryClient.prefetchQuery(characterQuery(parsed)),
    queryClient.prefetchQuery(charactersQuery({ page })),
  ]);

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
