import { infoLog } from "../../shared/logger";

let startedHistoryHref = "";
let startedUserGameHref = "";

export function initHistoryFeature(href: string): boolean {
  if (startedHistoryHref === href) {
    return false;
  }
  startedHistoryHref = href;
  infoLog("History feature init started");
  return true;
}

export function initUserGameFeature(href: string): boolean {
  if (startedUserGameHref === href) {
    return false;
  }
  startedUserGameHref = href;
  infoLog("User game feature init started");
  return true;
}
