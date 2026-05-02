import { infoLog } from "../../shared/logger";
import { w } from "../../shared/env";
import { mountRecordFavoriteEntry } from "../favorites/record-entry";
import { installRecordJsonParseGuard } from "./guards";
import { initReviewer } from "./reviewer/init";
import { setReviewError } from "./reviewer/state";
import { interceptTZ } from "./tz-interceptor";

let startedRecordHref = "";

export function initRecordFeature(href: string): boolean {
  if (startedRecordHref === href) {
    return false;
  }
  startedRecordHref = href;
  infoLog("Record feature init started");

  installRecordJsonParseGuard();
  interceptTZ();

  if (typeof unsafeWindow === "undefined") {
    setReviewError("未能进入页面上下文，可能脚本被沙箱隔离");
  }

  w.setTimeout(initReviewer, 500);
  w.setTimeout(() => mountRecordFavoriteEntry(), 550);

  return true;
}
