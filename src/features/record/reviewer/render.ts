import { w } from "../../../shared/env";
import { infoLog, warnLog } from "../../../shared/logger";
import {
  clearReviewError,
  getFilledReviews,
  getReviews,
  getReviewSeats,
  getTZInstance,
} from "./state";
import { Candidate, ReviewerRenderOptions } from "./types";

export interface ReviewerRenderRuntime {
  wind: string[];
  tile: string[];
  options: ReviewerRenderOptions;
  getLastStep: () => number | null;
  setLastStep: (value: number) => void;
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

function softmax(weights: number[]): number[] {
  const maxWeight = Math.max(...weights);
  const expWeights = weights.map((weight) => Math.exp(weight - maxWeight));
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
  const probs = softmax(candidates.map(([weight]) => weight));

  candidates.forEach(([, act], idx) => {
    const actStr = act.trim();
    if (!actStr.startsWith("Play ")) {
      return;
    }
    const tileCode = actStr.slice(5);
    const tileIndex = bz2tc(tileCode);
    if (tileIndex >= 0 && tileIndex < 136 && !tileWeightMap.has(tileIndex)) {
      tileWeightMap.set(tileIndex, probs[idx] ?? 0);
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
    bar.style.height = `${prob * 50}px`;
    htmlTile.appendChild(bar);
  });
}

function highlightFirstCandidate(candidates: Candidate[]): void {
  const tz = getTZInstance();
  if (!tz || typeof tz.stp !== "number" || !tz.stat?.[tz.stp]) {
    return;
  }
  const first = candidates[0];
  if (!first?.[1]) {
    return;
  }

  const act = first[1].trim();
  if (!act.startsWith("Play ")) {
    return;
  }
  const tileCode = act.slice(5);
  const tileIndex = bz2tc(tileCode);
  if (tileIndex < 0 || tileIndex >= 136) {
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
      infoLog(`Highlighted tile DOM for player ${playerIndex}: ${tileCode}`);
    }
  });
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

  const hasPlay = candidates.some(([, act]) => act.trim().startsWith("Play "));
  if (hasPlay && tz && typeof tz.stp === "number") {
    const currentStat = tz.stat?.[tz.stp];
    const playerIndex = currentStat?.k ?? 0;
    showWeightVisualization(candidates, playerIndex, runtime.options);
  }

  if (hasPlay && runtime.options.highlightFirstTile) {
    highlightFirstCandidate(candidates);
  }
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
