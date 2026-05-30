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

function readTileIds(container: Element): number[] {
  const tiles: number[] = [];
  container.querySelectorAll(".tl").forEach((el) => {
    const htmlEl = el as HTMLElement;
    const val = htmlEl.dataset.val;
    if (val) {
      const rawVal = parseInt(val, 10);
      if (rawVal >= FLOWER_TILE_VAL_MIN) return;
      tiles.push(Math.floor(rawVal / 4));
    }
  });
  return tiles;
}

/**
 * 读取 player 0 的闭门手牌 tileId 数组
 */
export function getCurrentHandTiles(): number[] | null {
  const handContainers = document.querySelectorAll(".hand");
  if (handContainers.length <= PLAYER_INDEX) return null;

  const tiles = readTileIds(handContainers[PLAYER_INDEX]);
  return tiles.length > 0 ? tiles : null;
}

/**
 * 读取 player 0 的副露牌组
 * 返回每组副露的 tileId 数组
 */
export function getMeldGroups(): number[][] {
  const meldSelectors = [".furo", ".fulou", ".meld", ".naki"];
  const containers = document.querySelectorAll(".hand");
  if (containers.length <= PLAYER_INDEX) return [];

  const playerEl = containers[PLAYER_INDEX].parentElement;
  if (!playerEl) return [];

  const groups: number[][] = [];

  for (const selector of meldSelectors) {
    const meldContainers = playerEl.querySelectorAll(selector);
    for (const meldContainer of meldContainers) {
      // 每个副露容器可能有多个副露组
      // 尝试读取子容器（每个子容器是一个副露组）
      const subContainers = meldContainer.querySelectorAll(
        ":scope > div, :scope > span",
      );

      if (subContainers.length > 0) {
        for (const sub of subContainers) {
          const tiles = readTileIds(sub);
          if (tiles.length >= 3) {
            groups.push(tiles);
          }
        }
      } else {
        // 没有子容器，直接读取所有牌
        const tiles = readTileIds(meldContainer);
        if (tiles.length >= 3) {
          // 按 3 或 4 张一组分割
          for (let i = 0; i < tiles.length; i += 3) {
            const group = tiles.slice(i, i + 4);
            if (group.length >= 3) {
              groups.push(group);
            }
          }
        }
      }
    }
    if (groups.length > 0) break;
  }

  return groups;
}

/**
 * 将 tileId 转为手牌字符串格式
 */
function tileIdToHandStr(tileId: number): string {
  const suits = ["m", "p", "s"];
  const suitIndex = Math.floor(tileId / 9);
  const rank = (tileId % 9) + 1;

  if (suitIndex < 3) {
    return `${rank}${suits[suitIndex]}`;
  }

  // 字牌
  const honorMap: Record<number, string> = {
    27: "E",
    28: "S",
    29: "W",
    30: "N",
    31: "C",
    32: "F",
    33: "P",
  };
  return honorMap[tileId] ?? `${tileId - 26}z`;
}

/**
 * 将牌组转为手牌字符串（不含花色后缀）
 */
function tilesToSuitStr(tiles: number[]): string {
  return tiles.map(tileIdToHandStr).join("");
}

/**
 * 构建完整手牌字符串（含副露前缀）
 * 闭门手牌 + 副露组
 */
export function buildHandString(
  closedTiles: number[],
  meldGroups: number[][],
): string {
  let handStr = "";

  // 副露前缀
  for (const group of meldGroups) {
    handStr += `[${tilesToSuitStr(group)},1]`;
  }

  // 闭门手牌：按花色分组
  const suits: Record<string, number[]> = { m: [], p: [], s: [], z: [] };
  for (const tileId of closedTiles) {
    if (tileId < 9) suits.m.push(tileId + 1);
    else if (tileId < 18) suits.p.push(tileId - 8);
    else if (tileId < 27) suits.s.push(tileId - 17);
    else suits.z.push(tileId - 26);
  }

  for (const [suit, ranks] of Object.entries(suits)) {
    if (ranks.length > 0) {
      ranks.sort((a, b) => a - b);
      handStr += ranks.join("") + suit;
    }
  }

  return handStr;
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
