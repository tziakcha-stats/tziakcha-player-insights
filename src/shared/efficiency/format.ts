import type { EfficiencyResult, Summary, Draw } from "./types";

/**
 * Format shanten number to human readable string
 */
export function formatShanten(shanten: number): string {
  if (shanten === -1) return "和了";
  if (shanten === 0) return "听牌";
  return `${shanten}向听`;
}

/**
 * Format acceptance (进张) information
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
 * Format efficiency result for display
 */
export function formatEfficiencyResult(result: EfficiencyResult): string {
  const lines: string[] = [];

  lines.push(`手牌: ${result.hand}`);
  lines.push(`向听: ${formatShanten(result.shanten)}`);

  if (result.summary) {
    lines.push(formatSummary(result.summary));
  }

  if (result.elapsedMs !== undefined) {
    lines.push(`耗时: ${result.elapsedMs}ms`);
  }

  return lines.join("\n");
}

/**
 * Format quick analysis result
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
 * Format summary information
 */
function formatSummary(summary: Summary): string {
  const parts: string[] = [];

  if (summary.isTenpai) {
    parts.push("听牌");
    if (summary.waits && summary.waits.length > 0) {
      const waitNames = summary.waits.map(tileIdToString).join(" ");
      parts.push(`等待: ${waitNames}`);
    }
  }

  if (summary.acceptanceCount !== undefined) {
    parts.push(`进张种: ${summary.acceptanceCount}`);
  }

  if (summary.acceptanceTileCount !== undefined) {
    parts.push(`进张数: ${summary.acceptanceTileCount}`);
  }

  if (summary.efficiency !== undefined) {
    parts.push(`效率: ${summary.efficiency.toFixed(2)}`);
  }

  if (summary.expectedFan !== undefined) {
    parts.push(`期望番数: ${summary.expectedFan.toFixed(2)}`);
  }

  if (summary.avgFan !== undefined) {
    parts.push(`平均番数: ${summary.avgFan.toFixed(2)}`);
  }

  if (summary.mainFans && summary.mainFans.length > 0) {
    parts.push(`主要番型: ${summary.mainFans.join("、")}`);
  }

  return parts.join(" | ");
}

/**
 * Format efficiency value
 */
export function formatEfficiency(efficiency: number): string {
  return efficiency.toFixed(2);
}

/**
 * Format expected fan value
 */
export function formatExpectedFan(expectedFan: number): string {
  return expectedFan.toFixed(2);
}

/**
 * Format main fans list
 */
export function formatMainFans(mainFans: string[]): string {
  return mainFans.join("、");
}

/**
 * Convert tile ID to string representation
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
