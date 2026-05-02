declare module "tziakcha-fetcher/url" {
  const urlApi: {
    parseTziakchaSessionId(input: unknown): string | null;
  };
  export = urlApi;
}

declare module "tziakcha-fetcher/session" {
  export type FetcherOptions = {
    baseUrl?: string;
    fetch?: (
      input: string,
      init?: Record<string, unknown>,
    ) => Promise<{
      ok: boolean;
      status: number;
      json(): Promise<unknown>;
    }>;
    headers?: Record<string, string>;
    decompressZlibBase64?: (input: string) => Promise<string>;
  };

  export type Session = {
    sessionId: string;
    players: Array<{ name: string; id?: string | number }>;
    records: Array<{ id: string; index: number }>;
    periods: number | null;
    isFinished: boolean;
    raw: Record<string, unknown>;
  };

  export type SessionRounds = Omit<Session, "records"> & {
    records: Array<{
      id: string;
      index: number;
      step: Record<string, unknown>;
    }>;
  };

  const sessionApi: {
    fetch(sessionId: string, options?: FetcherOptions): Promise<Session>;
    fetchRounds(
      inputUrlOrId: string,
      options?: FetcherOptions,
    ): Promise<SessionRounds>;
  };
  export = sessionApi;
}

declare module "tziakcha-fetcher/record" {
  export type FetcherOptions = {
    baseUrl?: string;
    fetch?: (
      input: string,
      init?: Record<string, unknown>,
    ) => Promise<{
      ok: boolean;
      status: number;
      json(): Promise<unknown>;
    }>;
    headers?: Record<string, string>;
    decompressZlibBase64?: (input: string) => Promise<string>;
  };

  export type StepData = Record<string, unknown>;
  export type WinFanItem = {
    fanIndex: number;
    fanName: string;
    count: number;
    unitFan: number;
    totalFan: number;
  };

  export type RoundWinInfo = {
    roundNo: number;
    recordId: string;
    winners: Array<{
      playerName: string;
      playerIndex: number;
      totalFan: number;
      fanItems: WinFanItem[];
    }>;
    discarders: Array<{
      playerName: string;
      playerIndex: number;
    }>;
    selfDraw: boolean;
  };

  const recordApi: {
    decompress(input: string): Promise<string>;
    fetchStep(recordId: string, options?: FetcherOptions): Promise<StepData>;
    parseWinFanItems(raw: unknown): WinFanItem[];
    extractWins(session: {
      sessionId?: string;
      players?: Array<{ name?: string; n?: string }>;
      records?: Array<{ id: string; index: number; step?: StepData }>;
    }): RoundWinInfo[];
  };
  export = recordApi;
}

declare module "tziakcha-fetcher/record/win" {
  const winApi: {
    FAN_NAMES: string[];
    SEAT_PLAYER_ORDERS: number[][];
    parseTziakchaWinFanItems(raw: unknown): Array<{
      fanIndex: number;
      fanName: string;
      count: number;
      unitFan: number;
      totalFan: number;
    }>;
    extractTziakchaRoundWinInfos(session: {
      sessionId?: string;
      players?: Array<{ name?: string; n?: string }>;
      records?: Array<{
        id: string;
        index: number;
        step?: Record<string, unknown>;
      }>;
    }): Array<{
      roundNo: number;
      recordId: string;
      winners: Array<{
        playerName: string;
        playerIndex: number;
        totalFan: number;
        fanItems: Array<{
          fanIndex: number;
          fanName: string;
          count: number;
          unitFan: number;
          totalFan: number;
        }>;
      }>;
      discarders: Array<{
        playerName: string;
        playerIndex: number;
      }>;
      selfDraw: boolean;
    }>;
  };
  export = winApi;
}
