import { EfficiencyResult } from "../../../shared/efficiency";
import { formatEfficiencyResult } from "../../../shared/efficiency";
import "./ui.less";

export function createEfficiencyPanel(): HTMLElement {
  const panel = document.createElement("div");
  panel.id = "efficiency-panel";
  panel.className = "efficiency-container";

  const header = document.createElement("div");
  header.className = "efficiency-header";

  const title = document.createElement("span");
  title.textContent = "效率分析";

  const modeLabel = document.createElement("span");
  modeLabel.className = "efficiency-mode";
  modeLabel.id = "efficiency-mode";

  header.appendChild(title);
  header.appendChild(modeLabel);

  const content = document.createElement("div");
  content.className = "efficiency-content";
  content.id = "efficiency-content";

  panel.appendChild(header);
  panel.appendChild(content);

  return panel;
}

export function mountEfficiencyPanel(): void {
  const existingPanel = document.getElementById("efficiency-panel");
  if (existingPanel) return;

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
    }
  }
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

export function renderAnalysis(result: EfficiencyResult): void {
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
