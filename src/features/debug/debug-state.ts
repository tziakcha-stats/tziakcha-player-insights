import { DEBUG_STORAGE_KEY } from "../../shared/constants";
import { w } from "../../shared/env";
import { getLocalStorageItem, setLocalStorageItem } from "../../shared/storage";

let debugEnabled = false;

function detectDebugEnabled(): boolean {
  try {
    if (/\?reviewer_debug=1(?:&|$)/.test(w.location.href)) {
      return true;
    }
    const query = new URLSearchParams(w.location.search);
    if (query.get("reviewer_debug") === "1") {
      return true;
    }
    return getLocalStorageItem(DEBUG_STORAGE_KEY) === "1";
  } catch (_error) {
    return false;
  }
}

export function initDebugState(): void {
  debugEnabled = detectDebugEnabled();
  w.__reviewerDebug = {
    isEnabled: () => debugEnabled,
    setEnabled: (enabled: boolean) => {
      debugEnabled = Boolean(enabled);
      setLocalStorageItem(DEBUG_STORAGE_KEY, debugEnabled ? "1" : "0");
      console.log(`[Reviewer] Debug ${debugEnabled ? "enabled" : "disabled"}`);
      return debugEnabled;
    },
  };
}

export function isDebugEnabled(): boolean {
  return debugEnabled;
}
