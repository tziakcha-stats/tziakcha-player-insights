import { FAN_NAMES } from "../../game/win-info";
import { w } from "../../../shared/env";
import { warnLog } from "../../../shared/logger";
import {
  buildFanDiffRows,
  computeMetricDiffRows,
  computeSimilarityScore,
  filterFanDiffRowsByGroup,
  getFanTotalCount,
  type FanDiffRow,
  type FanGroup,
  type MetricDiffRow,
  type MetricSpec,
} from "./compare-calc";
import "./index.less";

interface TechData {
  fan?: Record<string, number>;
  basic?: Record<string, number>;
  cycle?: Record<string, number>;
  point?: Record<string, number>;
}

interface MatchCandidate {
  n?: string;
  i?: string;
}

const ANALYSIS_PANEL_ID = "reviewer-tech-analysis-panel";
const TAB_ANALYSIS_ID = "reviewer-tech-tab-analysis";
const FAN_GROUP_TAB_ID = "reviewer-style-fan-group-tabs";
const FAN_FILTER_RARE_BTN_ID = "reviewer-style-fan-filter-rare";
const FAN_FILTER_LARGE_DIFF_BTN_ID = "reviewer-style-fan-filter-large-diff";
const FAN_SORT_MODE_BTN_ID = "reviewer-style-fan-sort-mode";
const SELF_PLAYER_SENTINEL = "__self__";

let initialized = false;
let playerAId = "";
let playerBId = "";
let fanRowsAll: FanDiffRow[] = [];
let currentFanGroup: FanGroup = "all";
let playerAName = "";
let playerBName = "";
let hideRareFans = true;
let onlyLargeDiffFans = false;
let sortByAbsDiff = false;

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function safeDiv(numerator: number, denominator: number): number {
  if (denominator <= 0) {
    return 0;
  }
  return numerator / denominator;
}

function parseArray(
  source: Record<string, number>,
  key: string,
  n: number,
): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i += 1) {
    out.push(toNumber(source[`${key}${i}`]));
  }
  return out;
}

function weightedSum(arr: number[]): number {
  let sum = 0;
  for (let i = 0; i < arr.length; i += 1) {
    sum += arr[i] * i;
  }
  return sum;
}

function countSum(arr: number[]): number {
  return arr.reduce((sum, item) => sum + item, 0);
}

function calcWinStats(data: TechData): Record<string, number> {
  const basic = data.basic || {};
  const claim = toNumber(basic.claim);
  const draw = toNumber(basic.draw);
  const shoot = toNumber(basic.shoot);
  const splash = toNumber(basic.splash);
  const watch = toNumber(basic.watch);
  const tie = toNumber(basic.tie);
  const lose = toNumber(basic.lose);
  const fault = toNumber(basic.fault);

  const win = claim + draw;
  const total = win + shoot + splash + watch + tie;

  return {
    winRate: safeDiv(win, total) * 100,
    drawRate: safeDiv(draw, win) * 100,
    shootRate: safeDiv(shoot, total) * 100,
    splashRate: safeDiv(splash, total) * 100,
    watchRate: safeDiv(watch, total) * 100,
    loseInShootRate: safeDiv(lose, shoot) * 100,
    faultRate: safeDiv(fault, total) * 100,
    tieRate: safeDiv(tie, total) * 100,
  };
}

function calcCycleStats(data: TechData): Record<string, number> {
  const basic = data.basic || {};
  const cycle = data.cycle || {};

  const claim = toNumber(basic.claim);
  const draw = toNumber(basic.draw);
  const shoot = toNumber(basic.shoot);
  const splash = toNumber(basic.splash);

  const c = parseArray(cycle, "c", 35);
  const d = parseArray(cycle, "d", 35);
  const s = parseArray(cycle, "s", 35);
  const p = parseArray(cycle, "p", 35);

  const l1: number[] = [];
  const l2: number[] = [];
  const l3: number[] = [];
  const l4: number[] = [];
  for (let i = 0; i < 35; i += 1) {
    l1.push(toNumber(cycle[`l${i}_1`]));
    l2.push(toNumber(cycle[`l${i}_2`]));
    l3.push(toNumber(cycle[`l${i}_3`]));
    l4.push(toNumber(cycle[`l${i}_4`]));
  }

  const win = claim + draw;
  const listenArr = parseArray(cycle, "a", 35);

  return {
    avgWinCycle: safeDiv(weightedSum(c) + weightedSum(d) + win, win),
    avgListenCycle: safeDiv(weightedSum(listenArr), countSum(listenArr)),
    avgClaimCycle: safeDiv(weightedSum(c) + claim, claim),
    avgDrawCycle: safeDiv(weightedSum(d) + draw, draw),
    avgShootCycle: safeDiv(weightedSum(s) + shoot, shoot),
    avgSplashCycle: safeDiv(weightedSum(p) + splash, splash),
    avgOpen1Cycle: safeDiv(weightedSum(l1), countSum(l1)),
    avgOpen2Cycle: safeDiv(weightedSum(l2), countSum(l2)),
    avgOpen3Cycle: safeDiv(weightedSum(l3), countSum(l3)),
    avgOpen4Cycle: safeDiv(weightedSum(l4), countSum(l4)),
  };
}

