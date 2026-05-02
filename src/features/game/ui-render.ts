import { getLocalStorageItem, setLocalStorageItem } from "../../shared/storage";
import { infoLog } from "../../shared/logger";
import { MetricsResult, RoundOutcome } from "./types";
import { UI_RETRY_INTERVAL_MS, UI_RETRY_MAX_COUNT } from "./constants";

type RoundWinDisplayMode = "remark" | "detail" | "original";

const ROUND_WIN_DISPLAY_MODE_KEY = "reviewer:game-win-display-mode";
const DEFAULT_ROUND_WIN_DISPLAY_MODE: RoundWinDisplayMode = "remark";
const ROUND_WIN_MODE_SWITCHER_ID = "reviewer-game-win-mode-switcher";
const ROUND_WIN_POPOVER_ID = "reviewer-game-win-popover";
const ROUND_WIN_REMARK_HEADER_CLASS = "reviewer-game-win-remark-header";
const ROUND_WIN_REMARK_CELL_CLASS = "reviewer-game-win-remark-cell";
const ROUND_WIN_REMARK_TRIGGER_CLASS = "reviewer-game-win-remark-trigger";
const ROUND_WIN_POPOVER_CLASS = "reviewer-game-win-popover";
const ROUND_WIN_POPOVER_CLOSE_CLASS = "reviewer-game-win-popover-close";
const ROUND_WIN_REMARK_MAX_WIDTH = "5em";
const ROUND_WIN_POPOVER_AUTO_CLOSE_MS = 5000;
const ROUND_WIN_REMARK_COLUMN_WIDTH = "7.5em";

let activeRoundWinPopoverTimer: number | null = null;

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

  appendRoundDetailContent(content, round);

  cell.appendChild(content);
  detailRow.appendChild(cell);
  return detailRow;
}

function appendRoundDetailContent(
  container: HTMLElement,
  round: RoundOutcome,
): void {
  if (!round.winners.length) {
    const empty = document.createElement("div");
    empty.textContent = "荒庄";
    container.appendChild(empty);
    return;
  }

  const winnerNames = round.winners.map((item) => item.playerName).join("、");
  const baseInfo = document.createElement("div");
  const losePart = round.selfDraw
    ? "自摸"
    : `放铳：${round.discarderNames.join("、") || "未知"}`;
  baseInfo.textContent = `和牌：${winnerNames}；${losePart}`;
  container.appendChild(baseInfo);

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
    container.appendChild(line);
  });
}

function readRoundWinDisplayMode(): RoundWinDisplayMode {
  const stored = getLocalStorageItem(ROUND_WIN_DISPLAY_MODE_KEY);
  if (stored === "remark" || stored === "detail" || stored === "original") {
    return stored;
  }
  return DEFAULT_ROUND_WIN_DISPLAY_MODE;
}

function writeRoundWinDisplayMode(mode: RoundWinDisplayMode): void {
  setLocalStorageItem(ROUND_WIN_DISPLAY_MODE_KEY, mode);
}

function closeActiveRoundWinPopover(): void {
  if (activeRoundWinPopoverTimer !== null) {
    window.clearTimeout(activeRoundWinPopoverTimer);
    activeRoundWinPopoverTimer = null;
  }
  document.getElementById(ROUND_WIN_POPOVER_ID)?.remove();
}

function clearRoundWinEnhancements(): void {
  closeActiveRoundWinPopover();
  document
    .querySelectorAll(`.${ROUND_WIN_REMARK_HEADER_CLASS}`)
    .forEach((header) => header.remove());
  document
    .querySelectorAll(`.${ROUND_WIN_REMARK_CELL_CLASS}`)
    .forEach((cell) => cell.remove());
  document
    .querySelectorAll(".reviewer-game-round-separator")
    .forEach((separator) => separator.remove());
  document
    .querySelectorAll(".reviewer-game-round-toggle")
    .forEach((button) => button.remove());
  document
    .querySelectorAll(".reviewer-game-detail-row")
    .forEach((row) => row.remove());
}

function getRoundRows(table: HTMLTableElement): HTMLTableRowElement[] {
  const rdtrRows = Array.from(
    table.querySelectorAll("tr[name='rdtr']"),
  ) as HTMLTableRowElement[];
  return rdtrRows.length
    ? rdtrRows
    : (Array.from(table.querySelectorAll("tr")) as HTMLTableRowElement[]);
}

