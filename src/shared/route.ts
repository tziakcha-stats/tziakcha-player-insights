import { w } from "./env";

export function isRecordPage(): boolean {
  return /^\/record(?:\/|$)/.test(w.location.pathname);
}

export function isTechPage(): boolean {
  return /^\/user\/tech(?:\/|$)/.test(w.location.pathname);
}

export function isHistoryPage(): boolean {
  return /^\/history(?:\/|$)/.test(w.location.pathname);
}

export function isUserGamePage(): boolean {
  return /^\/user\/game(?:\/|$)/.test(w.location.pathname);
}