function calcPointStats(data: TechData): Record<string, number> {
  const basic = data.basic || {};
  const point = data.point || {};

  const claim = toNumber(basic.claim);
  const draw = toNumber(basic.draw);
  const shoot = toNumber(basic.shoot);
  const splash = toNumber(basic.splash);
  const watch = toNumber(basic.watch);

  const c = parseArray(point, "c", 333);
  const d = parseArray(point, "d", 333);
  const s = parseArray(point, "s", 333);
  const p = parseArray(point, "p", 333);
  const wv = parseArray(point, "w", 333);

  const win = claim + draw;

  return {
    avgWinFan: safeDiv(weightedSum(c) + weightedSum(d), win),
    avgClaimFan: safeDiv(weightedSum(c), claim),
    avgDrawFan: safeDiv(weightedSum(d), draw),
    avgShootFan: safeDiv(weightedSum(s), shoot),
    avgSplashFan: safeDiv(weightedSum(p), splash),
    avgWatchFan: safeDiv(weightedSum(wv), watch),
  };
}

const WIN_METRICS: MetricSpec[] = [
  { key: "winRate", label: "和牌率", calc: (basic) => toNumber(basic.winRate) },
  {
    key: "drawRate",
    label: "自摸率",
    calc: (basic) => toNumber(basic.drawRate),
  },
  {
    key: "shootRate",
    label: "点炮率",
    calc: (basic) => toNumber(basic.shootRate),
  },
  {
    key: "splashRate",
    label: "被摸率",
    calc: (basic) => toNumber(basic.splashRate),
  },
  {
    key: "watchRate",
    label: "听牌率",
    calc: (basic) => toNumber(basic.watchRate),
  },
  {
    key: "loseInShootRate",
    label: "点炮听牌率",
    calc: (basic) => toNumber(basic.loseInShootRate),
  },
  {
    key: "faultRate",
    label: "错和率",
    calc: (basic) => toNumber(basic.faultRate),
  },
  { key: "tieRate", label: "荒庄率", calc: (basic) => toNumber(basic.tieRate) },
];

const CYCLE_METRICS: MetricSpec[] = [
  {
    key: "avgWinCycle",
    label: "和牌巡数",
    calc: (basic) => toNumber(basic.avgWinCycle),
  },
  {
    key: "avgListenCycle",
    label: "听牌巡数",
    calc: (basic) => toNumber(basic.avgListenCycle),
  },
  {
    key: "avgClaimCycle",
    label: "点和巡数",
    calc: (basic) => toNumber(basic.avgClaimCycle),
  },
  {
    key: "avgDrawCycle",
    label: "自摸巡数",
    calc: (basic) => toNumber(basic.avgDrawCycle),
  },
  {
    key: "avgShootCycle",
    label: "点炮巡数",
    calc: (basic) => toNumber(basic.avgShootCycle),
  },
  {
    key: "avgSplashCycle",
    label: "被摸巡数",
    calc: (basic) => toNumber(basic.avgSplashCycle),
  },
  {
    key: "avgOpen1Cycle",
    label: "鸣第一组巡数",
    calc: (basic) => toNumber(basic.avgOpen1Cycle),
  },
  {
    key: "avgOpen2Cycle",
    label: "鸣第二组巡数",
    calc: (basic) => toNumber(basic.avgOpen2Cycle),
  },
  {
    key: "avgOpen3Cycle",
    label: "鸣第三组巡数",
    calc: (basic) => toNumber(basic.avgOpen3Cycle),
  },
  {
    key: "avgOpen4Cycle",
    label: "鸣第四组巡数",
    calc: (basic) => toNumber(basic.avgOpen4Cycle),
  },
];

