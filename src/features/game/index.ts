import { w } from "../../shared/env";
import { infoLog, warnLog } from "../../shared/logger";
import { fetchSessionData } from "../../shared/session-data";

import { ReviewResponseItem } from "../record/reviewer/types";
import { calcChagaScore, choiceMatchesAi, Choice } from "./chaga-score";
import { fetchAiResponse } from "./chaga-data";
import { fetchStepData, StepData } from "./step-data";
import { extractChoices } from "./step-simulator";
import { parseWinFanItems, WinFanItem } from "./win-info";

type RoundWinInfo = {
  roundNo: number;
  totalFan: number;
  fanItems: WinFanItem[];
};

type RoundOutcome = {
  roundNo: number;
  winners: Array<{
    playerName: string;
    totalFan: number;
    fanItems: WinFanItem[];
  }>;
  discarderNames: string[];
  selfDraw: boolean;
};

type PlayerMetric = {
  playerName: string;
  matched: number;
  total: number;
  ratio: number;
  chagaSum: number;
  chagaCount: number;
  chagaAvg: number;
  winRounds: RoundWinInfo[];
};

type MetricsResult = {
  players: PlayerMetric[];
  rounds: RoundOutcome[];
  overall: {
    matched: number;
    total: number;
    ratio: number;
    chagaAvg: number;
  };
};

type PreparedSessionData = {
  sessionPlayerNames: string[];
  steps: StepData[];
};

const FIXED_RI_OFFSET = -1;
const SESSION_NOT_FINISHED_ERROR = "SESSION_NOT_FINISHED";
const S2O: ReadonlyArray<ReadonlyArray<number>> = [
  [0, 1, 2, 3],
  [1, 2, 3, 0],
  [2, 3, 0, 1],
  [3, 0, 1, 2],
  [1, 0, 3, 2],
  [0, 3, 2, 1],
  [3, 2, 1, 0],
  [2, 1, 0, 3],
  [2, 3, 1, 0],
  [3, 1, 0, 2],
  [1, 0, 2, 3],
  [0, 2, 3, 1],
  [3, 2, 0, 1],
  [2, 0, 1, 3],
  [0, 1, 3, 2],
  [1, 3, 2, 0],
];
let startedGameHref = "";

function getGameIdFromUrl(): string | null {
  const url = new URL(w.location.href);
  return url.searchParams.get("id");
}

function buildResponseMap(
  responseRows: ReviewResponseItem[],
  roundIndex: number,
): Map<number, ReviewResponseItem> {
  const responseMap = new Map<number, ReviewResponseItem>();
  responseRows.forEach((row) => {
    if (row.rr !== roundIndex || typeof row.ri !== "number") {
      return;
    }
    if (!responseMap.has(row.ri)) {
      responseMap.set(row.ri, row);
    }
  });
  return responseMap;
}

function getSeatToPlayerOrder(roundNo: number): ReadonlyArray<number> {
  if (!S2O.length) {
    return [0, 1, 2, 3];
  }
  return (
    S2O[((roundNo % S2O.length) + S2O.length) % S2O.length] || [0, 1, 2, 3]
  );
}

