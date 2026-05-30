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
