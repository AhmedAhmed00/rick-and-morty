"use client";

import { CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { Episode } from "@/types";

/** Compact episode rows, used on the character detail page. */
export function EpisodeList({ episodes }: { episodes: Episode[] }) {
  return (
    <ul className="grid gap-grid sm:grid-cols-2 lg:grid-cols-3">
      {episodes.map((episode) => (
        <li key={episode.id}>
          <Card interactive className="flex items-center gap-3 p-card">
            <span className="rounded-control bg-primary/10 px-2 py-1 font-mono text-xs text-primary-text">
              {episode.code}
            </span>
            <span className="min-w-0 flex-1">
              <Link
                href={`/episode/${episode.id}`}
                className="block truncate text-sm font-medium after:absolute after:inset-0"
              >
                {episode.name}
              </Link>
              <span className="flex items-center gap-1 text-xs text-muted-fg">
                <CalendarDays size={12} aria-hidden />
                {episode.airDate}
              </span>
            </span>
          </Card>
        </li>
      ))}
    </ul>
  );
}
