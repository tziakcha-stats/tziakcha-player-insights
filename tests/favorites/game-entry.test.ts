import { beforeEach, describe, expect, it, vi } from "vitest";

function createRepository(initialAvailable = true) {
  const items = new Map<
    string,
    { id: string; tags: string[]; title: string; summary: string }
  >();
  let available = initialAvailable;
  return {
    isAvailable: () => available,
    get: (_type: "game", id: string) => items.get(id) ?? null,
    save: (draft: {
      id: string;
      title: string;
      summary: string;
      tags: string[];
    }) => {
      if (!available) {
        return false;
      }
      items.set(draft.id, {
        id: draft.id,
        title: draft.title,
        summary: draft.summary,
        tags: [...draft.tags],
      });
      return true;
    },
    remove: vi.fn(),
  };
}

describe("game favorite entry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <main>
        <h1>Example Game Title</h1>
        <div class="table-wrap">
          <table class="table"><tbody><tr><th>标准分</th></tr></tbody></table>
        </div>
      </main>
    `;
    window.history.replaceState({}, "", "/game?id=game-1");
  });

  it("does not render when the url has no game id", async () => {
    const { mountGameFavoriteEntry } =
      await import("../../src/features/favorites/game-entry");

    window.history.replaceState({}, "", "/game");

    expect(mountGameFavoriteEntry(createRepository())).toBe(false);
    expect(document.querySelector("#reviewer-game-favorite")).toBeNull();
  });

  it("inserts the favorite control only once", async () => {
    const { mountGameFavoriteEntry } =
      await import("../../src/features/favorites/game-entry");

    const repository = createRepository();

    expect(mountGameFavoriteEntry(repository)).toBe(true);
    expect(mountGameFavoriteEntry(repository)).toBe(false);
    expect(document.querySelectorAll("#reviewer-game-favorite")).toHaveLength(
      1,
    );
  });

  it("shows a disabled button when storage is unavailable", async () => {
    const { mountGameFavoriteEntry } =
      await import("../../src/features/favorites/game-entry");

    mountGameFavoriteEntry(createRepository(false));

    const button = document.querySelector(
      "#reviewer-game-favorite-button",
    ) as HTMLButtonElement | null;
    expect(button?.disabled).toBe(true);
  });

  it("saves summary and tag chips and updates the button state", async () => {
    const { mountGameFavoriteEntry } =
      await import("../../src/features/favorites/game-entry");

    const repository = createRepository();
    mountGameFavoriteEntry(repository);

    const toggleButton = document.querySelector(
      "#reviewer-game-favorite-button",
    ) as HTMLButtonElement;
    toggleButton.click();

    const summaryInput = document.querySelector(
      "#reviewer-game-favorite-summary",
    ) as HTMLTextAreaElement;
    summaryInput.value = "这是一个练习总结";

    const tagInput = document.querySelector(
      "#reviewer-game-favorite-tag-input",
    ) as HTMLInputElement;
    tagInput.value = "attack";
    tagInput.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    tagInput.value = "review";
    tagInput.dispatchEvent(
      new KeyboardEvent("keydown", { key: ",", bubbles: true }),
    );

    const saveButton = document.querySelector(
      "#reviewer-game-favorite-save",
    ) as HTMLButtonElement;
    saveButton.click();

    expect(repository.get("game", "game-1")).toEqual({
      id: "game-1",
      title: "Example Game Title",
      summary: "这是一个练习总结",
      tags: ["attack", "review"],
    });
    expect(toggleButton.textContent).toBe("已收藏");
  });

  it("retries until a stable mount target appears", async () => {
    const { mountGameFavoriteEntry } =
      await import("../../src/features/favorites/game-entry");

    document.body.innerHTML = `<main></main>`;
    const repository = createRepository();

    expect(mountGameFavoriteEntry(repository)).toBe(true);
    expect(document.querySelector("#reviewer-game-favorite")).toBeNull();

    document.body.innerHTML = `
      <main>
        <h1>Late Game Title</h1>
        <div class="table-wrap"></div>
      </main>
    `;
    vi.runAllTimers();

    expect(document.querySelector("#reviewer-game-favorite")).not.toBeNull();
  });
});