const POINT_METRICS: MetricSpec[] = [
  {
    key: "avgWinFan",
    label: "平均和牌番",
    calc: (basic) => toNumber(basic.avgWinFan),
  },
  {
    key: "avgClaimFan",
    label: "平均点和番",
    calc: (basic) => toNumber(basic.avgClaimFan),
  },
  {
    key: "avgDrawFan",
    label: "平均自摸番",
    calc: (basic) => toNumber(basic.avgDrawFan),
  },
  {
    key: "avgShootFan",
    label: "平均点炮番",
    calc: (basic) => toNumber(basic.avgShootFan),
  },
  {
    key: "avgSplashFan",
    label: "平均被摸番",
    calc: (basic) => toNumber(basic.avgSplashFan),
  },
  {
    key: "avgWatchFan",
    label: "平均见证番",
    calc: (basic) => toNumber(basic.avgWatchFan),
  },
];

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getSelfIdFromQuery(): string {
  const params = new URLSearchParams(w.location.search);
  return params.get("id") || "";
}

function getContainer(): HTMLElement | null {
  const basic = document.getElementById("basic");
  return (basic?.parentElement as HTMLElement | null) || null;
}

function hideLegacyTools(container: HTMLElement): void {
  const ids = [
    "opt",
    "result",
    "rst_alt",
    "cln_alt",
    "reset_alt",
    "clean_alt",
    "rst",
    "cln",
    "dorst",
    "docln",
    "reset",
  ];
  ids.forEach((id) => {
    const el = document.getElementById(id) as HTMLElement | null;
    if (!el) {
      return;
    }
    el.innerHTML = "";
    el.style.display = "none";
    el.dataset.forceHidden = "1";
  });

  const clearByHeading = (keyword: string): void => {
    Array.from(container.querySelectorAll("h4")).forEach((heading) => {
      const text = (heading.textContent || "").replace(/\s+/g, "");
      if (!text.includes(keyword)) {
        return;
      }
      let node: HTMLElement | null = heading.parentElement;
      while (node && node !== container) {
        node.innerHTML = "";
        node.style.display = "none";
        node.dataset.forceHidden = "1";
        node = node.parentElement;
      }
    });
  };

  clearByHeading("危险操作");
  clearByHeading("查看");

  Array.from(container.querySelectorAll("small")).forEach((small) => {
    const text = (small.textContent || "").replace(/\s+/g, "");
    if (
      text.includes("重置") ||
      text.includes("清空") ||
      text.includes("清除操作")
    ) {
      const holder = (small.parentElement || small) as HTMLElement;
      holder.innerHTML = "";
      holder.style.display = "none";
      holder.dataset.forceHidden = "1";
    }
  });
}

function moveNotesToBottom(container: HTMLElement): void {
  const panel = document.getElementById(ANALYSIS_PANEL_ID);
  const noteBlocks = Array.from(
    container.querySelectorAll("div > small.fw-light"),
  )
    .map((small) => small.parentElement as HTMLElement | null)
    .filter((node): node is HTMLElement => Boolean(node))
    .filter((node) => !(panel && panel.contains(node)));

  noteBlocks.forEach((node) => {
    container.appendChild(node);
  });
}

function getDataAreaNodes(): HTMLElement[] {
  const container = getContainer();
  if (!container) {
    return [];
  }
  const panel = document.getElementById(ANALYSIS_PANEL_ID);
  const topTabs = container.querySelector("ul.nav.nav-tabs");
  if (!topTabs) {
    return [];
  }

  const nodes: HTMLElement[] = [];
  let cursor = topTabs.nextElementSibling;
  while (cursor) {
    if (cursor !== panel) {
      nodes.push(cursor as HTMLElement);
    }
    cursor = cursor.nextElementSibling;
  }
  return nodes;
}

function setDataSectionVisible(visible: boolean): void {
  const nodes = getDataAreaNodes();
  nodes.forEach((node) => {
    if (node.dataset.forceHidden === "1") {
      return;
    }
    node.style.display = visible ? "" : "none";
  });
}