function createModeButton(
  mode: RoundWinDisplayMode,
  label: string,
  activeMode: RoundWinDisplayMode,
  onClick: (mode: RoundWinDisplayMode) => void,
): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.dataset.winDisplayMode = mode;
  button.setAttribute("aria-pressed", mode === activeMode ? "true" : "false");
  button.style.border = "1px solid rgba(49,70,92,0.22)";
  button.style.borderRadius = "4px";
  button.style.background =
    mode === activeMode ? "rgba(49, 70, 92, 0.14)" : "rgba(255,255,255,0.72)";
  button.style.color = "rgba(49,70,92,0.9)";
  button.style.cursor = "pointer";
  button.style.padding = "3px 10px";
  button.style.fontSize = "12px";
  button.style.lineHeight = "1.2";
  button.style.boxShadow = "none";
  button.addEventListener("click", () => onClick(mode));
  return button;
}

function ensureModeSwitcher(
  activeMode: RoundWinDisplayMode,
  onModeChange: (mode: RoundWinDisplayMode) => void,
): void {
  const table = findRoundTable();
  if (!table || !table.parentElement) {
    return;
  }

  const existing = document.getElementById(ROUND_WIN_MODE_SWITCHER_ID);
  if (existing) {
    existing.remove();
  }

  const switcher = document.createElement("div");
  switcher.id = ROUND_WIN_MODE_SWITCHER_ID;
  switcher.style.display = "flex";
  switcher.style.gap = "6px";
  switcher.style.alignItems = "center";
  switcher.style.flexWrap = "wrap";
  switcher.style.margin = "6px 0 8px";

  switcher.appendChild(
    createModeButton("remark", "番种备注", activeMode, onModeChange),
  );
  switcher.appendChild(
    createModeButton("detail", "和牌详细", activeMode, onModeChange),
  );
  switcher.appendChild(
    createModeButton("original", "原始样式", activeMode, onModeChange),
  );

  table.insertAdjacentElement("beforebegin", switcher);
}

function getMaxFanRemark(round: RoundOutcome): string {
  if (!round.winners.length) {
    return "荒庄";
  }

  let bestFanName = "番种未知";
  let bestFanValue = -1;

  round.winners.forEach((winner) => {
    if (!winner.fanItems.length && bestFanValue < 0) {
      bestFanName = "番种未知";
      bestFanValue = 0;
      return;
    }

    winner.fanItems.forEach((fan) => {
      const fanValue =
        typeof fan.totalFan === "number" && Number.isFinite(fan.totalFan)
          ? fan.totalFan
          : fan.unitFan * fan.count;
      if (fanValue > bestFanValue) {
        bestFanName = fan.fanName;
        bestFanValue = fanValue;
      }
    });
  });

  return bestFanName;
}

function createRoundRemarkContent(round: RoundOutcome): HTMLDivElement {
  const content = document.createElement("div");
  appendRoundDetailContent(content, round);
  return content;
}

function copyCellPresentation(
  target: HTMLTableCellElement,
  source: Element | null,
): void {
  if (!(source instanceof HTMLTableCellElement)) {
    return;
  }
  target.style.cssText = source.style.cssText;
}

function openRoundWinPopover(
  trigger: HTMLButtonElement,
  round: RoundOutcome,
): void {
  closeActiveRoundWinPopover();

  const popover = document.createElement("div");
  popover.id = ROUND_WIN_POPOVER_ID;
  popover.className = ROUND_WIN_POPOVER_CLASS;
  popover.style.position = "absolute";
  popover.style.zIndex = "9999";
  popover.style.maxWidth = "260px";
  popover.style.padding = "10px 12px";
  popover.style.border = "1px solid rgba(0,0,0,0.2)";
  popover.style.borderRadius = "8px";
  popover.style.background = "#fff";
  popover.style.color = "#222";
  popover.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
  popover.style.fontSize = "12px";
  popover.style.lineHeight = "1.5";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = ROUND_WIN_POPOVER_CLOSE_CLASS;
  closeButton.textContent = "×";
  closeButton.style.position = "absolute";
  closeButton.style.top = "4px";
  closeButton.style.right = "6px";
  closeButton.style.border = "0";
  closeButton.style.background = "transparent";
  closeButton.style.cursor = "pointer";
  closeButton.style.fontSize = "16px";
  closeButton.addEventListener("click", () => closeActiveRoundWinPopover());
  popover.appendChild(closeButton);

  const content = createRoundRemarkContent(round);
  content.style.paddingRight = "14px";
  popover.appendChild(content);

  document.body.appendChild(popover);

  const rect = trigger.getBoundingClientRect();
  popover.style.left = `${window.scrollX + rect.right + 8}px`;
  popover.style.top = `${window.scrollY + rect.top}px`;

  activeRoundWinPopoverTimer = window.setTimeout(() => {
    closeActiveRoundWinPopover();
  }, ROUND_WIN_POPOVER_AUTO_CLOSE_MS);
}

