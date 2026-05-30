import {
  analyzeHandDetailed,
  analyzeEfficiency,
} from "gb-mahjong-js/efficiency";
import { warnLog } from "../logger";
import type {
  AnalysisMode,
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
    acceptanceCount: summary.acceptanceCount,
    acceptanceTileCount: summary.acceptanceTileCount,
    efficiency: summary.efficiency,
    expectedFan: summary.expectedFan,
    avgFan: summary.avgFan,
    mainFans,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function determineAnalysisMode(handTiles: number[]): AnalysisMode {
  if (handTiles.length !== 13) {
    return "quick";
  }

  const handStr = tilesToHandString(handTiles);

  try {
    const result = analyzeHandDetailed(handStr, { compact: true, fast: true });
    return result.shanten <= 2 ? "full" : "quick";
  } catch {
    return "quick";
  }
}

export function analyzeHand(
  handTiles: number[],
  options: AnalysisOptions = {},
): EfficiencyResult {
  const startTime = Date.now();
  // 14 张手牌时去掉最后一张，避免枚举所有打牌选择导致超时
  const tiles = handTiles.length === 14 ? handTiles.slice(0, 13) : handTiles;
  const handStr = tilesToHandString(tiles);

  try {
    const result = analyzeHandDetailed(handStr, {
      fast: false,
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
    warnLog("[Efficiency] analyzeHand 失败，降级为快速分析:", error);
    return analyzeHandQuick(handTiles);
  }
}

export function analyzeHandQuick(handTiles: number[]): EfficiencyResult {
  const startTime = Date.now();

  // 14 张手牌时去掉最后一张，避免 analyzeEfficiency 枚举所有打牌选择导致超时
  const tiles = handTiles.length === 14 ? handTiles.slice(0, 13) : handTiles;
  const handStr = tilesToHandString(tiles);

  try {
    const result = analyzeEfficiency(handStr, { fast: true });

    return {
      shanten: result.shanten,
      isHu: result.isHu,
      tileCount: tiles.length,
      hand: result.hand,
      summary: mapSummary(result.summary),
      elapsedMs: Date.now() - startTime,
    };
  } catch (error) {
    warnLog("[Efficiency] analyzeHandQuick 失败:", error);
    return {
      shanten: 0,
      isHu: false,
      tileCount: tiles.length,
      hand: handStr,
      elapsedMs: Date.now() - startTime,
    };
  }
}
