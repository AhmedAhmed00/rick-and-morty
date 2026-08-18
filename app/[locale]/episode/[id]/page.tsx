import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CalendarDays, MonitorPlay, Users } from "lucide-react";
import { CharacterGrid } from "@/components/character/character-grid";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { EpisodesSection } from "@/components/episode/episodes-section";
import { getEpisode } from "@/lib/graphql";
import { episodeQuery } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client";
import { parseId } from "@/lib/parse-id";
import { localeAlternates } from "@/lib/site";

export async function generateMetadata(
  props: PageProps<"/[locale]/episode/[id]">,
): Promise<Metadata> {
  const { id, locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "episode" });

  const parsed = parseId(id);
  const episode = parsed ? await getEpisode(parsed) : null;
  if (!episode) return { title: t("notFound") };

  return {
    title: `${episode.code} — ${episode.name}`,
    description: t("characterCount", { count: episode.characters.length }),
    alternates: localeAlternates(locale, `/episode/${parsed}`),
  };
}

export default async function EpisodePage(
  props: PageProps<"/[locale]/episode/[id]">,
) {
  const { id } = await props.params;
  const parsed = parseId(id);
  if (!parsed) notFound();

  const t = await getTranslations("episode");
  const tCharacter = await getTranslations("character");

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(episodeQuery(parsed));

  const episode = queryClient.getQueryData(episodeQuery(parsed).queryKey);
  if (!episode) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className="space-y-section py-10">
        <header className="space-y-4">
          <MonitorPlay size={28} aria-hidden className="text-primary" />
          <h1 className="text-3xl font-bold md:text-4xl">{episode.name}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-fg">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={16} aria-hidden />
              {episode.airDate}
            </span>
            <span className="rounded-control bg-primary/10 px-2 py-1 font-mono text-xs text-primary-text">
              {episode.code}
            </span>
          </div>

          <p className="text-sm text-muted-fg">
            {t("characterCount", { count: episode.characters.length })}
          </p>
        </header>

        {episode.characters.length > 0 && (
          <Section title={tCharacter("title")} icon={<Users size={20} />}>
            <CharacterGrid characters={episode.characters} />
          </Section>
        )}

        <Section title={t("more")} icon={<MonitorPlay size={20} />}>
          <EpisodesSection />
        </Section>
      </Container>
    </HydrationBoundary>
  );
}
