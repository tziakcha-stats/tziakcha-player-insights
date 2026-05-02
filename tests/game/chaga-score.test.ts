import { describe, expect, it } from "vitest";
import {
  calcChagaScore,
  choiceMatchesAi,
  normalizeAiAction,
  type Choice,
} from "../../src/features/game/chaga-score";
import type { ReviewResponseItem } from "../../src/features/record/reviewer/types";

function createChoice(overrides: Partial<Choice> = {}): Choice {
  return {
    seat: 0,
    actionIndex: 0,
    kind: "play",
    value: 0,
    ...overrides,
  };
}

function createRow(
  candidates?: ReviewResponseItem["extra"]["candidates"],
): ReviewResponseItem {
  return {
    rr: 0,
    ri: 0,
    extra: { candidates },
  };
}

describe("chaga score", () => {
  it("normalizes AI actions into comparable choice kinds", () => {
    expect(normalizeAiAction("Play W1")).toEqual(["play", 0]);
    expect(normalizeAiAction("Play T1")).toEqual(["play", 9]);
    expect(normalizeAiAction("Play B9")).toEqual(["play", 26]);
    expect(normalizeAiAction("Gang W1")).toEqual(["gang", null]);
    expect(normalizeAiAction("BuGang W1")).toEqual(["gang", null]);
    expect(normalizeAiAction("Pass")).toEqual(["pass", null]);
    expect(normalizeAiAction("")).toBeNull();
    expect(normalizeAiAction("Unknown W1")).toBeNull();
  });

  it("matches choices against the top AI candidate", () => {
    expect(
      choiceMatchesAi(
        createChoice({ kind: "play", value: 0 }),
        createRow([
          [1, "Play W1"],
          [0.8, "Play W2"],
        ]),
      ),
    ).toBe(true);

    expect(
      choiceMatchesAi(
        createChoice({ kind: "play", value: 1 }),
        createRow([[1, "Play W1"]]),
      ),
    ).toBe(false);

    expect(
      choiceMatchesAi(
        createChoice({ kind: "peng", value: null }),
        createRow([[1, "Chi W1 W2 W3"]]),
      ),
    ).toBe(false);
  });

  it("treats missing or malformed AI rows as non-blocking", () => {
    expect(choiceMatchesAi(createChoice(), undefined)).toBe(true);
    expect(choiceMatchesAi(createChoice(), createRow())).toBe(true);
    expect(choiceMatchesAi(createChoice(), createRow([[1, ""]]))).toBe(true);
  });

  it("computes chaga score from the best matching candidate weight", () => {
    expect(
      calcChagaScore(
        createChoice({ kind: "play", value: 1 }),
        createRow([
          [1, "Play W1"],
          [0.7, "Play W2"],
          [0.4, "Peng W1"],
        ]),
      ),
    ).toBeCloseTo(Math.exp(-0.3) * 100, 10);

    expect(
      calcChagaScore(
        createChoice({ kind: "play", value: 0 }),
        createRow([[1, "Play W1"]]),
      ),
    ).toBe(100);

    expect(
      calcChagaScore(
        createChoice({ kind: "hu", value: null }),
        createRow([
          [1, "Play W1"],
          [0.7, "Peng W1"],
        ]),
      ),
    ).toBe(0);
  });
});
