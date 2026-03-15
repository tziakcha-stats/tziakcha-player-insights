import { DEBUG_STORAGE_KEY } from "./constants";
import { setLocalStorageItem } from "./storage";
import { warnLog } from "./logger";

export function bootstrapReviewerDebugQuery(): void {
  try {
    const href = window.location.href;
    const normalizedHref = href
      .replace(/？/g, "?")
      .replace(/＆/g, "&")
      .replace("?reviewer_debug=", "&reviewer_debug=");

    if (
      !/[?&]reviewer_debug=/.test(normalizedHref) &&
      normalizedHref === href
    ) {
      return;
    }

    const url = new URL(normalizedHref);
    const debugParam = url.searchParams.get("reviewer_debug");
    if (debugParam === "1" || debugParam === "0") {
      setLocalStorageItem(DEBUG_STORAGE_KEY, debugParam);
    }

    url.searchParams.delete("reviewer_debug");
    const cleanedHref = `${url.origin}${url.pathname}${url.search}${url.hash}`;
    if (cleanedHref !== href) {
      window.history.replaceState(window.history.state, "", cleanedHref);
      warnLog(
        "Normalized reviewer_debug query and removed it from URL to avoid record page parse errors",
      );
    }
  } catch (error) {
    warnLog("Failed to normalize reviewer_debug query", error);
  }
}
