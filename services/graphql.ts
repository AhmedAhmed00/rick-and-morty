import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { ApiError } from "@/services/api-error";
import type { CharacterDetail, EpisodeDetail } from "@/types";
import type {
  CharacterData,
  EpisodeData,
  GqlCharacter,
  GqlEpisode,
  IdVars,
} from "@/types/graphql";
import { asGender, asStatus } from "@/utils/normalize";

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_API_URL ??
  "https://rickandmortyapi.com/graphql";

const client = new ApolloClient({
  link: new HttpLink({ uri: GRAPHQL_URL }),
  cache: new InMemoryCache(),
});

const CHARACTER: TypedDocumentNode<CharacterData, IdVars> = gql`
  query Character($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      gender
      image
      origin {
        name
      }
      location {
        name
      }
      episode {
        id
        name
        air_date
        episode
        characters {
          id
        }
      }
    }
  }
`;

const EPISODE: TypedDocumentNode<EpisodeData, IdVars> = gql`
  query Episode($id: ID!) {
    episode(id: $id) {
      id
      name
      air_date
      episode
      characters {
        id
        name
        status
        species
        gender
        image
        origin {
          name
        }
        location {
          name
        }
        episode {
          id
        }
      }
    }
  }
`;

function toCharacter(raw: GqlCharacter) {
  return {
    id: Number(raw.id),
    name: raw.name,
    status: asStatus(raw.status),
    species: raw.species,
    gender: asGender(raw.gender),
    image: raw.image,
    origin: raw.origin?.name ?? "unknown",
    location: raw.location?.name ?? "unknown",
    episodeCount: raw.episode.length,
  };
}

function toEpisode(raw: GqlEpisode) {
  return {
    id: Number(raw.id),
    name: raw.name,
    airDate: raw.air_date,
    code: raw.episode,
    characterCount: raw.characters.length,
  };
}

async function run<TData>(
  document: TypedDocumentNode<TData, IdVars>,
  id: number,
  signal?: AbortSignal,
): Promise<TData> {
  try {
    const result = await client.query({
      query: document,
      variables: { id: String(id) },
      fetchPolicy: "no-cache",
      context: { fetchOptions: { signal } },
    });

    // A missing record is `data.x === null` with no error — a valid response.
    if (!result.data) throw new ApiError(502, "GraphQL response had no data");
    return result.data;
  } catch (error) {
    // Apollo throws on a populated `errors` array; normalise it so callers and
    // the query client's retry guard only ever see ApiError.
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") throw error;

    throw new ApiError(
      502,
      error instanceof Error ? error.message : "GraphQL request failed",
    );
  }
}

export async function getCharacter(
  id: number,
  signal?: AbortSignal,
): Promise<CharacterDetail | null> {
  const { character } = await run(CHARACTER, id, signal);
  if (!character) return null;

  return {
    ...toCharacter(character),
    episodes: character.episode.map(toEpisode),
  };
}

export async function getEpisode(
  id: number,
  signal?: AbortSignal,
): Promise<EpisodeDetail | null> {
  const { episode } = await run(EPISODE, id, signal);
  if (!episode) return null;

  return {
    ...toEpisode(episode),
    characters: episode.characters.map(toCharacter),
  };
}
