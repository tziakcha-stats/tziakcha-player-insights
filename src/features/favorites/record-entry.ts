import { w } from "../../shared/env";
import { createFavoriteEditor } from "./entry-editor";
import { createFavoritesRepository } from "./storage";
import { FavoriteEntryRepository } from "./types";

const ROOT_ID = "reviewer-record-favorite";
const RETRY_DELAY_MS = 100;

function getRecordId(): string | null {
  return new URL(w.location.href).searchParams.get("id");
}

function getRecordTitle(): string {
  const gameAnchor = document.querySelector("#ti a");
  const gameTitle = gameAnchor?.textContent?.trim();
  if (gameTitle) {
    return gameTitle;
  }
  const titleEl = document.querySelector("title");
  const titleText = titleEl?.textContent?.trim();
  if (titleText) {
    return titleText;
  }
  return document.title || "收藏小局";
}

function createRoot(): HTMLDivElement {
  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.className = "ctrl-e";
  root.style.display = "flex";
  root.style.gap = "8px";
  root.style.alignItems = "center";
  root.style.flexWrap = "wrap";
  return root;
}

function mountIntoCtrl(
  repository: FavoriteEntryRepository,
  recordId: string,
  retryCount: number,
): void {
  if (document.getElementById(ROOT_ID)) {
    return;
  }

  const ctrl = document.getElementById("ctrl");
  if (!ctrl) {
    if (retryCount > 0) {
      w.setTimeout(
        () => mountIntoCtrl(repository, recordId, retryCount - 1),
        RETRY_DELAY_MS,
      );
    }
    return;
  }

  const root = createRoot();
  const button = document.createElement("button");
  button.id = "reviewer-record-favorite-button";
  button.type = "button";
  button.className = "btn btn-outline-secondary btn-sm";
  const { editor, saveButton, setValue, getTags, summaryInput } =
    createFavoriteEditor("record");

  const refreshState = () => {
    const favorite = repository.get("record", recordId);
    button.textContent = favorite ? "已收藏" : "加入收藏";
    setValue(favorite?.summary ?? "", favorite?.tags ?? []);
  };

  button.disabled = !repository.isAvailable();
  refreshState();

  button.addEventListener("click", () => {
    editor.style.display = editor.style.display === "none" ? "flex" : "none";
  });

  saveButton.addEventListener("click", () => {
    const saved = repository.save({
      id: recordId,
      type: "record",
      sourceUrl: w.location.href,
      title: getRecordTitle(),
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
  ctrl.appendChild(root);
}

export function mountRecordFavoriteEntry(
  repository: FavoriteEntryRepository = createFavoritesRepository(),
): boolean {
  const recordId = getRecordId();
  if (!recordId) {
    return false;
  }
  mountIntoCtrl(repository, recordId, 10);
  return true;
}