function ensureAnalysisPanel(): HTMLElement | null {
  let panel = document.getElementById(ANALYSIS_PANEL_ID) as HTMLElement | null;
  if (panel) {
    return panel;
  }

  const container = getContainer();
  if (!container) {
    return null;
  }

  panel = document.createElement("div");
  panel.id = ANALYSIS_PANEL_ID;
  panel.style.display = "none";
  panel.innerHTML = `
    <section id="reviewer-tech-analysis-zumgze"></section>
    <section id="reviewer-tech-style-wrap" class="reviewer-tech-style-wrap">
      <h4 style="margin-top:2em;">风格</h4>
      <div class="reviewer-style-players">
        <div class="reviewer-style-player-card">
          <div class="reviewer-style-player-title">玩家A</div>
          <input id="reviewer-style-player-a-keyword" class="form-control form-control-sm" placeholder="输入昵称关键词" />
          <select id="reviewer-style-player-a-select" class="form-select form-select-sm"><option value="">--请选择--</option></select>
          <div id="reviewer-style-player-a-name" class="reviewer-style-picked text-muted">未选择</div>
        </div>
        <div class="reviewer-style-player-card">
          <div class="reviewer-style-player-title">玩家B</div>
          <input id="reviewer-style-player-b-keyword" class="form-control form-control-sm" placeholder="输入昵称关键词" />
          <select id="reviewer-style-player-b-select" class="form-select form-select-sm"><option value="">--请选择--</option></select>
          <div id="reviewer-style-player-b-name" class="reviewer-style-picked text-muted">未选择</div>
        </div>
      </div>
      <div class="reviewer-style-toolbar">
        <button id="reviewer-style-compare-run" type="button" class="btn btn-outline-primary btn-sm">开始比较</button>
        <span id="reviewer-style-status" class="text-muted"></span>
      </div>
      <div class="reviewer-style-summary text-dark">
        <span id="reviewer-style-score-label" class="reviewer-style-score-trigger" title="由 CHAGA 同源算法映射得到，用于评估两位玩家打法相似程度（仅供参考）">相似度</span>：<span id="reviewer-style-score">0.00 / 100</span>
        <div id="reviewer-style-overall-ci" class="reviewer-style-score-ci">95% 置信区间：0.00 / 100 ～ 0.00 / 100</div>
      </div>

      <h5 class="reviewer-style-subtitle">和牌相关</h5>
      <table class="table table-hover table-sm reviewer-style-table">
        <thead class="table-dark">
          <tr>
            <th>指标</th>
            <th class="text-end reviewer-style-head-a">A</th>
            <th class="text-center">差值</th>
            <th class="text-start reviewer-style-head-b">B</th>
          </tr>
        </thead>
        <tbody id="reviewer-style-win-tbody"></tbody>
      </table>

      <h5 class="reviewer-style-subtitle">巡数相关</h5>
      <table class="table table-hover table-sm reviewer-style-table">
        <thead class="table-dark">
          <tr>
            <th>指标</th>
            <th class="text-end reviewer-style-head-a">A</th>
            <th class="text-center">差值</th>
            <th class="text-start reviewer-style-head-b">B</th>
          </tr>
        </thead>
        <tbody id="reviewer-style-cycle-tbody"></tbody>
      </table>

      <h5 class="reviewer-style-subtitle">番数相关</h5>
      <table class="table table-hover table-sm reviewer-style-table">
        <thead class="table-dark">
          <tr>
            <th>指标</th>
            <th class="text-end reviewer-style-head-a">A</th>
            <th class="text-center">差值</th>
            <th class="text-start reviewer-style-head-b">B</th>
          </tr>
        </thead>
        <tbody id="reviewer-style-point-tbody"></tbody>
      </table>

      <h5 class="reviewer-style-subtitle">番种比较</h5>
      <div class="reviewer-style-fan-actions">
        <button id="${FAN_FILTER_RARE_BTN_ID}" type="button" class="reviewer-style-toggle-btn is-active">不显示稀有番种</button>
        <button id="${FAN_FILTER_LARGE_DIFF_BTN_ID}" type="button" class="reviewer-style-toggle-btn">仅显示大差异番种</button>
        <button id="${FAN_SORT_MODE_BTN_ID}" type="button" class="reviewer-style-toggle-btn">排序：差值</button>
      </div>
      <ul class="nav nav-tabs reviewer-style-subtabs" id="${FAN_GROUP_TAB_ID}">
        <li class="nav-item"><a class="nav-link active" href="javascript:void(0)" data-fan-group="all">全部番种</a></li>
        <li class="nav-item"><a class="nav-link" href="javascript:void(0)" data-fan-group="small">小番(<=2)</a></li>
        <li class="nav-item"><a class="nav-link" href="javascript:void(0)" data-fan-group="main">主番(4~32)</a></li>
        <li class="nav-item"><a class="nav-link" href="javascript:void(0)" data-fan-group="high">大牌(>=48)</a></li>
      </ul>
      <div class="reviewer-style-fan-scroll">
        <table class="table table-hover table-sm reviewer-style-table">
          <thead class="table-dark">
            <tr>
              <th>番种</th>
              <th class="text-end reviewer-style-head-a">A</th>
              <th class="text-center">差值</th>
              <th class="text-start reviewer-style-head-b">B</th>
            </tr>
          </thead>
          <tbody id="reviewer-style-fan-diff-tbody"></tbody>
        </table>
      </div>
    </section>
  `;

  container.appendChild(panel);
  return panel;
}

