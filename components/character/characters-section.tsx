"use client";

import { CharacterGrid, CharacterGridSkeleton } from "./character-grid";
import { PagedSection } from "@/components/ui/paged-section";
import { charactersQuery } from "@/lib/queries";

/** Paginated character list, used for the "more characters" sections. */
export function CharactersSection() {
  return (
    <PagedSection
      makeQuery={(page) => charactersQuery({ page })}
      skeleton={<CharacterGridSkeleton />}
    >
      {(characters) => <CharacterGrid characters={characters} />}
    </PagedSection>
  );
}
