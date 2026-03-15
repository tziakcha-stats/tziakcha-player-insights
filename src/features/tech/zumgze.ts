import { w } from "../../shared/env";
import { warnLog } from "../../shared/logger";
import "./zumgze.less";
import { FAN_ITEMS, REF_MAPS, RefKey } from "./refs";

type FanData = Record<string, number>;

const CHAGA_SIMILARITY_D = 21;
const CHAGA_SIMILARITY_C = -0.23;
const CHAGA_SIMILARITY_A = 4;
const CHAGA_CI_Z95 = 1.96;
const CHAGA_REF_SAMPLE_SIZE = 3416686;

let currentRefKey: RefKey = "chaga";
let latestFanData: FanData = {};

function chagaScoreFromDistance(distance: number): number {
  const h =
    1 / (1 + Math.exp(-CHAGA_SIMILARITY_C * (distance - CHAGA_SIMILARITY_D)));
  const scoreRaw = Math.sqrt(h) * 100 + CHAGA_SIMILARITY_A;
  return Math.max(0, Math.min(100, scoreRaw));
}

function renderZumgze(fan: FanData = {}): void {
  latestFanData = fan || {};
  const currentRef = REF_MAPS[currentRefKey].values;
  const total = (fan.c0 || 0) + (fan.d0 || 0);
  let zumgze = 0;

  const rows = FAN_ITEMS.map(({ idx, name }) => {
    const count = (fan[`c${idx}`] || 0) + (fan[`d${idx}`] || 0);
    const playerPct = total ? (count / total) * 100 : 0;
    const refPct = currentRef[name] ?? 0;
    const diff = playerPct - refPct;
    zumgze += Math.abs(diff);
    return { name, playerPct, refPct, diff };
  });

  const dProb = rows.reduce(
    (sum, row) => sum + Math.abs(row.playerPct / 100 - row.refPct / 100),
    0,
  );
  const varD = rows.reduce(
    (sum, row) =>
      sum +
      ((row.playerPct / 100) * (1 - row.playerPct / 100)) /
        CHAGA_REF_SAMPLE_SIZE +
      ((row.refPct / 100) * (1 - row.refPct / 100)) / Math.max(total, 1),
    0,
  );
  const seProb = Math.sqrt(Math.max(0, varD));
  const ciLowerProb = Math.max(0, dProb - CHAGA_CI_Z95 * seProb);
  const ciUpperProb = dProb + CHAGA_CI_Z95 * seProb;

  const chagaSimilarity = chagaScoreFromDistance(zumgze);
  const chagaScoreLower = chagaScoreFromDistance(ciLowerProb * 100);
  const chagaScoreUpper = chagaScoreFromDistance(ciUpperProb * 100);

  rows.sort((a, b) => {
    const aPositive = a.diff >= 0;
    const bPositive = b.diff >= 0;
    if (aPositive !== bPositive) {
      return Number(bPositive) - Number(aPositive);
    }
    return b.diff - a.diff;
  });

  const maxAbsDiff = Math.max(...rows.map((item) => Math.abs(item.diff)), 1e-9);
  const rowsHtml = rows
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
