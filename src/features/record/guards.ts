import { w } from "../../shared/env";
import { warnLog } from "../../shared/logger";
import { isRecordPage } from "../../shared/route";

type GuardedJsonParse = ((input: unknown, ...args: unknown[]) => unknown) & {
  __reviewer_guarded?: boolean;
};

export function installRecordJsonParseGuard(): void {
  if (!isRecordPage()) {
    return;
  }

  try {
    if (typeof JSON.parse !== "function") {
      return;
    }

    const originalParse = JSON.parse as GuardedJsonParse;
    if (originalParse.__reviewer_guarded) {
      return;
    }

    const guardedParse: GuardedJsonParse = function (
      input: unknown,
      ...args: unknown[]
    ): unknown {
      if (typeof input !== "string") {
        if (input && typeof input === "object") {
          return input;
        }
        if (input == null) {
          return input;
        }
        return input;
      }

      return originalParse.call(this, input, ...args);
    };

    guardedParse.__reviewer_guarded = true;
    JSON.parse = guardedParse as JSON["parse"];
    warnLog("Installed JSON.parse compatibility guard for record page");
  } catch (error) {
    warnLog("Failed to install JSON.parse guard", error);
  }
}
