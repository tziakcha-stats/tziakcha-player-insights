import { afterEach, describe, expect, it, vi } from "vitest";
import {
  installRoundToggleButtons,
  installRoundWinDisplayModes,
  upsertLoadingRows,
  upsertMetricsMessageRows,
} from "../../src/features/game/ui-render";
import { RoundOutcome } from "../../src/features/game/types";

type MemoryStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  clear: () => void;
};

function createMemoryStorage(): MemoryStorage {
  const store = new Map<string, string>();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) || null : null;
    },
    setItem(key, value) {
      store.set(key, value);
    },
    clear() {
      store.clear();
    },
  };
}

const memoryStorage = createMemoryStorage();

Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: memoryStorage,
});

function setupScoreTable(): HTMLTableRowElement {
  document.body.innerHTML = `
    <table class="table">
      <tbody>
        <tr id="standard-score-row">
          <th>标准分</th>
          <td colspan="2">A</td>
          <td colspan="2">B</td>
          <td colspan="2">C</td>
          <td colspan="2">D</td>
        </tr>
      </tbody>
    </table>
  `;

  return document.getElementById("standard-score-row") as HTMLTableRowElement;
}

function setupRoundTable(): HTMLTableElement {
  document.body.innerHTML = `
    <table class="table" id="round-table">
      <tbody>
        <tr>
          <th class="bg-secondary text-light">选手姓名</th>
          <td colspan="8" class="bg-secondary text-light">玩家信息</td>
        </tr>
        <tr>
          <th>开局座位</th>
          <td colspan="8">东南西北</td>
        </tr>
        <tr>
          <th>每圈座位</th>
          <td colspan="8">东南西北</td>
        </tr>
        <tr>
          <th>盘序</th>
          <th>结果</th>
          <th>备注</th>
        </tr>
        <tr name="rdtr" id="round-row-1">
          <td>1</td>
          <td>第1局</td>
          <td>Ron</td>
        </tr>
        <tr name="rdtr" id="round-row-2">
          <td>2</td>
          <td>第2局</td>
          <td>Draw</td>
        </tr>
        <tr name="rdtr" id="round-row-3">
          <td>3</td>
          <td>第3局</td>
          <td>Tsumo</td>
        </tr>
        <tr id="summary-row">
          <th class="bg-secondary text-light">合计</th>
          <td colspan="2" class="bg-secondary text-light">100</td>
        </tr>
        <tr id="rank-row">
          <th class="bg-secondary text-light">名次</th>
          <td colspan="2" class="bg-secondary text-light">1</td>
        </tr>
        <tr id="standard-row">
          <th class="bg-secondary text-light">标准分</th>
          <td colspan="2" class="bg-secondary text-light">45.0</td>
        </tr>
      </tbody>
    </table>
  `;

  return document.getElementById("round-table") as HTMLTableElement;
}

function setupSparseRoundTable(): HTMLTableElement {
  document.body.innerHTML = `
    <table class="table" id="round-table">
      <tbody>
        <tr>
          <th class="bg-secondary text-light">选手姓名</th>
          <td colspan="8" class="bg-secondary text-light">玩家信息</td>
        </tr>
        <tr>
          <th>开局座位</th>
          <td colspan="8">东南西北</td>
        </tr>
        <tr>
          <th>每圈座位</th>
          <td colspan="8">东南西北</td>
        </tr>
        <tr>
          <th>盘序</th>
          <th>结果</th>
          <th>备注</th>
        </tr>
        <tr name="rdtr" id="round-row-1">
          <td>1</td>
          <td>第1局</td>
          <td>Ron</td>
        </tr>
        <tr name="rdtr" id="round-row-2"></tr>
        <tr name="rdtr" id="round-row-3"></tr>
        <tr id="summary-row">
          <th class="bg-secondary text-light">合计</th>
          <td colspan="2" class="bg-secondary text-light">100</td>
        </tr>
        <tr id="rank-row">
          <th class="bg-secondary text-light">名次</th>
          <td colspan="2" class="bg-secondary text-light">1</td>
        </tr>
        <tr id="standard-row">
          <th class="bg-secondary text-light">标准分</th>
          <td colspan="2" class="bg-secondary text-light">45.0</td>
        </tr>
      </tbody>
    </table>
  `;

  return document.getElementById("round-table") as HTMLTableElement;
}

