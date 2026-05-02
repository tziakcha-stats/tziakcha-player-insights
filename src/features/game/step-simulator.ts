import { StepData } from "./step-data";
import { Choice } from "./chaga-score";

const CHOICE_ACTION_TYPES = new Set([2, 3, 4, 5, 6, 8, 9]);

function actionToChoice(
  actionIndex: number,
  combined: number,
  data: number,
): Choice | null {
  const seat = (combined >> 4) & 3;
  const actionType = combined & 15;
  if (!CHOICE_ACTION_TYPES.has(actionType)) {
    return null;
  }
  if (actionType === 2) {
    const tileId = data & 0xff;
    return { seat, actionIndex, kind: "play", value: Math.floor(tileId / 4) };
  }
  if (actionType === 3) {
    return { seat, actionIndex, kind: "chi", value: null };
  }
  if (actionType === 4) {
    return { seat, actionIndex, kind: "peng", value: null };
  }
  if (actionType === 5) {
    return { seat, actionIndex, kind: "gang", value: null };
  }
  if (actionType === 6) {
    const isAutoHu = Boolean(data & 1);
    return isAutoHu ? null : { seat, actionIndex, kind: "hu", value: null };
  }
  if (actionType === 8) {
    const passMode = data & 3;
    return passMode !== 0
      ? null
      : { seat, actionIndex, kind: "pass", value: null };
  }
  if (actionType === 9) {
    return { seat, actionIndex, kind: "abandon", value: null };
  }
  return null;
}

/**
 * 将牌谱动作流解析为逐步可比对的选择序列
 */
export function extractChoices(stepData: StepData): Choice[] {
  if (!Array.isArray(stepData.a)) {
    return [];
  }
  const result: Choice[] = [];
  stepData.a.forEach((action, actionIndex) => {
    if (!Array.isArray(action) || action.length < 2) {
      return;
    }
    const [combined, data] = action;
    if (typeof combined !== "number" || typeof data !== "number") {
      return;
    }
    const choice = actionToChoice(actionIndex, combined, data);
    if (choice) {
      result.push(choice);
    }
  });
  return result;
}
