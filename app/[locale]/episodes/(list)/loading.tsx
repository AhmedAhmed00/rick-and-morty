import { Container } from "@/components/layout/container";
import { EpisodeGridSkeleton } from "@/components/episode/episode-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="space-y-8 py-10 md:py-12">
      <Skeleton className="h-9 w-48" />
      <EpisodeGridSkeleton />
    </Container>
  );
}
