import { FavoriteType } from "./types";

type EditorElements = {
  editor: HTMLDivElement;
  summaryInput: HTMLTextAreaElement;
  tagInput: HTMLInputElement;
  saveButton: HTMLButtonElement;
  getTags: () => string[];
  setValue: (summary: string, tags: string[]) => void;
};

function normalizeTag(raw: string): string {
  return raw.trim();
}

export function createFavoriteEditor(prefix: FavoriteType): EditorElements {
  const editor = document.createElement("div");
  editor.style.display = "none";
  editor.style.width = "100%";
  editor.style.flexDirection = "column";
  editor.style.gap = "8px";

  const summaryInput = document.createElement("textarea");
  summaryInput.id = `reviewer-${prefix}-favorite-summary`;
  summaryInput.placeholder = "输入摘要";
  summaryInput.rows = 2;
  summaryInput.className = "form-control form-control-sm";

  const tagList = document.createElement("div");
  tagList.className = "d-flex flex-wrap gap-2";

  const tagInput = document.createElement("input");
  tagInput.id = `reviewer-${prefix}-favorite-tag-input`;
  tagInput.type = "text";
  tagInput.placeholder = "输入标签后按回车";
  tagInput.className = "form-control form-control-sm";

  const saveButton = document.createElement("button");
  saveButton.id = `reviewer-${prefix}-favorite-save`;
  saveButton.type = "button";
  saveButton.textContent = "保存";
  saveButton.className = "btn btn-outline-secondary btn-sm align-self-start";

  let tags: string[] = [];

  const renderTags = () => {
    tagList.replaceChildren();
    tags.forEach((tag) => {
      const tagButton = document.createElement("button");
      tagButton.type = "button";
      tagButton.className = "btn btn-outline-secondary btn-sm";
      tagButton.textContent = `${tag} ×`;
      tagButton.addEventListener("click", () => {
        tags = tags.filter((item) => item !== tag);
        renderTags();
      });
      tagList.appendChild(tagButton);
    });
  };

  const commitTag = () => {
    const tag = normalizeTag(tagInput.value);
    if (!tag || tags.includes(tag)) {
      tagInput.value = "";
      return;
    }
    tags = [...tags, tag];
    tagInput.value = "";
    renderTags();
  };

  tagInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== ",") {
      return;
    }
    event.preventDefault();
    commitTag();
  });

  tagInput.addEventListener("blur", () => {
    commitTag();
  });

  editor.appendChild(summaryInput);
  editor.appendChild(tagList);
  editor.appendChild(tagInput);
  editor.appendChild(saveButton);

  return {
    editor,
    summaryInput,
    tagInput,
    saveButton,
    getTags: () => [...tags],
    setValue: (summary: string, nextTags: string[]) => {
      summaryInput.value = summary;
      tags = [...nextTags];
      tagInput.value = "";
      renderTags();
    },
  };
}
