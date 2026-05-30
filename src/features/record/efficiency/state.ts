import { w } from "../../../shared/env";
import { EfficiencyResult } from "../../../shared/efficiency";

interface EfficiencyState {
  lastAnalyzedStep: number | null;
  lastAnalysisResult: EfficiencyResult | null;
}

const STATE_KEY = "__efficiency_state";

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

/**
 * Reset all state to initial values
 */
export function resetState(): void {
  (w as unknown as Record<string, unknown>)[STATE_KEY] = {
    lastAnalyzedStep: null,
    lastAnalysisResult: null,
  };
}

/**
 * Get last analyzed step number
 */
export function getLastAnalyzedStep(): number | null {
  return getState().lastAnalyzedStep;
}

/**
 * Set last analyzed step number
 */
export function setLastAnalyzedStep(step: number): void {
  getState().lastAnalyzedStep = step;
}

/**
 * Get cached analysis result
 */
export function getAnalysisResult(): EfficiencyResult | null {
  return getState().lastAnalysisResult;
}

/**
 * Set analysis result cache
 */
export function setAnalysisResult(result: EfficiencyResult): void {
  getState().lastAnalysisResult = result;
}

const FLOWER_TILE_VAL_MIN = 136;

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
      // 跳过花牌 (data-val >= 136)
      if (rawVal >= FLOWER_TILE_VAL_MIN) return;
      const tileId = Math.floor(rawVal / 4);
      tiles.push(tileId);
    }
  });

  return tiles.length > 0 ? tiles : null;
}
