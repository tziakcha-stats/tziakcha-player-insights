import { ReviewResponseItem } from "../record/reviewer/types";

export type ChoiceKind =
  | "play"
  | "chi"
  | "peng"
  | "gang"
  | "hu"
  | "pass"
  | "abandon";

export type Choice = {
  seat: number;
  actionIndex: number;
  kind: ChoiceKind;
  value: number | null;
};

function bz2tc(tileCode: string): number {
  if (!tileCode || tileCode.length < 2) {
    return -1;
  }
  const tileType = tileCode[0];
  const number = Number.parseInt(tileCode.slice(1), 10) - 1;
  if (Number.isNaN(number)) {
    return -1;
  }
  if (tileType === "W") return number;
  if (tileType === "T") return number + 9;
  if (tileType === "B") return number + 18;
  if (tileType === "F") return number + 27;
  if (tileType === "J") return number + 31;
  if (tileType === "H") return number + 34;
  return -1;
}

export function normalizeAiAction(
  actionText: string,
): [ChoiceKind, number | null] | null {
  const trimmed = actionText.trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed.startsWith("Play ")) {
    const tileIndex = bz2tc(trimmed.split(/\s+/).at(-1) || "");
    return ["play", tileIndex >= 0 ? tileIndex : null];
  }
  if (trimmed.startsWith("Chi")) return ["chi", null];
  if (trimmed.startsWith("Peng")) return ["peng", null];
  if (trimmed.startsWith("Gang") || trimmed.startsWith("BuGang"))
    return ["gang", null];
  if (trimmed.startsWith("Hu")) return ["hu", null];
  if (trimmed.startsWith("Pass")) return ["pass", null];
  if (trimmed.startsWith("Abandon")) return ["abandon", null];
  return null;
}

export function choiceMatchesAi(
  choice: Choice,
  row: ReviewResponseItem | undefined,
): boolean {
  if (!row) {
    return true;
  }
  const candidates = row.extra?.candidates;
  if (!Array.isArray(candidates) || !candidates.length) {
    return true;
  }
  const top = candidates[0];
  if (!Array.isArray(top) || typeof top[1] !== "string") {
    return true;
  }
  const normalized = normalizeAiAction(top[1]);
  if (!normalized) {
    return true;
  }
  const [kind, value] = normalized;
  if (kind !== choice.kind) {
    return false;
  }
  if (kind === "play" && value !== choice.value) {
    return false;
  }
  return true;
}

export function calcChagaScore(
  choice: Choice,
  row: ReviewResponseItem | undefined,
): number {
  if (!row) {
    return 100;
  }
  const candidates = row.extra?.candidates;
  if (!Array.isArray(candidates) || !candidates.length) {
    return 100;
  }
  const parsed: Array<{
    weight: number;
    normalized: [ChoiceKind, number | null];
  }> = [];
  candidates.forEach((item) => {
    if (!Array.isArray(item) || item.length < 2) {
      return;
    }
    const [weightRaw, actionRaw] = item;
    if (typeof weightRaw !== "number" || typeof actionRaw !== "string") {
      return;
    }
    const normalized = normalizeAiAction(actionRaw);
    if (!normalized) {
      return;
    }
    parsed.push({ weight: weightRaw, normalized });
  });
  if (!parsed.length) {
    return 100;
  }
  const topWeight = parsed[0].weight;
  let matchedWeight: number | null = null;
  parsed.forEach(({ weight, normalized }) => {
    const [kind, value] = normalized;
    if (kind !== choice.kind) {
      return;
    }
    if (kind === "play" && value !== choice.value) {
      return;
    }
    if (matchedWeight === null || weight > matchedWeight) {
      matchedWeight = weight;
    }
  });
  if (matchedWeight === null) {
    return 0;
  }
  return Math.exp(matchedWeight - topWeight) * 100;
}
