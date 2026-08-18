import { Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import type { Location } from "@/types";

// Capped at 5 columns: a page holds 20 items, so every row fills exactly.
const GRID =
  "grid gap-grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

export function LocationCard({ location }: { location: Location }) {
  return (
    <Card
      interactive
      className="flex flex-col items-center justify-center p-card py-8 text-center"
    >
      <Globe size={28} aria-hidden className="text-primary" />
      <p className="mt-3 text-base font-medium">
        <Link href={`/location/${location.id}`} className="after:absolute after:inset-0">
          {location.type || "unknown"}
        </Link>
      </p>
      <p className="mt-1 w-full truncate text-sm text-primary-text">
        {location.name}
      </p>
    </Card>
  );
}

export function LocationGrid({ locations }: { locations: Location[] }) {
  return (
    <div className={GRID}>
      {locations.map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  );
}

export function LocationGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className={GRID} aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-card border border-border bg-card p-card py-8"
        >
          <Skeleton className="mx-auto size-7 rounded-full" />
          <Skeleton className="mx-auto h-5 w-2/3" />
          <Skeleton className="mx-auto h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
