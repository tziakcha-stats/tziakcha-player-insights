import { afterEach, describe, expect, it, vi } from "vitest";

describe("tziakcha records", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("parses session ids from game urls and raw ids", async () => {
    const { parseTziakchaSessionId } =
      await import("../../src/shared/tziakcha-records");

    expect(
      parseTziakchaSessionId("https://tziakcha.net/game?id=e4BSqBw9&foo=bar"),
    ).toBe("e4BSqBw9");
    expect(parseTziakchaSessionId("/game?id=e4BSqBw9")).toBe("e4BSqBw9");
    expect(parseTziakchaSessionId("e4BSqBw9")).toBe("e4BSqBw9");
    expect(parseTziakchaSessionId("https://tziakcha.net/game")).toBeNull();
  });

  it("fetches and normalizes session records", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        players: [
          { n: "A", i: "a" },
          { name: "B", id: "b" },
          { n: "C" },
          { n: "D" },
        ],
        periods: "16",
        records: [{ i: "r1" }, { id: "r2" }, {}, { i: "r3" }],
        finished: true,
      }),
    } as Response);

    const { fetchTziakchaSession } =
      await import("../../src/shared/tziakcha-records");

    await expect(
      fetchTziakchaSession("session 1", { fetch: fetchMock }),
    ).resolves.toEqual({
      sessionId: "session 1",
      players: [
        { name: "A", id: "a" },
        { name: "B", id: "b" },
        { name: "C", id: undefined },
        { name: "D", id: undefined },
      ],
      records: [
        { id: "r1", index: 0 },
        { id: "r2", index: 1 },
        { id: "r3", index: 3 },
      ],
      periods: 16,
      isFinished: false,
    });
    expect(fetchMock).toHaveBeenCalledWith("/_qry/game/?id=session%201", {
      method: "POST",
      credentials: "include",
    });
  });

  it("fetches record scripts and decodes step data with injected decompressor", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        script: "encoded-step",
      }),
    } as Response);
    const decompressZlibBase64 = vi
      .fn()
      .mockResolvedValue('{"b":33,"y":[{"f":8,"t":{"50":2}}]}');

    const { fetchTziakchaRecordStep } =
      await import("../../src/shared/tziakcha-records");

    await expect(
      fetchTziakchaRecordStep("record-1", {
        fetch: fetchMock,
        decompressZlibBase64,
      }),
    ).resolves.toEqual({
      b: 33,
      y: [{ f: 8, t: { "50": 2 } }],
    });
    expect(fetchMock).toHaveBeenCalledWith("/_qry/record/", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: "id=record-1",
    });
    expect(decompressZlibBase64).toHaveBeenCalledWith("encoded-step");
  });

  it("throws a clear error when record script is missing", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);

    const { fetchTziakchaRecordStep } =
      await import("../../src/shared/tziakcha-records");

    await expect(
      fetchTziakchaRecordStep("record-1", { fetch: fetchMock }),
    ).rejects.toThrow("record record-1 缺少 script");
  });

  it("fetches all session rounds with decoded step data", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          players: [{ n: "A" }, { n: "B" }, { n: "C" }, { n: "D" }],
          periods: 2,
          records: [{ i: "r1" }, { i: "r2" }],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ script: "encoded-r1" }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ script: "encoded-r2" }),
      } as Response);
    const decompressZlibBase64 = vi
      .fn()
      .mockResolvedValueOnce('{"b":33}')
      .mockResolvedValueOnce('{"b":4}');

    const { fetchTziakchaSessionRounds } =
      await import("../../src/shared/tziakcha-records");

    await expect(
      fetchTziakchaSessionRounds("https://tziakcha.net/game?id=session-1", {
        fetch: fetchMock,
        decompressZlibBase64,
      }),
    ).resolves.toMatchObject({
      sessionId: "session-1",
      isFinished: true,
      records: [
        { id: "r1", index: 0, step: { b: 33 } },
        { id: "r2", index: 1, step: { b: 4 } },
      ],
    });
  });

  it("extracts win infos from round steps with seat rotation", async () => {
    const { extractTziakchaRoundWinInfos } =
      await import("../../src/shared/tziakcha-records");

    expect(
      extractTziakchaRoundWinInfos({
        sessionId: "session-1",
        players: [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }],
        records: [
          {
            id: "r1",
            index: 0,
            step: { b: 0x21, y: [{ f: 8, t: { "50": 2 } }] },
          },
          {
            id: "r2",
            index: 1,
            step: {
              b: 0x04,
              y: [undefined, undefined, { t: { "82": 1 } }],
            },
          },
        ],
        periods: 2,
        isFinished: true,
      }),
    ).toEqual([
      {
        roundNo: 1,
        recordId: "r1",
        winners: [
          {
            playerName: "A",
            playerIndex: 0,
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
        discarders: [{ playerName: "B", playerIndex: 1 }],
        selfDraw: false,
      },
      {
        roundNo: 2,
        recordId: "r2",
        winners: [
          {
            playerName: "D",
            playerIndex: 3,
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
        discarders: [],
        selfDraw: true,
      },
    ]);
  });
});