function ensureAnalysisTab(): HTMLAnchorElement | null {
  const nav = document.querySelector(
    "ul.nav.nav-tabs",
  ) as HTMLUListElement | null;
  if (!nav) {
    return null;
  }

  const existing = document.getElementById(
    TAB_ANALYSIS_ID,
  ) as HTMLAnchorElement | null;
  if (existing) {
    return existing;
  }

  const li = document.createElement("li");
  li.className = "nav-item";
  const link = document.createElement("a");
  link.id = TAB_ANALYSIS_ID;
  link.className = "nav-link";
  link.href = "javascript:void(0)";
  link.textContent = "分析";
  li.appendChild(link);
  nav.appendChild(li);
  return link;
}

function activateTab(link: Element): void {
  const nav = link.closest("ul");
  if (!nav) {
    return;
  }
  Array.from(nav.querySelectorAll(".nav-link")).forEach((item) => {
    item.classList.remove("active");
  });
  link.classList.add("active");
}

function bindTabToggle(): void {
  const analysisTab = document.getElementById(
    TAB_ANALYSIS_ID,
  ) as HTMLAnchorElement | null;
  const panel = document.getElementById(
    ANALYSIS_PANEL_ID,
  ) as HTMLElement | null;
  if (!analysisTab || !panel || analysisTab.dataset.bound) {
    return;
  }

  analysisTab.dataset.bound = "1";
  analysisTab.addEventListener("click", () => {
    panel.style.display = "";
    setDataSectionVisible(false);
    activateTab(analysisTab);
  });

  const nav = analysisTab.closest("ul");
  if (!nav) {
    return;
  }

  Array.from(nav.querySelectorAll(".nav-link")).forEach((item) => {
    if (item === analysisTab || (item as HTMLElement).dataset.analysisBound) {
      return;
    }
    (item as HTMLElement).dataset.analysisBound = "1";
    item.addEventListener("click", () => {
      panel.style.display = "none";
      setDataSectionVisible(true);
      const href = (item as HTMLAnchorElement).getAttribute("href") || "";
      if (!href || href.startsWith("javascript:") || href.startsWith("#")) {
        activateTab(item);
      }
    });
  });
}

function getStatusEl(): HTMLElement | null {
  return document.getElementById("reviewer-style-status");
}

function setStatus(text: string): void {
  const el = getStatusEl();
  if (el) {
    el.textContent = text;
  }
}

function formatSigned(value: number, digits = 3): string {
  const v = Number.isFinite(value) ? value : 0;
  return `${v >= 0 ? "+" : ""}${v.toFixed(digits)}`;
}

async function fetchTechById(id: string): Promise<TechData> {
  const query =
    id && id !== SELF_PLAYER_SENTINEL ? `?id=${encodeURIComponent(id)}` : "";
  const resp = await fetch(`/_qry/user/tech/${query}`, {
    method: "POST",
    credentials: "include",
  });
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}`);
  }
  return (await resp.json()) as TechData;
}

async function fetchMatchCandidates(
  keyword: string,
): Promise<MatchCandidate[]> {
  const resp = await fetch(`/_qry/match/?kw=${encodeURIComponent(keyword)}`, {
    method: "POST",
    credentials: "include",
  });
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}`);
  }
  const json = (await resp.json()) as
    | MatchCandidate[]
    | { data?: MatchCandidate[] };
  if (Array.isArray(json)) {
    return json;
  }
  return Array.isArray(json?.data) ? json.data : [];
}

