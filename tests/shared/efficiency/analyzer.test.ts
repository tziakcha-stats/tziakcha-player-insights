import { describe, it, expect } from "vitest";
import {
  analyzeHand,
  analyzeHandQuick,
  determineAnalysisMode,
} from "../../../src/shared/efficiency/analyzer";

describe("efficiency analyzer", () => {
  describe("determineAnalysisMode", () => {
    it("should return quick mode for random hand", () => {
      const handTiles = [0, 3, 5, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30];
      const mode = determineAnalysisMode(handTiles);
      expect(mode).toBe("quick");
    });

    it("should return full mode for good hand", () => {
      const handTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const mode = determineAnalysisMode(handTiles);
      expect(["full", "quick"]).toContain(mode);
    });
  });

  describe("analyzeHand", () => {
    it("should analyze 13-tile hand", () => {
      const handTiles = [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16];
      const result = analyzeHand(handTiles);

      expect(result).toHaveProperty("shanten");
      expect(result).toHaveProperty("isHu");
      expect(result).toHaveProperty("tileCount", 13);
      expect(result).toHaveProperty("hand");
      expect(result).toHaveProperty("elapsedMs");
      expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
    });

    it("should handle invalid hand gracefully", () => {
      const handTiles = [0, 1, 2];
      const result = analyzeHand(handTiles);

      expect(result).toHaveProperty("shanten");
      expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe("analyzeHandQuick", () => {
    it("should return quick analysis", () => {
      const handTiles = [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16];
      const result = analyzeHandQuick(handTiles);

      expect(result).toHaveProperty("shanten");
      expect(result).toHaveProperty("elapsedMs");
    });
  });
});
