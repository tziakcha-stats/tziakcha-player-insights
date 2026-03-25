import { w } from "../../shared/env";
import {
  FavoriteDraft,
  FavoriteItem,
  FavoritesDocument,
  FavoritesImportResult,
  FavoriteTab,
  FavoriteType,
} from "./types";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const FAVORITES_STORAGE_KEY = "tzi-reviewer:favorites";
const MAX_TAG_LENGTH = 20;
const MAX_TAG_COUNT = 20;

function createEmptyDocument(
  now = new Date().toISOString(),
): FavoritesDocument {
  return {
    version: 1,
    updatedAt: now,
    ui: {
      activeTab: "game",
    },
    games: [],
    records: [],
  };
}

function isFavoriteType(value: unknown): value is FavoriteType {
  return value === "game" || value === "record";
}

function normalizeTags(tags: string[]): string[] {
  return Array.from(
    new Set(
      tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .map((tag) => tag.slice(0, MAX_TAG_LENGTH)),
    ),
  )
    .sort((left, right) => left.localeCompare(right))
    .slice(0, MAX_TAG_COUNT);
}

function pickLonger(localValue: string, importedValue: string): string {
  if (!localValue) {
    return importedValue;
  }
  if (!importedValue) {
    return localValue;
  }
  if (importedValue.length > localValue.length) {
    return importedValue;
  }
  return localValue;
}

