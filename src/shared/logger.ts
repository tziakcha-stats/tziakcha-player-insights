import { isDebugEnabled } from "../features/debug/debug-state";

export function debugLog(message: string, payload?: unknown): void {
  if (!isDebugEnabled()) {
    return;
  }
  if (typeof payload === "undefined") {
    console.log("[Reviewer][Debug]", message);
    return;
  }
  console.log("[Reviewer][Debug]", message, payload);
}

export function infoLog(message: string, payload?: unknown): void {
  if (typeof payload === "undefined") {
    console.log("[Reviewer]", message);
    return;
  }
  console.log("[Reviewer]", message, payload);
}

export function warnLog(message: string, payload?: unknown): void {
  if (typeof payload === "undefined") {
    console.warn("[Reviewer]", message);
    return;
  }
  console.warn("[Reviewer]", message, payload);
}
