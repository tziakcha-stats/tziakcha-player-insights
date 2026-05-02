import { beforeEach, describe, expect, it, vi } from "vitest";
import { FavoritesDocument } from "../../src/features/favorites/types";

function createRepository(available = true) {
  let documentState: FavoritesDocument = {
    version: 1 as const,
    updatedAt: "2026-03-25T00:00:00.000Z",
    ui: { activeTab: "game" },
    games: [
      {
        id: "game-1",
        type: "game" as const,
        sourceUrl: "https://example.com/game?id=game-1",
        title: "Aggro Final",
        summary: "High score",
        tags: ["attack", "review"],
        createdAt: "",
        updatedAt: "",
      },
    ],
    records: [
      {
        id: "record-1",
        type: "record" as const,
        sourceUrl: "https://example.com/record?id=record-1",
        title: "South 1 Review",
        summary: "Defense push",
        tags: ["defense"],
        createdAt: "",
        updatedAt: "",
      },
    ],
  };

  return {
    isAvailable: () => available,
    read: () => documentState,
    exportDocument: vi.fn(() => documentState),
    save: vi.fn((draft) => {
      documentState = {
        ...documentState,
        games:
          draft.type === "game"
            ? documentState.games.map((item) =>
                item.id === draft.id ? { ...item, ...draft } : item,
              )
            : documentState.games,
        records:
          draft.type === "record"
            ? documentState.records.map((item) =>
                item.id === draft.id ? { ...item, ...draft } : item,
              )
            : documentState.records,
      };
      return true;
    }),
    remove: vi.fn((type: "game" | "record", id: string) => {
      documentState = {
        ...documentState,
        games:
          type === "game"
            ? documentState.games.filter((item) => item.id !== id)
            : documentState.games,
        records:
          type === "record"
            ? documentState.records.filter((item) => item.id !== id)
            : documentState.records,
      };
      return true;
    }),
    setActiveTab: vi.fn((tab: "game" | "record") => {
      documentState = {
        ...documentState,
        ui: { activeTab: tab },
      };
    }),
    importDocument: vi.fn(() => ({ added: 1, merged: 2, invalid: 0 })),
  };
}

