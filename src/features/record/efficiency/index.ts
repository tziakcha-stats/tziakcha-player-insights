import { infoLog, warnLog } from "../../../shared/logger";
import { analyzeHand } from "../../../shared/efficiency";
import {
  getCurrentHandTiles,
  getMeldGroups,
  buildHandString,
  handTilesToStr,
  getLastStep,
  setLastStep,
  getLastHandStr,
  setLastHandStr,
  setLastResult,
  resetState,
} from "./state";
import {
  mountEfficiencyPanel,
  getMode,
  setMode,
  onAnalyzeClick,
  showLoading,
  showError,
  renderAnalysis,
} from "./ui";
import { getTZInstance } from "../reviewer/state";

const POLL_INTERVAL_MS = 200;
const INIT_DELAY_MS = 100;

let isInitialized = false;
let pollTimer: ReturnType<typeof setInterval> | null = null;
let initTimer: ReturnType<typeof setTimeout> | null = null;

function doAnalysis(): void {
  const closedTiles = getCurrentHandTiles();
  if (!closedTiles || closedTiles.length < 10) {
    showError("未检测到手牌");
    return;
  }

  const meldGroups = getMeldGroups();
  const handStr = buildHandString(closedTiles, meldGroups);
  const tileCount =
    closedTiles.length + meldGroups.reduce((s, g) => s + g.length, 0);

  try {
    infoLog(
      `[Efficiency] 分析手牌 ${tileCount} 张 (闭门${closedTiles.length}+副露${meldGroups.length}组)`,
    );
    showLoading();

    const result = analyzeHand(handStr, tileCount);

    renderAnalysis(result);
    setLastResult(result);

    infoLog(`[Efficiency] 完成，耗时 ${result.elapsedMs}ms`);
  } catch (error) {
    warnLog("[Efficiency] 分析失败:", error);
    showError("分析失败");
  }
}

function performAnalysis(): void {
  const tz = getTZInstance();
  if (!tz || typeof tz.stp !== "number") {
    return;
  }

  const step = tz.stp;

  if (step === getLastStep()) {
    return;
  }
  setLastStep(step);

  const closedTiles = getCurrentHandTiles();
  if (!closedTiles || closedTiles.length < 10) {
    return;
  }

  // 手牌没变，跳过
  const handStr = handTilesToStr(closedTiles);
  if (handStr === getLastHandStr()) {
    return;
  }
  setLastHandStr(handStr);

  doAnalysis();
}

function startPolling(): void {
  if (pollTimer) return;

  pollTimer = setInterval(() => {
    try {
      if (getMode() === "auto") {
        performAnalysis();
      }
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

  const panel = mountEfficiencyPanel();
  if (!panel) {
    warnLog("[Efficiency] 面板挂载失败");
    return;
  }

  onAnalyzeClick(() => {
    infoLog("[Efficiency] 手动分析触发");
    doAnalysis();
  });

  const modeBtn = document.getElementById("efficiency-mode-btn");
  modeBtn?.addEventListener("click", () => {
    const next = getMode() === "manual" ? "auto" : "manual";
    setMode(next);
    infoLog(`[Efficiency] 模式切换为: ${next}`);
  });

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
