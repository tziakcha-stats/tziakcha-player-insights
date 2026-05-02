import { beforeEach, describe, expect, it } from "vitest";

import {
  showCandidates,
  ReviewerRenderRuntime,
} from "../../src/features/record/reviewer/render";
import { ReviewerPoolSnapshotItem } from "../../src/features/record/reviewer/types";
import {
  resetReviewStores,
  getReviews,
  setTZInstance,
} from "../../src/features/record/reviewer/state";

function createTileCodes(): string[] {
  const groups = [
    ["W", 9],
    ["T", 9],
    ["B", 9],
    ["F", 4],
    ["J", 3],
    ["H", 8],
  ] as const;

  const codes: string[] = [];
  groups.forEach(([prefix, count]) => {
    for (let number = 1; number <= count; number += 1) {
      for (let copy = 0; copy < 4; copy += 1) {
        codes.push(`${number}${prefix}`);
      }
    }
  });
  return codes;
}

function createRuntime(): ReviewerRenderRuntime {
  let lastStep: number | null = null;
  let lastPoolSnapshot: ReviewerPoolSnapshotItem[] | null = null;
  return {
    wind: ["东", "南", "西", "北"],
    tile: createTileCodes(),
    options: {
      highlightFirstTile: true,
      showWeightBars: true,
    },
    getLastStep: () => lastStep,
    setLastStep: (value: number) => {
      lastStep = value;
    },
    getLastPoolSnapshot: () => lastPoolSnapshot,
    setLastPoolSnapshot: (value: ReviewerPoolSnapshotItem[]) => {
      lastPoolSnapshot = value;
    },
  };
}

function renderBaseDom(): void {
  document.body.innerHTML = `
    <div id="round">1</div>
    <div id="review-log"></div>
    <div id="review"></div>
    <div class="table">
      <div class="hand">
        <div class="tl" data-val="0"></div>
        <div class="tl" data-val="4"></div>
        <div class="tl" data-val="8"></div>
      </div>
      <div class="river">
        <div class="tl" data-val="20"></div>
        <div class="tl" data-val="24"></div>
      </div>
    </div>
  `;
}

