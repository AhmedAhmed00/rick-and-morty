export interface RestInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface RestList<T> {
  info: RestInfo;
  results: T[];
}

export interface RestCharacter {
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

export interface RestEpisode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
}

export interface RestLocation {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
}
