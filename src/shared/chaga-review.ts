export type ChagaCandidate = [number, string];

export interface ChagaReviewResponseItem {
  rr: number;
  ri: number;
  extra?: {
    candidates?: ChagaCandidate[];
  };
}

export interface ChagaReviewApiError {
  code?: number;
  message?: string;
}

type ChagaReviewPayload =
  | ChagaReviewApiError
  | ChagaReviewResponseItem[]
  | { data?: ChagaReviewResponseItem[] };

export type ChagaReviewFetchResult = {
  rows: ChagaReviewResponseItem[];
  errorMessage?: string;
};

function normalizeRows(payload: ChagaReviewPayload): ChagaReviewResponseItem[] {
  return Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { data?: ChagaReviewResponseItem[] }).data)
      ? ((payload as { data?: ChagaReviewResponseItem[] })
          .data as ChagaReviewResponseItem[])
      : [];
}

function getApiErrorMessage(payload: ChagaReviewPayload): string | undefined {
  if (
    typeof payload !== "object" ||
    payload === null ||
    Array.isArray(payload)
  ) {
    return undefined;
  }
  const codeValue = (payload as ChagaReviewApiError).code;
  if (codeValue === undefined || codeValue === null) {
    return undefined;
  }
  const numericCode = Number(codeValue);
  if (!Number.isFinite(numericCode) || numericCode === 0) {
    return undefined;
  }
  return (payload as ChagaReviewApiError).message || "未知错误";
}

/**
 * 读取 CHAGA 评测接口，并统一解析返回结果。
 */
export async function fetchChagaReviewData(
  sessionId: string,
  seat: number,
): Promise<ChagaReviewFetchResult> {
  const response = await fetch(
    `https://tc-api.pesiu.org/review/?id=${encodeURIComponent(sessionId)}&seat=${seat}`,
    { credentials: "omit" },
  );
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for CHAGA API`);
  }
  const payload = (await response.json()) as ChagaReviewPayload;
  const errorMessage = getApiErrorMessage(payload);
  return {
    rows: normalizeRows(payload),
    errorMessage,
  };
}
