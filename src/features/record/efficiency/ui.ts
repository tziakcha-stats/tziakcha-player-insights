import { formatEfficiencyResult } from "../../../shared/efficiency";
import "./ui.less";

export type AnalysisMode = "manual" | "auto";

export function createEfficiencyPanel(): HTMLElement {
  const panel = document.createElement("div");
  panel.id = "efficiency-panel";
  panel.className = "efficiency-container";

  const header = document.createElement("div");
  header.className = "efficiency-header";

  const title = document.createElement("span");
  title.textContent = "效率分析";

  const controls = document.createElement("div");
  controls.className = "efficiency-controls";

  const analyzeBtn = document.createElement("button");
  analyzeBtn.type = "button";
  analyzeBtn.id = "efficiency-analyze-btn";
  analyzeBtn.className = "efficiency-btn";
  analyzeBtn.textContent = "分析";

  const modeBtn = document.createElement("button");
  modeBtn.type = "button";
  modeBtn.id = "efficiency-mode-btn";
  modeBtn.className = "efficiency-btn";
  modeBtn.textContent = "手动";
  modeBtn.dataset.mode = "manual";

  controls.appendChild(analyzeBtn);
  controls.appendChild(modeBtn);

  header.appendChild(title);
  header.appendChild(controls);

  const content = document.createElement("div");
  content.className = "efficiency-content";
  content.id = "efficiency-content";

  panel.appendChild(header);
  panel.appendChild(content);

  return panel;
}

export function mountEfficiencyPanel(): HTMLElement | null {
  const existingPanel = document.getElementById("efficiency-panel");
  if (existingPanel) return existingPanel;

  const panel = createEfficiencyPanel();

  const reviewContainer = document.querySelector(".review-container");
  if (reviewContainer) {
    reviewContainer.parentNode?.insertBefore(
      panel,
      reviewContainer.nextSibling,
    );
  } else {
    const ctrl = document.getElementById("ctrl");
    if (ctrl) {
      ctrl.appendChild(panel);
    } else {
      return null;
    }
  }

  return panel;
}

export function getMode(): AnalysisMode {
  const btn = document.getElementById("efficiency-mode-btn");
  return (btn?.dataset.mode as AnalysisMode) ?? "manual";
}

export function setMode(mode: AnalysisMode): void {
  const btn = document.getElementById("efficiency-mode-btn");
  if (btn) {
    btn.dataset.mode = mode;
    btn.textContent = mode === "auto" ? "自动" : "手动";
  }
}

export function onAnalyzeClick(callback: () => void): void {
  const btn = document.getElementById("efficiency-analyze-btn");
  btn?.addEventListener("click", callback);
}

export function showLoading(): void {
  const content = document.getElementById("efficiency-content");
  if (content) {
    content.innerHTML = '<span class="efficiency-loading">分析中...</span>';
  }
}

export function showError(message: string): void {
  const content = document.getElementById("efficiency-content");
  if (content) {
    const span = document.createElement("span");
    span.className = "efficiency-error";
    span.textContent = message;
    content.replaceChildren(span);
  }
}

export function renderAnalysis(result: Record<string, unknown>): void {
  const content = document.getElementById("efficiency-content");
  if (content) {
    content.textContent = formatEfficiencyResult(result);
  }
}

export function clearAnalysis(): void {
  const content = document.getElementById("efficiency-content");
  if (content) {
    content.textContent = "";
  }
}
