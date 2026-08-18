import { HttpResponse, graphql } from "msw";
import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/api";
import { getCharacter, getEpisode } from "@/lib/graphql";
import { server } from "./msw/server";

const gql = graphql.link("https://rickandmortyapi.com/graphql");

describe("getCharacter", () => {
  it("maps the GraphQL shape onto the domain type", async () => {
    const character = await getCharacter(1);

    // Ids arrive as strings over GraphQL and must land as numbers.
    expect(character?.id).toBe(1);
    expect(typeof character?.id).toBe("number");
    expect(character).toMatchObject({
      name: "Rick Sanchez",
      status: "Alive",
      species: "Human",
      gender: "Male",
      origin: "Earth (C-137)",
      location: "Citadel of Ricks",
    });
  });

  it("returns the episodes nested in the same request", async () => {
    // The whole reason this path uses GraphQL: REST would need a second call.
    let requests = 0;
    server.events.on("request:start", () => {
      requests += 1;
    });

    const character = await getCharacter(1);

    expect(requests).toBe(1);
    expect(character?.episodes).toHaveLength(2);
    expect(character?.episodes[0]).toMatchObject({
      id: 1,
      name: "Pilot",
      code: "S01E01",
    });
  });

  it("treats a null record as not-found rather than an error", async () => {
    // The API answers a missing-but-numeric id with data:null and no errors.
    await expect(getCharacter(9999)).resolves.toBeNull();
  });

  it("throws when the response carries an errors array", async () => {
    // What a non-numeric id produces upstream: data:null *plus* errors.
    server.use(
      gql.query("Character", () =>
        HttpResponse.json({
          data: { character: null },
          errors: [{ message: "500: Internal Server Error" }],
        }),
      ),
    );

    await expect(getCharacter(1)).rejects.toBeInstanceOf(ApiError);
  });

  it("falls back to unknown for an origin the API leaves null", async () => {
    const character = await getCharacter(2);
    expect(character?.origin).toBe("unknown");
  });
});

describe("getEpisode", () => {
  it("maps the episode and its characters", async () => {
    const episode = await getEpisode(1);

    expect(episode).toMatchObject({ id: 1, name: "Pilot", code: "S01E01" });
    expect(episode?.characters).toHaveLength(1);
    expect(episode?.characters[0].name).toBe("Rick Sanchez");
  });

  it("returns null for a missing episode", async () => {
    await expect(getEpisode(9999)).resolves.toBeNull();
  });
});
