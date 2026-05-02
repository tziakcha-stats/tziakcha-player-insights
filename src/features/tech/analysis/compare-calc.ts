import { FAN_NAMES } from "../../game/win-info";
import { chagaScoreFromDistance } from "../zumgze/calc";

export type FanData = Record<string, number>;

export type FanGroup = "all" | "small" | "main" | "high";

export interface FanDiffRow {
  fanIndex: number;
  fanName: string;
  rateA: number;
  rateB: number;
  diffPct: number;
}

export interface OverallStdCi {
  std: number;
  ciLower: number;
  ciUpper: number;
  sampleSize: number;
}

export interface SimilarityScore {
  score: number;
  ciLower: number;
  ciUpper: number;
  distance: number;
}

export interface MetricDiffRow {
  key: string;
  label: string;
  valueA: number;
  valueB: number;
  diff: number;
}

export interface MetricSpec {
  key: string;
  label: string;
  calc: (
    basic: Record<string, number>,
    whole: Record<string, number>,
  ) => number;
}

const Z_95 = 1.96;
const SKIP_FAN_INDEX = new Set([0, 83]);

function toCount(value: unknown): number {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return 0;
  }
  return num;
}

function getFanTotal(fan: FanData): number {
  return toCount(fan.c0) + toCount(fan.d0);
}

export function getFanTotalCount(fan: FanData): number {
  return getFanTotal(fan);
}

function getFanCount(fan: FanData, idx: number): number {
  return toCount(fan[`c${idx}`]) + toCount(fan[`d${idx}`]);
}

function safeRate(count: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return count / total;
}

function fanPointByIndex(index: number): number {
  if (index >= 1 && index <= 7) return 88;
  if (index >= 8 && index <= 13) return 64;
  if (index >= 14 && index <= 15) return 48;
  if (index >= 16 && index <= 19) return 32;
  if (index >= 20 && index <= 28) return 24;
  if (index >= 29 && index <= 35) return 16;
  if (index >= 36 && index <= 40) return 12;
  if (index >= 41 && index <= 49) return 8;
  if (index >= 50 && index <= 56) return 6;
  if (index >= 57 && index <= 60) return 4;
  if (index >= 61 && index <= 70) return 2;
  if (index >= 71 && index <= 82) return 1;
  if (index === 84) return 5;
  if (index >= 85 && index <= 88) return 8;
  return 0;
}

function inFanGroup(index: number, group: FanGroup): boolean {
  const point = fanPointByIndex(index);
  if (group === "small") {
    return point <= 2;
  }
  if (group === "main") {
    return point >= 4 && point <= 32;
  }
  if (group === "high") {
    return point >= 48;
  }
  return true;
}

function isOneOrTwoFan(index: number): boolean {
  const point = fanPointByIndex(index);
  return point === 1 || point === 2;
}

export function buildFanDiffRows(
  fanA: FanData = {},
  fanB: FanData = {},
): FanDiffRow[] {
  const totalA = getFanTotal(fanA);
  const totalB = getFanTotal(fanB);
  const rows: FanDiffRow[] = [];

  for (let fanIndex = 0; fanIndex < FAN_NAMES.length; fanIndex += 1) {
    if (SKIP_FAN_INDEX.has(fanIndex)) {
      continue;
    }

    const countA = getFanCount(fanA, fanIndex);
    const countB = getFanCount(fanB, fanIndex);

    if (countA === 0 && countB === 0) {
      continue;
    }

    const pA = safeRate(countA, totalA);
    const pB = safeRate(countB, totalB);

    rows.push({
      fanIndex,
      fanName: FAN_NAMES[fanIndex] || `番种${fanIndex}`,
      rateA: pA * 100,
      rateB: pB * 100,
      diffPct: (pA - pB) * 100,
    });
  }

  return rows;
}

export function filterFanDiffRowsByGroup(
  rows: FanDiffRow[],
  group: FanGroup,
): FanDiffRow[] {
  return rows.filter((row) => inFanGroup(row.fanIndex, group));
}

