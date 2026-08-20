import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { parse } from "graphql";
import { queryOptions } from "@tanstack/react-query";
import { GraphQLClient, type Variables } from "graphql-request";
import { ApiError } from "@/utils/api-error";
import { DETAIL_STALE_TIME } from "@/services/queries";
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

const client = new GraphQLClient(GRAPHQL_URL);


function gql<TData, TVars extends Variables>(
  source: TemplateStringsArray,
): TypedDocumentNode<TData, TVars> {
  return parse(source.join("")) as TypedDocumentNode<TData, TVars>;
}

const CHARACTER = gql<CharacterData, IdVars>`
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

const EPISODE = gql<EpisodeData, IdVars>`
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

    const data = await client.request({
      document,
      variables: { id: String(id) },
      signal,
    });

    if (!data) throw new ApiError(502, "GraphQL response had no data");
    return data;
  } catch (error) {
   
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