function createRemarkCell(round: RoundOutcome): HTMLTableCellElement {
  const cell = document.createElement("td");
  cell.className = ROUND_WIN_REMARK_CELL_CLASS;
  cell.style.whiteSpace = "nowrap";
  cell.style.textAlign = "center";
  cell.style.verticalAlign = "middle";

  const remark = getMaxFanRemark(round);
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = ROUND_WIN_REMARK_TRIGGER_CLASS;
  trigger.textContent = remark;
  trigger.style.display = "inline-block";
  trigger.style.maxWidth = ROUND_WIN_REMARK_MAX_WIDTH;
  trigger.style.overflow = "hidden";
  trigger.style.whiteSpace = "nowrap";
  trigger.style.textOverflow = "ellipsis";
  trigger.style.padding = "0";
  trigger.style.border = "0";
  trigger.style.background = "transparent";
  trigger.style.cursor = remark === "荒庄" ? "default" : "pointer";
  trigger.style.color =
    remark === "荒庄" ? "rgba(102,115,129,0.92)" : "rgba(49,70,92,0.96)";
  trigger.style.textDecoration = "none";
  trigger.style.font = "inherit";
  trigger.style.lineHeight = "inherit";
  trigger.title = remark;
  if (remark !== "荒庄") {
    trigger.addEventListener("click", () =>
      openRoundWinPopover(trigger, round),
    );
  }

  cell.appendChild(trigger);
  return cell;
}

function createEmptyRemarkCell(source: Element | null): HTMLTableCellElement {
  const cell = document.createElement("td");
  cell.className = ROUND_WIN_REMARK_CELL_CLASS;
  copyCellPresentation(cell, source);
  cell.textContent = "";
  return cell;
}

function appendRemarkColumnScaffold(table: HTMLTableElement): void {
  const rows = Array.from(
    table.querySelectorAll("tr"),
  ) as HTMLTableRowElement[];
  rows.forEach((row, index) => {
    if (
      row.querySelector(
        `.${ROUND_WIN_REMARK_HEADER_CLASS}, .${ROUND_WIN_REMARK_CELL_CLASS}`,
      )
    ) {
      return;
    }

    if (index !== 3) {
      const filler = createEmptyRemarkCell(row.lastElementChild);
      if (row.lastElementChild instanceof HTMLTableCellElement) {
        filler.className =
          `${row.lastElementChild.className} ${ROUND_WIN_REMARK_CELL_CLASS}`.trim();
      }
      row.appendChild(filler);
      return;
    }

    const header = document.createElement("th");
    header.className = ROUND_WIN_REMARK_HEADER_CLASS;
    copyCellPresentation(header, row.lastElementChild);
    if (row.lastElementChild instanceof HTMLTableCellElement) {
      header.className =
        `${row.lastElementChild.className} ${ROUND_WIN_REMARK_HEADER_CLASS}`.trim();
    }
    header.textContent = "番种备注";
    header.style.width = ROUND_WIN_REMARK_COLUMN_WIDTH;
    header.style.minWidth = ROUND_WIN_REMARK_COLUMN_WIDTH;
    header.style.whiteSpace = "nowrap";
    header.style.textAlign = "center";
    header.style.verticalAlign = "middle";
    row.appendChild(header);
  });
}

