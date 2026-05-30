import { describe, it, expect } from "vitest";
import { formatEfficiencyResult } from "../../../src/shared/efficiency/format";

describe("formatEfficiencyResult", () => {
  it("should format basic result", () => {
    const result = {
      shanten: 2,
      isHu: false,
      tileCount: 13,
      hand: "13588m234s34579p",
      elapsedMs: 50,
    };

    const formatted = formatEfficiencyResult(result);
    expect(formatted).toContain("手牌: 13588m234s34579p");
    expect(formatted).toContain("向听: 2");
    expect(formatted).toContain("耗时: 50ms");
  });

  it("should format result with summary", () => {
    const result = {
      shanten: 1,
      isHu: false,
      tileCount: 13,
      hand: "13588m234s34579p",
      summary: {
        shanten: 1,
        acceptanceCount: 2,
        acceptanceTileCount: 8,
        efficiency: 2,
        expectedFan: 10.5,
        mainFans: [{ id: 50, name: "三色三步高", score: 6 }],
      },
      draws: [
        {
          tileId: 2,
          remainingCount: 4,
          shanten: 0,
          summary: {
            shanten: 0,
            efficiency: 1,
            expectedFan: 10.5,
            mainFans: [{ id: 50, name: "三色三步高", score: 6 }],
          },
        },
      ],
      elapsedMs: 100,
    };

    const formatted = formatEfficiencyResult(result);
    expect(formatted).toContain("进张种: 2");
    expect(formatted).toContain("效率: 2");
    expect(formatted).toContain("期望番: 10.5");
    expect(formatted).toContain("番型: 三色三步高");
    expect(formatted).toContain("--- 进张详情 ---");
    expect(formatted).toContain("3m×4");
  });

  it("should format 14-tile result with discards", () => {
    const result = {
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
            efficiency: 1.5,
            expectedFan: 8.0,
            mainFans: [{ id: 50, name: "三色三步高", score: 6 }],
          },
        },
      ],
      elapsedMs: 200,
    };

    const formatted = formatEfficiencyResult(result);
    expect(formatted).toContain("--- 打牌推荐 ---");
    expect(formatted).toContain("打2m");
    expect(formatted).toContain("效率1.5");
  });
});
