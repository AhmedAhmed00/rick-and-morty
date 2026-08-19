"use client";

import classNames from "classnames";
import { RotateCcw, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryStates } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./button";
import { SearchInput } from "./search-input";
import { Select, type SelectOption } from "./select";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export interface FilterConfig {
  /** Query-string key this control reads and writes. */
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
}

interface Props {
  filters?: FilterConfig[];
  /** Enables the search box, bound to the `name` query parameter. */
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
}

// The URL is the single source of truth: nuqs writes to it, the page's query
// reads from it.
export function FilterBar({
  filters = [],
  searchable = true,
  searchPlaceholder,
  className,
}: Props) {
  const t = useTranslations("filters");

  const keys = filters.map((filter) => filter.name).join(",");
  const parsers = useMemo(() => {
    const map: Record<string, typeof parseAsString> = {
      name: parseAsString.withDefault(""),
    };
    for (const key of keys ? keys.split(",") : []) {
      map[key] = parseAsString.withDefault("");
    }
    return map;
  }, [keys]);

  const [values, setValues] = useQueryStates(parsers, {
    history: "replace",
    clearOnDefault: true, // empty values drop out of the URL
    shallow: false, // re-runs the server component so the list re-fetches there
  });

  const activeSearch = values.name ?? "";
  const [search, setSearch] = useState(activeSearch);
  const [syncedSearch, setSyncedSearch] = useState(activeSearch);
  const debouncedSearch = useDebouncedValue(search);

  // Synced during render, not in an effect. If our own debounce caused the URL
  // change the two already agree, so typing is never interrupted.
  if (activeSearch !== syncedSearch) {
    setSyncedSearch(activeSearch);
    if (activeSearch !== search.trim()) setSearch(activeSearch);
  }

  useEffect(() => {
    const next = debouncedSearch.trim();
    if (next !== activeSearch) void setValues({ name: next, page: null });
  }, [debouncedSearch, activeSearch, setValues]);

  const chips = [
    ...(searchable && activeSearch
      ? [{ name: "name", label: activeSearch }]
      : []),
    ...filters.flatMap((filter) => {
      const value = values[filter.name];
      if (!value) return [];
      const option = filter.options.find((o) => o.value === value);
      return [{ name: filter.name, label: option?.label ?? value }];
    }),
  ];

  // Any filter change returns to page 1, so nobody lands past the end.
  function apply(name: string, value: string | null) {
    void setValues({ [name]: value, page: null });
  }

  function reset() {
    setSearch("");
    void setValues(
      Object.fromEntries([
        ...Object.keys(parsers).map((key) => [key, null]),
        ["page", null],
      ]),
    );
  }

  return (
    <div className={classNames("space-y-3", className)}>
      <div className="flex flex-wrap items-stretch gap-2">
        {searchable && (
          <div className="min-w-60 flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={searchPlaceholder}
            />
          </div>
        )}

        {filters.map((filter) => (
          <Select
            key={filter.name}
            className="w-full sm:w-45"
            label={filter.label}
            placeholder={filter.placeholder ?? `${filter.label}: ${t("any")}`}
            value={values[filter.name] || undefined}
            options={filter.options}
            onChange={(value) => apply(filter.name, value ?? null)}
          />
        ))}

        {chips.length > 0 && (
          <Button
            variant="secondary"
            onClick={reset}
            className="h-11 shrink-0 gap-2"
          >
            <RotateCcw size={16} aria-hidden />
            {t("clearAll")}
          </Button>
        )}
      </div>

      {chips.length > 0 && (
        <ul className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <li key={chip.name}>
              <button
                type="button"
                onClick={() => {
                  if (chip.name === "name") setSearch("");
                  apply(chip.name, null);
                }}
                aria-label={t("remove", { label: chip.label })}
                className="inline-flex items-center gap-1.5 rounded-control border border-border bg-surface px-2.5 py-1 text-xs transition-colors hover:border-primary"
              >
                {chip.label}
                <X size={12} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
