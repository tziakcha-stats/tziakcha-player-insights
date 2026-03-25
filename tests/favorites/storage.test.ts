import { beforeEach, describe, expect, it } from "vitest";

type MemoryStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

function createMemoryStorage(): MemoryStorage {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
  };
}

describe("favorites storage", () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = createMemoryStorage();
  });

  it("returns an empty versioned document by default", async () => {
    const { createFavoritesRepository } =
      await import("../../src/features/favorites/storage");

    const repository = createFavoritesRepository(storage);
    const document = repository.read();

    expect(document.version).toBe(1);
    expect(document.games).toEqual([]);
    expect(document.records).toEqual([]);
    expect(document.ui.activeTab).toBe("game");
    expect(repository.isAvailable()).toBe(true);
  });

  it("adds a game favorite and normalizes tags", async () => {
    const { createFavoritesRepository } =
      await import("../../src/features/favorites/storage");

    const repository = createFavoritesRepository(storage);
    const now = "2026-03-25T00:00:00.000Z";

    repository.save(
      {
        id: "game-1",
        type: "game",
        sourceUrl: "https://example.com/game?id=game-1",
        title: "Game One",
        summary: "Player A, Player B",
        tags: [" attack ", "attack", "", "review"],
      },
      now,
    );

    const favorite = repository.get("game", "game-1");
    expect(favorite).not.toBeNull();
    expect(favorite?.tags).toEqual(["attack", "review"]);
    expect(favorite?.createdAt).toBe(now);
    expect(favorite?.updatedAt).toBe(now);
  });

  it("updates an existing favorite without changing createdAt", async () => {
    const { createFavoritesRepository } =
      await import("../../src/features/favorites/storage");

    const repository = createFavoritesRepository(storage);
    repository.save(
      {
        id: "record-1",
        type: "record",
        sourceUrl: "https://example.com/record?id=record-1",
        title: "South 1",
        summary: "Round review",
        tags: ["push"],
      },
      "2026-03-25T00:00:00.000Z",
    );

    repository.save(
      {
        id: "record-1",
        type: "record",
        sourceUrl: "https://example.com/record?id=record-1",
        title: "South 1",
        summary: "Round review",
        tags: [" defense ", "push"],
      },
      "2026-03-25T01:00:00.000Z",
    );

    const favorite = repository.get("record", "record-1");
    expect(favorite?.createdAt).toBe("2026-03-25T00:00:00.000Z");
    expect(favorite?.updatedAt).toBe("2026-03-25T01:00:00.000Z");
    expect(favorite?.tags).toEqual(["defense", "push"]);
  });

  it("removes an existing favorite", async () => {
    const { createFavoritesRepository } =
      await import("../../src/features/favorites/storage");

    const repository = createFavoritesRepository(storage);
    repository.save({
      id: "game-2",
      type: "game",
      sourceUrl: "https://example.com/game?id=game-2",
      title: "Game Two",
      summary: "",
      tags: ["keep"],
    });

    expect(repository.remove("game", "game-2")).toBe(true);
    expect(repository.get("game", "game-2")).toBeNull();
    expect(repository.remove("game", "game-2")).toBe(false);
  });

  it("merges imported favorites by type and id", async () => {
    const { createFavoritesRepository } =
      await import("../../src/features/favorites/storage");

    const repository = createFavoritesRepository(storage);
    repository.save(
      {
        id: "game-3",
        type: "game",
        sourceUrl: "https://example.com/game?id=game-3",
        title: "Short",
        summary: "abc",
        tags: ["local"],
      },
      "2026-03-25T00:00:00.000Z",
    );

    const result = repository.importDocument(
      {
        version: 1,
        updatedAt: "2026-03-25T03:00:00.000Z",
        ui: { activeTab: "record" },
        games: [
          {
            id: "game-3",
            type: "game",
            sourceUrl: "https://example.com/game?id=game-3&from=import",
            title: "Much Longer Imported Title",
            summary: "longer imported summary",
            tags: ["imported", "local"],
            createdAt: "2026-03-24T00:00:00.000Z",
            updatedAt: "2026-03-24T00:00:00.000Z",
          },
        ],
        records: [
          {
            id: "record-2",
            type: "record",
            sourceUrl: "https://example.com/record?id=record-2",
            title: "Record Two",
            summary: "",
            tags: ["study"],
            createdAt: "2026-03-24T00:00:00.000Z",
            updatedAt: "2026-03-24T00:00:00.000Z",
          },
        ],
      },
      "2026-03-25T04:00:00.000Z",
    );

    expect(result).toEqual({ added: 1, merged: 1, invalid: 0 });
    expect(repository.read().ui.activeTab).toBe("game");

    const merged = repository.get("game", "game-3");
    expect(merged?.title).toBe("Much Longer Imported Title");
    expect(merged?.summary).toBe("longer imported summary");
    expect(merged?.sourceUrl).toBe(
      "https://example.com/game?id=game-3&from=import",
    );
    expect(merged?.tags).toEqual(["imported", "local"]);
    expect(merged?.createdAt).toBe("2026-03-24T00:00:00.000Z");
    expect(merged?.updatedAt).toBe("2026-03-25T04:00:00.000Z");
    expect(repository.get("record", "record-2")?.title).toBe("Record Two");
  });

  it("persists the active tab selection", async () => {
    const { createFavoritesRepository } =
      await import("../../src/features/favorites/storage");

    const repository = createFavoritesRepository(storage);

    expect(repository.setActiveTab("record")).toBe(true);
    expect(repository.read().ui.activeTab).toBe("record");
  });

  it("counts invalid imported entries and migrates missing ui state", async () => {
    const { createFavoritesRepository } =
      await import("../../src/features/favorites/storage");

    storage.setItem(
      "tzi-reviewer:favorites",
      JSON.stringify({
        version: 0,
        updatedAt: "2026-03-24T00:00:00.000Z",
        games: [],
        records: [],
      }),
    );

    const repository = createFavoritesRepository(storage);
    expect(repository.read().ui.activeTab).toBe("game");

    const result = repository.importDocument({
      version: 1,
      updatedAt: "2026-03-25T03:00:00.000Z",
      ui: { activeTab: "game" },
      games: [{ id: 123 }],
      records: [],
    });

    expect(result).toEqual({ added: 0, merged: 0, invalid: 1 });
  });

  it("reports unavailable storage and becomes read only", async () => {
    const { createFavoritesRepository } =
      await import("../../src/features/favorites/storage");

    const repository = createFavoritesRepository({
      getItem() {
        throw new Error("blocked");
      },
      setItem() {
        throw new Error("blocked");
      },
      removeItem() {
        throw new Error("blocked");
      },
    });

    expect(repository.isAvailable()).toBe(false);
    expect(repository.read().games).toEqual([]);
    expect(
      repository.save({
        id: "game-4",
        type: "game",
        sourceUrl: "https://example.com/game?id=game-4",
        title: "Blocked",
        summary: "",
        tags: ["x"],
      }),
    ).toBe(false);
  });
});
