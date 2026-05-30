import type { EfficiencyResult, Summary, Discard, Draw } from "./types";

/**
 * 向听数转文字
 */
export function formatShanten(shanten: number): string {
  if (shanten === -1) return "和了";
  if (shanten === 0) return "听牌";
  return `${shanten}向听`;
}

/**
 * 格式化进张信息（13 张手牌）
 */
export function formatAcceptance(acceptance: Draw[]): string {
  if (!acceptance || acceptance.length === 0) {
    return "无进张";
  }

  const totalTiles = acceptance.reduce((sum, a) => sum + a.remainingCount, 0);
  const tileNames = acceptance
    .map((a) => `${tileIdToString(a.tileId)}×${a.remainingCount}`)
    .join(" ");

  return `共${totalTiles}张: ${tileNames}`;
}

/**
 * 格式化打牌推荐（14 张手牌）
 */
export function formatDiscards(discards: Discard[]): string {
  if (!discards || discards.length === 0) {
    return "无推荐";
  }

  const best = discards[0];
  const lines = [`推荐打 ${tileIdToString(best.discardTileId)}`];

  if (best.summary) {
    const s = best.summary;
    const parts: string[] = [];
    parts.push(`向听: ${formatShanten(s.shanten)}`);
    if (s.efficiency > 0) parts.push(`效率: ${s.efficiency.toFixed(2)}`);
    if (typeof s.expectedFan === "number")
      parts.push(`期望番: ${s.expectedFan.toFixed(1)}`);
    if (s.mainFans && s.mainFans.length > 0)
      parts.push(`番型: ${s.mainFans.join("、")}`);
    lines.push(parts.join(" | "));
  }

  if (discards.length > 1) {
    const alts = discards
      .slice(1, 4)
      .map(
        (d) =>
          `${tileIdToString(d.discardTileId)}(${d.summary?.efficiency?.toFixed(1) ?? "?"})`,
      )
      .join(" ");
    lines.push(`备选: ${alts}`);
  }

  return lines.join("\n");
}

/**
 * 格式化完整分析结果
 */
export function formatEfficiencyResult(result: EfficiencyResult): string {
  const lines: string[] = [];

  lines.push(`手牌: ${result.hand}`);
  lines.push(`向听: ${formatShanten(result.shanten)}`);

  // 14 张：显示打牌推荐
  if (result.discards && result.discards.length > 0) {
    lines.push(formatDiscards(result.discards));
  }

  // 13 张：显示进张信息
  if (result.summary) {
    lines.push(formatSummary(result.summary));
  }

  if (result.elapsedMs !== undefined) {
    lines.push(`耗时: ${result.elapsedMs}ms`);
  }

  return lines.join("\n");
}

/**
 * 格式化快速分析结果
 */
export function formatQuickResult(result: EfficiencyResult): string {
  const lines: string[] = [];

  lines.push(`手牌: ${result.hand}`);
  lines.push(`向听: ${formatShanten(result.shanten)}`);

  if (result.elapsedMs !== undefined) {
    lines.push(`耗时: ${result.elapsedMs}ms`);
  }

  return lines.join("\n");
}

/**
 * 格式化摘要信息
 */
function formatSummary(summary: Summary): string {
  const parts: string[] = [];

  if (summary.acceptanceCount > 0) {
    parts.push(`进张种: ${summary.acceptanceCount}`);
  }

  if (summary.acceptanceTileCount > 0) {
    parts.push(`进张数: ${summary.acceptanceTileCount}`);
  }

  if (summary.efficiency > 0) {
    parts.push(`效率: ${summary.efficiency.toFixed(2)}`);
  }

  if (typeof summary.expectedFan === "number") {
    parts.push(`期望番: ${summary.expectedFan.toFixed(1)}`);
  }

  if (summary.mainFans && summary.mainFans.length > 0) {
    parts.push(`番型: ${summary.mainFans.join("、")}`);
  }

  return parts.join(" | ");
}

export function formatEfficiency(efficiency: number): string {
  return efficiency.toFixed(2);
}

export function formatExpectedFan(expectedFan: number): string {
  return expectedFan.toFixed(2);
}

export function formatMainFans(mainFans: string[]): string {
  return mainFans.join("、");
}

/**
 * 牌 ID 转字符串
 */
function tileIdToString(tileId: number): string {
  const suits = ["m", "p", "s", "z"];
  const suitIndex = Math.floor(tileId / 9);
  const rank = (tileId % 9) + 1;

  if (suitIndex < 3) {
    return `${rank}${suits[suitIndex]}`;
  } else {
    const windNames = ["东", "南", "西", "北"];
    const dragonNames = ["白", "發", "中"];
    const index = tileId - 27;

    if (index < 4) {
      return windNames[index];
    } else {
      return dragonNames[index - 4];
    }
  }
}