function renderDiffBar(value: number, maxAbs: number): string {
  const widthPct = (Math.abs(value) / Math.max(maxAbs, 1e-9)) * 50;
  const positive = value >= 0;
  const fillStyle = positive
    ? `right:50%; width:${widthPct.toFixed(2)}%; background:#dc3545;`
    : `left:50%; width:${widthPct.toFixed(2)}%; background:#198754;`;

  return `
    <div class="reviewer-style-bar-wrap">
      <div class="reviewer-style-bar-zero"></div>
      <div class="reviewer-style-bar-fill" style="${fillStyle}"></div>
      <div class="reviewer-style-bar-label ${positive ? "text-danger" : "text-success reviewer-style-bar-label-left"}">${formatSigned(value, 3)}</div>
    </div>
  `;
}

function renderMetricRows(targetId: string, rows: MetricDiffRow[]): void {
  const tbody = document.getElementById(targetId);
  if (!tbody) {
    return;
  }

  const maxAbs = Math.max(...rows.map((row) => Math.abs(row.diff)), 1e-9);

  tbody.innerHTML = rows
    .map(
      (row) => `
      <tr>
        <td class="text-dark reviewer-style-metric-label">${escapeHtml(row.label)}</td>
        <td class="text-end text-muted reviewer-style-metric-value">${row.valueA.toFixed(3)}</td>
        <td class="text-center reviewer-style-metric-bar-cell">${renderDiffBar(row.diff, maxAbs)}</td>
        <td class="text-start text-muted reviewer-style-metric-value">${row.valueB.toFixed(3)}</td>
      </tr>
    `,
    )
    .join("");
}

function renderTopDiffRows(rows: FanDiffRow[]): void {
  const tbody = document.getElementById("reviewer-style-fan-diff-tbody");
  if (!tbody) {
    return;
  }

  if (!rows.length) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="text-center text-muted">该分组无可比较番种</td></tr>';
    return;
  }

  const maxAbs = Math.max(...rows.map((row) => Math.abs(row.diffPct)), 1e-9);

  tbody.innerHTML = rows
    .map(
      (row) => `
      <tr>
        <td class="text-dark">${escapeHtml(row.fanName)}</td>
        <td class="text-end text-muted">${row.rateA.toFixed(3)}</td>
        <td class="text-center">${renderDiffBar(row.diffPct, maxAbs)}</td>
        <td class="text-start text-muted">${row.rateB.toFixed(3)}</td>
      </tr>
    `,
    )
    .join("");
}

