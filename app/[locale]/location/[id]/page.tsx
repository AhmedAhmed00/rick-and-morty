import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Globe, Users } from "lucide-react";
import { CharacterGrid } from "@/components/character/character-grid";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { LocationsSection } from "@/components/location/locations-section";
import { getLocation } from "@/lib/api";
import { locationQuery } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client";
import { parseId } from "@/lib/parse-id";
import { localeAlternates } from "@/lib/site";

export async function generateMetadata(
  props: PageProps<"/[locale]/location/[id]">,
): Promise<Metadata> {
  const { id, locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "location" });

  const parsed = parseId(id);
  const location = parsed ? await getLocation(parsed) : null;
  if (!location) return { title: t("notFound") };

  return {
    title: `${location.name} — ${location.dimension || t("dimension")}`,
    description: t("residentCount", { count: location.residents.length }),
    alternates: localeAlternates(locale, `/location/${parsed}`),
  };
}

export default async function LocationPage(
  props: PageProps<"/[locale]/location/[id]">,
) {
  const { id } = await props.params;
  const parsed = parseId(id);
  if (!parsed) notFound();

  const t = await getTranslations("location");

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(locationQuery(parsed));

  const location = queryClient.getQueryData(locationQuery(parsed).queryKey);
  if (!location) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className="space-y-section py-10">
        <header className="space-y-5">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"
            >
              <Globe size={24} />
            </span>
            <h1 className="text-3xl font-bold md:text-4xl">{location.name}</h1>
          </div>

          <dl className="grid gap-grid sm:grid-cols-3">
            {[
              { label: t("type"), value: location.type || "unknown" },
              { label: t("dimension"), value: location.dimension || "unknown" },
              { label: t("residents"), value: String(location.residents.length) },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-card border border-border bg-card p-card"
              >
                <dt className="text-xs text-muted-fg">{item.label}</dt>
                <dd className="mt-1 truncate font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        {location.residents.length > 0 && (
          <Section title={t("residents")} icon={<Users size={20} />}>
            <CharacterGrid characters={location.residents} />
          </Section>
        )}

        <Section title={t("more")} icon={<Globe size={20} />}>
          <LocationsSection />
        </Section>
      </Container>
    </HydrationBoundary>
  );
}
