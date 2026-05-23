import { EfficiencyResult } from "./types";

export function formatShanten(shanten: number): string {
  if (shanten <= 0) return "听牌";
  if (shanten === 1) return "一向听";
  if (shanten === 2) return "两向听";
  if (shanten === 3) return "三向听";
  return `${shanten}向听`;
}

export function formatAcceptance(count: number, tileCount: number): string {
  return `进张: ${count}种/${tileCount}枚`;
}

export function formatEfficiency(efficiency: number): string {
  return `效率: ${efficiency.toFixed(2)}`;
}

export function formatExpectedFan(expectedFan: number): string {
  return `期望番数: ${expectedFan.toFixed(1)}`;
}

export function formatMainFans(fans: string[]): string {
  if (fans.length === 0) return "";
  return `主要番种: ${fans.join("、")}`;
}

export function formatEfficiencyResult(result: EfficiencyResult): string {
  const lines: string[] = [];

  lines.push(formatShanten(result.shanten));
  lines.push(`手牌: ${result.hand}`);

  if (result.summary) {
    const { summary } = result;

    if (summary.acceptanceCount > 0) {
      lines.push(
        formatAcceptance(summary.acceptanceCount, summary.acceptanceTileCount),
      );
    }

    if (summary.efficiency > 0) {
      lines.push(formatEfficiency(summary.efficiency));
    }

    if (typeof summary.expectedFan === "number") {
      lines.push(formatExpectedFan(summary.expectedFan));
    }

    if (summary.mainFans && summary.mainFans.length > 0) {
      lines.push(formatMainFans(summary.mainFans));
    }
  }

  return lines.join("\n");
}

export function formatQuickResult(result: EfficiencyResult): string {
  const lines: string[] = [];

  lines.push(formatShanten(result.shanten));
  lines.push(`手牌: ${result.hand}`);

  if (result.summary && result.summary.acceptanceCount > 0) {
    lines.push(
      formatAcceptance(
        result.summary.acceptanceCount,
        result.summary.acceptanceTileCount,
      ),
    );
  }

  return lines.join("\n");
}
