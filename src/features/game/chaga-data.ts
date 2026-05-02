import { ReviewResponseItem } from "../record/reviewer/types";
import { fetchChagaReviewData } from "../../shared/chaga-review";

/**
 * 负责读取 CHAGA 评测数据
 */
export async function fetchAiResponse(
  sessionId: string,
  seat: number,
): Promise<ReviewResponseItem[]> {
  const result = await fetchChagaReviewData(sessionId, seat);
  return result.rows as ReviewResponseItem[];
}
