"use client";

import { CharacterGrid, CharacterGridSkeleton } from "./character-grid";
import { PagedSection } from "@/components/ui/paged-section";
import { charactersQuery } from "@/services/queries";

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
