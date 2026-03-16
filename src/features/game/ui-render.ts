import { infoLog } from "../../shared/logger";
import { MetricsResult, RoundOutcome } from "./types";
import { UI_RETRY_INTERVAL_MS, UI_RETRY_MAX_COUNT } from "./constants";

function findStandardScoreRow(): HTMLTableRowElement | null {
  const selectors = ["table.table tr", "table tr"];
  for (const selector of selectors) {
    const found = Array.from(document.querySelectorAll(selector)).find((row) =>
      (row.querySelector("th")?.textContent || "").includes("标准分"),
    );
    if (found) {
      return found as HTMLTableRowElement;
    }
  }
  return null;
}

function parseRoundNoFromRow(row: HTMLTableRowElement): number | null {
  const cells = Array.from(row.children) as HTMLTableCellElement[];
  for (const cell of cells) {
    const text = (cell.textContent || "").trim();
    if (!text || !/^\d{1,3}$/.test(text)) {
      continue;
    }
    const value = Number(text);
    if (Number.isFinite(value) && value > 0 && value <= 128) {
      return value;
    }
  }
  return null;
}

function findRoundTable(): HTMLTableElement | null {
  const tables = Array.from(
    document.querySelectorAll("table"),
  ) as HTMLTableElement[];
  let best: { table: HTMLTableElement; score: number } | null = null;

  for (const table of tables) {
    const rows = Array.from(
      table.querySelectorAll("tr"),
    ) as HTMLTableRowElement[];
    const hasRoundHeader = rows.some((row) =>
      Array.from(row.children).some(
        (cell) =>
          (cell.textContent || "").trim().includes("盘序") ||
          (cell.textContent || "").trim().includes("序"),
      ),
    );

    const numericRows = rows.filter(
      (row) => parseRoundNoFromRow(row) !== null,
    ).length;
    const score = (hasRoundHeader ? 1000 : 0) + numericRows;

    if (!best || score > best.score) {
      best = { table, score };
    }
  }

  if (!best || best.score <= 0) {
    return null;
  }
  return best.table;
}

function clearInsertedRows(): void {
  document.getElementById("reviewer-game-ratio-row")?.remove();
  document.getElementById("reviewer-game-chaga-row")?.remove();
  document.getElementById("reviewer-game-pending-row")?.remove();
  document
    .querySelectorAll(
      ".reviewer-game-round-toggle, .reviewer-game-round-separator, .reviewer-game-detail-row",
    )
    .forEach((element) => element.remove());
}

function withAnchorRow(
  callback: (anchor: HTMLTableRowElement) => void,
  retryInterval = UI_RETRY_INTERVAL_MS,
): void {
  const anchor = findStandardScoreRow();
  if (!anchor || !anchor.parentElement) {
    setTimeout(() => withAnchorRow(callback, retryInterval), retryInterval);
    return;
  }
  callback(anchor);
}

function createMetricRow(
  label: string,
  values: string[],
  rowId: string,
): HTMLTableRowElement {
  const row = document.createElement("tr");
  row.id = rowId;
  const header = document.createElement("th");
  header.className = "bg-secondary text-light";
  header.textContent = label;
  row.appendChild(header);
  values.forEach((value) => {
    const cell = document.createElement("td");
    cell.className = "bg-secondary text-light";
    cell.colSpan = 2;
    cell.textContent = value;
    row.appendChild(cell);
  });
  return row;
}

function closeDetailRow(detailRow: HTMLTableRowElement): void {
  const content = detailRow.querySelector(
    ".reviewer-game-detail-content",
  ) as HTMLDivElement | null;
  if (!content) {
    detailRow.remove();
    return;
  }

  content.style.maxHeight = `${content.scrollHeight}px`;
  content.style.opacity = "1";
  content.style.transform = "translateY(0)";
  requestAnimationFrame(() => {
    content.style.maxHeight = "0px";
    content.style.opacity = "0";
    content.style.transform = "translateY(-4px)";
  });
  setTimeout(() => detailRow.remove(), 220);
}

function createRoundDetailRow(
  targetRow: HTMLTableRowElement,
  round: RoundOutcome,
): HTMLTableRowElement {
  const detailRow = document.createElement("tr");
  detailRow.className = "reviewer-game-detail-row";
  detailRow.id = `reviewer-game-detail-row-${round.roundNo}`;

  const cell = document.createElement("td");
  cell.colSpan = Math.max(targetRow.children.length, 1);
  cell.className = "bg-secondary text-light";

  const content = document.createElement("div");
  content.className = "reviewer-game-detail-content";
  content.style.overflow = "hidden";
  content.style.maxHeight = "0px";
  content.style.opacity = "0";
  content.style.transform = "translateY(-4px)";
  content.style.transition =
    "max-height 0.24s ease, opacity 0.2s ease, transform 0.2s ease";
  content.style.padding = "4px 6px";

  if (!round.winners.length) {
    const empty = document.createElement("div");
    empty.textContent = "本盘无和牌";
    content.appendChild(empty);
  } else {
    const winnerNames = round.winners.map((item) => item.playerName).join("、");
    const baseInfo = document.createElement("div");
    const losePart = round.selfDraw
      ? "自摸"
      : `放铳：${round.discarderNames.join("、") || "未知"}`;
    baseInfo.textContent = `和牌：${winnerNames}；${losePart}`;
    content.appendChild(baseInfo);

    round.winners.forEach((winner) => {
      const line = document.createElement("div");
      const fanText = winner.fanItems.length
        ? winner.fanItems
            .map((fan) =>
              fan.count > 1 ? `${fan.fanName}×${fan.count}` : fan.fanName,
            )
            .join("、")
        : "番种未知";
      line.textContent = `${winner.playerName}：${winner.totalFan}番（${fanText}）`;
      content.appendChild(line);
    });
  }

  cell.appendChild(content);
  detailRow.appendChild(cell);
  return detailRow;
}

