import { describe, it, expect } from "vitest";
import {
  formatShanten,
  formatAcceptance,
  formatEfficiencyResult,
  formatQuickResult,
} from "../../../src/shared/efficiency/format";
import type {
  EfficiencyResult,
  Draw,
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
      expect(formatShanten(3)).toBe("3向听");
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

    it("should format multiple acceptances", () => {
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
        {
          tileId: 9,
          remainingCount: 1,
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
      expect(result).toContain("共3张");
      expect(result).toContain("1m×2");
      expect(result).toContain("1p×1");
    });
  });

  describe("formatEfficiencyResult", () => {
    it("should format basic result", () => {
      const result: EfficiencyResult = {
        shanten: 0,
        isHu: false,
        tileCount: 13,
        hand: "123m456p789s11z",
        elapsedMs: 10,
      };

      const formatted = formatEfficiencyResult(result);
      expect(formatted).toContain("手牌: 123m456p789s11z");
      expect(formatted).toContain("向听: 听牌");
      expect(formatted).toContain("耗时: 10ms");
    });

    it("should format result with summary", () => {
      const result: EfficiencyResult = {
        shanten: 0,
        isHu: false,
        tileCount: 13,
        hand: "123m456p789s11z",
        summary: {
          shanten: 0,
          isTenpai: true,
          waits: [0, 3],
          acceptanceCount: 2,
          acceptanceTileCount: 6,
          efficiency: 0.5,
          expectedFan: 2.5,
          avgFan: 2.0,
          mainFans: ["立直", "一発"],
        },
        elapsedMs: 15,
      };

      const formatted = formatEfficiencyResult(result);
      expect(formatted).toContain("手牌: 123m456p789s11z");
      expect(formatted).toContain("向听: 听牌");
      expect(formatted).toContain("听牌");
      expect(formatted).toContain("进张种: 2");
      expect(formatted).toContain("进张数: 6");
      expect(formatted).toContain("效率: 0.50");
      expect(formatted).toContain("期望番数: 2.50");
      expect(formatted).toContain("平均番数: 2.00");
      expect(formatted).toContain("主要番型: 立直、一発");
      expect(formatted).toContain("耗时: 15ms");
    });
  });

  describe("formatQuickResult", () => {
    it("should format quick result", () => {
      const result: EfficiencyResult = {
        shanten: 2,
        isHu: false,
        tileCount: 13,
        hand: "123m456p789s11z",
        elapsedMs: 5,
      };

      const formatted = formatQuickResult(result);
      expect(formatted).toContain("手牌: 123m456p789s11z");
      expect(formatted).toContain("向听: 2向听");
      expect(formatted).toContain("耗时: 5ms");
    });

    it("should not include summary in quick result", () => {
      const result: EfficiencyResult = {
        shanten: 0,
        isHu: false,
        tileCount: 13,
        hand: "123m456p789s11z",
        summary: {
          shanten: 0,
          isTenpai: true,
          acceptanceCount: 2,
          acceptanceTileCount: 6,
          efficiency: 0.5,
        },
        elapsedMs: 5,
      };

      const formatted = formatQuickResult(result);
      expect(formatted).not.toContain("进张种");
      expect(formatted).not.toContain("进张数");
      expect(formatted).not.toContain("效率");
    });
  });
});
