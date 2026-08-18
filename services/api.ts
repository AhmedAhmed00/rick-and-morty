import type {
  Character,
  CharacterFilters,
  Episode,
  Gender,
  ListFilters,
  Location,
  Page,
  Status,
} from "@/types";
import { GENDERS, STATUSES } from "@/types";

// Written out in full so the Next compiler can inline it into the client bundle;
// a destructured or computed lookup would resolve to undefined in the browser.
const BASE =
  process.env.NEXT_PUBLIC_REST_API_URL ?? "https://rickandmortyapi.com/api";

export class ApiError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

interface RestInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

interface RestList<T> {
  info: RestInfo;
  results: T[];
}

interface RestCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  origin: { name: string };
  location: { name: string };
  episode: string[];
}

interface RestEpisode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
}

interface RestLocation {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
}


async function get<T>(
  path: string,
  params: Record<string, unknown> = {},
  signal?: AbortSignal,
): Promise<T | null> {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && String(value) !== "") {
      search.set(key, String(value));
    }
  }

  const query = search.size > 0 ? `?${search}` : "";
  const res = await fetch(`${BASE}${path}${query}`, {
    signal,
    next: { revalidate: 300 },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new ApiError(res.status, `Request to ${path} failed`);

  return (await res.json()) as T;
}

const asStatus = (value: string): Status =>
  (STATUSES as readonly string[]).includes(value) ? (value as Status) : "unknown";

const asGender = (value: string): Gender =>
  (GENDERS as readonly string[]).includes(value) ? (value as Gender) : "unknown";

export function toCharacter(raw: RestCharacter): Character {
  return {
    id: raw.id,
    name: raw.name,
    status: asStatus(raw.status),
    species: raw.species,
    gender: asGender(raw.gender),
    image: raw.image,
    origin: raw.origin.name,
    location: raw.location.name,
    episodeCount: raw.episode.length,
  };
}

export function toEpisode(raw: RestEpisode): Episode {
  return {
    id: raw.id,
    name: raw.name,
    airDate: raw.air_date,
    code: raw.episode,
    characterCount: raw.characters.length,
  };
}

export function toLocation(raw: RestLocation): Location {
  return {
    id: raw.id,
    name: raw.name,
    type: raw.type,
    dimension: raw.dimension,
    residentCount: raw.residents.length,
  };
}

function toPage<Raw, Item>(
  data: RestList<Raw> | null,
  page: number,
  map: (raw: Raw) => Item,
): Page<Item> {
  if (!data) return { items: [], count: 0, pages: 0, page };
  return {
    items: data.results.map(map),
    count: data.info.count,
    pages: data.info.pages,
    page,
  };
}

export async function getCharacters(
  filters: CharacterFilters,
  signal?: AbortSignal,
): Promise<Page<Character>> {
  const data = await get<RestList<RestCharacter>>("/character", filters, signal);
  return toPage(data, filters.page, toCharacter);
}

export async function getEpisodes(
  filters: ListFilters,
  signal?: AbortSignal,
): Promise<Page<Episode>> {
  const data = await get<RestList<RestEpisode>>("/episode", filters, signal);
  return toPage(data, filters.page, toEpisode);
}

export async function getLocations(
  filters: ListFilters,
  signal?: AbortSignal,
): Promise<Page<Location>> {
  const data = await get<RestList<RestLocation>>("/location", filters, signal);
  return toPage(data, filters.page, toLocation);
}

export async function getLocation(id: number, signal?: AbortSignal) {
  const raw = await get<RestLocation>(`/location/${id}`, {}, signal);
  if (!raw) return null;

  const residents = await getCharactersByIds(
    raw.residents.map(idFromUrl).filter((id) => id !== null),
    signal,
  );

  return { ...toLocation(raw), residents };
}

function idFromUrl(url: string): number | null {
  const id = Number(url.split("/").pop());
  return Number.isInteger(id) ? id : null;
}

/** The batch endpoint returns an object for one id and an array for several. */
async function getCharactersByIds(
  ids: number[],
  signal?: AbortSignal,
): Promise<Character[]> {
  if (ids.length === 0) return [];

  const data = await get<RestCharacter | RestCharacter[]>(
    `/character/${ids.join(",")}`,
    {},
    signal,
  );
  if (!data) return [];

  return (Array.isArray(data) ? data : [data]).map(toCharacter);
}
