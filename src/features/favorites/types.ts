export type FavoriteType = "game" | "record";

export type FavoriteTab = FavoriteType;

export type FavoriteItem = {
  id: string;
  type: FavoriteType;
  sourceUrl: string;
  title: string;
  summary: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type FavoriteDraft = Omit<FavoriteItem, "createdAt" | "updatedAt">;

export type FavoritesDocument = {
  version: 1;
  updatedAt: string;
  ui: {
    activeTab: FavoriteTab;
  };
  games: FavoriteItem[];
  records: FavoriteItem[];
};

export type FavoritesImportResult = {
  added: number;
  merged: number;
  invalid: number;
};
