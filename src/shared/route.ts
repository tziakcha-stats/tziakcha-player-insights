import { w } from "./env";
import { FAVORITES_HASH } from "../features/favorites/route";

export function isRecordPage(): boolean {
  return /^\/record(?:\/|$)/.test(w.location.pathname);
}

export function isGamePage(): boolean {
  return /^\/game(?:\/|$)/.test(w.location.pathname);
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

export function isFavoritesPage(): boolean {
  return w.location.hash === FAVORITES_HASH;
}
