// @ts-expect-error 无类型声明
import { Shanten } from "gb-mahjong-js/lib/solver/shanten";
// @ts-expect-error 无类型声明
import Handtiles from "gb-mahjong-js/lib/core/handtiles";
import { analyzeHandDetailed } from "gb-mahjong-js/efficiency";
import { warnLog } from "../logger";
import type {
  EfficiencyResult,
  AnalysisOptions,
  Summary,
  Discard,
  Draw,
} from "./types";

function tilesToHandString(handTiles: number[]): string {
  const suits = ["m", "p", "s", "z"];
  const tilesBySuit: Record<string, number[]> = {
    m: [],
    p: [],
    s: [],
    z: [],
  };

  for (const tileId of handTiles) {
    let suit: string;
    let rank: number;

    if (tileId < 9) {
      suit = "m";
      rank = tileId + 1;
    } else if (tileId < 18) {
      suit = "p";
      rank = tileId - 8;
    } else if (tileId < 27) {
      suit = "s";
      rank = tileId - 17;
    } else {
      suit = "z";
      rank = tileId - 26;
    }

    tilesBySuit[suit].push(rank);
  }

  let handStr = "";
  for (const suit of suits) {
    if (tilesBySuit[suit].length > 0) {
      tilesBySuit[suit].sort((a, b) => a - b);
      handStr += tilesBySuit[suit].join("") + suit;
    }
  }

  return handStr;
}

function quickShanten(handStr: string): number {
  try {
    const ht = new Handtiles();
    const code = ht.StringToHandtiles(handStr);
    if (code !== 0) return Infinity;
    const result = Shanten.calcAll(ht);
    return Math.min(
      result.normal ?? Infinity,
      result.qidui ?? Infinity,
      result.shisanyao ?? Infinity,
      result.quanbukao ?? Infinity,
      result.zuhelong ?? Infinity,
    );
  } catch {
    return Infinity;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapSummary(summary: any): Summary | undefined {
  if (!summary) return undefined;

  const mainFans = Array.isArray(summary.mainFans)
    ? summary.mainFans.map((fan: any) =>
        typeof fan === "string" ? fan : fan.name,
      )
    : undefined;

  return {
    shanten: summary.shanten,
    isTenpai: summary.shanten === 0,
    waits: summary.waits,
    acceptanceCount: summary.acceptanceCount,
    acceptanceTileCount: summary.acceptanceTileCount,
    efficiency: summary.efficiency,
    expectedFan: summary.expectedFan,
    avgFan: summary.avgFan,
    mainFans,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const EMPTY_RESULT: EfficiencyResult = {
  shanten: 0,
  isHu: false,
  tileCount: 0,
  hand: "",
  elapsedMs: 0,
};

export function analyzeHand(
  handTiles: number[],
  options: AnalysisOptions = {},
): EfficiencyResult {
  const startTime = Date.now();
  const handStr = tilesToHandString(handTiles);

  // 第一步：快速计算向听数（~30ms）
  const shanten = quickShanten(handStr);

  // 向听 > 2：只返回向听信息，跳过效率计算
  if (shanten > 2) {
    return {
      ...EMPTY_RESULT,
      shanten,
      tileCount: handTiles.length,
      hand: handStr,
      elapsedMs: Date.now() - startTime,
    };
  }

  // 第二步：向听 <= 2，执行完整效率分析
  try {
    const result = analyzeHandDetailed(handStr, {
      fast: true,
      ...options,
    });

    return {
      shanten: result.shanten,
      isHu: result.isHu,
      tileCount: result.tileCount,
      hand: result.hand,
      summary: mapSummary(result.summary),
      discards: result.discards?.map(
        (d: any): Discard => ({
          discardTileId: d.discardTileId!,
          shanten: d.shanten,
          summary: mapSummary(d.summary)!,
        }),
      ),
      acceptance: (result.acceptance ?? result.draws)?.map(
        (a: any): Draw => ({
          tileId: a.tileId!,
          remainingCount: a.remainingCount ?? 0,
          shanten: a.shanten,
          summary: mapSummary(a.summary)!,
        }),
      ),
      elapsedMs: Date.now() - startTime,
    };
  } catch (error) {
    warnLog("[Efficiency] analyzeHand 失败:", error);
    return {
      shanten,
      isHu: false,
      tileCount: handTiles.length,
      hand: handStr,
      elapsedMs: Date.now() - startTime,
    };
  }
}
