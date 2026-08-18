import { MonitorPlay } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import type { Episode } from "@/lib/types";

const GRID =
  "grid gap-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";

export function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <Card interactive className="p-card py-5">
      <p className="flex items-center gap-2 text-base font-medium">
        <MonitorPlay size={18} aria-hidden className="shrink-0 text-primary" />
        {/* min-w-0 lets the flex child shrink so `truncate` takes effect. */}
        <Link
          href={`/episode/${episode.id}`}
          className="block min-w-0 flex-1 truncate after:absolute after:inset-0"
        >
          {episode.name}
        </Link>
      </p>
      <p className="mt-2 font-mono text-sm text-muted-fg">{episode.code}</p>
    </Card>
  );
}

export function EpisodeGrid({ episodes }: { episodes: Episode[] }) {
  return (
    <div className={GRID}>
      {episodes.map((episode) => (
        <EpisodeCard key={episode.id} episode={episode} />
      ))}
    </div>
  );
}

export function EpisodeGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className={GRID} aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="space-y-2 rounded-card border border-border bg-card p-card py-5"
        >
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}