describe("reviewer render", () => {
  beforeEach(() => {
    renderBaseDom();
    resetReviewStores();
    window.__review_error = "";
    setTZInstance({
      stp: 18,
      stat: [{ k: 0 }],
    });
  });

  it("highlights the latest river tile when the top candidate is a call", () => {
    getReviews()["0-0"] = {
      rr: 0,
      ri: 0,
      extra: {
        candidates: [
          [1, "Peng W7"],
          [0.7, "Pass"],
        ],
      },
    };

    showCandidates(createRuntime());

    const riverTiles = document.querySelectorAll(".river .tl");
    expect(riverTiles[1]?.classList.contains("highlight-first-tile")).toBe(
      true,
    );
    expect(document.querySelector(".hand .tl.highlight-first-tile")).toBeNull();
  });

  it("highlights the latest tile when the river is rendered inside a show container", () => {
    document.body.innerHTML = `
      <div id="round">1</div>
      <div id="review-log"></div>
      <div id="review"></div>
      <div class="hand">
        <div class="tl" data-val="0"></div>
        <div class="tl" data-val="4"></div>
      </div>
      <div class="show">
        <div class="tl" data-val="20"></div>
        <div class="tl" data-val="24"></div>
      </div>
    `;

    getReviews()["0-0"] = {
      rr: 0,
      ri: 0,
      extra: {
        candidates: [
          [1, "Chi 789s"],
          [0.3, "Pass"],
        ],
      },
    };

    showCandidates(createRuntime());

    const showTiles = document.querySelectorAll(".show .tl");
    expect(showTiles[1]?.classList.contains("highlight-first-tile")).toBe(true);
  });

  it("prefers visible pool tiles over hidden result tiles when highlighting a call", () => {
    document.body.innerHTML = `
      <div id="round">1</div>
      <div id="review-log"></div>
      <div id="review"></div>
      <div class="hand">
        <div class="tl" data-val="0"></div>
        <div class="tl" data-val="4"></div>
      </div>
      <div class="pool anch00 rot180">
        <div class="tl" data-val="119" style="left: 0px; top: 0px;"></div>
        <div class="tl" data-val="53" style="left: 44px; top: 0px;"></div>
        <div class="tl dd" data-val="47" style="left: 88px; top: 0px;"></div>
      </div>
      <div id="res" style="display:none;">
        <div id="res-hd">
          <div class="tl" data-val="50"></div>
          <div class="tl" data-val="57"></div>
        </div>
      </div>
    `;

    getReviews()["0-0"] = {
      rr: 0,
      ri: 0,
      extra: {
        candidates: [
          [1, "Peng W7"],
          [0.3, "Pass"],
        ],
      },
    };

    showCandidates(createRuntime());

    const poolTiles = document.querySelectorAll(".pool .tl");
    expect(poolTiles[2]?.classList.contains("highlight-first-tile")).toBe(true);
    expect(document.querySelector("#res .highlight-first-tile")).toBeNull();
  });

  it("highlights the tile from the pool that changed between steps", () => {
    const runtime = createRuntime();
    document.body.innerHTML = `
      <div id="round">1</div>
      <div id="review-log"></div>
      <div id="review"></div>
      <div class="hand">
        <div class="tl" data-val="0"></div>
        <div class="tl" data-val="4"></div>
      </div>
      <div class="pool anch00 rot0">
        <div class="tl" data-val="10"></div>
      </div>
      <div class="pool anch00 rot270">
        <div class="tl" data-val="20"></div>
      </div>
      <div class="pool anch00 rot180">
        <div class="tl" data-val="30"></div>
      </div>
      <div class="pool anch00 rot90">
        <div class="tl" data-val="40"></div>
      </div>
    `;

    getReviews()["0-0"] = {
      rr: 0,
      ri: 0,
      extra: {
        candidates: [[1, "Pass"]],
      },
    };

    showCandidates(runtime);

    document.body.innerHTML = `
      <div id="round">1</div>
      <div id="review-log"></div>
      <div id="review"></div>
      <div class="hand">
        <div class="tl" data-val="0"></div>
        <div class="tl" data-val="4"></div>
      </div>
      <div class="pool anch00 rot0">
        <div class="tl" data-val="10"></div>
      </div>
      <div class="pool anch00 rot270">
        <div class="tl" data-val="20"></div>
        <div class="tl" data-val="24"></div>
      </div>
      <div class="pool anch00 rot180">
        <div class="tl" data-val="30"></div>
      </div>
      <div class="pool anch00 rot90">
        <div class="tl" data-val="40"></div>
      </div>
    `;

    getReviews()["0-0"] = {
      rr: 0,
      ri: 0,
      extra: {
        candidates: [
          [1, "Chi 789s"],
          [0.5, "Pass"],
        ],
      },
    };

    showCandidates(runtime);

    const pools = document.querySelectorAll(".pool");
    expect(
      pools[1]
        ?.querySelectorAll(".tl")[1]
        ?.classList.contains("highlight-first-tile"),
    ).toBe(true);
    expect(
      pools[0]?.querySelector(".highlight-first-tile") ??
        pools[2]?.querySelector(".highlight-first-tile") ??
        pools[3]?.querySelector(".highlight-first-tile"),
    ).toBeNull();
  });

  it("computes weight bars using only Play candidates when Play is available", () => {
    getReviews()["0-0"] = {
      rr: 0,
      ri: 0,
      extra: {
        candidates: [
          [8, "Pass"],
          [0, "Play W1"],
          [-4, "Play W2"],
        ],
      },
    };

    showCandidates(createRuntime());

    const handTiles = document.querySelectorAll(".hand .tl");
    const firstBar = handTiles[0]?.querySelector(
      ".tile-weight-bar",
    ) as HTMLElement | null;
    const secondBar = handTiles[1]?.querySelector(
      ".tile-weight-bar",
    ) as HTMLElement | null;
    const thirdBar = handTiles[2]?.querySelector(
      ".tile-weight-bar",
    ) as HTMLElement | null;

    expect(document.getElementById("review")?.innerHTML).toContain("Pass");
    expect(firstBar).not.toBeNull();
    expect(secondBar).not.toBeNull();
    expect(thirdBar).toBeNull();
    expect(Number.parseFloat(firstBar?.style.height ?? "0")).toBeGreaterThan(
      40,
    );
    expect(Number.parseFloat(secondBar?.style.height ?? "0")).toBeGreaterThan(
      5,
    );
  });

  it("keeps non-top Play bars visible with smoothed heights", () => {
    getReviews()["0-0"] = {
      rr: 0,
      ri: 0,
      extra: {
        candidates: [
          [0, "Play W1"],
          [-4, "Play W2"],
        ],
      },
    };

    showCandidates(createRuntime());

    const bars = Array.from(
      document.querySelectorAll(".tile-weight-bar"),
    ) as HTMLElement[];
    expect(bars).toHaveLength(2);
    expect(Number.parseFloat(bars[0]?.style.height ?? "0")).toBeLessThanOrEqual(
      50,
    );
    expect(Number.parseFloat(bars[1]?.style.height ?? "0")).toBeGreaterThan(5);
  });
});
