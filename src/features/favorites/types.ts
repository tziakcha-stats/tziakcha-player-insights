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

export type FavoriteEntryView = Pick<
  FavoriteItem,
  "id" | "title" | "summary" | "tags"
>;

export type FavoriteEntryRepository = {
  isAvailable(): boolean;
  get(type: FavoriteType, id: string): FavoriteEntryView | null;
  save(draft: FavoriteDraft, now?: string): boolean;
};

export type FavoritesPageRepository = Pick<
  {
    isAvailable(): boolean;
    read(): FavoritesDocument;
    save(draft: FavoriteDraft, now?: string): boolean;
    remove(type: FavoriteType, id: string, now?: string): boolean;
    importDocument(value: unknown, now?: string): FavoritesImportResult;
    exportDocument(): FavoritesDocument;
    setActiveTab(tab: FavoriteTab): boolean | void;
  },
  | "isAvailable"
  | "read"
  | "save"
  | "remove"
  | "importDocument"
  | "exportDocument"
  | "setActiveTab"
>;
