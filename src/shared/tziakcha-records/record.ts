import fetcherRecord from "tziakcha-fetcher/record";
import { TziakchaRecordsOptions, TziakchaStepData } from "./types";

export const decompressZlibBase64 = fetcherRecord.decompress;

function normalizeOptions(
  options?: TziakchaRecordsOptions,
): TziakchaRecordsOptions | undefined {
  if (!options?.fetch || options.baseUrl) {
    return options;
  }

  return {
    ...options,
    fetch: (input, init) => {
      const normalizedInput =
        typeof input === "string" && input.startsWith("https://tziakcha.net/")
          ? input.slice("https://tziakcha.net".length)
          : input;
      return options.fetch!(normalizedInput as string, init);
    },
  };
}

export async function fetchTziakchaRecordStep(
  recordId: string,
  options?: TziakchaRecordsOptions,
): Promise<TziakchaStepData> {
  return (await fetcherRecord.fetchStep(
    recordId,
    normalizeOptions(options),
  )) as TziakchaStepData;
}
