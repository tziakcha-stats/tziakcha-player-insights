import fetcherSession from "tziakcha-fetcher/session";
import { TziakchaRecordsOptions, TziakchaSession } from "./types";

function normalizeOptions(
  options?: TziakchaRecordsOptions,
): TziakchaRecordsOptions | undefined {
  if (!options?.fetch || options.baseUrl) {
    return options;
  }

  return {
    ...options,
    fetch: (input, init) => {
      const normalizedInput =
        typeof input === "string" && input.startsWith("https://tziakcha.net/")
          ? input.slice("https://tziakcha.net".length)
          : input;
      const headers =
        init && "headers" in init && init.headers
          ? (init.headers as Record<string, unknown>)
          : undefined;
      const normalizedInit =
        headers && Object.keys(headers).length === 0
          ? { ...init, headers: undefined }
          : init;
      return options.fetch!(normalizedInput as string, {
        ...normalizedInit,
      });
    },
  };
}

export async function fetchTziakchaSession(
  sessionId: string,
  options?: TziakchaRecordsOptions,
): Promise<TziakchaSession> {
  const session = await fetcherSession.fetch(
    sessionId,
    normalizeOptions(options),
  );
  return {
    sessionId: session.sessionId,
    players: session.players.map((player) => ({
      name: player.name,
      id:
        typeof player.id === "string" || typeof player.id === "number"
          ? String(player.id)
          : undefined,
    })),
    records: session.records.map((record) => ({
      id: record.id,
      index: record.index,
    })),
    periods: session.periods,
    isFinished: session.isFinished,
  };
}
