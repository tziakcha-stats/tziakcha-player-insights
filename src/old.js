(function () {
  "use strict";

  const DEBUG_STORAGE_KEY = "__reviewer_debug";

  const bootstrapReviewerDebugQuery = () => {
    try {
      const href = window.location.href;
      let normalizedHref = href
        .replace(/？/g, "?")
        .replace(/＆/g, "&")
        .replace("?reviewer_debug=", "&reviewer_debug=");

      if (
        !/[?&]reviewer_debug=/.test(normalizedHref) &&
        normalizedHref === href
      ) {
        return;
      }

      const url = new URL(normalizedHref);
      const debugParam = url.searchParams.get("reviewer_debug");
      if (debugParam === "1" || debugParam === "0") {
        try {
          window.localStorage?.setItem(DEBUG_STORAGE_KEY, debugParam);
        } catch (e) {}
      }

      url.searchParams.delete("reviewer_debug");
      const cleanedHref = `${url.origin}${url.pathname}${url.search}${url.hash}`;
      if (cleanedHref !== href) {
        window.history.replaceState(window.history.state, "", cleanedHref);
        console.warn(
          "[Reviewer] Normalized reviewer_debug query and removed it from URL to avoid record page parse errors",
        );
      }
    } catch (e) {
      console.warn("[Reviewer] Failed to normalize reviewer_debug query:", e);
    }
  };
  bootstrapReviewerDebugQuery();

  const logCurrentCookie = () => {
    try {
      const cookieText = document.cookie || "(empty)";
      console.log("[Reviewer] Current page cookie:", cookieText);
    } catch (e) {
      console.error("[Reviewer] Failed to read cookie:", e);
    }
  };

  const w = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const isDebugEnabled = () => {
    try {
      if (/\?reviewer_debug=1(?:&|$)/.test(w.location.href)) {
        return true;
      }
      const qs = new URLSearchParams(w.location.search);
      if (qs.get("reviewer_debug") === "1") {
        return true;
      }
      return w.localStorage?.getItem(DEBUG_STORAGE_KEY) === "1";
    } catch (e) {
      return false;
    }
  };
  let debugEnabled = isDebugEnabled();
  const debugLog = (...args) => {
    if (debugEnabled) {
      console.log("[Reviewer][Debug]", ...args);
    }
  };
  w.__reviewerDebug = {
    isEnabled: () => debugEnabled,
    setEnabled: (enabled) => {
      debugEnabled = !!enabled;
      try {
        w.localStorage?.setItem(DEBUG_STORAGE_KEY, debugEnabled ? "1" : "0");
      } catch (e) {}
      console.log(`[Reviewer] Debug ${debugEnabled ? "enabled" : "disabled"}`);
      return debugEnabled;
    },
  };

  const isRecordPage = () => /^\/record(?:\/|$)/.test(w.location.pathname);
  const isTechPage = () => /^\/user\/tech(?:\/|$)/.test(w.location.pathname);
  const isHistoryPage = () => /^\/history(?:\/|$)/.test(w.location.pathname);
  const isUserGamePage = () =>
    /^\/user\/game(?:\/|$)/.test(w.location.pathname);
  const installRecordJsonParseGuard = () => {
    if (!isRecordPage()) return;
    try {
      if (!w.JSON || typeof w.JSON.parse !== "function") return;
      const originalParse = w.JSON.parse;
      if (originalParse.__reviewer_guarded) return;

      const guardedParse = function (input, ...args) {
        if (typeof input !== "string") {
          if (input && typeof input === "object") {
            debugLog("Bypassed JSON.parse for non-string object input");
            return input;
          }
          if (input == null) {
            return input;
          }
          return input;
        }
        return originalParse.call(this, input, ...args);
      };

      guardedParse.__reviewer_guarded = true;
      w.JSON.parse = guardedParse;
      console.warn(
        "[Reviewer] Installed JSON.parse compatibility guard for record page",
      );
    } catch (e) {
      console.warn("[Reviewer] Failed to install JSON.parse guard:", e);
    }
  };
  installRecordJsonParseGuard();
  let tzInstance = null;
  let setReviewError = (msg) => {
    w.__review_error = msg;
    const reviewEl = document.getElementById("review");
    if (reviewEl) {
      reviewEl.innerText = msg;
    }
  };
  const clearReviewError = () => setReviewError("");
  w.setReviewError = setReviewError;
  if (typeof unsafeWindow === "undefined" && isRecordPage()) {
    console.warn(
      "[Reviewer] unsafeWindow unavailable; running in sandbox may fail to capture",
    );
    setReviewError("未能进入页面上下文，可能脚本被沙箱隔离");
  }
  const originalDefineProperty = Object.defineProperty;
  const originalReflectDefineProperty = Reflect.defineProperty;

  const wrapTZ = (OriginalTZ) => {
    const WrappedTZ = function (...args) {
      const instance = new OriginalTZ(...args);
      tzInstance = instance;
      clearReviewError();
      console.log("[Reviewer] Captured TZ instance:", instance);
      console.log("[Reviewer] Current step:", instance.stp);
      return instance;
    };
    WrappedTZ.prototype = OriginalTZ.prototype;
    Object.setPrototypeOf(WrappedTZ, OriginalTZ);
    for (let key in OriginalTZ) {
      if (OriginalTZ.hasOwnProperty(key)) {
        WrappedTZ[key] = OriginalTZ[key];
      }
    }
    return WrappedTZ;
  };

  const installDefinePropertyHook = () => {
    if (Object.defineProperty._tz_hooked) return;

    const hook = function (target, prop, descriptor) {
      if (
        target === w &&
        prop === "TZ" &&
        descriptor &&
        typeof descriptor.value === "function" &&
        !descriptor._tz_wrapped
      ) {
        descriptor = {
          ...descriptor,
          value: wrapTZ(descriptor.value),
          _tz_wrapped: true,
        };
        console.log("[Reviewer] Wrapped TZ via defineProperty hook");
      }
      return originalDefineProperty(target, prop, descriptor);
    };

    hook._tz_hooked = true;
    Object.defineProperty = hook;

    if (typeof originalReflectDefineProperty === "function") {
      const reflectHook = function (target, prop, descriptor) {
        if (
          target === w &&
          prop === "TZ" &&
          descriptor &&
          typeof descriptor.value === "function" &&
          !descriptor._tz_wrapped
        ) {
          descriptor = {
            ...descriptor,
            value: wrapTZ(descriptor.value),
            _tz_wrapped: true,
          };
          console.log("[Reviewer] Wrapped TZ via Reflect.defineProperty hook");
        }
        return originalReflectDefineProperty(target, prop, descriptor);
      };
      reflectHook._tz_hooked = true;
      Reflect.defineProperty = reflectHook;
    }
  };

  const interceptTZ = () => {
    debugLog(
      "Installing TZ interceptors for current route",
      w.location.pathname,
    );
    installDefinePropertyHook();
    const existing = Object.getOwnPropertyDescriptor(w, "TZ");
    debugLog(
      "Existing TZ descriptor:",
      existing
        ? {
            configurable: existing.configurable,
            enumerable: existing.enumerable,
            writable: existing.writable,
            hasGetter: typeof existing.get === "function",
            hasSetter: typeof existing.set === "function",
            valueType: typeof existing.value,
          }
        : "none",
    );

    const forceCreateTZ = () => {
      try {
        if (tzInstance || typeof w.TZ !== "function") return false;
        const sp = new URLSearchParams(w.location.search);
        const id = sp.get("id");
        const v = sp.get("v");
        const cy = sp.get("cy");
        const tz = new w.TZ();
        tzInstance = tz;
        clearReviewError();
        console.log("[Reviewer] Force-created TZ instance");
        if (typeof tz.adapt === "function") tz.adapt();
        if (id && typeof tz.fetch === "function") {
          tz.fetch(id, 0, v, cy);
        }
        return true;
      } catch (e) {
        console.error("[Reviewer] Force-create TZ failed:", e);
        return false;
      }
    };

    if (!existing || existing.configurable) {
      const descriptor = {
        configurable: true,
        enumerable: true,
        get: function () {
          return this._TZ;
        },
        set: function (value) {
          if (typeof value === "function" && !this._TZ_intercepted) {
            console.log("[Reviewer] Intercepting TZ constructor");
            this._TZ_intercepted = true;
            this._TZ = wrapTZ(value);
          } else {
            this._TZ = value;
          }
        },
      };
      try {
        originalDefineProperty(w, "TZ", descriptor);
        console.log("[Reviewer] TZ interceptor installed (configurable path)");
        return;
      } catch (e) {
        console.error(
          "[Reviewer] Failed to install TZ interceptor via defineProperty:",
          e,
        );
      }
    }

    if (existing && existing.writable === false) {
      console.warn(
        "[Reviewer] TZ is non-configurable and non-writable; cannot intercept",
      );
      if (w.setReviewError) {
        w.setReviewError("TZ 属性不可拦截，无法捕获牌局");
      }
      return;
    }

    const tryPatch = () => {
      if (typeof w.TZ === "function" && !w._TZ_intercepted_direct) {
        w._TZ_intercepted_direct = true;
        w.TZ = wrapTZ(w.TZ);
        console.log("[Reviewer] TZ interceptor installed (fallback patch)");
        return true;
      }
      return false;
    };

    if (tryPatch()) return;

    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (tryPatch() || attempts > 200) {
        if (attempts > 200) {
          console.warn("[Reviewer] Gave up waiting for TZ to patch");
          if (w.setReviewError) {
            w.setReviewError("未捕获牌局核心对象，尝试补建实例");
          }
          forceCreateTZ();
        }
        clearInterval(timer);
      }
    }, 50);
  };

  const initTechZumgze = () => {
    debugLog("initTechZumgze start");
    const basicTable = document.getElementById("basic");
    const eloTable = document.getElementById("elo");
    if (!basicTable || !eloTable) {
      setTimeout(initTechZumgze, 100);
      return;
    }

    const FAN_ITEMS = [
      { idx: 36, name: "全不靠" },
      { idx: 37, name: "组合龙" },
      { idx: 45, name: "无番和" },
      { idx: 51, name: "混一色" },
      { idx: 53, name: "五门齐" },
      { idx: 60, name: "和绝张" },
      { idx: 58, name: "不求人" },
      { idx: 57, name: "全带幺" },
      { idx: 52, name: "三色三步高" },
      { idx: 32, name: "一色三连环" },
      { idx: 20, name: "七对" },
      { idx: 43, name: "三色三同顺" },
      { idx: 41, name: "花龙" },
      { idx: 50, name: "碰碰和" },
      { idx: 29, name: "清龙" },
    ];

    const REF_MAPS = {
      chaga: {
        label: "CHAGA均",
        values: {
          全不靠: 3.51,
          组合龙: 2.783,
          无番和: 2.158,
          混一色: 9.56,
          五门齐: 11.699,
          和绝张: 4.97,
          不求人: 7.288,
          全带幺: 3.168,
          三色三步高: 22.742,
          一色三连环: 3.275,
          七对: 3.036,
          三色三同顺: 8.387,
          花龙: 7.49,
          碰碰和: 4.473,
          清龙: 5.341,
        },
      },
      zha: {
        label: "渣均",
        values: {
          全不靠: 1.674,
          组合龙: 1.37,
          无番和: 1.518,
          混一色: 8.18,
          五门齐: 10.88,
          和绝张: 4.71,
          不求人: 7.21,
          全带幺: 3.137,
          三色三步高: 23.144,
          一色三连环: 3.428,
          七对: 3.329,
          三色三同顺: 9.788,
          花龙: 9.169,
          碰碰和: 5.695,
          清龙: 7.748,
        },
      },
    };
    let currentRefKey = "chaga";
    let latestFanData = {};

    const styleId = "reviewer-zumgze-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
                #reviewer-zumgze-wrap .zumgze-summary {
                    font-weight: 600;
                }
                #reviewer-zumgze-wrap .zumgze-similarity {
                    margin-top: 0.2em;
                }
                #reviewer-zumgze-wrap .zumgze-score-trigger {
                    cursor: help;
                    text-decoration: underline dotted;
                    text-underline-offset: 2px;
                }
                #reviewer-zumgze-wrap .zumgze-score-help {
                    margin-top: 0.15em;
                    font-size: 12px;
                    color: #6c757d;
                }
                #reviewer-zumgze-wrap .zumgze-score-ci {
                    margin-top: 0.1em;
                    font-size: 12px;
                    color: #6c757d;
                }
                #reviewer-zumgze-wrap .zumgze-col-name {
                    width: 7em;
                }
                #reviewer-zumgze-wrap .zumgze-col-player {
                    width: 6em;
                }
                #reviewer-zumgze-wrap .zumgze-col-ref {
                    width: 6em;
                }
                #reviewer-zumgze-wrap .zumgze-bar-wrap {
                    position: relative;
                    width: 100%;
                    height: 20px;
                    border-radius: 3px;
                    background: #f8f9fa;
                    overflow: hidden;
                }
                #reviewer-zumgze-wrap .zumgze-bar-zero {
                    position: absolute;
                    left: 50%;
                    top: 0;
                    bottom: 0;
                    width: 1px;
                    background: #6c757d;
                    opacity: 0.6;
                    z-index: 1;
                }
                #reviewer-zumgze-wrap .zumgze-bar-fill {
                    position: absolute;
                    top: 2px;
                    bottom: 2px;
                    border-radius: 2px;
                    z-index: 2;
                }
                #reviewer-zumgze-wrap .zumgze-bar-label {
                    position: absolute;
                    right: 6px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 12px;
                    font-weight: 600;
                    z-index: 3;
                }
                #reviewer-zumgze-wrap .zumgze-bar-label-left {
                    right: auto;
                    left: 6px;
                }
                #reviewer-zumgze-wrap .zumgze-ref-header {
                    display: flex;
                    align-items: center;
                    gap: 0.4em;
                }
                #reviewer-zumgze-wrap .zumgze-ref-toolbar {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 0.5em;
                    margin-bottom: 0.35em;
                }
                #reviewer-zumgze-wrap .zumgze-ref-toggle {
                    font-size: 12px;
                    line-height: 1.2;
                    padding: 0.2em 0.65em;
                }
                #reviewer-zumgze-wrap .zumgze-table-toggle {
                    font-size: 12px;
                    line-height: 1.2;
                    padding: 0.2em 0.65em;
                    margin-bottom: 0.35em;
                }
            `;
      document.head.appendChild(style);
    }

    const renderZumgze = (fan = {}) => {
      const CHAGA_SIMILARITY_D = 21;
      const CHAGA_SIMILARITY_C = -0.23;
      const CHAGA_SIMILARITY_A = 4;
      const CHAGA_CI_Z95 = 1.96;
      const CHAGA_REF_SAMPLE_SIZE = 3416686;
      latestFanData = fan || {};
      const currentRef =
        REF_MAPS[currentRefKey]?.values || REF_MAPS.chaga.values;
      const total = (fan.c0 || 0) + (fan.d0 || 0);
      let zumgze = 0;
      const rows = FAN_ITEMS.map(({ idx, name }) => {
        const count = (fan[`c${idx}`] || 0) + (fan[`d${idx}`] || 0);
        const playerPct = total ? (count / total) * 100 : 0;
        const refPct = currentRef[name];
        const diff = playerPct - refPct;
        zumgze += Math.abs(diff);
        return { name, playerPct, refPct, diff };
      });
      const fanCount = rows.length;
      const chagaH = (value) => 1 / (1 + Math.exp(-CHAGA_SIMILARITY_C * value));
      const chagaScoreFromDistance = (distance) => {
        const scoreRaw =
          Math.sqrt(chagaH(distance - CHAGA_SIMILARITY_D)) * 100 +
          CHAGA_SIMILARITY_A;
        return Math.max(0, Math.min(100, scoreRaw));
      };
      const chagaSimilarity = chagaScoreFromDistance(zumgze);
      const computeZumgzeCI = () => {
        const k = total;
        const m = CHAGA_REF_SAMPLE_SIZE;
        if (!(k > 0 && m > 0)) {
          return null;
        }
        let dProb = 0;
        let varD = 0;
        for (const row of rows) {
          const a = row.playerPct / 100;
          const p = row.refPct / 100;
          dProb += Math.abs(a - p);
          varD += (a * (1 - a)) / m + (p * (1 - p)) / k;
        }
        const seProb = Math.sqrt(Math.max(0, varD));
        const ciLowerProb = Math.max(0, dProb - CHAGA_CI_Z95 * seProb);
        const ciUpperProb = dProb + CHAGA_CI_Z95 * seProb;
        return {
          lowerDistance: ciLowerProb * 100,
          upperDistance: ciUpperProb * 100,
        };
      };
      const chagaCI = computeZumgzeCI();
      let chagaScoreLower = null;
      let chagaScoreUpper = null;
      if (chagaCI) {
        const scoreA = chagaScoreFromDistance(chagaCI.lowerDistance);
        const scoreB = chagaScoreFromDistance(chagaCI.upperDistance);
        chagaScoreLower = Math.min(scoreA, scoreB);
        chagaScoreUpper = Math.max(scoreA, scoreB);
      }

      rows.sort((a, b) => {
        const aPositive = a.diff >= 0;
        const bPositive = b.diff >= 0;
        if (aPositive !== bPositive) {
          return bPositive - aPositive;
        }
        return b.diff - a.diff;
      });

      const maxAbsDiff = Math.max(
        ...rows.map((item) => Math.abs(item.diff)),
        1e-9,
      );
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
      if (!wrap) {
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
                            <thead class="table-dark">
                                <tr>
                                    <th class="zumgze-col-name">番种</th>
                                    <th class="text-end zumgze-col-player">玩家</th>
                                    <th></th>
                                    <th class="text-start zumgze-col-ref">参考</th>
                                </tr>
                            </thead>
                            <tbody id="reviewer-zumgze-tbody"></tbody>
                        </table>
                    </div>
                    <div class="zumgze-summary text-dark"><span id="reviewer-zumgze-summary-label">CHAGA均平均差</span>：<span id="reviewer-zumgze-value">0.000</span></div>
                    <div id="reviewer-zumgze-similarity" class="zumgze-similarity text-dark" style="display:none;">
                        <span id="reviewer-zumgze-similarity-label" class="zumgze-score-trigger" title="由 zumgze 设计，用于评估打法和 CHAGA 牌风的相似度（仅供参考）">CHAGA度</span>：<span id="reviewer-zumgze-similarity-value">0.00 / 100</span>
                        <div id="reviewer-zumgze-similarity-ci" class="zumgze-score-ci" style="display:none;">95% 置信区间：<span id="reviewer-zumgze-similarity-ci-value">0.00 / 100 ～ 0.00 / 100</span></div>
                        <div id="reviewer-zumgze-similarity-help" class="zumgze-score-help" style="display:none;">由 zumgze 设计，用于评估打法和 CHAGA 牌风的相似度（仅供参考）</div>
                    </div>
                `;
        const basicHeading = basicTable.previousElementSibling;
        if (basicHeading && basicHeading.tagName === "H4") {
          basicHeading.parentNode.insertBefore(wrap, basicHeading);
        } else {
          basicTable.parentNode.insertBefore(wrap, basicTable);
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
      );
      const tableToggleBtn = document.getElementById(
        "reviewer-zumgze-table-toggle",
      );
      const tableCollapseEl = document.getElementById(
        "reviewer-zumgze-table-collapse",
      );
      const similarityWrapEl = document.getElementById(
        "reviewer-zumgze-similarity",
      );
      const similarityLabelEl = document.getElementById(
        "reviewer-zumgze-similarity-label",
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
      const similarityHelpEl = document.getElementById(
        "reviewer-zumgze-similarity-help",
      );
      if (tbody) {
        tbody.innerHTML = rowsHtml;
      }
      if (valueEl) {
        valueEl.textContent = `${zumgze.toFixed(3)} / ${fanCount} 项番种`;
      }
      if (summaryLabelEl) {
        summaryLabelEl.textContent = `${REF_MAPS[currentRefKey].label}平均差`;
      }
      if (similarityWrapEl && similarityValueEl) {
        if (currentRefKey === "chaga") {
          similarityWrapEl.style.display = "";
          similarityValueEl.textContent = `${chagaSimilarity.toFixed(2)} / 100`;
          if (
            similarityCiEl &&
            similarityCiValueEl &&
            chagaScoreLower !== null &&
            chagaScoreUpper !== null
          ) {
            similarityCiEl.style.display = "";
            similarityCiValueEl.textContent = `${chagaScoreLower.toFixed(2)} / 100 ～ ${chagaScoreUpper.toFixed(2)} / 100`;
          } else if (similarityCiEl) {
            similarityCiEl.style.display = "none";
          }
        } else {
          similarityWrapEl.style.display = "none";
          if (similarityHelpEl) {
            similarityHelpEl.style.display = "none";
          }
          if (similarityCiEl) {
            similarityCiEl.style.display = "none";
          }
        }
      }
      if (refLabelEl) {
        refLabelEl.textContent = `当前参考：${REF_MAPS[currentRefKey].label}`;
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
      if (tableToggleBtn && tableCollapseEl && !tableToggleBtn.dataset.bound) {
        tableToggleBtn.dataset.bound = "1";
        tableCollapseEl.addEventListener("shown.bs.collapse", () => {
          tableToggleBtn.textContent = "收起表格";
          tableToggleBtn.setAttribute("aria-expanded", "true");
        });
        tableCollapseEl.addEventListener("hidden.bs.collapse", () => {
          tableToggleBtn.textContent = "展开表格";
          tableToggleBtn.setAttribute("aria-expanded", "false");
        });
      }
      if (
        similarityLabelEl &&
        similarityHelpEl &&
        !similarityLabelEl.dataset.bound
      ) {
        similarityLabelEl.dataset.bound = "1";
        similarityLabelEl.addEventListener("click", () => {
          similarityHelpEl.style.display =
            similarityHelpEl.style.display === "none" ? "" : "none";
        });
      }
    };

    fetch("/_qry/user/tech/" + w.location.search, {
      method: "POST",
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((json) => renderZumgze(json?.fan || {}))
      .catch((e) => {
        console.error("[Reviewer] Failed to load zumgze data:", e);
      });
  };

  const initHistoryVisit = () => {
    debugLog("initHistoryVisit start");
    const refreshLink = document.getElementById("rfrsh");
    const tbody = document.querySelector("table tbody");
    if (!refreshLink || !tbody) {
      setTimeout(initHistoryVisit, 100);
      return;
    }
    if (document.getElementById("reviewer-history-visit-btn")) {
      return;
    }
    const nameCellIndexes = isUserGamePage() ? [2, 4, 6, 8] : [1, 3, 5, 7];

    const escapeHtml = (text) =>
      String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const extractNameFromCell = (cell) => {
      const raw = (cell.textContent || "").replace(/\s+/g, " ").trim();
      if (!raw) return "";
      return raw.replace(/^★\s*/, "").trim();
    };

    const getNameCells = () => {
      const rows = Array.from(tbody.querySelectorAll("tr"));
      const cells = [];
      rows.forEach((row) => {
        const tds = row.querySelectorAll("td");
        nameCellIndexes.forEach((idx) => {
          if (tds[idx]) {
            cells.push(tds[idx]);
          }
        });
      });
      return cells;
    };

    const renderLinkedCell = (cell, userName, userId) => {
      if (!userName || !userId) return;
      const raw = (cell.textContent || "").replace(/\s+/g, " ").trim();
      const hasStar = /^★\s*/.test(raw);
      const href = `/user/tech/?id=${encodeURIComponent(userId)}`;
      const currentA = cell.querySelector("a");
      if (currentA && currentA.getAttribute("href") === href) {
        return;
      }
      cell.innerHTML = `${hasStar ? "★ " : ""}<a href="${href}" target="_blank">${escapeHtml(userName)}</a>`;
    };

    const renderPlainCell = (cell) => {
      const raw = (cell.textContent || "").replace(/\s+/g, " ").trim();
      if (!raw) return;
      const hasStar = /^★\s*/.test(raw);
      const userName = raw.replace(/^★\s*/, "").trim();
      cell.textContent = `${hasStar ? "★ " : ""}${userName}`;
    };

    const nameToId = new Map();
    let enabled = false;
    let loading = false;

    const queryUserIdByName = async (name) => {
      const resp = await fetch(`/_qry/match/?kw=${encodeURIComponent(name)}`, {
        method: "POST",
        credentials: "include",
      });
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const json = await resp.json();
      const items = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
          ? json.data
          : [];
      const exact = items.find((item) => item && item.n === name && item.i);
      return exact ? exact.i : null;
    };

    const enrichCurrentRows = async () => {
      if (loading) return;
      loading = true;
      try {
        const nameCells = getNameCells();
        const names = Array.from(
          new Set(nameCells.map(extractNameFromCell).filter(Boolean)),
        );

        const pending = names.filter((name) => !nameToId.has(name));
        if (pending.length) {
          const results = await Promise.all(
            pending.map(async (name) => {
              try {
                const userId = await queryUserIdByName(name);
                return [name, userId];
              } catch (e) {
                console.warn("[Reviewer] Failed to query user id:", name, e);
                return [name, null];
              }
            }),
          );
          results.forEach(([name, userId]) => {
            nameToId.set(name, userId);
          });
        }

        let linkedCount = 0;
        nameCells.forEach((cell) => {
          const name = extractNameFromCell(cell);
          const userId = nameToId.get(name);
          if (name && userId) {
            renderLinkedCell(cell, name, userId);
            linkedCount += 1;
          }
        });
        console.log(`[Reviewer] 家访完成，已添加 ${linkedCount} 个用户链接`);
        return linkedCount;
      } finally {
        loading = false;
      }
    };

    const visitBtn = document.createElement("a");
    visitBtn.id = "reviewer-history-visit-btn";
    visitBtn.href = "javascript:void(0)";
    visitBtn.className = "m-1 btn btn-outline-primary btn-sm";
    visitBtn.textContent = "家访（需要会员）";
    visitBtn.addEventListener("click", async () => {
      if (loading) return;

      if (enabled) {
        enabled = false;
        getNameCells().forEach((cell) => {
          renderPlainCell(cell);
        });
        visitBtn.textContent = "家访（需要会员）";
        console.log("[Reviewer] 已取消家访显示");
        return;
      }

      const oldText = visitBtn.textContent;
      visitBtn.textContent = "家访中...";
      try {
        enabled = true;
        const linkedCount = await enrichCurrentRows();
        if (!linkedCount) {
          console.warn("[Reviewer] 家访未找到可匹配的完整用户名");
        }
        visitBtn.textContent = "取消家访";
      } catch (e) {
        console.error("[Reviewer] 家访失败：", e);
      } finally {
        if (!enabled) {
          visitBtn.textContent = "家访（需要会员）";
        } else if (visitBtn.textContent === "家访中...") {
          visitBtn.textContent = oldText;
        }
      }
    });

    refreshLink.parentNode.insertBefore(visitBtn, refreshLink);

    const observer = new MutationObserver(() => {
      if (enabled) {
        enrichCurrentRows();
      }
    });
    observer.observe(tbody, { childList: true, subtree: true });
  };

  const initReviewer = () => {
    debugLog("initReviewer start", {
      readyState: document.readyState,
      pathname: w.location.pathname,
      hasWIND: typeof w.WIND !== "undefined",
      hasTILE: typeof w.TILE !== "undefined",
    });
    if (typeof w.WIND === "undefined" || typeof w.TILE === "undefined") {
      console.log("[Reviewer] Waiting for game constants...");
      setTimeout(initReviewer, 100);
      return;
    }

    const WIND = w.WIND;
    const TILE = w.TILE;

    const style = document.createElement("style");
    style.textContent = `
            .highlight-first-tile {
                box-shadow: 0 0 0 3px red, inset 0 0 0 3px red !important;
            }
            .tile-weight-bar {
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                width: 10px;
                height: 0;
                max-height: 50px;
                background: #ff4444;
                transition: height 0.3s ease;
                z-index: 10;
                pointer-events: none;
            }
            .review-container {
                position: relative;
                min-height: 128px;
            }
            .review-bg-image {
                position: absolute;
                top: 0;
                right: 0;
                width: 128px;
                height: 128px;
                opacity: 0.50;
                z-index: 0;
                pointer-events: none;
            }
            #review {
                position: relative;
                z-index: 1;
                padding-right: 10px;
            }
        `;
    document.head.appendChild(style);

    console.log("[Reviewer] Initializing reviewer...");

    const bz2tc = (s) => {
      const type = s[0];
      const num = parseInt(s.slice(1)) - 1;
      if (type === "W") return num + 0;
      else if (type === "T") return num + 9;
      else if (type === "B") return num + 18;
      else if (type === "F") return num + 27;
      else if (type === "J") return num + 31;
      else if (type === "H") return num + 34;
      else {
        console.log("Unknown tile:", s);
        return -1;
      }
    };

    const act2str = (act) => {
      act = act.trim();
      if (act.startsWith("Chi")) {
        const components = act.split(/\s+/);
        const tile = tc2tile(bz2tc(components.at(-1)));
        const chi = `${+tile[0] - 1}${tile[0]}${+tile[0] + 1}${tile[1]}`;
        return [...components.slice(0, -1), chi].join(" ");
      } else if ("1" <= act.at(-1) && act.at(-1) <= "9") {
        const components = act.split(/\s+/);
        return [
          ...components.slice(0, -1),
          tc2tile(bz2tc(components.at(-1))),
        ].join(" ");
      } else return act;
    };

    const tc2tile = (i) => TILE[i * 4];

    const fmtLoad = (i) => {
      switch (i) {
        case 0:
          return "✗";
        case 1:
          return "·";
        case 2:
          return "✓";
        default:
          return "_";
      }
    };

    const parseRound = (roundStr) => {
      roundStr = roundStr.trim();

      if (/^\d/.test(roundStr)) {
        const num = parseInt(roundStr);
        return num - 1;
      }

      if (WIND.some((w) => roundStr.startsWith(w + " "))) {
        const wind = WIND.find((w) => roundStr.startsWith(w + " "));
        const num = parseInt(roundStr.slice(wind.length).trim()) - 1;
        return WIND.findIndex((x) => x === wind) * 4 + num;
      }

      if (roundStr.length === 3 && roundStr[1] === "风") {
        return (
          WIND.findIndex((x) => x === roundStr[0]) * 4 +
          WIND.findIndex((x) => x === roundStr[2])
        );
      }

      console.warn("Unknown round format:", roundStr);
      return (
        WIND.findIndex((x) => x === roundStr[0]) * 4 +
        WIND.findIndex((x) => x === roundStr[2])
      );
    };

    w.__reviews = {};
    w.__reviews_filled = {};
    w.__reviews_seats = [undefined, undefined, undefined, undefined];
    w.__review_error = "";
    let highlightFirstTile = true;
    let showWeightBars = true;
    let hideUserInfo = false;

    const getPlayerStep = () => {
      if (tzInstance && typeof tzInstance.stp === "number") {
        return tzInstance.stp - 18;
      }
      return -18;
    };

    const softmax = (weights) => {
      const maxWeight = Math.max(...weights);
      const expWeights = weights.map((w) => Math.exp(w - maxWeight));
      const sumExp = expWeights.reduce((a, b) => a + b, 0);
      return expWeights.map((w) => w / sumExp);
    };

    const toggleUserInfo = (hide) => {
      const nameElements = document.querySelectorAll(".name");
      const eloElements = document.querySelectorAll(".elo");

      if (hide) {
        nameElements.forEach((el, index) => {
          const currentText = el.textContent.trim();
          if (!currentText.match(/^用户\d+$/)) {
            el.dataset.originalName = currentText;
          }
          el.textContent = `用户${index + 1}`;
        });

        eloElements.forEach((el) => {
          const eloValSpan = el.querySelector(".elo-val");
          if (eloValSpan) {
            el.dataset.originalElo = eloValSpan.textContent;
          }
          el.style.display = "none";
        });
      } else {
        nameElements.forEach((el) => {
          const currentText = el.textContent.trim();
          if (currentText.match(/^用户\d+$/) && el.dataset.originalName) {
            el.textContent = el.dataset.originalName;
          }
          delete el.dataset.originalName;
        });

        eloElements.forEach((el) => {
          el.style.display = "";
          const eloValSpan = el.querySelector(".elo-val");
          if (eloValSpan && el.dataset.originalElo) {
            eloValSpan.textContent = el.dataset.originalElo;
          }
          delete el.dataset.originalElo;
        });
      }
    };

    const clearWeightBars = () => {
      document
        .querySelectorAll(".tile-weight-bar")
        .forEach((el) => el.remove());
    };

    const showWeightVisualization = (candidates, playerIndex) => {
      if (playerIndex !== 0 || !showWeightBars) return;
      const handContainers = document.querySelectorAll(".hand");
      if (handContainers.length === 0) return;
      const currentHand = handContainers[0];
      const tiles = Array.from(currentHand.querySelectorAll(".tl"));
      const tileWeightMap = new Map();
      const weights = candidates.map(([w, _]) => w);
      const probs = softmax(weights);
      candidates.forEach(([weight, act], idx) => {
        const actStr = act.trim();
        if (!actStr.startsWith("Play ")) return;
        const tileCode = actStr.slice(5);
        const tileIndex = bz2tc(tileCode);
        if (tileIndex >= 0 && tileIndex < 136) {
          if (!tileWeightMap.has(tileIndex)) {
            tileWeightMap.set(tileIndex, probs[idx]);
          }
        }
      });
      tiles.forEach((tileEl) => {
        const tileVal = parseInt(tileEl.dataset.val);
        const tileIndex = Math.floor(tileVal / 4);
        const prob = tileWeightMap.get(tileIndex);
        if (prob !== undefined) {
          const computedStyle = window.getComputedStyle(tileEl);
          const currentPosition = computedStyle.position;
          if (currentPosition === "static") {
            tileEl.style.position = "relative";
          }
          const bar = document.createElement("div");
          bar.className = "tile-weight-bar";
          bar.style.height = `${prob * 50}px`;
          tileEl.appendChild(bar);
        }
      });
    };

    let lastStp = null;

    const show_cands = () => {
      const roundEl = document.getElementById("round");
      const reviewLogEl = document.getElementById("review-log");
      const reviewEl = document.getElementById("review");

      if (!roundEl || !reviewLogEl || !reviewEl) return;

      const roundStr = roundEl.innerHTML;
      const round = parseRound(roundStr);
      const ri = getPlayerStep();
      lastStp = tzInstance?.stp ?? lastStp;

      reviewLogEl.innerHTML = `CHAGA Reviewer [Step ${ri}] [Load ${w.__reviews_seats.map(fmtLoad).join(" ")}]`;
      if (w.__review_error) {
        reviewEl.innerText = w.__review_error;
        clearWeightBars();
        document.querySelectorAll(".tl.highlight-first-tile").forEach((el) => {
          el.classList.remove("highlight-first-tile");
        });
        return;
      }

      if (tzInstance && w.__review_error) {
        clearReviewError();
      }

      const key = `${round}-${ri}`;
      const resp = w.__reviews_filled[key] || w.__reviews[key];
      document.querySelectorAll(".tl.highlight-first-tile").forEach((el) => {
        el.classList.remove("highlight-first-tile");
      });
      clearWeightBars();
      if (resp?.extra?.candidates?.length) {
        reviewEl.innerHTML = resp.extra.candidates
          .map(
            ([weight, act]) =>
              `${act2str(act)}&nbsp;&nbsp;-&nbsp;&nbsp;${weight.toFixed(2)}`,
          )
          .join("<br>");
        const hasPlay = resp.extra.candidates.some(([_, act]) =>
          act.trim().startsWith("Play "),
        );
        if (hasPlay && tzInstance) {
          const currentStat = tzInstance.stat?.[tzInstance.stp];
          const playerIndex = currentStat?.k ?? 0;
          showWeightVisualization(resp.extra.candidates, playerIndex);
        }
        if (hasPlay && highlightFirstTile && tzInstance) {
          const firstCand = resp.extra.candidates[0];
          if (firstCand && firstCand[1]) {
            const act = firstCand[1].trim();
            const tileCode = act.slice(5);
            const tileIndex = bz2tc(tileCode);
            if (
              tileIndex >= 0 &&
              tileIndex < 136 &&
              tzInstance.stat &&
              tzInstance.stat[tzInstance.stp]
            ) {
              const currentStat = tzInstance.stat[tzInstance.stp];
              let playerIndex = currentStat.k;
              if (typeof playerIndex === "undefined") {
                playerIndex = 0;
              }
              const handContainers = document.querySelectorAll(".hand");
              if (handContainers.length > playerIndex) {
                const targetHand = handContainers[playerIndex];
                const tiles = targetHand.querySelectorAll(".tl");
                let highlighted = false;
                tiles.forEach((tileEl) => {
                  if (!highlighted) {
                    const tileVal = parseInt(tileEl.dataset.val);
                    if (Math.floor(tileVal / 4) === tileIndex) {
                      tileEl.classList.add("highlight-first-tile");
                      console.log(
                        `[Reviewer] Highlighted tile DOM for player ${playerIndex}: ${tileCode}`,
                      );
                      highlighted = true;
                    }
                  }
                });
              }
            }
          }
        }
      } else {
        reviewEl.innerText = "";
      }
    };

    const startStepWatcher = () => {
      const poll = () => {
        const stp = tzInstance?.stp;
        if (typeof stp === "number" && stp !== lastStp) {
          lastStp = stp;
          show_cands();
        }
      };
      setInterval(poll, 200);
    };

    const createUI = () => {
      const ctrl = document.getElementById("ctrl");
      if (!ctrl) {
        setTimeout(createUI, 100);
        return;
      }
      const ctrlRtDiv = document.createElement("div");
      ctrlRtDiv.classList.add("ctrl-rt", "fs-sm");
      const checkboxDiv = document.createElement("div");
      checkboxDiv.classList.add("ctrl-e", "no-sel");
      const checkboxLabel = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "cb-highlight-first-tile";
      checkbox.checked = highlightFirstTile;
      checkbox.onchange = function (e) {
        highlightFirstTile = e.target.checked;
        show_cands();
      };
      const labelText = document.createElement("span");
      labelText.classList.add("ml-02em");
      labelText.innerText = "高亮首选牌";
      checkboxLabel.appendChild(checkbox);
      checkboxLabel.appendChild(labelText);
      checkboxDiv.appendChild(checkboxLabel);
      ctrlRtDiv.appendChild(checkboxDiv);
      const weightCheckboxDiv = document.createElement("div");
      weightCheckboxDiv.classList.add("ctrl-e", "no-sel");
      const weightCheckboxLabel = document.createElement("label");
      const weightCheckbox = document.createElement("input");
      weightCheckbox.type = "checkbox";
      weightCheckbox.id = "cb-show-weight-bars";
      weightCheckbox.checked = showWeightBars;
      weightCheckbox.onchange = function (e) {
        showWeightBars = e.target.checked;
        show_cands();
      };
      const weightLabelText = document.createElement("span");
      weightLabelText.classList.add("ml-02em");
      weightLabelText.innerText = "显示权重条";
      weightCheckboxLabel.appendChild(weightCheckbox);
      weightCheckboxLabel.appendChild(weightLabelText);
      weightCheckboxDiv.appendChild(weightCheckboxLabel);
      ctrlRtDiv.appendChild(weightCheckboxDiv);

      const hideInfoCheckboxDiv = document.createElement("div");
      hideInfoCheckboxDiv.classList.add("ctrl-e", "no-sel");
      const hideInfoCheckboxLabel = document.createElement("label");
      const hideInfoCheckbox = document.createElement("input");
      hideInfoCheckbox.type = "checkbox";
      hideInfoCheckbox.id = "cb-hide-user-info";
      hideInfoCheckbox.checked = hideUserInfo;
      hideInfoCheckbox.onchange = function (e) {
        hideUserInfo = e.target.checked;
        toggleUserInfo(hideUserInfo);
      };
      const hideInfoLabelText = document.createElement("span");
      hideInfoLabelText.classList.add("ml-02em");
      hideInfoLabelText.innerText = "隐藏用户信息";
      hideInfoCheckboxLabel.appendChild(hideInfoCheckbox);
      hideInfoCheckboxLabel.appendChild(hideInfoLabelText);
      hideInfoCheckboxDiv.appendChild(hideInfoCheckboxLabel);
      ctrlRtDiv.appendChild(hideInfoCheckboxDiv);

      const logDiv = document.createElement("div");
      logDiv.classList.add("fs-sm");
      const logSpan = document.createElement("span");
      logSpan.id = "review-log";
      logDiv.appendChild(logSpan);
      ctrlRtDiv.appendChild(logDiv);
      const reviewDiv = document.createElement("div");
      reviewDiv.classList.add("fs-sm", "review-container");

      const bgImage = document.createElement("img");
      bgImage.className = "review-bg-image";
      bgImage.src =
        "https://cdn.jsdelivr.net/gh/Choimoe/chaga-reviewer-script/doc/img/icon.png";
      bgImage.onerror = function () {
        console.log(
          "[Reviewer] Failed to load image from jsdelivr, fallback to loli.net",
        );
        this.onerror = null;
        this.src = "https://s2.loli.net/2026/01/12/JV3yI89rnRzO1E4.png";
      };
      reviewDiv.appendChild(bgImage);

      const reviewSpan = document.createElement("span");
      reviewSpan.id = "review";
      reviewDiv.appendChild(reviewSpan);
      ctrlRtDiv.appendChild(reviewDiv);
      ctrl.appendChild(ctrlRtDiv);

      console.log("[Reviewer] UI elements created");

      const hookViewChange = () => {
        const viewSelect = document.getElementById("view");
        if (viewSelect) {
          const originalOnChange = viewSelect.onchange;
          viewSelect.onchange = function (e) {
            if (hideUserInfo) {
              const hideInfoCheckbox =
                document.getElementById("cb-hide-user-info");
              hideInfoCheckbox.checked = false;
              hideUserInfo = false;
              toggleUserInfo(false);

              const nameElements = document.querySelectorAll(".name");
              nameElements.forEach((el) => {
                delete el.dataset.originalName;
              });
            }
            if (originalOnChange) {
              return originalOnChange.call(this, e);
            }
          };
          console.log("[Reviewer] View change hook installed");
        }
      };

      const hookButtons = () => {
        const buttons = [
          "nextstp",
          "prevstp",
          "ffstp",
          "frstp",
          "next",
          "prev",
        ];
        buttons.forEach((id) => {
          const btn = document.getElementById(id);
          if (!btn) return;
          if (btn.onclick) {
            const original = btn.onclick;
            btn.onclick = function (e) {
              if ((id === "next" || id === "prev") && hideUserInfo) {
                const hideInfoCheckbox =
                  document.getElementById("cb-hide-user-info");
                hideInfoCheckbox.checked = false;
                hideUserInfo = false;
                toggleUserInfo(false);

                const nameElements = document.querySelectorAll(".name");
                nameElements.forEach((el) => {
                  delete el.dataset.originalName;
                });
              }
              const result = original.call(this, e);
              setTimeout(show_cands, 50);
              return result;
            };
          }
          btn.addEventListener(
            "click",
            () => {
              if ((id === "next" || id === "prev") && hideUserInfo) {
                const hideInfoCheckbox =
                  document.getElementById("cb-hide-user-info");
                hideInfoCheckbox.checked = false;
                hideUserInfo = false;
                toggleUserInfo(false);

                const nameElements = document.querySelectorAll(".name");
                nameElements.forEach((el) => {
                  delete el.dataset.originalName;
                });
              }
              setTimeout(show_cands, 50);
            },
            { passive: true },
          );
        });

        console.log("[Reviewer] Button hooks installed");
      };

      setTimeout(hookViewChange, 500);
      setTimeout(hookButtons, 500);
      startStepWatcher();
    };

    const loadReviewData = () => {
      const tiEl = document.getElementById("ti");
      if (!tiEl || !tiEl.children[0]) {
        setTimeout(loadReviewData, 100);
        return;
      }
      setReviewError("");
      const gameId = tiEl.children[0].href.split("=").at(-1);
      const roundEl = document.getElementById("round");
      if (!roundEl) {
        setTimeout(loadReviewData, 100);
        return;
      }
      const roundStr = roundEl.innerHTML;
      const round = parseRound(roundStr);
      console.log(
        "[Reviewer] Loading review data for game:",
        gameId,
        "round:",
        round,
      );
      let loadedCount = 0;

      for (let is = 0; is <= 3; is++) {
        if (w.__reviews_seats[is]) continue;
        w.__reviews_seats[is] = 1;

        fetch(`https://tc-api.pesiu.org/review/?id=${gameId}&seat=${is}`)
          .then((r) => r.json())
          .then((r) => {
            if (r.code) {
              w.__reviews_seats[is] = 0;
              console.error(
                `[Reviewer] Error fetching review data for seat ${is}:`,
                r.message,
              );
              setReviewError(
                `评测接口错误：seat ${is} - ${r.message || "未知错误"}`,
              );
              return;
            }
            (Array.isArray(r) ? r : r.data).forEach((d) => {
              if (d.ri) w.__reviews[`${d.rr}-${d.ri}`] = d;
            });
            w.__reviews_seats[is] = 2;
            console.log(`[Reviewer] Download finish for seat ${is}`);
            loadedCount++;
            if (loadedCount === 4) {
              fillEmptyValues();
              show_cands();
            } else {
              show_cands();
            }
          })
          .catch((e) => {
            w.__reviews_seats[is] = 0;
            console.error(`[Reviewer] Download failed for seat ${is}:`, e);
            setReviewError(`评测接口连接失败：seat ${is}`);
          });
      }

      show_cands();
    };

    const fillEmptyValues = () => {
      for (const key in w.__reviews) {
        w.__reviews_filled[key] = w.__reviews[key];
      }
      const byRound = {};
      for (const key in w.__reviews) {
        const [rr, ri] = key.split("-").map(Number);
        if (!byRound[rr]) {
          byRound[rr] = {};
        }
        byRound[rr][ri] = w.__reviews[key];
      }
      for (const round in byRound) {
        const steps = byRound[round];
        const riValues = Object.keys(steps)
          .map(Number)
          .sort((a, b) => a - b);
        const maxRi = Math.max(...riValues);
        let lastValue = null;
        for (let ri = Math.min(...riValues); ri <= maxRi; ri++) {
          if (steps[ri]) {
            lastValue = steps[ri];
          } else if (lastValue) {
            w.__reviews_filled[`${round}-${ri}`] = lastValue;
            lastValue = null;
          }
        }
      }

      console.log("[Reviewer] Empty values filled");
    };

    createUI();
    loadReviewData();

    setTimeout(() => {
      if (!tzInstance) {
        setReviewError("未捕获牌局实例，尝试补建实例");
        if (!tzInstance) {
          const ok =
            typeof w.TZ === "function" &&
            (() => {
              try {
                const sp = new URLSearchParams(w.location.search);
                const id = sp.get("id");
                const v = sp.get("v");
                const cy = sp.get("cy");
                const tz = new w.TZ();
                tzInstance = tz;
                clearReviewError();
                console.log("[Reviewer] Late force-created TZ instance");
                if (typeof tz.adapt === "function") tz.adapt();
                if (id && typeof tz.fetch === "function") {
                  tz.fetch(id, 0, v, cy);
                }
                return true;
              } catch (e) {
                console.error("[Reviewer] Late force-create TZ failed:", e);
                return false;
              }
            })();
          if (!ok) {
            setReviewError("未捕获牌局实例，可能浏览器或脚本管理器限制了注入");
          }
        }
      }
    }, 1000);
  };
  const routeState = {
    lastHref: "",
    startedRecordHref: "",
    startedTechHref: "",
    startedHistoryHref: "",
    startedUserGameHref: "",
  };

  const runOnRoute = () => {
    const href = w.location.href;
    if (routeState.lastHref === href) return;
    routeState.lastHref = href;

    const routeFlags = {
      record: isRecordPage(),
      tech: isTechPage(),
      history: isHistoryPage(),
      userGame: isUserGamePage(),
    };
    debugLog("Route changed:", {
      href,
      pathname: w.location.pathname,
      routeFlags,
    });

    logCurrentCookie();

    if (routeFlags.record) {
      if (routeState.startedRecordHref === href) return;
      routeState.startedRecordHref = href;
      debugLog("Initializing record page branch");
      interceptTZ();
      setTimeout(initReviewer, 500);
      return;
    }

    if (routeFlags.tech) {
      if (routeState.startedTechHref === href) return;
      routeState.startedTechHref = href;
      debugLog("Initializing tech page branch");
      setTimeout(initTechZumgze, 300);
      return;
    }

    if (routeFlags.history) {
      if (routeState.startedHistoryHref === href) return;
      routeState.startedHistoryHref = href;
      debugLog("Initializing history page branch");
      setTimeout(initHistoryVisit, 300);
      return;
    }

    if (routeFlags.userGame) {
      if (routeState.startedUserGameHref === href) return;
      routeState.startedUserGameHref = href;
      debugLog("Initializing user game page branch");
      setTimeout(initHistoryVisit, 300);
    }
  };

  const installRouteWatcher = () => {
    debugLog("Installing route watcher hooks");
    const notify = () => setTimeout(runOnRoute, 0);

    w.addEventListener("popstate", notify);
    w.addEventListener("hashchange", notify);
    w.addEventListener("urlchange", notify);

    const historyObj = w.history;
    if (historyObj && !historyObj.__reviewer_route_hooked) {
      const originalPushState = historyObj.pushState;
      const originalReplaceState = historyObj.replaceState;

      historyObj.pushState = function (...args) {
        const result = originalPushState.apply(this, args);
        notify();
        return result;
      };

      historyObj.replaceState = function (...args) {
        const result = originalReplaceState.apply(this, args);
        notify();
        return result;
      };

      historyObj.__reviewer_route_hooked = true;
    }

    debugLog("Route watcher installed", {
      hasHistory: !!historyObj,
      hooked: !!historyObj?.__reviewer_route_hooked,
    });
  };

  installRouteWatcher();
  debugLog("Bootstrapping reviewer script", {
    href: w.location.href,
    readyState: document.readyState,
    debugEnabled,
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runOnRoute, { once: true });
  } else {
    runOnRoute();
  }
})();