async function computeMetrics(sessionId: string): Promise<MetricsResult> {
  const prepared = await prepareSessionData(sessionId);
  const { sessionPlayerNames, steps } = prepared;
  const playerMetrics = sessionPlayerNames.map<PlayerMetric>((playerName) => ({
    playerName,
    matched: 0,
    total: 0,
    ratio: 0,
    chagaSum: 0,
    chagaCount: 0,
    chagaAvg: 0,
    winRounds: [],
  }));
  const rounds = computeRoundOutcomes(sessionPlayerNames, steps, playerMetrics);

  const aiResponses = await Promise.all(
    [0, 1, 2, 3].map((seat) => fetchAiResponse(sessionId, seat)),
  );
  steps.forEach((stepData, roundNo) => {
    const seatToPlayerOrder = getSeatToPlayerOrder(roundNo);
    const aiToRoundSeat = [0, 1, 2, 3].map((playerOrder) =>
      seatToPlayerOrder.findIndex(
        (seatPlayerOrder) => seatPlayerOrder === playerOrder,
      ),
    );
    const allChoices = extractChoices(stepData);

    for (let aiSeat = 0; aiSeat < 4; aiSeat += 1) {
      const stepSeat = aiToRoundSeat[aiSeat];
      if (stepSeat < 0) {
        continue;
      }
      const responseMap = buildResponseMap(aiResponses[aiSeat] || [], roundNo);
      const seatChoices = allChoices.filter(
        (choice) => choice.seat === stepSeat,
      );
      seatChoices.forEach((choice) => {
        const ri = choice.actionIndex + FIXED_RI_OFFSET;
        const row = responseMap.get(ri);
        const matched = choiceMatchesAi(choice, row);
        const chagaScore = calcChagaScore(choice, row);
        const metric = playerMetrics[aiSeat];
        metric.total += 1;
        if (matched) {
          metric.matched += 1;
        }
        metric.chagaSum += chagaScore;
        metric.chagaCount += 1;
      });
    }
  });

  playerMetrics.forEach((metric) => {
    metric.ratio = metric.total ? metric.matched / metric.total : 0;
    metric.chagaAvg = metric.chagaCount
      ? metric.chagaSum / metric.chagaCount
      : 0;
  });

  const overallMatched = playerMetrics.reduce(
    (sum, item) => sum + item.matched,
    0,
  );
  const overallTotal = playerMetrics.reduce((sum, item) => sum + item.total, 0);
  const overallChagaSum = playerMetrics.reduce(
    (sum, item) => sum + item.chagaSum,
    0,
  );
  const overallChagaCount = playerMetrics.reduce(
    (sum, item) => sum + item.chagaCount,
    0,
  );

  return {
    players: playerMetrics,
    rounds,
    overall: {
      matched: overallMatched,
      total: overallTotal,
      ratio: overallTotal ? overallMatched / overallTotal : 0,
      chagaAvg: overallChagaCount ? overallChagaSum / overallChagaCount : 0,
    },
  };
}

async function prepareSessionData(
  sessionId: string,
): Promise<PreparedSessionData> {
  const sessionData = await fetchSessionData(sessionId);
  if (!sessionData.isFinished) {
    throw new Error(SESSION_NOT_FINISHED_ERROR);
  }

  const sessionPlayerNames = sessionData.players.map(
    (player, index) => player.name || `Seat ${index}`,
  );
  const steps = await Promise.all(
    sessionData.records.map((record) => fetchStepData(record.id)),
  );

  return { sessionPlayerNames, steps };
}

function computeRoundOutcomes(
  sessionPlayerNames: string[],
  steps: StepData[],
  playerMetrics?: PlayerMetric[],
): RoundOutcome[] {
  const rounds: RoundOutcome[] = [];

  steps.forEach((stepData, roundNo) => {
    const seatToPlayerOrder = getSeatToPlayerOrder(roundNo);
    const resultBits = typeof stepData.b === "number" ? stepData.b : 0;
    const winnerMask = resultBits & 0x0f;
    const discarderMask = (resultBits >> 4) & 0x0f;
    if (!winnerMask) {
      return;
    }

    const winnerDetails: RoundOutcome["winners"] = [];
    for (let stepSeat = 0; stepSeat < 4; stepSeat += 1) {
      if (((winnerMask >> stepSeat) & 1) === 0) {
        continue;
      }

      const aiSeat = seatToPlayerOrder[stepSeat] ?? -1;
      if (aiSeat < 0) {
        continue;
      }

      const seatY = Array.isArray(stepData.y) ? stepData.y[stepSeat] : null;
      const fanItems = parseWinFanItems(seatY?.t);
      const totalFan =
        typeof seatY?.f === "number"
          ? seatY.f
          : fanItems.reduce((sum, item) => sum + item.totalFan, 0);

      if (playerMetrics && playerMetrics[aiSeat]) {
        playerMetrics[aiSeat].winRounds.push({
          roundNo: roundNo + 1,
          totalFan,
          fanItems,
        });
      }

      winnerDetails.push({
        playerName: sessionPlayerNames[aiSeat] || `Seat ${aiSeat}`,
        totalFan,
        fanItems,
      });
    }

    const discarderNames: string[] = [];
    for (let stepSeat = 0; stepSeat < 4; stepSeat += 1) {
      if (((discarderMask >> stepSeat) & 1) === 0) {
        continue;
      }

      const aiSeat = seatToPlayerOrder[stepSeat] ?? -1;
      if (aiSeat < 0) {
        continue;
      }
      discarderNames.push(sessionPlayerNames[aiSeat] || `Seat ${aiSeat}`);
    }

    rounds.push({
      roundNo: roundNo + 1,
      winners: winnerDetails,
      discarderNames,
      selfDraw:
        discarderNames.length === 0 ||
        discarderNames.every((name) =>
          winnerDetails.some((winner) => winner.playerName === name),
        ),
    });
  });

  return rounds;
}

