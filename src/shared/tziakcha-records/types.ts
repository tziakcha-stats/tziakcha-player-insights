export type TziakchaFetch = typeof globalThis.fetch;

export type TziakchaRecordsOptions = {
  fetch?: TziakchaFetch;
  baseUrl?: string;
  decompressZlibBase64?: (input: string) => Promise<string>;
};

export type TziakchaSessionPlayer = {
  name: string;
  id?: string;
};

export type TziakchaSessionRecord = {
  id: string;
  index: number;
};

export type TziakchaSession = {
  sessionId: string;
  players: TziakchaSessionPlayer[];
  records: TziakchaSessionRecord[];
  periods: number | null;
  isFinished: boolean;
};

export type TziakchaStepPlayer = {
  n?: string;
  i?: string;
};

export type TziakchaStepData = {
  p?: TziakchaStepPlayer[];
  a?: Array<[number, number]>;
  b?: number;
  y?: Array<
    | {
        f?: number;
        t?: Record<string, number>;
      }
    | undefined
  >;
};

export type TziakchaSessionRound = TziakchaSessionRecord & {
  step: TziakchaStepData;
};

export type TziakchaSessionRounds = Omit<TziakchaSession, "records"> & {
  records: TziakchaSessionRound[];
};

export type TziakchaWinFanItem = {
  fanIndex: number;
  fanName: string;
  count: number;
  unitFan: number;
  totalFan: number;
};

export type TziakchaRoundWinInfo = {
  roundNo: number;
  recordId: string;
  winners: Array<{
    playerName: string;
    playerIndex: number;
    totalFan: number;
    fanItems: TziakchaWinFanItem[];
  }>;
  discarders: Array<{
    playerName: string;
    playerIndex: number;
  }>;
  selfDraw: boolean;
};
