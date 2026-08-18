import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { CharacterBrowser } from "@/components/character/character-browser";
import { CharacterGridSkeleton } from "@/components/character/character-grid";
import { Container } from "@/components/layout/container";
import { charactersQuery } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client";
import { loadCharacterParams, toCharacterFilters } from "@/lib/search-params";

export async function generateMetadata(
  props: PageProps<"/[locale]/characters">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return { title: tNav("characters"), description: t("charactersDescription") };
}

export default async function CharactersPage(
  props: PageProps<"/[locale]/characters">,
) {
  const filters = toCharacterFilters(await loadCharacterParams(props.searchParams));
  const t = await getTranslations("character");

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(charactersQuery(filters));

  return (
    <Container className="space-y-8 py-10 md:py-12">
      <h1 className="text-3xl font-bold md:text-4xl">{t("title")}</h1>

      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* useSearchParams needs a Suspense boundary or the prod build fails. */}
        <Suspense fallback={<CharacterGridSkeleton />}>
          <CharacterBrowser />
        </Suspense>
      </HydrationBoundary>
    </Container>
  );
}
