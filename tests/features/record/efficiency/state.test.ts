import { describe, it, expect, beforeEach } from "vitest";
import {
  getCurrentHandTiles,
  getLastAnalyzedStep,
  setLastAnalyzedStep,
  getAnalysisResult,
  setAnalysisResult,
  resetState,
} from "../../../../src/features/record/efficiency/state";

describe("efficiency state", () => {
  beforeEach(() => {
    resetState();
  });

  describe("step tracking", () => {
    it("should track last analyzed step", () => {
      expect(getLastAnalyzedStep()).toBeNull();

      setLastAnalyzedStep(42);
      expect(getLastAnalyzedStep()).toBe(42);
    });
  });

  describe("analysis result caching", () => {
    it("should cache analysis result", () => {
      expect(getAnalysisResult()).toBeNull();

      const mockResult = {
        shanten: 1,
        isHu: false,
        tileCount: 13,
        hand: "123m456p789s11z",
        elapsedMs: 10,
      };

      setAnalysisResult(mockResult as any);
      expect(getAnalysisResult()).toEqual(mockResult);
    });
  });

  describe("getCurrentHandTiles", () => {
    it("should return null when no hand container exists", () => {
      expect(getCurrentHandTiles()).toBeNull();
    });

    it("should return null when no tile elements exist", () => {
      const handContainer = document.createElement("div");
      handContainer.className = "hand";
      document.body.appendChild(handContainer);

      expect(getCurrentHandTiles()).toBeNull();
      document.body.removeChild(handContainer);
    });

    it("should extract tile IDs from DOM", () => {
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

      const tile3 = document.createElement("div");
      tile3.className = "tl";
      tile3.dataset.val = "8";
      handContainer.appendChild(tile3);

      const result = getCurrentHandTiles();
      expect(result).toEqual([0, 1, 2]);

      document.body.removeChild(handContainer);
    });

    it("should select correct player hand by index", () => {
      const hand0 = document.createElement("div");
      hand0.className = "hand";
      document.body.appendChild(hand0);

      const hand1 = document.createElement("div");
      hand1.className = "hand";
      document.body.appendChild(hand1);

      const tile1 = document.createElement("div");
      tile1.className = "tl";
      tile1.dataset.val = "0";
      hand1.appendChild(tile1);

      expect(getCurrentHandTiles(0)).toBeNull();
      expect(getCurrentHandTiles(1)).toEqual([0]);

      document.body.removeChild(hand0);
      document.body.removeChild(hand1);
    });
  });

  describe("resetState", () => {
    it("should reset all state to initial values", () => {
      setLastAnalyzedStep(42);
      setAnalysisResult({ shanten: 1 } as any);

      resetState();

      expect(getLastAnalyzedStep()).toBeNull();
      expect(getAnalysisResult()).toBeNull();
    });
  });
});
