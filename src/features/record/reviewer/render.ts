import { w } from "../../../shared/env";
import { infoLog, warnLog } from "../../../shared/logger";
import {
  clearReviewError,
  getFilledReviews,
  getReviews,
  getReviewSeats,
  getTZInstance,
} from "./state";
import {
  Candidate,
  ReviewerPoolSnapshotItem,
  ReviewerRenderOptions,
} from "./types";

const PLAY_PREFIX = "Play ";
const CALL_PREFIXES = ["Chi", "Peng", "Gang", "BuGang"] as const;
const BAR_MAX_HEIGHT = 50;
const BAR_MIN_HEIGHT = 6;
const PLAY_SOFTMAX_TEMPERATURE = 1.6;
const RIVER_TILE_SELECTORS = [
  ".pool .tl",
  ".river .tl",
  ".discard .tl",
  ".show .tl",
  ".paihe .tl",
  ".sutehai .tl",
  ".desk-river .tl",
  "[class*='river'] .tl",
  "[class*='discard'] .tl",
  "[class*='show'] .tl",
  "[class*='paihe'] .tl",
  "[class*='sutehai'] .tl",
  "[class*='pool'] .tl",
];
const NON_RIVER_TILE_EXCLUSION_SELECTORS = [
  ".hand",
  ".furo",
  ".fulou",
  ".meld",
  ".naki",
  ".wall",
  ".rinshan",
  ".dora",
  ".dead-wall",
  ".review-container",
  "#review",
  "#res",
  "#fwin",
];

export interface ReviewerRenderRuntime {
  wind: string[];
  tile: string[];
  options: ReviewerRenderOptions;
  getLastStep: () => number | null;
  setLastStep: (value: number) => void;
  getLastPoolSnapshot: () => ReviewerPoolSnapshotItem[] | null;
  setLastPoolSnapshot: (value: ReviewerPoolSnapshotItem[]) => void;
}

function bz2tc(s: string): number {
  const type = s[0];
  const num = Number.parseInt(s.slice(1), 10) - 1;
  if (type === "W") return num;
  if (type === "T") return num + 9;
  if (type === "B") return num + 18;
  if (type === "F") return num + 27;
  if (type === "J") return num + 31;
  if (type === "H") return num + 34;
  warnLog("Unknown tile", s);
  return -1;
}

function tc2tile(tileCodes: string[], i: number): string {
  return tileCodes[i * 4] ?? "";
}

function act2str(act: string, tileCodes: string[]): string {
  const normalized = act.trim();
  if (normalized.startsWith("Chi")) {
    const components = normalized.split(/\s+/);
    const last = components.at(-1);
    if (!last) {
      return normalized;
    }
    const tile = tc2tile(tileCodes, bz2tc(last));
    if (!tile) {
      return normalized;
    }
    const chi = `${Number(tile[0]) - 1}${tile[0]}${Number(tile[0]) + 1}${tile[1]}`;
    return [...components.slice(0, -1), chi].join(" ");
  }

  const lastChar = normalized.at(-1) ?? "";
  if (lastChar >= "1" && lastChar <= "9") {
    const components = normalized.split(/\s+/);
    const last = components.at(-1);
    if (!last) {
      return normalized;
    }
    return [...components.slice(0, -1), tc2tile(tileCodes, bz2tc(last))].join(
      " ",
    );
  }

  return normalized;
}

function fmtLoad(i: number | undefined): string {
  switch (i) {
    case 0:
      return "✗";
    case 1:
      return "·";
    case 2:
      return "✓";
    default:
      return "_";
  }
}

