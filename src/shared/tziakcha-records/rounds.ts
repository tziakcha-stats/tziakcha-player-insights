import { fetchTziakchaRecordStep } from "./record";
import { fetchTziakchaSession } from "./session";
import {
  TziakchaRecordsOptions,
  TziakchaSessionRounds,
  TziakchaSessionRound,
} from "./types";
import { parseTziakchaSessionId } from "./url";

export async function fetchTziakchaSessionRounds(
  inputUrlOrId: string,
  options?: TziakchaRecordsOptions,
): Promise<TziakchaSessionRounds> {
  const sessionId = parseTziakchaSessionId(inputUrlOrId);
  if (!sessionId) {
    throw new Error("无法从输入中解析雀渣对局 id");
  }

  const session = await fetchTziakchaSession(sessionId, options);
  const records = await Promise.all(
    session.records.map<Promise<TziakchaSessionRound>>(async (record) => ({
      ...record,
      step: await fetchTziakchaRecordStep(record.id, options),
    })),
  );

  return {
    ...session,
    records,
  };
}
