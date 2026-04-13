import { describe, expect, it } from "vitest";
import {
  buildFanDiffRows,
  computeMetricDiffRows,
  computeSimilarityScore,
  filterFanDiffRowsByGroup,
  getFanTotalCount,
  splitTopFanDiffRows,
  type MetricSpec,
} from "../../src/features/tech/analysis/compare-calc";

describe("tech style compare calc", () => {
  it("computes fan diff rows and skips all-zero rows", () => {
    const playerA = {
      fan: { c0: 100, d0: 0, c71: 40, d71: 0, c45: 10 },
    };
    const playerB = {
      fan: { c0: 80, d0: 0, c71: 8, d71: 0, c45: 24 },
    };

    const rows = buildFanDiffRows(playerA.fan, playerB.fan);
    const byIdx = new Map(rows.map((row) => [row.fanIndex, row]));
    const yiban = byIdx.get(71);
    const wufan = byIdx.get(45);

    expect(yiban).toBeTruthy();
    expect(wufan).toBeTruthy();
    expect(yiban?.diffPct).toBeCloseTo(30, 6);
    expect(wufan?.diffPct).toBeCloseTo(-20, 6);
    expect(byIdx.has(1)).toBe(false);
  });

  it("filters rows by fan groups", () => {
    const rows = [
      { fanIndex: 71, fanName: "一般高", rateA: 10, rateB: 5, diffPct: 5 }, // 1番
      { fanIndex: 61, fanName: "箭刻", rateA: 4, rateB: 7, diffPct: -3 }, // 2番
      { fanIndex: 50, fanName: "碰碰和", rateA: 2, rateB: 1, diffPct: 1 }, // 6番
      { fanIndex: 29, fanName: "清龙", rateA: 1, rateB: 3, diffPct: -2 }, // 16番
      { fanIndex: 8, fanName: "清幺九", rateA: 1, rateB: 0, diffPct: 1 }, // 64番
    ];

    expect(
      filterFanDiffRowsByGroup(rows, "small").map((item) => item.fanIndex),
    ).toEqual([71, 61]);
    expect(
      filterFanDiffRowsByGroup(rows, "main").map((item) => item.fanIndex),
    ).toEqual([50, 29]);
    expect(
      filterFanDiffRowsByGroup(rows, "high").map((item) => item.fanIndex),
    ).toEqual([8]);
  });

  it("splits top positive and negative rows", () => {
    const rows = [
      { fanIndex: 1, fanName: "A", rateA: 10, rateB: 5, diffPct: 5 },
      { fanIndex: 2, fanName: "B", rateA: 2, rateB: 5, diffPct: -3 },
      { fanIndex: 3, fanName: "C", rateA: 4, rateB: 2, diffPct: 2 },
      { fanIndex: 4, fanName: "D", rateA: 1, rateB: 9, diffPct: -8 },
    ];

    const split = splitTopFanDiffRows(rows, 1);
    expect(split.positive).toHaveLength(1);
    expect(split.negative).toHaveLength(1);
    expect(split.positive[0].fanName).toBe("A");
    expect(split.negative[0].fanName).toBe("D");
  });

  it("computes similarity score and 95% ci", () => {
    const fanA = { c0: 100, d0: 0, c71: 30, c61: 15, c50: 10 };
    const fanB = { c0: 90, d0: 0, c71: 10, c61: 20, c50: 25 };
    const rows = buildFanDiffRows(fanA, fanB);
    const stats = computeSimilarityScore(
      rows,
      getFanTotalCount(fanA),
      getFanTotalCount(fanB),
    );

    expect(stats.score).toBeGreaterThanOrEqual(0);
    expect(stats.score).toBeLessThanOrEqual(100);
    expect(stats.ciUpper).toBeGreaterThanOrEqual(stats.ciLower);
    expect(stats.distance).toBeGreaterThan(0);
  });

  it("computes ordered metric diff rows", () => {
    const specs: MetricSpec[] = [
      {
        key: "win_rate",
        label: "和牌率",
        calc: (basic) =>
          (((basic.claim || 0) + (basic.draw || 0)) /
            ((basic.claim || 0) +
              (basic.draw || 0) +
              (basic.shoot || 0) +
              (basic.splash || 0) +
              (basic.watch || 0) +
              (basic.tie || 0) || 1)) *
          100,
      },
      {
        key: "avg_win_cycle",
        label: "和牌巡数",
        calc: () => 9.5,
      },
    ];

    const rows = computeMetricDiffRows(
      specs,
      {
        basic: {
          claim: 50,
          draw: 10,
          shoot: 20,
          splash: 10,
          watch: 0,
          tie: 10,
        },
      },
      {
        basic: {
          claim: 20,
          draw: 10,
          shoot: 30,
          splash: 10,
          watch: 20,
          tie: 10,
        },
      },
    );

    expect(rows).toHaveLength(2);
    expect(rows[0].key).toBe("win_rate");
    expect(rows[0].diff).toBeGreaterThan(0);
    expect(rows[1].valueA).toBeCloseTo(9.5, 6);
    expect(rows[1].valueB).toBeCloseTo(9.5, 6);
    expect(rows[1].diff).toBeCloseTo(0, 6);
  });
});
