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
 */
export function analyzeHand(
  handStr: string,
  tileCount: number,
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
