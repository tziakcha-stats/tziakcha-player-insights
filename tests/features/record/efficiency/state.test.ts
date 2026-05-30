import { describe, it, expect, beforeEach } from "vitest";
import {
  getLastStep,
  setLastStep,
  getLastHandStr,
  setLastHandStr,
  getLastResult,
  setLastResult,
  resetState,
  handTilesToStr,
  buildHandString,
} from "../../../../src/features/record/efficiency/state";

describe("efficiency state", () => {
  beforeEach(() => {
    resetState();
  });

  describe("step tracking", () => {
    it("should track last step", () => {
      expect(getLastStep()).toBeNull();
      setLastStep(42);
      expect(getLastStep()).toBe(42);
    });
  });

  describe("hand string tracking", () => {
    it("should track last hand string", () => {
      expect(getLastHandStr()).toBeNull();
      setLastHandStr("0,1,2,3,4");
      expect(getLastHandStr()).toBe("0,1,2,3,4");
    });
  });

  describe("result caching", () => {
    it("should cache analysis result", () => {
      expect(getLastResult()).toBeNull();
      const mockResult = { shanten: 1, hand: "test" };
      setLastResult(mockResult);
      expect(getLastResult()).toEqual(mockResult);
    });
  });

  describe("handTilesToStr", () => {
    it("should sort and join tile IDs", () => {
      expect(handTilesToStr([3, 1, 2], [])).toBe("1,2,3");
      expect(handTilesToStr([10, 0, 5], [])).toBe("0,5,10");
    });

    it("should include meld tiles", () => {
      expect(handTilesToStr([0, 1], [[27, 28, 29]])).toBe("0,1,27,28,29");
    });
  });

  describe("buildHandString", () => {
    it("should build hand string from closed tiles", () => {
      // tileId: 0-8=m, 9-17=p, 18-26=s, 27+=z
      const result = buildHandString([0, 1, 2, 9, 10, 11, 27, 28], []);
      expect(result).toContain("m");
      expect(result).toContain("p");
    });

    it("should include meld prefix", () => {
      const result = buildHandString([0, 1, 2, 9, 10, 11, 27], [[28, 29, 30]]);
      expect(result).toContain("[S");
    });
  });

  describe("resetState", () => {
    it("should reset all state", () => {
      setLastStep(42);
      setLastHandStr("test");
      setLastResult({ shanten: 1 });

      resetState();

      expect(getLastStep()).toBeNull();
      expect(getLastHandStr()).toBeNull();
      expect(getLastResult()).toBeNull();
    });
  });
});
