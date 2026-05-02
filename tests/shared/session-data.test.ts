import { afterEach, describe, expect, it, vi } from "vitest";

describe("session data", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("treats the session as unfinished when records are fewer than periods", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        players: [{ n: "A" }, { n: "B" }, { n: "C" }, { n: "D" }],
        periods: 16,
        records: [
          { i: "SGfQqrQ6" },
          { i: "aCrGtZB0" },
          { i: "s0b56ktm" },
          { i: "Z9degsaU" },
        ],
        finished: true,
        finish_time: 123456,
      }),
    } as Response);

    const { fetchSessionData } = await import("../../src/shared/session-data");
    const sessionData = await fetchSessionData("session-1");

    expect(fetchMock).toHaveBeenCalled();
    expect(sessionData.records).toHaveLength(4);
    expect(sessionData.isFinished).toBe(false);
  });

  it("treats the session as finished only when records count equals periods", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        players: [{ n: "A" }, { n: "B" }, { n: "C" }, { n: "D" }],
        periods: "4",
        records: [
          { i: "SGfQqrQ6" },
          { i: "aCrGtZB0" },
          { i: "s0b56ktm" },
          { i: "Z9degsaU" },
        ],
      }),
    } as Response);

    const { fetchSessionData } = await import("../../src/shared/session-data");
    const sessionData = await fetchSessionData("session-2");

    expect(sessionData.isFinished).toBe(true);
  });
});
