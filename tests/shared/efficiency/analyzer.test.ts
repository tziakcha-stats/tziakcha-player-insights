import { describe, it, expect } from "vitest";
import { analyzeHand } from "../../../src/shared/efficiency/analyzer";

describe("efficiency analyzer", () => {
  describe("analyzeHand", () => {
    it("should return shanten only for high-shanten hand", () => {
      const result = analyzeHand("147m258p369sESWN", 13);

      expect(result.shanten).toBeGreaterThanOrEqual(2);
      expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
    });

    it("should return full analysis for low-shanten hand", () => {
      const result = analyzeHand("123m456p789sEES", 13);

      expect(result).toHaveProperty("shanten");
      expect(result).toHaveProperty("hand");
      expect(result).toHaveProperty("elapsedMs");
    });

    it("should handle 14-tile hand", () => {
      const result = analyzeHand("1234m567p89sEESS", 14);

      expect(result).toHaveProperty("shanten");
      expect(result).toHaveProperty("hand");
      if ((result.shanten as number) <= 2 && result.discards) {
        expect(Array.isArray(result.discards)).toBe(true);
      }
    });

    it("should handle hand with melds", () => {
      const result = analyzeHand("[123m,1]456p789sEESS", 13);

      expect(result).toHaveProperty("shanten");
      expect(result).toHaveProperty("hand");
    });

    it("should handle invalid hand gracefully", () => {
      const result = analyzeHand("12m", 3);

      expect(result).toHaveProperty("shanten");
      expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
    });
  });
});