describe("favorites page", () => {
  beforeEach(() => {
    document.body.innerHTML = `<main><div id="app">home content</div></main>`;
    window.history.replaceState({}, "", "/#reviewer-favorites");
  });

  it("renders the favorites page for the hash route", async () => {
    const { initFavoritesPageFeature } =
      await import("../../src/features/favorites/page");

    initFavoritesPageFeature(window.location.href, createRepository());

    expect(document.querySelector("#reviewer-favorites-page")).not.toBeNull();
    expect(document.body.textContent).toContain("Aggro Final");
    expect(document.body.textContent).toContain("非官方实现");
    expect(
      document.querySelector("#reviewer-favorites-page .container"),
    ).not.toBeNull();
    expect(
      document.querySelector("#reviewer-favorites-page .card"),
    ).not.toBeNull();
  });

  it("switches tabs and persists the last active tab", async () => {
    const { initFavoritesPageFeature } =
      await import("../../src/features/favorites/page");

    const repository = createRepository();
    initFavoritesPageFeature(window.location.href, repository);

    const recordTab = document.querySelector(
      "#reviewer-favorites-tab-record",
    ) as HTMLButtonElement;
    recordTab.click();

    expect(repository.setActiveTab).toHaveBeenCalledWith("record");
    expect(document.body.textContent).toContain("South 1 Review");
  });

  it("filters by selected tags and search query", async () => {
    const { initFavoritesPageFeature } =
      await import("../../src/features/favorites/page");

    initFavoritesPageFeature(window.location.href, createRepository());

    const tagButton = document.querySelector(
      '[data-tag="attack"]',
    ) as HTMLButtonElement;
    tagButton.click();

    const searchInput = document.querySelector(
      "#reviewer-favorites-search",
    ) as HTMLInputElement;
    searchInput.value = "final";
    searchInput.dispatchEvent(new Event("input"));

    expect(document.body.textContent).toContain("Aggro Final");
  });

  it("exports the current favorites document with a timestamped filename", async () => {
    const { buildFavoritesExportFilename, initFavoritesPageFeature } =
      await import("../../src/features/favorites/page");

    const repository = createRepository();
    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:mock");
    const revokeObjectURL = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});

    initFavoritesPageFeature(window.location.href, repository);

    const exportButton = document.querySelector(
      "#reviewer-favorites-export",
    ) as HTMLButtonElement;
    exportButton.click();

    expect(repository.exportDocument).toHaveBeenCalledTimes(1);
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(
      buildFavoritesExportFilename(new Date(2026, 2, 25, 11, 22, 33)),
    ).toBe("favorites-2026-03-25-112233.json");
  });

  it("imports json and reports the result", async () => {
    const { initFavoritesPageFeature } =
      await import("../../src/features/favorites/page");

    const repository = createRepository();
    initFavoritesPageFeature(window.location.href, repository);

    const input = document.querySelector(
      "#reviewer-favorites-import-input",
    ) as HTMLInputElement;
    const file = new File(
      [
        JSON.stringify({
          version: 1,
          updatedAt: "",
          ui: { activeTab: "game" },
          games: [],
          records: [],
        }),
      ],
      "favorites.json",
      { type: "application/json" },
    );
    Object.defineProperty(input, "files", {
      value: [file],
      configurable: true,
    });

    input.dispatchEvent(new Event("change"));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(repository.importDocument).toHaveBeenCalledTimes(1);
    expect(document.body.textContent).toContain("新增 1");
    expect(document.body.textContent).toContain("合并 2");
  });

  it("shows an unavailable state when storage cannot be used", async () => {
    const { initFavoritesPageFeature } =
      await import("../../src/features/favorites/page");

    initFavoritesPageFeature(window.location.href, createRepository(false));

    expect(document.body.textContent).toContain("收藏功能当前不可用");
    expect(document.querySelector("#reviewer-favorites-export")).toBeNull();
  });

  it("returns to the homepage when clicking the back button", async () => {
    const { initFavoritesPageFeature } =
      await import("../../src/features/favorites/page");

    initFavoritesPageFeature(window.location.href, createRepository());

    const backButton = document.querySelector(
      "#reviewer-favorites-back",
    ) as HTMLButtonElement;
    backButton.click();

    expect(window.location.pathname).toBe("/");
    expect(window.location.hash).toBe("");
    expect(document.body.textContent).toContain("home content");
  });

  it("shows delete buttons only after enabling delete mode", async () => {
    const { initFavoritesPageFeature } =
      await import("../../src/features/favorites/page");

    const repository = createRepository();
    initFavoritesPageFeature(window.location.href, repository);

    expect(
      document.querySelector(
        '[data-remove-type="game"][data-remove-id="game-1"]',
      ),
    ).toBeNull();

    const toggleDelete = document.querySelector(
      "#reviewer-favorites-toggle-delete",
    ) as HTMLButtonElement;
    toggleDelete.click();

    const removeButton = document.querySelector(
      '[data-remove-type="game"][data-remove-id="game-1"]',
    ) as HTMLButtonElement;
    removeButton.click();

    expect(repository.remove).toHaveBeenCalledWith("game", "game-1");
    expect(document.body.textContent).not.toContain("Aggro Final");
  });

  it("edits summary only after enabling edit mode", async () => {
    const { initFavoritesPageFeature } =
      await import("../../src/features/favorites/page");

    const repository = createRepository();
    initFavoritesPageFeature(window.location.href, repository);

    expect(
      document.querySelector('[data-edit-type="game"][data-edit-id="game-1"]'),
    ).toBeNull();

    const toggleEdit = document.querySelector(
      "#reviewer-favorites-toggle-edit",
    ) as HTMLButtonElement;
    toggleEdit.click();

    const editButton = document.querySelector(
      '[data-edit-type="game"][data-edit-id="game-1"]',
    ) as HTMLButtonElement;
    editButton.click();

    const summaryInput = document.querySelector(
      "#reviewer-favorites-summary-editor",
    ) as HTMLTextAreaElement;
    summaryInput.value = "updated summary";

    const saveButton = document.querySelector(
      "#reviewer-favorites-summary-save",
    ) as HTMLButtonElement;
    saveButton.click();

    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(document.body.textContent).toContain("updated summary");
  });

  it("shows the tags column with the expected prefix", async () => {
    const { initFavoritesPageFeature } =
      await import("../../src/features/favorites/page");

    initFavoritesPageFeature(window.location.href, createRepository());

    expect(document.body.textContent).toContain("标签：attack、review");
  });

  it("restores the previous homepage content when cleaned up", async () => {
    const { cleanupFavoritesPage, initFavoritesPageFeature } =
      await import("../../src/features/favorites/page");

    initFavoritesPageFeature(window.location.href, createRepository());
    expect(document.body.textContent).not.toContain("home content");

    cleanupFavoritesPage();

    expect(document.querySelector("#reviewer-favorites-page")).toBeNull();
    expect(document.body.textContent).toContain("home content");
  });
});
