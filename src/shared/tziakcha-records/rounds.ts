import fetcherSession from "tziakcha-fetcher/session";
import { TziakchaRecordsOptions, TziakchaSessionRounds } from "./types";
import { parseTziakchaSessionId } from "./url";

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
      return options.fetch!(normalizedInput as string, init);
    },
  };
}

export async function fetchTziakchaSessionRounds(
  inputUrlOrId: string,
  options?: TziakchaRecordsOptions,
): Promise<TziakchaSessionRounds> {
  const sessionId = parseTziakchaSessionId(inputUrlOrId);
  if (!sessionId) {
    throw new Error("无法从输入中解析雀渣对局 id");
  }

  const session = await fetcherSession.fetchRounds(
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
      step: record.step as TziakchaSessionRounds["records"][number]["step"],
    })),
    periods: session.periods,
    isFinished: session.isFinished,
  };
}