export function parseRound(roundStr: string, wind: string[]): number {
  const trimmed = roundStr.trim();

  if (/^\d/.test(trimmed)) {
    return Number.parseInt(trimmed, 10) - 1;
  }

  if (wind.some((item) => trimmed.startsWith(`${item} `))) {
    const currentWind = wind.find((item) => trimmed.startsWith(`${item} `));
    if (!currentWind) {
      return 0;
    }
    const num =
      Number.parseInt(trimmed.slice(currentWind.length).trim(), 10) - 1;
    return wind.findIndex((item) => item === currentWind) * 4 + num;
  }

  if (trimmed.length === 3 && trimmed[1] === "风") {
    return (
      wind.findIndex((item) => item === trimmed[0]) * 4 +
      wind.findIndex((item) => item === trimmed[2])
    );
  }

  warnLog("Unknown round format", trimmed);
  return (
    wind.findIndex((item) => item === trimmed[0]) * 4 +
    wind.findIndex((item) => item === trimmed[2])
  );
}

function softmax(weights: number[], temperature = 1): number[] {
  if (weights.length === 0) {
    return [];
  }
  const maxWeight = Math.max(...weights);
  const expWeights = weights.map((weight) =>
    Math.exp((weight - maxWeight) / temperature),
  );
  const sumExp = expWeights.reduce((a, b) => a + b, 0);
  return expWeights.map((value) => value / sumExp);
}

function clearWeightBars(): void {
  document.querySelectorAll(".tile-weight-bar").forEach((el) => el.remove());
}

function clearHighlightTiles(): void {
  document.querySelectorAll(".tl.highlight-first-tile").forEach((el) => {
    el.classList.remove("highlight-first-tile");
  });
}

function getPlayerStep(): number {
  const tz = getTZInstance();
  if (tz && typeof tz.stp === "number") {
    return tz.stp - 18;
  }
  return -18;
}

function isPlayCandidate(act: string): boolean {
  return act.trim().startsWith(PLAY_PREFIX);
}

function isCallCandidate(act: string): boolean {
  const trimmed = act.trim();
  return CALL_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
}

function getTileIndexFromPlayAction(act: string): number {
  return bz2tc(act.trim().slice(PLAY_PREFIX.length));
}

function toBarHeight(probability: number): number {
  const eased = Math.sqrt(Math.max(0, probability));
  return BAR_MIN_HEIGHT + eased * (BAR_MAX_HEIGHT - BAR_MIN_HEIGHT);
}

function getPlayCandidates(candidates: Candidate[]): Candidate[] {
  return candidates.filter(([, act]) => isPlayCandidate(act));
}

function isVisibleTile(tileEl: Element): boolean {
  let current: Element | null = tileEl;

  while (current) {
    if (current instanceof HTMLElement && current.hidden) {
      return false;
    }

    const style = window.getComputedStyle(current);
    if (style.display === "none" || style.visibility === "hidden") {
      return false;
    }

    current = current.parentElement;
  }

  return true;
}

function findLastRiverTile(): HTMLElement | null {
  for (const selector of RIVER_TILE_SELECTORS) {
    const tiles = Array.from(document.querySelectorAll(selector)).filter(
      isVisibleTile,
    );
    const lastTile = tiles.at(-1);
    if (lastTile instanceof HTMLElement) {
      return lastTile;
    }
  }

  const fallbackTiles = Array.from(document.querySelectorAll(".tl")).filter(
    (tileEl) =>
      isVisibleTile(tileEl) &&
      !NON_RIVER_TILE_EXCLUSION_SELECTORS.some((selector) =>
        tileEl.closest(selector),
      ),
  );

  const lastTile = fallbackTiles.at(-1);
  return lastTile instanceof HTMLElement ? lastTile : null;
}

function serializeTile(tileEl: Element): string {
  const htmlTile = tileEl as HTMLElement;
  return [
    htmlTile.dataset.val ?? "",
    htmlTile.className,
    htmlTile.style.left,
    htmlTile.style.top,
  ].join("|");
}

function capturePoolSnapshot(): ReviewerPoolSnapshotItem[] {
  return Array.from(document.querySelectorAll(".pool")).map((poolEl) => ({
    tiles: Array.from(poolEl.querySelectorAll(".tl"))
      .filter(isVisibleTile)
      .map(serializeTile),
  }));
}

