import { describe, it, expect, beforeEach } from "vitest";
import {
  getLastStep,
  setLastStep,
  getLastHandStr,
  setLastHandStr,
  getLastResult,
  setLastResult,
  resetState,
  handTilesToStr,
  buildHandString,
  parseHandHtml,
} from "../../../../src/features/record/efficiency/state";

describe("efficiency state", () => {
  beforeEach(() => {
    resetState();
  });

  describe("step tracking", () => {
    it("should track last step", () => {
      expect(getLastStep()).toBeNull();
      setLastStep(42);
      expect(getLastStep()).toBe(42);
    });
  });

  describe("hand string tracking", () => {
    it("should track last hand string", () => {
      expect(getLastHandStr()).toBeNull();
      setLastHandStr("0,1,2,3,4");
      expect(getLastHandStr()).toBe("0,1,2,3,4");
    });
  });

  describe("result caching", () => {
    it("should cache analysis result", () => {
      expect(getLastResult()).toBeNull();
      const mockResult = { shanten: 1, hand: "test" };
      setLastResult(mockResult);
      expect(getLastResult()).toEqual(mockResult);
    });
  });

  describe("handTilesToStr", () => {
    it("should sort and join tile IDs", () => {
      expect(handTilesToStr([3, 1, 2], [])).toBe("1,2,3");
      expect(handTilesToStr([10, 0, 5], [])).toBe("0,5,10");
    });

    it("should include meld tiles", () => {
      expect(handTilesToStr([0, 1], [[27, 28, 29]])).toBe("0,1,27,28,29");
    });
  });

  describe("buildHandString", () => {
    it("should build hand string from closed tiles", () => {
      // tileId: 0-8=m, 9-17=p, 18-26=s, 27+=z
      const result = buildHandString([0, 1, 2, 9, 10, 11, 27, 28], []);
      expect(result).toContain("m");
      expect(result).toContain("s");
    });

    it("should include meld prefix", () => {
      const result = buildHandString([0, 1, 2, 9, 10, 11, 27], [[28, 29, 30]]);
      expect(result).toContain("[S");
    });
  });

  describe("parseHandHtml", () => {
    // 辅助：生成闭门牌 HTML
    function closedTile(dataVal: number, left: number): string {
      return `<div data-val="${dataVal}" class="tl tl-x rot0" style="left:${left}px;top:28px;"></div>`;
    }
    // 辅助：生成副露牌 HTML（rot0，无 data-val）
    function meldTile(cls: string, left: number, top = 28): string {
      return `<div class="tl ${cls} rot0" style="left:${left}px;top:${top}px;"></div>`;
    }
    // 辅助：生成副露牌 HTML（rot270，无 data-val）
    function meldTileRot270(cls: string, left: number, top = 36): string {
      return `<div class="tl ${cls} rot270" style="left:${left}px;top:${top}px;"></div>`;
    }
    // 辅助：生成杠的叠放牌 HTML（top:-8px）
    function stackedTile(cls: string, left: number): string {
      return `<div class="tl ${cls} rot270" style="left:${left}px;top:-8px;"></div>`;
    }

    it("碰9m：pong 应为一组 [8,8,8]", () => {
      // 闭门 10 张 + 碰 9m
      const html = [
        closedTile(57, 392),
        closedTile(60, 436),
        closedTile(64, 480),
        closedTile(65, 524),
        closedTile(66, 568),
        closedTile(67, 612),
        closedTile(78, 656),
        closedTile(95, 700),
        closedTile(95, 744),
        closedTile(103, 788),
        // 碰 9m：rot270 + rot0 + rot0
        meldTileRot270("tl-9m", 316, 36),
        meldTile("tl-9m", 321),
        meldTile("tl-9m", 365),
      ].join("");

      const result = parseHandHtml(html);
      expect(result.closed).toHaveLength(10);
      expect(result.melds).toHaveLength(1);
      expect(result.melds[0]).toEqual([8, 8, 8]);
    });

    it("吃3p + 碰北：chi 和 pong 应分为两组", () => {
      // 使用实际日志中的位置
      // 闭门 8 张 + 吃 3p + 碰北
      const html = [
        closedTile(95, 524),
        closedTile(100, 568),
        closedTile(103, 612),
        closedTile(108, 656),
        closedTile(112, 700),
        closedTile(114, 744),
        closedTile(132, 788),
        closedTile(135, 837),
        // 吃 3p：rot270(3p) + rot0(1p) + rot0(2p)
        meldTileRot270("tl-3p", 8, 36),
        meldTile("tl-1p", 60),
        meldTile("tl-2p", 104),
        // 碰北：rot0(N) + rot0(N) + rot90(N)
        meldTile("tl-4z", 153),
        meldTile("tl-4z", 197),
        meldTile("tl-4z", 249),
      ].join("");

      const result = parseHandHtml(html);
      expect(result.closed).toHaveLength(8);
      expect(result.melds).toHaveLength(2);
      expect(result.melds[0]).toEqual([20, 18, 19]); // chi 3p
      expect(result.melds[1]).toEqual([30, 30, 30]); // pong N
    });

    it("杠9m：kong 应为一组 [8,8,8,8]", () => {
      // 闭门 10 张 + 杠 9m
      const html = [
        closedTile(57, 392),
        closedTile(60, 436),
        closedTile(64, 480),
        closedTile(65, 524),
        closedTile(66, 568),
        closedTile(67, 612),
        closedTile(78, 656),
        closedTile(95, 700),
        closedTile(95, 744),
        closedTile(103, 788),
        // 杠 9m：-8px + rot0 + rot0 + rot0
        stackedTile("tl-9m", 8),
        meldTile("tl-9m", 60),
        meldTile("tl-9m", 104),
        meldTile("tl-9m", 148),
      ].join("");

      const result = parseHandHtml(html);
      expect(result.closed).toHaveLength(10);
      expect(result.melds).toHaveLength(1);
      expect(result.melds[0]).toEqual([8, 8, 8, 8]);
    });

    it("杠9m + 杠7p：两个 kong 应各为一组", () => {
      // 闭门 7 张 + 杠 9m + 杠 7p
      const html = [
        closedTile(95, 392),
        closedTile(100, 436),
        closedTile(103, 480),
        closedTile(112, 524),
        closedTile(114, 568),
        closedTile(132, 612),
        closedTile(135, 656),
        // 杠 9m：-8px + rot0×3
        stackedTile("tl-9m", 8),
        meldTile("tl-9m", 60),
        meldTile("tl-9m", 104),
        meldTile("tl-9m", 148),
        // 杠 7p：-8px + rot0×3
        stackedTile("tl-7p", 208),
        meldTile("tl-7p", 260),
        meldTile("tl-7p", 304),
        meldTile("tl-7p", 348),
      ].join("");

      const result = parseHandHtml(html);
      expect(result.closed).toHaveLength(7);
      expect(result.melds).toHaveLength(2);
      expect(result.melds[0]).toEqual([8, 8, 8, 8]);
      expect(result.melds[1]).toEqual([24, 24, 24, 24]);
    });
  });

  describe("resetState", () => {
    it("should reset all state", () => {
      setLastStep(42);
      setLastHandStr("test");
      setLastResult({ shanten: 1 });

      resetState();

      expect(getLastStep()).toBeNull();
      expect(getLastHandStr()).toBeNull();
      expect(getLastResult()).toBeNull();
    });
  });
});