function setupScoreRoundTable(
  configText = "配置：16盘 | 8番 (8) | 错和 鸣牌 ✓ -30/+10 | 随机座位",
): HTMLTableElement {
  document.body.innerHTML = `
    <h6 id="cfg">${configText}</h6>
    <table class="table" id="round-table">
      <tbody>
        <tr>
          <th class="bg-secondary text-light">选手姓名</th>
          <td class="bg-secondary text-light" colspan="2" name="nm">A</td>
          <td class="bg-secondary text-light" colspan="2" name="nm">B</td>
          <td class="bg-secondary text-light" colspan="2" name="nm">C</td>
          <td class="bg-secondary text-light" colspan="2" name="nm">D</td>
        </tr>
        <tr>
          <th>开局座位</th>
          <td colspan="2">东</td>
          <td colspan="2">南</td>
          <td colspan="2">西</td>
          <td colspan="2">北</td>
        </tr>
        <tr>
          <th>每圈座位</th>
          <td colspan="2">东南西北</td>
          <td colspan="2">东南西北</td>
          <td colspan="2">东南西北</td>
          <td colspan="2">东南西北</td>
        </tr>
        <tr>
          <th class="bg-secondary text-light">盘序</th>
          <td class="bg-secondary text-light">得分</td>
          <td class="bg-secondary text-light">累计</td>
          <td class="bg-secondary text-light">得分</td>
          <td class="bg-secondary text-light">累计</td>
          <td class="bg-secondary text-light">得分</td>
          <td class="bg-secondary text-light">累计</td>
          <td class="bg-secondary text-light">得分</td>
          <td class="bg-secondary text-light">累计</td>
        </tr>
        <tr name="rdtr" id="round-row-1">
          <td>1</td>
          <td>-8</td>
          <td>92</td>
          <td>-16</td>
          <td>84</td>
          <td>-8</td>
          <td>92</td>
          <td>32</td>
          <td>132</td>
        </tr>
        <tr name="rdtr" id="round-row-2">
          <td>2</td>
          <td>-16</td>
          <td>76</td>
          <td>-16</td>
          <td>68</td>
          <td>-16</td>
          <td>76</td>
          <td>48</td>
          <td>180</td>
        </tr>
        <tr name="rdtr" id="round-row-3">
          <td>3</td>
          <td class="n">10</td>
          <td>86</td>
          <td class="n">10</td>
          <td>78</td>
          <td class="f">-30</td>
          <td>46</td>
          <td class="n">10</td>
          <td>190</td>
        </tr>
        <tr name="rdtr" id="round-row-4">
          <td>4</td>
          <td class="f">-38</td>
          <td>48</td>
          <td class="c">-10</td>
          <td>68</td>
          <td class="n">2</td>
          <td>48</td>
          <td class="w">46</td>
          <td>236</td>
        </tr>
        <tr name="rdtr" id="round-row-5">
          <td>5</td>
          <td class="f">-50</td>
          <td>-2</td>
          <td class="n">2</td>
          <td>70</td>
          <td class="n">2</td>
          <td>50</td>
          <td class="w">46</td>
          <td>282</td>
        </tr>
        <tr id="summary-row">
          <th class="bg-secondary text-light">合计</th>
          <td class="bg-secondary text-light" colspan="2">100</td>
          <td class="bg-secondary text-light" colspan="2">100</td>
          <td class="bg-secondary text-light" colspan="2">100</td>
          <td class="bg-secondary text-light" colspan="2">100</td>
        </tr>
        <tr id="rank-row">
          <th class="bg-secondary text-light">名次</th>
          <td class="bg-secondary text-light" colspan="2">1</td>
          <td class="bg-secondary text-light" colspan="2">2</td>
          <td class="bg-secondary text-light" colspan="2">3</td>
          <td class="bg-secondary text-light" colspan="2">4</td>
        </tr>
        <tr id="standard-row">
          <th class="bg-secondary text-light">标准分</th>
          <td class="bg-secondary text-light" colspan="2">45.0</td>
          <td class="bg-secondary text-light" colspan="2">15.0</td>
          <td class="bg-secondary text-light" colspan="2">-5.0</td>
          <td class="bg-secondary text-light" colspan="2">-55.0</td>
        </tr>
      </tbody>
    </table>
  `;

  return document.getElementById("round-table") as HTMLTableElement;
}