function findStandardScoreRow(): HTMLTableRowElement | null {
  // 先尝试带 .table 类（桌面端），再兜底普通 table（移动端）
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

function clearInsertedRows(): void {
  document.getElementById("reviewer-game-ratio-row")?.remove();
  document.getElementById("reviewer-game-chaga-row")?.remove();
  document.getElementById("reviewer-game-pending-row")?.remove();
  document
    .querySelectorAll(
      ".reviewer-game-round-toggle, .reviewer-game-round-separator, .reviewer-game-detail-row",
    )
    .forEach((element) => element.remove());
  document.getElementById("reviewer-game-side-panel")?.remove();

  const layoutWrap = document.getElementById("reviewer-game-layout-wrap");
  if (layoutWrap && layoutWrap.parentElement) {
    const table = layoutWrap.querySelector("table");
    if (table) {
      layoutWrap.parentElement.insertBefore(table, layoutWrap);
    }
    layoutWrap.remove();
  }
}

function withAnchorRow(
  callback: (anchor: HTMLTableRowElement) => void,
  retryInterval = 200,
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

function parseRoundNoFromRow(row: HTMLTableRowElement): number | null {
  const cells = Array.from(row.children) as HTMLTableCellElement[];
  for (const cell of cells) {
    const text = (cell.textContent || "").trim();
    if (!text) {
      continue;
    }
    if (!/^\d{1,3}$/.test(text)) {
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

  if (!best) {
    return null;
  }
  if (best.score <= 0) {
    return null;
  }
  return best.table;
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

function installRoundToggleButtons(
  rounds: RoundOutcome[],
  retryCount = 0,
): void {
  const table = findRoundTable();
  if (!table) {
    if (retryCount < 20) {
      setTimeout(() => installRoundToggleButtons(rounds, retryCount + 1), 200);
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

  if (installedCount === 0 && retryCount < 20) {
    setTimeout(() => installRoundToggleButtons(rounds, retryCount + 1), 200);
  }
}

function upsertMetricsRows(metrics: MetricsResult): void {
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

function upsertPendingRow(message: string): void {
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

function upsertLoadingRows(message: string): void {
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

export function initGameFeature(href: string): boolean {
  if (startedGameHref === href) {
    return false;
  }
  startedGameHref = href;
  const sessionId = getGameIdFromUrl();
  if (!sessionId) {
    warnLog("Game feature init skipped: missing session id");
    return false;
  }
  infoLog("Game feature init started", { sessionId });
  upsertLoadingRows("计算中...");
  const preparedPromise = prepareSessionData(sessionId);

  void preparedPromise
    .then((prepared) => {
      const rounds = computeRoundOutcomes(
        prepared.sessionPlayerNames,
        prepared.steps,
      );
      installRoundToggleButtons(rounds);
    })
    .catch((error) => {
      if ((error as Error)?.message === SESSION_NOT_FINISHED_ERROR) {
        upsertPendingRow("等待对局完成");
        return;
      }
      warnLog("Game rounds preview failed", error);
    });

  void computeMetrics(sessionId)
    .then((metrics) => {
      upsertMetricsRows(metrics);
      installRoundToggleButtons(metrics.rounds);
    })
    .catch((error) => {
      if ((error as Error)?.message === SESSION_NOT_FINISHED_ERROR) {
        upsertPendingRow("等待对局完成");
        return;
      }
      warnLog("Game overview metrics failed", error);
      upsertLoadingRows("加载失败");
    });
  return true;
}
