import { beforeEach, describe, expect, it, vi } from "vitest";

const prepareSessionData = vi.fn();
const computeRoundOutcomes = vi.fn();
const computeMetrics = vi.fn();
const installRoundToggleButtons = vi.fn();
const upsertLoadingRows = vi.fn();
const upsertMetricsRows = vi.fn();
const upsertMetricsMessageRows = vi.fn();

vi.mock("../../src/features/game/data-metrics", () => ({
  prepareSessionData,
  computeRoundOutcomes,
  computeMetrics,
}));

vi.mock("../../src/features/game/ui-render", () => ({
  installRoundToggleButtons,
  upsertLoadingRows,
  upsertMetricsRows,
  upsertMetricsMessageRows,
}));

describe("game feature entry", () => {
  beforeEach(() => {
    vi.resetModules();
    prepareSessionData.mockReset();
    computeRoundOutcomes.mockReset();
    computeMetrics.mockReset();
    installRoundToggleButtons.mockReset();
    upsertLoadingRows.mockReset();
    upsertMetricsRows.mockReset();
    upsertMetricsMessageRows.mockReset();
    window.history.replaceState({}, "", "/game?id=session-1");
  });

  it("shows a merged metrics message when the session is not finished", async () => {
    const { SESSION_NOT_FINISHED_ERROR } =
      await import("../../src/features/game/constants");
    prepareSessionData.mockRejectedValue(new Error(SESSION_NOT_FINISHED_ERROR));
    computeMetrics.mockRejectedValue(new Error(SESSION_NOT_FINISHED_ERROR));

    const { initGameFeature } = await import("../../src/features/game/index");

    expect(initGameFeature(window.location.href)).toBe(true);
    expect(upsertLoadingRows).toHaveBeenCalledWith("计算中...");

    await Promise.resolve();
    await Promise.resolve();

    expect(upsertMetricsMessageRows).toHaveBeenCalledWith("请等待牌局完成");
    expect(upsertMetricsRows).not.toHaveBeenCalled();
  });
});
