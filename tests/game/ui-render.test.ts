import { describe, expect, it } from "vitest";
import {
  upsertLoadingRows,
  upsertMetricsMessageRows,
} from "../../src/features/game/ui-render";

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

describe("game ui render", () => {
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
});
