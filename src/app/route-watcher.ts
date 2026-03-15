import { w } from "../shared/env";
import { debugLog } from "../shared/logger";

export function installRouteWatcher(notifyRouteChanged: () => void): void {
  const notify = () => setTimeout(notifyRouteChanged, 0);

  w.addEventListener("popstate", notify);
  w.addEventListener("hashchange", notify);
  w.addEventListener("urlchange", notify);

  const historyObj = w.history;
  if (!historyObj || historyObj.__reviewer_route_hooked) {
    return;
  }

  const originalPushState = historyObj.pushState;
  const originalReplaceState = historyObj.replaceState;

  historyObj.pushState = function (...args: Parameters<History["pushState"]>) {
    const result = originalPushState.apply(this, args);
    notify();
    return result;
  };

  historyObj.replaceState = function (
    ...args: Parameters<History["replaceState"]>
  ) {
    const result = originalReplaceState.apply(this, args);
    notify();
    return result;
  };

  historyObj.__reviewer_route_hooked = true;
  debugLog("Route watcher installed", { hooked: true });
}
