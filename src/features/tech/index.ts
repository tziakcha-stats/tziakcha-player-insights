import { infoLog } from "../../shared/logger";

let startedTechHref = "";

export function initTechFeature(href: string): boolean {
  if (startedTechHref === href) {
    return false;
  }
  startedTechHref = href;
  infoLog("Tech feature init started");
  return true;
}
