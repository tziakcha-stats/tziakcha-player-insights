import { describe, it, expect } from "vitest";
import {
  formatEfficiencyResult,
  formatQuickResult,
  formatShanten,
  formatAcceptance,
} from "../../../src/shared/efficiency/format";
import { EfficiencyResult } from "../../../src/shared/efficiency/types";

describe("efficiency format", () => {
  const mockResult: EfficiencyResult = {
    shanten: 1,
    isHu: false,
    tileCount: 13,
    hand: "123m456p789s11z",
    summary: {
      shanten: 1,
      isTenpai: false,
      waits: [],
      acceptanceCount: 8,
      acceptanceTileCount: 24,
      efficiency: 6.0,
      expectedFan: 3.5,
      avgFan: 4.0,
      mainFans: ["平和", "断幺"],
    },
    elapsedMs: 15,
  };

  describe("formatShanten", () => {
    it("should format tenpai", () => {
      expect(formatShanten(0)).toBe("听牌");
    });

    it("should format 1-shanten", () => {
      expect(formatShanten(1)).toBe("一向听");
    });

    it("should format 2-shanten", () => {
      expect(formatShanten(2)).toBe("两向听");
    });
  });

  describe("formatAcceptance", () => {
    it("should format acceptance count", () => {
      expect(formatAcceptance(8, 24)).toBe("进张: 8种/24枚");
    });
  });

  describe("formatEfficiencyResult", () => {
    it("should format full result", () => {
      const formatted = formatEfficiencyResult(mockResult);

      expect(formatted).toContain("一向听");
      expect(formatted).toContain("进张: 8种/24枚");
      expect(formatted).toContain("效率: 6.00");
      expect(formatted).toContain("期望番数: 3.5");
      expect(formatted).toContain("主要番种: 平和、断幺");
    });

    it("should handle missing optional fields", () => {
      const minimalResult: EfficiencyResult = {
        shanten: 2,
        isHu: false,
        tileCount: 13,
        hand: "123m456p789s11z",
        elapsedMs: 5,
      };

      const formatted = formatEfficiencyResult(minimalResult);
      expect(formatted).toContain("两向听");
    });
  });

  describe("formatQuickResult", () => {
    it("should format quick result", () => {
      const formatted = formatQuickResult(mockResult);

      expect(formatted).toContain("一向听");
      expect(formatted).toContain("进张: 8种/24枚");
      expect(formatted).not.toContain("主要番种"); // 快速模式不显示番种
    });
  });
});
