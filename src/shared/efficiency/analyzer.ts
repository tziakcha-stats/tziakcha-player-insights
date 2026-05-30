// @ts-expect-error 无类型声明
import { Shanten } from "gb-mahjong-js/lib/solver/shanten";
// @ts-expect-error 无类型声明
import Handtiles from "gb-mahjong-js/lib/core/handtiles";
import { analyzeHandDetailed } from "gb-mahjong-js/efficiency";
import { warnLog } from "../logger";

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
 * @param handStr 手牌字符串（可能包含副露前缀如 [999m,1]）
 * @param tileCount 手牌总张数（含副露）
 * @param closedTileIds 闭门手牌的 tileId 数组，用于过滤无效打牌推荐
 */
export function analyzeHand(
  handStr: string,
  tileCount: number,
  closedTileIds: number[] = [],
): Record<string, unknown> {
  const startTime = Date.now();

  const shanten = quickShanten(handStr);

  if (shanten > 2) {
    return {
      shanten,
      isHu: false,
      tileCount,
      hand: handStr,
      elapsedMs: Date.now() - startTime,
    };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = analyzeHandDetailed(handStr, { fast: true }) as any;
    result.elapsedMs = Date.now() - startTime;

    // 过滤掉不在闭门手牌中的打牌推荐（gb-mahjong-js 副露分析 bug）
    if (result.discards && closedTileIds.length > 0) {
      const closedSet = new Set(closedTileIds);
      result.discards = result.discards.filter((d: { discardTileId: number }) =>
        closedSet.has(d.discardTileId),
      );
    }

    return result;
  } catch (error) {
    warnLog("[Efficiency] analyzeHand 失败:", error);
    return {
      shanten,
      isHu: false,
      tileCount,
      hand: handStr,
      elapsedMs: Date.now() - startTime,
    };
  }
}
