import { infoLog } from "../../shared/logger";
import { w } from "../../shared/env";
import { initHistoryVisit } from "./visit-linker";

let startedHistoryHref = "";
let startedUserGameHref = "";

export function initHistoryFeature(href: string): boolean {
  if (startedHistoryHref === href) {
    return false;
  }
  startedHistoryHref = href;
  infoLog("History feature init started");
  w.setTimeout(() => initHistoryVisit(false), 300);
  return true;
}

export function initUserGameFeature(href: string): boolean {
  if (startedUserGameHref === href) {
    return false;
  }
  startedUserGameHref = href;
  infoLog("User game feature init started");
  w.setTimeout(() => initHistoryVisit(true), 300);
  return true;
}
