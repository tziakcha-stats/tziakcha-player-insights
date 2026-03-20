export type Candidate = [number, string];

export interface ReviewResponseItem {
  rr: number;
  ri: number;
  extra?: {
    candidates?: Candidate[];
  };
}

export interface ReviewApiError {
  code?: number;
  message?: string;
}

export interface TZStatItem {
  k?: number;
}

export interface TZLikeInstance {
  stp?: number;
  stat?: TZStatItem[];
  adapt?: () => void;
  fetch?: (
    id: string,
    seat: number,
    v?: string | null,
    cy?: string | null,
  ) => void;
}

export interface ReviewerRenderOptions {
  highlightFirstTile: boolean;
  showWeightBars: boolean;
}

export interface ReviewerPoolSnapshotItem {
  tiles: string[];
}
