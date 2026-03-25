import { FavoriteItem, FavoritesDocument, FavoriteTab } from "./types";

export function collectFavoritesByTab(
  document: FavoritesDocument,
  activeTab: FavoriteTab,
): FavoriteItem[] {
  return activeTab === "game" ? [...document.games] : [...document.records];
}

export function listTagsForTab(items: FavoriteItem[]): string[] {
  return Array.from(new Set(items.flatMap((item) => item.tags))).sort(
    (left, right) => left.localeCompare(right),
  );
}

export function filterFavorites(
  items: FavoriteItem[],
  selectedTags: string[],
  query: string,
): FavoriteItem[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return items.filter((item) => {
    if (selectedTags.length > 0) {
      const hasAllTags = selectedTags.every((tag) => item.tags.includes(tag));
      if (!hasAllTags) {
        return false;
      }
    }
    if (!normalizedQuery) {
      return true;
    }
    const searchText = [item.title, item.summary, ...item.tags]
      .join(" ")
      .toLocaleLowerCase();
    return searchText.includes(normalizedQuery);
  });
}
