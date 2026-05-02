import {
  collectFavoritesByTab,
  filterFavorites,
  listTagsForTab,
} from "./filter";
import { createFavoritesRepository } from "./storage";
import { FavoriteItem, FavoritesPageRepository } from "./types";

const ROOT_ID = "reviewer-favorites-page";
let mountedTarget: HTMLElement | null = null;
let previousNodes: ChildNode[] | null = null;

function getMountTarget(): HTMLElement {
  const target = document.querySelector("main");
  if (target instanceof HTMLElement) {
    return target;
  }
  return document.body;
}

function createButton(id: string, text: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.id = id;
  button.type = "button";
  button.textContent = text;
  return button;
}

function getItemKey(item: FavoriteItem): string {
  return `${item.type}:${item.id}`;
}

export function buildFavoritesExportFilename(now = new Date()): string {
  const pad2 = (value: number) => String(value).padStart(2, "0");
  return `favorites-${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}-${pad2(now.getHours())}${pad2(now.getMinutes())}${pad2(now.getSeconds())}.json`;
}

function renderList(
  container: HTMLElement,
  items: FavoriteItem[],
  editingKey: string | null,
  showEditControls: boolean,
  showDeleteControls: boolean,
  onStartEdit: (item: FavoriteItem) => void,
  onCancelEdit: () => void,
  onSaveSummary: (item: FavoriteItem, summary: string) => void,
  onRemove: (item: FavoriteItem) => void,
): void {
  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "text-secondary mb-0";
    empty.textContent = "当前条件下没有收藏";
    container.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("tr");
    const itemKey = getItemKey(item);
    const link = document.createElement("a");
    link.href = item.sourceUrl;
    link.textContent = item.title;
    link.target = "_blank";

    const titleCell = document.createElement("td");
    titleCell.appendChild(link);

    const summaryCell = document.createElement("td");
    if (editingKey === itemKey) {
      const summaryEditor = document.createElement("textarea");
      summaryEditor.id = "reviewer-favorites-summary-editor";
      summaryEditor.className = "form-control form-control-sm";
      summaryEditor.rows = 2;
      summaryEditor.value = item.summary;
      summaryCell.appendChild(summaryEditor);
    } else {
      summaryCell.textContent = item.summary || "-";
    }

    const tagsCell = document.createElement("td");
    tagsCell.textContent = `标签：${item.tags.join("、") || "-"}`;

    const actionCell = document.createElement("td");
    if (editingKey === itemKey) {
      const saveButton = document.createElement("button");
      saveButton.type = "button";
      saveButton.id = "reviewer-favorites-summary-save";
      saveButton.className = "btn btn-outline-secondary btn-sm me-2";
      saveButton.textContent = "保存";
      saveButton.addEventListener("click", () => {
        const editor = summaryCell.querySelector(
          "#reviewer-favorites-summary-editor",
        ) as HTMLTextAreaElement | null;
        onSaveSummary(item, editor?.value ?? "");
      });

      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.className = "btn btn-outline-secondary btn-sm";
      cancelButton.textContent = "取消";
      cancelButton.addEventListener("click", onCancelEdit);

      actionCell.appendChild(saveButton);
      actionCell.appendChild(cancelButton);
    } else {
      if (showEditControls) {
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "btn btn-outline-secondary btn-sm me-2";
        editButton.dataset.editType = item.type;
        editButton.dataset.editId = item.id;
        editButton.textContent = "编辑";
        editButton.addEventListener("click", () => onStartEdit(item));
        actionCell.appendChild(editButton);
      }

      if (showDeleteControls) {
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "btn btn-outline-danger btn-sm";
        removeButton.dataset.removeType = item.type;
        removeButton.dataset.removeId = item.id;
        removeButton.textContent = "删除";
        removeButton.addEventListener("click", () => onRemove(item));
        actionCell.appendChild(removeButton);
      }
    }

    card.appendChild(titleCell);
    card.appendChild(summaryCell);
    card.appendChild(tagsCell);
    card.appendChild(actionCell);
    container.appendChild(card);
  });
}

function snapshotTarget(target: HTMLElement): void {
  if (mountedTarget === target && previousNodes) {
    return;
  }
  mountedTarget = target;
  previousNodes = Array.from(target.childNodes);
}

