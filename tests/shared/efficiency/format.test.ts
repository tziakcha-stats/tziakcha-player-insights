import { describe, it, expect } from "vitest";
import {
  formatShanten,
  formatAcceptance,
  formatDiscards,
  formatEfficiencyResult,
  formatQuickResult,
} from "../../../src/shared/efficiency/format";
import type {
  EfficiencyResult,
  Draw,
  Discard,
} from "../../../src/shared/efficiency/types";

describe("format", () => {
  describe("formatShanten", () => {
    it("should format -1 as 和了", () => {
      expect(formatShanten(-1)).toBe("和了");
    });

    it("should format 0 as 听牌", () => {
      expect(formatShanten(0)).toBe("听牌");
    });

    it("should format positive numbers as X向听", () => {
      expect(formatShanten(1)).toBe("1向听");
      expect(formatShanten(2)).toBe("2向听");
    });
  });

  describe("formatAcceptance", () => {
    it("should return 无进张 for empty array", () => {
      expect(formatAcceptance([])).toBe("无进张");
    });

    it("should format single acceptance", () => {
      const acceptance: Draw[] = [
        {
          tileId: 0,
          remainingCount: 2,
          shanten: 0,
          summary: {
            shanten: 0,
            isTenpai: true,
            acceptanceCount: 0,
            acceptanceTileCount: 0,
            efficiency: 0,
          },
        },
      ];

      const result = formatAcceptance(acceptance);
      expect(result).toContain("共2张");
      expect(result).toContain("1m×2");
    });
  });

  describe("formatDiscards", () => {
    it("should return 无推荐 for empty array", () => {
      expect(formatDiscards([])).toBe("无推荐");
    });

    it("should format best discard recommendation", () => {
      const discards: Discard[] = [
        {
          discardTileId: 0,
          shanten: 0,
          summary: {
            shanten: 0,
            isTenpai: true,
            acceptanceCount: 4,
            acceptanceTileCount: 12,
            efficiency: 1.5,
            expectedFan: 8.0,
            mainFans: ["不求人"],
          },
        },
        {
          discardTileId: 9,
          shanten: 0,
          summary: {
            shanten: 0,
            isTenpai: true,
            acceptanceCount: 2,
            acceptanceTileCount: 6,
            efficiency: 0.8,
          },
        },
      ];

      const result = formatDiscards(discards);
      expect(result).toContain("推荐打 1m");
      expect(result).toContain("效率: 1.50");
      expect(result).toContain("期望番: 8.0");
      expect(result).toContain("番型: 不求人");
      expect(result).toContain("备选:");
    });
  });

  describe("formatEfficiencyResult", () => {
    it("should format 14-tile result with discards", () => {
      const result: EfficiencyResult = {
        shanten: 1,
        isHu: false,
        tileCount: 14,
        hand: "1234m567p89sEESS",
        discards: [
          {
            discardTileId: 1,
            shanten: 0,
            summary: {
              shanten: 0,
              isTenpai: true,
              acceptanceCount: 2,
              acceptanceTileCount: 6,
              efficiency: 1.0,
              expectedFan: 8.0,
            },
          },
        ],
        elapsedMs: 100,
      };

      const formatted = formatEfficiencyResult(result);
      expect(formatted).toContain("手牌: 1234m567p89sEESS");
      expect(formatted).toContain("1向听");
      expect(formatted).toContain("推荐打");
      expect(formatted).toContain("耗时: 100ms");
    });

    it("should format 13-tile result with summary", () => {
      const result: EfficiencyResult = {
        shanten: 1,
        isHu: false,
        tileCount: 13,
        hand: "1234m567p89sEES",
        summary: {
          shanten: 1,
          isTenpai: false,
          acceptanceCount: 4,
          acceptanceTileCount: 12,
          efficiency: 2.0,
        },
        elapsedMs: 50,
      };

      const formatted = formatEfficiencyResult(result);
      expect(formatted).toContain("1向听");
      expect(formatted).toContain("进张种: 4");
      expect(formatted).toContain("效率: 2.00");
    });
  });

  describe("formatQuickResult", () => {
    it("should format quick result", () => {
      const result: EfficiencyResult = {
        shanten: 2,
        isHu: false,
        tileCount: 13,
        hand: "1234m567p89sEES",
        elapsedMs: 5,
      };

      const formatted = formatQuickResult(result);
      expect(formatted).toContain("手牌:");
      expect(formatted).toContain("2向听");
      expect(formatted).toContain("耗时: 5ms");
    });
  });
});
