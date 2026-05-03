import { getLocalStorageItem, setLocalStorageItem } from "../../shared/storage";
import { infoLog, warnLog } from "../../shared/logger";
import { MetricsResult, RoundOutcome } from "./types";
import { UI_RETRY_INTERVAL_MS, UI_RETRY_MAX_COUNT } from "./constants";

type RoundWinDisplayMode = "remark" | "detail" | "original";
type ScoreCompactMode = "original" | "compact";

const ROUND_WIN_DISPLAY_MODE_KEY = "reviewer:game-win-display-mode";
const SCORE_COMPACT_MODE_KEY = "reviewer:game-score-compact-mode";
const DEFAULT_ROUND_WIN_DISPLAY_MODE: RoundWinDisplayMode = "remark";
const DEFAULT_SCORE_COMPACT_MODE: ScoreCompactMode = "original";
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
const SCORE_COMPACT_TOGGLE_ATTR = "data-score-compact-mode";
const FLOWER_FAN_NAME = "花牌";
const YAOJIUKE_FAN_NAME = "幺九刻";
const COPPER_TWO_FAN_ABBREVIATIONS: Record<string, string> = {
  四归一: "归",
  暗杠: "杠",
  门前清: "门",
  平和: "平",
  断幺: "断",
  双暗刻: "暗",
  双同刻: "同",
  箭刻: "箭",
  门风刻: "风",
  圈风刻: "风",
};

type RoundRemarkPattern =
  | {
      type: "silver";
      label: string;
    }
  | {
      type: "gold";
      label: string;
    }
  | null;

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

function readScoreCompactMode(): ScoreCompactMode {
  const stored = getLocalStorageItem(SCORE_COMPACT_MODE_KEY);
  if (stored === "compact" || stored === "original") {
    return stored;
  }
  return DEFAULT_SCORE_COMPACT_MODE;
}

function writeRoundWinDisplayMode(mode: RoundWinDisplayMode): void {
  setLocalStorageItem(ROUND_WIN_DISPLAY_MODE_KEY, mode);
}

