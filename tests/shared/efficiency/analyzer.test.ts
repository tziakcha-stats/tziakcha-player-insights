import { describe, it, expect } from "vitest";
import { analyzeHand } from "../../../src/shared/efficiency/analyzer";

describe("efficiency analyzer", () => {
  describe("analyzeHand", () => {
    it("should return shanten only for high-shanten hand", () => {
      // 散牌，向听数高
      const handTiles = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 28, 29, 30];
      const result = analyzeHand(handTiles);

      expect(result.shanten).toBeGreaterThan(2);
      expect(result.hand).toBeTruthy();
      expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
      // 高向听不应有 discards/acceptance/summary
      expect(result.discards).toBeUndefined();
      expect(result.acceptance).toBeUndefined();
      expect(result.summary).toBeUndefined();
    });

    it("should return full analysis for low-shanten hand", () => {
      // 接近听牌的手牌
      const handTiles = [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16];
      const result = analyzeHand(handTiles);

      expect(result).toHaveProperty("shanten");
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
      if (result.shanten <= 2 && result.discards) {
        expect(result.discards.length).toBeGreaterThan(0);
        expect(result.discards[0]).toHaveProperty("discardTileId");
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
