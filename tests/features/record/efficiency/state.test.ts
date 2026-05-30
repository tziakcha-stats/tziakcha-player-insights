import { describe, it, expect, beforeEach } from "vitest";
import {
  getCurrentHandTiles,
  getLastStep,
  setLastStep,
  getLastHandStr,
  setLastHandStr,
  getLastResult,
  setLastResult,
  resetState,
  handTilesToStr,
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
      expect(handTilesToStr([3, 1, 2])).toBe("1,2,3");
      expect(handTilesToStr([10, 0, 5])).toBe("0,5,10");
    });
  });

  describe("getCurrentHandTiles", () => {
    it("should return null when no hand container exists", () => {
      expect(getCurrentHandTiles()).toBeNull();
    });

    it("should extract tile IDs and filter flowers", () => {
      const handContainer = document.createElement("div");
      handContainer.className = "hand";
      document.body.appendChild(handContainer);

      const tile1 = document.createElement("div");
      tile1.className = "tl";
      tile1.dataset.val = "0";
      handContainer.appendChild(tile1);

      const tile2 = document.createElement("div");
      tile2.className = "tl";
      tile2.dataset.val = "4";
      handContainer.appendChild(tile2);

      const flower = document.createElement("div");
      flower.className = "tl";
      flower.dataset.val = "136";
      handContainer.appendChild(flower);

      const result = getCurrentHandTiles();
      expect(result).toEqual([0, 1]);

      document.body.removeChild(handContainer);
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
