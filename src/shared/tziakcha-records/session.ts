import {
  TziakchaRecordsOptions,
  TziakchaSession,
  TziakchaSessionPlayer,
  TziakchaSessionRecord,
} from "./types";

type TziakchaSessionRaw = {
  players?: unknown[];
  records?: unknown[];
  finish_time?: unknown;
  finishTime?: unknown;
  finished?: unknown;
  isFinished?: unknown;
  progress?: unknown;
  periods?: unknown;
};

function getFetch(options?: TziakchaRecordsOptions): typeof fetch {
  return options?.fetch ?? fetch;
}

function buildUrl(path: string, options?: TziakchaRecordsOptions): string {
  return options?.baseUrl ? new URL(path, options.baseUrl).toString() : path;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function extractPlayers(raw: TziakchaSessionRaw): TziakchaSessionPlayer[] {
  if (!Array.isArray(raw.players)) {
    return [];
  }
  return raw.players.map((item) => {
    const player = item as {
      n?: string;
      name?: string;
      i?: string;
      id?: string;
    };
    return {
      name: player.n || player.name || "",
      id: player.i || player.id,
    };
  });
}

function extractRecords(raw: TziakchaSessionRaw): TziakchaSessionRecord[] {
  if (!Array.isArray(raw.records)) {
    return [];
  }
  return raw.records
    .map((item, index) => {
      const record = item as { id?: string; i?: string };
      const id = record.id || record.i;
      return id ? { id, index } : null;
    })
    .filter((item): item is TziakchaSessionRecord => Boolean(item));
}

function isFinished(
  raw: TziakchaSessionRaw,
  records: TziakchaSessionRecord[],
  periods: number | null,
): boolean {
  if (periods !== null && periods > 0) {
    return records.length === periods;
  }

  if (raw.finished === true || raw.isFinished === true) {
    return true;
  }

  const finishTime = asNumber(raw.finish_time ?? raw.finishTime);
  if (finishTime !== null && finishTime > 0) {
    return true;
  }

  const progress = asNumber(raw.progress);
  if (progress !== null && periods !== null && periods > 0) {
    return progress >= periods - 1;
  }

  return false;
}

export async function fetchTziakchaSession(
  sessionId: string,
  options?: TziakchaRecordsOptions,
): Promise<TziakchaSession> {
  const response = await getFetch(options)(
    buildUrl(`/_qry/game/?id=${encodeURIComponent(sessionId)}`, options),
    {
      method: "POST",
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for /_qry/game/`);
  }

  const raw = (await response.json()) as TziakchaSessionRaw;
  const records = extractRecords(raw);
  const periods = asNumber(raw.periods);
  return {
    sessionId,
    players: extractPlayers(raw),
    records,
    periods,
    isFinished: isFinished(raw, records, periods),
  };
}
