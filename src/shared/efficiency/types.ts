/**
 * 效率分析结果
 */
export interface EfficiencyResult {
  shanten: number;
  isHu: boolean;
  tileCount: number;
  hand: string;
  summary?: Summary;
  discards?: Discard[];
  acceptance?: Draw[];
  elapsedMs: number;
}

/**
 * 摘要信息
 */
export interface Summary {
  shanten: number;
  isTenpai: boolean;
  waits?: number[];
  acceptanceCount: number;
  acceptanceTileCount: number;
  efficiency: number;
  expectedFan?: number;
  avgFan?: number;
  mainFans?: string[];
}

/**
 * 进张信息
 */
export interface Draw {
  tileId: number;
  remainingCount: number;
  shanten: number;
  summary: Summary;
}

/**
 * 打牌选择
 */
export interface Discard {
  discardTileId: number;
  shanten: number;
  summary: Summary;
  tenpai?: Summary;
}

/**
 * 分析选项
 */
export interface AnalysisOptions {
  /** 是否使用快速模式 */
  fast?: boolean;
  /** 最大向听数限制 */
  maxShanten?: number;
  /** 向听数计算模式 */
  shantenModes?: (
    | "normal"
    | "qidui"
    | "shisanyao"
    | "quanbukao"
    | "zuhelong"
  )[];
}

/**
 * 分析模式
 */
export type AnalysisMode = "quick" | "full";
