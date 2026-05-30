import { w } from "../../../shared/env";

const FLOWER_TILE_VAL_MIN = 136;
const PLAYER_INDEX = 0;

interface EfficiencyState {
  lastStep: number | null;
  lastHandStr: string | null;
  lastResult: Record<string, unknown> | null;
}

const STATE_KEY = "__efficiency_state";

function getState(): EfficiencyState {
  const win = w as unknown as Record<string, unknown>;
  if (!win[STATE_KEY]) {
    win[STATE_KEY] = {
      lastStep: null,
      lastHandStr: null,
      lastResult: null,
    };
  }
  return win[STATE_KEY] as EfficiencyState;
}

export function resetState(): void {
  (w as unknown as Record<string, unknown>)[STATE_KEY] = {
    lastStep: null,
    lastHandStr: null,
    lastResult: null,
  };
}

export function getLastStep(): number | null {
  return getState().lastStep;
}

export function setLastStep(step: number): void {
  getState().lastStep = step;
}

export function getLastHandStr(): string | null {
  return getState().lastHandStr;
}

export function setLastHandStr(handStr: string): void {
  getState().lastHandStr = handStr;
}

export function getLastResult(): Record<string, unknown> | null {
  return getState().lastResult;
}

export function setLastResult(result: Record<string, unknown>): void {
  getState().lastResult = result;
}

/**
 * 读取 player 0 的手牌 tileId 数组
 */
export function getCurrentHandTiles(): number[] | null {
  const handContainers = document.querySelectorAll(".hand");
  if (handContainers.length <= PLAYER_INDEX) return null;

  const handContainer = handContainers[PLAYER_INDEX] as HTMLElement;
  const tileElements = handContainer.querySelectorAll(".tl");
  if (tileElements.length === 0) return null;

  const tiles: number[] = [];
  tileElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const val = htmlEl.dataset.val;
    if (val) {
      const rawVal = parseInt(val, 10);
      if (rawVal >= FLOWER_TILE_VAL_MIN) return;
      tiles.push(Math.floor(rawVal / 4));
    }
  });

  return tiles.length > 0 ? tiles : null;
}

/**
 * 将 tileId 数组转为排序后的字符串，用于手牌变化检测
 */
export function handTilesToStr(tiles: number[]): string {
  return tiles
    .slice()
    .sort((a, b) => a - b)
    .join(",");
}
