export const STATUSES = ["Alive", "Dead", "unknown"] as const;
export type Status = (typeof STATUSES)[number];

export const GENDERS = ["Female", "Male", "Genderless", "unknown"] as const;
export type Gender = (typeof GENDERS)[number];

/** The full species domain, taken from all 826 characters. */
export const SPECIES = [
  "Human",
  "Alien",
  "Humanoid",
  "Animal",
  "Robot",
  "Mythological Creature",
  "Cronenberg",
  "Disease",
  "Poopybutthole",
  "unknown",
] as const;

export interface Character {
  id: number;
  name: string;
  status: Status;
  species: string;
  gender: Gender;
  image: string;
  origin: string;
  location: string;
  episodeCount: number;
}

export interface Episode {
  id: number;
  name: string;
  airDate: string;
  code: string;
  characterCount: number;
}

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residentCount: number;
}

export interface CharacterDetail extends Character {
  episodes: Episode[];
}

export interface EpisodeDetail extends Episode {
  characters: Character[];
}

export interface LocationDetail extends Location {
  residents: Character[];
}

export interface Page<T> {
  items: T[];
  count: number;
  pages: number;
  page: number;
}

// Type aliases rather than interfaces: these get passed straight to the query
// string builder, which takes a Record — interfaces have no index signature.
export type CharacterFilters = {
  page: number;
  name?: string;
  status?: Status;
  species?: string;
  gender?: Gender;
};

export type ListFilters = {
  page: number;
  name?: string;
};
