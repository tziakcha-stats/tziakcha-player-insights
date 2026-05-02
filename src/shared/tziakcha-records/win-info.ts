import fetcherWin from "tziakcha-fetcher/record/win";
import {
  TziakchaRoundWinInfo,
  TziakchaSessionRounds,
  TziakchaWinFanItem,
} from "./types";

export const FAN_NAMES: readonly string[] = fetcherWin.FAN_NAMES;

export const TZIACKHA_SEAT_TO_PLAYER_ORDER: ReadonlyArray<
  ReadonlyArray<number>
> = fetcherWin.SEAT_PLAYER_ORDERS;

export function parseTziakchaWinFanItems(rawT: unknown): TziakchaWinFanItem[] {
  return fetcherWin.parseTziakchaWinFanItems(rawT) as TziakchaWinFanItem[];
}

export function extractTziakchaRoundWinInfos(
  session: TziakchaSessionRounds,
): TziakchaRoundWinInfo[] {
  return fetcherWin.extractTziakchaRoundWinInfos(
    session,
  ) as TziakchaRoundWinInfo[];
}
