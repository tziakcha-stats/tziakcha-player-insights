import { w } from "../../../shared/env";
import { infoLog } from "../../../shared/logger";
import { createReviewerUI } from "./ui";
import { loadReviewData } from "./data";
import { ReviewerRenderRuntime } from "./render";
import {
  ensureReviewStores,
  getTZInstance,
  setReviewError,
  clearReviewError,
} from "./state";
import { tryForceCreateTZ } from "../tz-interceptor";

export function initReviewer(): void {
  const hasWind = Array.isArray(w.WIND);
  const hasTile = Array.isArray(w.TILE);
  if (!hasWind || !hasTile) {
    infoLog("Waiting for game constants...");
    setTimeout(initReviewer, 100);
    return;
  }

  ensureReviewStores();

  let lastStep: number | null = null;
  const runtime: ReviewerRenderRuntime = {
    wind: w.WIND as string[],
    tile: w.TILE as string[],
    options: {
      highlightFirstTile: true,
      showWeightBars: true,
    },
    getLastStep: () => lastStep,
    setLastStep: (value: number) => {
      lastStep = value;
    },
  };

  createReviewerUI(runtime);
  loadReviewData(runtime);

  setTimeout(() => {
    const tz = getTZInstance();
    if (tz) {
      clearReviewError();
      return;
    }
    const created = tryForceCreateTZ();
    if (created) {
      clearReviewError();
      return;
    }
    setReviewError("未捕获牌局实例，可能浏览器或脚本管理器限制了注入");
  }, 1000);
}
