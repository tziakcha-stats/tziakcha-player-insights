import { WinFanItem } from "./win-info";
import { StepData } from "./step-data";

export type RoundWinInfo = {
  roundNo: number;
  totalFan: number;
  fanItems: WinFanItem[];
};

export type RoundOutcome = {
  roundNo: number;
  winners: Array<{
    playerName: string;
    totalFan: number;
    fanItems: WinFanItem[];
  }>;
  discarderNames: string[];
  selfDraw: boolean;
};

export type PlayerMetric = {
  playerName: string;
  matched: number;
  total: number;
  ratio: number;
  chagaSum: number;
  chagaCount: number;
  chagaAvg: number;
  winRounds: RoundWinInfo[];
};

export type MetricsResult = {
  players: PlayerMetric[];
  rounds: RoundOutcome[];
  overall: {
    matched: number;
    total: number;
    ratio: number;
    chagaAvg: number;
  };
};

export type PreparedSessionData = {
  sessionPlayerNames: string[];
  steps: StepData[];
};
