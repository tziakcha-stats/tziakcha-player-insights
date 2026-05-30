// @ts-expect-error 无类型声明
import { Shanten } from "gb-mahjong-js/lib/solver/shanten";
// @ts-expect-error 无类型声明
import Handtiles from "gb-mahjong-js/lib/core/handtiles";
import { analyzeHandDetailed } from "gb-mahjong-js/efficiency";
import { warnLog } from "../logger";

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

/**
 * 分析手牌，返回 gb-mahjong-js 原始结果
 * 向听 > 2 时只返回 shanten 基本信息
 */
export function analyzeHand(handTiles: number[]): Record<string, unknown> {
  const startTime = Date.now();
  const handStr = tilesToHandString(handTiles);

  const shanten = quickShanten(handStr);

  if (shanten > 2) {
    return {
      shanten,
      isHu: false,
      tileCount: handTiles.length,
      hand: handStr,
      elapsedMs: Date.now() - startTime,
    };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = analyzeHandDetailed(handStr, { fast: true }) as any;
    result.elapsedMs = Date.now() - startTime;
    return result;
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
