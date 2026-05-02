export const FIXED_RI_OFFSET = -1;
export const SESSION_NOT_FINISHED_ERROR = "SESSION_NOT_FINISHED";

export const UI_RETRY_MAX_COUNT = 20;
export const UI_RETRY_INTERVAL_MS = 200;

export const S2O: ReadonlyArray<ReadonlyArray<number>> = [
  [0, 1, 2, 3],
  [1, 2, 3, 0],
  [2, 3, 0, 1],
  [3, 0, 1, 2],
  [1, 0, 3, 2],
  [0, 3, 2, 1],
  [3, 2, 1, 0],
  [2, 1, 0, 3],
  [2, 3, 1, 0],
  [3, 1, 0, 2],
  [1, 0, 2, 3],
  [0, 2, 3, 1],
  [3, 2, 0, 1],
  [2, 0, 1, 3],
  [0, 1, 3, 2],
  [1, 3, 2, 0],
];
