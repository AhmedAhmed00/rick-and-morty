import { Container } from "@/components/layout/container";
import { LocationGridSkeleton } from "@/components/location/location-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="space-y-8 py-10 md:py-12">
      <Skeleton className="h-9 w-48" />
      <LocationGridSkeleton count={20} />
    </Container>
  );
}
