import { CharacterGridSkeleton } from "@/components/character/character-grid";
import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="space-y-8 py-10 md:py-12">
      <Skeleton className="h-9 w-48" />
      <CharacterGridSkeleton />
    </Container>
  );
}
