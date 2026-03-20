export type SessionPlayer = {
  name: string;
  id?: string;
};

export type SessionRecord = {
  id: string;
};

export type SessionData = {
  players: SessionPlayer[];
  records: SessionRecord[];
  isFinished: boolean;
};

type SessionRaw = {
  players?: unknown[];
  records?: unknown[];
  finish_time?: unknown;
  finishTime?: unknown;
  finished?: unknown;
  isFinished?: unknown;
  progress?: unknown;
  periods?: unknown;
};

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

function extractSessionPlayers(raw: SessionRaw): SessionPlayer[] {
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

function extractSessionRecords(raw: SessionRaw): SessionRecord[] {
  if (!Array.isArray(raw.records)) {
    return [];
  }
  return raw.records
    .map((item) => {
      const record = item as { id?: string; i?: string };
      const id = record.id || record.i;
      return id ? { id } : null;
    })
    .filter((item): item is SessionRecord => Boolean(item));
}

function isSessionFinished(raw: SessionRaw, records: SessionRecord[]): boolean {
  const periods = asNumber(raw.periods);
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

export async function fetchSessionData(
  sessionId: string,
): Promise<SessionData> {
  const response = await fetch(
    `/_qry/game/?id=${encodeURIComponent(sessionId)}`,
    {
      method: "POST",
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for /_qry/game/`);
  }
  const raw = (await response.json()) as SessionRaw;
  const records = extractSessionRecords(raw);
  return {
    players: extractSessionPlayers(raw),
    records,
    isFinished: isSessionFinished(raw, records),
  };
}
