import { w } from "../../shared/env";

export type StepPlayer = {
  n?: string;
  i?: string;
};

export type StepData = {
  p?: StepPlayer[];
  a?: Array<[number, number]>;
  b?: number;
  y?: Array<{
    f?: number;
    t?: Record<string, number>;
  }>;
};

/**
 * base64 字符串转 Uint8Array
 */
function base64ToBytes(input: string): Uint8Array {
  const binary = atob(input);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

/**
 * 解压 zlib+base64 编码的字符串
 */
export async function decompressZlibBase64(input: string): Promise<string> {
  const streamCtor = (
    w as Window & {
      DecompressionStream?: new (
        format: string,
      ) => TransformStream<Uint8Array, Uint8Array>;
    }
  ).DecompressionStream;
  if (!streamCtor) {
    throw new Error("当前浏览器不支持 DecompressionStream");
  }
  const bytes = base64ToBytes(input);
  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  const source = new Blob([buffer]).stream();
  const decompressed = source.pipeThrough(new streamCtor("deflate"));
  return await new Response(decompressed).text();
}

/**
 * 读取单局牌谱数据
 */
export async function fetchStepData(recordId: string): Promise<StepData> {
  const response = await fetch("/_qry/record/", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: new URLSearchParams({ id: recordId }).toString(),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for /_qry/record/`);
  }
  const raw = await response.json();
  if (!raw.script) {
    throw new Error(`record ${recordId} 缺少 script`);
  }
  const jsonText = await decompressZlibBase64(raw.script);
  return JSON.parse(jsonText) as StepData;
}