export function splitTopFanDiffRows(
  rows: FanDiffRow[],
  topN: number,
): {
  positive: FanDiffRow[];
  negative: FanDiffRow[];
} {
  const limit = Number.isFinite(topN) ? Math.max(1, Math.floor(topN)) : 10;

  const positive = [...rows]
    .filter((row) => row.diffPct > 0)
    .sort((left, right) => right.diffPct - left.diffPct)
    .slice(0, limit);

  const negative = [...rows]
    .filter((row) => row.diffPct < 0)
    .sort((left, right) => left.diffPct - right.diffPct)
    .slice(0, limit);

  return { positive, negative };
}

export function computeMeanAbsDiff(rows: FanDiffRow[]): number {
  if (!rows.length) {
    return 0;
  }
  const sumAbs = rows.reduce((sum, row) => sum + Math.abs(row.diffPct), 0);
  return sumAbs / rows.length;
}

export function computeSimilarityScore(
  rows: FanDiffRow[],
  totalA: number,
  totalB: number,
): SimilarityScore {
  const usedRows = rows.filter((row) => !isOneOrTwoFan(row.fanIndex));
  if (!usedRows.length) {
    return {
      score: 100,
      ciLower: 100,
      ciUpper: 100,
      distance: 0,
    };
  }

  const dProb = usedRows.reduce(
    (sum, row) => sum + Math.abs(row.rateA / 100 - row.rateB / 100),
    0,
  );

  const nA = Math.max(1, totalA);
  const nB = Math.max(1, totalB);
  const varD = usedRows.reduce((sum, row) => {
    const pA = row.rateA / 100;
    const pB = row.rateB / 100;
    return sum + (pA * (1 - pA)) / nA + (pB * (1 - pB)) / nB;
  }, 0);

  const seProb = Math.sqrt(Math.max(0, varD));
  const z95 = 1.96;
  const ciLowerProb = Math.max(0, dProb - z95 * seProb);
  const ciUpperProb = dProb + z95 * seProb;

  const score = chagaScoreFromDistance(dProb * 100);
  const scoreFromLower = chagaScoreFromDistance(ciLowerProb * 100);
  const scoreFromUpper = chagaScoreFromDistance(ciUpperProb * 100);

  return {
    score,
    ciLower: Math.min(scoreFromLower, scoreFromUpper),
    ciUpper: Math.max(scoreFromLower, scoreFromUpper),
    distance: dProb * 100,
  };
}

export function computeOverallStdCi(rows: FanDiffRow[]): OverallStdCi {
  const n = rows.length;
  if (n < 2) {
    return { std: 0, ciLower: 0, ciUpper: 0, sampleSize: n };
  }

  const mean = rows.reduce((sum, row) => sum + row.diffPct, 0) / n;
  const variance =
    rows.reduce((sum, row) => sum + (row.diffPct - mean) ** 2, 0) / (n - 1);
  const std = Math.sqrt(Math.max(0, variance));

  // Approximate standard error for standard deviation.
  const seStd = std / Math.sqrt(2 * (n - 1));
  const ciLower = Math.max(0, std - Z_95 * seStd);
  const ciUpper = std + Z_95 * seStd;

  return { std, ciLower, ciUpper, sampleSize: n };
}

function toBasic(data: unknown): Record<string, number> {
  if (!data || typeof data !== "object") {
    return {};
  }
  return data as Record<string, number>;
}

export function computeMetricDiffRows(
  specs: MetricSpec[],
  dataA: { basic?: Record<string, number>; whole?: Record<string, number> },
  dataB: { basic?: Record<string, number>; whole?: Record<string, number> },
): MetricDiffRow[] {
  const basicA = toBasic(dataA?.basic);
  const basicB = toBasic(dataB?.basic);
  const wholeA = toBasic(dataA?.whole);
  const wholeB = toBasic(dataB?.whole);

  return specs.map((spec) => {
    const valueA = Number(spec.calc(basicA, wholeA)) || 0;
    const valueB = Number(spec.calc(basicB, wholeB)) || 0;
    return {
      key: spec.key,
      label: spec.label,
      valueA,
      valueB,
      diff: valueA - valueB,
    };
  });
}
