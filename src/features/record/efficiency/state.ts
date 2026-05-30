import { w } from "../../../shared/env";

const FLOWER_TILE_VAL_MIN = 136;
const PLAYER_INDEX = 0;

// tl-1m -> 0, tl-2m -> 1, ..., tl-E -> 27, ..., tl-P -> 33
const TL_CLASS_TO_ID: Record<string, number> = {};
const SUITS = ["m", "s", "p"];
for (let s = 0; s < 3; s++) {
  for (let r = 1; r <= 9; r++) {
    TL_CLASS_TO_ID[`${r}${SUITS[s]}`] = s * 9 + (r - 1);
  }
}
TL_CLASS_TO_ID["1z"] = 27; // E
TL_CLASS_TO_ID["2z"] = 28; // S
TL_CLASS_TO_ID["3z"] = 29; // W
TL_CLASS_TO_ID["4z"] = 30; // N
TL_CLASS_TO_ID["5z"] = 31; // C
TL_CLASS_TO_ID["6z"] = 32; // F
TL_CLASS_TO_ID["7z"] = 33; // P

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
 * 从 CSS 类名解析牌 ID
 * tl-1m -> 0, tl-9p -> 26, tl-E -> 27, tl-P -> 33
 */
function parseTileIdFromClass(className: string): number | null {
  const match = className.match(/\btl-([1-9][msp]|[1-7]z)\b/);
  if (match) {
    return TL_CLASS_TO_ID[match[1]] ?? null;
  }
  // 字牌简写
  const honorMatch = className.match(/\btl-([ESWNCFP])\b/);
  if (honorMatch) {
    const map: Record<string, number> = {
      E: 27,
      S: 28,
      W: 29,
      N: 30,
      C: 31,
      F: 32,
      P: 33,
    };
    return map[honorMatch[1]] ?? null;
  }
  return null;
}

/**
 * 从 HTML 字符串中解析所有牌（闭门 + 副露）
 * stat[].hd 是 hd_hs 函数生成的 HTML，包含所有 .tl 元素
 *
 * 关键区分：
 * - 闭门牌：有 data-val 属性
 * - 副露牌：无 data-val 属性（hd_hs 不给副露牌加 data-val）
 */
function parseHandHtml(html: string): {
  closed: number[];
  melds: number[][];
} {
  const closed: number[] = [];
  const melds: number[][] = [];
  let currentMeld: number[] = [];

  // 匹配所有 .tl 元素
  const regex = /<div[^>]*class="[^"]*\btl\b[^"]*"[^>]*>/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const tag = match[0];

    // 有 data-val → 闭门牌
    const valMatch = tag.match(/data-val="(\d+)"/);
    if (valMatch) {
      // 先保存未完成的副露组
      if (currentMeld.length > 0) {
        melds.push(currentMeld);
        currentMeld = [];
      }

      const rawVal = parseInt(valMatch[1], 10);
      if (rawVal < FLOWER_TILE_VAL_MIN) {
        closed.push(Math.floor(rawVal / 4));
      }
      continue;
    }

    // 无 data-val → 副露牌，从 CSS 类名解析
    const tileId = parseTileIdFromClass(tag);
    if (tileId === null) continue;
    currentMeld.push(tileId);
  }

  // 保存最后一个副露组
  if (currentMeld.length > 0) {
    melds.push(currentMeld);
  }

  return { closed, melds };
}

/**
 * 读取 player 0 当前步骤的手牌（含副露）
 * 直接从 stat[].hd HTML 解析，而非从 DOM 读取
 */
export function getCurrentHandTiles(): {
  closed: number[];
  melds: number[][];
} | null {
  const tz = (w as unknown as Record<string, unknown>).__review_tz_instance as
    | Record<string, unknown>
    | undefined;
  if (!tz || typeof tz.stp !== "number" || !Array.isArray(tz.stat)) {
    return null;
  }

  const step = tz.stp;
  const st = tz.stat[step] as Record<string, unknown> | undefined;
  if (!st || !st.hd) {
    return null;
  }

  let html: string;
  if (typeof st.hd === "string") {
    html = st.hd;
  } else if (Array.isArray(st.hd)) {
    // hd 是 4 个玩家的手牌 HTML 数组
    // 需要根据 seat 映射找到 player 0 的手牌
    const seat = ((tz as Record<string, unknown>).seat as number) ?? 0;
    const playerHtml = st.hd[seat] ?? st.hd[0];
    if (!playerHtml) return null;
    html = playerHtml;
  } else {
    return null;
  }

  const result = parseHandHtml(html);

  // 验证：闭门 + 副露总张数应为 13 或 14
  const meldCount = result.melds.reduce((s, g) => s + g.length, 0);
  const total = result.closed.length + meldCount;
  if (total < 10) return null;

  return result;
}

/**
 * 将一组牌 ID 转为紧凑格式
 * [8,8,8] -> "999m", [27,28,29] -> "ESW"
 */
function tileGroupToStr(tileIds: number[]): string {
  const suits: Record<string, number[]> = { m: [], s: [], p: [], z: [] };
  const honors: string[] = [];
  const honorMap: Record<number, string> = {
    27: "E",
    28: "S",
    29: "W",
    30: "N",
    31: "C",
    32: "F",
    33: "P",
  };

  for (const tileId of tileIds) {
    if (tileId < 9) suits.m.push(tileId + 1);
    else if (tileId < 18) suits.s.push(tileId - 8);
    else if (tileId < 27) suits.p.push(tileId - 17);
    else if (honorMap[tileId]) honors.push(honorMap[tileId]);
    else suits.z.push(tileId - 26);
  }

  let str = "";
  for (const suit of ["m", "s", "p"]) {
    if (suits[suit].length > 0) {
      suits[suit].sort((a, b) => a - b);
      str += suits[suit].join("") + suit;
    }
  }
  if (honors.length > 0) {
    str += honors.join("");
  }
  if (suits.z.length > 0) {
    suits.z.sort((a, b) => a - b);
    str += suits.z.join("") + "z";
  }
  return str;
}

/**
 * 构建完整手牌字符串（含副露前缀）
 * 例: [999m,1]7m678888s2779p
 */
export function buildHandString(closed: number[], melds: number[][]): string {
  let handStr = "";

  // 副露前缀：[999m,1] 格式
  for (const group of melds) {
    handStr += `[${tileGroupToStr(group)},1]`;
  }

  // 闭门手牌
  handStr += tileGroupToStr(closed);

  return handStr;
}

/**
 * 用于手牌变化检测
 */
export function handTilesToStr(closed: number[], melds: number[][]): string {
  const all = [...closed];
  for (const g of melds) all.push(...g);
  return all.sort((a, b) => a - b).join(",");
}
