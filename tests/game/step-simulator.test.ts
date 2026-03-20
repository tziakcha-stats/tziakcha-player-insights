import { describe, expect, it } from "vitest";
import { extractChoices } from "../../src/features/game/step-simulator";

describe("step simulator", () => {
  it("extracts comparable choices from supported action types", () => {
    expect(
      extractChoices({
        a: [
          [(2 << 4) | 2, 9],
          [(1 << 4) | 3, 0],
          [(3 << 4) | 4, 0],
          [(0 << 4) | 5, 0],
          [(1 << 4) | 6, 0],
          [(2 << 4) | 8, 0],
          [(3 << 4) | 9, 0],
        ],
      }),
    ).toEqual([
      { seat: 2, actionIndex: 0, kind: "play", value: 2 },
      { seat: 1, actionIndex: 1, kind: "chi", value: null },
      { seat: 3, actionIndex: 2, kind: "peng", value: null },
      { seat: 0, actionIndex: 3, kind: "gang", value: null },
      { seat: 1, actionIndex: 4, kind: "hu", value: null },
      { seat: 2, actionIndex: 5, kind: "pass", value: null },
      { seat: 3, actionIndex: 6, kind: "abandon", value: null },
    ]);
  });

  it("filters unsupported, automatic, and malformed actions", () => {
    expect(
      extractChoices({
        a: [
          [(0 << 4) | 1, 0],
          [(0 << 4) | 6, 1],
          [(0 << 4) | 8, 1],
          ["bad", 0] as unknown as [number, number],
          [0] as unknown as [number, number],
        ],
      }),
    ).toEqual([]);

    expect(extractChoices({})).toEqual([]);
  });
});
