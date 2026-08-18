import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { EpisodeGridSkeleton } from "@/components/episode/episode-card";
import { EpisodesSection } from "@/components/episode/episodes-section";
import { episodesQuery } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client";
import { localeAlternates } from "@/lib/site";
import { readPage } from "@/lib/search-params";

export async function generateMetadata(
  props: PageProps<"/[locale]/episodes">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return {
    title: tNav("episodes"),
    description: t("episodesDescription"),
    alternates: localeAlternates(locale, "/episodes"),
  };
}

export default async function EpisodesPage(
  props: PageProps<"/[locale]/episodes">,
) {
  const page = readPage(await props.searchParams);
  const t = await getTranslations("episode");

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(episodesQuery({ page }));

  return (
    <Container className="space-y-8 py-10 md:py-12">
      <h1 className="text-3xl font-bold md:text-4xl">{t("title")}</h1>

      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* useSearchParams needs a Suspense boundary or the prod build fails. */}
        <Suspense fallback={<EpisodeGridSkeleton />}>
          <EpisodesSection />
        </Suspense>
      </HydrationBoundary>
    </Container>
  );
}
