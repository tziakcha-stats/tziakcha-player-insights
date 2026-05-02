import { fetchTziakchaSession } from "./tziakcha-records";

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

export async function fetchSessionData(
  sessionId: string,
): Promise<SessionData> {
  const session = await fetchTziakchaSession(sessionId);
  return {
    players: session.players,
    records: session.records.map((record) => ({ id: record.id })),
    isFinished: session.isFinished,
  };
}
