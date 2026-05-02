import { beforeEach, describe, expect, it, vi } from "vitest";

const prepareSessionData = vi.fn();
const computeRoundOutcomes = vi.fn();
const computeMetrics = vi.fn();
const installRoundToggleButtons = vi.fn();
const upsertLoadingRows = vi.fn();
const upsertMetricsRows = vi.fn();
const upsertMetricsMessageRows = vi.fn();
const infoLog = vi.fn();

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

vi.mock("../../src/shared/logger", () => ({
  infoLog,
  warnLog: vi.fn(),
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
    infoLog.mockReset();
    window.history.replaceState({}, "", "/game?id=session-1");
  });

  it("shows a merged metrics message when the session is not finished", async () => {
    prepareSessionData.mockResolvedValue({
      sessionPlayerNames: ["A", "B", "C", "D"],
      steps: [{ b: 0x21, y: [{ f: 8, t: { "50": 2 } }] }],
      isFinished: false,
    });
    computeRoundOutcomes.mockReturnValue([
      {
        roundNo: 1,
        winners: [],
        discarderNames: [],
        selfDraw: false,
      },
    ]);
    const { SESSION_NOT_FINISHED_ERROR } =
      await import("../../src/features/game/constants");
    computeMetrics.mockRejectedValue(new Error(SESSION_NOT_FINISHED_ERROR));

    const { initGameFeature } = await import("../../src/features/game/index");

    expect(initGameFeature(window.location.href)).toBe(true);
    expect(upsertLoadingRows).toHaveBeenCalledWith("计算中...");

    await Promise.resolve();
    await Promise.resolve();

    expect(installRoundToggleButtons).toHaveBeenCalledWith([
      {
        roundNo: 1,
        winners: [],
        discarderNames: [],
        selfDraw: false,
      },
    ]);
    expect(upsertMetricsMessageRows).toHaveBeenCalledTimes(1);
    expect(upsertMetricsMessageRows).toHaveBeenCalledWith("请等待牌局完成");
    expect(upsertMetricsRows).not.toHaveBeenCalled();
    expect(infoLog).toHaveBeenCalledWith("Game session prepared", {
      sessionId: "session-1",
      isFinished: false,
      recordCount: 1,
      roundsWithOutcomeCount: 1,
    });
  });
});
