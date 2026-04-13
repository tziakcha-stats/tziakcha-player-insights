import { beforeEach, describe, expect, it, vi } from "vitest";

function flush() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function buildTechDom() {
  document.body.innerHTML = `
    <div class="container">
      <div class="card"><div class="card-body" id="brf">用户卡片</div></div>
      <div id="opt">查找区</div>
      <div id="view-wrap"><h4>查看</h4><div>遗留查看区域</div></div>
      <div id="result">结果弹窗</div>
      <div id="rst_alt">重置弹窗</div>
      <div id="cln_alt">清空弹窗</div>
      <div id="danger-wrap">
        <h4>危险操作</h4>
        <button id="rst">重置</button>
        <button id="cln">清空</button>
        <p><small>【重置】操作可清除数据；【清空】操作会删除更多数据。</small></p>
        <small id="reset">上次重置时间：2026-01-01</small>
      </div>
      <ul class="nav nav-tabs" id="top-tabs" style="margin:2em 0;">
        <li class="nav-item"><a class="nav-link" href="/user/">主页</a></li>
        <li class="nav-item"><a class="nav-link active" href="javascript:void(0)">数据</a></li>
        <li class="nav-item"><a class="nav-link" href="/user/game/">对局</a></li>
        <li class="nav-item"><a class="nav-link" href="/user/puzzle/">题库</a></li>
      </ul>
      <h4 style="margin-top:2em;">ELO</h4>
      <table id="elo"><tbody><tr><td class="text-end">0</td></tr></tbody></table>
      <h4 style="margin-top:2em;">基本数据</h4>
      <table id="basic"><tbody><tr><td class="text-end">0</td></tr></tbody></table>
      <h4 style="margin-top:2em;">和牌相关</h4>
      <table id="win"><tbody><tr><td class="text-end">0</td></tr></tbody></table>
      <div><small class="fw-light">说明A</small></div>
      <h4 style="margin-top:2em;">巡数相关</h4>
      <table id="cycle"><tbody><tr><td class="text-end">0</td></tr></tbody></table>
      <div><small class="fw-light">说明B</small></div>
      <h4 style="margin-top:2em;">番数相关</h4>
      <table id="pts"><tbody><tr><td class="text-end">0</td></tr></tbody></table>
      <div><small class="fw-light">说明C</small></div>
    </div>
  `;
}

