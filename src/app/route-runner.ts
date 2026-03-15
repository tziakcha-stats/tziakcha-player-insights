import { w } from "../shared/env";
import { logCurrentCookie } from "../shared/cookie";
import { debugLog } from "../shared/logger";
import { initHistoryFeature, initUserGameFeature } from "../features/history";
import { initRecordFeature } from "../features/record";
import { initTechFeature } from "../features/tech";
import {
  isHistoryPage,
  isRecordPage,
  isTechPage,
  isUserGamePage,
} from "../shared/route";

type RouteState = {
  lastHref: string;
};

const routeState: RouteState = {
  lastHref: "",
};

export function runOnRoute(): void {
  const href = w.location.href;
  if (routeState.lastHref === href) {
    return;
  }

  routeState.lastHref = href;
  const routeFlags = {
    record: isRecordPage(),
    tech: isTechPage(),
    history: isHistoryPage(),
    userGame: isUserGamePage(),
  };

  debugLog("Route changed", {
    href,
    pathname: w.location.pathname,
    routeFlags,
  });
  logCurrentCookie();

  if (routeFlags.record) {
    if (initRecordFeature(href)) {
      debugLog("Record route init dispatched");
    }
    return;
  }

  if (routeFlags.tech) {
    if (initTechFeature(href)) {
      debugLog("Tech route init dispatched");
    }
    return;
  }

  if (routeFlags.history) {
    if (initHistoryFeature(href)) {
      debugLog("History route init dispatched");
    }
    return;
  }

  if (routeFlags.userGame) {
    if (initUserGameFeature(href)) {
      debugLog("User game route init dispatched");
    }
  }
}
