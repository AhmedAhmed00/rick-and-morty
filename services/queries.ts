import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getCharacters, getEpisodes, getLocation, getLocations } from "@/services/rest";
import { getCharacter, getEpisode } from "@/services/graphql";
import type { CharacterFilters, ListFilters } from "@/types";

// One definition for both sides: the server prefetches and the client
// subscribes to the same object, so the keys can't drift.

const LIST_STALE_TIME = 5 * 60_000;
const DETAIL_STALE_TIME = 30 * 60_000;

export const charactersQuery = (filters: CharacterFilters) =>
  queryOptions({
    queryKey: ["characters", filters] as const,
    queryFn: ({ signal }) => getCharacters(filters, signal),
    staleTime: LIST_STALE_TIME,
    placeholderData: keepPreviousData, // current page stays put while the next loads
  });

export const episodesQuery = (filters: ListFilters) =>
  queryOptions({
    queryKey: ["episodes", filters] as const,
    queryFn: ({ signal }) => getEpisodes(filters, signal),
    staleTime: LIST_STALE_TIME,
    placeholderData: keepPreviousData,
  });

export const locationsQuery = (filters: ListFilters) =>
  queryOptions({
    queryKey: ["locations", filters] as const,
    queryFn: ({ signal }) => getLocations(filters, signal),
    staleTime: LIST_STALE_TIME,
    placeholderData: keepPreviousData,
  });

export const characterQuery = (id: number) =>
  queryOptions({
    queryKey: ["character", id] as const,
    queryFn: ({ signal }) => getCharacter(id, signal),
    staleTime: DETAIL_STALE_TIME,
  });

export const episodeQuery = (id: number) =>
  queryOptions({
    queryKey: ["episode", id] as const,
    queryFn: ({ signal }) => getEpisode(id, signal),
    staleTime: DETAIL_STALE_TIME,
  });

export const locationQuery = (id: number) =>
  queryOptions({
    queryKey: ["location", id] as const,
    queryFn: ({ signal }) => getLocation(id, signal),
    staleTime: DETAIL_STALE_TIME,
  });
