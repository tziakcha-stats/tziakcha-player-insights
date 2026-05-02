import { describe, expect, it } from "vitest";
import { parseWinFanItems } from "../../src/features/game/win-info";

describe("win info", () => {
  it("parses encoded fan entries and sorts by fan index", () => {
    expect(
      parseWinFanItems({
        "82": 1,
        "50": 0x0102,
      }),
    ).toEqual([
      {
        fanIndex: 50,
        fanName: "碰碰和",
        count: 2,
        unitFan: 2,
        totalFan: 4,
      },
      {
        fanIndex: 82,
        fanName: "自摸",
        count: 1,
        unitFan: 1,
        totalFan: 1,
      },
    ]);
  });

  it("accepts numeric strings and falls back for unknown fan names", () => {
    expect(
      parseWinFanItems({
        "200": "513",
      }),
    ).toEqual([
      {
        fanIndex: 200,
        fanName: "番种200",
        count: 3,
        unitFan: 1,
        totalFan: 3,
      },
    ]);
  });

  it("ignores invalid entries and non-object inputs", () => {
    expect(parseWinFanItems(null)).toEqual([]);
    expect(parseWinFanItems("invalid")).toEqual([]);
    expect(
      parseWinFanItems({
        invalid: 1,
        "82": "NaN",
      }),
    ).toEqual([]);
  });
});
