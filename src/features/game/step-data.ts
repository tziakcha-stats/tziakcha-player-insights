import {
  decompressZlibBase64,
  fetchTziakchaRecordStep,
  TziakchaStepData,
  TziakchaStepPlayer,
} from "../../shared/tziakcha-records";

export type StepPlayer = TziakchaStepPlayer;
export type StepData = TziakchaStepData;

export { decompressZlibBase64 };

/**
 * 读取单局牌谱数据
 */
export async function fetchStepData(recordId: string): Promise<StepData> {
  return fetchTziakchaRecordStep(recordId);
}
