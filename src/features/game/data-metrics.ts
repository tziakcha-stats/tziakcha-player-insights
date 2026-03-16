import { fetchSessionData } from "../../shared/session-data";
import { ReviewResponseItem } from "../record/reviewer/types";
import { calcChagaScore, choiceMatchesAi } from "./chaga-score";
import { fetchAiResponse } from "./chaga-data";
import { parseWinFanItems } from "./win-info";
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
  if (!sessionData.isFinished) {
    throw new Error(SESSION_NOT_FINISHED_ERROR);
  }

  const sessionPlayerNames = sessionData.players.map(
    (player, index) => player.name || `Seat ${index}`,
  );
  const steps = await Promise.all(
    sessionData.records.map((record) => fetchStepData(record.id)),
  );

  return { sessionPlayerNames, steps };
}

export function computeRoundOutcomes(
  sessionPlayerNames: string[],
  steps: StepData[],
  playerMetrics?: PlayerMetric[],
): RoundOutcome[] {
  const rounds: RoundOutcome[] = [];

  steps.forEach((stepData, roundNo) => {
    const seatToPlayerOrder = getSeatToPlayerOrder(roundNo);
    const resultBits = typeof stepData.b === "number" ? stepData.b : 0;
    const winnerMask = resultBits & 0x0f;
    const discarderMask = (resultBits >> 4) & 0x0f;
    if (!winnerMask) {
      return;
    }

    const winnerDetails: RoundOutcome["winners"] = [];
    for (let stepSeat = 0; stepSeat < 4; stepSeat += 1) {
      if (((winnerMask >> stepSeat) & 1) === 0) {
        continue;
      }

      const aiSeat = seatToPlayerOrder[stepSeat] ?? -1;
      if (aiSeat < 0) {
        continue;
      }

      const seatY = Array.isArray(stepData.y) ? stepData.y[stepSeat] : null;
      const fanItems = parseWinFanItems(seatY?.t);
      const totalFan =
        typeof seatY?.f === "number"
          ? seatY.f
          : fanItems.reduce((sum, item) => sum + item.totalFan, 0);

      if (playerMetrics && playerMetrics[aiSeat]) {
        playerMetrics[aiSeat].winRounds.push({
          roundNo: roundNo + 1,
          totalFan,
          fanItems,
        });
      }

      winnerDetails.push({
        playerName: sessionPlayerNames[aiSeat] || `Seat ${aiSeat}`,
        totalFan,
        fanItems,
      });
    }

    const discarderNames: string[] = [];
    for (let stepSeat = 0; stepSeat < 4; stepSeat += 1) {
      if (((discarderMask >> stepSeat) & 1) === 0) {
        continue;
      }

      const aiSeat = seatToPlayerOrder[stepSeat] ?? -1;
      if (aiSeat < 0) {
        continue;
      }
      discarderNames.push(sessionPlayerNames[aiSeat] || `Seat ${aiSeat}`);
    }

    rounds.push({
      roundNo: roundNo + 1,
      winners: winnerDetails,
      discarderNames,
      selfDraw:
        discarderNames.length === 0 ||
        discarderNames.every((name) =>
          winnerDetails.some((winner) => winner.playerName === name),
        ),
    });
  });

  return rounds;
}

export async function computeMetrics(
  sessionId: string,
): Promise<MetricsResult> {
  const prepared = await prepareSessionData(sessionId);
  const { sessionPlayerNames, steps } = prepared;
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
