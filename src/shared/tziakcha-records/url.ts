import fetcherUrl from "tziakcha-fetcher/url";

export function parseTziakchaSessionId(input: string): string | null {
  const parsed = fetcherUrl.parseTziakchaSessionId(input);
  if (!parsed) {
    return null;
  }

  const trimmed = input.trim();
  if ((trimmed.includes("?") || trimmed.includes("/")) && parsed === trimmed) {
    try {
      const url = new URL(trimmed, "https://tziakcha.net");
      return url.searchParams.get("id");
    } catch {
      return null;
    }
  }

  return parsed;
}