function sanitizeItem(value: unknown): FavoriteItem | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const item = value as Partial<FavoriteItem>;
  if (
    typeof item.id !== "string" ||
    !isFavoriteType(item.type) ||
    typeof item.sourceUrl !== "string" ||
    typeof item.title !== "string" ||
    typeof item.summary !== "string" ||
    !Array.isArray(item.tags) ||
    typeof item.createdAt !== "string" ||
    typeof item.updatedAt !== "string"
  ) {
    return null;
  }
  return {
    id: item.id,
    type: item.type,
    sourceUrl: item.sourceUrl,
    title: item.title,
    summary: item.summary,
    tags: normalizeTags(
      item.tags.filter((tag): tag is string => typeof tag === "string"),
    ),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function sanitizeItems(values: unknown): {
  items: FavoriteItem[];
  invalid: number;
} {
  if (!Array.isArray(values)) {
    return {
      items: [],
      invalid: 0,
    };
  }

  return values.reduce(
    (result, value) => {
      const item = sanitizeItem(value);
      if (!item) {
        result.invalid += 1;
        return result;
      }
      result.items.push(item);
      return result;
    },
    {
      items: [] as FavoriteItem[],
      invalid: 0,
    },
  );
}

function sanitizeDocument(value: unknown): FavoritesDocument {
  if (!value || typeof value !== "object") {
    return createEmptyDocument();
  }
  const raw = value as Partial<FavoritesDocument>;
  const games = sanitizeItems(raw.games).items;
  const records = sanitizeItems(raw.records).items;
  return {
    version: 1,
    updatedAt:
      typeof raw.updatedAt === "string"
        ? raw.updatedAt
        : new Date().toISOString(),
    ui: {
      activeTab: raw.ui?.activeTab === "record" ? "record" : "game",
    },
    games,
    records,
  };
}

function sanitizeImportDocument(value: unknown): {
  document: FavoritesDocument;
  invalid: number;
} {
  if (!value || typeof value !== "object") {
    return {
      document: createEmptyDocument(),
      invalid: 0,
    };
  }
  const raw = value as Partial<FavoritesDocument>;
  const games = sanitizeItems(raw.games);
  const records = sanitizeItems(raw.records);
  return {
    document: {
      version: 1,
      updatedAt:
        typeof raw.updatedAt === "string"
          ? raw.updatedAt
          : new Date().toISOString(),
      ui: {
        activeTab: raw.ui?.activeTab === "record" ? "record" : "game",
      },
      games: games.items,
      records: records.items,
    },
    invalid: games.invalid + records.invalid,
  };
}

function cloneDocument(document: FavoritesDocument): FavoritesDocument {
  return {
    version: 1,
    updatedAt: document.updatedAt,
    ui: {
      activeTab: document.ui.activeTab,
    },
    games: document.games.map((item) => ({ ...item, tags: [...item.tags] })),
    records: document.records.map((item) => ({
      ...item,
      tags: [...item.tags],
    })),
  };
}

function getBucket(
  document: FavoritesDocument,
  type: FavoriteType,
): FavoriteItem[] {
  return type === "game" ? document.games : document.records;
}

function upsertItem(
  document: FavoritesDocument,
  draft: FavoriteDraft,
  now: string,
): FavoriteItem {
  const bucket = getBucket(document, draft.type);
  const existingIndex = bucket.findIndex((item) => item.id === draft.id);
  if (existingIndex >= 0) {
    const existing = bucket[existingIndex];
    const nextItem: FavoriteItem = {
      ...existing,
      sourceUrl: draft.sourceUrl,
      title: draft.title,
      summary: draft.summary,
      tags: normalizeTags(draft.tags),
      updatedAt: now,
    };
    bucket.splice(existingIndex, 1, nextItem);
    return nextItem;
  }

  const nextItem: FavoriteItem = {
    ...draft,
    tags: normalizeTags(draft.tags),
    createdAt: now,
    updatedAt: now,
  };
  bucket.push(nextItem);
  return nextItem;
}

export function createFavoritesRepository(
  storage: StorageLike | null = w.localStorage,
) {
  let available = true;
  try {
    storage?.getItem(FAVORITES_STORAGE_KEY);
  } catch (_error) {
    available = false;
  }

  function read(): FavoritesDocument {
    if (!available || !storage) {
      return createEmptyDocument();
    }
    try {
      const raw = storage.getItem(FAVORITES_STORAGE_KEY);
      if (!raw) {
        return createEmptyDocument();
      }
      return sanitizeDocument(JSON.parse(raw));
    } catch (_error) {
      return createEmptyDocument();
    }
  }

  function write(document: FavoritesDocument): boolean {
    if (!available || !storage) {
      return false;
    }
    try {
      storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(document));
      return true;
    } catch (_error) {
      available = false;
      return false;
    }
  }

  return {
    isAvailable(): boolean {
      return available;
    },

    read(): FavoritesDocument {
      return cloneDocument(read());
    },

    get(type: FavoriteType, id: string): FavoriteItem | null {
      return (
        read()[type === "game" ? "games" : "records"].find(
          (item) => item.id === id,
        ) ?? null
      );
    },

    save(draft: FavoriteDraft, now = new Date().toISOString()): boolean {
      const document = read();
      document.updatedAt = now;
      upsertItem(document, draft, now);
      return write(document);
    },

    remove(
      type: FavoriteType,
      id: string,
      now = new Date().toISOString(),
    ): boolean {
      const document = read();
      const bucket = getBucket(document, type);
      const nextBucket = bucket.filter((item) => item.id !== id);
      if (nextBucket.length === bucket.length) {
        return false;
      }
      document.updatedAt = now;
      if (type === "game") {
        document.games = nextBucket;
      } else {
        document.records = nextBucket;
      }
      return write(document);
    },

    importDocument(
      value: unknown,
      now = new Date().toISOString(),
    ): FavoritesImportResult {
      const incoming = sanitizeImportDocument(value);
      const document = read();
      const result: FavoritesImportResult = {
        added: 0,
        merged: 0,
        invalid: incoming.invalid,
      };

      const mergeOne = (item: FavoriteItem) => {
        const bucket = getBucket(document, item.type);
        const existingIndex = bucket.findIndex((entry) => entry.id === item.id);
        if (existingIndex < 0) {
          bucket.push({ ...item, tags: normalizeTags(item.tags) });
          result.added += 1;
          return;
        }
        const existing = bucket[existingIndex];
        bucket.splice(existingIndex, 1, {
          ...existing,
          sourceUrl: pickLonger(existing.sourceUrl, item.sourceUrl),
          title: pickLonger(existing.title, item.title),
          summary: pickLonger(existing.summary, item.summary),
          tags: normalizeTags([...existing.tags, ...item.tags]),
          createdAt:
            existing.createdAt && item.createdAt
              ? existing.createdAt <= item.createdAt
                ? existing.createdAt
                : item.createdAt
              : existing.createdAt || item.createdAt,
          updatedAt: now,
        });
        result.merged += 1;
      };

      incoming.document.games.forEach(mergeOne);
      incoming.document.records.forEach(mergeOne);
      document.updatedAt = now;
      write(document);
      return result;
    },

    exportDocument(): FavoritesDocument {
      return cloneDocument(read());
    },

    setActiveTab(tab: FavoriteTab): boolean {
      const document = read();
      document.ui.activeTab = tab;
      document.updatedAt = new Date().toISOString();
      return write(document);
    },
  };
}
