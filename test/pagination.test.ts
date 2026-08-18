import { describe, expect, it } from "vitest";
import { buildRange } from "@/utils/pagination";

describe("buildRange", () => {
  it("renders nothing when there is a single page or none", () => {
    expect(buildRange(1, 1)).toEqual([]);
    expect(buildRange(1, 0)).toEqual([]);
  });

  it("lists every page when they all fit", () => {
    expect(buildRange(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("collapses the middle when far from both ends", () => {
    expect(buildRange(7, 42)).toEqual([1, "gap", 6, 7, 8, "gap", 42]);
  });

  it("only collapses the far side near the start", () => {
    expect(buildRange(2, 42)).toEqual([1, 2, 3, "gap", 42]);
  });

  it("only collapses the far side near the end", () => {
    expect(buildRange(41, 42)).toEqual([1, "gap", 40, 41, 42]);
  });

  it("omits the ellipsis when it would hide exactly one page", () => {
    expect(buildRange(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });
});
