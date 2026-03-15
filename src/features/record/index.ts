import { infoLog } from "../../shared/logger";

let startedRecordHref = "";

export function initRecordFeature(href: string): boolean {
  if (startedRecordHref === href) {
    return false;
  }
  startedRecordHref = href;
  infoLog("Record feature init started");
  return true;
}
