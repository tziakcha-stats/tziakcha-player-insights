export interface EfficiencySummary {
  shanten: number;
  isTenpai: boolean;
  waits: string[];
  acceptanceCount: number;
  acceptanceTileCount: number;
  efficiency: number;
  expectedFan?: number;
  avgFan?: number;
  mainFans?: string[];
}

export interface EfficiencyResult {
  shanten: number;
  isHu: boolean;
  tileCount: number;
  hand: string;
  summary?: EfficiencySummary;
  elapsedMs: number;
}
