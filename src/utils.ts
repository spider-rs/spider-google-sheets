/**
 * Convert an array of JSON objects to a 2D array suitable for sheet output.
 * First row is headers (keys from the first object).
 */
function jsonToRows(data: Record<string, unknown>[]): unknown[][] {
  if (!data.length) return [["No results"]];
  const headers = Object.keys(data[0]);
  const rows: unknown[][] = [headers];
  for (const item of data) {
    rows.push(headers.map((h) => {
      const val = item[h];
      if (val === null || val === undefined) return "";
      if (typeof val === "object") return JSON.stringify(val);
      return val;
    }));
  }
  return rows;
}

/**
 * Strip markdown formatting to plain text.
 */
function markdownToText(md: string): string {
  return md
    .replace(/!\[.*?\]\(.*?\)/g, "")       // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")  // links → text
    .replace(/#{1,6}\s+/g, "")              // headings
    .replace(/[*_]{1,3}(.+?)[*_]{1,3}/g, "$1") // bold/italic
    .replace(/`{1,3}[^`]*`{1,3}/g, (m) => m.replace(/`/g, "")) // code
    .replace(/^\s*[-*+]\s+/gm, "• ")        // list items
    .replace(/^\s*>\s+/gm, "")              // blockquotes
    .replace(/\n{3,}/g, "\n\n")             // collapse whitespace
    .trim();
}

/**
 * Format an API error into a user-friendly string for cell output.
 */
function formatError(status: number, body: string): string {
  switch (status) {
    case 401: return "Error: Invalid API key. Update it in Spider → Settings.";
    case 402: return "Error: No credits remaining. Top up at spider.cloud.";
    case 429: return "Error: Rate limited. Wait a moment and retry.";
    default: {
      try {
        const parsed = JSON.parse(body);
        return `Error (${status}): ${parsed.error || parsed.message || body}`;
      } catch {
        return `Error (${status}): ${body.substring(0, 200)}`;
      }
    }
  }
}

/**
 * Generate a cache key for a request.
 */
function cacheKey(endpoint: string, params: Record<string, unknown>): string {
  return `spider_${endpoint}_${JSON.stringify(params)}`.substring(0, 250);
}

/**
 * Sleep for the given milliseconds using Utilities.sleep.
 */
function sleepMs(ms: number): void {
  Utilities.sleep(ms);
}
