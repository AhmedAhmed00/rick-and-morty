"use client";

import { LocationGrid, LocationGridSkeleton } from "./location-card";
import { PagedSection } from "@/components/ui/paged-section";
import { locationsQuery } from "@/lib/queries";

export function LocationsSection() {
  return (
    <PagedSection
      makeQuery={(page) => locationsQuery({ page })}
      skeleton={<LocationGridSkeleton count={20} />}
    >
      {(locations) => <LocationGrid locations={locations} />}
    </PagedSection>
  );
}
