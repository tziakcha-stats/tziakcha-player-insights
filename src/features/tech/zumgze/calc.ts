import { FAN_ITEMS } from "../refs";

export type FanData = Record<string, number>;

// --- 相似度评分参数 ---
export const CHAGA_SIMILARITY_D = 21;
export const CHAGA_SIMILARITY_C = -0.23;
export const CHAGA_SIMILARITY_A = 4;

// --- 置信区间参数 ---
export const CHAGA_CI_Z95 = 1.96;
export const CHAGA_REF_SAMPLE_SIZE = 3416686;

export interface ZumgzeRow {
  name: string;
  playerPct: number;
  refPct: number;
  diff: number;
}

export interface ZumgzeStats {
  /** 各番种行数据 */
  rows: ZumgzeRow[];
  /** 平均差（zumgze 距离） */
  zumgze: number;
  /** CHAGA 度评分 */
  chagaSimilarity: number;
  /** CHAGA 度 95% 置信区间下界 */
  chagaScoreLower: number;
  /** CHAGA 度 95% 置信区间上界 */
  chagaScoreUpper: number;
}

/**
 * 将 zumgze 距离映射为 CHAGA 度评分（0~100）。
 * 使用 Sigmoid 变换后开方缩放：score = sqrt(σ(c·(d-D))) × 100 + A
 */
export function chagaScoreFromDistance(distance: number): number {
  const h =
    1 / (1 + Math.exp(-CHAGA_SIMILARITY_C * (distance - CHAGA_SIMILARITY_D)));
  const scoreRaw = Math.sqrt(h) * 100 + CHAGA_SIMILARITY_A;
  return Math.max(0, Math.min(100, scoreRaw));
}

/**
 * 根据玩家番种数据与参考分布，计算平均差、CHAGA 度及 95% 置信区间。
 *
 * @param fan       玩家番种计数，键格式为 `c{idx}` / `d{idx}`
 * @param refValues 参考分布，键为番种名，值为百分比（0~100）
 */
export function computeZumgzeStats(
  fan: FanData,
  refValues: Record<string, number>,
): ZumgzeStats {
  const total = (fan.c0 || 0) + (fan.d0 || 0);
  let zumgze = 0;

  const rows: ZumgzeRow[] = FAN_ITEMS.map(({ idx, name }) => {
    const count = (fan[`c${idx}`] || 0) + (fan[`d${idx}`] || 0);
    const playerPct = total ? (count / total) * 100 : 0;
    const refPct = refValues[name] ?? 0;
    const diff = playerPct - refPct;
    zumgze += Math.abs(diff);
    return { name, playerPct, refPct, diff };
  });

  // 概率空间下的总差值（用于置信区间计算）
  const dProb = rows.reduce(
    (sum, row) => sum + Math.abs(row.playerPct / 100 - row.refPct / 100),
    0,
  );

  // 方差：参考样本方差 + 玩家样本方差
  const varD = rows.reduce(
    (sum, row) =>
      sum +
      ((row.playerPct / 100) * (1 - row.playerPct / 100)) /
        CHAGA_REF_SAMPLE_SIZE +
      ((row.refPct / 100) * (1 - row.refPct / 100)) / Math.max(total, 1),
    0,
  );

  const seProb = Math.sqrt(Math.max(0, varD));
  const ciLowerProb = Math.max(0, dProb - CHAGA_CI_Z95 * seProb);
  const ciUpperProb = dProb + CHAGA_CI_Z95 * seProb;

  const chagaSimilarity = chagaScoreFromDistance(zumgze);
  const chagaScoreLower = chagaScoreFromDistance(ciLowerProb * 100);
  const chagaScoreUpper = chagaScoreFromDistance(ciUpperProb * 100);

  return { rows, zumgze, chagaSimilarity, chagaScoreLower, chagaScoreUpper };
}
