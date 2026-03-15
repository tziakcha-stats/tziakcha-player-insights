import { w } from "../../../shared/env";
import { warnLog } from "../../../shared/logger";
import "./index.less";
import { REF_MAPS, RefKey } from "../refs";
import { FanData, ZumgzeRow, computeZumgzeStats } from "./calc";

let currentRefKey: RefKey = "chaga";
let latestFanData: FanData = {};

function renderZumgze(fan: FanData = {}): void {
  latestFanData = fan || {};
  const currentRef = REF_MAPS[currentRefKey].values;

  const { rows, zumgze, chagaSimilarity, chagaScoreLower, chagaScoreUpper } =
    computeZumgzeStats(fan, currentRef);

  const sortedRows = [...rows].sort((a: ZumgzeRow, b: ZumgzeRow) => {
    const aPositive = a.diff >= 0;
    const bPositive = b.diff >= 0;
    if (aPositive !== bPositive) {
      return Number(bPositive) - Number(aPositive);
    }
    return b.diff - a.diff;
  });

  const maxAbsDiff = Math.max(
    ...sortedRows.map((item) => Math.abs(item.diff)),
    1e-9,
  );
  const rowsHtml = sortedRows
    .map((item) => {
      const widthPercent = (Math.abs(item.diff) / maxAbsDiff) * 50;
      const isPositive = item.diff >= 0;
      const fillStyle = isPositive
        ? `right:50%; width:${widthPercent.toFixed(2)}%; background:#dc3545;`
        : `left:50%; width:${widthPercent.toFixed(2)}%; background:#198754;`;
      const labelClass = isPositive
        ? "text-danger"
        : "text-success zumgze-bar-label-left";
      return `
        <tr>
          <td class="text-dark">${item.name}</td>
          <td class="text-end text-muted">${item.playerPct.toFixed(3)}</td>
          <td class="text-center">
            <div class="zumgze-bar-wrap" title="差值 ${item.diff.toFixed(3)}">
              <div class="zumgze-bar-zero"></div>
              <div class="zumgze-bar-fill" style="${fillStyle}"></div>
              <div class="zumgze-bar-label ${labelClass}">${item.diff.toFixed(3)}</div>
            </div>
          </td>
          <td class="text-start text-muted">${item.refPct.toFixed(3)}</td>
        </tr>
      `;
    })
    .join("");

  let wrap = document.getElementById("reviewer-zumgze-wrap");
  const basicTable = document.getElementById("basic");
  if (!wrap && basicTable) {
    wrap = document.createElement("div");
    wrap.id = "reviewer-zumgze-wrap";
    wrap.innerHTML = `
      <h4 style="margin-top:2em;">分析</h4>
      <div class="zumgze-ref-toolbar">
        <span id="reviewer-zumgze-ref-label" class="text-muted">当前参考：CHAGA均</span>
        <button id="reviewer-zumgze-ref-toggle" type="button" class="btn btn-outline-secondary btn-sm zumgze-ref-toggle">切换到渣均</button>
      </div>
      <button id="reviewer-zumgze-table-toggle" type="button" class="btn btn-outline-secondary btn-sm zumgze-table-toggle" data-bs-toggle="collapse" data-bs-target="#reviewer-zumgze-table-collapse" aria-expanded="false" aria-controls="reviewer-zumgze-table-collapse">展开表格</button>
      <div id="reviewer-zumgze-table-collapse" class="collapse">
        <table class="table table-hover table-sm" style="table-layout:fixed;">
          <thead class="table-dark"><tr><th class="zumgze-col-name">番种</th><th class="text-end zumgze-col-player">玩家</th><th></th><th class="text-start zumgze-col-ref">参考</th></tr></thead>
          <tbody id="reviewer-zumgze-tbody"></tbody>
        </table>
      </div>
      <div class="zumgze-summary text-dark"><span id="reviewer-zumgze-summary-label">CHAGA均平均差</span>：<span id="reviewer-zumgze-value">0.000</span></div>
      <div id="reviewer-zumgze-similarity" class="zumgze-similarity text-dark" style="display:none;">
        <span id="reviewer-zumgze-similarity-label" class="zumgze-score-trigger" title="由 zumgze 设计，用于评估打法和 CHAGA 牌风的相似度（仅供参考）">CHAGA度</span>：<span id="reviewer-zumgze-similarity-value">0.00 / 100</span>
        <div id="reviewer-zumgze-similarity-ci" class="zumgze-score-ci" style="display:none;">95% 置信区间：<span id="reviewer-zumgze-similarity-ci-value">0.00 / 100 ～ 0.00 / 100</span></div>
      </div>
    `;
    const basicHeading = basicTable.previousElementSibling;
    if (basicHeading && basicHeading.tagName === "H4") {
      basicHeading.parentNode?.insertBefore(wrap, basicHeading);
    } else {
      basicTable.parentNode?.insertBefore(wrap, basicTable);
    }
  }

  const tbody = document.getElementById("reviewer-zumgze-tbody");
  const valueEl = document.getElementById("reviewer-zumgze-value");
  const summaryLabelEl = document.getElementById(
    "reviewer-zumgze-summary-label",
  );
  const refLabelEl = document.getElementById("reviewer-zumgze-ref-label");
  const refToggleBtn = document.getElementById(
    "reviewer-zumgze-ref-toggle",
  ) as HTMLButtonElement | null;
  const similarityWrapEl = document.getElementById(
    "reviewer-zumgze-similarity",
  );
  const similarityValueEl = document.getElementById(
    "reviewer-zumgze-similarity-value",
  );
  const similarityCiEl = document.getElementById(
    "reviewer-zumgze-similarity-ci",
  );
  const similarityCiValueEl = document.getElementById(
    "reviewer-zumgze-similarity-ci-value",
  );

  if (tbody) tbody.innerHTML = rowsHtml;
  if (valueEl)
    valueEl.textContent = `${zumgze.toFixed(3)} / ${rows.length} 项番种`;
  if (summaryLabelEl)
    summaryLabelEl.textContent = `${REF_MAPS[currentRefKey].label}平均差`;
  if (refLabelEl)
    refLabelEl.textContent = `当前参考：${REF_MAPS[currentRefKey].label}`;

  if (similarityWrapEl && similarityValueEl) {
    if (currentRefKey === "chaga") {
      similarityWrapEl.style.display = "";
      similarityValueEl.textContent = `${chagaSimilarity.toFixed(2)} / 100`;
      if (similarityCiEl && similarityCiValueEl) {
        similarityCiEl.style.display = "";
        similarityCiValueEl.textContent = `${Math.min(chagaScoreLower, chagaScoreUpper).toFixed(2)} / 100 ～ ${Math.max(chagaScoreLower, chagaScoreUpper).toFixed(2)} / 100`;
      }
    } else {
      similarityWrapEl.style.display = "none";
      if (similarityCiEl) similarityCiEl.style.display = "none";
    }
  }

  if (refToggleBtn && !refToggleBtn.dataset.bound) {
    refToggleBtn.dataset.bound = "1";
    refToggleBtn.addEventListener("click", () => {
      currentRefKey = currentRefKey === "chaga" ? "zha" : "chaga";
      renderZumgze(latestFanData);
    });
  }
  if (refToggleBtn) {
    refToggleBtn.textContent =
      currentRefKey === "chaga" ? "切换到渣均" : "切换到CHAGA均";
  }
}

export function initTechZumgze(): void {
  const basicTable = document.getElementById("basic");
  const eloTable = document.getElementById("elo");
  if (!basicTable || !eloTable) {
    w.setTimeout(initTechZumgze, 100);
    return;
  }

  fetch(`/_qry/user/tech/${w.location.search}`, {
    method: "POST",
    credentials: "include",
  })
    .then((resp) => resp.json())
    .then((json: { fan?: FanData }) => renderZumgze(json?.fan || {}))
    .catch((error) => {
      warnLog("Failed to load zumgze data", error);
    });
}