function renderRemarkMode(
  table: HTMLTableElement,
  rounds: RoundOutcome[],
): void {
  const roundMap = new Map<number, RoundOutcome>();
  rounds.forEach((round) => roundMap.set(round.roundNo, round));
  appendRemarkColumnScaffold(table);

  getRoundRows(table).forEach((row, rowIndex) => {
    const roundNo =
      (table.querySelectorAll("tr[name='rdtr']").length ? rowIndex + 1 : 0) ||
      parseRoundNoFromRow(row);
    if (!roundNo) {
      return;
    }
    const round = roundMap.get(roundNo) || {
      roundNo,
      winners: [],
      discarderNames: [],
      selfDraw: false,
    };
    const existingCell = row.querySelector(
      `.${ROUND_WIN_REMARK_CELL_CLASS}`,
    ) as HTMLTableCellElement | null;
    const cell = createRemarkCell(round);
    if (existingCell) {
      existingCell.replaceWith(cell);
    } else {
      copyCellPresentation(cell, row.lastElementChild);
      if (row.lastElementChild instanceof HTMLTableCellElement) {
        cell.className =
          `${row.lastElementChild.className} ${ROUND_WIN_REMARK_CELL_CLASS}`.trim();
      }
      cell.style.whiteSpace = "nowrap";
      cell.style.textAlign = "center";
      cell.style.verticalAlign = "middle";
      row.appendChild(cell);
    }
  });
}

function renderDetailMode(
  table: HTMLTableElement,
  rounds: RoundOutcome[],
  retryCount: number,
): void {
  const roundMap = new Map<number, RoundOutcome>();
  rounds.forEach((round) => {
    roundMap.set(round.roundNo, round);
  });

  let installedCount = 0;
  getRoundRows(table).forEach((row, rowIndex) => {
    if (row.querySelector(".reviewer-game-round-toggle")) {
      return;
    }
    const roundNo =
      (table.querySelectorAll("tr[name='rdtr']").length ? rowIndex + 1 : 0) ||
      parseRoundNoFromRow(row);
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
      () => installRoundWinDisplayModes(rounds, retryCount + 1),
      UI_RETRY_INTERVAL_MS,
    );
  }
}

function applyRoundWinDisplayMode(
  mode: RoundWinDisplayMode,
  rounds: RoundOutcome[],
  retryCount: number,
): void {
  const table = findRoundTable();
  if (!table) {
    if (retryCount < UI_RETRY_MAX_COUNT) {
      setTimeout(
        () => installRoundWinDisplayModes(rounds, retryCount + 1),
        UI_RETRY_INTERVAL_MS,
      );
    }
    return;
  }

  clearRoundWinEnhancements();
  ensureModeSwitcher(mode, (nextMode) => {
    writeRoundWinDisplayMode(nextMode);
    applyRoundWinDisplayMode(nextMode, rounds, 0);
  });

  if (mode === "remark") {
    renderRemarkMode(table, rounds);
    return;
  }

  if (mode === "detail") {
    renderDetailMode(table, rounds, retryCount);
  }
}

export function installRoundWinDisplayModes(
  rounds: RoundOutcome[],
  retryCount = 0,
): void {
  applyRoundWinDisplayMode(readRoundWinDisplayMode(), rounds, retryCount);
}

export function installRoundToggleButtons(
  rounds: RoundOutcome[],
  retryCount = 0,
): void {
  applyRoundWinDisplayMode("detail", rounds, retryCount);
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

export function upsertMetricsMessageRows(message: string): void {
  withAnchorRow((anchor) => {
    clearInsertedRows();
    const cells = Array.from(anchor.children).slice(1);
    const totalColSpan = cells.reduce((sum, cell) => {
      return sum + ((cell as HTMLTableCellElement).colSpan || 1);
    }, 0);

    const ratioRow = document.createElement("tr");
    ratioRow.id = "reviewer-game-ratio-row";
    const ratioHeader = document.createElement("th");
    ratioHeader.className = "bg-secondary text-light";
    ratioHeader.textContent = "一致率";
    ratioRow.appendChild(ratioHeader);

    const cell = document.createElement("td");
    cell.className = "bg-secondary text-light";
    cell.colSpan = Math.max(totalColSpan, 1);
    cell.rowSpan = 2;
    cell.textContent = message;
    ratioRow.appendChild(cell);

    const chagaRow = document.createElement("tr");
    chagaRow.id = "reviewer-game-chaga-row";
    const chagaHeader = document.createElement("th");
    chagaHeader.className = "bg-secondary text-light";
    chagaHeader.textContent = "CHAGA度";
    chagaRow.appendChild(chagaHeader);

    anchor.insertAdjacentElement("afterend", chagaRow);
    anchor.insertAdjacentElement("afterend", ratioRow);
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