function writeScoreCompactMode(mode: ScoreCompactMode): void {
  setLocalStorageItem(SCORE_COMPACT_MODE_KEY, mode);
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

function parseBaseScore(): number {
  const cfgText = document.getElementById("cfg")?.textContent || "";
  const match = cfgText.match(/\((\d+)\)/);
  if (!match) {
    return 8;
  }
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : 8;
}

function isPlusTenFoulRule(): boolean {
  const cfgText = document.getElementById("cfg")?.textContent || "";
  return cfgText.includes("-30/+10");
}

function parseDisplayedScores(row: HTMLTableRowElement): number[] {
  const cells = Array.from(row.children) as HTMLTableCellElement[];
  const scores: number[] = [];
  for (let idx = 1; idx < cells.length; idx += 2) {
    const sourceText =
      cells[idx]?.dataset.reviewerOriginalScoreText ??
      cells[idx]?.textContent ??
      "";
    const value = Number(sourceText.trim());
    scores.push(Number.isFinite(value) ? value : 0);
  }
  return scores;
}

function parseDisplayedTotals(row: HTMLTableRowElement): number[] {
  const cells = Array.from(row.children) as HTMLTableCellElement[];
  const totals: number[] = [];
  for (let idx = 2; idx < cells.length; idx += 2) {
    const value = Number((cells[idx]?.textContent || "").trim());
    totals.push(Number.isFinite(value) ? value : 0);
  }
  return totals;
}

function parseOriginalScoreRoleClasses(
  row: HTMLTableRowElement,
): Array<"w" | "c" | "n" | "f" | ""> {
  const cells = Array.from(row.children) as HTMLTableCellElement[];
  const roles: Array<"w" | "c" | "n" | "f" | ""> = [];
  for (let idx = 1; idx < cells.length; idx += 2) {
    const sourceClass =
      cells[idx]?.dataset.reviewerOriginalScoreClass ??
      cells[idx]?.className ??
      "";
    if (sourceClass.includes("f")) {
      roles.push("f");
    } else if (sourceClass.includes("w")) {
      roles.push("w");
    } else if (sourceClass.includes("c")) {
      roles.push("c");
    } else if (sourceClass.includes("n")) {
      roles.push("n");
    } else {
      roles.push("");
    }
  }
  return roles;
}

function getPlayerColumnIndexMap(table: HTMLTableElement): Map<string, number> {
  const map = new Map<string, number>();
  const nameCells = Array.from(
    table.querySelectorAll('td[name="nm"]'),
  ) as HTMLTableCellElement[];
  nameCells.forEach((cell, index) => {
    const name = (cell.textContent || "").trim();
    if (name) {
      map.set(name, index);
    }
  });
  return map;
}

function getSeatIndexByName(
  name: string,
  playerColumnIndexMap: Map<string, number>,
): number {
  return playerColumnIndexMap.get(name.trim()) ?? -1;
}

function detectFoulSeat(
  scoreRoles: Array<"w" | "c" | "n" | "f" | "">,
): number | null {
  const foundSeat = scoreRoles.findIndex((role) => role === "f");
  return foundSeat >= 0 ? foundSeat : null;
}

function buildCompactScoreTexts(
  round: RoundOutcome,
  scores: number[],
  plusTenRule: boolean,
  playerColumnIndexMap: Map<string, number>,
  scoreRoles: Array<"w" | "c" | "n" | "f" | "">,
): Array<{ text: string; foul: boolean }> {
  const result = [0, 1, 2, 3].map(() => ({ text: "", foul: false }));
  const foulSeat = detectFoulSeat(scoreRoles);
  if (foulSeat !== null) {
    result[foulSeat] = {
      text: plusTenRule ? "-10×3" : "-40",
      foul: true,
    };
  }

  if (!round.winners.length) {
    return result;
  }

  const winnerSeat = getSeatIndexByName(
    round.winners[0]?.playerName || "",
    playerColumnIndexMap,
  );
  const discarderSeat = getSeatIndexByName(
    round.discarderNames[0] || "",
    playerColumnIndexMap,
  );
  const totalFan = round.winners[0]?.totalFan || 0;
  if (winnerSeat < 0 || totalFan <= 0) {
    return result;
  }

  if (round.selfDraw) {
    result[winnerSeat] = {
      text:
        foulSeat === winnerSeat
          ? `${result[winnerSeat].text}${totalFan}×3`
          : `${totalFan}×3`,
      foul: foulSeat === winnerSeat,
    };
    return result;
  }

  result[winnerSeat] = { text: String(totalFan), foul: false };

  if (discarderSeat >= 0) {
    if (discarderSeat === foulSeat) {
      result[discarderSeat] = {
        text: `${result[discarderSeat].text}-${totalFan}`,
        foul: true,
      };
    } else {
      result[discarderSeat] = {
        text: `-${totalFan}`,
        foul: false,
      };
    }
  }

  return result;
}

function expandCompactScoresToActualScores(
  compactScores: Array<{ text: string; foul: boolean }>,
  baseScore: number,
  plusTenRule: boolean,
): number[] {
  return compactScores.map((item) => {
    const text = item.text.trim();
    if (!text) {
      return 0;
    }
    if (text.includes("×3")) {
      if (text === "-10×3") {
        return plusTenRule ? -30 : -40;
      }
      const value = Number(text.replace("×3", ""));
      if (Number.isFinite(value)) {
        return value * 3 + baseScore * 3;
      }
    }
    if (text.startsWith("-10×3-")) {
      const value = Number(text.replace("-10×3-", ""));
      if (Number.isFinite(value)) {
        return -30 - value;
      }
    }
    if (text.startsWith("-40-")) {
      const value = Number(text.replace("-40-", ""));
      if (Number.isFinite(value)) {
        return -40 - value;
      }
    }
    const value = Number(text);
    if (!Number.isFinite(value)) {
      return 0;
    }
    if (value > 0) {
      return value + baseScore * 3;
    }
    if (value < 0) {
      return value - baseScore;
    }
    return 0;
  });
}

function validateCompactScoreRound(
  roundNo: number,
  row: HTMLTableRowElement,
  compactScores: Array<{ text: string; foul: boolean }>,
  baseScore: number,
  plusTenRule: boolean,
): void {
  const actualScores = parseDisplayedScores(row);
  const displayedTotals = parseDisplayedTotals(row);
  const expectedScores = expandCompactScoresToActualScores(
    compactScores,
    baseScore,
    plusTenRule,
  );
  const previousRow = row.previousElementSibling as HTMLTableRowElement | null;
  const previousTotals =
    previousRow?.getAttribute("name") === "rdtr"
      ? parseDisplayedTotals(previousRow)
      : [0, 0, 0, 0];

  const scoreMismatch = expectedScores.some(
    (value, index) => value !== actualScores[index],
  );
  const totalMismatch = expectedScores.some(
    (value, index) => previousTotals[index] + value !== displayedTotals[index],
  );

  if (scoreMismatch || totalMismatch) {
    warnLog("简洁得分校验失败", {
      roundNo,
      expectedScores,
      actualScores,
      previousTotals,
      displayedTotals,
      compactScores: compactScores.map((item) => item.text),
      mismatch: scoreMismatch ? "得分/累计" : "累计",
    });
  }
}

function applyScoreCompactMode(
  table: HTMLTableElement,
  rounds: RoundOutcome[],
  mode: ScoreCompactMode,
): void {
  const baseScore = parseBaseScore();
  const plusTenRule = isPlusTenFoulRule();
  const roundMap = new Map<number, RoundOutcome>();
  const playerColumnIndexMap = getPlayerColumnIndexMap(table);
  rounds.forEach((round) => roundMap.set(round.roundNo, round));

  getRoundRows(table).forEach((row, rowIndex) => {
    if (row.children.length < 9) {
      return;
    }
    const roundNo =
      (table.querySelectorAll("tr[name='rdtr']").length ? rowIndex + 1 : 0) ||
      parseRoundNoFromRow(row);
    if (!roundNo) {
      return;
    }
    const scores = parseDisplayedScores(row);
    const scoreRoles = parseOriginalScoreRoleClasses(row);
    if (scores.length !== 4) {
      return;
    }

    const displayed =
      mode === "compact"
        ? buildCompactScoreTexts(
            roundMap.get(roundNo) || {
              roundNo,
              winners: [],
              discarderNames: [],
              selfDraw: false,
            },
            scores,
            plusTenRule,
            playerColumnIndexMap,
            scoreRoles,
          )
        : scores.map((score) => ({ text: String(score), foul: false }));

    if (mode === "compact") {
      validateCompactScoreRound(
        roundNo,
        row,
        displayed,
        baseScore,
        plusTenRule,
      );
    }

    displayed.forEach((item, seat) => {
      const cell = row.children[seat * 2 + 1] as
        | HTMLTableCellElement
        | undefined;
      if (!cell) {
        return;
      }
      if (!cell.dataset.reviewerOriginalScoreText) {
        cell.dataset.reviewerOriginalScoreText = (
          cell.textContent || ""
        ).trim();
        cell.dataset.reviewerOriginalScoreClass = cell.className;
      }
      const originalText = cell.dataset.reviewerOriginalScoreText || "";
      const originalClass = cell.dataset.reviewerOriginalScoreClass || "";

      if (mode === "original") {
        cell.textContent = originalText;
        cell.className = originalClass;
        return;
      }

      cell.textContent = item.text;
      cell.className = originalClass;
      if (item.foul && !cell.classList.contains("f")) {
        cell.classList.add("f");
      }
    });
  });
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

function createScoreCompactToggleButton(
  mode: ScoreCompactMode,
  onClick: (mode: ScoreCompactMode) => void,
): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.scoreCompactMode = mode;
  button.setAttribute(SCORE_COMPACT_TOGGLE_ATTR, mode);
  button.textContent = `简洁得分：${mode === "compact" ? "开" : "关"}`;
  button.style.border = "1px solid rgba(49,70,92,0.22)";
  button.style.borderRadius = "4px";
  button.style.background =
    mode === "compact" ? "rgba(49, 70, 92, 0.14)" : "rgba(255,255,255,0.72)";
  button.style.color = "rgba(49,70,92,0.9)";
  button.style.cursor = "pointer";
  button.style.padding = "3px 10px";
  button.style.fontSize = "12px";
  button.style.lineHeight = "1.2";
  button.style.boxShadow = "none";
  button.addEventListener("click", () =>
    onClick(mode === "compact" ? "original" : "compact"),
  );
  return button;
}

function ensureModeSwitcher(
  activeMode: RoundWinDisplayMode,
  scoreCompactMode: ScoreCompactMode,
  onModeChange: (mode: RoundWinDisplayMode) => void,
  onScoreCompactModeChange: (mode: ScoreCompactMode) => void,
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
    createModeButton("detail", "下拉栏", activeMode, onModeChange),
  );
  switcher.appendChild(
    createModeButton("original", "原始样式", activeMode, onModeChange),
  );
  switcher.appendChild(
    createScoreCompactToggleButton(scoreCompactMode, onScoreCompactModeChange),
  );

  table.insertAdjacentElement("beforebegin", switcher);
}

