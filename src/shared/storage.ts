import { w } from "./env";

export function getLocalStorageItem(key: string): string | null {
  try {
    return w.localStorage?.getItem(key) ?? null;
  } catch (_error) {
    return null;
  }
}

export function setLocalStorageItem(key: string, value: string): void {
  try {
    w.localStorage?.setItem(key, value);
  } catch (_error) {
    // noop
  }
}
