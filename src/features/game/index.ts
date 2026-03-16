import { w } from "../../shared/env";
import { infoLog, warnLog } from "../../shared/logger";
import {
  computeMetrics,
  computeRoundOutcomes,
  prepareSessionData,
} from "./data-metrics";
import { SESSION_NOT_FINISHED_ERROR } from "./constants";
import {
  installRoundToggleButtons,
  upsertLoadingRows,
  upsertMetricsRows,
  upsertPendingRow,
} from "./ui-render";

let startedGameHref = "";

function getGameIdFromUrl(): string | null {
  const url = new URL(w.location.href);
  return url.searchParams.get("id");
}

export function initGameFeature(href: string): boolean {
  if (startedGameHref === href) {
    return false;
  }
  startedGameHref = href;
  const sessionId = getGameIdFromUrl();
  if (!sessionId) {
    warnLog("Game feature init skipped: missing session id");
    return false;
  }
  infoLog("Game feature init started", { sessionId });
  upsertLoadingRows("计算中...");
  const preparedPromise = prepareSessionData(sessionId);

  void preparedPromise
    .then((prepared) => {
      const rounds = computeRoundOutcomes(
        prepared.sessionPlayerNames,
        prepared.steps,
      );
      installRoundToggleButtons(rounds);
    })
    .catch((error) => {
      if ((error as Error)?.message === SESSION_NOT_FINISHED_ERROR) {
        upsertPendingRow("等待对局完成");
        return;
      }
      warnLog("Game rounds preview failed", error);
    });

  void computeMetrics(sessionId)
    .then((metrics) => {
      upsertMetricsRows(metrics);
      installRoundToggleButtons(metrics.rounds);
    })
    .catch((error) => {
      if ((error as Error)?.message === SESSION_NOT_FINISHED_ERROR) {
        upsertPendingRow("等待对局完成");
        return;
      }
      warnLog("Game overview metrics failed", error);
      upsertLoadingRows("加载失败");
    });
  return true;
}
