import { HttpResponse, graphql, http } from "msw";

const BASE = "https://rickandmortyapi.com/api";

export const characters = [
  {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    origin: { name: "Earth (C-137)", url: `${BASE}/location/1` },
    location: { name: "Citadel of Ricks", url: `${BASE}/location/3` },
    image: `${BASE}/character/avatar/1.jpeg`,
    episode: [`${BASE}/episode/1`, `${BASE}/episode/2`],
  },
  {
    id: 2,
    name: "Morty Smith",
    status: "Dead",
    species: "Human",
    type: "",
    gender: "Male",
    origin: { name: "unknown", url: "" },
    location: { name: "Citadel of Ricks", url: `${BASE}/location/3` },
    image: `${BASE}/character/avatar/2.jpeg`,
    // A single episode, which makes the batch endpoint return a bare object.
    episode: [`${BASE}/episode/7`],
  },
];

export const episodes = [
  { id: 1, name: "Pilot", air_date: "December 2, 2013", episode: "S01E01", characters: [`${BASE}/character/1`] },
  { id: 2, name: "Lawnmower Dog", air_date: "December 9, 2013", episode: "S01E02", characters: [] },
  { id: 7, name: "Raising Gazorpazorp", air_date: "March 10, 2014", episode: "S01E07", characters: [] },
];

export const locations = [
  {
    id: 1,
    name: "Earth (C-137)",
    type: "Planet",
    dimension: "Dimension C-137",
    // One resident, so the batch endpoint returns a bare object.
    residents: [`${BASE}/character/1`],
  },
];

const notFound = () =>
  HttpResponse.json({ error: "There is nothing here" }, { status: 404 });

export const handlers = [
  http.get(`${BASE}/character`, ({ request }) => {
    const params = new URL(request.url).searchParams;
    const name = params.get("name")?.toLowerCase() ?? "";
    const page = Number(params.get("page") ?? "1");

    const results = characters.filter((c) => c.name.toLowerCase().includes(name));

    // The real API answers both "no matches" and "page out of range" with a 404.
    if (results.length === 0 || page > 1) return notFound();

    return HttpResponse.json({
      info: { count: results.length, pages: 1, next: null, prev: null },
      results,
    });
  }),

  http.get(`${BASE}/character/:ids`, ({ params }) => {
    const ids = String(params.ids).split(",").map(Number);
    const found = characters.filter((c) => ids.includes(c.id));
    if (found.length === 0) return notFound();
    // Bare object for a single id, array for several — as the real API does.
    return HttpResponse.json(ids.length === 1 ? found[0] : found);
  }),

  http.get(`${BASE}/episode/:ids`, ({ params }) => {
    const ids = String(params.ids).split(",").map(Number);
    const found = episodes.filter((e) => ids.includes(e.id));
    if (found.length === 0) return notFound();
    return HttpResponse.json(ids.length === 1 ? found[0] : found);
  }),

  http.get(`${BASE}/location/:id`, ({ params }) => {
    const location = locations.find((l) => l.id === Number(params.id));
    if (!location) return notFound();
    return HttpResponse.json(location);
  }),
];

// --- GraphQL, used by the two detail pages ---

const gql = graphql.link("https://rickandmortyapi.com/graphql");

/** REST fixtures reshaped into the GraphQL response format. */
function toGqlCharacter(character: (typeof characters)[number]) {
  return {
    id: String(character.id),
    name: character.name,
    status: character.status,
    species: character.species,
    gender: character.gender,
    image: character.image,
    origin: { name: character.origin.name },
    location: { name: character.location.name },
    episode: character.episode.map((url) => ({ id: String(idFromUrl(url)) })),
  };
}

function idFromUrl(url: string) {
  return Number(url.split("/").pop());
}

export const graphqlHandlers = [
  gql.query("Character", ({ variables }) => {
    const character = characters.find((c) => String(c.id) === String(variables.id));

    // A missing record is data:null with NO errors key — a successful response.
    if (!character) return HttpResponse.json({ data: { character: null } });

    return HttpResponse.json({
      data: {
        character: {
          ...toGqlCharacter(character),
          episode: character.episode.map((url) => {
            const episode = episodes.find((e) => e.id === idFromUrl(url))!;
            return {
              id: String(episode.id),
              name: episode.name,
              air_date: episode.air_date,
              episode: episode.episode,
              characters: episode.characters.map((c) => ({ id: String(idFromUrl(c)) })),
            };
          }),
        },
      },
    });
  }),

  gql.query("Episode", ({ variables }) => {
    const episode = episodes.find((e) => String(e.id) === String(variables.id));
    if (!episode) return HttpResponse.json({ data: { episode: null } });

    return HttpResponse.json({
      data: {
        episode: {
          id: String(episode.id),
          name: episode.name,
          air_date: episode.air_date,
          episode: episode.episode,
          characters: episode.characters.map((url) =>
            toGqlCharacter(characters.find((c) => c.id === idFromUrl(url))!),
          ),
        },
      },
    });
  }),
];