function renderCurrentTopDiff(): void {
  const grouped = filterFanDiffRowsByGroup(fanRowsAll, currentFanGroup);

  const filtered = grouped.filter((row) => {
    if (hideRareFans && row.rateA < 0.5 && row.rateB < 0.5) {
      return false;
    }
    if (onlyLargeDiffFans && Math.abs(row.diffPct) <= 1) {
      return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((left, right) => {
    if (sortByAbsDiff) {
      return Math.abs(right.diffPct) - Math.abs(left.diffPct);
    }
    return right.diffPct - left.diffPct;
  });

  renderTopDiffRows(sorted);
}

function updateFanActionButtonsState(): void {
  const rareBtn = document.getElementById(FAN_FILTER_RARE_BTN_ID);
  const largeDiffBtn = document.getElementById(FAN_FILTER_LARGE_DIFF_BTN_ID);
  const sortBtn = document.getElementById(FAN_SORT_MODE_BTN_ID);

  if (rareBtn) {
    rareBtn.classList.toggle("is-active", hideRareFans);
  }
  if (largeDiffBtn) {
    largeDiffBtn.classList.toggle("is-active", onlyLargeDiffFans);
  }
  if (sortBtn) {
    sortBtn.classList.toggle("is-active", sortByAbsDiff);
    sortBtn.textContent = sortByAbsDiff ? "排序：绝对值" : "排序：差值";
  }
}

function bindFanActionButtons(): void {
  const rareBtn = document.getElementById(
    FAN_FILTER_RARE_BTN_ID,
  ) as HTMLButtonElement | null;
  const largeDiffBtn = document.getElementById(
    FAN_FILTER_LARGE_DIFF_BTN_ID,
  ) as HTMLButtonElement | null;
  const sortBtn = document.getElementById(
    FAN_SORT_MODE_BTN_ID,
  ) as HTMLButtonElement | null;

  if (rareBtn && !rareBtn.dataset.bound) {
    rareBtn.dataset.bound = "1";
    rareBtn.addEventListener("click", () => {
      hideRareFans = !hideRareFans;
      updateFanActionButtonsState();
      renderCurrentTopDiff();
    });
  }

  if (largeDiffBtn && !largeDiffBtn.dataset.bound) {
    largeDiffBtn.dataset.bound = "1";
    largeDiffBtn.addEventListener("click", () => {
      onlyLargeDiffFans = !onlyLargeDiffFans;
      updateFanActionButtonsState();
      renderCurrentTopDiff();
    });
  }

  if (sortBtn && !sortBtn.dataset.bound) {
    sortBtn.dataset.bound = "1";
    sortBtn.addEventListener("click", () => {
      sortByAbsDiff = !sortByAbsDiff;
      updateFanActionButtonsState();
      renderCurrentTopDiff();
    });
  }

  updateFanActionButtonsState();
}

function setSelectOptions(
  selectEl: HTMLSelectElement,
  candidates: MatchCandidate[],
): void {
  const options = ['<option value="">--请选择--</option>'];
  candidates.forEach((item) => {
    if (!item?.i) {
      return;
    }
    const name = item.n || item.i;
    options.push(
      `<option value="${escapeHtml(item.i)}" data-name="${escapeHtml(name)}">${escapeHtml(name)}</option>`,
    );
  });
  selectEl.innerHTML = options.join("");
}

function bindPlayerSearch(
  keywordId: string,
  selectId: string,
  pickedId: string,
  onSelected: (id: string, name: string) => void,
): void {
  const keywordInput = document.getElementById(
    keywordId,
  ) as HTMLInputElement | null;
  const selectEl = document.getElementById(
    selectId,
  ) as HTMLSelectElement | null;
  const pickedEl = document.getElementById(pickedId) as HTMLElement | null;
  if (!keywordInput || !selectEl || !pickedEl) {
    return;
  }

  let timer = 0;
  keywordInput.addEventListener("input", () => {
    if (timer) {
      w.clearTimeout(timer);
    }
    const keyword = keywordInput.value.trim();
    if (!keyword) {
      selectEl.innerHTML = '<option value="">--请选择--</option>';
      return;
    }

    timer = w.setTimeout(() => {
      fetchMatchCandidates(keyword)
        .then((items) => {
          setSelectOptions(selectEl, items);
        })
        .catch((error) => {
          warnLog("Failed to search player", error);
        });
    }, 160);
  });

  selectEl.addEventListener("change", () => {
    const option = selectEl.options[selectEl.selectedIndex] || null;
    const id = option?.value || "";
    const name = option?.getAttribute("data-name") || option?.textContent || "";
    if (!id) {
      return;
    }
    pickedEl.textContent = `已选择：${name}`;
    onSelected(id, name);
  });
}

function updateTablePlayerHeaders(nameA: string, nameB: string): void {
  const headerA = nameA || "玩家A";
  const headerB = nameB || "玩家B";
  Array.from(document.querySelectorAll(".reviewer-style-head-a")).forEach(
    (el) => {
      el.textContent = headerA;
    },
  );
  Array.from(document.querySelectorAll(".reviewer-style-head-b")).forEach(
    (el) => {
      el.textContent = headerB;
    },
  );
}

function refreshFanTabsState(): void {
  const groupTabs = document.getElementById(FAN_GROUP_TAB_ID);
  if (groupTabs) {
    Array.from(groupTabs.querySelectorAll(".nav-link")).forEach((tab) => {
      tab.classList.toggle(
        "active",
        (tab as HTMLElement).dataset.fanGroup === currentFanGroup,
      );
    });
  }
}

function bindFanSubTabs(): void {
  const groupTabs = document.getElementById(FAN_GROUP_TAB_ID);
  if (groupTabs && !groupTabs.dataset.bound) {
    groupTabs.dataset.bound = "1";
    groupTabs.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      const tab = target?.closest(".nav-link") as HTMLElement | null;
      if (!tab) {
        return;
      }
      const nextGroup = (tab.dataset.fanGroup || "all") as FanGroup;
      currentFanGroup = nextGroup;
      refreshFanTabsState();
      renderCurrentTopDiff();
    });
  }
}

function enrichStats(raw: TechData): {
  fan: Record<string, number>;
  basic: Record<string, number>;
  whole: Record<string, number>;
} {
  return {
    fan: raw.fan || {},
    basic: {
      ...calcWinStats(raw),
      ...calcCycleStats(raw),
      ...calcPointStats(raw),
    },
    whole: raw.basic || {},
  };
}

async function runCompare(): Promise<void> {
  if (!playerAId || !playerBId) {
    setStatus("请先选择两个玩家");
    return;
  }

  setStatus("比较中...");

  try {
    const [dataA, dataB] = await Promise.all([
      fetchTechById(playerAId),
      fetchTechById(playerBId),
    ]);

    const statsA = enrichStats(dataA);
    const statsB = enrichStats(dataB);

    fanRowsAll = buildFanDiffRows(statsA.fan, statsB.fan);
    const similarity = computeSimilarityScore(
      fanRowsAll,
      getFanTotalCount(statsA.fan),
      getFanTotalCount(statsB.fan),
    );
    const scoreEl = document.getElementById("reviewer-style-score");
    if (scoreEl) {
      scoreEl.textContent = `${similarity.score.toFixed(2)} / 100`;
    }
    const overallCiEl = document.getElementById("reviewer-style-overall-ci");
    if (overallCiEl) {
      overallCiEl.textContent = `95% 置信区间：${similarity.ciLower.toFixed(2)} / 100 ～ ${similarity.ciUpper.toFixed(2)} / 100`;
    }

    refreshFanTabsState();
    renderCurrentTopDiff();
    updateTablePlayerHeaders(playerAName || "玩家A", playerBName || "玩家B");

    renderMetricRows(
      "reviewer-style-win-tbody",
      computeMetricDiffRows(WIN_METRICS, statsA, statsB),
    );
    renderMetricRows(
      "reviewer-style-cycle-tbody",
      computeMetricDiffRows(CYCLE_METRICS, statsA, statsB),
    );
    renderMetricRows(
      "reviewer-style-point-tbody",
      computeMetricDiffRows(POINT_METRICS, statsA, statsB),
    );

    setStatus(`已比较 ${playerAName || "玩家A"} vs ${playerBName || "玩家B"}`);
  } catch (error) {
    warnLog("Failed to compare style", error);
    setStatus("比较失败，请检查会员权限或搜索结果");
  }
}

function bindCompareActions(): void {
  const btn = document.getElementById(
    "reviewer-style-compare-run",
  ) as HTMLButtonElement | null;
  if (!btn || btn.dataset.bound) {
    return;
  }

  btn.dataset.bound = "1";
  btn.addEventListener("click", () => {
    void runCompare();
  });
}

function initPlayerInputs(): void {
  const selfId = getSelfIdFromQuery();
  const aPicked = document.getElementById("reviewer-style-player-a-name");
  playerAId = selfId || SELF_PLAYER_SENTINEL;
  playerAName = "当前玩家";
  if (aPicked) {
    aPicked.textContent = "已选择：当前玩家";
  }

  bindPlayerSearch(
    "reviewer-style-player-a-keyword",
    "reviewer-style-player-a-select",
    "reviewer-style-player-a-name",
    (id, name) => {
      playerAId = id;
      playerAName = name;
    },
  );
  bindPlayerSearch(
    "reviewer-style-player-b-keyword",
    "reviewer-style-player-b-select",
    "reviewer-style-player-b-name",
    (id, name) => {
      playerBId = id;
      playerBName = name;
    },
  );

  updateTablePlayerHeaders(playerAName || "玩家A", playerBName || "玩家B");
}

export function initTechAnalysis(): void {
  if (initialized) {
    bindTabToggle();
    return;
  }

  const basicTable = document.getElementById("basic");
  const eloTable = document.getElementById("elo");
  if (!basicTable || !eloTable) {
    w.setTimeout(initTechAnalysis, 120);
    return;
  }

  const container = getContainer();
  if (!container) {
    return;
  }

  if (!ensureAnalysisPanel()) {
    return;
  }
  if (!ensureAnalysisTab()) {
    return;
  }

  hideLegacyTools(container);
  moveNotesToBottom(container);
  bindTabToggle();
  initPlayerInputs();
  bindFanSubTabs();
  bindFanActionButtons();
  bindCompareActions();

  initialized = true;
}
