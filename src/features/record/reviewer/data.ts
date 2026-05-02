import { infoLog, warnLog } from "../../../shared/logger";
import { fetchChagaReviewData } from "../../../shared/chaga-review";
import { fetchSessionData } from "../../../shared/session-data";
import {
  getFilledReviews,
  getReviews,
  getReviewSeats,
  setReviewError,
} from "./state";
import { parseRound, ReviewerRenderRuntime, showCandidates } from "./render";
import { ReviewResponseItem } from "./types";

export function fillEmptyValues(): void {
  const reviews = getReviews();
  const filled = getFilledReviews();

  Object.keys(reviews).forEach((key) => {
    filled[key] = reviews[key] as ReviewResponseItem;
  });

  const byRound: Record<number, Record<number, ReviewResponseItem>> = {};
  Object.keys(reviews).forEach((key) => {
    const [rr, ri] = key.split("-").map(Number);
    if (!byRound[rr]) {
      byRound[rr] = {};
    }
    byRound[rr][ri] = reviews[key] as ReviewResponseItem;
  });

  Object.keys(byRound).forEach((roundKey) => {
    const round = Number(roundKey);
    const steps = byRound[round];
    const riValues = Object.keys(steps)
      .map(Number)
      .sort((a, b) => a - b);
    if (!riValues.length) {
      return;
    }

    const maxRi = Math.max(...riValues);
    let lastValue: ReviewResponseItem | null = null;
    for (let ri = Math.min(...riValues); ri <= maxRi; ri += 1) {
      if (steps[ri]) {
        lastValue = steps[ri] as ReviewResponseItem;
      } else if (lastValue) {
        filled[`${round}-${ri}`] = lastValue;
        lastValue = null;
      }
    }
  });

  infoLog("Empty values filled");
}

export function loadReviewData(runtime: ReviewerRenderRuntime): void {
  const tiEl = document.getElementById("ti");
  if (!tiEl || !tiEl.children[0]) {
    setTimeout(() => loadReviewData(runtime), 100);
    return;
  }

  setReviewError("");
  const anchor = tiEl.children[0] as HTMLAnchorElement;
  const gameId = anchor.href.split("=").at(-1);
  const roundEl = document.getElementById("round");
  if (!roundEl || !gameId) {
    setTimeout(() => loadReviewData(runtime), 100);
    return;
  }

  const round = parseRound(roundEl.innerHTML, runtime.wind);
  infoLog(`Loading review data for game: ${gameId}, round: ${round}`);

  void fetchSessionData(gameId)
    .then((sessionData) => {
      if (!sessionData.isFinished) {
        setReviewError("等待对局完成后可查看AI评分");
        infoLog(`Review data skipped: game not finished (${gameId})`);
        return;
      }

      let loadedCount = 0;
      const seats = getReviewSeats();
      const reviews = getReviews();

      for (let seat = 0; seat <= 3; seat += 1) {
        if (seats[seat]) {
          continue;
        }

        seats[seat] = 1;
        fetchChagaReviewData(gameId, seat)
          .then(({ rows, errorMessage }) => {
            if (errorMessage) {
              seats[seat] = 0;
              setReviewError(`评测接口错误：seat ${seat} - ${errorMessage}`);
              warnLog(
                `Error fetching review data for seat ${seat}`,
                errorMessage,
              );
              return;
            }

            rows.forEach((row) => {
              if (row.ri) {
                reviews[`${row.rr}-${row.ri}`] = row as ReviewResponseItem;
              }
            });

            seats[seat] = 2;
            loadedCount += 1;
            infoLog(`Download finish for seat ${seat}`);

            if (loadedCount === 4) {
              fillEmptyValues();
            }
            showCandidates(runtime);
          })
          .catch((error) => {
            seats[seat] = 0;
            setReviewError(`评测接口连接失败：seat ${seat}`);
            warnLog(`Download failed for seat ${seat}`, error);
          });
      }

      showCandidates(runtime);
    })
    .catch((error) => {
      setReviewError("对局状态读取失败，请稍后重试");
      warnLog("Failed to load game session status", error);
    });
}
