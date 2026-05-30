/**
 * 格式化 gb-mahjong-js 原始结果为可读文本
 */
export function formatEfficiencyResult(
  result: Record<string, unknown>,
): string {
  const lines: string[] = [];

  lines.push(`手牌: ${result.hand}`);
  lines.push(`向听: ${result.shanten}`);

  if (result.isHu) {
    lines.push("和了");
  }

  const summary = result.summary as Record<string, unknown> | undefined;
  if (summary) {
    if (summary.acceptanceCount) {
      lines.push(`进张种: ${summary.acceptanceCount}`);
    }
    if (summary.acceptanceTileCount) {
      lines.push(`进张数: ${summary.acceptanceTileCount}`);
    }
    if (summary.efficiency) {
      lines.push(`效率: ${summary.efficiency}`);
    }
    if (summary.expectedFan != null) {
      lines.push(`期望番: ${summary.expectedFan}`);
    }
    if (summary.mainFans && Array.isArray(summary.mainFans)) {
      const names = summary.mainFans.map((f: unknown) =>
        typeof f === "string" ? f : (f as Record<string, unknown>).name,
      );
      lines.push(`番型: ${names.join("、")}`);
    }
  }

  // 14 张：显示打牌推荐
  const discards = result.discards as
    | Array<Record<string, unknown>>
    | undefined;
  if (discards && discards.length > 0) {
    lines.push("--- 打牌推荐 ---");
    for (const d of discards.slice(0, 5)) {
      const tile = tileIdToString(d.discardTileId as number);
      const s = d.summary as Record<string, unknown> | undefined;
      const parts = [`打${tile}`];
      if (s) {
        parts.push(`向听${s.shanten}`);
        if (s.efficiency) parts.push(`效率${s.efficiency}`);
        if (s.expectedFan != null) parts.push(`期望番${s.expectedFan}`);
        if (s.mainFans && Array.isArray(s.mainFans)) {
          const names = s.mainFans.map((f: unknown) =>
            typeof f === "string" ? f : (f as Record<string, unknown>).name,
          );
          parts.push(names.join("/"));
        }
      }
      lines.push(parts.join(" | "));
    }
  }

  // 13 张：显示进张详情
  const draws = result.draws as Array<Record<string, unknown>> | undefined;
  if (draws && draws.length > 0) {
    lines.push("--- 进张详情 ---");
    for (const draw of draws) {
      const tile = tileIdToString(draw.tileId as number);
      const count = draw.remainingCount;
      const s = draw.summary as Record<string, unknown> | undefined;
      const parts = [`${tile}×${count}`];
      if (s) {
        if (s.efficiency) parts.push(`效率${s.efficiency}`);
        if (s.expectedFan != null) parts.push(`期望番${s.expectedFan}`);
        if (s.mainFans && Array.isArray(s.mainFans)) {
          const names = s.mainFans.map((f: unknown) =>
            typeof f === "string" ? f : (f as Record<string, unknown>).name,
          );
          parts.push(names.join("/"));
        }
      }
      lines.push(parts.join(" | "));
    }
  }

  if (result.elapsedMs != null) {
    lines.push(`耗时: ${result.elapsedMs}ms`);
  }

  return lines.join("\n");
}

function tileIdToString(tileId: number): string {
  // 解析器 tileId: m(1-9), s(10-18), p(19-27), z(28-34)
  if (tileId >= 1 && tileId <= 9) return `${tileId}m`;
  if (tileId >= 10 && tileId <= 18) return `${tileId - 9}s`;
  if (tileId >= 19 && tileId <= 27) return `${tileId - 18}p`;

  // 字牌 z(28-34)
  const windNames = ["东", "南", "西", "北"];
  const dragonNames = ["白", "發", "中"];
  const index = tileId - 28;
  if (index < 4) return windNames[index];
  return dragonNames[index - 4];
}
