/**
 * Scrape a single URL and return its content.
 *
 * @param {string} url The URL to scrape.
 * @param {string} format Output format: "markdown" (default), "text", or "raw".
 * @return {string} The scraped content.
 * @customfunction
 */
function SPIDER_SCRAPE(url: string, format?: string): string {
  if (!url) return "Error: URL is required.";
  format = format || "markdown";

  const returnFormat = format === "text" || format === "raw" ? format : "markdown";

  const res = spiderPostCached("/scrape", {
    url,
    return_format: returnFormat,
  });

  if (res.status !== 200) return formatError(res.status, res.body);

  try {
    const data = JSON.parse(res.body);
    const content = Array.isArray(data) ? data[0]?.content : data?.content;
    if (!content) return "No content returned.";
    return format === "text" ? markdownToText(content) : content;
  } catch {
    return `Error: Could not parse response.`;
  }
}

/**
 * Extract structured data from a URL using AI.
 * Requires an AI Studio subscription (https://spider.cloud/credits/new).
 *
 * @param {string} url The URL to extract from.
 * @param {string} prompt What to extract (e.g., "Extract the page title and description").
 * @return {string} The extracted content.
 * @customfunction
 */
function SPIDER_EXTRACT(url: string, prompt: string): string {
  if (!url) return "Error: URL is required.";
  if (!prompt) return "Error: Prompt is required.";

  const res = spiderPostCached("/ai/scrape", {
    url,
    prompt,
    return_format: "markdown",
  });

  if (res.status !== 200) return formatError(res.status, res.body);

  try {
    const data = JSON.parse(res.body);
    const content = Array.isArray(data) ? data[0]?.content : data?.content;
    return content || "No extraction result.";
  } catch {
    return "Error: Could not parse response.";
  }
}

/**
 * Search the web and return results.
 *
 * @param {string} query The search query.
 * @param {number} num Number of results to return (default 5, max 100).
 * @return {string[][]} Search results as rows: [title, url, description].
 * @customfunction
 */
function SPIDER_SEARCH(query: string, num?: number): string[][] {
  if (!query) return [["Error: Query is required."]];
  num = Math.min(Math.max(num || 5, 1), 100);

  const res = spiderPostCached("/search", {
    search: query,
    search_limit: num,
    fetch_page_content: false,
  });

  if (res.status !== 200) return [[formatError(res.status, res.body)]];

  try {
    const data = JSON.parse(res.body);
    const results: string[][] = [["Title", "URL", "Description"]];
    const items = Array.isArray(data) ? data : [data];

    for (const item of items) {
      results.push([
        item.title || "",
        item.url || "",
        item.description || "",
      ]);
    }

    return results.length > 1 ? results : [["No results found."]];
  } catch {
    return [["Error: Could not parse response."]];
  }
}

/**
 * Extract all links from a page.
 *
 * @param {string} url The URL to extract links from.
 * @return {string[][]} List of links as a vertical array.
 * @customfunction
 */
function SPIDER_LINKS(url: string): string[][] {
  if (!url) return [["Error: URL is required."]];

  const res = spiderPostCached("/links", { url });

  if (res.status !== 200) return [[formatError(res.status, res.body)]];

  try {
    const data = JSON.parse(res.body);
    const links: string[] = Array.isArray(data) ? data[0]?.links || [] : data?.links || [];
    if (!links.length) return [["No links found."]];
    return links.map((link: string) => [link]);
  } catch {
    return [["Error: Could not parse response."]];
  }
}

/**
 * Take a screenshot of a URL and return an image link.
 *
 * @param {string} url The URL to screenshot.
 * @return {string} A URL to the screenshot image.
 * @customfunction
 */
function SPIDER_SCREENSHOT(url: string): string {
  if (!url) return "Error: URL is required.";

  const res = spiderPost("/screenshot", { url });

  if (res.status !== 200) return formatError(res.status, res.body);

  try {
    const data = JSON.parse(res.body);
    const screenshotUrl = Array.isArray(data)
      ? data[0]?.screenshot_url || data[0]?.url
      : data?.screenshot_url || data?.url;
    return screenshotUrl || "No screenshot returned.";
  } catch {
    return "Error: Could not parse response.";
  }
}

/**
 * Show your current Spider credit balance.
 *
 * @return {number} The number of credits remaining.
 * @customfunction
 */
function SPIDER_CREDITS(): number | string {
  const res = spiderGet("/data/credits");

  if (res.status !== 200) return formatError(res.status, res.body);

  try {
    const data = JSON.parse(res.body);
    const credits = data?.data?.credits ?? data?.credits;
    if (credits !== undefined && credits !== null) {
      const num = parseFloat(credits);
      return isNaN(num) ? credits : Math.round(num);
    }
    return "Unknown";
  } catch {
    return "Error: Could not parse response.";
  }
}