function getRoundRemarkPattern(round: RoundOutcome): RoundRemarkPattern {
  const fanEntries: Array<{ fanName: string; unitFan: number }> = [];

  round.winners.forEach((winner) => {
    winner.fanItems.forEach((fan) => {
      if (fan.fanName === FLOWER_FAN_NAME) {
        return;
      }
      const unitFan = Number.isFinite(fan.unitFan) ? fan.unitFan : 0;
      const count = Number.isFinite(fan.count) ? fan.count : 0;
      for (let idx = 0; idx < count; idx += 1) {
        fanEntries.push({
          fanName: fan.fanName,
          unitFan,
        });
      }
    });
  });

  if (!fanEntries.length) {
    return null;
  }

  const twoFanEntries = fanEntries.filter((fan) => fan.unitFan === 2);
  const oneFanEntries = fanEntries.filter((fan) => fan.unitFan === 1);
  const onlyOneAndTwoFan = fanEntries.every(
    (fan) => fan.unitFan === 1 || fan.unitFan === 2,
  );

  if (
    onlyOneAndTwoFan &&
    twoFanEntries.length === 2 &&
    oneFanEntries.length + twoFanEntries.length === fanEntries.length
  ) {
    const abbreviations = twoFanEntries
      .map((fan) => COPPER_TWO_FAN_ABBREVIATIONS[fan.fanName])
      .filter((value): value is string => Boolean(value));
    if (abbreviations.length === 2) {
      return {
        type: "silver",
        label: `铜・${abbreviations.join("")}`,
      };
    }
  }

  if (
    onlyOneAndTwoFan &&
    twoFanEntries.length === 1 &&
    oneFanEntries.length + twoFanEntries.length === fanEntries.length
  ) {
    return {
      type: "silver",
      label: `银・${twoFanEntries[0]?.fanName || "番种未知"}`,
    };
  }

  if (fanEntries.every((fan) => fan.unitFan === 1)) {
    const yaojiukeCount = fanEntries.filter(
      (fan) => fan.fanName === YAOJIUKE_FAN_NAME,
    ).length;
    return {
      type: "gold",
      label: yaojiukeCount >= 2 ? "金Ⅱ" : "金Ⅰ",
    };
  }

  return null;
}

