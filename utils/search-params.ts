import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";
import type { CharacterFilters } from "@/types";
import { GENDERS, SPECIES, STATUSES } from "@/types";

/**
 * URL contract for the character list, shared by the server page and the client.
 * `parseAsStringLiteral` rejects values outside the known domain, so a
 * hand-edited `?status=zombie` never reaches the API.
 */
export const characterParams = {
  page: parseAsInteger.withDefault(1),
  name: parseAsString.withDefault(""),
  status: parseAsStringLiteral(STATUSES),
  species: parseAsStringLiteral(SPECIES),
  gender: parseAsStringLiteral(GENDERS),
};

export const loadCharacterParams = createLoader(characterParams);

/** Page number for the simple lists, which take no other filters. */
const pageOnly = { page: parseAsInteger.withDefault(1) };
const loadPage = createLoader(pageOnly);

export function readPage(
  searchParams: Record<string, string | string[] | undefined>,
): number {
  const { page } = loadPage(searchParams);
  return page > 0 ? page : 1;
}

export type CharacterParams = Awaited<ReturnType<typeof loadCharacterParams>>;

/** Narrows to the API shape. Page is clamped — `?page=0` parses as valid. */
export function toCharacterFilters(params: CharacterParams): CharacterFilters {
  return {
    page: params.page > 0 ? params.page : 1,
    name: params.name.trim() || undefined,
    status: params.status ?? undefined,
    species: params.species ?? undefined,
    gender: params.gender ?? undefined,
  };
}
