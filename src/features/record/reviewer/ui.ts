import { w } from "../../../shared/env";
import { infoLog } from "../../../shared/logger";
import "./ui.less";
import {
  ReviewerRenderRuntime,
  showCandidates,
  startStepWatcher,
} from "./render";

function toggleUserInfo(hide: boolean): void {
  const nameElements = document.querySelectorAll(".name");
  const eloElements = document.querySelectorAll(".elo");

  if (hide) {
    nameElements.forEach((el, index) => {
      const htmlEl = el as HTMLElement;
      const currentText = htmlEl.textContent?.trim() ?? "";
      if (!/^用户\d+$/.test(currentText)) {
        htmlEl.dataset.originalName = currentText;
      }
      htmlEl.textContent = `用户${index + 1}`;
    });

    eloElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const eloValSpan = htmlEl.querySelector(".elo-val");
      if (eloValSpan) {
        htmlEl.dataset.originalElo =
          (eloValSpan as HTMLElement).textContent ?? "";
      }
      htmlEl.style.display = "none";
    });
    return;
  }

  nameElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const currentText = htmlEl.textContent?.trim() ?? "";
    if (/^用户\d+$/.test(currentText) && htmlEl.dataset.originalName) {
      htmlEl.textContent = htmlEl.dataset.originalName;
    }
    delete htmlEl.dataset.originalName;
  });

  eloElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.display = "";
    const eloValSpan = htmlEl.querySelector(".elo-val");
    if (eloValSpan && htmlEl.dataset.originalElo) {
      (eloValSpan as HTMLElement).textContent = htmlEl.dataset.originalElo;
    }
    delete htmlEl.dataset.originalElo;
  });
}

function clearUserInfoCache(): void {
  document.querySelectorAll(".name").forEach((el) => {
    delete (el as HTMLElement).dataset.originalName;
  });
}

export function createReviewerUI(runtime: ReviewerRenderRuntime): void {
  const ctrl = document.getElementById("ctrl");
  if (!ctrl) {
    setTimeout(() => createReviewerUI(runtime), 100);
    return;
  }
  if (document.getElementById("review")) {
    return;
  }

  let hideUserInfo = false;

  const ctrlRtDiv = document.createElement("div");
  ctrlRtDiv.classList.add("ctrl-rt", "fs-sm");

  const buildCheckbox = (
    id: string,
    label: string,
    checked: boolean,
    onChange: (checkedState: boolean) => void,
  ) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("ctrl-e", "no-sel");
    const checkboxLabel = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = id;
    checkbox.checked = checked;
    checkbox.addEventListener("change", (event) => {
      onChange((event.target as HTMLInputElement).checked);
    });
    const labelText = document.createElement("span");
    labelText.classList.add("ml-02em");
    labelText.innerText = label;
    checkboxLabel.appendChild(checkbox);
    checkboxLabel.appendChild(labelText);
    wrapper.appendChild(checkboxLabel);
    return wrapper;
  };

  ctrlRtDiv.appendChild(
    buildCheckbox(
      "cb-highlight-first-tile",
      "高亮首选牌",
      runtime.options.highlightFirstTile,
      (checked) => {
        runtime.options.highlightFirstTile = checked;
        showCandidates(runtime);
      },
    ),
  );

  ctrlRtDiv.appendChild(
    buildCheckbox(
      "cb-show-weight-bars",
      "显示权重条",
      runtime.options.showWeightBars,
      (checked) => {
        runtime.options.showWeightBars = checked;
        showCandidates(runtime);
      },
    ),
  );

  ctrlRtDiv.appendChild(
    buildCheckbox(
      "cb-hide-user-info",
      "隐藏用户信息",
      hideUserInfo,
      (checked) => {
        hideUserInfo = checked;
        toggleUserInfo(hideUserInfo);
      },
    ),
  );

  const logDiv = document.createElement("div");
  logDiv.classList.add("fs-sm");
  const logSpan = document.createElement("span");
  logSpan.id = "review-log";
  logDiv.appendChild(logSpan);
  ctrlRtDiv.appendChild(logDiv);

  const reviewDiv = document.createElement("div");
  reviewDiv.classList.add("fs-sm", "review-container");
  const bgImage = document.createElement("img");
  bgImage.className = "review-bg-image";
  bgImage.src =
    "https://cdn.jsdelivr.net/gh/Choimoe/chaga-reviewer-script/doc/img/icon.png";
  bgImage.onerror = function onError() {
    const img = this as HTMLImageElement;
    img.onerror = null;
    img.src = "https://s2.loli.net/2026/01/12/JV3yI89rnRzO1E4.png";
  };
  reviewDiv.appendChild(bgImage);
  const reviewSpan = document.createElement("span");
  reviewSpan.id = "review";
  reviewDiv.appendChild(reviewSpan);
  ctrlRtDiv.appendChild(reviewDiv);
  ctrl.appendChild(ctrlRtDiv);

  const resetHideUserInfo = () => {
    if (!hideUserInfo) {
      return;
    }
    const hideInfoCheckbox = document.getElementById(
      "cb-hide-user-info",
    ) as HTMLInputElement | null;
    if (hideInfoCheckbox) {
      hideInfoCheckbox.checked = false;
    }
    hideUserInfo = false;
    toggleUserInfo(false);
    clearUserInfoCache();
  };

  const hookViewChange = () => {
    const viewSelect = document.getElementById("view") as
      | (HTMLSelectElement & {
          onchange?: ((this: GlobalEventHandlers, ev: Event) => unknown) | null;
        })
      | null;
    if (!viewSelect) {
      return;
    }
    const originalOnChange = viewSelect.onchange;
    viewSelect.onchange = function onViewChange(event: Event) {
      resetHideUserInfo();
      if (originalOnChange) {
        return originalOnChange.call(this, event);
      }
      return undefined;
    };
  };

  const hookButtons = () => {
    const buttonIds = ["nextstp", "prevstp", "ffstp", "frstp", "next", "prev"];
    buttonIds.forEach((id) => {
      const btn = document.getElementById(id) as
        | (HTMLElement & {
            onclick?:
              | ((this: GlobalEventHandlers, ev: Event) => unknown)
              | null;
          })
        | null;
      if (!btn) {
        return;
      }
      if (btn.onclick) {
        const original = btn.onclick;
        btn.onclick = function patchedClick(event: Event) {
          if (id === "next" || id === "prev") {
            resetHideUserInfo();
          }
          const result = original.call(this, event);
          w.setTimeout(() => showCandidates(runtime), 50);
          return result;
        };
      }
      btn.addEventListener(
        "click",
        () => {
          if (id === "next" || id === "prev") {
            resetHideUserInfo();
          }
          w.setTimeout(() => showCandidates(runtime), 50);
        },
        { passive: true },
      );
    });
  };

  w.setTimeout(hookViewChange, 500);
  w.setTimeout(hookButtons, 500);
  startStepWatcher(runtime);
  infoLog("UI elements created");
}
