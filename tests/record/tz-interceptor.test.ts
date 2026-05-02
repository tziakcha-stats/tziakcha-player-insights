import { afterEach, describe, expect, it, vi } from "vitest";

const nativeDefineProperty = Object.defineProperty;
const nativeReflectDefineProperty = Reflect.defineProperty;
const nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

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
    Object.getOwnPropertyDescriptor = nativeGetOwnPropertyDescriptor;
    resetReviewDom();
    vi.restoreAllMocks();
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
    vi.spyOn(Object, "getOwnPropertyDescriptor").mockImplementation(
      (target, prop) => {
        if (target === window && prop === "TZ") {
          return {
            configurable: false,
            enumerable: true,
            writable: false,
            value: class TZMock {},
          };
        }

        return nativeGetOwnPropertyDescriptor(target, prop);
      },
    );

    const { interceptTZ } =
      await import("../../src/features/record/tz-interceptor");

    interceptTZ();

    expect(window.__review_error).toBe("TZ 属性不可拦截，无法捕获牌局");
    expect(
      (document.getElementById("review") as HTMLElement | null)?.innerText,
    ).toBe("TZ 属性不可拦截，无法捕获牌局");
    expect(warnSpy).toHaveBeenCalled();
  });

  it("patches an existing writable TZ when the property is not configurable", async () => {
    resetReviewDom();
    class TZMock {}
    window.TZ = TZMock as typeof window.TZ;

    vi.spyOn(Object, "getOwnPropertyDescriptor").mockImplementation(
      (target, prop) => {
        if (target === window && prop === "TZ") {
          return {
            configurable: false,
            enumerable: true,
            writable: true,
            value: window.TZ,
          };
        }

        return nativeGetOwnPropertyDescriptor(target, prop);
      },
    );

    const { interceptTZ } =
      await import("../../src/features/record/tz-interceptor");
    const { getTZInstance } =
      await import("../../src/features/record/reviewer/state");

    interceptTZ();

    const instance = new window.TZ!();

    expect(instance).toBeInstanceOf(TZMock);
    expect(getTZInstance()).toBe(instance);
    expect(window.__review_error).toBe("");
  });

  it("reports a timeout error when fallback patching never finds TZ", async () => {
    resetReviewDom();
    vi.useFakeTimers();
    window.TZ = undefined;

    vi.spyOn(Object, "getOwnPropertyDescriptor").mockImplementation(
      (target, prop) => {
        if (target === window && prop === "TZ") {
          return {
            configurable: false,
            enumerable: true,
            writable: true,
            value: undefined,
          };
        }

        return nativeGetOwnPropertyDescriptor(target, prop);
      },
    );

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { interceptTZ } =
      await import("../../src/features/record/tz-interceptor");

    interceptTZ();
    vi.advanceTimersByTime(201 * 50);

    expect(window.__review_error).toBe("未捕获牌局核心对象，尝试补建实例");
    expect(
      (document.getElementById("review") as HTMLElement | null)?.innerText,
    ).toBe("未捕获牌局核心对象，尝试补建实例");
    expect(warnSpy).toHaveBeenCalled();
  });
});