function findChangedPoolLastTile(
  previousSnapshot: ReviewerPoolSnapshotItem[] | null,
): HTMLElement | null {
  const pools = Array.from(document.querySelectorAll(".pool"));
  if (pools.length === 0 || !previousSnapshot?.length) {
    return null;
  }

  let changedPoolIndex = -1;
  let bestScore = 0;

  pools.forEach((poolEl, index) => {
    const currentTiles = Array.from(poolEl.querySelectorAll(".tl"))
      .filter(isVisibleTile)
      .map(serializeTile);
    const previousTiles = previousSnapshot[index]?.tiles ?? [];

    if (currentTiles.length < previousTiles.length) {
      return;
    }

    let firstDiffIndex = -1;
    const sharedLength = Math.min(currentTiles.length, previousTiles.length);
    for (let tileIndex = 0; tileIndex < sharedLength; tileIndex += 1) {
      if (currentTiles[tileIndex] !== previousTiles[tileIndex]) {
        firstDiffIndex = tileIndex;
        break;
      }
    }

    if (firstDiffIndex === -1 && currentTiles.length === previousTiles.length) {
      return;
    }

    const score =
      firstDiffIndex === -1
        ? currentTiles.length - previousTiles.length
        : currentTiles.length - firstDiffIndex;

    if (score > bestScore) {
      changedPoolIndex = index;
      bestScore = score;
    }
  });

  if (changedPoolIndex < 0) {
    return null;
  }

  const targetPool = pools[changedPoolIndex];
  const visibleTiles = Array.from(targetPool.querySelectorAll(".tl")).filter(
    isVisibleTile,
  );
  const lastTile = visibleTiles.at(-1);
  return lastTile instanceof HTMLElement ? lastTile : null;
}

function showWeightVisualization(
  candidates: Candidate[],
  playerIndex: number,
  options: ReviewerRenderOptions,
): void {
  if (playerIndex !== 0 || !options.showWeightBars) {
    return;
  }
  const handContainers = document.querySelectorAll(".hand");
  if (handContainers.length === 0) {
    return;
  }

  const currentHand = handContainers[0] as Element;
  const tiles = Array.from(currentHand.querySelectorAll(".tl"));
  const tileWeightMap = new Map<number, number>();
  const playCandidates = getPlayCandidates(candidates);
  if (playCandidates.length === 0) {
    return;
  }
  const probs = softmax(
    playCandidates.map(([weight]) => weight),
    PLAY_SOFTMAX_TEMPERATURE,
  );

  playCandidates.forEach(([, act], idx) => {
    const tileIndex = getTileIndexFromPlayAction(act);
    if (tileIndex >= 0 && tileIndex < 136) {
      const nextProb = probs[idx] ?? 0;
      const prevProb = tileWeightMap.get(tileIndex) ?? 0;
      tileWeightMap.set(tileIndex, Math.max(prevProb, nextProb));
    }
  });

  tiles.forEach((tileEl) => {
    const htmlTile = tileEl as HTMLElement;
    const tileVal = Number.parseInt(htmlTile.dataset.val ?? "-1", 10);
    if (Number.isNaN(tileVal)) {
      return;
    }
    const tileIndex = Math.floor(tileVal / 4);
    const prob = tileWeightMap.get(tileIndex);
    if (typeof prob === "undefined") {
      return;
    }

    if (window.getComputedStyle(htmlTile).position === "static") {
      htmlTile.style.position = "relative";
    }
    const bar = document.createElement("div");
    bar.className = "tile-weight-bar";
    bar.style.height = `${toBarHeight(prob).toFixed(2)}px`;
    htmlTile.appendChild(bar);
  });
}

