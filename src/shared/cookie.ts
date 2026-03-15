import { infoLog, warnLog } from "./logger";

export function logCurrentCookie(): void {
  try {
    const cookieText = document.cookie || "(empty)";
    infoLog("Current page cookie", cookieText);
  } catch (error) {
    warnLog("Failed to read cookie", error);
  }
}