export function installRoundToggleButtons(
  rounds: RoundOutcome[],
  retryCount = 0,
): void {
  const table = findRoundTable();
  if (!table) {
    if (retryCount < UI_RETRY_MAX_COUNT) {
      setTimeout(
        () => installRoundToggleButtons(rounds, retryCount + 1),
        UI_RETRY_INTERVAL_MS,
      );
    }
    return;
  }

  const roundMap = new Map<number, RoundOutcome>();
  rounds.forEach((round) => {
    roundMap.set(round.roundNo, round);
  });

  const rdtrRows = Array.from(
    table.querySelectorAll("tr[name='rdtr']"),
  ) as HTMLTableRowElement[];
  const rows = rdtrRows.length
    ? rdtrRows
    : (Array.from(table.querySelectorAll("tr")) as HTMLTableRowElement[]);
  let installedCount = 0;
  rows.forEach((row, rowIndex) => {
    if (row.querySelector(".reviewer-game-round-toggle")) {
      return;
    }
    const roundNo = rdtrRows.length ? rowIndex + 1 : parseRoundNoFromRow(row);
    if (!roundNo) {
      return;
    }
    const firstCell = row.children[0] as HTMLTableCellElement | undefined;
    if (!firstCell) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "reviewer-game-round-toggle";
    button.textContent = "▸";
    button.style.border = "1px solid rgba(255,255,255,0.35)";
    button.style.borderRadius = "4px";
    button.style.background = "rgba(0,0,0,0.15)";
    button.style.cursor = "pointer";
    button.style.padding = "0";
    button.style.width = "18px";
    button.style.height = "18px";
    button.style.lineHeight = "16px";
    button.style.marginRight = "8px";
    button.style.color = "inherit";
    button.style.verticalAlign = "middle";
    button.setAttribute("aria-label", `查看第${roundNo}局和牌详情`);

    const separator = document.createElement("span");
    separator.className = "reviewer-game-round-separator";
    separator.textContent = "|";
    separator.style.opacity = "0.5";
    separator.style.marginRight = "8px";
    separator.style.verticalAlign = "middle";

    button.addEventListener("click", () => {
      const existing = document.getElementById(
        `reviewer-game-detail-row-${roundNo}`,
      ) as HTMLTableRowElement | null;

      if (existing) {
        closeDetailRow(existing);
        button.textContent = "▸";
        return;
      }

      const roundInfo = roundMap.get(roundNo) || {
        roundNo,
        winners: [],
        discarderNames: [],
        selfDraw: false,
      };
      const detailRow = createRoundDetailRow(row, roundInfo);
      row.insertAdjacentElement("afterend", detailRow);

      const content = detailRow.querySelector(
        ".reviewer-game-detail-content",
      ) as HTMLDivElement | null;
      if (content) {
        requestAnimationFrame(() => {
          content.style.maxHeight = `${content.scrollHeight}px`;
          content.style.opacity = "1";
          content.style.transform = "translateY(0)";
        });
      }

      button.textContent = "▾";
    });

    firstCell.insertBefore(separator, firstCell.firstChild);
    firstCell.insertBefore(button, separator);
    installedCount += 1;
  });

  if (installedCount === 0 && retryCount < UI_RETRY_MAX_COUNT) {
    setTimeout(
      () => installRoundToggleButtons(rounds, retryCount + 1),
      UI_RETRY_INTERVAL_MS,
    );
  }
}

export function upsertMetricsRows(metrics: MetricsResult): void {
  withAnchorRow((anchor) => {
    clearInsertedRows();
    const ratioRow = createMetricRow(
      "一致率",
      metrics.players.map((item) => `${(item.ratio * 100).toFixed(2)}%`),
      "reviewer-game-ratio-row",
    );
    const chagaRow = createMetricRow(
      "CHAGA度",
      metrics.players.map((item) => item.chagaAvg.toFixed(2)),
      "reviewer-game-chaga-row",
    );
    anchor.insertAdjacentElement("afterend", chagaRow);
    anchor.insertAdjacentElement("afterend", ratioRow);
    infoLog("Game overview metrics updated", metrics.overall);
  });
}

export function upsertPendingRow(message: string): void {
  withAnchorRow((anchor) => {
    clearInsertedRows();
    const cells = Array.from(anchor.children).slice(1);
    const totalColSpan = cells.reduce((sum, cell) => {
      return sum + ((cell as HTMLTableCellElement).colSpan || 1);
    }, 0);

    const row = document.createElement("tr");
    row.id = "reviewer-game-pending-row";
    const header = document.createElement("th");
    header.className = "bg-secondary text-light";
    header.textContent = "AI评分";
    row.appendChild(header);
    const cell = document.createElement("td");
    cell.className = "bg-secondary text-light";
    cell.colSpan = Math.max(totalColSpan, 1);
    cell.textContent = message;
    row.appendChild(cell);

    anchor.insertAdjacentElement("afterend", row);
  });
}

export function upsertLoadingRows(message: string): void {
  withAnchorRow((anchor) => {
    clearInsertedRows();
    const ratioRow = createMetricRow(
      "一致率",
      [message, message, message, message],
      "reviewer-game-ratio-row",
    );
    const chagaRow = createMetricRow(
      "CHAGA度",
      [message, message, message, message],
      "reviewer-game-chaga-row",
    );
    anchor.insertAdjacentElement("afterend", chagaRow);
    anchor.insertAdjacentElement("afterend", ratioRow);
  });
}
