import { w } from "../../shared/env";

export const FAVORITES_HASH = "#reviewer-favorites";

export function isFavoritesHash(href: string): boolean {
  try {
    return new URL(href).hash === FAVORITES_HASH;
  } catch (_error) {
    return false;
  }
}

export function getFavoritesHref(href = w.location.href): string {
  const url = new URL(href);
  return `${url.origin}/${FAVORITES_HASH}`;
}