function highlightHandTile(tileIndex: number): void {
  const tz = getTZInstance();
  if (!tz || typeof tz.stp !== "number" || !tz.stat?.[tz.stp]) {
    return;
  }

  const currentStat = tz.stat[tz.stp];
  let playerIndex = currentStat?.k;
  if (typeof playerIndex === "undefined") {
    playerIndex = 0;
  }

  const handContainers = document.querySelectorAll(".hand");
  if (handContainers.length <= playerIndex) {
    return;
  }

  const targetHand = handContainers[playerIndex] as Element;
  const tiles = targetHand.querySelectorAll(".tl");
  let highlighted = false;
  tiles.forEach((tileEl) => {
    if (highlighted) {
      return;
    }
    const htmlTile = tileEl as HTMLElement;
    const tileVal = Number.parseInt(htmlTile.dataset.val ?? "-1", 10);
    if (Math.floor(tileVal / 4) === tileIndex) {
      htmlTile.classList.add("highlight-first-tile");
      highlighted = true;
      infoLog(
        `Highlighted hand tile DOM for player ${playerIndex}: ${tileIndex}`,
      );
    }
  });
}

function highlightFirstCandidate(
  candidates: Candidate[],
  previousPoolSnapshot: ReviewerPoolSnapshotItem[] | null,
): void {
  const first = candidates[0];
  if (!first?.[1]) {
    return;
  }

  const act = first[1].trim();
  if (isPlayCandidate(act)) {
    const tileIndex = getTileIndexFromPlayAction(act);
    if (tileIndex >= 0 && tileIndex < 136) {
      highlightHandTile(tileIndex);
    }
    return;
  }

  if (!isCallCandidate(act)) {
    return;
  }

  const riverTile =
    findChangedPoolLastTile(previousPoolSnapshot) ?? findLastRiverTile();
  if (!riverTile) {
    return;
  }
  riverTile.classList.add("highlight-first-tile");
  infoLog(`Highlighted latest river tile for action: ${act}`);
}

export function showCandidates(runtime: ReviewerRenderRuntime): void {
  const roundEl = document.getElementById("round");
  const reviewLogEl = document.getElementById("review-log");
  const reviewEl = document.getElementById("review");
  if (!roundEl || !reviewLogEl || !reviewEl) {
    return;
  }

  const round = parseRound(roundEl.innerHTML, runtime.wind);
  const ri = getPlayerStep();
  const tz = getTZInstance();
  if (tz && typeof tz.stp === "number") {
    runtime.setLastStep(tz.stp);
  }

  reviewLogEl.innerHTML = `CHAGA Reviewer [Step ${ri}] [Load ${getReviewSeats().map(fmtLoad).join(" ")}]`;

  if (w.__review_error) {
    reviewEl.innerText = w.__review_error;
    clearWeightBars();
    clearHighlightTiles();
    return;
  }

  if (tz && w.__review_error) {
    clearReviewError();
  }

  const key = `${round}-${ri}`;
  const resp = getFilledReviews()[key] || getReviews()[key];
  const previousPoolSnapshot = runtime.getLastPoolSnapshot();
  clearHighlightTiles();
  clearWeightBars();

  const candidates = resp?.extra?.candidates;
  if (!candidates || !candidates.length) {
    reviewEl.innerText = "";
    return;
  }

  reviewEl.innerHTML = candidates
    .map(
      ([weight, act]) =>
        `${act2str(act, runtime.tile)}&nbsp;&nbsp;-&nbsp;&nbsp;${weight.toFixed(2)}`,
    )
    .join("<br>");

  const hasPlay = candidates.some(([, act]) => isPlayCandidate(act));
  if (hasPlay && tz && typeof tz.stp === "number") {
    const currentStat = tz.stat?.[tz.stp];
    const playerIndex = currentStat?.k ?? 0;
    showWeightVisualization(candidates, playerIndex, runtime.options);
  }

  if (runtime.options.highlightFirstTile) {
    highlightFirstCandidate(candidates, previousPoolSnapshot);
  }

  runtime.setLastPoolSnapshot(capturePoolSnapshot());
}

export function startStepWatcher(runtime: ReviewerRenderRuntime): void {
  const poll = () => {
    const stp = getTZInstance()?.stp;
    if (typeof stp === "number" && stp !== runtime.getLastStep()) {
      runtime.setLastStep(stp);
      showCandidates(runtime);
    }
  };
  w.setInterval(poll, 200);
}
