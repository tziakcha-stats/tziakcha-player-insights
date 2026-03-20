import { beforeEach, describe, expect, it, vi } from "vitest";
import type { StepData } from "../../src/features/game/step-data";

const fetchSessionData = vi.fn();
const fetchStepData = vi.fn();
const fetchAiResponse = vi.fn();

vi.mock("../../src/shared/session-data", () => ({
  fetchSessionData,
}));

vi.mock("../../src/features/game/step-data", async () => {
  const actual = await vi.importActual("../../src/features/game/step-data");
  return {
    ...actual,
    fetchStepData,
  };
});

vi.mock("../../src/features/game/chaga-data", () => ({
  fetchAiResponse,
}));

describe("data metrics", () => {
  beforeEach(() => {
    vi.resetModules();
    fetchSessionData.mockReset();
    fetchStepData.mockReset();
    fetchAiResponse.mockReset();
  });

  it("computes round winners, discarder and self draw correctly", async () => {
    const { computeRoundOutcomes } =
      await import("../../src/features/game/data-metrics");

    const steps: StepData[] = [
      {
        b: 0x21,
        y: [
          {
            f: 8,
            t: { "50": 2 },
          },
        ],
      },
      {
        b: 0x04,
        y: [
          undefined,
          undefined,
          {
            t: { "82": 1 },
          },
        ],
      },
    ];

    const rounds = computeRoundOutcomes(["A", "B", "C", "D"], steps);

    expect(rounds).toEqual([
      {
        roundNo: 1,
        winners: [
          {
            playerName: "A",
            totalFan: 8,
            fanItems: [
              {
                fanIndex: 50,
                fanName: "碰碰和",
                count: 1,
                unitFan: 2,
                totalFan: 2,
              },
            ],
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
            totalFan: 1,
            fanItems: [
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
  });

  it("computes player and overall metrics from captured choices and AI review data", async () => {
    const { computeMetrics } =
      await import("../../src/features/game/data-metrics");

    fetchSessionData.mockResolvedValue({
      players: [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }],
      records: [{ id: "round-1" }],
      isFinished: true,
    });

    fetchStepData.mockResolvedValue({
      a: [
        [0x02, 0],
        [0x14, 0],
        [0x28, 0],
      ],
      b: 0x21,
      y: [
        {
          f: 8,
          t: { "50": 2 },
        },
      ],
    });

    fetchAiResponse
      .mockResolvedValueOnce([
        {
          rr: 0,
          ri: -1,
          extra: { candidates: [[1, "Play W1"]] },
        },
      ])
      .mockResolvedValueOnce([
        {
          rr: 0,
          ri: 0,
          extra: {
            candidates: [
              [1, "Chi W1 W2 W3"],
              [0.8, "Peng W1"],
            ],
          },
        },
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const metrics = await computeMetrics("session-1");

    expect(metrics.players).toHaveLength(4);
    expect(metrics.players[0]).toMatchObject({
      playerName: "A",
      matched: 1,
      total: 1,
      ratio: 1,
      chagaAvg: 100,
    });
    expect(metrics.players[1]).toMatchObject({
      playerName: "B",
      matched: 0,
      total: 1,
      ratio: 0,
    });
    expect(metrics.players[1].chagaAvg).toBeCloseTo(Math.exp(-0.2) * 100, 10);
    expect(metrics.players[2]).toMatchObject({
      playerName: "C",
      matched: 1,
      total: 1,
      ratio: 1,
      chagaAvg: 100,
    });
    expect(metrics.players[3]).toMatchObject({
      playerName: "D",
      matched: 0,
      total: 0,
      ratio: 0,
      chagaAvg: 0,
    });

    expect(metrics.overall.matched).toBe(2);
    expect(metrics.overall.total).toBe(3);
    expect(metrics.overall.ratio).toBeCloseTo(2 / 3, 10);
    expect(metrics.overall.chagaAvg).toBeCloseTo(
      (100 + Math.exp(-0.2) * 100 + 100) / 3,
      10,
    );
    expect(metrics.rounds).toEqual([
      {
        roundNo: 1,
        winners: [
          {
            playerName: "A",
            totalFan: 8,
            fanItems: [
              {
                fanIndex: 50,
                fanName: "碰碰和",
                count: 1,
                unitFan: 2,
                totalFan: 2,
              },
            ],
          },
        ],
        discarderNames: ["B"],
        selfDraw: false,
      },
    ]);
  });

  it("prepares completed rounds even when the session is not finished", async () => {
    const { prepareSessionData } =
      await import("../../src/features/game/data-metrics");

    fetchSessionData.mockResolvedValue({
      players: [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }],
      records: [{ id: "round-1" }],
      isFinished: false,
    });
    fetchStepData.mockResolvedValue({
      b: 0x21,
      y: [{ f: 8, t: { "50": 2 } }],
    });

    await expect(prepareSessionData("session-1")).resolves.toMatchObject({
      sessionPlayerNames: ["A", "B", "C", "D"],
      isFinished: false,
      steps: [{ b: 0x21, y: [{ f: 8, t: { "50": 2 } }] }],
    });
    expect(fetchStepData).toHaveBeenCalledWith("round-1");
  });

  it("still throws from metrics calculation when the session is not finished", async () => {
    const { computeMetrics } =
      await import("../../src/features/game/data-metrics");

    fetchSessionData.mockResolvedValue({
      players: [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }],
      records: [{ id: "round-1" }],
      isFinished: false,
    });
    fetchStepData.mockResolvedValue({
      b: 0x21,
      y: [{ f: 8, t: { "50": 2 } }],
    });

    await expect(computeMetrics("session-1")).rejects.toThrow(
      "SESSION_NOT_FINISHED",
    );
  });

  it("maps winners and discarders with seat rotation across rounds", async () => {
    const { computeRoundOutcomes } =
      await import("../../src/features/game/data-metrics");

    const rounds = computeRoundOutcomes(
      ["A", "B", "C", "D"],
      [
        {
          b: 0,
        },
        {
          b: 0x21,
          y: [
            {
              f: 3,
              t: { "82": 1 },
            },
          ],
        },
      ],
    );

    expect(rounds).toEqual([
      {
        roundNo: 2,
        winners: [
          {
            playerName: "B",
            totalFan: 3,
            fanItems: [
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
        discarderNames: ["C"],
        selfDraw: false,
      },
    ]);
  });
});
