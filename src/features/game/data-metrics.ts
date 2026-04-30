import { fetchSessionData } from "../../shared/session-data";
import {
  extractTziakchaRoundWinInfos,
  TziakchaSessionRounds,
} from "../../shared/tziakcha-records";
import { ReviewResponseItem } from "../record/reviewer/types";
import { calcChagaScore, choiceMatchesAi } from "./chaga-score";
import { fetchAiResponse } from "./chaga-data";
import { extractChoices } from "./step-simulator";
import { fetchStepData, StepData } from "./step-data";
import {
  FIXED_RI_OFFSET,
  S2O,
  SESSION_NOT_FINISHED_ERROR,
} from "./game-constants";
import {
  MetricsResult,
  PlayerMetric,
  PreparedSessionData,
  RoundOutcome,
} from "./types";

function buildResponseMap(
  responseRows: ReviewResponseItem[],
  roundIndex: number,
): Map<number, ReviewResponseItem> {
  const responseMap = new Map<number, ReviewResponseItem>();
  responseRows.forEach((row) => {
    if (row.rr !== roundIndex || typeof row.ri !== "number") {
      return;
    }
    if (!responseMap.has(row.ri)) {
      responseMap.set(row.ri, row);
    }
  });
  return responseMap;
}

function getSeatToPlayerOrder(roundNo: number): ReadonlyArray<number> {
  if (!S2O.length) {
    return [0, 1, 2, 3];
  }
  return (
    S2O[((roundNo % S2O.length) + S2O.length) % S2O.length] || [0, 1, 2, 3]
  );
}

export async function prepareSessionData(
  sessionId: string,
): Promise<PreparedSessionData> {
  const sessionData = await fetchSessionData(sessionId);

  const sessionPlayerNames = sessionData.players.map(
    (player, index) => player.name || `Seat ${index}`,
  );
  const steps = await Promise.all(
    sessionData.records.map((record) => fetchStepData(record.id)),
  );

  return {
    sessionPlayerNames,
    steps,
    isFinished: sessionData.isFinished,
  };
}

export function computeRoundOutcomes(
  sessionPlayerNames: string[],
  steps: StepData[],
  playerMetrics?: PlayerMetric[],
): RoundOutcome[] {
  const session: TziakchaSessionRounds = {
    sessionId: "",
    players: sessionPlayerNames.map((name) => ({ name })),
    records: steps.map((step, index) => ({
      id: String(index),
      index,
      step,
    })),
    periods: steps.length,
    isFinished: true,
  };

  return extractTziakchaRoundWinInfos(session).map((round) => {
    round.winners.forEach((winner) => {
      if (playerMetrics && playerMetrics[winner.playerIndex]) {
        playerMetrics[winner.playerIndex].winRounds.push({
          roundNo: round.roundNo,
          totalFan: winner.totalFan,
          fanItems: winner.fanItems,
        });
      }
    });

    return {
      roundNo: round.roundNo,
      winners: round.winners.map((winner) => ({
        playerName: winner.playerName,
        totalFan: winner.totalFan,
        fanItems: winner.fanItems,
      })),
      discarderNames: round.discarders.map((discarder) => discarder.playerName),
      selfDraw: round.selfDraw,
    };
  });
}

export async function computeMetrics(
  sessionId: string,
): Promise<MetricsResult> {
  const prepared = await prepareSessionData(sessionId);
  const { sessionPlayerNames, steps, isFinished } = prepared;
  if (!isFinished) {
    throw new Error(SESSION_NOT_FINISHED_ERROR);
  }
  const playerMetrics = sessionPlayerNames.map<PlayerMetric>((playerName) => ({
    playerName,
    matched: 0,
    total: 0,
    ratio: 0,
    chagaSum: 0,
    chagaCount: 0,
    chagaAvg: 0,
    winRounds: [],
  }));
  const rounds = computeRoundOutcomes(sessionPlayerNames, steps, playerMetrics);

  const aiResponses = await Promise.all(
    [0, 1, 2, 3].map((seat) => fetchAiResponse(sessionId, seat)),
  );

  steps.forEach((stepData, roundNo) => {
    const seatToPlayerOrder = getSeatToPlayerOrder(roundNo);
    const aiToRoundSeat = [0, 1, 2, 3].map((playerOrder) =>
      seatToPlayerOrder.findIndex(
        (seatPlayerOrder) => seatPlayerOrder === playerOrder,
      ),
    );
    const allChoices = extractChoices(stepData);

    for (let aiSeat = 0; aiSeat < 4; aiSeat += 1) {
      const stepSeat = aiToRoundSeat[aiSeat];
      if (stepSeat < 0) {
        continue;
      }
      const responseMap = buildResponseMap(aiResponses[aiSeat] || [], roundNo);
      const seatChoices = allChoices.filter(
        (choice) => choice.seat === stepSeat,
      );
      seatChoices.forEach((choice) => {
        const ri = choice.actionIndex + FIXED_RI_OFFSET;
        const row = responseMap.get(ri);
        const matched = choiceMatchesAi(choice, row);
        const chagaScore = calcChagaScore(choice, row);
        const metric = playerMetrics[aiSeat];
        metric.total += 1;
        if (matched) {
          metric.matched += 1;
        }
        metric.chagaSum += chagaScore;
        metric.chagaCount += 1;
      });
    }
  });

  playerMetrics.forEach((metric) => {
    metric.ratio = metric.total ? metric.matched / metric.total : 0;
    metric.chagaAvg = metric.chagaCount
      ? metric.chagaSum / metric.chagaCount
      : 0;
  });

  const overallMatched = playerMetrics.reduce(
    (sum, item) => sum + item.matched,
    0,
  );
  const overallTotal = playerMetrics.reduce((sum, item) => sum + item.total, 0);
  const overallChagaSum = playerMetrics.reduce(
    (sum, item) => sum + item.chagaSum,
    0,
  );
  const overallChagaCount = playerMetrics.reduce(
    (sum, item) => sum + item.chagaCount,
    0,
  );

  return {
    players: playerMetrics,
    rounds,
    overall: {
      matched: overallMatched,
      total: overallTotal,
      ratio: overallTotal ? overallMatched / overallTotal : 0,
      chagaAvg: overallChagaCount ? overallChagaSum / overallChagaCount : 0,
    },
  };
}
