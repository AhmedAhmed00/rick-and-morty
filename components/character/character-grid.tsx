import { CharacterCard } from "./character-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Character } from "@/types";

const GRID =
  "grid gap-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5";

/** Rows above this index load lazily. */
const EAGER_COUNT = 4;

export function CharacterGrid({ characters }: { characters: Character[] }) {
  return (
    <div className={GRID}>
      {characters.map((character, index) => (
        <CharacterCard
          key={character.id}
          character={character}
          eager={index < EAGER_COUNT}
        />
      ))}
    </div>
  );
}

export function CharacterGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={GRID} aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-card border border-border bg-card"
        >
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="space-y-2 p-card">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
