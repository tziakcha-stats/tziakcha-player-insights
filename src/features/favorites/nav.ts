import { w } from "../../shared/env";
import { getFavoritesHref } from "./route";

const FAVORITES_NAV_ID = "reviewer-favorites-nav-item";
const NAV_RETRY_DELAY_MS = 100;

function findNavContainer(): HTMLElement | null {
  const selectors = [".navbar-nav", "ul.navbar-nav", ".nav", "nav ul"];
  for (const selector of selectors) {
    const found = document.querySelector(selector);
    if (found instanceof HTMLElement) {
      return found;
    }
  }
  return null;
}

export function ensureFavoritesNavItem(): boolean {
  if (document.getElementById(FAVORITES_NAV_ID)) {
    return false;
  }

  const container = findNavContainer();
  if (!container) {
    return false;
  }

  const item = document.createElement("li");
  item.id = FAVORITES_NAV_ID;
  item.className = "nav-item";

  const link = document.createElement("a");
  link.className = "nav-link";
  link.href = getFavoritesHref(w.location.href);
  link.textContent = "收藏";

  item.appendChild(link);
  container.appendChild(item);
  return true;
}

export function installFavoritesNavItem(retryCount = 20): boolean {
  if (ensureFavoritesNavItem()) {
    return true;
  }
  if (document.getElementById(FAVORITES_NAV_ID)) {
    return false;
  }
  if (retryCount > 0) {
    w.setTimeout(
      () => installFavoritesNavItem(retryCount - 1),
      NAV_RETRY_DELAY_MS,
    );
    return true;
  }
  return false;
}
