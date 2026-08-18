"use client";

import { EpisodeGrid, EpisodeGridSkeleton } from "./episode-card";
import { PagedSection } from "@/components/ui/paged-section";
import { episodesQuery } from "@/lib/queries";

export function EpisodesSection() {
  return (
    <PagedSection
      makeQuery={(page) => episodesQuery({ page })}
      skeleton={<EpisodeGridSkeleton />}
    >
      {(episodes) => <EpisodeGrid episodes={episodes} />}
    </PagedSection>
  );
}
