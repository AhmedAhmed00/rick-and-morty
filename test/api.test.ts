import { describe, expect, it } from "vitest";
import { getCharacters, getLocation } from "@/lib/api";

describe("getCharacters", () => {
  it("maps the API shape onto the domain type", async () => {
    const page = await getCharacters({ page: 1 });

    expect(page.count).toBe(2);
    expect(page.items[0]).toEqual({
      id: 1,
      name: "Rick Sanchez",
      status: "Alive",
      species: "Human",
      gender: "Male",
      image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
      origin: "Earth (C-137)",
      location: "Citadel of Ricks",
      episodeCount: 2,
    });
  });

  it("treats a no-match 404 as an empty page, not an error", async () => {
    const page = await getCharacters({ page: 1, name: "zzzzqqq" });

    expect(page).toEqual({ items: [], count: 0, pages: 0, page: 1 });
  });

  it("treats an out-of-range page the same way", async () => {
    const page = await getCharacters({ page: 99 });

    expect(page.items).toEqual([]);
    expect(page.page).toBe(99);
  });

  it("normalises an unrecognised status to unknown", async () => {
    const page = await getCharacters({ page: 1 });
    for (const character of page.items) {
      expect(["Alive", "Dead", "unknown"]).toContain(character.status);
    }
  });
});

describe("getLocation", () => {
  it("returns null for a missing record rather than an empty one", async () => {
    expect(await getLocation(9999)).toBeNull();
  });
});

describe("batch fetching", () => {
  it("handles the endpoint returning a bare object for a single id", async () => {
    // /character/1 responds with an object, not an array — coercing it is the
    // difference between one resident and a crash.
    const location = await getLocation(1);

    expect(location?.residents).toHaveLength(1);
    expect(location?.residents[0].name).toBe("Rick Sanchez");
  });
});
