import { initDebugState } from "../features/debug/debug-state";
import { bootstrapReviewerDebugQuery } from "../shared/url";
import { installRouteWatcher } from "./route-watcher";
import { runOnRoute } from "./route-runner";

export function bootstrap(): void {
  bootstrapReviewerDebugQuery();
  initDebugState();
  installRouteWatcher(runOnRoute);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runOnRoute, { once: true });
    return;
  }
  runOnRoute();
}
