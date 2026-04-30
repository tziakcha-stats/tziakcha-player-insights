import { w } from "../env";
import { TziakchaRecordsOptions, TziakchaStepData } from "./types";

function getFetch(options?: TziakchaRecordsOptions): typeof fetch {
  return options?.fetch ?? fetch;
}

function buildUrl(path: string, options?: TziakchaRecordsOptions): string {
  return options?.baseUrl ? new URL(path, options.baseUrl).toString() : path;
}

function base64ToBytes(input: string): Uint8Array {
  const binary = atob(input);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

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

export async function fetchTziakchaRecordStep(
  recordId: string,
  options?: TziakchaRecordsOptions,
): Promise<TziakchaStepData> {
  const response = await getFetch(options)(buildUrl("/_qry/record/", options), {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: new URLSearchParams({ id: recordId }).toString(),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for /_qry/record/`);
  }

  const raw = (await response.json()) as { script?: unknown };
  if (typeof raw.script !== "string" || !raw.script) {
    throw new Error(`record ${recordId} 缺少 script`);
  }

  const decode = options?.decompressZlibBase64 ?? decompressZlibBase64;
  const jsonText = await decode(raw.script);
  return JSON.parse(jsonText) as TziakchaStepData;
}
