import { describe, it, expect } from "vitest";
import {
  analyzeHand,
  determineAnalysisMode,
} from "../../../src/shared/efficiency/analyzer";

describe("efficiency analyzer", () => {
  describe("determineAnalysisMode", () => {
    it("should return quick mode for non-13-tile hand", () => {
      const handTiles = [0, 3, 5, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32];
      const mode = determineAnalysisMode(handTiles);
      expect(mode).toBe("quick");
    });

    it("should return full or quick for 13-tile hand", () => {
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
      expect(result).toHaveProperty("hand");
      expect(result).toHaveProperty("elapsedMs");
      expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
    });

    it("should analyze 14-tile hand with discards", () => {
      const handTiles = [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16];
      const result = analyzeHand(handTiles);

      expect(result).toHaveProperty("shanten");
      expect(result).toHaveProperty("hand");
      expect(result).toHaveProperty("elapsedMs");
      // 14 张应返回 discards
      if (result.discards) {
        expect(result.discards.length).toBeGreaterThan(0);
        expect(result.discards[0]).toHaveProperty("discardTileId");
        expect(result.discards[0]).toHaveProperty("summary");
      }
    });

    it("should handle invalid hand gracefully", () => {
      const handTiles = [0, 1, 2];
      const result = analyzeHand(handTiles);

      expect(result).toHaveProperty("shanten");
      expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
    });
  });
});