function setupRealFixtureCompactScoreTable(): HTMLTableElement {
  document.body.innerHTML = `
    <h6 id="cfg">配置：16盘 | 8番 (8) | 错和 鸣牌 ✕ -40/+0 | 随机座位</h6>
    <table class="table" id="round-table">
      <tbody>
        <tr>
          <th class="bg-secondary text-light" style="width:16%;">选手姓名</th>
          <td class="bg-secondary text-light" colspan="2" name="nm" style="width:21%;">双色清龙</td>
          <td class="bg-secondary text-light" colspan="2" name="nm" style="width:21%;">暮桥疏雨</td>
          <td class="bg-secondary text-light" colspan="2" name="nm" style="width:21%;">★ 海伯利安</td>
          <td class="bg-secondary text-light" colspan="2" name="nm" style="width:21%;">截和天地人和</td>
        </tr>
        <tr>
          <th>开局座位</th>
          <td colspan="2">东</td>
          <td colspan="2">南</td>
          <td colspan="2">西</td>
          <td colspan="2">北</td>
        </tr>
        <tr>
          <th>每圈座位</th>
          <td colspan="2">东-南-北-西</td>
          <td colspan="2">南-东-西-北</td>
          <td colspan="2">西-北-东-南</td>
          <td colspan="2">北-西-南-东</td>
        </tr>
        <tr>
          <th class="bg-secondary text-light">盘序</th>
          <td class="bg-secondary text-light">得分</td>
          <td class="bg-secondary text-light">累计</td>
          <td class="bg-secondary text-light">得分</td>
          <td class="bg-secondary text-light">累计</td>
          <td class="bg-secondary text-light">得分</td>
          <td class="bg-secondary text-light">累计</td>
          <td class="bg-secondary text-light">得分</td>
          <td class="bg-secondary text-light">累计</td>
        </tr>
        <tr name="rdtr" id="tmp-round-row">
          <td>1</td>
          <td class="n">-8</td>
          <td>-120</td>
          <td class="n">-8</td>
          <td>-100</td>
          <td class="w">64</td>
          <td>80</td>
          <td class="c">-48</td>
          <td>140</td>
        </tr>
      </tbody>
    </table>
  `;

  return document.getElementById("round-table") as HTMLTableElement;
}

function buildRounds(): RoundOutcome[] {
  return [
    {
      roundNo: 1,
      winners: [
        {
          playerName: "A",
          totalFan: 8,
          fanItems: [
            {
              fanIndex: 8,
              fanName: "平和",
              count: 1,
              unitFan: 1,
              totalFan: 1,
            },
            {
              fanIndex: 71,
              fanName: "清一色",
              count: 3,
              unitFan: 2,
              totalFan: 6,
            },
          ],
        },
      ],
      discarderNames: ["B"],
      selfDraw: false,
    },
    {
      roundNo: 2,
      winners: [],
      discarderNames: [],
      selfDraw: false,
    },
    {
      roundNo: 3,
      winners: [
        {
          playerName: "C",
          totalFan: 1,
          fanItems: [],
        },
      ],
      discarderNames: [],
      selfDraw: true,
    },
  ];
}

