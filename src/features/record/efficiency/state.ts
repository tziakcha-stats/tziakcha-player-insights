import { w } from "../../../shared/env";

interface EfficiencyState {
  lastAnalyzedStep: number | null;
  lastAnalysisResult: Record<string, unknown> | null;
}

const STATE_KEY = "__efficiency_state";
const FLOWER_TILE_VAL_MIN = 136;

function getState(): EfficiencyState {
  const win = w as unknown as Record<string, unknown>;
  if (!win[STATE_KEY]) {
    win[STATE_KEY] = {
      lastAnalyzedStep: null,
      lastAnalysisResult: null,
    };
  }
  return win[STATE_KEY] as EfficiencyState;
}

export function resetState(): void {
  (w as unknown as Record<string, unknown>)[STATE_KEY] = {
    lastAnalyzedStep: null,
    lastAnalysisResult: null,
  };
}

export function getLastAnalyzedStep(): number | null {
  return getState().lastAnalyzedStep;
}

export function setLastAnalyzedStep(step: number): void {
  getState().lastAnalyzedStep = step;
}

export function getAnalysisResult(): Record<string, unknown> | null {
  return getState().lastAnalysisResult;
}

export function setAnalysisResult(result: Record<string, unknown>): void {
  getState().lastAnalysisResult = result;
}

/**
 * Get current hand tiles from DOM
 * @param playerIndex - 当前玩家索引，从 tz.stat[tz.stp].k 获取
 * @returns Array of tile IDs (0-33), or null if not available
 */
export function getCurrentHandTiles(playerIndex: number = 0): number[] | null {
  const handContainers = document.querySelectorAll(".hand");
  if (handContainers.length <= playerIndex) return null;

  const handContainer = handContainers[playerIndex] as HTMLElement;
  const tileElements = handContainer.querySelectorAll(".tl");
  if (tileElements.length === 0) return null;

  const tiles: number[] = [];
  tileElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const val = htmlEl.dataset.val;
    if (val) {
      const rawVal = parseInt(val, 10);
      if (rawVal >= FLOWER_TILE_VAL_MIN) return;
      const tileId = Math.floor(rawVal / 4);
      tiles.push(tileId);
    }
  });

  return tiles.length > 0 ? tiles : null;
}
