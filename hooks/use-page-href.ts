"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Builds a page URL, keeping the active filters. Navigating it re-runs the
 * server component, so the list is re-fetched there rather than in the browser.
 */
export function usePageHref(key = "page") {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page > 1) params.set(key, String(page));
      else params.delete(key);

      const query = params.toString();
      return query ? `${pathname}?${query}` : pathname;
    },
    [searchParams, pathname, key],
  );
}

/** Reads the current page from the URL, clamped to a valid position. */
export function usePageParam(key = "page") {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get(key));
  return Number.isInteger(page) && page > 0 ? page : 1;
}