describe("game ui render", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    memoryStorage.clear();
  });

  it("keeps round toggle buttons when showing the unfinished-session message", () => {
    document.body.innerHTML = `
      <table class="table">
        <tbody>
          <tr>
            <th>盘序</th>
            <th>内容</th>
          </tr>
          <tr name="rdtr">
            <td>1</td>
            <td>第1局</td>
          </tr>
        </tbody>
      </table>
      <table class="table">
        <tbody>
          <tr id="standard-score-row">
            <th>标准分</th>
            <td colspan="2">A</td>
            <td colspan="2">B</td>
            <td colspan="2">C</td>
            <td colspan="2">D</td>
          </tr>
        </tbody>
      </table>
    `;

    installRoundToggleButtons([
      {
        roundNo: 1,
        winners: [],
        discarderNames: [],
        selfDraw: false,
      },
    ]);
    upsertMetricsMessageRows("请等待牌局完成");

    expect(
      document.querySelector(".reviewer-game-round-toggle"),
    ).not.toBeNull();
  });

  it("renders a merged metrics message across both metric rows", () => {
    const anchor = setupScoreTable();

    upsertMetricsMessageRows("请等待牌局完成");

    const ratioRow = document.getElementById(
      "reviewer-game-ratio-row",
    ) as HTMLTableRowElement;
    const chagaRow = document.getElementById(
      "reviewer-game-chaga-row",
    ) as HTMLTableRowElement;

    expect(anchor.nextElementSibling).toBe(ratioRow);
    expect(ratioRow.querySelector("th")?.textContent).toBe("一致率");
    expect(chagaRow.querySelector("th")?.textContent).toBe("CHAGA度");

    const mergedCell = ratioRow.querySelector("td") as HTMLTableCellElement;
    expect(mergedCell.textContent).toBe("请等待牌局完成");
    expect(mergedCell.colSpan).toBe(8);
    expect(mergedCell.rowSpan).toBe(2);
    expect(chagaRow.querySelector("td")).toBeNull();
  });

  it("replaces an existing merged message with loading cells", () => {
    setupScoreTable();

    upsertMetricsMessageRows("请等待牌局完成");
    upsertLoadingRows("计算中...");

    const ratioRow = document.getElementById(
      "reviewer-game-ratio-row",
    ) as HTMLTableRowElement;
    const chagaRow = document.getElementById(
      "reviewer-game-chaga-row",
    ) as HTMLTableRowElement;

    expect(ratioRow.querySelectorAll("td")).toHaveLength(4);
    expect(chagaRow.querySelectorAll("td")).toHaveLength(4);
    expect(ratioRow.textContent).toContain("计算中...");
    expect(chagaRow.textContent).toContain("计算中...");
  });

  it("defaults to remark mode and renders a single remark column", () => {
    setupRoundTable();

    installRoundWinDisplayModes(buildRounds());

    const switcher = document.getElementById("reviewer-game-win-mode-switcher");
    expect(switcher).not.toBeNull();

    const modeButtons = Array.from(
      switcher?.querySelectorAll("button[data-win-display-mode]") ?? [],
    );
    expect(modeButtons).toHaveLength(3);

    const activeButton = switcher?.querySelector(
      'button[data-win-display-mode="remark"][aria-pressed="true"]',
    );
    expect(activeButton?.textContent).toContain("番种备注");

    const remarkHeaders = document.querySelectorAll(
      "th.reviewer-game-win-remark-header",
    );
    const remarkCells = document.querySelectorAll(
      "td.reviewer-game-win-remark-cell",
    );

    expect(remarkHeaders).toHaveLength(1);
    expect(remarkCells).toHaveLength(9);
    expect(document.querySelector(".reviewer-game-detail-row")).toBeNull();

    const remarkHeader = remarkHeaders[0] as HTMLTableCellElement | undefined;
    expect(remarkHeader?.style.width).toBe("7.5em");
    expect(remarkHeader?.style.whiteSpace).toBe("nowrap");
    expect(remarkHeader?.textContent).toBe("番种备注");

    const activeModeButton = switcher?.querySelector(
      'button[data-win-display-mode="remark"][aria-pressed="true"]',
    ) as HTMLButtonElement | null;
    expect(activeModeButton?.style.borderRadius).toBe("4px");
    expect(activeModeButton?.style.background).toContain("rgba(49, 70, 92");

    const leadingRemarkCells = Array.from(
      document.querySelectorAll("td.reviewer-game-win-remark-cell"),
    ).slice(0, 3) as HTMLTableCellElement[];
    expect(leadingRemarkCells.every((cell) => cell.textContent === "")).toBe(
      true,
    );

    const summaryRemark = document.querySelector(
      "#summary-row .reviewer-game-win-remark-cell",
    ) as HTMLTableCellElement | null;
    const rankRemark = document.querySelector(
      "#rank-row .reviewer-game-win-remark-cell",
    ) as HTMLTableCellElement | null;
    const standardRemark = document.querySelector(
      "#standard-row .reviewer-game-win-remark-cell",
    ) as HTMLTableCellElement | null;
    expect(summaryRemark?.textContent).toBe("");
    expect(rankRemark?.textContent).toBe("");
    expect(standardRemark?.textContent).toBe("");
    expect(summaryRemark?.className).toContain("bg-secondary");
  });

  it("switches between remark/detail/original modes and cleans up DOM", () => {
    setupRoundTable();

    installRoundWinDisplayModes(buildRounds());

    const detailButton = document.querySelector(
      'button[data-win-display-mode="detail"]',
    ) as HTMLButtonElement | null;
    detailButton?.click();

    expect(
      document.querySelectorAll("td.reviewer-game-win-remark-cell"),
    ).toHaveLength(0);
    expect(
      document.querySelector(".reviewer-game-round-toggle"),
    ).not.toBeNull();

    const originalButton = document.querySelector(
      'button[data-win-display-mode="original"]',
    ) as HTMLButtonElement | null;
    originalButton?.click();

    expect(document.querySelector(".reviewer-game-round-toggle")).toBeNull();
    expect(document.querySelector(".reviewer-game-win-popover")).toBeNull();
    expect(
      document.querySelectorAll("td.reviewer-game-win-remark-cell"),
    ).toHaveLength(0);

    const remarkButton = document.querySelector(
      'button[data-win-display-mode="remark"]',
    ) as HTMLButtonElement | null;
    remarkButton?.click();

    expect(
      document.querySelectorAll("td.reviewer-game-win-remark-cell"),
    ).toHaveLength(9);
    expect(document.querySelector(".reviewer-game-round-toggle")).toBeNull();
  });

  it("renders blank remark cells for draw rounds and unknown fan rounds", () => {
    setupRoundTable();

    installRoundWinDisplayModes(buildRounds());

    const round2Remark = document.querySelector(
      "#round-row-2 .reviewer-game-win-remark-cell",
    );
    const round3Remark = document.querySelector(
      "#round-row-3 .reviewer-game-win-remark-cell",
    );

    expect(round2Remark?.textContent).toBe("");
    expect(round3Remark?.textContent).toContain("番种未知");
  });

  it("keeps remark cells blank for rounds that have not been played yet", () => {
    setupRoundTable();

    installRoundWinDisplayModes([
      {
        roundNo: 1,
        winners: [
          {
            playerName: "A",
            totalFan: 3,
            fanItems: [
              {
                fanIndex: 8,
                fanName: "平和",
                count: 1,
                unitFan: 1,
                totalFan: 1,
              },
            ],
          },
        ],
        discarderNames: ["B"],
        selfDraw: false,
      },
    ]);

    const round1Remark = document.querySelector(
      "#round-row-1 .reviewer-game-win-remark-cell",
    );
    const round2Remark = document.querySelector(
      "#round-row-2 .reviewer-game-win-remark-cell",
    );
    const round3Remark = document.querySelector(
      "#round-row-3 .reviewer-game-win-remark-cell",
    );

    expect(round1Remark?.textContent).toBe("金Ⅰ");
    expect(round2Remark?.textContent).toBe("");
    expect(round3Remark?.textContent).toBe("");
  });

  it("does not inject blank remark cells into empty rdtr rows", () => {
    setupSparseRoundTable();

    installRoundWinDisplayModes([
      {
        roundNo: 1,
        winners: [
          {
            playerName: "A",
            totalFan: 3,
            fanItems: [
              {
                fanIndex: 8,
                fanName: "平和",
                count: 1,
                unitFan: 1,
                totalFan: 1,
              },
            ],
          },
        ],
        discarderNames: ["B"],
        selfDraw: false,
      },
    ]);

    const round1Children = document.querySelectorAll("#round-row-1 > *");
    const round2Children = document.querySelectorAll("#round-row-2 > *");
    const round3Children = document.querySelectorAll("#round-row-3 > *");

    expect(round1Children).toHaveLength(4);
    expect(round2Children).toHaveLength(0);
    expect(round3Children).toHaveLength(0);
  });

  it("shows only the max-fan remark for each round", () => {
    setupRoundTable();

    installRoundWinDisplayModes(buildRounds());

    const round1Remark = document.querySelector(
      "#round-row-1 .reviewer-game-win-remark-cell",
    ) as HTMLTableCellElement | null;

    expect(round1Remark?.textContent).toContain("清一色");
    expect(round1Remark?.textContent).not.toContain("平和");
  });

  it("prefers total fan value instead of item count when picking the remark", () => {
    setupRoundTable();

    installRoundWinDisplayModes([
      {
        roundNo: 1,
        winners: [
          {
            playerName: "CatHikari",
            totalFan: 12,
            fanItems: [
              {
                fanIndex: 57,
                fanName: "花龙",
                count: 1,
                unitFan: 8,
                totalFan: 8,
              },
              {
                fanIndex: 8,
                fanName: "平和",
                count: 1,
                unitFan: 2,
                totalFan: 2,
              },
              {
                fanIndex: 1,
                fanName: "花牌",
                count: 2,
                unitFan: 1,
                totalFan: 2,
              },
            ],
          },
        ],
        discarderNames: ["Choimoe"],
        selfDraw: false,
      },
      {
        roundNo: 2,
        winners: [],
        discarderNames: [],
        selfDraw: false,
      },
      {
        roundNo: 3,
        winners: [],
        discarderNames: [],
        selfDraw: false,
      },
    ]);

    const round1Remark = document.querySelector(
      "#round-row-1 .reviewer-game-win-remark-cell",
    ) as HTMLTableCellElement | null;

    expect(round1Remark?.textContent).toContain("花龙");
    expect(round1Remark?.textContent).not.toContain("花牌");
  });

  it("renders 金Ⅰ for all one-fan structures even when flower is present", () => {
    setupRoundTable();

    installRoundWinDisplayModes([
      {
        roundNo: 1,
        winners: [
          {
            playerName: "HZ",
            totalFan: 11,
            fanItems: [
              {
                fanIndex: 1,
                fanName: "花牌",
                count: 3,
                unitFan: 1,
                totalFan: 3,
              },
              {
                fanIndex: 61,
                fanName: "幺九刻",
                count: 1,
                unitFan: 1,
                totalFan: 1,
              },
              {
                fanIndex: 82,
                fanName: "自摸",
                count: 1,
                unitFan: 1,
                totalFan: 1,
              },
            ],
          },
        ],
        discarderNames: [],
        selfDraw: true,
      },
    ]);

    const round1Remark = document.querySelector(
      "#round-row-1 .reviewer-game-win-remark-cell",
    ) as HTMLTableCellElement | null;

    expect(round1Remark?.textContent).toBe("金Ⅰ");
    expect(round1Remark?.textContent).not.toContain("花牌");
  });

  it("renders 银・番名 when exactly one two-fan item remains and the rest are one-fan items", () => {
    setupRoundTable();

    installRoundWinDisplayModes([
      {
        roundNo: 1,
        winners: [
          {
            playerName: "A",
            totalFan: 8,
            fanItems: [
              {
                fanIndex: 62,
                fanName: "暗杠",
                count: 1,
                unitFan: 2,
                totalFan: 2,
              },
              {
                fanIndex: 76,
                fanName: "缺一门",
                count: 1,
                unitFan: 1,
                totalFan: 1,
              },
              {
                fanIndex: 68,
                fanName: "无字",
                count: 1,
                unitFan: 1,
                totalFan: 1,
              },
              {
                fanIndex: 1,
                fanName: "花牌",
                count: 3,
                unitFan: 1,
                totalFan: 3,
              },
            ],
          },
        ],
        discarderNames: ["B"],
        selfDraw: false,
      },
    ]);

    const round1Remark = document.querySelector(
      "#round-row-1 .reviewer-game-win-remark-cell",
    ) as HTMLTableCellElement | null;

    expect(round1Remark?.textContent).toBe("银・暗杠");
  });

  it("renders 铜・AB when exactly two two-fan items remain and the rest are one-fan items", () => {
    setupRoundTable();

    installRoundWinDisplayModes([
      {
        roundNo: 1,
        winners: [
          {
            playerName: "A",
            totalFan: 8,
            fanItems: [
              {
                fanIndex: 79,
                fanName: "平和",
                count: 1,
                unitFan: 2,
                totalFan: 2,
              },
              {
                fanIndex: 62,
                fanName: "暗杠",
                count: 1,
                unitFan: 2,
                totalFan: 2,
              },
              {
                fanIndex: 76,
                fanName: "缺一门",
                count: 1,
                unitFan: 1,
                totalFan: 1,
              },
              {
                fanIndex: 68,
                fanName: "无字",
                count: 1,
                unitFan: 1,
                totalFan: 1,
              },
              {
                fanIndex: 1,
                fanName: "花牌",
                count: 2,
                unitFan: 1,
                totalFan: 2,
              },
            ],
          },
        ],
        discarderNames: ["B"],
        selfDraw: false,
      },
    ]);

    const round1Remark = document.querySelector(
      "#round-row-1 .reviewer-game-win-remark-cell",
    ) as HTMLTableCellElement | null;

    expect(round1Remark?.textContent).toBe("铜・平杠");
  });

  it("renders 金Ⅰ when all non-flower items are one-fan items", () => {
    setupRoundTable();

    installRoundWinDisplayModes([
      {
        roundNo: 1,
        winners: [
          {
            playerName: "A",
            totalFan: 4,
            fanItems: [
              {
                fanIndex: 76,
                fanName: "缺一门",
                count: 1,
                unitFan: 1,
                totalFan: 1,
              },
              {
                fanIndex: 68,
                fanName: "无字",
                count: 1,
                unitFan: 1,
                totalFan: 1,
              },
              {
                fanIndex: 82,
                fanName: "自摸",
                count: 1,
                unitFan: 1,
                totalFan: 1,
              },
              {
                fanIndex: 1,
                fanName: "花牌",
                count: 1,
                unitFan: 1,
                totalFan: 1,
              },
            ],
          },
        ],
        discarderNames: [],
        selfDraw: true,
      },
    ]);

    const round1Remark = document.querySelector(
      "#round-row-1 .reviewer-game-win-remark-cell",
    ) as HTMLTableCellElement | null;

    expect(round1Remark?.textContent).toBe("金Ⅰ");
  });

  it("renders 金Ⅱ when all non-flower items are one-fan items and include two 幺九刻", () => {
    setupRoundTable();

    installRoundWinDisplayModes([
      {
        roundNo: 1,
        winners: [
          {
            playerName: "A",
            totalFan: 5,
            fanItems: [
              {
                fanIndex: 61,
                fanName: "幺九刻",
                count: 2,
                unitFan: 1,
                totalFan: 2,
              },
              {
                fanIndex: 76,
                fanName: "缺一门",
                count: 1,
                unitFan: 1,
                totalFan: 1,
              },
              {
                fanIndex: 68,
                fanName: "无字",
                count: 1,
                unitFan: 1,
                totalFan: 1,
              },
              {
                fanIndex: 1,
                fanName: "花牌",
                count: 1,
                unitFan: 1,
                totalFan: 1,
              },
            ],
          },
        ],
        discarderNames: ["B"],
        selfDraw: false,
      },
    ]);

    const round1Remark = document.querySelector(
      "#round-row-1 .reviewer-game-win-remark-cell",
    ) as HTMLTableCellElement | null;

    expect(round1Remark?.textContent).toBe("金Ⅱ");
  });

  it("opens one floating detail popover and closes it manually", () => {
    setupRoundTable();

    installRoundWinDisplayModes(buildRounds());

    const firstRemarkButton = document.querySelector(
      "#round-row-1 .reviewer-game-win-remark-trigger",
    ) as HTMLButtonElement | null;
    firstRemarkButton?.click();

    let popovers = document.querySelectorAll(".reviewer-game-win-popover");
    expect(popovers).toHaveLength(1);
    expect(popovers[0]?.textContent).toContain("清一色");

    const thirdRemarkButton = document.querySelector(
      "#round-row-3 .reviewer-game-win-remark-trigger",
    ) as HTMLButtonElement | null;
    thirdRemarkButton?.click();

    popovers = document.querySelectorAll(".reviewer-game-win-popover");
    expect(popovers).toHaveLength(1);
    expect(popovers[0]?.textContent).toContain("番种未知");
    expect(popovers[0]?.textContent).not.toContain("清一色");

    const closeButton = popovers[0]?.querySelector(
      ".reviewer-game-win-popover-close",
    ) as HTMLButtonElement | null;
    closeButton?.click();

    expect(document.querySelector(".reviewer-game-win-popover")).toBeNull();
  });

  it("adds a remembered compact-score toggle and rewrites score cells when enabled", () => {
    setupScoreRoundTable();

    installRoundWinDisplayModes([
      {
        roundNo: 1,
        winners: [
          {
            playerName: "D",
            totalFan: 8,
            fanItems: [],
          },
        ],
        discarderNames: ["B"],
        selfDraw: false,
      },
      {
        roundNo: 2,
        winners: [
          {
            playerName: "D",
            totalFan: 8,
            fanItems: [],
          },
        ],
        discarderNames: [],
        selfDraw: true,
      },
      {
        roundNo: 3,
        winners: [],
        discarderNames: [],
        selfDraw: false,
      },
      {
        roundNo: 4,
        winners: [
          {
            playerName: "D",
            totalFan: 12,
            fanItems: [],
          },
        ],
        discarderNames: ["B"],
        selfDraw: false,
      },
      {
        roundNo: 5,
        winners: [
          {
            playerName: "D",
            totalFan: 12,
            fanItems: [],
          },
        ],
        discarderNames: ["A"],
        selfDraw: false,
      },
    ]);

    const toggle = document.querySelector(
      "button[data-score-compact-mode]",
    ) as HTMLButtonElement | null;
    expect(toggle?.textContent).toContain("简洁得分：关");

    toggle?.click();

    const updatedToggle = document.querySelector(
      "button[data-score-compact-mode]",
    ) as HTMLButtonElement | null;
    expect(updatedToggle?.textContent).toContain("简洁得分：开");
    expect(localStorage.getItem("reviewer:game-score-compact-mode")).toBe(
      "compact",
    );

    const row1 = document.querySelectorAll("#round-row-1 td");
    const row2 = document.querySelectorAll("#round-row-2 td");
    const row3 = document.querySelectorAll("#round-row-3 td");
    const row4 = document.querySelectorAll("#round-row-4 td");
    const row5 = document.querySelectorAll("#round-row-5 td");

    expect(row1[1]?.textContent).toBe("");
    expect(row1[3]?.textContent).toBe("-8");
    expect(row1[5]?.textContent).toBe("");
    expect(row1[7]?.textContent).toBe("8");

    expect(row2[1]?.textContent).toBe("");
    expect(row2[3]?.textContent).toBe("");
    expect(row2[5]?.textContent).toBe("");
    expect(row2[7]?.textContent).toBe("8×3");

    expect(row3[1]?.textContent).toBe("");
    expect(row3[3]?.textContent).toBe("");
    expect(row3[5]?.textContent).toBe("-10×3");
    expect(row3[7]?.textContent).toBe("");
    expect(row3[5]?.className).toContain("f");

    expect(row4[1]?.textContent).toBe("-10×3");
    expect(row4[3]?.textContent).toBe("-12");
    expect(row4[5]?.textContent).toBe("");
    expect(row4[7]?.textContent).toBe("12");
    expect(row4[1]?.className).toContain("f");

    expect(row5[1]?.textContent).toBe("-10×3-12");
    expect(row5[3]?.textContent).toBe("");
    expect(row5[5]?.textContent).toBe("");
    expect(row5[7]?.textContent).toBe("12");
    expect(row5[1]?.className).toContain("f");
  });

  it("supports compact score display for -40/+0 foul rules", () => {
    setupScoreRoundTable(
      "配置：16盘 | 8番 (8) | 错和 鸣牌 ✓ -40/+0 | 随机座位",
    );

    const round2 = document.getElementById("round-row-2");
    const round3 = document.getElementById("round-row-3");
    if (round2 && round3) {
      round2.innerHTML =
        '<td>2</td><td class="n">-30</td><td>70</td><td class="f">-70</td><td>30</td><td class="w">90</td><td>190</td><td class="n">-30</td><td>70</td>';
      round3.innerHTML =
        '<td>3</td><td class="n">-8</td><td>62</td><td class="f">-70</td><td>-40</td><td class="w">46</td><td>236</td><td class="n">-8</td><td>62</td>';
    }

    installRoundWinDisplayModes([
      {
        roundNo: 1,
        winners: [],
        discarderNames: [],
        selfDraw: false,
      },
      {
        roundNo: 2,
        winners: [
          {
            playerName: "C",
            totalFan: 22,
            fanItems: [],
          },
        ],
        discarderNames: [],
        selfDraw: true,
      },
      {
        roundNo: 3,
        winners: [
          {
            playerName: "C",
            totalFan: 22,
            fanItems: [],
          },
        ],
        discarderNames: ["B"],
        selfDraw: false,
      },
    ]);

    const toggle = document.querySelector(
      "button[data-score-compact-mode]",
    ) as HTMLButtonElement | null;
    toggle?.click();

    const row2 = document.querySelectorAll("#round-row-2 td");
    const row3 = document.querySelectorAll("#round-row-3 td");

    expect(row2[1]?.textContent).toBe("");
    expect(row2[3]?.textContent).toBe("-40");
    expect(row2[5]?.textContent).toBe("22×3");
    expect(row2[7]?.textContent).toBe("");
    expect(row2[3]?.className).toContain("f");

    expect(row3[1]?.textContent).toBe("");
    expect(row3[3]?.textContent).toBe("-40-22");
    expect(row3[5]?.textContent).toBe("22");
    expect(row3[7]?.textContent).toBe("");
    expect(row3[3]?.className).toContain("f");
  });

  it("uses original score classes instead of score thresholds to detect winner discarder and foul", () => {
    setupScoreRoundTable();

    const round1 = document.getElementById("round-row-1");
    if (round1) {
      round1.innerHTML =
        '<td>1</td><td class="n">-8</td><td>92</td><td class="n">-8</td><td>92</td><td class="w">64</td><td>164</td><td class="c">-48</td><td>52</td>';
    }

    installRoundWinDisplayModes([
      {
        roundNo: 1,
        winners: [
          {
            playerName: "C",
            totalFan: 16,
            fanItems: [],
          },
        ],
        discarderNames: ["D"],
        selfDraw: false,
      },
    ]);

    const toggle = document.querySelector(
      "button[data-score-compact-mode]",
    ) as HTMLButtonElement | null;
    toggle?.click();

    const row1 = document.querySelectorAll("#round-row-1 td");
    expect(row1[1]?.textContent).toBe("");
    expect(row1[1]?.className).toContain("n");
    expect(row1[3]?.textContent).toBe("");
    expect(row1[3]?.className).toContain("n");
    expect(row1[5]?.textContent).toBe("16");
    expect(row1[5]?.className).toContain("w");
    expect(row1[7]?.textContent).toBe("-16");
    expect(row1[7]?.className).toContain("c");
    expect(row1[7]?.className).not.toContain("f");
  });

  it("logs a warning when compact score conversion cannot reproduce actual scores and cumulative totals", () => {
    setupScoreRoundTable();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const round1 = document.getElementById("round-row-1");
    if (round1) {
      round1.innerHTML =
        '<td>1</td><td class="n">-8</td><td>92</td><td class="n">-8</td><td>91</td><td class="w">64</td><td>164</td><td class="c">-48</td><td>52</td>';
    }

    installRoundWinDisplayModes([
      {
        roundNo: 1,
        winners: [
          {
            playerName: "C",
            totalFan: 16,
            fanItems: [],
          },
        ],
        discarderNames: ["D"],
        selfDraw: false,
      },
    ]);

    const toggle = document.querySelector(
      "button[data-score-compact-mode]",
    ) as HTMLButtonElement | null;
    toggle?.click();

    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy.mock.calls[0]?.[1]).toBe("简洁得分校验失败");
    expect(warnSpy.mock.calls[0]?.[2]).toMatchObject({
      mismatch: "得分/累计",
    });
  });

  it("uses a real captured row fixture to render the problematic ron row correctly in compact mode", () => {
    setupRealFixtureCompactScoreTable();

    installRoundWinDisplayModes([
      {
        roundNo: 1,
        winners: [
          {
            playerName: "★ 海伯利安",
            totalFan: 40,
            fanItems: [],
          },
        ],
        discarderNames: ["截和天地人和"],
        selfDraw: false,
      },
    ]);

    const toggle = document.querySelector(
      "button[data-score-compact-mode]",
    ) as HTMLButtonElement | null;
    toggle?.click();

    const row = document.querySelectorAll("#tmp-round-row td");
    expect(row[1]?.textContent).toBe("");
    expect(row[3]?.textContent).toBe("");
    expect(row[5]?.textContent).toBe("40");
    expect(row[7]?.textContent).toBe("-40");
    expect(row[5]?.className).toContain("w");
    expect(row[7]?.className).toContain("c");
    expect(row[7]?.className).not.toContain("f");
  });
});