function getMaxFanRemark(round: RoundOutcome): string {
  if (!round.winners.length) {
    return "";
  }

  const patternRemark = getRoundRemarkPattern(round);
  if (patternRemark) {
    return patternRemark.label;
  }

  let bestFanName = "番种未知";
  let bestFanValue = -1;
  let fallbackFanName = "";
  let skippedFlowerCandidate: {
    fanName: string;
    fanValue: number;
    playerName: string;
  } | null = null;

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
      if (!fallbackFanName && fan.fanName !== FLOWER_FAN_NAME) {
        fallbackFanName = fan.fanName;
      }
      if (fan.fanName === FLOWER_FAN_NAME) {
        if (
          !skippedFlowerCandidate ||
          fanValue > skippedFlowerCandidate.fanValue
        ) {
          skippedFlowerCandidate = {
            fanName: fan.fanName,
            fanValue,
            playerName: winner.playerName,
          };
        }
        return;
      }
      if (fanValue > bestFanValue) {
        bestFanName = fan.fanName;
        bestFanValue = fanValue;
      }
    });
  });

  if (bestFanValue < 0 && fallbackFanName) {
    bestFanName = fallbackFanName;
    bestFanValue = 0;
  }
  if (
    skippedFlowerCandidate &&
    skippedFlowerCandidate.fanValue > bestFanValue
  ) {
    warnLog("番种备注候选错误：已跳过花牌作为备注显示", {
      roundNo: round.roundNo,
      playerName: skippedFlowerCandidate.playerName,
      fanName: skippedFlowerCandidate.fanName,
      fanValue: skippedFlowerCandidate.fanValue,
      fallbackFanName: bestFanName,
    });
  }
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
  trigger.style.cursor = remark ? "pointer" : "default";
  trigger.style.color = remark
    ? "rgba(49,70,92,0.96)"
    : "rgba(102,115,129,0.92)";
  trigger.style.textDecoration = "none";
  trigger.style.font = "inherit";
  trigger.style.lineHeight = "inherit";
  trigger.title = remark;
  if (remark) {
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
    if (row.getAttribute("name") === "rdtr" && row.children.length === 0) {
      return;
    }
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
    if (row.children.length === 0) {
      return;
    }
    const roundNo =
      (table.querySelectorAll("tr[name='rdtr']").length ? rowIndex + 1 : 0) ||
      parseRoundNoFromRow(row);
    if (!roundNo) {
      return;
    }
    const round = roundMap.get(roundNo);
    const existingCell = row.querySelector(
      `.${ROUND_WIN_REMARK_CELL_CLASS}`,
    ) as HTMLTableCellElement | null;
    if (!round) {
      return;
    }
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
  ensureModeSwitcher(
    mode,
    readScoreCompactMode(),
    (nextMode) => {
      writeRoundWinDisplayMode(nextMode);
      applyRoundWinDisplayMode(nextMode, rounds, 0);
    },
    (nextMode) => {
      writeScoreCompactMode(nextMode);
      applyRoundWinDisplayMode(mode, rounds, 0);
    },
  );
  applyScoreCompactMode(table, rounds, readScoreCompactMode());

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
