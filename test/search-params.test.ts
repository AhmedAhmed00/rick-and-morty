import { describe, expect, it } from "vitest";
import { loadCharacterParams, toCharacterFilters } from "@/lib/search-params";

/** Parses a query string the way the server page does, then narrows it. */
function filtersFor(query: string) {
  return toCharacterFilters(loadCharacterParams(new URLSearchParams(query)));
}

describe("character URL contract", () => {
  it("falls back to page 1 with no filters", () => {
    expect(filtersFor("")).toEqual({
      page: 1,
      name: undefined,
      status: undefined,
      species: undefined,
      gender: undefined,
    });
  });

  it("reads a fully specified URL", () => {
    expect(filtersFor("page=3&name=rick&status=Alive&species=Human&gender=Male")).toEqual({
      page: 3,
      name: "rick",
      status: "Alive",
      species: "Human",
      gender: "Male",
    });
  });

  it("clamps pages that parse but aren't valid positions", () => {
    for (const query of ["page=0", "page=-2", "page=abc", "page="]) {
      expect(filtersFor(query).page).toBe(1);
    }
  });

  it("rejects values outside the known domain instead of forwarding them", () => {
    // A hand-edited URL must not reach the API as a filter it can't answer.
    expect(filtersFor("status=zombie").status).toBeUndefined();
    expect(filtersFor("gender=other").gender).toBeUndefined();
    expect(filtersFor("species=Vampire").species).toBeUndefined();
  });

  it("is case-sensitive to the API's own casing", () => {
    // The API returns "Alive"/"unknown"; the literal parser mirrors that exactly
    // so the value round-trips into the request untouched.
    expect(filtersFor("status=Alive").status).toBe("Alive");
    expect(filtersFor("status=unknown").status).toBe("unknown");
  });

  it("treats a blank or whitespace-only search as no search", () => {
    expect(filtersFor("name=").name).toBeUndefined();
    expect(filtersFor("name=%20%20").name).toBeUndefined();
  });

  it("trims surrounding whitespace from the search term", () => {
    expect(filtersFor("name=%20rick%20").name).toBe("rick");
  });
});