export function cleanupFavoritesPage(): void {
  const existing = document.getElementById(ROOT_ID);
  existing?.remove();
  if (mountedTarget && previousNodes) {
    mountedTarget.replaceChildren(...previousNodes);
  }
  mountedTarget = null;
  previousNodes = null;
}

async function readFileText(file: File): Promise<string> {
  if (typeof file.text === "function") {
    return file.text();
  }
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(String(reader.result ?? ""));
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error("Failed to read file"));
    };
    reader.readAsText(file);
  });
}

export function initFavoritesPageFeature(
  _href: string,
  repository: FavoritesPageRepository = createFavoritesRepository(),
): boolean {
  const mountTarget = getMountTarget();
  snapshotTarget(mountTarget);
  cleanupFavoritesPage();
  snapshotTarget(mountTarget);

  const root = document.createElement("section");
  root.id = ROOT_ID;
  const container = document.createElement("div");
  container.className = "container";
  container.style.minHeight = "50em";
  const spacer = document.createElement("div");
  spacer.style.height = "4em";
  container.appendChild(spacer);

  const card = document.createElement("div");
  card.className = "card";
  card.style.margin = "1em 0";
  const cardBody = document.createElement("div");
  cardBody.className = "card-body";
  card.appendChild(cardBody);
  container.appendChild(card);
  root.appendChild(container);

  const heading = document.createElement("h3");
  heading.className = "text-center";
  heading.textContent = "收藏";
  cardBody.appendChild(heading);

  const notice = document.createElement("p");
  notice.className = "text-secondary text-center";
  notice.textContent =
    "提示：此收藏功能为非官方实现，数据仅保存在当前浏览器本地。";
  cardBody.appendChild(notice);

  if (!repository.isAvailable()) {
    const unavailable = document.createElement("p");
    unavailable.className = "text-center text-secondary";
    unavailable.textContent = "收藏功能当前不可用";
    cardBody.appendChild(unavailable);
    mountTarget.replaceChildren(root);
    return true;
  }

  const toolbar = document.createElement("div");
  toolbar.className = "d-flex flex-wrap gap-2 align-items-center mb-3";
  const backButton = createButton("reviewer-favorites-back", "返回主页");
  backButton.className = "btn btn-outline-secondary btn-sm";
  const gameTabButton = createButton("reviewer-favorites-tab-game", "对局收藏");
  gameTabButton.className = "btn btn-outline-secondary btn-sm";
  const recordTabButton = createButton(
    "reviewer-favorites-tab-record",
    "小局收藏",
  );
  recordTabButton.className = "btn btn-outline-secondary btn-sm";
  const toggleEditButton = createButton(
    "reviewer-favorites-toggle-edit",
    "编辑",
  );
  toggleEditButton.className = "btn btn-outline-secondary btn-sm";
  const toggleDeleteButton = createButton(
    "reviewer-favorites-toggle-delete",
    "删除",
  );
  toggleDeleteButton.className = "btn btn-outline-secondary btn-sm";
  const exportButton = createButton("reviewer-favorites-export", "导出");
  exportButton.className = "btn btn-outline-secondary btn-sm";
  const importButton = createButton("reviewer-favorites-import", "导入");
  importButton.className = "btn btn-outline-secondary btn-sm";
  const searchInput = document.createElement("input");
  searchInput.id = "reviewer-favorites-search";
  searchInput.type = "search";
  searchInput.placeholder = "搜索标题、摘要、标签";
  searchInput.className = "form-control form-control-sm";
  searchInput.style.maxWidth = "18em";

  const importInput = document.createElement("input");
  importInput.id = "reviewer-favorites-import-input";
  importInput.type = "file";
  importInput.accept = "application/json";
  importInput.style.display = "none";

  toolbar.appendChild(backButton);
  toolbar.appendChild(gameTabButton);
  toolbar.appendChild(recordTabButton);
  toolbar.appendChild(toggleEditButton);
  toolbar.appendChild(toggleDeleteButton);
  toolbar.appendChild(exportButton);
  toolbar.appendChild(importButton);
  toolbar.appendChild(searchInput);
  toolbar.appendChild(importInput);
  cardBody.appendChild(toolbar);

  const feedback = document.createElement("p");
  feedback.className = "text-secondary";
  cardBody.appendChild(feedback);

  const tagBar = document.createElement("div");
  tagBar.className = "d-flex flex-wrap gap-2 mb-3";
  cardBody.appendChild(tagBar);

  const tableWrap = document.createElement("div");
  tableWrap.className = "table-responsive";
  const table = document.createElement("table");
  table.className = "table table-sm table-hover";
  table.style.tableLayout = "fixed";
  const thead = document.createElement("thead");
  thead.className = "table-dark";
  thead.innerHTML =
    "<tr><th>标题</th><th>摘要</th><th>标签</th><th>操作</th></tr>";
  const list = document.createElement("tbody");
  table.appendChild(thead);
  table.appendChild(list);
  tableWrap.appendChild(table);
  cardBody.appendChild(tableWrap);

  const selectedTags = new Set<string>();
  let searchQuery = "";
  let editingKey: string | null = null;
  let showEditControls = false;
  let showDeleteControls = false;

  const render = () => {
    const documentState = repository.read();
    const activeTab = documentState.ui.activeTab;
    const activeItems = collectFavoritesByTab(documentState, activeTab);
    const visibleTags = listTagsForTab(activeItems);
    const filtered = filterFavorites(
      activeItems,
      [...selectedTags],
      searchQuery,
    );

    gameTabButton.disabled = activeTab === "game";
    recordTabButton.disabled = activeTab === "record";
    toggleEditButton.classList.toggle("active", showEditControls);
    toggleDeleteButton.classList.toggle("active", showDeleteControls);

    tagBar.replaceChildren();
    visibleTags.forEach((tag) => {
      const tagButton = document.createElement("button");
      tagButton.type = "button";
      tagButton.dataset.tag = tag;
      tagButton.textContent = tag;
      tagButton.className = "btn btn-outline-secondary btn-sm";
      tagButton.setAttribute(
        "aria-pressed",
        selectedTags.has(tag) ? "true" : "false",
      );
      tagButton.addEventListener("click", () => {
        if (selectedTags.has(tag)) {
          selectedTags.delete(tag);
        } else {
          selectedTags.add(tag);
        }
        render();
      });
      tagBar.appendChild(tagButton);
    });

    list.replaceChildren();
    renderList(
      list,
      filtered,
      editingKey,
      showEditControls,
      showDeleteControls,
      (item) => {
        editingKey = getItemKey(item);
        render();
      },
      () => {
        editingKey = null;
        render();
      },
      (item, summary) => {
        repository.save({
          id: item.id,
          type: item.type,
          sourceUrl: item.sourceUrl,
          title: item.title,
          summary: summary.trim(),
          tags: item.tags,
        });
        editingKey = null;
        render();
      },
      (item) => {
        repository.remove(item.type, item.id);
        if (editingKey === getItemKey(item)) {
          editingKey = null;
        }
        render();
      },
    );
  };

  backButton.addEventListener("click", () => {
    cleanupFavoritesPage();
    window.history.pushState(window.history.state, "", "/");
  });

  gameTabButton.addEventListener("click", () => {
    repository.setActiveTab("game");
    selectedTags.clear();
    editingKey = null;
    render();
  });

  recordTabButton.addEventListener("click", () => {
    repository.setActiveTab("record");
    selectedTags.clear();
    editingKey = null;
    render();
  });

  toggleEditButton.addEventListener("click", () => {
    showEditControls = !showEditControls;
    if (!showEditControls) {
      editingKey = null;
    }
    render();
  });

  toggleDeleteButton.addEventListener("click", () => {
    showDeleteControls = !showDeleteControls;
    render();
  });

  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    render();
  });

  exportButton.addEventListener("click", () => {
    const documentState = repository.exportDocument();
    const blob = new Blob([JSON.stringify(documentState, null, 2)], {
      type: "application/json",
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = buildFavoritesExportFilename();
    if (!window.navigator.userAgent.includes("jsdom")) {
      link.click();
    }
    URL.revokeObjectURL(href);
  });

  importButton.addEventListener("click", () => {
    importInput.click();
  });

  importInput.addEventListener("change", async () => {
    const file = importInput.files?.[0];
    if (!file) {
      return;
    }
    try {
      const parsed = JSON.parse(await readFileText(file));
      const result = repository.importDocument(parsed);
      feedback.textContent = `新增 ${result.added} 合并 ${result.merged} 失败 ${result.invalid}`;
      render();
    } catch (_error) {
      feedback.textContent = "导入失败";
    }
  });

  mountTarget.replaceChildren(root);
  render();
  return true;
}
