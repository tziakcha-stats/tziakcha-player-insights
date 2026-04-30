export function parseTziakchaSessionId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  if (!trimmed.includes("?") && !trimmed.includes("/")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed, "https://tziakcha.net");
    return url.searchParams.get("id");
  } catch {
    return trimmed;
  }
}
