import { infoLog, warnLog } from "../../../shared/logger";
import { analyzeHand } from "../../../shared/efficiency";
import {
  getCurrentHandTiles,
  getLastAnalyzedStep,
  setLastAnalyzedStep,
  setAnalysisResult,
  resetState,
} from "./state";
import {
  mountEfficiencyPanel,
  showLoading,
  showError,
  renderAnalysis,
  clearAnalysis,
} from "./ui";
import { getTZInstance } from "../reviewer/state";

const POLL_INTERVAL_MS = 200;
const INIT_DELAY_MS = 100;
const MIN_HAND_TILES = 13;

let isInitialized = false;
let pollTimer: ReturnType<typeof setInterval> | null = null;
let initTimer: ReturnType<typeof setTimeout> | null = null;

function performAnalysis(): void {
  const tz = getTZInstance();
  if (!tz || typeof tz.stp !== "number") {
    return;
  }

  const step = tz.stp;

  if (step === getLastAnalyzedStep()) {
    return;
  }

  const playerIndex =
    typeof tz.stat?.[step]?.k === "number" ? tz.stat[step].k : 0;
  const handTiles = getCurrentHandTiles(playerIndex);
  if (!handTiles || handTiles.length < MIN_HAND_TILES) {
    clearAnalysis();
    return;
  }

  try {
    infoLog(`[Efficiency] 分析步骤 ${step}，手牌 ${handTiles.length} 张`);
    showLoading();

    const result = analyzeHand(handTiles);

    renderAnalysis(result);
    setLastAnalyzedStep(step);
    setAnalysisResult(result);

    infoLog(`[Efficiency] 分析完成，耗时 ${result.elapsedMs}ms`);
  } catch (error) {
    warnLog("[Efficiency] 分析失败:", error);
    showError("分析失败");
  }
}

function startPolling(): void {
  if (pollTimer) return;

  pollTimer = setInterval(() => {
    try {
      performAnalysis();
    } catch (error) {
      warnLog("[Efficiency] 轮询出错:", error);
    }
  }, POLL_INTERVAL_MS);

  infoLog("[Efficiency] 轮询已启动");
}

function stopPolling(): void {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
    infoLog("[Efficiency] 轮询已停止");
  }
}

export function initEfficiencyAnalysis(): void {
  if (isInitialized) {
    infoLog("[Efficiency] 已经初始化，跳过");
    return;
  }

  const ctrl = document.getElementById("ctrl");
  if (!ctrl) {
    infoLog("[Efficiency] ctrl 元素不存在，延迟初始化");
    initTimer = setTimeout(() => initEfficiencyAnalysis(), INIT_DELAY_MS);
    return;
  }

  mountEfficiencyPanel();
  infoLog("[Efficiency] UI 面板已挂载");

  startPolling();

  isInitialized = true;
  infoLog("[Efficiency] 模块初始化完成");
}

export function destroyEfficiencyAnalysis(): void {
  stopPolling();

  if (initTimer) {
    clearTimeout(initTimer);
    initTimer = null;
  }

  const panel = document.getElementById("efficiency-panel");
  if (panel) {
    panel.remove();
  }

  resetState();
  isInitialized = false;
  infoLog("[Efficiency] 模块已销毁");
}

export function resetEfficiencyAnalysis(): void {
  destroyEfficiencyAnalysis();
  initEfficiencyAnalysis();
}
