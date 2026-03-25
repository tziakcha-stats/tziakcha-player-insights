import { describe, expect, it } from "vitest";

describe("favorites filter", () => {
  it("returns items for the active tab only", async () => {
    const { collectFavoritesByTab } =
      await import("../../src/features/favorites/filter");

    const items = collectFavoritesByTab(
      {
        version: 1,
        updatedAt: "2026-03-25T00:00:00.000Z",
        ui: { activeTab: "game" },
        games: [
          {
            id: "game-1",
            type: "game",
            sourceUrl: "",
            title: "Game One",
            summary: "",
            tags: ["attack"],
            createdAt: "",
            updatedAt: "",
          },
        ],
        records: [
          {
            id: "record-1",
            type: "record",
            sourceUrl: "",
            title: "Record One",
            summary: "",
            tags: ["study"],
            createdAt: "",
            updatedAt: "",
          },
        ],
      },
      "record",
    );

    expect(items.map((item) => item.id)).toEqual(["record-1"]);
  });

  it("matches selected tags with all-tag semantics", async () => {
    const { filterFavorites } =
      await import("../../src/features/favorites/filter");

    const result = filterFavorites(
      [
        {
          id: "game-1",
          type: "game",
          sourceUrl: "",
          title: "Aggro game",
          summary: "",
          tags: ["attack", "review"],
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "game-2",
          type: "game",
          sourceUrl: "",
          title: "Defense game",
          summary: "",
          tags: ["review"],
          createdAt: "",
          updatedAt: "",
        },
      ],
      ["attack", "review"],
      "",
    );

    expect(result.map((item) => item.id)).toEqual(["game-1"]);
  });

  it("matches search with case-insensitive substring semantics", async () => {
    const { filterFavorites } =
      await import("../../src/features/favorites/filter");

    const result = filterFavorites(
      [
        {
          id: "record-1",
          type: "record",
          sourceUrl: "",
          title: "South 1 Review",
          summary: "Player A discarded into mangan",
          tags: ["Defense"],
          createdAt: "",
          updatedAt: "",
        },
      ],
      [],
      "MANGAN",
    );

    expect(result.map((item) => item.id)).toEqual(["record-1"]);
  });

  it("returns all items when search is empty", async () => {
    const { filterFavorites, listTagsForTab } =
      await import("../../src/features/favorites/filter");

    const items = [
      {
        id: "record-1",
        type: "record" as const,
        sourceUrl: "",
        title: "South 1 Review",
        summary: "",
        tags: ["beta", "alpha"],
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "record-2",
        type: "record" as const,
        sourceUrl: "",
        title: "South 2 Review",
        summary: "",
        tags: ["alpha"],
        createdAt: "",
        updatedAt: "",
      },
    ];

    expect(filterFavorites(items, [], "").map((item) => item.id)).toEqual([
      "record-1",
      "record-2",
    ]);
    expect(listTagsForTab(items)).toEqual(["alpha", "beta"]);
  });
});
