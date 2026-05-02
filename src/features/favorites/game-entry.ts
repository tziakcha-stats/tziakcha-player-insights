import { createFavoriteEditor } from "./entry-editor";
import { createFavoritesRepository } from "./storage";
import { FavoriteEntryRepository } from "./types";

const ROOT_ID = "reviewer-game-favorite";
const RETRY_DELAY_MS = 100;
let scheduledGameId = "";

function getGameId(): string | null {
  return new URL(window.location.href).searchParams.get("id");
}

function getGameTitle(): string {
  const heading = document.querySelector("h1");
  const headingText = heading?.textContent?.trim();
  if (headingText) {
    return headingText;
  }
  return document.title || "收藏对局";
}

function createRoot(): HTMLDivElement {
  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.className = "reviewer-favorite-entry";
  root.style.margin = "12px 0";
  root.style.display = "flex";
  root.style.gap = "8px";
  root.style.alignItems = "center";
  root.style.flexWrap = "wrap";
  return root;
}

function findMountTarget(): HTMLElement | null {
  const target = document.querySelector(".table-wrap, table.table, table");
  if (target instanceof HTMLElement) {
    return target;
  }
  return null;
}

function mountIntoTarget(
  repository: FavoriteEntryRepository,
  gameId: string,
  retryCount: number,
): void {
  if (document.getElementById(ROOT_ID)) {
    return;
  }
  const target = findMountTarget();
  if (!target) {
    if (retryCount > 0) {
      window.setTimeout(
        () => mountIntoTarget(repository, gameId, retryCount - 1),
        RETRY_DELAY_MS,
      );
    } else {
      scheduledGameId = "";
    }
    return;
  }
  const root = createRoot();
  const button = document.createElement("button");
  button.id = "reviewer-game-favorite-button";
  button.type = "button";
  button.className = "btn btn-outline-secondary btn-sm";
  const { editor, saveButton, setValue, getTags, summaryInput } =
    createFavoriteEditor("game");

  const refreshState = () => {
    const favorite = repository.get("game", gameId);
    button.textContent = favorite ? "已收藏" : "加入收藏";
    setValue(favorite?.summary ?? "", favorite?.tags ?? []);
  };

  button.disabled = repository.isAvailable() === false;
  refreshState();

  button.addEventListener("click", () => {
    editor.style.display = editor.style.display === "none" ? "flex" : "none";
  });

  saveButton.addEventListener("click", () => {
    const saved = repository.save({
      id: gameId,
      type: "game",
      sourceUrl: window.location.href,
      title: getGameTitle(),
      summary: summaryInput.value.trim(),
      tags: getTags(),
    });
    if (!saved) {
      return;
    }
    editor.style.display = "none";
    refreshState();
  });

  root.appendChild(button);
  root.appendChild(editor);
  target.parentElement?.insertBefore(root, target);
  scheduledGameId = "";
}

export function mountGameFavoriteEntry(
  repository: FavoriteEntryRepository = createFavoritesRepository(),
): boolean {
  const gameId = getGameId();
  if (!gameId) {
    return false;
  }
  if (document.getElementById(ROOT_ID) || scheduledGameId === gameId) {
    return false;
  }
  scheduledGameId = gameId;
  mountIntoTarget(repository, gameId, 20);
  return true;
}
