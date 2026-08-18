import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { LocationGridSkeleton } from "@/components/location/location-card";
import { LocationsSection } from "@/components/location/locations-section";
import { locationsQuery } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client";
import { localeAlternates } from "@/lib/site";
import { readPage } from "@/lib/search-params";

export async function generateMetadata(
  props: PageProps<"/[locale]/locations">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return {
    title: tNav("locations"),
    description: t("locationsDescription"),
    alternates: localeAlternates(locale, "/locations"),
  };
}

export default async function LocationsPage(
  props: PageProps<"/[locale]/locations">,
) {
  const page = readPage(await props.searchParams);
  const t = await getTranslations("location");

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(locationsQuery({ page }));

  return (
    <Container className="space-y-8 py-10 md:py-12">
      <h1 className="text-3xl font-bold md:text-4xl">{t("title")}</h1>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<LocationGridSkeleton count={20} />}>
          <LocationsSection />
        </Suspense>
      </HydrationBoundary>
    </Container>
  );
}
