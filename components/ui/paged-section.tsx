"use client";

import classNames from "classnames";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryKey, UseQueryOptions } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Pagination } from "./pagination";
import { EmptyState, ErrorState } from "./states";
import { usePageHref, usePageParam } from "@/hooks/use-page-href";
import type { Page } from "@/lib/types";

// K is a parameter because queryFn is contravariant in the key type.
interface Props<T, K extends QueryKey> {
  /** Query definition for a given page, taken from lib/queries.ts. */
  makeQuery: (page: number) => UseQueryOptions<Page<T>, Error, Page<T>, K>;
  children: (items: T[]) => ReactNode;
  skeleton: ReactNode;
}

/**
 * Paginated list with the page held in the URL. Shared by the character,
 * episode and location sections so the states are defined once.
 */
export function PagedSection<T, K extends QueryKey>({
  makeQuery,
  children,
  skeleton,
}: Props<T, K>) {
  const page = usePageParam();
  const hrefFor = usePageHref();
  const queryClient = useQueryClient();
  const query = useQuery(makeQuery(page));

  if (query.isPending) return <>{skeleton}</>;
  if (query.isError) return <ErrorState onRetry={() => query.refetch()} />;
  if (query.data.items.length === 0) return <EmptyState />;

  return (
    <div className="space-y-6">
      <div
        className={classNames(
          "transition-opacity",
          query.isPlaceholderData && "opacity-60",
        )}
        aria-busy={query.isPlaceholderData}
      >
        {children(query.data.items)}
      </div>

      <Pagination
        page={page}
        pages={query.data.pages}
        hrefFor={hrefFor}
        onPrefetch={(next) => queryClient.prefetchQuery(makeQuery(next))}
      />
    </div>
  );
}