describe("tech analysis tab and style compare ui", () => {
  beforeEach(() => {
    vi.resetModules();
    window.history.replaceState(
      {},
      "",
      "https://example.com/user/tech/?id=SELF01",
    );
    buildTechDom();
  });

  it("adds analysis tab, keeps card body visible, and toggles back to data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/_qry/user/tech/")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              fan: { c0: 100, d0: 0, c71: 12 },
              basic: {},
              cycle: {},
              point: {},
            }),
          } as Response;
        }
        throw new Error("unexpected fetch");
      }),
    );

    const { initTechFeature } = await import("../../src/features/tech");
    initTechFeature(window.location.href);
    await flush();
    await flush();

    const analysisTab = Array.from(
      document.querySelectorAll("#top-tabs .nav-link"),
    ).find((item) => item.textContent?.trim() === "分析") as HTMLAnchorElement;
    expect(analysisTab).toBeTruthy();

    const beforeHref = window.location.href;
    analysisTab.click();

    const panel = document.getElementById("reviewer-tech-analysis-panel");
    expect(panel).toBeTruthy();
    expect(panel?.style.display).not.toBe("none");
    expect(window.location.href).toBe(beforeHref);

    const cardBody = document.getElementById("brf") as HTMLElement;
    expect(cardBody.style.display).toBe("");

    const dataTab = Array.from(
      document.querySelectorAll("#top-tabs .nav-link"),
    ).find((item) => item.textContent?.trim() === "数据") as HTMLAnchorElement;
    dataTab.click();

    expect(panel?.style.display).toBe("none");
    expect(
      (document.getElementById("basic") as HTMLElement).style.display,
    ).toBe("");
  });

  it("renders grouped fan tabs, top-diff tabs, table headers, and overall std ci", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/_qry/user/tech/?id=SELF01")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              fan: { c0: 100, d0: 0, c71: 30, c61: 20, c29: 15, c8: 5 },
              basic: {
                claim: 20,
                draw: 10,
                shoot: 10,
                splash: 10,
                watch: 10,
                tie: 10,
                lose: 2,
                fault: 1,
              },
              cycle: {},
              point: {},
            }),
          } as Response;
        }
        if (url.includes("/_qry/user/tech/?id=U2")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              fan: { c0: 80, d0: 0, c71: 5, c61: 30, c29: 3, c8: 9 },
              basic: {
                claim: 10,
                draw: 10,
                shoot: 20,
                splash: 10,
                watch: 10,
                tie: 20,
                lose: 1,
                fault: 0,
              },
              cycle: {},
              point: {},
            }),
          } as Response;
        }
        if (url.includes("/_qry/match/")) {
          return {
            ok: true,
            status: 200,
            json: async () => [
              { n: "当前玩家", i: "SELF01" },
              { n: "对手B", i: "U2" },
            ],
          } as Response;
        }
        throw new Error("unexpected fetch");
      }),
    );

    const { initTechFeature } = await import("../../src/features/tech");
    initTechFeature(window.location.href);
    await flush();
    await flush();

    expect((document.getElementById("opt") as HTMLElement).style.display).toBe(
      "none",
    );
    expect(
      (document.getElementById("rst_alt") as HTMLElement).style.display,
    ).toBe("none");
    expect(
      (document.getElementById("cln_alt") as HTMLElement).style.display,
    ).toBe("none");
    expect(
      (document.getElementById("danger-wrap") as HTMLElement).style.display,
    ).toBe("none");

    const analysisTab = Array.from(
      document.querySelectorAll("#top-tabs .nav-link"),
    ).find((item) => item.textContent?.trim() === "分析") as HTMLAnchorElement;
    analysisTab.click();

    const keywordA = document.getElementById(
      "reviewer-style-player-a-keyword",
    ) as HTMLInputElement;
    expect(
      (document.getElementById("reviewer-style-player-a-name") as HTMLElement)
        .textContent,
    ).toContain("当前玩家");

    const keywordB = document.getElementById(
      "reviewer-style-player-b-keyword",
    ) as HTMLInputElement;
    keywordB.value = "对手";
    keywordB.dispatchEvent(new Event("input"));
    await flush();
    const selectB = document.getElementById(
      "reviewer-style-player-b-select",
    ) as HTMLSelectElement;
    selectB.innerHTML =
      '<option value="">--请选择--</option><option value="U2" data-name="对手B">对手B</option>';
    selectB.selectedIndex = 1;
    selectB.dispatchEvent(new Event("change"));

    const compareBtn = document.getElementById(
      "reviewer-style-compare-run",
    ) as HTMLButtonElement;
    compareBtn.click();
    await flush();
    await flush();

    expect(document.body.textContent).toContain("相似度");
    expect(document.body.textContent).toContain("95% 置信区间");

    const fanGroupTabs = document.querySelectorAll(
      "#reviewer-style-fan-group-tabs .nav-link",
    );
    expect(fanGroupTabs.length).toBe(4);

    const rareFilterBtn = document.getElementById(
      "reviewer-style-fan-filter-rare",
    ) as HTMLButtonElement;
    const largeDiffBtn = document.getElementById(
      "reviewer-style-fan-filter-large-diff",
    ) as HTMLButtonElement;
    const sortBtn = document.getElementById(
      "reviewer-style-fan-sort-mode",
    ) as HTMLButtonElement;
    expect(rareFilterBtn.textContent).toContain("不显示稀有番种");
    expect(largeDiffBtn.textContent).toContain("仅显示大差异番种");
    expect(sortBtn.textContent).toContain("排序：差值");
    expect(rareFilterBtn.classList.contains("is-active")).toBe(true);
    expect(largeDiffBtn.classList.contains("is-active")).toBe(false);

    expect(document.body.textContent).toContain("小番(<=2)");
    expect(document.body.textContent).toContain("主番(4~32)");
    expect(document.body.textContent).toContain("大牌(>=48)");

    const winHead = document
      .querySelector("#reviewer-style-win-tbody")
      ?.parentElement?.querySelector("thead");
    const cycleHead = document
      .querySelector("#reviewer-style-cycle-tbody")
      ?.parentElement?.querySelector("thead");
    const pointHead = document
      .querySelector("#reviewer-style-point-tbody")
      ?.parentElement?.querySelector("thead");
    expect(winHead).toBeTruthy();
    expect(cycleHead).toBeTruthy();
    expect(pointHead).toBeTruthy();

    const highTab = document.querySelector(
      '#reviewer-style-fan-group-tabs .nav-link[data-fan-group="high"]',
    ) as HTMLAnchorElement;
    highTab.click();
    await flush();

    const topTbody = document.getElementById(
      "reviewer-style-fan-diff-tbody",
    ) as HTMLElement;
    expect(
      topTbody.innerHTML.includes("reviewer-style-bar-wrap") ||
        topTbody.textContent?.includes("无可比较番种"),
    ).toBe(true);

    const viewWrap = document.getElementById("view-wrap") as HTMLElement;
    expect(viewWrap.style.display).toBe("none");
    expect(viewWrap.innerHTML).toBe("");

    const container = document.querySelector(".container") as HTMLElement;
    const noteParents = Array.from(
      container.querySelectorAll("div > small.fw-light"),
    )
      .map((small) => small.parentElement as HTMLElement)
      .filter(Boolean);
    const lastNode = container.lastElementChild as HTMLElement;
    expect(noteParents.length).toBeGreaterThan(0);
    expect(noteParents[noteParents.length - 1]).toBe(lastNode);

    const topHeadA = document
      .querySelector("#reviewer-style-fan-diff-tbody")
      ?.parentElement?.querySelector(".reviewer-style-head-a");
    const topHeadB = document
      .querySelector("#reviewer-style-fan-diff-tbody")
      ?.parentElement?.querySelector(".reviewer-style-head-b");
    expect(topHeadA?.textContent).toContain("当前玩家");
    expect(topHeadB?.textContent).toContain("对手B");
  });

  it("supports rare/large-diff filters and diff/abs sorting for fan rows", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/_qry/user/tech/?id=SELF01")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              fan: {
                c0: 1000,
                d0: 0,
                c29: 30,
                c61: 10,
                c71: 20,
                c50: 8,
                c49: 4,
              },
              basic: {},
              cycle: {},
              point: {},
            }),
          } as Response;
        }
        if (url.includes("/_qry/user/tech/?id=U2")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              fan: {
                c0: 1000,
                d0: 0,
                c29: 10,
                c61: 0,
                c71: 50,
                c50: 2,
                c49: 3,
              },
              basic: {},
              cycle: {},
              point: {},
            }),
          } as Response;
        }
        if (url.includes("/_qry/match/")) {
          return {
            ok: true,
            status: 200,
            json: async () => [
              { n: "当前玩家", i: "SELF01" },
              { n: "对手B", i: "U2" },
            ],
          } as Response;
        }
        throw new Error("unexpected fetch");
      }),
    );

    const { initTechFeature } = await import("../../src/features/tech");
    initTechFeature(window.location.href);
    await flush();
    await flush();

    const analysisTab = Array.from(
      document.querySelectorAll("#top-tabs .nav-link"),
    ).find((item) => item.textContent?.trim() === "分析") as HTMLAnchorElement;
    analysisTab.click();

    const keywordB = document.getElementById(
      "reviewer-style-player-b-keyword",
    ) as HTMLInputElement;
    keywordB.value = "对手";
    keywordB.dispatchEvent(new Event("input"));
    await flush();

    const selectB = document.getElementById(
      "reviewer-style-player-b-select",
    ) as HTMLSelectElement;
    selectB.innerHTML =
      '<option value="">--请选择--</option><option value="U2" data-name="对手B">对手B</option>';
    selectB.selectedIndex = 1;
    selectB.dispatchEvent(new Event("change"));

    const compareBtn = document.getElementById(
      "reviewer-style-compare-run",
    ) as HTMLButtonElement;
    compareBtn.click();
    await flush();
    await flush();

    const topTbody = document.getElementById(
      "reviewer-style-fan-diff-tbody",
    ) as HTMLElement;

    const rowFanNames = () =>
      Array.from(topTbody.querySelectorAll("tr > td:first-child")).map((cell) =>
        (cell.textContent || "").trim(),
      );

    // Default: rare fan hidden and sort by signed diff descending.
    expect(rowFanNames()).not.toContain("抢杠和");
    expect(rowFanNames()[0]).toBe("清龙");

    const largeDiffBtn = document.getElementById(
      "reviewer-style-fan-filter-large-diff",
    ) as HTMLButtonElement;
    largeDiffBtn.click();
    await flush();

    const afterLargeDiff = rowFanNames();
    expect(afterLargeDiff).toContain("清龙");
    expect(afterLargeDiff).toContain("一般高");
    expect(afterLargeDiff).not.toContain("箭刻");
    expect(afterLargeDiff).not.toContain("碰碰和");

    const sortBtn = document.getElementById(
      "reviewer-style-fan-sort-mode",
    ) as HTMLButtonElement;
    sortBtn.click();
    await flush();

    const afterAbsSort = rowFanNames();
    expect(afterAbsSort[0]).toBe("一般高");

    const rareBtn = document.getElementById(
      "reviewer-style-fan-filter-rare",
    ) as HTMLButtonElement;
    rareBtn.click();
    await flush();

    expect(rowFanNames()).toContain("抢杠和");
  });
});
