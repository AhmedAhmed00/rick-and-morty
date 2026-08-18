"use client";

import classNames from "classnames";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { CharacterGrid, CharacterGridSkeleton } from "./character-grid";
import { FilterBar, type FilterConfig } from "@/components/ui/filter-bar";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { usePageHref } from "@/hooks/use-page-href";
import { charactersQuery } from "@/lib/queries";
import { characterParams, toCharacterFilters } from "@/lib/search-params";
import { GENDERS, SPECIES, STATUSES } from "@/lib/types";

export function CharacterBrowser() {
  const t = useTranslations("character");
  const tFilters = useTranslations("filters");
  const tStatus = useTranslations("status");
  const tGender = useTranslations("gender");
  const tSpecies = useTranslations("species");
  const tSearch = useTranslations("search");

  const queryClient = useQueryClient();
  const hrefFor = usePageHref();

  // Same parsers the server page loads with, so both resolve the same key.
  const [params] = useQueryStates(characterParams);
  const filters = toCharacterFilters(params);
  const query = useQuery(charactersQuery(filters));

  const filterConfig: FilterConfig[] = [
    {
      name: "status",
      label: tFilters("status"),
      options: STATUSES.map((value) => ({ value, label: tStatus(value) })),
    },
    {
      name: "species",
      label: tFilters("species"),
      options: SPECIES.map((value) => ({ value, label: tSpecies(value) })),
    },
    {
      name: "gender",
      label: tFilters("gender"),
      options: GENDERS.map((value) => ({ value, label: tGender(value) })),
    },
  ];

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filterConfig}
        searchPlaceholder={tSearch("placeholder")}
      />

      <div>
        {query.isPending ? (
          <CharacterGridSkeleton />
        ) : query.isError ? (
          <ErrorState onRetry={() => query.refetch()} />
        ) : query.data.items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-fg">
              {t("count", { count: query.data.count })}
            </p>

            {/* Dimmed while the next page loads. */}
            <div
              className={classNames(
                "transition-opacity",
                query.isPlaceholderData && "opacity-60",
              )}
              aria-busy={query.isPlaceholderData}
            >
              <CharacterGrid characters={query.data.items} />
            </div>
          </>
        )}
      </div>

      {query.data && query.data.pages > 1 && (
        <Pagination
          page={filters.page}
          pages={query.data.pages}
          hrefFor={hrefFor}
          onPrefetch={(page) =>
            queryClient.prefetchQuery(charactersQuery({ ...filters, page }))
          }
        />
      )}
    </div>
  );
}
