import { afterEach, describe, expect, it, vi } from "vitest";

const nativeDefineProperty = Object.defineProperty;
const nativeReflectDefineProperty = Reflect.defineProperty;

function resetReviewDom(): void {
  document.body.innerHTML = '<div id="review"></div>';
  window.__review_error = "";
  window.__review_tz_instance = undefined;
  window.__reviews = undefined;
  window.__reviews_filled = undefined;
  window.__reviews_seats = undefined;
  window._TZ = undefined;
  window._TZ_intercepted = undefined;
  window._TZ_intercepted_direct = undefined;
}

describe("tz interceptor", () => {
  afterEach(() => {
    Object.defineProperty = nativeDefineProperty;
    Reflect.defineProperty = nativeReflectDefineProperty;
    resetReviewDom();
    vi.resetModules();
    vi.useRealTimers();
  });

  it("captures TZ instances when the page assigns the constructor", async () => {
    resetReviewDom();
    const { interceptTZ } =
      await import("../../src/features/record/tz-interceptor");
    const { getTZInstance } =
      await import("../../src/features/record/reviewer/state");

    interceptTZ();

    class TZMock {
      static label = "tz";
    }

    window.TZ = TZMock as typeof window.TZ;

    const instance = new window.TZ!();

    expect(instance).toBeInstanceOf(TZMock);
    expect(getTZInstance()).toBe(instance);
    expect(window.__review_error).toBe("");
  });

  it("force creates TZ and forwards URL parameters to fetch", async () => {
    resetReviewDom();
    window.history.replaceState(
      {},
      "",
      "/record?id=game-1&v=review-v&cy=season-2",
    );

    const adapt = vi.fn();
    const fetch = vi.fn();

    class TZMock {
      adapt = adapt;
      fetch = fetch;
    }

    window.TZ = TZMock as typeof window.TZ;

    const { tryForceCreateTZ } =
      await import("../../src/features/record/tz-interceptor");
    const { getTZInstance } =
      await import("../../src/features/record/reviewer/state");

    expect(tryForceCreateTZ()).toBe(true);
    expect(adapt).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("game-1", 0, "review-v", "season-2");
    expect(getTZInstance()).toBeInstanceOf(TZMock);
  });

  it("reports an error when TZ is non configurable and non writable", async () => {
    resetReviewDom();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { interceptTZ } =
      await import("../../src/features/record/tz-interceptor");

    nativeDefineProperty(window, "TZ", {
      configurable: false,
      writable: false,
      value: class TZMock {},
    });

    interceptTZ();

    expect(window.__review_error).toBe("TZ 属性不可拦截，无法捕获牌局");
    expect(
      (document.getElementById("review") as HTMLElement | null)?.innerText,
    ).toBe("TZ 属性不可拦截，无法捕获牌局");
    expect(warnSpy).toHaveBeenCalled();
  });
});
