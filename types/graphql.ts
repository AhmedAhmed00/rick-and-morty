export interface GqlCharacter {
  id: string;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  origin: { name: string } | null;
  location: { name: string } | null;
  episode: { id: string }[];
}

export interface GqlEpisode {
  id: string;
  name: string;
  air_date: string;
  episode: string;
  characters: { id: string }[];
}

export interface CharacterData {
  character: (Omit<GqlCharacter, "episode"> & { episode: GqlEpisode[] }) | null;
}

export interface EpisodeData {
  episode: (Omit<GqlEpisode, "characters"> & { characters: GqlCharacter[] }) | null;
}

export interface IdVars {
  id: string;
}
