import { beforeEach, describe, expect, it, vi } from "vitest";

function createRepository(initialAvailable = true) {
  const items = new Map<
    string,
    { id: string; tags: string[]; title: string; summary: string }
  >();
  let available = initialAvailable;
  return {
    isAvailable: () => available,
    get: (_type: "record", id: string) => items.get(id) ?? null,
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

describe("record favorite entry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <main>
        <div id="ctrl"></div>
        <div id="ti"><a href="/game?id=game-parent-1">南四局 1234 点对局</a></div>
        <title>Record Review Title</title>
      </main>
    `;
    window.history.replaceState({}, "", "/record?id=record-1");
  });

  it("does not render when the url has no record id", async () => {
    const { mountRecordFavoriteEntry } =
      await import("../../src/features/favorites/record-entry");

    window.history.replaceState({}, "", "/record");

    expect(mountRecordFavoriteEntry(createRepository())).toBe(false);
    expect(document.querySelector("#reviewer-record-favorite")).toBeNull();
  });

  it("mounts into the reviewer controls after retries", async () => {
    const { mountRecordFavoriteEntry } =
      await import("../../src/features/favorites/record-entry");

    document.body.innerHTML = `<main></main>`;
    const repository = createRepository();

    expect(mountRecordFavoriteEntry(repository)).toBe(true);
    expect(document.querySelector("#reviewer-record-favorite")).toBeNull();

    document.body.innerHTML = `<main><div id="ctrl"></div></main>`;
    vi.runAllTimers();

    expect(document.querySelectorAll("#reviewer-record-favorite")).toHaveLength(
      1,
    );
  });

  it("shows a disabled button when storage is unavailable", async () => {
    const { mountRecordFavoriteEntry } =
      await import("../../src/features/favorites/record-entry");

    mountRecordFavoriteEntry(createRepository(false));
    vi.runAllTimers();

    const button = document.querySelector(
      "#reviewer-record-favorite-button",
    ) as HTMLButtonElement | null;
    expect(button?.disabled).toBe(true);
  });

  it("saves summary and reflects the favorited state", async () => {
    const { mountRecordFavoriteEntry } =
      await import("../../src/features/favorites/record-entry");

    const repository = createRepository();
    mountRecordFavoriteEntry(repository);
    vi.runAllTimers();

    const toggleButton = document.querySelector(
      "#reviewer-record-favorite-button",
    ) as HTMLButtonElement;
    toggleButton.click();

    const summaryInput = document.querySelector(
      "#reviewer-record-favorite-summary",
    ) as HTMLTextAreaElement;
    summaryInput.value = "复盘备注";

    const tagInput = document.querySelector(
      "#reviewer-record-favorite-tag-input",
    ) as HTMLInputElement;
    tagInput.value = "study";
    tagInput.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    tagInput.value = "defense";
    tagInput.dispatchEvent(
      new KeyboardEvent("keydown", { key: ",", bubbles: true }),
    );

    const saveButton = document.querySelector(
      "#reviewer-record-favorite-save",
    ) as HTMLButtonElement;
    saveButton.click();

    expect(repository.get("record", "record-1")).toEqual({
      id: "record-1",
      title: "南四局 1234 点对局",
      summary: "复盘备注",
      tags: ["study", "defense"],
    });
    expect(toggleButton.textContent).toBe("已收藏");
  });
});
